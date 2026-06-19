import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { canUseSupabase, createClient } from "@/lib/supabase/server";

// Stores / removes the browser's Web Push subscription for the logged-in user.
// RLS (migration 0009) guarantees a user can only touch their own rows, so we rely on
// the authenticated server client rather than the admin client here.

const subscriptionSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string().min(1),
    auth: z.string().min(1)
  })
});

const unsubscribeSchema = z.object({ endpoint: z.string().url() });

async function getUserId() {
  if (!canUseSupabase()) return { supabase: null, userId: null };
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  return { supabase, userId: claims?.claims.sub ?? null };
}

export async function POST(request: NextRequest) {
  const { supabase, userId } = await getUserId();
  if (!supabase || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = subscriptionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid subscription payload." }, { status: 400 });
  }

  const { endpoint, keys } = parsed.data;
  const userAgent = request.headers.get("user-agent");

  const { error } = await supabase
    .from("push_subscriptions")
    .upsert(
      { user_id: userId, endpoint, p256dh: keys.p256dh, auth: keys.auth, user_agent: userAgent },
      { onConflict: "endpoint" }
    );

  if (error) {
    return NextResponse.json({ error: "Could not save subscription." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const { supabase, userId } = await getUserId();
  if (!supabase || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = unsubscribeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const { error } = await supabase
    .from("push_subscriptions")
    .delete()
    .eq("user_id", userId)
    .eq("endpoint", parsed.data.endpoint);

  if (error) {
    return NextResponse.json({ error: "Could not remove subscription." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
