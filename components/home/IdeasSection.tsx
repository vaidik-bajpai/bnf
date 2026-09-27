import { AshokaCakra } from "../Symbols";

const schools = [
    { name: "Nyaya", desc: "Epistemology and formal logic — the science of correct reasoning" },
    { name: "Vaisheshika", desc: "Atomic theory and metaphysics — the nature of substance" },
    { name: "Samkhya", desc: "Cosmological dualism — consciousness and matter" },
    { name: "Yoga", desc: "Psychophysical discipline as a path to liberation" },
    { name: "Mimamsa", desc: "Hermeneutics — the theory of textual interpretation" },
    { name: "Vedanta", desc: "Non-dual metaphysics — the identity of self and cosmos" },
    { name: "Charvaka", desc: "Materialism and empiricism — the earliest secular philosophy" },
    { name: "Navya-Nyaya", desc: "Medieval formal logic rivaling modern symbolic logic" },
];

export default function IdeasSection() {
    return (
        <section id="ideas" className="min-h-screen flex flex-col justify-center py-6 sm:py-8 lg:py-10 bg-[#0F1C3F] relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <AshokaCakra className="absolute -right-24 top-1/2 -translate-y-1/2 w-[500px] h-[500px] text-white opacity-[0.025]" />
            </div>
            <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 w-full my-auto flex flex-col justify-center">
                <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-px w-10 bg-[#B85428]" />
                            <span className="text-[#B85428] text-[11px] font-semibold tracking-[0.35em] uppercase">Indic Philosophy</span>
                        </div>
                        <h2
                            className="text-white font-bold mb-3 leading-tight"
                            style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.8rem, 3.2vw, 2.5rem)" }}
                        >
                            Ideas That Shaped Civilizations
                        </h2>
                        <div className="space-y-2.5 text-white/70 text-xs sm:text-sm lg:text-[14px] leading-relaxed" style={{ fontFamily: "'Spectral', serif" }}>
                            <p>
                                India&apos;s philosophical tradition is among the oldest and most diverse in the world. From the materialist Charvaka school to the non-dualism of Advaita Vedanta, from Jain epistemology to Buddhist logic, from Nyaya debate theory to Mimamsa hermeneutics — the subcontinent produced an extraordinary range of rigorous intellectual frameworks.
                            </p>
                            <p className="hidden sm:block">
                                These were not merely spiritual abstractions. The Arthashastra addressed political economy. The Natya Shastra theorized aesthetics. Panini&apos;s grammar anticipated formal linguistics by two millennia. The Vastu Shastra encoded spatial philosophy. India&apos;s was a civilization that theorized everything.
                            </p>
                        </div>
                        <div className="mt-3.5 pl-4 border-l-2 border-[#C8971A] py-1">
                            <p className="text-[#C8971A] text-base sm:text-lg italic" style={{ fontFamily: "'Spectral', serif" }}>
                                &quot;Ekam sat vipra bahudh&#257; vadanti.&quot;
                            </p>
                            <p className="text-white/40 text-[11px] mt-0.5">Truth is one; the wise speak of it in many ways. &mdash; Rigveda</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                        {schools.map((s) => (
                            <div
                                key={s.name}
                                className="bg-white/5 border border-white/10 p-2.5 sm:p-3 hover:border-[#C8971A]/50 hover:bg-white/8 transition-all group cursor-default rounded-xl"
                            >
                                <div
                                    className="text-[#C8971A] font-bold text-xs sm:text-sm mb-0.5 group-hover:text-white transition-colors"
                                    style={{ fontFamily: "'Fraunces', serif" }}
                                >
                                    {s.name}
                                </div>
                                <p className="text-white/50 text-[11px] leading-snug">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}