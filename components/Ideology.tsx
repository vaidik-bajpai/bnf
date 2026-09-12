import { ideologyValues } from "@/data/siteData";

export default function Ideology() {
    return (
        <section id="ideology" className="py-24 bg-[#0D1B3E] relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 flex items-center pointer-events-none overflow-hidden">
                <span
                    className="text-white/[0.03] select-none"
                    style={{ fontFamily: "'Tiro Devanagari Sanskrit', serif", fontSize: "60vw", lineHeight: 1 }}
                >
                    ॐ
                </span>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-px w-12 bg-[#E8550A]" />
                            <span
                                className="text-[#E8550A] text-xs tracking-[0.35em] uppercase"
                                style={{ fontFamily: "'Cinzel', serif" }}
                            >
                                Our Ideology
                            </span>
                        </div>
                        <h2
                            className="text-white font-bold mb-8 leading-tight"
                            style={{
                                fontFamily: "'Cinzel', serif",
                                fontSize: "clamp(2rem, 4vw, 3rem)",
                            }}
                        >
                            The Philosophy of <span className="text-[#FF6B1A]">Hindutva</span>
                        </h2>
                        <div className="space-y-5 text-white/70 text-lg leading-relaxed">
                            <p>
                                Hindutva is not merely a religion - it is a civilization. It
                                encompasses the totality of the Bharatiya way of life: its
                                philosophy, its culture, its art, its science, its social
                                ethics, and its spiritual pursuit toward the divine. Every
                                river, mountain, and temple of this sacred land testifies to an
                                unbroken civilizational continuum.
                            </p>
                            <p>
                                We believe India&apos;s destiny is inseparable from its Hindu
                                identity. Not in exclusion of others, but as a civilizational
                                anchor - a Dharmic state that honors its roots while embracing
                                all who call Bharat their homeland and revere its sacred
                                traditions.
                            </p>
                            <p>
                                The Vedas declare:{" "}
                                <em className="text-[#D4A017] not-italic">
                                    Ekam Sat Vipra Bahudha Vadanti
                                </em>{" "}
                                - Truth is one; the wise speak of it in many ways. This
                                pluralistic yet unified vision guides our movement forward.
                            </p>
                        </div>
                        <div className="mt-8 pl-6 border-l-4 border-[#E8550A] bg-white/5 py-4 pr-4">
                            <p
                                className="text-[#D4A017] text-xl leading-relaxed"
                                style={{ fontFamily: "'EB Garamond', serif", fontStyle: "italic" }}
                            >
                                &ldquo;Hinduism is not a religion but a way of life. It is the mother
                                of all faiths and the eternal repository of all spiritual
                                wisdom.&rdquo;
                            </p>
                            <p className="text-white/45 mt-2 text-sm">
                                - Sanatan Dharma Sangha Manifesto, 2024
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {ideologyValues.map((v) => (
                            <div
                                key={v.en}
                                className="bg-white/5 border border-white/10 p-5 hover:border-[#E8550A]/60 hover:bg-[#E8550A]/10 transition-all group cursor-default"
                            >
                                <div
                                    className="text-[#FF6B1A] text-xl font-bold mb-0.5 group-hover:text-[#D4A017] transition-colors"
                                    style={{ fontFamily: "'Cinzel', serif" }}
                                >
                                    {v.en}
                                </div>
                                <div
                                    className="text-white/35 text-sm mb-2"
                                    style={{ fontFamily: "'Tiro Devanagari Sanskrit', serif" }}
                                >
                                    {v.hi}
                                </div>
                                <p className="text-white/60 text-sm leading-relaxed">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}