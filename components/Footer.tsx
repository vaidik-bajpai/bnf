import { DharmaChakra } from "./Symbols";

const quickLinks = ["Home", "Our Mission", "Ideology", "Heritage", "Programs", "Join Us", "Donate"];

const sacredSites = [
    "Kashi Vishwanath",
    "Ram Janmabhoomi",
    "Kedarnath Dham",
    "Mathura Vrindavan",
    "Tirupati Balaji",
    "Somnath Temple",
    "Char Dham Yatra",
];

export default function Footer() {
    return (
        <footer className="bg-[#050D1F] text-white">
            <div className="border-b border-white/8">
                <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-10">
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-3 mb-5">
                            <span
                                className="text-[#FF6B1A] text-4xl leading-none"
                                style={{ fontFamily: "'Tiro Devanagari Sanskrit', serif" }}
                            >
                                ॐ
                            </span>
                            <div>
                                <div
                                    className="text-white font-bold text-sm tracking-[0.12em] uppercase leading-tight"
                                    style={{ fontFamily: "'Cinzel', serif" }}
                                >
                                    Sanatan Dharma Sangha
                                </div>
                                <div
                                    className="text-[#D4A017] text-xs mt-0.5"
                                    style={{ fontFamily: "'Tiro Devanagari Sanskrit', serif" }}
                                >
                                    सनातन धर्म संघ
                                </div>
                            </div>
                        </div>
                        <p className="text-white/45 text-sm leading-relaxed mb-6">
                            Guardians of the eternal Dharma. Builders of a glorious Bharat.
                            United in our devotion to Bharat Mata and the Sanatan way of life.
                        </p>
                        <div
                            className="text-[#D4A017] text-xl"
                            style={{ fontFamily: "'Tiro Devanagari Sanskrit', serif" }}
                        >
                            वसुधैव कुटुम्बकम्
                        </div>
                        <div className="text-white/30 text-xs mt-1">The world is one family</div>
                    </div>

                    <div>
                        <h4
                            className="text-[#E8550A] text-xs tracking-[0.3em] uppercase mb-6"
                            style={{ fontFamily: "'Cinzel', serif" }}
                        >
                            Quick Links
                        </h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link}>
                                    <a
                                        href="#"
                                        className="text-white/50 hover:text-[#FF6B1A] text-sm transition-colors flex items-center gap-2"
                                    >
                                        <span className="text-[#E8550A]/40">›</span> {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4
                            className="text-[#E8550A] text-xs tracking-[0.3em] uppercase mb-6"
                            style={{ fontFamily: "'Cinzel', serif" }}
                        >
                            Sacred Bharat
                        </h4>
                        <ul className="space-y-3">
                            {sacredSites.map((site) => (
                                <li key={site}>
                                    <a
                                        href="#"
                                        className="text-white/50 hover:text-[#FF6B1A] text-sm transition-colors flex items-center gap-2"
                                    >
                                        <span className="text-[#E8550A]/40">›</span> {site}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4
                            className="text-[#E8550A] text-xs tracking-[0.3em] uppercase mb-6"
                            style={{ fontFamily: "'Cinzel', serif" }}
                        >
                            Contact
                        </h4>
                        <div className="space-y-5 text-white/50 text-sm">
                            <div>
                                <div className="text-white/25 text-[10px] uppercase tracking-widest mb-1">
                                    Head Office
                                </div>
                                <div className="leading-relaxed">
                                    Bharat Bhavan, Sector 15
                                    <br />
                                    New Delhi — 110 001
                                </div>
                            </div>
                            <div>
                                <div className="text-white/25 text-[10px] uppercase tracking-widest mb-1">
                                    Email
                                </div>
                                <div>sangha@sanatandharma.in</div>
                            </div>
                            <div>
                                <div className="text-white/25 text-[10px] uppercase tracking-widest mb-1">
                                    Helpline
                                </div>
                                <div>+91 11 2345 6789</div>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-6">
                            {["YT", "TW", "FB", "IG"].map((soc) => (
                                <a
                                    key={soc}
                                    href="#"
                                    className="w-9 h-9 border border-white/15 flex items-center justify-center text-white/40 hover:border-[#E8550A] hover:text-[#FF6B1A] transition-all text-[11px]"
                                    style={{ fontFamily: "'Cinzel', serif" }}
                                >
                                    {soc}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-[2px] bg-gradient-to-r from-transparent via-[#E8550A] to-transparent opacity-60" />

            <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-white/25 text-xs">
                    &copy; 2026 Sanatan Dharma Sangha. All rights reserved.
                </div>
                <div className="flex items-center gap-3 text-white/30 text-xs text-center">
                    <DharmaChakra className="w-4 h-4 text-[#E8550A]/50 shrink-0" />
                    <span>Jai Bharat Mata &nbsp;&middot;&nbsp; Jai Shri Ram &nbsp;&middot;&nbsp; Har Har Mahadev</span>
                    <DharmaChakra className="w-4 h-4 text-[#E8550A]/50 shrink-0" />
                </div>
                <div className="flex gap-5">
                    {["Privacy", "Terms", "Sitemap"].map((l) => (
                        <a
                            key={l}
                            href="#"
                            className="text-white/25 hover:text-white/55 text-xs transition-colors"
                        >
                            {l}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
}