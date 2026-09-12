import { leaders } from "@/data/forumData";

export default function LeadersSection() {
    return (
        <section id="leaders" className="py-24 bg-[#FAFAF7]">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-14">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="h-px w-12 bg-[#B85428]/30" />
                        <span className="text-[#B85428] text-xs font-semibold tracking-[0.35em] uppercase">Leaders &amp; Thinkers</span>
                        <div className="h-px w-12 bg-[#B85428]/30" />
                    </div>
                    <h2
                        className="text-[#0F1C3F] font-bold mb-4"
                        style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
                    >
                        The Builders of Bharat
                    </h2>
                    <p
                        className="text-[#6B5B4E] text-lg max-w-2xl mx-auto leading-relaxed"
                        style={{ fontFamily: "'Spectral', serif" }}
                    >
                        Scientists, philosophers, freedom fighters, reformers, poets, and administrators — a vast and diverse gallery of those who shaped India&apos;s civilizational story.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {leaders.map((l) => (
                        <div
                            key={l.name}
                            className="bg-white border border-[#EDE8DF] p-5 hover:shadow-lg hover:border-[#B85428]/30 transition-all group"
                        >
                            <div className="flex items-start gap-3 mb-3">
                                <div
                                    className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm"
                                    style={{ backgroundColor: l.bg }}
                                >
                                    {l.initials}
                                </div>
                                <div>
                                    <div
                                        className="font-bold text-[#0F1C3F] text-sm leading-tight group-hover:text-[#B85428] transition-colors"
                                        style={{ fontFamily: "'Fraunces', serif" }}
                                    >
                                        {l.name}
                                    </div>
                                    <div className="text-[#9E8F85] text-[11px] mt-0.5">{l.era}</div>
                                </div>
                            </div>
                            <div className="text-[#B85428] text-[11px] font-semibold tracking-wide uppercase mb-2">
                                {l.domain}
                            </div>
                            <p className="text-[#6B5B4E] text-xs leading-relaxed">{l.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}