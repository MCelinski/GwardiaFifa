"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { league } from "@/lib/mock-data";

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  inviteCode: z.string().min(4).default(league.inviteCode),
  displayName: z.string().min(2).optional()
});

export async function signInAction(formData: FormData) {
  const data = authSchema.pick({ email: true, password: true, inviteCode: true }).parse({
    email: formData.get("email"),
    password: formData.get("password"),
    inviteCode: formData.get("inviteCode") ?? league.inviteCode
  });

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password
  });

  if (error) {
    redirect(`/?error=${encodeURIComponent(error.message)}`);
  }

  await (supabase.rpc as unknown as (fn: string, args: Record<string, unknown>) => Promise<unknown>)("join_league_by_code", {
    code: data.inviteCode
  });
  redirect("/dashboard");
}

export async function signUpAction(formData: FormData) {
  const data = authSchema.parse({
    email: formData.get("email"),
    password: formData.get("password"),
    inviteCode: formData.get("inviteCode") ?? league.inviteCode,
    displayName: formData.get("displayName") || undefined
  });

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        display_name: data.displayName ?? data.email.split("@")[0]
      }
    }
  });

  if (error) {
    redirect(`/?error=${encodeURIComponent(error.message)}`);
  }

  await (supabase.rpc as unknown as (fn: string, args: Record<string, unknown>) => Promise<unknown>)("join_league_by_code", {
    code: data.inviteCode
  });
  redirect("/dashboard");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
