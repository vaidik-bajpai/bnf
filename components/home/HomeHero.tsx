import { ArrowRight, ChevronDown, MessageSquare } from "lucide-react";
import { AshokaCakra, LotusSmall } from "../Symbols";

interface HomeHeroProps {
    onViewForum: () => void;
}

const facts = [
    { num: "5,000+", label: "Years of Continuous Civilization", note: "From the Indus Valley to the Space Age — an unbroken story" },
    { num: "22", label: "Scheduled Languages", note: "India is home to one of the world's greatest diversities of living languages" },
    { num: "40+", label: "UNESCO World Heritage Sites", note: "From Ajanta to Hampi — India's monuments span every era of civilization" },
];

export default function HomeHero({ onViewForum }: HomeHeroProps) {
    return (
        <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center bg-[#0F1C3F]"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1920&h=1080&fit=crop&auto=format')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#0A1428]/97 via-[#0F1C3F]/90 to-[#2A1008]/70" />

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                <AshokaCakra className="w-[80vw] h-[80vw] max-w-4xl text-white opacity-[0.025]" />
            </div>
            <div className="absolute bottom-20 right-12 opacity-10 pointer-events-none">
                <LotusSmall className="w-48 h-36 text-[#C8971A]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 grid lg:grid-cols-2 gap-12 items-center">
                <div>
                    <div className="flex items-center gap-3 mb-8">
                        <AshokaCakra className="w-6 h-6 text-[#C8971A]" />
                        <span className="text-[#C8971A] text-xs font-semibold tracking-[0.35em] uppercase">
                            India &mdash; A Civilizational Journey
                        </span>
                    </div>
                    <h1
                        className="text-white font-bold leading-[1.08] mb-7"
                        style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2.6rem, 6vw, 5rem)" }}
                    >
                        Five Millennia of
                        <br />
                        <span className="text-[#C8971A]">Thought, Art</span>
                        <br />
                        &amp; Discovery
                    </h1>
                    <p
                        className="text-white/60 text-lg leading-relaxed mb-10 max-w-xl"
                        style={{ fontFamily: "'Spectral', Georgia, serif" }}
                    >
                        Exploring the depths of India&apos;s intellectual, artistic, and philosophical heritage — and the thinkers, builders, and dreamers who shaped a civilization that never stopped.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => document.getElementById("heritage")?.scrollIntoView({ behavior: "smooth" })}
                            className="flex items-center justify-center gap-3 bg-[#B85428] hover:bg-[#A04820] text-white px-9 py-4 text-sm font-semibold tracking-wide transition-all group cursor-pointer"
                        >
                            Explore Heritage
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={onViewForum}
                            className="flex items-center justify-center gap-2 border border-white/20 hover:border-[#C8971A] text-white/70 hover:text-[#C8971A] px-9 py-4 text-sm font-semibold tracking-wide transition-all cursor-pointer"
                        >
                            <MessageSquare className="w-4 h-4" /> Join the Forum
                        </button>
                    </div>
                </div>

                <div className="hidden lg:grid grid-cols-1 gap-4">
                    {facts.map((f) => (
                        <div key={f.label} className="bg-white/6 border border-white/10 px-6 py-5 hover:border-[#C8971A]/40 transition-colors">
                            <div className="text-[#C8971A] text-3xl font-bold mb-1" style={{ fontFamily: "'Fraunces', serif" }}>
                                {f.num}
                            </div>
                            <div className="text-white font-semibold text-sm mb-1">{f.label}</div>
                            <div className="text-white/40 text-xs leading-relaxed">{f.note}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-25">
                <ChevronDown className="w-5 h-5 text-white" />
            </div>
        </section>
    );
}