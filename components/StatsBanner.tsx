import { DharmaChakra } from "./Symbols";

const stats = [
    { num: "5,000+", label: "Years of Civilization" },
    { num: "1.2B+", label: "Hindus Worldwide" },
    { num: "200+", label: "Chapters Across Bharat" },
    { num: "50,000+", label: "Karyakartas" },
];

export default function StatsBanner() {
    return (
        <div className="bg-[#E8550A] relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-10">
                <DharmaChakra className="absolute -right-12 -top-12 w-48 h-48 text-white" />
                <DharmaChakra className="absolute -left-12 -bottom-12 w-48 h-48 text-white" />
            </div>
            <div className="relative max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {stats.map((s) => (
                    <div key={s.label}>
                        <div
                            className="text-white text-3xl md:text-4xl font-bold tracking-wide"
                            style={{ fontFamily: "'Cinzel', serif" }}
                        >
                            {s.num}
                        </div>
                        <div className="text-white/75 text-xs tracking-[0.2em] uppercase mt-1">
                            {s.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}