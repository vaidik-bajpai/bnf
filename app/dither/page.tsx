import React from "react";
import DitherVeilGatewayComposition from "@/components/home/DitherVeilGatewayComposition";

export const metadata = {
  title: "Gateway Constellation & Dither Veil | Pitch Black",
  description: "Pitch black page with Gateway Constellation and Dither Veil head.",
};

export default function DitherPage() {
  return (
    <main className="w-screen h-screen bg-black overflow-hidden m-0 p-0 select-none">
      <DitherVeilGatewayComposition />
    </main>
  );
}
