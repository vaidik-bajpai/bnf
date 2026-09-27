import { leaders } from "@/data/forumData";

export default function LeadersSection() {
    return (
        <section id="leaders" className="min-h-screen flex flex-col justify-center py-6 sm:py-8 lg:py-10 bg-[#FAFAF7] select-none">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full my-auto flex flex-col justify-center">
                <div className="text-center mb-3 sm:mb-4">
                    <div className="flex items-center justify-center gap-2 mb-1.5">
                        <div className="h-px w-10 bg-[#B85428]/30" />
                        <span className="text-[#B85428] text-[11px] font-semibold tracking-[0.35em] uppercase">Leaders &amp; Thinkers</span>
                        <div className="h-px w-10 bg-[#B85428]/30" />
                    </div>
                    <h2
                        className="text-[#0F1C3F] font-bold mb-1.5"
                        style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.7rem, 3.2vw, 2.4rem)" }}
                    >
                        The Builders of Bharat
                    </h2>
                    <p
                        className="text-[#6B5B4E] text-xs sm:text-sm max-w-xl mx-auto leading-relaxed"
                        style={{ fontFamily: "'Spectral', serif" }}
                    >
                        Scientists, philosophers, freedom fighters, reformers, poets, and administrators who shaped India&apos;s civilizational story.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
                    {leaders.slice(0, 8).map((l) => (
                        <div
                            key={l.name}
                            className="bg-white border border-[#EDE8DF] p-3 sm:p-3.5 hover:shadow-md hover:border-[#B85428]/30 transition-all group rounded-xl flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-start gap-2.5 mb-2">
                                    <div
                                        className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-xs"
                                        style={{ backgroundColor: l.bg }}
                                    >
                                        {l.initials}
                                    </div>
                                    <div className="min-w-0">
                                        <div
                                            className="font-bold text-[#0F1C3F] text-xs sm:text-sm leading-tight group-hover:text-[#B85428] transition-colors truncate"
                                            style={{ fontFamily: "'Fraunces', serif" }}
                                        >
                                            {l.name}
                                        </div>
                                        <div className="text-[#9E8F85] text-[10px] mt-0.5">{l.era}</div>
                                    </div>
                                </div>
                                <div className="text-[#B85428] text-[10px] font-semibold tracking-wider uppercase mb-1">
                                    {l.domain}
                                </div>
                                <p className="text-[#6B5B4E] text-[11px] leading-snug line-clamp-2">{l.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}