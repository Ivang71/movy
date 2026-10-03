import type { NextApiRequest, NextApiResponse } from "next";
import { getSeasonEpisodes } from "@/lib/data";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = typeof req.query.id === "string" ? req.query.id : "";
  const season = Number(req.query.season ?? 1) || 1;
  const locale = typeof req.query.locale === "string" ? req.query.locale : "en";
  if (!id) return res.status(400).json({ episodes: [] });
  try {
    const episodes = await getSeasonEpisodes(id, season, locale);
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    return res.status(200).json({ episodes });
  } catch (e) {
    return res.status(502).json({ episodes: [], error: (e as Error).message });
  }
}
