import { knowledgeSystems } from "@/data/forumData";

export default function KnowledgeSection() {
    return (
        <section id="knowledge" className="py-24 bg-[#EDE8DF]">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-14">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="h-px w-12 bg-[#B85428]/40" />
                        <span className="text-[#B85428] text-xs font-semibold tracking-[0.35em] uppercase">Knowledge Systems</span>
                        <div className="h-px w-12 bg-[#B85428]/40" />
                    </div>
                    <h2
                        className="text-[#0F1C3F] font-bold mb-4"
                        style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
                    >
                        India&apos;s Contributions to Human Knowledge
                    </h2>
                    <p className="text-[#6B5B4E] text-lg max-w-2xl mx-auto" style={{ fontFamily: "'Spectral', serif" }}>
                        The decimal system, surgery, grammar theory, astronomy, metallurgy, textile arts, and classical music theory — fields in which India made foundational contributions to world civilization.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {knowledgeSystems.map((k) => (
                        <div
                            key={k.title}
                            className="bg-white border-t-4 p-6 hover:shadow-lg transition-all group"
                            style={{ borderTopColor: k.color }}
                        >
                            <div className="mb-4 group-hover:scale-110 transition-transform" style={{ color: k.color }}>
                                {k.icon}
                            </div>
                            <h3 className="text-[#0F1C3F] font-bold text-base mb-3" style={{ fontFamily: "'Fraunces', serif" }}>
                                {k.title}
                            </h3>
                            <ul className="space-y-2">
                                {k.items.map((item) => (
                                    <li key={item} className="text-[#6B5B4E] text-sm flex items-start gap-2">
                                        <span className="text-[#B85428] mt-1 shrink-0">›</span> {item}
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