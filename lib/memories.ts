import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";
import rehypeExternalLinks from "rehype-external-links";
import { rehype } from "rehype";

const memoriesDir = path.join(process.cwd(), "content/memories");

export type Memory = {
  slug: string;
  title: string;
  date: string;
  status?: "done" | "draft";
  href?: string;
};

export function getAllMemories(): Memory[] {
  const files = fs.readdirSync(memoriesDir).filter((f) => f.endsWith(".md"));
  const memories = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const { data } = matter(fs.readFileSync(path.join(memoriesDir, file), "utf8"));
    return {
      slug,
      title: data.title,
      date: data.date,
      status: data.status,
      href: data.href,
    };
  });
  return memories.sort((a, b) => {
    const dateA = new Date(a.date.replace(/-.+?,/, ",")).getTime();
    const dateB = new Date(b.date.replace(/-.+?,/, ",")).getTime();
    return dateA - dateB;
  });
}

export async function getMemory(slug: string) {
  const filePath = path.join(memoriesDir, `${slug}.md`);
  const file = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(file);
  const remarkResult = await remark().use(remarkGfm).use(html, { sanitize: false }).process(content);
  // Wrap images in <figure> with <figcaption> from alt text
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
    date: data.date,
    contentHtml: result.toString(),
  };
}
