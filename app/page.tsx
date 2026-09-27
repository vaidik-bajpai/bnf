'use client';

import { useState, useEffect } from "react";
import type { PageState } from "@/types/forum";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import ForumNavbar from "@/components/forum/ForumNavbar";
import Footer from "@/components/Footer";
import NewDiscussionModal from "@/components/modals/NewDiscussionModal";
import AuthModal from "@/components/modals/AuthModal";
import SearchModal from "@/components/modals/SearchModal";
import ActivityModal from "@/components/modals/ActivityModal";
import HowToUseModal from "@/components/modals/HowToUseModal";
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
        case "how-to-use":
        case "profile":
        case "activity":
        case "favorites":
        case "starred":
            return "/forum";
        default:
            return "/";
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

    // History stack management for forum Back and Forward buttons
    const [historyStack, setHistoryStack] = useState<PageState[]>([pageState]);
    const [historyIndex, setHistoryIndex] = useState<number>(0);

    // Modal states
    const [showNewDiscussion, setShowNewDiscussion] = useState(false);
    const [targetMegaThreadId, setTargetMegaThreadId] = useState<string | undefined>(undefined);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [showActivityModal, setShowActivityModal] = useState(false);
    const [activityTab, setActivityTab] = useState<"activity" | "favorites" | "starred" | "bookmarks">("activity");
    const [showHowToUseModal, setShowHowToUseModal] = useState(false);
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

        if (pushHistory) {
            setHistoryStack((prev) => [...prev.slice(0, historyIndex + 1), state]);
            setHistoryIndex((prev) => prev + 1);

            if (typeof window !== "undefined") {
                const newPath = pageStateToPath(state);
                if (window.location.pathname !== newPath) {
                    window.history.pushState(null, "", newPath);
                }
            }
        }
    };

    const handleGoBack = () => {
        if (historyIndex > 0) {
            const prevIdx = historyIndex - 1;
            const prevState = historyStack[prevIdx];
            setHistoryIndex(prevIdx);
            setPageState(prevState);
            window.scrollTo({ top: 0 });
            if (typeof window !== "undefined") {
                const newPath = pageStateToPath(prevState);
                window.history.pushState(null, "", newPath);
            }
        } else if (pageState.view !== "forum" && pageState.view !== "home") {
            navigateTo({ view: "forum" });
        } else if (pageState.view === "forum") {
            navigateTo({ view: "home" });
        }
    };

    const handleGoForward = () => {
        if (historyIndex < historyStack.length - 1) {
            const nextIdx = historyIndex + 1;
            const nextState = historyStack[nextIdx];
            setHistoryIndex(nextIdx);
            setPageState(nextState);
            window.scrollTo({ top: 0 });
            if (typeof window !== "undefined") {
                const newPath = pageStateToPath(nextState);
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

    const handleOpenActivity = (tab?: "activity" | "favorites" | "starred" | "bookmarks") => {
        if (tab) setActivityTab(tab);
        setShowActivityModal(true);
    };

    return (
        <div className="min-h-screen bg-[#FAFAF7]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {/* Header: original Navbar for Home, ForumNavbar for Forum */}
            {pageState.view === "home" ? (
                <Navbar
                    pageState={pageState}
                    onNavigate={navigateTo}
                    onScrollToSection={(id) => {
                        if (pageState.view !== "home") navigateTo({ view: "home" });
                        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 100);
                    }}
                    onOpenNewDiscussion={() => handleOpenDiscussion()}
                />
            ) : (
                <ForumNavbar
                    onNavigate={navigateTo}
                    canGoBack={historyIndex > 0 || pageState.view !== "forum"}
                    canGoForward={historyIndex < historyStack.length - 1}
                    onGoBack={handleGoBack}
                    onGoForward={handleGoForward}
                    onOpenSearch={() => setShowSearchModal(true)}
                    onOpenHowToUse={() => setShowHowToUseModal(true)}
                    onOpenActivity={handleOpenActivity}
                    onOpenNewDiscussion={() => handleOpenDiscussion()}
                />
            )}

            {/* Landing Page Content */}
            {pageState.view === "home" && (
                <>
                    <HomeContent
                        onViewForum={(cat, mega) => {
                            if (cat || mega) {
                                navigateTo({ view: "forum", category: cat, megaCategory: mega });
                            } else {
                                navigateTo({ view: "forum" });
                            }
                        }}
                        onViewThread={(id) => navigateTo({ view: "discussion", id })}
                        onViewMegaThread={(id) => navigateTo({ view: "megathread", id })}
                        onNewDiscussion={() => handleOpenDiscussion()}
                    />
                    <Footer />
                </>
            )}

            {/* Forum Home Stream & Mega Categories */}
            {(pageState.view === "forum" || pageState.view === "megathreads") && (
                <ForumHome
                    key={`${refreshKey}-${pageState.view === "forum" ? pageState.category || "" : ""}-${pageState.view === "forum" ? pageState.megaCategory || "" : ""}`}
                    initialCategory={pageState.view === "forum" ? pageState.category : undefined}
                    initialMegaCategory={pageState.view === "forum" ? pageState.megaCategory : undefined}
                    initialTag={pageState.view === "forum" ? pageState.tag : undefined}
                    onViewThread={(id) => navigateTo({ view: "discussion", id })}
                    onViewMegaThread={(id) => navigateTo({ view: "megathread", id })}
                    onNewDiscussion={() => handleOpenDiscussion()}
                    onOpenHowToUse={() => setShowHowToUseModal(true)}
                />
            )}

            {/* Individual MegaThread View */}
            {pageState.view === "megathread" && (
                <MegaThreadPage
                    megaThreadId={pageState.id}
                    onBack={handleGoBack}
                    onViewDiscussion={(id) => navigateTo({ view: "discussion", id })}
                    onNewDiscussion={(mtId) => handleOpenDiscussion(mtId)}
                    onViewMegaThread={(id) => navigateTo({ view: "megathread", id })}
                />
            )}

            {/* Discussion / Thread Detail View */}
            {(pageState.view === "discussion" || pageState.view === "thread") && (
                <ThreadView
                    threadId={pageState.id}
                    onBack={handleGoBack}
                    onViewMegaThread={(id) => navigateTo({ view: "megathread", id })}
                />
            )}

            {/* Modals */}
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

            <SearchModal
                isOpen={showSearchModal}
                onClose={() => setShowSearchModal(false)}
                onSelectThread={(id) => {
                    setShowSearchModal(false);
                    navigateTo({ view: "discussion", id });
                }}
                onSelectCategory={() => {
                    setShowSearchModal(false);
                    navigateTo({ view: "forum" });
                }}
            />

            <ActivityModal
                isOpen={showActivityModal}
                initialTab={activityTab}
                onClose={() => setShowActivityModal(false)}
                onSelectThread={(id) => {
                    setShowActivityModal(false);
                    navigateTo({ view: "discussion", id });
                }}
                onSelectCategory={() => {
                    setShowActivityModal(false);
                    navigateTo({ view: "forum" });
                }}
            />

            <HowToUseModal
                isOpen={showHowToUseModal}
                onClose={() => setShowHowToUseModal(false)}
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