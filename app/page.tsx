"use client";

import { useState } from "react";
import RunnerForm, { RunnerProfile } from "@/components/RunnerForm";
import RunningPlan from "@/components/RunningPlan";

export default function Home() {
  const [plan, setPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(profile: RunnerProfile) {
    setLoading(true);
    setError(null);
    setPlan(null);

    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate plan");
      }

      const data = await res.json();
      setPlan(data.plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setPlan(null);
    setError(null);
  }

  return (
    <div>
      {!plan && !loading && (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Build Your First 5K Plan
            </h1>
            <p className="text-gray-600">
              Answer a few quick questions and get a personalised training plan
              built around your schedule.
            </p>
          </div>
          <RunnerForm onSubmit={handleSubmit} />
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
        </>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 text-sm">Building your plan...</p>
        </div>
      )}

      {plan && !loading && (
        <RunningPlan plan={plan} onReset={handleReset} />
      )}
    </div>
  );
}
