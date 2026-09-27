import { AshokaCakra, LotusSmall, TricolorStripe } from "../Symbols";
import HomeHero from "./HomeHero";
import AwakeningSection from "./AwakeningSection";
import HomeForumSection from "./HomeForumSection";
import IdeasSection from "./IdeasSection";
import LeadersSection from "./LeadersSection";
import KnowledgeSection from "./KnowledgeSection";

interface HomeContentProps {
    onViewForum: (category?: string, megaCategory?: string) => void;
    onViewThread: (id: string) => void;
    onNewDiscussion: () => void;
    onViewMegaThread?: (id: string) => void;
}

export default function HomeContent({
    onViewForum,
    onViewThread,
    onNewDiscussion,
    onViewMegaThread,
}: HomeContentProps) {
    return (
        <>
            <HomeHero onViewForum={onViewForum} />
            <TricolorStripe />
            <AwakeningSection />
            <TricolorStripe />
            <HomeForumSection
                onViewForum={onViewForum}
                onViewThread={onViewThread}
                onNewDiscussion={onNewDiscussion}
                onViewMegaThread={onViewMegaThread}
            />
            <TricolorStripe />
            <IdeasSection />
            <TricolorStripe />
            <LeadersSection />
            <TricolorStripe />
            <KnowledgeSection />
            <TricolorStripe />

            {/* About / CTA */}
            <section id="about" className="min-h-screen flex flex-col justify-center py-6 sm:py-8 lg:py-10 bg-[#0F1C3F] relative overflow-hidden select-none">
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <LotusSmall className="absolute top-10 right-10 w-56 h-40 text-white opacity-[0.04]" />
                    <LotusSmall className="absolute bottom-10 left-10 w-56 h-40 text-white opacity-[0.04]" />
                    <AshokaCakra className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] text-white opacity-[0.02]" />
                </div>

                <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center my-auto flex flex-col justify-center">
                    <AshokaCakra className="w-12 h-12 sm:w-14 sm:h-14 mx-auto text-[#C8971A] mb-3 sm:mb-4 opacity-80" />
                    <h2
                        className="text-white font-bold mb-3 sm:mb-4"
                        style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
                    >
                        About This Platform
                    </h2>
                    <p className="text-white/70 text-xs sm:text-sm lg:text-base leading-relaxed mb-3 sm:mb-4" style={{ fontFamily: "'Spectral', serif" }}>
                        The BHARAT-GANRAJYA Nationalists Front is a digital platform dedicated to the rigorous, pluralistic, and intellectually honest exploration of India&apos;s civilizational heritage. We believe that history is best understood through dialogue &mdash; across disciplines, perspectives, and generations.
                    </p>
                    <p className="text-white/55 text-xs sm:text-sm leading-relaxed mb-6 sm:mb-7" style={{ fontFamily: "'Spectral', serif" }}>
                        We welcome scholars, students, artists, activists, and curious minds. Our commitment is to depth over sensationalism, nuance over rhetoric, and India&apos;s full and complex story over any partial reading of it.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
                        <button
                            type="button"
                            onClick={() => onViewForum()}
                            className="bg-[#B85428] hover:bg-[#A04820] text-white px-7 py-3 text-xs sm:text-sm font-semibold tracking-wide transition-colors cursor-pointer rounded-md shadow-md"
                        >
                            Explore the Forum
                        </button>
                        <button
                            type="button"
                            onClick={() => document.getElementById("home")?.scrollIntoView({ behavior: "smooth" })}
                            className="border border-white/20 hover:border-[#C8971A] text-white/60 hover:text-[#C8971A] px-7 py-3 text-xs sm:text-sm font-semibold tracking-wide transition-colors cursor-pointer rounded-md"
                        >
                            Back to Top
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
}