import { NextResponse } from "next/server";
import { getMatchHistory } from "@/lib/backend/history";

export async function GET() {
  try {
    const matches = await getMatchHistory();
    return NextResponse.json({ matches });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nie udało się wczytać historii.";
    return NextResponse.json({ error: message }, { status: 403 });
  }
}
