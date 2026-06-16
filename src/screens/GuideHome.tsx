// GuideHome: landing page and table of contents for Practical AI.
// Shows an intro paragraph, a "Continue reading" link if a bookmark exists,
// the full ordered chapter list, and a placeholder for the ebook CTA (Wave 4).

import { Link } from 'react-router-dom';
import { loadChapters } from '../content/loader';
import { loadJSON } from '../engine/storage';

export default function GuideHome() {
  const chapters = loadChapters();
  const lastChapter = loadJSON<string | null>('lastChapter', null);

  return (
    <div className="anim-route mx-auto max-w-3xl px-4 py-12 sm:px-6">
      {/* Masthead */}
      <header className="mb-10">
        <p className="mb-3 text-sm font-medium text-cyan uppercase tracking-widest">
          Field Guide
        </p>
        <h1 className="font-display mb-4 text-5xl font-bold leading-tight text-ink">
          Practical AI
        </h1>
        <p className="text-lg leading-8 text-ink-soft max-w-xl">
          Most AI guides leave you in one of two places: overwhelmed by theory, or underwhelmed by
          generic tips. This is something in between. Concrete enough to use on Monday morning,
          light enough to read in an afternoon. No hype, no fluff, and no homework.
        </p>
      </header>

      {/* Continue reading (only shown when a bookmark exists) */}
      {lastChapter && (
        <div className="panel mb-8 flex items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="text-sm text-ink-faint">You were reading</p>
            <p className="font-display font-semibold text-ink">
              {chapters.find((c) => c.slug === lastChapter)?.title ?? lastChapter}
            </p>
          </div>
          <Link
            to={`/guide/${lastChapter}`}
            className="shrink-0 rounded-lg bg-cyan px-4 py-2 text-sm font-semibold text-abyss transition-opacity hover:opacity-90"
          >
            Continue reading
          </Link>
        </div>
      )}

      {/* Table of contents */}
      <section>
        <h2 className="font-display mb-4 text-xl font-bold text-ink">Chapters</h2>
        <ol className="space-y-4">
          {chapters.map((chapter) => (
            <li key={chapter.slug}>
              <Link
                to={`/guide/${chapter.slug}`}
                className="group panel flex items-start gap-4 px-5 py-4 transition-shadow hover:shadow-md no-underline"
              >
                <span className="font-display shrink-0 text-2xl font-bold text-ink-faint tabular-nums w-6 text-right">
                  {chapter.order}
                </span>
                <div>
                  <p className="font-display font-semibold text-ink group-hover:text-cyan transition-colors leading-snug">
                    {chapter.title}
                  </p>
                  <p className="mt-1 text-sm text-ink-soft leading-relaxed">{chapter.summary}</p>
                  {chapter.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {chapter.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-edge px-2 py-0.5 text-xs text-ink-faint"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* Ebook CTA */}
      <section className="mt-12 panel px-6 py-6 text-center">
        <h2 className="font-display mb-2 text-xl font-bold text-ink">Download the ebook</h2>
        <p className="mb-4 text-ink-soft">
          Take the full guide offline as an epub. Read it on your phone, Kindle, or reader of
          choice.
        </p>
        <a
          href="./downloads/practical-ai.epub"
          download="practical-ai.epub"
          className="inline-block rounded-lg bg-cyan px-6 py-2.5 text-sm font-semibold text-abyss transition-opacity hover:opacity-90"
        >
          Download (epub)
        </a>
      </section>
    </div>
  );
}
