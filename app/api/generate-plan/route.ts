import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getGuidelines } from "@/lib/guidelines";

const client = new Anthropic();

export async function POST(req: Request) {
  const { age, activityLevel, daysPerWeek, weeks, limitations } = await req.json();

  if (!age || !activityLevel || !daysPerWeek || !weeks) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const guidelines = getGuidelines();

  const systemPrompt = `${guidelines}

OUTPUT FORMAT:
Always respond with valid JSON matching this exact structure — no markdown, no code fences, just raw JSON:
{
  "intro": "One or two sentence personalised intro addressing the runner directly",
  "weeks": [
    {
      "weekNumber": 1,
      "focus": "Short label e.g. 'Building the habit'",
      "sessions": [
        { "day": "Mon", "type": "Walk/Run", "description": "5' walk + 6x(1' run/2' walk) + 5' walk" },
        { "day": "Tue", "type": "Rest", "description": "Rest or stretch" }
      ]
    }
  ],
  "tips": ["Tip 1", "Tip 2", "Tip 3"]
}

Session type must be one of: Rest, Walk, Walk/Run, Easy Run, Cross, Strength.
Include exactly ${daysPerWeek} active days and the remaining days as Rest each week.
Generate all ${weeks} weeks.
Keep descriptions concise — use abbreviated notation (e.g. "5' walk + 4x(2' run/1' walk) + 5' walk"). No full sentences.`;

  const userMessage = `Please create a ${weeks}-week 5K training plan for the following runner:
- Age: ${age}
- Current activity level: ${activityLevel}
- Training days available per week: ${daysPerWeek}
- Physical limitations: ${limitations || "None"}

Apply your coaching guidelines strictly. Make the plan progressive and realistic for a complete beginner.`;

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 3000,
      system: [
        {
          type: "text",
          text: systemPrompt,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: userMessage }],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ error: "Unexpected response from AI" }, { status: 500 });
    }

    const raw = content.text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
    JSON.parse(raw);

    return NextResponse.json({ plan: raw });
  } catch (err) {
    console.error("Claude API error:", err);
    return NextResponse.json(
      { error: "Failed to generate plan. Please check your API key and try again." },
      { status: 500 }
    );
  }
}
