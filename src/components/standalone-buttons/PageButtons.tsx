import React, { type ButtonHTMLAttributes, type CSSProperties } from "react";
import { RectangleButtons, type RectangleButtonVariant } from "@/src/shaders/rectangle-buttons/RectangleButtons";
import { LumenCta as BaseLumenCta } from "@/src/shaders/lumen-cta/LumenCta";

export interface PageButtonBaseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  mode?: "dark" | "light";
  style?: CSSProperties;
}

/** Helper wrapper using the native TSX SelectedPageButton engine */
function renderPageButton(variant: RectangleButtonVariant, props: PageButtonBaseProps) {
  const { mode = "dark", className = "", style, onClick, disabled } = props;
  return (
    <div
      onClick={disabled ? undefined : (onClick as any)}
      style={{ display: "inline-block", cursor: disabled ? "not-allowed" : "pointer", ...style }}
    >
      <RectangleButtons
        variant={variant}
        mode={mode}
        className={className}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Page Buttons (Pure TSX & Scoped CSS Variables, Zero Iframes)               */
/* -------------------------------------------------------------------------- */

export const TrochilSignalButton: React.FC<PageButtonBaseProps> = (props) =>
  renderPageButton("trochil-signal", props);

export const AttuneThermalButton: React.FC<PageButtonBaseProps> = (props) =>
  renderPageButton("attune-thermal", props);

export const TideformOutlineButton: React.FC<PageButtonBaseProps> = (props) =>
  renderPageButton("tideform-outline", props);

export const UnderstoryArrowPillButton: React.FC<PageButtonBaseProps> = (props) =>
  renderPageButton("understory-arrow-pill", props);

export const MeridianKeycapPrimaryButton: React.FC<PageButtonBaseProps> = (props) =>
  renderPageButton("meridian-keycap-primary", props);

export const MeridianKeycapSecondaryButton: React.FC<PageButtonBaseProps> = (props) =>
  renderPageButton("meridian-keycap-secondary", props);

export const HalvorsenArrowPillButton: React.FC<PageButtonBaseProps> = (props) =>
  renderPageButton("halvorsen-arrow-pill", props);

export const AsterGlassAccessButton: React.FC<PageButtonBaseProps> = (props) =>
  renderPageButton("aster-glass-access", props);

export const AsterGlassArrowButton: React.FC<PageButtonBaseProps> = (props) =>
  renderPageButton("aster-glass-arrow", props);

export const EmberKeycapButton: React.FC<PageButtonBaseProps> = (props) =>
  renderPageButton("ember-keycap", props);

export const DarkGlassButton: React.FC<PageButtonBaseProps> = (props) =>
  renderPageButton("dark-pill", props);

/* -------------------------------------------------------------------------- */
/* Lumen CTA Buttons (Native TSX & lumen-cta.css, Zero Iframes)               */
/* -------------------------------------------------------------------------- */

export interface LumenButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  mode?: "dark" | "light";
  ring?: boolean;
}

export const LumenCta: React.FC<LumenButtonProps> = ({
  label = "Get your card",
  mode = "dark",
  ring = true,
  className = "",
  style,
  onClick,
  disabled,
}) => {
  return (
    <BaseLumenCta
      variant="primary"
      mode={mode}
      label={label}
      ring={ring}
      className={className}
      style={style}
      onClick={onClick}
      disabled={disabled}
    />
  );
};

export const LumenCtaGhost: React.FC<LumenButtonProps> = ({
  label = "Get your card",
  mode = "dark",
  ring = true,
  className = "",
  style,
  onClick,
  disabled,
}) => {
  return (
    <BaseLumenCta
      variant="ghost"
      mode={mode}
      label={label}
      ring={ring}
      className={className}
      style={style}
      onClick={onClick}
      disabled={disabled}
    />
  );
};
