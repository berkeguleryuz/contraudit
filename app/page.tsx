"use client";
import { ClodronCardCarousel } from "@/components/CardCarousel";
import Hero from "@/components/Hero";
import MainHero from "@/components/MainHero";
import ReactCodeEditor from "@/components/ReactCodeEditor";
import { useState } from "react";
import { analyzeContract, fixIssues } from "@/lib/ai-prompt";
import ResultModel from "@/components/Result";
import { Backgroundhero } from "@/components/Stars";

export default function Home() {
  const [contract, setContract] = useState("");
  const [results, setResults] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setIsModalOpen(true);
    const results = await analyzeContract(contract, setResults, setLoading);
  };

  const fixIssue = async () => {
    const results = await analyzeContract(contract, setResults, setLoading);
    if (Array.isArray(results) && results !== null) {
      const suggestions = results.find(
        (r: any) => r.section === "Suggestions for Improvement",
      )?.details;

      if (suggestions) {
        await fixIssues(contract, suggestions, setContract, setLoading);
      } else {
        console.error("Suggestions for Improvement section not found.");
      }
    } else {
      console.error("Results is not an array or is null/undefined.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between space-y-5">
      <Backgroundhero />
      <ReactCodeEditor
        analyze={analyze}
        contract={contract}
        setContract={setContract}
      />

      <ResultModel
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        loading={loading}
        results={results}
        fixIssuess={fixIssue}
      />

      <ClodronCardCarousel />
      <Hero />
    </main>
  );
}
