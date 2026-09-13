'use client';

import { useState, useEffect } from "react";
import type { PageState } from "@/types/forum";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewDiscussionModal from "@/components/modals/NewDiscussionModal";
import AuthModal from "@/components/modals/AuthModal";
import HomeContent from "@/components/home/HomeContent";
import ForumHome from "@/components/forum/ForumHome";
import MegaThreadPage from "@/components/forum/MegaThreadPage";
import ThreadView from "@/components/forum/ThreadView";

function parsePathToPageState(path: string): PageState {
    if (path.startsWith("/forum/discussions/")) {
        const id = path.replace("/forum/discussions/", "").split("/")[0];
        if (id) return { view: "discussion", id };
    }
    if (path.startsWith("/forum/thread/")) {
        const id = path.replace("/forum/thread/", "").split("/")[0];
        if (id) return { view: "discussion", id };
    }
    if (path.startsWith("/forum/megathreads/")) {
        const id = path.replace("/forum/megathreads/", "").split("/")[0];
        if (id) return { view: "megathread", id };
    }
    if (path === "/forum/megathreads") {
        return { view: "megathreads" };
    }
    if (path === "/forum") {
        return { view: "forum" };
    }
    return { view: "home" };
}

function pageStateToPath(state: PageState): string {
    switch (state.view) {
        case "home":
            return "/";
        case "forum":
            return "/forum";
        case "megathreads":
            return "/forum/megathreads";
        case "megathread":
            return `/forum/megathreads/${state.id}`;
        case "discussion":
        case "thread":
            return `/forum/discussions/${state.id}`;
    }
}

// 1. Inner component where useAuth is safe to call
function ForumApp() {
    const { user, requireAuth } = useAuth();
    const [pageState, setPageState] = useState<PageState>(() => {
        if (typeof window !== "undefined") {
            return parsePathToPageState(window.location.pathname);
        }
        return { view: "home" };
    });
    const [showNewDiscussion, setShowNewDiscussion] = useState(false);
    const [targetMegaThreadId, setTargetMegaThreadId] = useState<string | undefined>(undefined);
    const [refreshKey, setRefreshKey] = useState(0);

    // Handle browser Back/Forward navigation
    useEffect(() => {
        const handlePopState = () => {
            const state = parsePathToPageState(window.location.pathname);
            setPageState(state);
        };

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

    const navigateTo = (state: PageState, pushHistory = true) => {
        setPageState(state);
        window.scrollTo({ top: 0 });

        if (pushHistory && typeof window !== "undefined") {
            const newPath = pageStateToPath(state);
            if (window.location.pathname !== newPath) {
                window.history.pushState(null, "", newPath);
            }
        }
    };

    const handleOpenDiscussion = (megaThreadId?: string) => {
        setTargetMegaThreadId(megaThreadId);
        if (!user) {
            requireAuth(() => setShowNewDiscussion(true));
        } else {
            setShowNewDiscussion(true);
        }
    };

    // Determine active page state (authenticated users never see the landing page)
    const activePageState: PageState =
        user && pageState.view === "home" ? { view: "forum" } : pageState;

    // Sync browser URL when authenticated user is on root path
    useEffect(() => {
        if (user && pageState.view === "home" && typeof window !== "undefined") {
            if (window.location.pathname === "/") {
                window.history.replaceState(null, "", "/forum");
            }
        }
    }, [user, pageState.view]);

    return (
        <div className="min-h-screen bg-[#FAFAF7]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <Navbar
                pageState={activePageState}
                onNavigate={navigateTo}
                onScrollToSection={(id) => {
                    if (activePageState.view !== "home") navigateTo({ view: "home" });
                    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 100);
                }}
                onOpenNewDiscussion={() => handleOpenDiscussion()}
            />

            {activePageState.view === "home" && (
                <HomeContent
                    onViewForum={() => navigateTo({ view: "forum" })}
                    onViewThread={(id) => navigateTo({ view: "discussion", id })}
                    onNewDiscussion={() => handleOpenDiscussion()}
                />
            )}

            {(activePageState.view === "forum" || activePageState.view === "megathreads") && (
                <ForumHome
                    key={refreshKey}
                    onViewThread={(id) => navigateTo({ view: "discussion", id })}
                    onViewMegaThread={(id) => navigateTo({ view: "megathread", id })}
                    onNewDiscussion={() => handleOpenDiscussion()}
                />
            )}

            {activePageState.view === "megathread" && (
                <MegaThreadPage
                    megaThreadId={activePageState.id}
                    onBack={() => navigateTo({ view: "forum" })}
                    onViewDiscussion={(id) => navigateTo({ view: "discussion", id })}
                    onNewDiscussion={(mtId) => handleOpenDiscussion(mtId)}
                    onViewMegaThread={(id) => navigateTo({ view: "megathread", id })}
                />
            )}

            {(activePageState.view === "discussion" || activePageState.view === "thread") && (
                <ThreadView
                    threadId={activePageState.id}
                    onBack={() => navigateTo({ view: "forum" })}
                    onViewMegaThread={(id) => navigateTo({ view: "megathread", id })}
                />
            )}

            <Footer />

            <NewDiscussionModal
                isOpen={showNewDiscussion}
                defaultMegaThreadId={targetMegaThreadId}
                onClose={() => {
                    setShowNewDiscussion(false);
                    setTargetMegaThreadId(undefined);
                }}
                onCreated={(newId) => {
                    setRefreshKey((k) => k + 1);
                    if (newId) {
                        navigateTo({ view: "discussion", id: newId });
                    } else {
                        navigateTo({ view: "forum" });
                    }
                }}
            />

            <AuthModal />
        </div>
    );
}

// 2. Outer Root Export that mounts AuthProvider
export default function Page() {
    return (
        <AuthProvider>
            <ForumApp />
        </AuthProvider>
    );
}