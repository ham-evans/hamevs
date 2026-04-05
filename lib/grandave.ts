import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";
import rehypeExternalLinks from "rehype-external-links";
import { rehype } from "rehype";

const grandaveDir = path.join(process.cwd(), "content/grandave");

export type GrandaveEntry = {
  slug: string;
  title: string;
  date: string;
  contentHtml: string;
};

export async function getGrandaveEntry(slug: string): Promise<GrandaveEntry> {
  const filePath = path.join(grandaveDir, `${slug}.md`);
  const file = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(file);
  const remarkResult = await remark().use(remarkGfm).use(html, { sanitize: false }).process(content);
  const htmlWithFigures = remarkResult.toString().replace(
    /<p><img src="([^"]*)" alt="([^"]*)"[^>]*><\/p>/g,
    (_match, src, alt) =>
      alt
        ? `<figure><img src="${src}" alt="${alt}"><figcaption>${alt}</figcaption></figure>`
        : `<figure><img src="${src}" alt="${alt}"></figure>`
  );
  const result = await rehype()
    .use(rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] })
    .process(htmlWithFigures);
  return {
    slug,
    title: data.title,
    date: data.date || "",
    contentHtml: result.toString(),
  };
}
