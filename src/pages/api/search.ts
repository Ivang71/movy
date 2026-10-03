import type { NextApiRequest, NextApiResponse } from "next";
import { getHomeData, search } from "@/lib/data";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const q = typeof req.query.q === "string" ? req.query.q : "";
  const locale = typeof req.query.locale === "string" ? req.query.locale : "en";
  try {
    if (!q.trim()) {
      const home = await getHomeData(locale);
      res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=3600");
      return res.status(200).json({ items: home.trending.slice(0, 16) });
    }
    const items = await search(q, locale);
    res.setHeader("Cache-Control", "public, s-maxage=120, stale-while-revalidate=600");
    return res.status(200).json({ items });
  } catch (e) {
    return res.status(502).json({ items: [], error: (e as Error).message });
  }
}
