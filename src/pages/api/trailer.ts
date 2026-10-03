import type { NextApiRequest, NextApiResponse } from "next";
import type { MediaType } from "@/lib/types";
import { getDetails } from "@/lib/data";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const type = (typeof req.query.type === "string" ? req.query.type : "movie") as MediaType;
  const id = typeof req.query.id === "string" ? req.query.id : "";
  const locale = typeof req.query.locale === "string" ? req.query.locale : "en";
  if (!id || !["movie", "tv", "anime"].includes(type)) return res.status(400).json({ key: null });
  try {
    const d = await getDetails(type, id, locale);
    res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
    return res.status(200).json({ key: d?.trailerId ?? null });
  } catch {
    return res.status(200).json({ key: null });
  }
}
