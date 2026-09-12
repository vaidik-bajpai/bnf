'use client';

import { useState } from "react";
import type { PageState } from "@/types/forum";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewDiscussionModal from "@/components/modals/NewDiscussionModal";
import AuthModal from "@/components/modals/AuthModal";
import HomeContent from "@/components/home/HomeContent";
import ForumHome from "@/components/forum/ForumHome";
import ThreadView from "@/components/forum/ThreadView";

// 1. Inner component where useAuth is safe to call
function ForumApp() {
  const { user, requireAuth } = useAuth(); // Safe here because it's inside <AuthProvider>
  const [pageState, setPageState] = useState<PageState>({ view: "home" });
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const navigateTo = (state: PageState) => {
    setPageState(state);
    window.scrollTo({ top: 0 });
  };

  const handleOpenDiscussion = () => {
    if (!user) {
      requireAuth(() => setShowNewDiscussion(true));
    } else {
      setShowNewDiscussion(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar
        pageState={pageState}
        onNavigate={navigateTo}
        onScrollToSection={(id) => {
          if (pageState.view !== "home") setPageState({ view: "home" });
          setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 100);
        }}
        onOpenNewDiscussion={handleOpenDiscussion}
      />

      {pageState.view === "home" && (
        <HomeContent
          onViewForum={() => navigateTo({ view: "forum" })}
          onViewThread={(id) => navigateTo({ view: "thread", id })}
          onNewDiscussion={handleOpenDiscussion}
        />
      )}

      {pageState.view === "forum" && (
        <ForumHome
          key={refreshKey}
          onViewThread={(id) => navigateTo({ view: "thread", id })}
          onNewDiscussion={handleOpenDiscussion}
        />
      )}

      {pageState.view === "thread" && (
        <ThreadView
          threadId={pageState.id}
          onBack={() => navigateTo({ view: "forum" })}
        />
      )}

      <Footer />

      <NewDiscussionModal
        isOpen={showNewDiscussion}
        onClose={() => setShowNewDiscussion(false)}
        onCreated={() => {
          setRefreshKey((k) => k + 1);
          navigateTo({ view: "forum" });
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