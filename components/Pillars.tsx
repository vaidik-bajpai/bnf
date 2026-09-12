import { DharmaChakra } from "./Symbols";
import { pillars } from "@/data/siteData";

export default function Pillars() {
    return (
        <section className="py-24 bg-[#FDF8F0]">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <DharmaChakra className="w-14 h-14 mx-auto text-[#E8550A] mb-6" />
                    <h2
                        className="text-[#0D1B3E] font-bold mb-4"
                        style={{
                            fontFamily: "'Cinzel', serif",
                            fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                        }}
                    >
                        Six Pillars of Bharatiya Civilization
                    </h2>
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-px w-12 bg-[#E8550A]" />
                        <span
                            className="text-[#E8550A] text-xs tracking-[0.35em] uppercase"
                            style={{ fontFamily: "'Cinzel', serif" }}
                        >
                            षट् स्तम्भ
                        </span>
                        <div className="h-px w-12 bg-[#E8550A]" />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {pillars.map((p) => (
                        <div
                            key={p.title}
                            className="bg-white border-t-[3px] border-[#E8550A] p-7 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 group"
                        >
                            <div className="text-[#E8550A] mb-4 group-hover:scale-110 transition-transform">
                                {p.icon}
                            </div>
                            <div className="flex items-baseline gap-3 mb-3">
                                <h3
                                    className="text-[#0D1B3E] text-xl font-bold"
                                    style={{ fontFamily: "'Cinzel', serif" }}
                                >
                                    {p.title}
                                </h3>
                                <span
                                    className="text-[#E8550A]/55 text-sm"
                                    style={{ fontFamily: "'Tiro Devanagari Sanskrit', serif" }}
                                >
                                    {p.devanagari}
                                </span>
                            </div>
                            <p className="text-[#4A3728] text-sm leading-relaxed">{p.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}