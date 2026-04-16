'use client';

import { useState } from 'react';
import { getConsent, setConsent } from '@/app/lib/consent';
import Menu from '@/app/Components/Menu/Menu';
import Content from '@/app/Components/Content/Content';

export default function DoNotSellPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleOptOut = () => {
    const current = getConsent();
    const choice = {
      analytics: current?.analytics ?? true,
      marketing: current?.marketing ?? true,
      preferences: current?.preferences ?? true,
      sale_of_data: false,
    };
    setConsent(choice);

    const cp = (window as any).Shopify?.customerPrivacy;
    cp?.setTrackingConsent(choice, () => {});

    setSubmitted(true);
  };

  const texts = [
    {
      title: 'Do Not Sell My Personal Information',
      text: submitted
        ? '<p>Your preference has been saved. Your data will not be sold or shared.</p>'
        : `<p>You can opt out of the sale or sharing of your personal data. This will update your cookie preferences while keeping your other choices intact.</p>
           <br />
           <button id="opt-out-btn" style="background: black; color: white; padding: 10px 24px; font-size: 14px; border: none; cursor: pointer;">Opt out</button>`,
      id: 'opt-out',
    },
  ];

  // Attach click handler to the button rendered via dangerouslySetInnerHTML
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).id === 'opt-out-btn') {
      handleOptOut();
    }
  };

  return (
    <main className="relative min-h-[calc(100vh-716px)]" onClick={handleClick}>
      <Menu page />
      <div className="lg:h-[180px]"></div>
      <Content texts={texts} columns={2} />
    </main>
  );
}