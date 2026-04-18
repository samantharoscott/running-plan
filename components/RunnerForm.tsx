"use client";

import { useState } from "react";

export interface RunnerProfile {
  age: string;
  activityLevel: "sedentary" | "light" | "moderate";
  daysPerWeek: string;
  weeks: string;
  limitations: string;
}

interface Props {
  onSubmit: (profile: RunnerProfile) => void;
}

export default function RunnerForm({ onSubmit }: Props) {
  const [form, setForm] = useState<RunnerProfile>({
    age: "",
    activityLevel: "sedentary",
    daysPerWeek: "3",
    weeks: "10",
    limitations: "",
  });

  function set(field: keyof RunnerProfile, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Age
          </label>
          <input
            type="number"
            min={16}
            max={90}
            required
            value={form.age}
            onChange={(e) => set("age", e.target.value)}
            placeholder="e.g. 34"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current activity level
          </label>
          <select
            value={form.activityLevel}
            onChange={(e) => set("activityLevel", e.target.value as RunnerProfile["activityLevel"])}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="sedentary">Sedentary — mostly sitting</option>
            <option value="light">Lightly active — walking occasionally</option>
            <option value="moderate">Moderately active — regular movement</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Days available to train per week
          </label>
          <select
            value={form.daysPerWeek}
            onChange={(e) => set("daysPerWeek", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="3">3 days</option>
            <option value="4">4 days</option>
            <option value="5">5 days</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preferred plan length
          </label>
          <select
            value={form.weeks}
            onChange={(e) => set("weeks", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="8">8 weeks</option>
            <option value="10">10 weeks</option>
            <option value="12">12 weeks</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Any injuries or physical limitations? <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={form.limitations}
          onChange={(e) => set("limitations", e.target.value)}
          rows={3}
          placeholder="e.g. mild knee pain, lower back issues..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
      >
        Generate My Plan
      </button>
    </form>
  );
}
