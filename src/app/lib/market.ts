export type MarketRegion = "sweden" | "europe" | "international";

export const REGIONS: MarketRegion[] = ["sweden", "europe", "international"];

// One representative country code per Shopify Market (config verified in
// admin 2026-07-11: Sweden = SEK, Europe = EUR manual, International = EUR
// manual, no duties). @inContext only accepts a specific CountryCode, and
// Shopify Markets prices any country within a market group the same way.
export const REGION_COUNTRY: Record<MarketRegion, string> = {
  sweden: "SE",
  europe: "DE",
  international: "NO",
};

export const REGION_LABEL: Record<MarketRegion, string> = {
  sweden: "Sweden",
  europe: "Europe",
  international: "International",
};

// Countries in the International market (no duties collected). Terms §4.1:
// these visitors see "Excluding VAT" instead of "Including VAT".
export const INTERNATIONAL_COUNTRIES = ["JP", "NO", "KR"];

export const COOKIE_NAME = "otu_market_region";

export function getRegionFromCountryCode(code: string | undefined | null): MarketRegion {
  const upper = (code || "").toUpperCase();
  if (upper === "SE") return "sweden";
  if (INTERNATIONAL_COUNTRIES.includes(upper)) return "international";
  return "europe";
}

export function isValidRegion(value: string | undefined | null): value is MarketRegion {
  return !!value && REGIONS.includes(value as MarketRegion);
}

export function getRegionCountry(region: MarketRegion): string {
  return REGION_COUNTRY[region];
}

// Server-only: read the resolved region from the request cookie jar.
// Middleware guarantees this cookie is always set, so `sweden` here only
// covers the edge case of a request that bypassed middleware.
export async function getServerRegion(): Promise<MarketRegion> {
  const { cookies } = await import("next/headers");
  const jar = await cookies();
  const value = jar.get(COOKIE_NAME)?.value;
  return isValidRegion(value) ? value : "sweden";
}

// Client-safe helpers, mirroring lib/consent.ts's cookie pattern.
export function getRegionCookie(): MarketRegion | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));
  if (!match) return null;
  const value = decodeURIComponent(match.split("=")[1]);
  return isValidRegion(value) ? value : null;
}

export function setRegionCookie(region: MarketRegion) {
  const maxAge = 60 * 60 * 24 * 365;
  const secure = typeof location !== "undefined" && location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE_NAME}=${region}; path=/; max-age=${maxAge}; SameSite=Lax${secure}`;
}
