import { TrishulIcon, LotusIcon, DharmaChakra } from "./Symbols";

const missionCards = [
    {
        symbol: <TrishulIcon className="w-14 h-20 mx-auto text-[#E8550A]" />,
        title: "Protect Dharma",
        desc: "Defend the sacred rights of Hindus across the nation, protect ancient temples and pilgrimage sites, and uphold India as the spiritual homeland of Sanatan Dharma for all eternity.",
    },
    {
        symbol: <LotusIcon className="w-20 h-14 mx-auto text-[#E8550A]" />,
        title: "Revive Sanskriti",
        desc: "Promote Sanskrit, ancient arts, classical music, Vedic education, and the living traditions of Bharatiya culture - from Yoga to Ayurveda - as counterweights to cultural imperialism.",
    },
    {
        symbol: <DharmaChakra className="w-16 h-16 mx-auto text-[#E8550A]" />,
        title: "Unite Hindus",
        desc: "Build a unified Hindu consciousness transcending regional, caste, and linguistic barriers. One people, one civilization, one eternal heritage - Ek Bharat, Shreshtha Bharat.",
    },
];

export default function Mission() {
    return (
        <section id="mission" className="py-24 bg-[#FDF8F0]">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span
                        className="text-[#E8550A] text-5xl block mb-4 leading-none"
                        style={{ fontFamily: "'Tiro Devanagari Sanskrit', serif" }}
                    >
                        ॐ
                    </span>
                    <h2
                        className="text-[#0D1B3E] font-bold mb-4"
                        style={{
                            fontFamily: "'Cinzel', serif",
                            fontSize: "clamp(2rem, 4vw, 3rem)",
                        }}
                    >
                        Our Sacred Mission
                    </h2>
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="h-px w-12 bg-[#E8550A]" />
                        <span
                            className="text-[#E8550A] text-xs tracking-[0.35em] uppercase"
                            style={{ fontFamily: "'Cinzel', serif" }}
                        >
                            हमारा पवित्र संकल्प
                        </span>
                        <div className="h-px w-12 bg-[#E8550A]" />
                    </div>
                    <p className="text-[#4A3728] text-lg max-w-3xl mx-auto leading-relaxed">
                        We stand at a historic crossroads. The ancient civilizational flame
                        of Bharat - which has burned uninterrupted for over five millennia
                        - must be protected, celebrated, and carried forward into an age of
                        renewed Hindu pride and cultural renaissance.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-7">
                    {missionCards.map((card) => (
                        <div
                            key={card.title}
                            className="bg-white border border-[#E8550A]/15 p-8 text-center hover:border-[#E8550A]/50 hover:shadow-xl hover:shadow-[#E8550A]/8 transition-all group"
                        >
                            <div className="mb-6 min-h-[5rem] flex items-center justify-center transform group-hover:scale-105 transition-transform">
                                {card.symbol}
                            </div>
                            <h3
                                className="text-[#0D1B3E] text-xl font-bold mb-4"
                                style={{ fontFamily: "'Cinzel', serif" }}
                            >
                                {card.title}
                            </h3>
                            <p className="text-[#4A3728] leading-relaxed text-[0.95rem]">
                                {card.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}