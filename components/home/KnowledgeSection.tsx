import { knowledgeSystems } from "@/data/forumData";

export default function KnowledgeSection() {
    return (
        <section id="knowledge" className="min-h-screen flex flex-col justify-center py-6 sm:py-8 lg:py-10 bg-[#EDE8DF] select-none">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full my-auto flex flex-col justify-center">
                <div className="text-center mb-3 sm:mb-4">
                    <div className="flex items-center justify-center gap-2 mb-1.5">
                        <div className="h-px w-10 bg-[#B85428]/40" />
                        <span className="text-[#B85428] text-[11px] font-semibold tracking-[0.35em] uppercase">Knowledge Systems</span>
                        <div className="h-px w-10 bg-[#B85428]/40" />
                    </div>
                    <h2
                        className="text-[#0F1C3F] font-bold mb-1.5"
                        style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.7rem, 3.2vw, 2.4rem)" }}
                    >
                        India&apos;s Contributions to Human Knowledge
                    </h2>
                    <p className="text-[#6B5B4E] text-xs sm:text-sm max-w-xl mx-auto" style={{ fontFamily: "'Spectral', serif" }}>
                        The decimal system, surgery, grammar theory, astronomy, metallurgy, textile arts, and classical music theory — fields in which India made foundational contributions.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5">
                    {knowledgeSystems.map((k) => (
                        <div
                            key={k.title}
                            className="bg-white border-t-4 p-3.5 sm:p-4 hover:shadow-md transition-all group rounded-xl"
                            style={{ borderTopColor: k.color }}
                        >
                            <div className="flex items-center gap-2.5 mb-2">
                                <div className="group-hover:scale-110 transition-transform" style={{ color: k.color }}>
                                    {k.icon}
                                </div>
                                <h3 className="text-[#0F1C3F] font-bold text-sm sm:text-base" style={{ fontFamily: "'Fraunces', serif" }}>
                                    {k.title}
                                </h3>
                            </div>
                            <ul className="space-y-1.5">
                                {k.items.map((item) => (
                                    <li key={item} className="text-[#6B5B4E] text-xs flex items-start gap-1.5 leading-snug">
                                        <span className="text-[#B85428] mt-0.5 shrink-0">›</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}