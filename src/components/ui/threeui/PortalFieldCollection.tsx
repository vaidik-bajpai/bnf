import React from "react";
import { WarpFieldBackground } from "./WarpFieldBackground";

export interface PortalFieldCollectionProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
}

export function PortalFieldCollection({
  speed = 1,
  className = "",
  style,
  ...props
}: PortalFieldCollectionProps) {
  return (
    <div className={`w-full h-full min-h-[300px] ${className}`} style={style} {...props}>
      <WarpFieldBackground speed={speed} />
    </div>
  );
}
