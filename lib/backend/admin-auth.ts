import { NextRequest } from "next/server";

export function isAuthorizedAdminRequest(request: NextRequest) {
  const configuredSecret = process.env.CRON_SECRET;

  if (!configuredSecret) {
    return process.env.NODE_ENV !== "production";
  }

  const header = request.headers.get("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : null;

  return token === configuredSecret;
}
