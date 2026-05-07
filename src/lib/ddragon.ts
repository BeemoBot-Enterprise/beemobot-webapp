/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 *
 * Helpers for Riot Data Dragon CDN URLs. Bump DDRAGON_VERSION when
 * a new LoL patch ships and the app needs the latest icons / data.
 *
 * Reference: https://developer.riotgames.com/docs/lol#data-dragon
 */

export const DDRAGON_VERSION = "15.1.1";

const BASE = "https://ddragon.leagueoflegends.com/cdn";

/** Square champion portrait (e.g. "Yasuo" → 120×120 PNG). Versioned URL. */
export function championIconUrl(name: string): string {
  return `${BASE}/${DDRAGON_VERSION}/img/champion/${name}.png`;
}

/** Champion splash art (1215×717 JPG). Version-independent path. */
export function championSplashUrl(name: string, skin = 0): string {
  return `${BASE}/img/champion/splash/${name}_${skin}.jpg`;
}

/** Centered, pre-cropped splash (1280×720 JPG). Better for banners. */
export function championLoadingUrl(name: string, skin = 0): string {
  return `${BASE}/img/champion/loading/${name}_${skin}.jpg`;
}

/** Item icon (e.g. 1001 = Boots, 64×64 PNG). Versioned. */
export function itemIconUrl(itemId: number): string {
  return `${BASE}/${DDRAGON_VERSION}/img/item/${itemId}.png`;
}

/** Profile icon (1, 2, ..., 588) — used in summoner cards. Versioned. */
export function profileIconUrl(iconId: number): string {
  return `${BASE}/${DDRAGON_VERSION}/img/profileicon/${iconId}.png`;
}
