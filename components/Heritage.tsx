const stats = [
    { num: "5,000", label: "Years of Vedic Knowledge" },
    { num: "800K+", label: "Ancient Temples" },
    { num: "22", label: "Sacred Languages" },
];

export default function Heritage() {
    return (
        <section id="heritage" className="relative">
            <div className="grid lg:grid-cols-2 min-h-[580px]">
                <div
                    className="relative min-h-[380px] bg-[#0D1B3E]"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1548013146-72479768bada?w=900&h=700&fit=crop&auto=format')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    <div className="absolute inset-0 bg-[#0D1B3E]/35" />
                    <div className="absolute bottom-8 left-8">
                        <span
                            className="bg-[#E8550A] text-white text-xs px-4 py-2 tracking-[0.2em] uppercase"
                            style={{ fontFamily: "'Cinzel', serif" }}
                        >
                            Ancient Bharat
                        </span>
                    </div>
                    <div className="absolute top-8 right-8 opacity-25">
                        <span
                            className="text-white text-7xl leading-none"
                            style={{ fontFamily: "'Tiro Devanagari Sanskrit', serif" }}
                        >
                            ॐ
                        </span>
                    </div>
                </div>

                <div className="bg-[#0D1B3E] px-10 py-16 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-px w-12 bg-[#E8550A]" />
                        <span
                            className="text-[#E8550A] text-xs tracking-[0.35em] uppercase"
                            style={{ fontFamily: "'Cinzel', serif" }}
                        >
                            Our Heritage
                        </span>
                    </div>
                    <h2
                        className="text-white font-bold mb-6 leading-tight"
                        style={{
                            fontFamily: "'Cinzel', serif",
                            fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
                        }}
                    >
                        5,000 Years of <span className="text-[#FF6B1A]">Unbroken Legacy</span>
                    </h2>
                    <p className="text-white/70 text-lg leading-relaxed mb-5">
                        When the rest of the world was in darkness, the rishis of Bharat
                        had already mapped the cosmos, codified mathematics, developed
                        surgery, established democratic assemblies, and composed timeless
                        literature that still speaks to the human condition.
                    </p>
                    <p className="text-white/70 text-lg leading-relaxed mb-10">
                        From the Indus Valley to the Gupta Golden Age, from Nalanda
                        University to the Chola maritime empire - Bharat&apos;s
                        civilizational achievements demand recognition and fierce pride in
                        every Hindu heart.
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                        {stats.map((s) => (
                            <div key={s.label} className="border-l-2 border-[#E8550A]/50 pl-4">
                                <div
                                    className="text-[#FF6B1A] text-xl font-bold"
                                    style={{ fontFamily: "'Cinzel', serif" }}
                                >
                                    {s.num}
                                </div>
                                <div className="text-white/45 text-xs leading-tight mt-1">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}