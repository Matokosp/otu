This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Blog article image widths

Blog article bodies (`Shopify Admin → Online Store → Blog posts`) render as raw HTML from Shopify's rich text editor (see `getBlogArticles` in `src/app/lib/shopify.ts` and `src/app/Components/Content/Content.tsx`). The editor's default view doesn't expose image width controls, but you can add one manually:

1. In the post editor, select the image and switch the editor to **"Show HTML"** (the `<>` icon in the toolbar).
2. Add a `class` attribute to the `<img>` tag, using one of:
   - `article-img--constrained` — matches the width of the surrounding body text (the default look if you add no class at all).
   - `article-img--medium` — starts at the same left edge as the body text, but extends further to the right.
   - `article-img--full` — spans the full page grid, inset by the page's usual side margin (not the literal browser edge).

   Example: `<img src="..." alt="..." class="article-img--full">`

These classes are defined in `src/app/globals.css`. On mobile/tablet (below the `lg` breakpoint, 1024px) every image renders full-width regardless of class, so the width choice only affects desktop.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
