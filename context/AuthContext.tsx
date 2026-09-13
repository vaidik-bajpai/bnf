// context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useRef, useMemo, useEffect } from 'react';
import { SessionProvider, useSession, signIn, signOut } from 'next-auth/react';

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    username: string;
    image?: string | null;
    initials: string;
    bg: string;
}

interface AuthContextType {
    user: AuthUser | null;
    status: "loading" | "authenticated" | "unauthenticated";
    isLoading: boolean;
    loginWithGoogle: () => void;
    logout: () => void;
    requireAuth: (action: () => void) => void;
    isAuthModalOpen: boolean;
    closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthStateBridge({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const pendingActionRef = useRef<(() => void) | null>(null);

    const user: AuthUser | null = useMemo(() => {
        const googleUser = session?.user;
        if (!googleUser) return null;
        const userExt = googleUser as (typeof googleUser & { username?: string; initials?: string; bg?: string });
        return {
            id: googleUser.id as string,
            name: googleUser.name || "Forum Member",
            email: googleUser.email || "",
            username: userExt?.username || (googleUser.email?.split("@")[0] || "member"),
            image: googleUser.image,
            initials: userExt?.initials || "U",
            bg: userExt?.bg || "#B85428",
        };
    }, [session?.user]);

    useEffect(() => {
        if (user && pendingActionRef.current) {
            const action = pendingActionRef.current;
            pendingActionRef.current = null;
            action();
        }
    }, [user]);

    const loginWithGoogle = async () => {
        await signIn("google");
    };

    const logout = () => {
        signOut();
    };

    const requireAuth = (action: () => void) => {
        if (user) {
            action();
        } else {
            pendingActionRef.current = action;
            setIsAuthModalOpen(true);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                status,
                isLoading: status === "loading",
                loginWithGoogle,
                logout,
                requireAuth,
                isAuthModalOpen,
                closeAuthModal: () => {
                    setIsAuthModalOpen(false);
                    pendingActionRef.current = null;
                },
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <AuthStateBridge>{children}</AuthStateBridge>
        </SessionProvider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};