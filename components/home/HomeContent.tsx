import { AshokaCakra, LotusSmall, TricolorStripe } from "../Symbols";
import HomeHero from "./HomeHero";
import HeritageSection from "./HeritageSection";
import IdeasSection from "./IdeasSection";
import LeadersSection from "./LeadersSection";
import KnowledgeSection from "./KnowledgeSection";
import ForumPreviewSection from "./ForumPreviewSection";

interface HomeContentProps {
    onViewForum: () => void;
    onViewThread: (id: string) => void;
    onNewDiscussion: () => void;
}

export default function HomeContent({
    onViewForum,
    onViewThread,
    onNewDiscussion,
}: HomeContentProps) {
    return (
        <>
            <HomeHero onViewForum={onViewForum} />
            <TricolorStripe />
            <HeritageSection />
            <IdeasSection />
            <LeadersSection />
            <KnowledgeSection />
            <ForumPreviewSection
                onViewForum={onViewForum}
                onViewThread={onViewThread}
                onNewDiscussion={onNewDiscussion}
            />

            {/* About / CTA */}
            <section id="about" className="py-24 bg-[#0F1C3F] relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <LotusSmall className="absolute top-10 right-10 w-56 h-40 text-white opacity-[0.04]" />
                    <LotusSmall className="absolute bottom-10 left-10 w-56 h-40 text-white opacity-[0.04]" />
                    <AshokaCakra className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] text-white opacity-[0.02]" />
                </div>

                <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
                    <AshokaCakra className="w-14 h-14 mx-auto text-[#C8971A] mb-6 opacity-80" />
                    <h2
                        className="text-white font-bold mb-5"
                        style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2rem, 4vw, 3rem)" }}
                    >
                        About This Platform
                    </h2>
                    <p className="text-white/60 text-lg leading-relaxed mb-6" style={{ fontFamily: "'Spectral', serif" }}>
                        The Indic Civilizational Forum is a digital platform dedicated to the rigorous, pluralistic, and intellectually honest exploration of India&apos;s civilizational heritage. We believe that history is best understood through dialogue — across disciplines, perspectives, and generations.
                    </p>
                    <p className="text-white/50 text-base leading-relaxed mb-10" style={{ fontFamily: "'Spectral', serif" }}>
                        We welcome scholars, students, artists, activists, and curious minds. Our commitment is to depth over sensationalism, nuance over rhetoric, and India&apos;s full and complex story over any partial reading of it.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={onViewForum}
                            className="bg-[#B85428] hover:bg-[#A04820] text-white px-9 py-4 text-sm font-semibold tracking-wide transition-colors cursor-pointer"
                        >
                            Explore the Forum
                        </button>
                        <button
                            onClick={() => document.getElementById("home")?.scrollIntoView({ behavior: "smooth" })}
                            className="border border-white/20 hover:border-[#C8971A] text-white/60 hover:text-[#C8971A] px-9 py-4 text-sm font-semibold tracking-wide transition-colors cursor-pointer"
                        >
                            Back to Top
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
}