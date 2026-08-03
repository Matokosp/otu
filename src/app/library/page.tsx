import Link from 'next/link';
import { Metadata } from 'next';
import Menu from '@/app/Components/Menu/Menu';
import { CustomImage } from '@/app/Components/Image/Image';
import { getBlogArticles } from '@/app/lib/shopify';

export const metadata: Metadata = {
  title: 'Library - OF THE USELESS',
  description: 'Notes, stories and updates from OF THE USELESS.',
};

export default async function LibraryPage() {
  const articles = await getBlogArticles().catch((e) => {
    console.log('Error fetching blog articles:', e);
    return [];
  });

  return (
    <main className="relative min-h-[calc(100vh-716px)]">
      <Menu page />
      <div className="lg:h-[180px]"></div>

      <div className="grid grid-cols-4 lg:grid-cols-12 gap-x-[10px] gap-y-[25px] px-[10px] uppercase">
        {articles.length === 0 && (
          <p className="col-span-4 lg:col-start-4 lg:col-end-9">Nothing here yet.</p>
        )}

        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/library/${article.handle}`}
            className="col-span-4 lg:col-span-4"
          >
            {article.image && (
              <div className="aspect-[228/343] relative overflow-hidden mb-[10px]">
                <CustomImage
                  alt={article.image.altText || article.title}
                  src={article.image.url}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <p>{article.title}</p>
            <p className="text-[rgba(0,0,0,0.5)]">
              {new Date(article.publishedAt).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
