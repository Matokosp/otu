import { getBlogArticleByHandle } from '@/app/lib/shopify';
import { notFound } from 'next/navigation';
import Menu from '@/app/Components/Menu/Menu';
import Content from '@/app/Components/Content/Content';

type Props = {
  params: Promise<{ handle: string }>;
};

export default async function LibraryArticlePage({ params }: Props) {
  const { handle } = await params;

  const article = await getBlogArticleByHandle(handle);

  console.log(article)

  if (!article) notFound();

  // Title is hidden for now — the header below (blog title + metafields) replaces it.
  const text = article.contentHtml;

  const meta = [
    { label: 'With', value: article.metafields.with },
    { label: 'Craft', value: article.metafields.craft },
    { label: 'Location', value: article.metafields.location },
  ].filter((m) => m.value);

  const header = (
    <>
      {article.blogTitle && <p className='relative left-[50%]'>{article.blogTitle}</p>}
      {meta.length > 0 && (
        <div className="flex flex-col gap-y-[10px]">
          {meta.map((m) => (
            <div key={m.label} className="grid grid-cols-2">
              <p className="text-[rgba(0,0,0,0.5)]">{m.label}</p>
              <p>{m.value}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );

  return (
    <main className="relative min-h-[calc(100vh-716px)]">
      <Menu page />
      <div className="lg:h-[180px]"></div>
      <Content htmlText={text} columns={1} header={header} />
    </main>
  );
}
