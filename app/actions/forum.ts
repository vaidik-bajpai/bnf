// app/actions/forum.ts
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getDiscussions(params?: {
    categoryId?: string | null;
    search?: string;
    sortBy?: "latest" | "trending" | "pinned";
}) {
    try {
        const { categoryId, search, sortBy = "latest" } = params || {};

        const whereClause: any = {};
        if (categoryId) whereClause.categoryId = categoryId;
        if (search) {
            whereClause.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { excerpt: { contains: search, mode: "insensitive" } },
                { tags: { has: search.toLowerCase() } },
            ];
        }

        let orderBy: any = [{ createdAt: "desc" }];
        if (sortBy === "trending") orderBy = [{ views: "desc" }];
        else if (sortBy === "pinned") orderBy = [{ pinned: "desc" }, { createdAt: "desc" }];

        return await prisma.discussion.findMany({
            where: whereClause,
            orderBy,
            include: {
                author: {
                    select: { id: true, name: true, username: true, initials: true, bg: true, image: true },
                },
                category: true,
                _count: { select: { replies: true } },
            },
        });
    } catch (error) {
        console.error("[getDiscussions error]:", error);
        return [];
    }
}

export async function getThreadById(id: string) {
    try {
        await prisma.discussion.update({
            where: { id },
            data: { views: { increment: 1 } },
        });

        return await prisma.discussion.findUnique({
            where: { id },
            include: {
                author: {
                    select: { id: true, name: true, username: true, initials: true, bg: true, image: true },
                },
                category: true,
                replies: {
                    where: { parentId: null },
                    include: {
                        author: {
                            select: { id: true, name: true, username: true, initials: true, bg: true, image: true },
                        },
                        nested: {
                            include: {
                                author: {
                                    select: { id: true, name: true, username: true, initials: true, bg: true, image: true },
                                },
                            },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                },
            },
        });
    } catch (error) {
        console.error("[getThreadById error]:", error);
        return null;
    }
}

export async function createDiscussion(formData: {
    title: string;
    excerpt?: string;
    body: string;
    categoryId: string;
    tags: string[];
}) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const { title, excerpt, body, categoryId, tags } = formData;

    const discussion = await prisma.discussion.create({
        data: {
            title,
            excerpt: excerpt || (body.length > 160 ? body.slice(0, 160) + "..." : body),
            body,
            categoryId,
            tags: tags.map((t) => t.trim().toLowerCase()),
            authorId: session.user.id,
        },
    });

    await prisma.category.update({
        where: { id: categoryId },
        data: { count: { increment: 1 } },
    });

    revalidatePath("/");
    return discussion;
}

export async function postReply(data: {
    discussionId: string;
    content: string;
    parentId?: string;
}) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const { discussionId, content, parentId } = data;

    const reply = await prisma.reply.create({
        data: {
            content,
            discussionId,
            authorId: session.user.id,
            parentId: parentId || null,
        },
    });

    await prisma.discussion.update({
        where: { id: discussionId },
        data: { lastActivity: new Date() },
    });

    revalidatePath("/");
    return reply;
}

export async function toggleLike(type: "discussion" | "reply", id: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    if (type === "discussion") {
        return await prisma.discussion.update({
            where: { id },
            data: { likes: { increment: 1 } },
        });
    } else {
        return await prisma.reply.update({
            where: { id },
            data: { likes: { increment: 1 } },
        });
    }
}