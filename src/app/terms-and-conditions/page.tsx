import { permanentRedirect } from "next/navigation";

// This page previously contained a hardcoded (outdated) copy of the Terms & Conditions,
// which conflicted with the authoritative version maintained in Shopify admin
// (Settings → Policies → Terms of service) and rendered at /policies/terms-of-service.
// It now redirects permanently so there is a single source of truth.
export default function Page() {
  permanentRedirect("/policies/terms-of-service");
}
