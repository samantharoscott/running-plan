"use client";

interface Props {
  plan: string;
  onReset: () => void;
}

interface Session {
  day: string;
  type: string;
  description: string;
}

interface Week {
  weekNumber: number;
  focus: string;
  sessions: Session[];
}

interface ParsedPlan {
  intro: string;
  weeks: Week[];
  tips: string[];
}

const DAY_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function sortSessions(sessions: Session[]): Session[] {
  return [...sessions].sort(
    (a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day)
  );
}

function parsePlan(raw: string): ParsedPlan {
  try {
    return JSON.parse(raw) as ParsedPlan;
  } catch {
    return { intro: raw, weeks: [], tips: [] };
  }
}

const sessionColors: Record<string, string> = {
  rest: "bg-gray-100 text-gray-600 border-gray-200",
  walk: "bg-blue-50 text-blue-700 border-blue-200",
  "walk/run": "bg-teal-50 text-teal-700 border-teal-200",
  run: "bg-green-50 text-green-700 border-green-200",
  "easy run": "bg-green-50 text-green-700 border-green-200",
  cross: "bg-purple-50 text-purple-700 border-purple-200",
  default: "bg-orange-50 text-orange-700 border-orange-200",
};

function sessionColor(type: string) {
  const key = type.toLowerCase();
  for (const [k, v] of Object.entries(sessionColors)) {
    if (key.includes(k)) return v;
  }
  return sessionColors.default;
}

export default function RunningPlan({ plan, onReset }: Props) {
  const parsed = parsePlan(plan);

  if (!parsed.weeks.length) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <pre className="whitespace-pre-wrap text-sm text-gray-700">{parsed.intro}</pre>
        </div>
        <button
          onClick={onReset}
          className="text-sm text-green-600 hover:underline"
        >
          ← Start over
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your 5K Training Plan</h2>
          {parsed.intro && (
            <p className="text-gray-600 text-sm mt-1">{parsed.intro}</p>
          )}
        </div>
        <button
          onClick={onReset}
          className="shrink-0 text-sm text-green-600 hover:underline"
        >
          ← Start over
        </button>
      </div>

      {parsed.weeks.map((week) => (
        <div
          key={week.weekNumber}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <span className="font-semibold text-gray-900 text-sm">
              Week {week.weekNumber}
            </span>
            {week.focus && (
              <span className="text-xs text-gray-500 italic">{week.focus}</span>
            )}
          </div>
          <div className="divide-y divide-gray-100">
            {sortSessions(week.sessions).map((session, i) => (
              <div key={i} className="px-5 py-3 flex items-start gap-3">
                <span className="text-xs font-medium text-gray-400 w-8 shrink-0 pt-0.5">
                  {session.day}
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full border shrink-0 ${sessionColor(session.type)}`}
                >
                  {session.type}
                </span>
                <span className="text-sm text-gray-700">{session.description}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {parsed.tips.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
          <h3 className="font-semibold text-green-800 text-sm mb-2">Coaching Tips</h3>
          <ul className="space-y-1">
            {parsed.tips.map((tip, i) => (
              <li key={i} className="text-sm text-green-800 flex gap-2">
                <span>•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
