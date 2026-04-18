"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [guidelines, setGuidelines] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/guidelines")
      .then((r) => r.json())
      .then((d) => setGuidelines(d.guidelines))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/guidelines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guidelines }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Save failed");
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Coaching Guidelines</h1>
        <p className="text-gray-600 text-sm mt-1">
          These guidelines are injected into every plan generation as your professional
          coaching voice. Claude will follow them as authoritative rules.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
        {loading ? (
          <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
            Loading...
          </div>
        ) : (
          <>
            <textarea
              value={guidelines}
              onChange={(e) => setGuidelines(e.target.value)}
              rows={20}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-500 resize-y"
            />
            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}
            <div className="flex items-center gap-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold px-5 py-2 rounded-xl text-sm transition-colors"
              >
                {saving ? "Saving..." : "Save Guidelines"}
              </button>
              {saved && (
                <span className="text-green-600 text-sm font-medium">Saved!</span>
              )}
            </div>
          </>
        )}
      </div>

      <a href="/" className="text-sm text-green-600 hover:underline">
        ← Back to plan builder
      </a>
    </div>
  );
}
