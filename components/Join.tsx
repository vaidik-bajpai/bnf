'use client';

import { LotusIcon, DharmaChakra } from "./Symbols";

export default function Join() {
    return (
        <section id="join" className="py-28 bg-[#0D1B3E] relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-5">
                <LotusIcon className="absolute top-8 left-8 w-40 h-40 text-[#FF6B1A]" />
                <LotusIcon className="absolute bottom-8 right-8 w-40 h-40 text-[#FF6B1A]" />
                <DharmaChakra className="absolute top-1/2 right-1/4 w-72 h-72 text-[#D4A017] -translate-y-1/2" />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
                <span
                    className="text-[#FF6B1A] text-6xl block mb-6 leading-none"
                    style={{ fontFamily: "'Tiro Devanagari Sanskrit', serif" }}
                >
                    ॐ
                </span>
                <h2
                    className="text-white font-bold mb-4"
                    style={{
                        fontFamily: "'Cinzel Decorative', serif",
                        fontSize: "clamp(2rem, 5vw, 3.2rem)",
                    }}
                >
                    Join the Sangha
                </h2>
                <p
                    className="text-white/65 text-xl mb-10 leading-relaxed"
                    style={{ fontFamily: "'EB Garamond', serif" }}
                >
                    The future of Sanatan Dharma rests in the hands of those who love
                    Bharat. Join thousands of Karyakartas committed to the renaissance of
                    Hindu civilization. Your Dharma calls you.
                </p>

                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Your Name"
                            className="bg-white/8 border border-white/20 text-white placeholder-white/35 px-5 py-4 focus:outline-none focus:border-[#E8550A] transition-colors w-full"
                            style={{ fontFamily: "'EB Garamond', serif" }}
                        />
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="bg-white/8 border border-white/20 text-white placeholder-white/35 px-5 py-4 focus:outline-none focus:border-[#E8550A] transition-colors w-full"
                            style={{ fontFamily: "'EB Garamond', serif" }}
                        />
                    </div>
                    <input
                        type="text"
                        placeholder="Your City / State"
                        className="bg-white/8 border border-white/20 text-white placeholder-white/35 px-5 py-4 focus:outline-none focus:border-[#E8550A] transition-colors w-full"
                        style={{ fontFamily: "'EB Garamond', serif" }}
                    />
                    <select
                        defaultValue=""
                        className="bg-white/8 border border-white/20 text-white/70 px-5 py-4 focus:outline-none focus:border-[#E8550A] transition-colors w-full appearance-none"
                        style={{ fontFamily: "'EB Garamond', serif" }}
                    >
                        <option value="" disabled className="text-[#1A0800]">
                            How would you like to serve?
                        </option>
                        <option className="text-[#1A0800]">Grassroots Organizing</option>
                        <option className="text-[#1A0800]">Temple Service &amp; Restoration</option>
                        <option className="text-[#1A0800]">Vedic Education</option>
                        <option className="text-[#1A0800]">Cultural Outreach</option>
                        <option className="text-[#1A0800]">Gram Seva (Village Service)</option>
                    </select>
                    <button
                        type="submit"
                        className="w-full bg-[#E8550A] hover:bg-[#FF6B1A] text-white py-4 text-sm tracking-[0.25em] uppercase transition-colors mt-2"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        Take the Pledge — Jai Bharat
                    </button>
                </form>
            </div>
        </section>
    );
}