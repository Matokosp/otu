# Developer handoff — legal review follow-ups (2026-07-11)

Branch `legal-compliance-fixes` (commit `cef2969`) contains changes already made.
Full context: legal/e-commerce review doc (ask Rui).

## Already changed — please review (commit cef2969)

- **`src/app/Components/Footer/Footer.tsx`** — added "Cancel your order" link → `https://shopify.com/95940903255/account`.
  This is a legal requirement (ångerknapp, distansavtalslagen since 19 June 2026): it must stay clearly labeled and easy to find. URL is the store's official customer-accounts URL from Shopify admin.
- **`src/app/terms-and-conditions/page.tsx`** — replaced outdated hardcoded terms (wrong payment provider, defunct EU ODR link) with a `permanentRedirect` to `/policies/terms-of-service`. The Shopify policy is now the single source of truth — don't resurrect hardcoded legal text.
- **`src/app/info/page.tsx`** — Payments section: Stripe → Shopify checkout, removed contradictory VAT claims. Exchange & Returns section: legally required rewrite (no "unused/original packaging" condition; diminished-value wording instead).

## To build — priority order

### 1. EUR pricing for EU customers (decision: EU sees EUR, Sweden SEK)
Currently no Storefront API query uses `@inContext`, so everyone sees SEK and
checkout may repricé in another currency (price on site ≠ price at checkout = legal problem).

- Add `@inContext(country: $country)` to all queries in `src/app/lib/shopify.ts` and `src/app/lib/cart.ts`.
- Set `buyerIdentity: { countryCode }` on `cartCreate` (and update on change).
- Country detection: Vercel geo header (`x-vercel-ip-country`) with fallback + ideally a country selector; must map to the store's Shopify Markets (Sweden → SEK, EU market → EUR, International → as configured).
- Verify PLP, PDP, cart and checkout all show the same price for the same visitor.
- **VAT label must follow the market:** "Including VAT" is hardcoded in `Product.tsx` (2 places: desktop ~line 271, mobile ~line 351). Once market context exists, render "Including VAT" for Sweden/EU and "Excluding VAT — import duties may apply" (or similar) for the International market (JP/NO/KR). Terms §4.1 now promises exactly this behavior.
- Market config is already done and verified in Shopify admin (2026-07-11): Sweden = SEK; EU = EUR manual 0.10 no rounding; International (JP/NO/KR) = EUR manual 0.10 no rounding, no duties collection. API check: `@inContext(country: DE|JP|NO|KR)` returns €15 for the 150 SEK tea cup; SE returns 150 SEK.
- Docs: https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/markets/international-pricing

### 2. Security
- **Delete `src/app/api/unstable/graphql.json/route.ts`** — unused, unauthenticated open proxy to the Storefront API (anyone can relay queries through the domain).
- **Remove the `SKIP_TLS_VERIFY` code path** in `lib/shopify.ts` (sets `NODE_TLS_REJECT_UNAUTHORIZED=0` process-wide). Never set it in Vercel env.

### 3. API hygiene
- Pin `SHOPIFY_API_VERSION` to a current stable version (default is `2023-10`, long unsupported). Update deprecated `priceV2` → `price` in `lib/cart.ts`.
- `getProductByHandle` (`lib/shopify.ts`): `p.metafields` is read **before** the `if (!p) return null` check → throws on unknown handles; the page's `.catch(() => null)` then masks real API errors as "Product not found". Reorder + surface errors properly.
- `/api/cart` + `lib/cart.ts`: check `res.ok` / GraphQL `errors` before `data.cartCreate.…`; validate request body.
- `getAllProducts`: product cursor is passed to `collections(first: $first, after: $after)` — breaks when catalog exceeds 50 products. Collections shouldn't paginate with the product cursor.
- `shop/page.tsx` line ~55: `filteredCollections[0].description` crashes the shop page if no collection has a description — guard it.

### 4. Broken/orphan page
- Delete or redirect **`/shop/no-hard-feelings`** — renders `<Product />` with no data: no price, dead "Add to cart" button. Real page: `/products/no-hard-feelings-chair`.

### 5. SEO
- `generateMetadata` for `products/[handle]` (title/description/OG per product) + Product JSON-LD.
- `app/robots.ts` + `app/sitemap.ts`.
- `metadataBase` so OG images resolve absolute; metadata for /about, /info, /policies.
- Custom `not-found.tsx` (currently default Next 404) and styled product-not-found state.

### 6. Remove the cookie banner (decision: Rui, 2026-07-12)
Remove the full-screen `CookieBanner` overlay entirely — no consent UI at all.

- Legal basis: the site sets **no non-essential cookies** (no analytics — `@vercel/analytics` is disabled and should be removed per §7 below — no marketing pixels). Consent banners are only required for non-essential cookies, so a banner-free site is compliant AND cleaner than the reference site. (Note: Magniberg actually *does* show a small bottom-strip Accept/Decline banner — because they run traffic analytics and ad personalization. OTU doesn't, so OTU can go fully banner-free.)
- Delete `Components/CookieBanner/` and its render in `layout.tsx`.
- Keep `lib/consent.ts` and `/policies/do-not-sell` (used for opt-out).
- In `ShopifyConsent.tsx`, after the API loads, set a conservative default consent once (analytics/marketing/preferences/sale_of_data = **false**) so Shopify checkout receives an explicit declined state without any UI. Also fix the `?? true` fallbacks in `do-not-sell/page.tsx` → default false.
- ⚠️ Standing rule: if analytics or any marketing pixel is EVER added, a consent UI must come back first.

### 7. Small fixes
- `formatPrice` rounds decimals (150.50 → "151") — displayed price must equal charged price; show öre/cents when present.
- Footer © year: 2025 → dynamic.
- `/info` menu anchor `#Trade` vs section id `trade` (case mismatch, dead anchor).
- Consent cookie (`lib/consent.ts`): add `Secure` flag.
- Cart drawer a11y: `role="dialog"`, `aria-modal`, focus trap; aria-labels on qty buttons; meaningful `alt` on product images.
- `next.config.ts`: `images.domains` → `images.remotePatterns`.
- Remove dead code: unused `getProducts()` (invalid metafields query), unused `getShopPolicies` import on home, `@vercel/analytics` dependency (or gate it behind the consent state if re-enabled).
- At launch: if a custom domain changes the customer-accounts URL, update the footer link.
