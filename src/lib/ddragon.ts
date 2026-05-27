/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 *
 * Helpers pour les assets champions / icônes de profil.
 *
 * Historiquement on tapait directement la CDN officielle Riot (Data Dragon)
 * mais leur chaîne de certificats a régulièrement des problèmes de validation
 * (cert chain broken, intermediate non renouvelé, etc.) → ERR_CERT_AUTHORITY_INVALID
 * côté navigateur. Pour éviter ces pannes invisibles, on est passés sur
 * CommunityDragon qui mirror les mêmes assets avec un cert correct.
 *
 * Référence : https://www.communitydragon.org/documentation
 */

const CD_BASE = "https://cdn.communitydragon.org/latest";

/** Icône carrée de champion (e.g. "Yasuo" → 120×120 PNG). */
export function championIconUrl(name: string): string {
  return `${CD_BASE}/champion/${encodeURIComponent(name)}/square`;
}

/** Splash art recadré (1280×720). */
export function championLoadingUrl(name: string, _skin = 0): string {
  // CommunityDragon n'expose pas le numéro de skin directement par nom,
  // on prend le splash centered par défaut. Le second argument est conservé
  // pour ne pas casser les call-sites existants.
  return `${CD_BASE}/champion/${encodeURIComponent(name)}/splash-art/centered`;
}

/** Splash art classique. */
export function championSplashUrl(name: string, _skin = 0): string {
  return `${CD_BASE}/champion/${encodeURIComponent(name)}/splash-art`;
}

/** Item icon (e.g. 1001 = Boots). */
export function itemIconUrl(itemId: number): string {
  return `${CD_BASE}/item/${itemId}/icon`;
}

/** Profile icon (1, 2, …, 6800+). */
export function profileIconUrl(iconId: number): string {
  return `${CD_BASE}/profile-icon/${iconId}`;
}

// Bumper exposé pour compat avec les anciens imports. Ne sert plus que de
// libellé dans les commentaires d'asset, n'a plus d'effet sur les URLs.
export const DDRAGON_VERSION = "communitydragon-latest";
