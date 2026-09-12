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