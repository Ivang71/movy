/** Streaming services shown in the "Only on" rail. TMDB network ids drive the discover query. */
export interface Provider {
  key: string;
  label: string;
  /** TMDB network id used with /discover/tv?with_networks= */
  network: number;
  /** Brand colour used for the active tile glow and heading accent. */
  color: string;
  text: string;
  soft: string;
  /** Visual style of our text wordmark. */
  mark: "netflix" | "prime" | "hbo" | "disney" | "apple" | "paramount" | "hulu";
}

export const PROVIDERS: Provider[] = [
  { key: "netflix", label: "Netflix", network: 213, color: "#E50914", text: "#FF3B44", soft: "rgba(229, 9, 20, 0.14)", mark: "netflix" },
  { key: "primevideo", label: "Prime Video", network: 1024, color: "#00A8E1", text: "#3FC3F2", soft: "rgba(0, 168, 225, 0.16)", mark: "prime" },
  { key: "hbomax", label: "HBO Max", network: 3186, color: "#7B5CFF", text: "#A28CFF", soft: "rgba(123, 92, 255, 0.18)", mark: "hbo" },
  { key: "disney", label: "Disney+", network: 2739, color: "#1A5BFF", text: "#5F8CFF", soft: "rgba(26, 91, 255, 0.18)", mark: "disney" },
  { key: "appletv", label: "Apple TV+", network: 2552, color: "#E6E6E6", text: "#FFFFFF", soft: "rgba(230, 230, 230, 0.14)", mark: "apple" },
  { key: "paramount", label: "Paramount+", network: 4330, color: "#0064FF", text: "#4C8DFF", soft: "rgba(0, 100, 255, 0.18)", mark: "paramount" },
  { key: "hulu", label: "Hulu", network: 453, color: "#1CE783", text: "#49F09C", soft: "rgba(28, 231, 131, 0.16)", mark: "hulu" },
];

export function providerByKey(key: string): Provider | undefined {
  return PROVIDERS.find((p) => p.key === key);
}
