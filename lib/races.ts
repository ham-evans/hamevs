import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";
import rehypeExternalLinks from "rehype-external-links";
import { rehype } from "rehype";

const racesDir = path.join(process.cwd(), "content/races");

export type Race = {
  slug: string;
  title: string;
  date: string;
  distance: string;
  time: string;
  strava?: string;
  recap?: boolean;
  gpx?: string;
  elevation?: string;
};

export function getAllRaces(): Race[] {
  const files = fs.readdirSync(racesDir).filter((f) => f.endsWith(".md"));
  const races = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const { data } = matter(fs.readFileSync(path.join(racesDir, file), "utf8"));
    return {
      slug,
      title: data.title,
      date: data.date,
      distance: data.distance,
      time: data.time,
      strava: data.strava,
      recap: Boolean(data.recap),
      gpx: data.gpx,
      elevation: data.elevation,
    };
  });
  return races.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export async function getRace(slug: string) {
  const filePath = path.join(racesDir, `${slug}.md`);
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
    distance: data.distance,
    time: data.time,
    strava: data.strava,
    recap: Boolean(data.recap),
    gpx: data.gpx,
    elevation: data.elevation,
    contentHtml: result.toString(),
  };
}
