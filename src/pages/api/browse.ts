import type { NextApiRequest, NextApiResponse } from "next";
import type { BrowseFilters, MediaType } from "@/lib/types";
import { getBrowse, getNetworkTv } from "@/lib/data";

const str = (v: string | string[] | undefined) => (typeof v === "string" && v ? v : undefined);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const type = (str(req.query.type) ?? "movie") as MediaType;
  if (!["movie", "tv", "anime"].includes(type)) return res.status(400).json({ items: [], error: "bad type" });
  const locale = str(req.query.locale) ?? "en";
  const network = str(req.query.network);
  try {
    if (network) {
      const items = await getNetworkTv(Number(network), locale);
      res.setHeader("Cache-Control", "public, s-maxage=1800, stale-while-revalidate=86400");
      return res.status(200).json({ items, page: 1, totalPages: 1 });
    }
    const page = Math.max(1, Number(str(req.query.page) ?? 1) || 1);
    const filters: BrowseFilters = {
      genres: str(req.query.genres),
      year: str(req.query.year),
      country: str(req.query.country),
      sort: (str(req.query.sort) as BrowseFilters["sort"]) ?? "popular",
    };
    const data = await getBrowse(type, filters, page, locale);
    res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=3600");
    return res.status(200).json(data);
  } catch (e) {
    return res.status(502).json({ items: [], page: 1, totalPages: 1, error: (e as Error).message });
  }
}
