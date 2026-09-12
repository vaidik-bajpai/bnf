import { ArrowRight } from "lucide-react";
import { programs } from "@/data/siteData";

export default function Programs() {
    return (
        <section id="programs" className="py-24 bg-[#FDF8F0]">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2
                        className="text-[#0D1B3E] font-bold mb-4"
                        style={{
                            fontFamily: "'Cinzel', serif",
                            fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                        }}
                    >
                        Programs &amp; Initiatives
                    </h2>
                    <p className="text-[#4A3728] text-lg max-w-2xl mx-auto">
                        Translating ideology into action through grassroots programs that
                        serve every corner of Bharat Mata.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {programs.map((prog) => (
                        <div
                            key={prog.title}
                            className="group overflow-hidden bg-white shadow-sm hover:shadow-2xl transition-all"
                        >
                            <div className="relative h-52 overflow-hidden bg-[#0D1B3E]">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={prog.img}
                                    alt={prog.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B3E]/60 to-transparent" />
                                <div className="absolute top-4 left-4">
                                    <span
                                        className="bg-[#E8550A] text-white text-xs px-3 py-1.5 tracking-[0.2em] uppercase"
                                        style={{ fontFamily: "'Cinzel', serif" }}
                                    >
                                        {prog.tag}
                                    </span>
                                </div>
                            </div>
                            <div className="p-7">
                                <h3
                                    className="text-[#0D1B3E] text-xl font-bold mb-3"
                                    style={{ fontFamily: "'Cinzel', serif" }}
                                >
                                    {prog.title}
                                </h3>
                                <p className="text-[#4A3728] text-sm leading-relaxed mb-5">{prog.desc}</p>
                                <button
                                    className="text-[#E8550A] text-sm tracking-[0.15em] uppercase flex items-center gap-2 hover:gap-4 transition-all group/btn"
                                    style={{ fontFamily: "'Cinzel', serif" }}
                                >
                                    Learn More{" "}
                                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}