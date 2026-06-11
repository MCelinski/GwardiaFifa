import { createClient } from "@/lib/supabase/server";
import { formatWarsawDateTime } from "@/lib/time";

export type SyncLogRow = {
  time: string;
  job: string;
  status: string;
  detail: string;
};

export async function getRecentSyncLogs(limit = 20): Promise<SyncLogRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sync_logs")
    .select("job, status, detail, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return data.map((row) => ({
    time: row.created_at ? formatWarsawDateTime(new Date(row.created_at)) : "-",
    job: row.job,
    status: row.status,
    detail: row.detail ?? ""
  }));
}
