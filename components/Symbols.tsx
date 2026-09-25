export const AshokaCakra = ({ className = "" }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="3" />
        <circle cx="50" cy="50" r="31" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="9" fill="currentColor" />
        {Array.from({ length: 24 }, (_, i) => {
            const a = (i * 15 * Math.PI) / 180;
            return (
                <line
                    key={i}
                    x1={50 + 9 * Math.cos(a)}
                    y1={50 + 9 * Math.sin(a)}
                    x2={50 + 31 * Math.cos(a)}
                    y2={50 + 31 * Math.sin(a)}
                    stroke="currentColor"
                    strokeWidth="1.5"
                />
            );
        })}
    </svg>
);

export const LotusSmall = ({ className = "" }: { className?: string }) => (
    <svg viewBox="0 0 80 60" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(40,45)">
            {([-50, -33, -17, 0, 17, 33, 50] as number[]).map((angle, i) => (
                <ellipse
                    key={i}
                    rx="6"
                    ry="22"
                    transform={`rotate(${angle})`}
                    opacity={Math.abs(angle) > 33 ? 0.45 : 0.82}
                />
            ))}
            <circle r="8" />
        </g>
    </svg>
);

export const TricolorStripe = ({ className = "" }: { className?: string }) => (
    <div className={`flex h-[3px] ${className}`}>
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
    </div>
);

export const DiamondDivider = ({ light = false }: { light?: boolean }) => (
    <div className={`flex items-center gap-3 ${light ? "text-white/30" : "text-[#B85428]/30"}`}>
        <div className="flex-1 h-px bg-current" />
        <div className="flex gap-1.5 items-center">
            <div className="w-1.5 h-1.5 rotate-45 bg-current opacity-50" />
            <div className="w-2 h-2 rotate-45 bg-current opacity-80" />
            <div className="w-1.5 h-1.5 rotate-45 bg-current opacity-50" />
        </div>
        <div className="flex-1 h-px bg-current" />
    </div>
);

export const NationalEmblemLogo = ({ className = "w-10 h-10" }: { className?: string }) => (
    <svg viewBox="0 0 100 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="crestGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="50%" stopColor="#EAB308" />
                <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>
            <linearGradient id="flagSaffron" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF9933" />
                <stop offset="100%" stopColor="#FF7700" />
            </linearGradient>
            <linearGradient id="flagGreen" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
            </linearGradient>
        </defs>

        {/* Crown / Ashoka Crest on top */}
        <g id="crown" transform="translate(35, 2) scale(0.6)">
            <path
                d="M 5,20 L 12,5 L 25,14 L 38,5 L 45,20 Z"
                fill="url(#crestGold)"
                stroke="#B45309"
                strokeWidth="1.5"
            />
            <circle cx="12" cy="5" r="2" fill="#FEF08A" />
            <circle cx="25" cy="14" r="2" fill="#FEF08A" />
            <circle cx="38" cy="5" r="2" fill="#FEF08A" />
        </g>

        {/* Fluttering Tricolour Ribbons to the right */}
        <g id="tricolor-flourish">
            {/* Saffron Ribbon */}
            <path
                d="M 45,34 C 60,26 72,28 88,20 C 85,26 80,31 92,34 C 76,36 64,32 45,40 Z"
                fill="url(#flagSaffron)"
            />
            {/* White Ribbon */}
            <path
                d="M 45,40 C 64,32 76,36 92,34 C 88,40 82,45 94,48 C 76,49 62,45 45,47 Z"
                fill="#FFFFFF"
                opacity="0.95"
            />
            {/* Green Ribbon */}
            <path
                d="M 45,47 C 62,45 76,49 94,48 C 90,54 84,60 96,62 C 78,61 60,56 45,54 Z"
                fill="url(#flagGreen)"
            />
        </g>

        {/* Ashoka Chakra Wheel */}
        <g id="chakra-circle" transform="translate(25, 48)">
            <circle cx="0" cy="0" r="20" stroke="#00E5FF" strokeWidth="2.5" fill="#040A1A" />
            <circle cx="0" cy="0" r="15" stroke="#38BDF8" strokeWidth="1" />
            <circle cx="0" cy="0" r="4" fill="#00E5FF" />
            {Array.from({ length: 24 }, (_, i) => {
                const a = (i * 15 * Math.PI) / 180;
                return (
                    <line
                        key={i}
                        x1={4 * Math.cos(a)}
                        y1={4 * Math.sin(a)}
                        x2={15 * Math.cos(a)}
                        y2={15 * Math.sin(a)}
                        stroke="#7DD3FC"
                        strokeWidth="0.9"
                    />
                );
            })}
        </g>
    </svg>
);