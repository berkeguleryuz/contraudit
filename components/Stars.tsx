"use client";
import React from "react";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { ArrowRight } from "lucide-react";
export function Backgroundhero() {
  return (
    <div className="h-[20rem] group rounded-md bg-neutral-900 flex flex-col items-center justify-center relative w-full">
      <h2 className="relative flex-col md:flex-row z-10 text-3xl md:text-5xl md:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-white to-white flex items-center gap-2 md:gap-8">
        <span>Write your code.</span>
        <span className="text-white text-lg font-thin">x</span>
        <span>Upgrade your contract.</span>
      </h2>
      <ShootingStars />
      <StarsBackground />
      <ArrowRight className="w-8 h-8 text-white mt-5 group-hover:rotate-90 transition-all" />
    </div>
  );
}
