/**
 * Playback providers for the player's server picker.
 *
 * This project ships with no stream providers. Register your own licensed
 * sources here; each one becomes a selectable "server" in the player.
 */
export interface PlaybackSource {
  /** Stable key used for the viewer's saved preference. */
  key: string;
  /** Label shown in the server picker. */
  label: string;
  /** Builds an embeddable URL for a title. Return null when the source cannot play it. */
  embed: (ctx: { type: "movie" | "tv" | "anime"; id: string; imdbId: string | null; season?: number; episode?: number }) => string | null;
  /** Optional note shown under the label, e.g. "Original audio". */
  note?: string;
}

export const PLAYBACK_SOURCES: PlaybackSource[] = [];
