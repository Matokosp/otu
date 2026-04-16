import { getShopPolicies } from '@/app/lib/shopify'; // adjust path
import { notFound } from 'next/navigation';
import Menu from '@/app/Components/Menu/Menu';
import Content from '@/app/Components/Content/Content';

const POLICY_MAP: Record<string, 'privacyPolicy' | 'refundPolicy' | 'termsOfService'> = {
  'privacy-policy': 'privacyPolicy',
  'refund-policy': 'refundPolicy',
  'terms-of-service': 'termsOfService',
};

function parsePolicySections(html: string): {
  intro: string;
  sections: { title: string; text: string; id: string }[];
} {
  // Split on <h2> tags
  const parts = html.split(/<h2>/i);

  // First part is everything before the first <h2> — the intro
  const intro = parts[0]?.trim() || '';

  const sections = parts.slice(1).map((part) => {
    // Each part starts with the heading text, then </h2>, then the body
    const closingTag = part.indexOf('</h2>');
    const title = part.substring(0, closingTag).replace(/<[^>]*>/g, '').trim();
    const text = part.substring(closingTag + 5).trim();
    const id = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    return { title, text, id };
  });

  return { intro, sections };
}

type Props = {
  params: Promise<{ handle: string }>;
};

export default async function PolicyPage({ params }: Props) {
  const { handle } = await params;
  const key = POLICY_MAP[handle];

  if (!key) notFound();

  const policies = await getShopPolicies();
  const policy = policies[key];

  if (!policy) notFound();

  const { intro, sections } = parsePolicySections(policy.body);

  // Prepend the intro as the first section
  const texts = [
    ...(intro ? [{ title: policy.title, text: intro, id: 'intro' }] : []),
    ...sections,
  ];

  const contentMenu = texts.map((s) => ({
    title: s.title,
    link: `#${s.id}`,
  }));

  return (
    <main className="relative min-h-[calc(100vh-716px)]">
      <Menu page />
      <div className="lg:h-[180px]"></div>
      <Content texts={texts} columns={2} menu={contentMenu} />
    </main>
  );
}