import { ArrowRight, ChevronDown } from "lucide-react";
import { LotusIcon, DharmaChakra, TrishulIcon } from "./Symbols";

interface HeroProps {
    onNavigate: (id: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
    return (
        <section
            id="home"
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            <div
                className="absolute inset-0 bg-cover bg-center bg-[#0D1B3E]"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1920&h=1080&fit=crop&auto=format')",
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#070F22]/97 via-[#0D1B3E]/88 to-[#6B2200]/70" />
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    background: "linear-gradient(135deg, transparent 50%, #E8550A 50%)",
                }}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                <span
                    className="text-white/[0.04] select-none"
                    style={{
                        fontFamily: "'Tiro Devanagari Sanskrit', serif",
                        fontSize: "70vw",
                        lineHeight: 1,
                    }}
                >
                    ॐ
                </span>
            </div>
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#E8550A] via-[#D4A017] to-[#E8550A]" />
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#E8550A] via-[#D4A017] to-[#E8550A]" />

            <div className="absolute bottom-20 left-6 opacity-15 pointer-events-none">
                <LotusIcon className="w-28 h-28 text-[#FF6B1A]" />
            </div>
            <div className="absolute bottom-20 right-6 opacity-15 pointer-events-none">
                <LotusIcon className="w-28 h-28 text-[#FF6B1A]" />
            </div>
            <div className="absolute top-32 right-12 opacity-10 pointer-events-none">
                <DharmaChakra className="w-24 h-24 text-[#D4A017]" />
            </div>
            <div className="absolute top-32 left-12 opacity-10 pointer-events-none">
                <TrishulIcon className="w-16 h-28 text-[#FF6B1A]" />
            </div>

            <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-28">
                <div className="flex items-center justify-center gap-4 mb-8">
                    <div className="h-px w-14 bg-[#FF6B1A]" />
                    <span
                        className="text-[#D4A017] text-base tracking-[0.3em]"
                        style={{ fontFamily: "'Tiro Devanagari Sanskrit', serif" }}
                    >
                        जयतु सनातन धर्म
                    </span>
                    <div className="h-px w-14 bg-[#FF6B1A]" />
                </div>

                <h1
                    className="text-white font-bold leading-[1.05] mb-7 tracking-wide"
                    style={{
                        fontFamily: "'Cinzel Decorative', serif",
                        fontSize: "clamp(2.6rem, 8vw, 6.5rem)",
                    }}
                >
                    Rise of
                    <br />
                    <span className="text-[#FF6B1A]">Bharatiya</span>
                    <br />
                    Civilization
                </h1>

                <p
                    className="text-white/70 text-xl md:text-2xl max-w-3xl mx-auto mb-11 leading-relaxed"
                    style={{ fontFamily: "'EB Garamond', serif" }}
                >
                    Rekindling the eternal flame of Sanatan Dharma. Uniting Hindus across
                    the sacred land of Bharat to reclaim our civilizational heritage,
                    protect our ancient traditions, and build a glorious future worthy of
                    our ancestors.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => onNavigate("mission")}
                        className="bg-[#E8550A] hover:bg-[#FF6B1A] text-white px-10 py-4 text-sm tracking-[0.2em] uppercase flex items-center gap-3 transition-all group"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        Our Sacred Mission{" "}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                        onClick={() => onNavigate("join")}
                        className="border border-white/30 hover:border-[#FF6B1A] text-white/80 hover:text-[#FF6B1A] px-10 py-4 text-sm tracking-[0.2em] uppercase transition-all"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        Join the Sangha
                    </button>
                </div>

                <div className="mt-16 flex flex-col items-center gap-2 animate-bounce opacity-40">
                    <ChevronDown className="w-5 h-5 text-white" />
                </div>
            </div>
        </section>
    );
}