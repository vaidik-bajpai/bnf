import { DiamondDivider } from "../Symbols";
import { timeline } from "@/data/forumData";

const heritageCards = [
    {
        img: "https://images.unsplash.com/photo-1477587458883-47145ed68571?w=700&h=500&fit=crop&auto=format",
        tag: "Architecture",
        title: "Monuments of the Ages",
        desc: "From Sanchi's stupa to Vijayanagara's Virupaksha, from Qutb Minar to Humayun's Tomb — Indian architecture synthesizes every tradition it has encountered.",
    },
    {
        img: "https://images.unsplash.com/photo-1524397057410-1e775ed476f3?w=700&h=500&fit=crop&auto=format",
        tag: "Sacred Geography",
        title: "Land as Living Text",
        desc: "India's sacred geography — its rivers, mountains, pilgrimage routes, and forests — form an unwritten civilizational map that millions still navigate today.",
    },
    {
        img: "https://images.unsplash.com/photo-1548013146-72479768bada?w=700&h=500&fit=crop&auto=format",
        tag: "Art & Sculpture",
        title: "The Classical Tradition",
        desc: "Indian sculpture, miniature painting, classical dance, and temple art constitute one of history's richest visual cultures — spanning 4,000 years without interruption.",
    },
];

export default function HeritageSection() {
    return (
        <section id="heritage" className="py-24 bg-[#FAFAF7]">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-14">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="h-px w-12 bg-[#B85428]/30" />
                        <span className="text-[#B85428] text-xs font-semibold tracking-[0.35em] uppercase">Our Heritage</span>
                        <div className="h-px w-12 bg-[#B85428]/30" />
                    </div>
                    <h2
                        className="text-[#0F1C3F] font-bold mb-4"
                        style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
                    >
                        A Civilization in Stone, Sound &amp; Script
                    </h2>
                    <p
                        className="text-[#6B5B4E] text-lg max-w-2xl mx-auto leading-relaxed"
                        style={{ fontFamily: "'Spectral', serif" }}
                    >
                        From the grid-planned cities of the Indus Valley to the cave paintings of Ajanta, from Sanskrit epics to Carnatic ragas — India&apos;s heritage spans every dimension of human expression.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-14">
                    {heritageCards.map((card) => (
                        <div key={card.title} className="group overflow-hidden bg-white border border-[#EDE8DF] hover:shadow-xl transition-all">
                            <div className="relative h-48 overflow-hidden bg-[#0F1C3F]">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={card.img}
                                    alt={card.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0F1C3F]/60 to-transparent" />
                                <span className="absolute top-4 left-4 bg-[#B85428] text-white text-xs font-semibold px-3 py-1 tracking-widest uppercase">
                                    {card.tag}
                                </span>
                            </div>
                            <div className="p-6">
                                <h3 className="text-[#0F1C3F] font-bold text-lg mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
                                    {card.title}
                                </h3>
                                <p className="text-[#6B5B4E] text-sm leading-relaxed">{card.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mb-4">
                    <DiamondDivider />
                </div>
                <h3
                    className="text-center text-[#0F1C3F] font-bold text-xl mb-8 mt-10"
                    style={{ fontFamily: "'Fraunces', serif" }}
                >
                    A Civilizational Timeline
                </h3>
                <div className="relative overflow-x-auto pb-4">
                    <div className="flex gap-0 min-w-max">
                        {timeline.map((t, i) => (
                            <div key={t.year} className="flex flex-col items-center" style={{ width: "140px" }}>
                                <div className="relative w-full flex justify-center">
                                    <div
                                        className={`absolute top-3.5 left-0 right-0 h-px ${i === 0 ? "left-1/2" : ""} ${i === timeline.length - 1 ? "right-1/2" : ""
                                            } bg-[#B85428]/25`}
                                    />
                                    <div
                                        className={`relative z-10 w-3 h-3 rounded-full border-2 ${i % 3 === 0 ? "bg-[#B85428] border-[#B85428]" : "bg-white border-[#B85428]/50"
                                            }`}
                                    />
                                </div>
                                <div className="mt-3 text-center px-2">
                                    <div className="text-[#B85428] text-xs font-bold mb-1">{t.year}</div>
                                    <div className="text-[#0F1C3F] text-xs font-semibold leading-tight mb-1">{t.event}</div>
                                    <div className="text-[#9E8F85] text-[10px] leading-tight">{t.note}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}