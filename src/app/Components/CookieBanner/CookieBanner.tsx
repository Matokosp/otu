'use client';

import { useEffect, useState } from 'react';
import { getConsent, setConsent, ConsentState } from '@/app/lib/consent';
import Link from 'next/link';
import { Typing } from '../Typing/Typing';

function syncToShopify(consent: ConsentState) {
  const cp = window.Shopify?.customerPrivacy;
  if (!cp) return;

  cp.setTrackingConsent(
    {
      analytics: consent.analytics,
      marketing: consent.marketing,
      preferences: consent.preferences,
      sale_of_data: consent.sale_of_data,
    },
    () => {}
  );
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const existing = getConsent();

    if (existing === null) {
      setVisible(true);
    } else {
      syncToShopify(existing);
    }
  }, []);

  const accept = () => {
    const choice: ConsentState = {
      analytics: true,
      marketing: true,
      preferences: true,
      sale_of_data: true,
    };
    setConsent(choice);
    syncToShopify(choice);
    setVisible(false);
  };

  const reject = () => {
    const choice: ConsentState = {
      analytics: false,
      marketing: false,
      preferences: false,
      sale_of_data: false,
    };
    setConsent(choice);
    syncToShopify(choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-black/20">
      <div className="w-full border-t border-neutral-200 bg-white px-6 py-8 sm:px-10 sm:py-10">
        <div className="mx-auto max-w-3xl uppercase">
          <h2 className="text-base font-medium tracking-tight text-neutral-900">
            Cookie consent
          </h2>
          <p className="mt-3 text-[12px] leading-relaxed text-neutral-600">
            We use cookies and similar technologies to ensure our website
            functions correctly and to improve your experience. We do not use
            cookies for advertising or tracking purposes unless you give us
            permission. <br />
            <Link
              href="/policies/privacy-policy"
              className="underline underline-offset-2 text-neutral-900"
            >
              <Typing text="LEARN MORE" />
            </Link>
          </p>
          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={accept}
              className=""
            >
              <Typing text="ACCEPT" />
            </button>
            <button
              onClick={reject}
              className=""
            >
              <Typing text="DECLINE" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}