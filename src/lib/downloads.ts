/** Rolling 24-hour download allowance, tracked per browser. */
export const DOWNLOAD_LIMIT = 5;
const KEY = "movy:v1:downloads";
const DAY_MS = 24 * 60 * 60 * 1000;

function read(): number[] {
  try {
    const all = JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as number[];
    const cutoff = Date.now() - DAY_MS;
    return all.filter((t) => t > cutoff);
  } catch {
    return [];
  }
}

export function downloadsLeft(): { left: number; resetsInMs: number | null } {
  const used = read();
  return { left: Math.max(0, DOWNLOAD_LIMIT - used.length), resetsInMs: used.length ? Math.max(0, Math.min(...used) + DAY_MS - Date.now()) : null };
}

export function recordDownload(): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify([...read(), Date.now()]));
  } catch {
    /* storage unavailable */
  }
}

export function formatDuration(ms: number): string {
  const totalMin = Math.max(1, Math.ceil(ms / 60000));
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
}
