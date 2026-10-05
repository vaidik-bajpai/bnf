import React, { useState } from "react";

export interface SkeuomorphicToggleProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultChecked?: boolean;
  checked?: boolean;
  onToggle?: (checked: boolean) => void;
  label?: string;
}

export function SkeuomorphicToggle({
  defaultChecked = false,
  checked: controlledChecked,
  onToggle,
  label = "Power Switch",
  className = "",
  style,
  ...props
}: SkeuomorphicToggleProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = controlledChecked !== undefined ? controlledChecked : internalChecked;

  const handleToggle = () => {
    const next = !isChecked;
    if (controlledChecked === undefined) setInternalChecked(next);
    onToggle?.(next);
  };

  return (
    <div
      className={`inline-flex items-center gap-4 ${className}`}
      style={{ fontFamily: "inherit", ...style }}
      {...props}
    >
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        onClick={handleToggle}
        className="relative inline-flex h-9 w-16 cursor-pointer rounded-full p-1 transition-colors duration-300 ease-in-out"
        style={{
          background: isChecked ? "#10b981" : "#262626",
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.1)",
        }}
      >
        <span
          className="inline-block h-7 w-7 rounded-full bg-gradient-to-b from-white to-neutral-300 transition-transform duration-300 ease-in-out"
          style={{
            transform: isChecked ? "translateX(28px)" : "translateX(0px)",
            boxShadow: "0 2px 5px rgba(0,0,0,0.5), inset 0 1px 0 #fff",
          }}
        />
      </button>
      {label && <span className="text-sm font-medium text-neutral-300 select-none">{label}</span>}
    </div>
  );
}
