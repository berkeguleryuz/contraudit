"use client";
import { ClodronCardCarousel } from "@/components/CardCarousel";
import Image from "next/image";
import { PulseBeamsButton } from "@/components/ui/pulse-beams-button";
import Hero from "@/components/Hero";
import MainHero from "@/components/MainHero";
import ReactCodeEditor from "@/components/ReactCodeEditor";
import { useState } from "react";

export default function Home() {
  const [contract, setContract] = useState("");
  const [results, setResults] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {};

  return (
    <main className="flex min-h-screen flex-col items-center justify-between space-y-5">
      <MainHero />
      <PulseBeamsButton label="Hello!" />
      <ReactCodeEditor
        analyze={analyze}
        contract={contract}
        setContract={setContract}
      />
      <ClodronCardCarousel />
      <Hero />
    </main>
  );
}
