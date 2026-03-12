import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Persisted outside .next so redeploys keep data
const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "profiles.json");

function readProfiles(): object[] {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(DB_FILE)) return [];
    return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  } catch {
    return [];
  }
}

function writeProfiles(profiles: object[]): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(profiles, null, 2), "utf8");
}

// GET /api/profiles
export async function GET() {
  return NextResponse.json(readProfiles());
}

// POST /api/profiles  — create
export async function POST(req: NextRequest) {
  const profile = await req.json();
  const profiles = readProfiles();
  profiles.push(profile);
  writeProfiles(profiles);
  return NextResponse.json(profile, { status: 201 });
}

// PUT /api/profiles  — update one
export async function PUT(req: NextRequest) {
  const updated = await req.json();
  const profiles = readProfiles() as { id: string }[];
  const idx = profiles.findIndex((p) => p.id === updated.id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  profiles[idx] = updated;
  writeProfiles(profiles);
  return NextResponse.json(updated);
}

// DELETE /api/profiles?id=xxx
export async function DELETE(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");
  const profiles = (readProfiles() as { id: string }[]).filter((p) => p.id !== id);
  writeProfiles(profiles);
  return NextResponse.json({ ok: true });
}
