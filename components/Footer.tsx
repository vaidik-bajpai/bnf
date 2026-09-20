import { ArrowRight } from "lucide-react";
import { AshokaCakra, TricolorStripe } from "./Symbols";
import { forumCategories } from "@/data/forumData";

export default function Footer() {
    return (
        <footer className="bg-[#070D1E] text-white">
            <TricolorStripe />
            <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-10">
                <div className="lg:col-span-1">
                    <div className="flex items-center gap-3 mb-5">
                        <AshokaCakra className="w-9 h-9 text-[#C8971A]" />
                        <div>
                            <div
                                className="text-white font-bold text-sm tracking-[0.12em] uppercase leading-tight"
                                style={{ fontFamily: "'Fraunces', serif" }}
                            >
                                BHARAT-GANRAJYA Nationalists Front
                            </div>
                            <div
                                className="text-[#C8971A]/60 text-[10px] tracking-widest mt-0.5"
                                style={{ fontFamily: "'Tiro Devanagari Sanskrit', serif" }}
                            >
                                भारतीय सभ्यता संगम
                            </div>
                        </div>
                    </div>
                    <p className="text-white/40 text-sm leading-relaxed mb-5">
                        A platform for rigorous, open, and pluralistic engagement with India&apos;s civilizational heritage.
                    </p>
                    <div className="text-[#C8971A]/70 text-sm italic" style={{ fontFamily: "'Spectral', serif" }}>
                        &ldquo;Sa vidya ya vimuktaye&rdquo;
                    </div>
                    <div className="text-white/25 text-xs mt-1">Knowledge is that which liberates. &mdash; Vishnu Purana</div>
                </div>

                <div>
                    <h4 className="text-[#B85428] text-xs font-semibold tracking-[0.3em] uppercase mb-5">Explore</h4>
                    <ul className="space-y-3">
                        {["Heritage", "Ideas & Philosophy", "Leaders & Thinkers", "Knowledge Systems", "Forum", "About Us"].map((l) => (
                            <li key={l}>
                                <a href="#" className="text-white/45 hover:text-[#C8971A] text-sm transition-colors flex items-center gap-2">
                                    <span className="text-[#B85428]/40">›</span> {l}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="text-[#B85428] text-xs font-semibold tracking-[0.3em] uppercase mb-5">Forum Categories</h4>
                    <ul className="space-y-3">
                        {forumCategories.map((c) => (
                            <li key={c.id}>
                                <a href="#" className="text-white/45 hover:text-[#C8971A] text-sm transition-colors flex items-center gap-2">
                                    <span className="text-[#B85428]/40">›</span> {c.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="text-[#B85428] text-xs font-semibold tracking-[0.3em] uppercase mb-5">Connect</h4>
                    <div className="space-y-4 text-white/45 text-sm">
                        <div>
                            <div className="text-white/20 text-[10px] uppercase tracking-widest mb-1">Email</div>
                            <div>hello@indicforum.in</div>
                        </div>
                        <div>
                            <div className="text-white/20 text-[10px] uppercase tracking-widest mb-1">Registered</div>
                            <div>New Delhi, India</div>
                        </div>
                        <div>
                            <div className="text-white/20 text-[10px] uppercase tracking-widest mb-1">Newsletter</div>
                            <div className="flex mt-1">
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="flex-1 bg-white/8 border border-white/15 px-3 py-2 text-xs text-white placeholder-white/25 focus:outline-none focus:border-[#B85428] transition-colors"
                                />
                                <button className="bg-[#B85428] hover:bg-[#A04820] px-3 py-2 transition-colors cursor-pointer" aria-label="Subscribe">
                                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 mt-6">
                        {["TW", "YT", "IN", "TG"].map((s) => (
                            <a
                                key={s}
                                href="#"
                                className="w-8 h-8 border border-white/12 flex items-center justify-center text-white/35 hover:border-[#C8971A] hover:text-[#C8971A] transition-all text-[11px] font-semibold"
                            >
                                {s}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <div className="border-t border-white/8">
                <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-white/20 text-xs">
                        &copy; 2026 BHARAT-GANRAJYA Nationalists Front. All rights reserved.
                    </div>
                    <div className="flex items-center gap-3 text-white/20 text-xs">
                        <AshokaCakra className="w-4 h-4 text-[#B85428]/40" />
                        <span>Satyameva Jayate &mdash; Truth Alone Triumphs</span>
                        <AshokaCakra className="w-4 h-4 text-[#B85428]/40" />
                    </div>
                    <div className="flex gap-5">
                        {["Privacy", "Terms", "Sitemap"].map((l) => (
                            <a key={l} href="#" className="text-white/20 hover:text-white/50 text-xs transition-colors">
                                {l}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}