import { NextResponse } from "next/server";
import { getGuidelines, saveGuidelines } from "@/lib/guidelines";

export async function GET() {
  const guidelines = getGuidelines();
  return NextResponse.json({ guidelines });
}

export async function POST(req: Request) {
  const { guidelines } = await req.json();
  if (typeof guidelines !== "string" || !guidelines.trim()) {
    return NextResponse.json({ error: "Guidelines cannot be empty" }, { status: 400 });
  }
  saveGuidelines(guidelines.trim());
  return NextResponse.json({ ok: true });
}
