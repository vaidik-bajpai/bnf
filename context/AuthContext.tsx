// context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState } from 'react';
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
    const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

    const googleUser = session?.user;
    const user: AuthUser | null = googleUser
        ? {
            id: googleUser.id as string,
            name: googleUser.name || "Forum Member",
            email: googleUser.email || "",
            username: (googleUser as any).username || (googleUser.email?.split("@")[0] || "member"),
            image: googleUser.image,
            initials: (googleUser as any).initials || "U",
            bg: (googleUser as any).bg || "#B85428",
        }
        : null;

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
            setPendingAction(() => action);
            setIsAuthModalOpen(true);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loginWithGoogle,
                logout,
                requireAuth,
                isAuthModalOpen,
                closeAuthModal: () => {
                    setIsAuthModalOpen(false);
                    setPendingAction(null);
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