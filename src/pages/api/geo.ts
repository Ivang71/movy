import type { NextApiRequest, NextApiResponse } from "next";

/** Best-effort country lookup from CDN headers; falls back to "US". */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const country = (req.headers["cf-ipcountry"] as string | undefined) ?? (req.headers["x-vercel-ip-country"] as string | undefined) ?? "US";
  res.setHeader("Cache-Control", "private, no-store");
  res.status(200).json({ country });
}
