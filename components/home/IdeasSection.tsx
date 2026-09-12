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
        <section id="ideas" className="py-24 bg-[#0F1C3F] relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <AshokaCakra className="absolute -right-24 top-1/2 -translate-y-1/2 w-[500px] h-[500px] text-white opacity-[0.025]" />
            </div>
            <div className="relative z-10 max-w-6xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-px w-12 bg-[#B85428]" />
                            <span className="text-[#B85428] text-xs font-semibold tracking-[0.35em] uppercase">Indic Philosophy</span>
                        </div>
                        <h2
                            className="text-white font-bold mb-7 leading-tight"
                            style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2rem, 4vw, 3rem)" }}
                        >
                            Ideas That Shaped Civilizations
                        </h2>
                        <div className="space-y-5 text-white/65 text-lg leading-relaxed" style={{ fontFamily: "'Spectral', serif" }}>
                            <p>
                                India&apos;s philosophical tradition is among the oldest and most diverse in the world. From the materialist Charvaka school to the non-dualism of Advaita Vedanta, from Jain epistemology to Buddhist logic, from Nyaya debate theory to Mimamsa hermeneutics — the subcontinent produced an extraordinary range of rigorous intellectual frameworks.
                            </p>
                            <p>
                                These were not merely spiritual abstractions. The Arthashastra addressed political economy. The Natya Shastra theorized aesthetics. Panini&apos;s grammar anticipated formal linguistics by two millennia. The Vastu Shastra encoded spatial philosophy. India&apos;s was a civilization that theorized everything.
                            </p>
                        </div>
                        <div className="mt-8 pl-5 border-l-2 border-[#C8971A] py-3">
                            <p className="text-[#C8971A] text-xl italic" style={{ fontFamily: "'Spectral', serif" }}>
                                &quot;Ekam sat vipra bahudh&#257; vadanti.&quot;
                            </p>
                            <p className="text-white/40 text-sm mt-1">Truth is one; the wise speak of it in many ways. &mdash; Rigveda</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {schools.map((s) => (
                            <div
                                key={s.name}
                                className="bg-white/5 border border-white/10 p-4 hover:border-[#C8971A]/50 hover:bg-white/8 transition-all group cursor-default"
                            >
                                <div
                                    className="text-[#C8971A] font-bold text-sm mb-1 group-hover:text-white transition-colors"
                                    style={{ fontFamily: "'Fraunces', serif" }}
                                >
                                    {s.name}
                                </div>
                                <p className="text-white/50 text-xs leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}