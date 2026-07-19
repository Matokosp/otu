// Dev-only escape hatch for local networks that intercept TLS (corporate
// proxy/VPN, antivirus SSL inspection, etc). Gated on NODE_ENV rather than
// just the env flag, so it is structurally impossible for this to activate
// in a built/deployed context (Vercel always runs `next build`/`next start`
// with NODE_ENV=production) even if SKIP_TLS_VERIFY is set there by mistake.
export function applyDevTlsBypass() {
  if (process.env.NODE_ENV === "production") return;
  if (process.env.SKIP_TLS_VERIFY !== "true") return;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}
