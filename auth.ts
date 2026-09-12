// auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            // 'user' is only passed on the initial sign-in
            if (user && user.id) {
                token.id = user.id;

                // Fetch current user details from DB
                let dbUser = await prisma.user.findUnique({
                    where: { id: user.id },
                    select: { username: true, initials: true, bg: true },
                });

                // If newly created or missing a username, generate and persist immediately
                if (!dbUser?.username) {
                    const base = (user.email?.split("@")[0] || "user")
                        .toLowerCase()
                        .replace(/[^a-z0-9_]/g, "");
                    const username = `${base}_${Math.floor(100 + Math.random() * 900)}`;

                    const initials = (user.name || "Member")
                        .split(" ")
                        .filter(Boolean)
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2) || "U";

                    const colors = ["#B85428", "#2D6A4F", "#0F1C3F", "#5C2D8A", "#8B4513"];
                    const bg = colors[Math.abs((user.email || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % colors.length];

                    dbUser = await prisma.user.update({
                        where: { id: user.id },
                        data: { username, initials, bg },
                        select: { username: true, initials: true, bg: true },
                    });
                }

                token.username = dbUser.username;
                token.initials = dbUser.initials;
                token.bg = dbUser.bg;
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user && token) {
                session.user.id = token.id as string;
                (session.user as any).username = token.username || (session.user.email?.split("@")[0] ?? "member");
                (session.user as any).initials = token.initials || "U";
                (session.user as any).bg = token.bg || "#B85428";
            }
            return session;
        },
    },
});