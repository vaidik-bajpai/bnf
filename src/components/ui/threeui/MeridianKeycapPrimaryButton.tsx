// Auto-generated isolated component
import React, { useRef } from "react";

export interface MeridianKeycapPrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  mode?: "dark" | "light";
  children?: React.ReactNode;
  magnetic?: boolean;
}

export function MeridianKeycapPrimaryButton({
  mode = "dark",
  children = "Start free",
  magnetic = false,
  className = "",
  style,
  ...props
}: MeridianKeycapPrimaryButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  

  return (
    <div data-mode={mode} className="inline-block relative">
      <style>{`
.threeui-page-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  font: inherit;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  -webkit-font-smoothing: antialiased;
}
.threeui-page-button:focus-visible {
  outline: 2px solid var(--threeui-page-ink);
  outline-offset: 5px;
}


.threeui-page-button--trochil {
  height: 52px;
  padding: 0 30px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, .27);
  background: linear-gradient(180deg, rgba(255, 255, 255, .07), rgba(0, 0, 0, .36));
  box-shadow: 0 15px 36px rgba(0, 0, 0, .48), inset 0 1px rgba(255, 255, 255, .08);
  color: rgba(255, 255, 255, .82);
  font-size: 14px;
  font-weight: 500;
  transition: border-color .28s ease, color .28s ease, transform .28s ease, box-shadow .28s ease;
}
.threeui-page-button--trochil::before {
  content: "";
  position: absolute;
  inset: -1px;
  background: linear-gradient(105deg, transparent 17%, rgba(251, 215, 54, .25) 48%, transparent 76%);
  transform: translateX(-125%);
  transition: transform .65s cubic-bezier(.22, .61, .36, 1);
}
.threeui-page-button--trochil span { position: relative; }
.threeui-page-button--trochil:hover {
  border-color: rgba(251, 215, 54, .58);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 18px 42px rgba(0, 0, 0, .58), 0 0 24px rgba(251, 215, 54, .12);
}
.threeui-page-button--trochil:hover::before { transform: translateX(125%); }


.threeui-page-button--attune {
  gap: 10px;
  height: 52px;
  padding: 0 22px;
  border-radius: 11px;
  background: linear-gradient(180deg, #ffa347 0%, #ff7a14 48%, #f2610a 100%);
  box-shadow: inset 0 1px rgba(255, 255, 255, .26), 0 8px 28px rgba(255, 122, 20, .28);
  color: #1a0e04;
  font-size: 14px;
  font-weight: 650;
  letter-spacing: .012em;
  transition: filter .18s ease, transform .18s ease, box-shadow .18s ease;
}
.threeui-page-button--attune svg { width: 8px; height: 12px; fill: none; stroke: currentColor; stroke-width: 1.7; }
.threeui-page-button--attune:hover { filter: brightness(1.09); transform: translateY(-2px); box-shadow: inset 0 1px rgba(255, 255, 255, .34), 0 12px 34px rgba(255, 122, 20, .36); }
.threeui-page-button--attune:active { transform: translateY(1px); }


.threeui-page-button--tideform {
  gap: 18px;
  padding: 17px 24px;
  border: 1px solid rgba(255, 255, 255, .22);
  background: rgba(255, 255, 255, .055);
  box-shadow: inset 0 1px rgba(255, 255, 255, .035);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .16em;
  text-transform: uppercase;
  transition: border-color .25s ease, background-color .25s ease, color .25s ease;
}
.threeui-page-button--tideform svg { width: 21px; height: 9px; fill: none; stroke: currentColor; stroke-width: 1.25; transition: transform .25s cubic-bezier(.2, .8, .2, 1); }
.threeui-page-button--tideform:hover { border-color: #ff7a18; color: #ff7a18; background: rgba(255, 122, 24, .14); }
.threeui-page-button--tideform:hover svg { transform: translateX(4px); }


.threeui-page-button--arrow-pill {
  gap: 18px;
  height: 54px;
  padding: 0 11px 0 36px;
  border-radius: 999px;
  font-size: 17px;
  letter-spacing: -.005em;
  transition: background .3s ease, transform .3s ease, color .3s ease;
}
.threeui-page-button--arrow-pill .threeui-page-button__disc {
  display: grid;
  width: 32px;
  height: 32px;
  flex: none;
  
  border-radius: 50%;
}
.threeui-page-button--arrow-pill svg { width: 11px; height: 11px; fill: none; stroke: currentColor; stroke-width: 2; transition: transform .3s ease; }
.threeui-page-button--arrow-pill:hover { transform: translateY(-2px); }
.threeui-page-button--arrow-pill:hover svg { transform: translateX(2px); }
.threeui-page-button--understory {
  background: #9b78d0;
  color: #fff;
  box-shadow: 0 14px 30px rgba(82, 53, 112, .18);
}
.threeui-page-button--understory .threeui-page-button__disc { background: #f6f3ed; color: #9b78d0; }
.threeui-page-button--understory:hover { background: #8d69c5; }


.threeui-page-button--halvorsen {
  background: #f0eee7;
  color: #111113;
  box-shadow: 0 14px 34px rgba(0, 0, 0, .32);
}
.threeui-page-button--halvorsen .threeui-page-button__disc { background: #111113; color: #f0eee7; }
.threeui-page-button--halvorsen:hover { background: #fff; }


.threeui-page-button--meridian {
  height: 62px;
  padding: 0 30px;
  border-radius: 15px;
  flex-shrink: 0;
  background: #0c1017;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .07);
}
.threeui-page-button--meridian::before {
  content: "";
  position: absolute;
  inset: 3px 4px 9px;
  border-radius: 12px;
  background: linear-gradient(180deg, #2a3142, #1c2230);
  box-shadow: 0 5px 0 #080b11, 0 9px 15px -2px rgba(0, 0, 0, .62), inset 0 1px rgba(255, 255, 255, .11);
  transition: transform .13s cubic-bezier(.22, .61, .36, 1), box-shadow .13s cubic-bezier(.22, .61, .36, 1);
}
.threeui-page-button--meridian > span:not(.threeui-page-button__led) {
  position: relative;
  z-index: 1;
  color: #dde5f2;
  font-size: 14.5px;
  font-weight: 600;
  letter-spacing: -.005em;
}
.threeui-page-button--meridian .threeui-page-button__led {
  position: absolute;
  z-index: 1;
  top: 12px;
  left: 50%;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(255, 255, 255, .16);
  transform: translateX(-50%);
  transition: background .22s ease, box-shadow .22s ease;
}
.threeui-page-button--meridian:hover::before { transform: translateY(4px); box-shadow: 0 1px 0 #080b11, 0 3px 8px -2px rgba(0, 0, 0, .55), inset 0 1px rgba(255, 255, 255, .11); }
.threeui-page-button--meridian:hover .threeui-page-button__led { background: #4da3ff; box-shadow: 0 0 7px #4da3ff; }
.threeui-page-button--meridian-primary { background: #050f1c; box-shadow: inset 0 0 0 1px rgba(77, 163, 255, .22); }
.threeui-page-button--meridian-primary::before { background: linear-gradient(180deg, #6db6ff, #2e85e8); box-shadow: 0 5px 0 #0b4a86, 0 9px 18px -2px rgba(21, 88, 158, .5), inset 0 1px rgba(255, 255, 255, .5); }
.threeui-page-button--meridian-primary > span:not(.threeui-page-button__led) { color: #04182f; }
.threeui-page-button--meridian-primary .threeui-page-button__led { background: rgba(4, 24, 47, .3); }
.threeui-page-button--meridian-primary:hover::before { box-shadow: 0 1px 0 #0b4a86, 0 3px 10px -2px rgba(21, 88, 158, .45), inset 0 1px rgba(255, 255, 255, .5); }
.threeui-page-button--meridian-primary:hover .threeui-page-button__led { background: #04182f; box-shadow: 0 0 6px rgba(4, 24, 47, .55); }


.threeui-page-button--aster {
  height: 52px;
  border-radius: 12px;
  isolation: isolate;
  background: rgba(255, 255, 255, .055);
  color: #f1f1f1;
  font-size: 17px;
  font-variation-settings: "wdth" 100, "opsz" 14;
  letter-spacing: -.004em;
  box-shadow: 0 12px 34px -22px rgba(255, 255, 255, .35);
  backdrop-filter: blur(16px) saturate(1.25);
  -webkit-backdrop-filter: blur(16px) saturate(1.25);
  transition: transform .5s cubic-bezier(.22, 1, .36, 1), background .4s ease, color .4s ease, box-shadow .5s cubic-bezier(.22, 1, .36, 1);
}
.threeui-page-button--aster::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(148deg, rgba(255, 255, 255, .72), rgba(255, 255, 255, .16) 34%, rgba(255, 255, 255, .05) 58%, rgba(255, 255, 255, .34));
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  pointer-events: none;
  transition: filter .45s cubic-bezier(.22, 1, .36, 1);
}
.threeui-page-button--aster::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  background: linear-gradient(180deg, rgba(255, 255, 255, .13), transparent 46%);
  pointer-events: none;
}
.threeui-page-button--aster > span { position: relative; z-index: 1; }
.threeui-page-button--aster:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, .15);
  color: #fff;
  box-shadow: 0 8px 26px -12px rgba(255, 255, 255, .42);
}
.threeui-page-button--aster:hover::before { filter: brightness(1.55); }
.threeui-page-button--aster:active { transform: translateY(0); }
.threeui-page-button--aster-access { padding: 0 31px; }
.threeui-page-button--aster-arrow { gap: 17px; padding: 0 7px 0 22px; }
.threeui-page-button--aster-arrow .threeui-page-button__chip {
  display: grid;
  width: 34px;
  height: 34px;
  flex: none;
  
  border-radius: 9px;
  background: rgba(255, 255, 255, .10);
}
.threeui-page-button--aster-arrow .threeui-page-button__chip::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(150deg, rgba(255, 255, 255, .75), rgba(255, 255, 255, .10) 62%, rgba(255, 255, 255, .42));
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  pointer-events: none;
}
.threeui-page-button--aster-arrow svg {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.4;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform .5s cubic-bezier(.22, 1, .36, 1);
}
.threeui-page-button--aster-arrow:hover svg { transform: translateX(2px); }

/* ---------------------------------------------------------------- *
   The other ground

   Eight of these treatments were drawn on their page's dark ground and
   Understory on its paper one, so the opposite mode is a re-tone rather
   than a wash: the stage takes the other ground, and every value that
   ground would swallow — edge, ink, sheen, cast shadow — is restated at
   the weight it was authored to read at. Geometry and motion never move.
 * ---------------------------------------------------------------- */


/* Trochil — the amber signal sheen, now over warm paper */






/* Attune — the thermal cap already carries its own ink, so only the ground
   and the cast heat change */





/* Tideform — the outline drops to graphite and the hot state to a deeper
   orange, which is where it clears text contrast on paper */





/* Understory runs the other way: the violet capsule is the constant, and
   dark mode is the ground it was never given */





/* Halvorsen is a maximum-contrast pill, so on paper it inverts rather than
   fades — the capsule takes the ink and the endcap takes the paper */






/* Meridian — the keycap keeps its travel and its hard base edge; only the
   housing, the cap face, and the legend follow the light ground */








/* the primary cap stays blue on both grounds, so it is restated after the
   secondary block rather than inheriting it */







/* Aster — the glass is a white edge lit from one corner, so on paper the
   whole build flips to graphite and the hover brightening becomes darkening */









@media (prefers-reduced-motion: reduce) {
  .threeui-page-button, .threeui-page-button::before, .threeui-page-button svg { transition-duration: .01ms !important; }
}
      `}</style>
      <button
        ref={btnRef}
        type="button"
        className={`threeui-page-button threeui-page-button--meridian-keycap-primary ${className}`}
        style={style}
        
        {...props}
      >
        <span className="threeui-page-button__led" /><span>{children}</span>
      </button>
    </div>
  );
}
