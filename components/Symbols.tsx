export const LotusIcon = ({ className = "" }: { className?: string }) => (
    <svg viewBox="0 0 120 110" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(60,72)">
            {([-60, -40, -20, 0, 20, 40, 60] as number[]).map((angle, i) => (
                <ellipse
                    key={i}
                    rx="9"
                    ry="34"
                    transform={`rotate(${angle})`}
                    opacity={Math.abs(angle) > 40 ? 0.55 : 0.9}
                />
            ))}
            {([-78, 78] as number[]).map((angle, i) => (
                <ellipse key={i + 10} rx="7" ry="26" transform={`rotate(${angle})`} opacity={0.35} />
            ))}
            <circle r="13" />
        </g>
    </svg>
);

export const DharmaChakra = ({ className = "" }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" strokeWidth="3" />
        <circle cx="50" cy="50" r="32" />
        <circle cx="50" cy="50" r="9" fill="currentColor" stroke="none" />
        {Array.from({ length: 24 }, (_, i) => {
            const angle = (i * 15 * Math.PI) / 180;
            const inner = i % 2 === 0 ? 32 : 9;
            return (
                <line
                    key={i}
                    x1={50 + inner * Math.cos(angle)}
                    y1={50 + inner * Math.sin(angle)}
                    x2={50 + 46 * Math.cos(angle)}
                    y2={50 + 46 * Math.sin(angle)}
                    strokeWidth={i % 2 === 0 ? 2 : 1}
                    opacity={i % 2 === 0 ? 1 : 0.5}
                />
            );
        })}
    </svg>
);

export const TrishulIcon = ({ className = "" }: { className?: string }) => (
    <svg viewBox="0 0 64 110" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <polygon points="32,2 25,26 39,26" />
        <rect x="29.5" y="23" width="5" height="58" />
        <polygon points="12,16 5,34 20,30" />
        <rect x="10" y="27" width="4.5" height="26" transform="rotate(-13 12 40)" />
        <polygon points="52,16 59,34 44,30" />
        <rect x="49.5" y="27" width="4.5" height="26" transform="rotate(13 52 40)" />
        <rect x="10" y="26" width="44" height="3.5" />
        <rect x="29.5" y="81" width="5" height="22" />
        <ellipse cx="32" cy="104" rx="11" ry="5" />
    </svg>
);