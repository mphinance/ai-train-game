// ChapterReader: renders a single chapter by slug.
// Splits the chapter body on PRACTICE_MARKER lines, renders each prose segment
// with <Markdown>, and injects <PracticeBox spec={chapter.gym} /> at each marker.
// Saves the current slug as the reading bookmark on mount.
// Provides prev/next navigation ordered by chapter.order.

import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getChapter, loadChapters } from '../content/loader';
import { PRACTICE_MARKER } from '../content/types';
import { saveJSON } from '../engine/storage';
import PracticeBox from '../components/PracticeBox';
import Markdown from '../components/Markdown';

// Split a chapter body on lines that are exactly PRACTICE_MARKER (trimmed).
function splitOnMarker(body: string): string[] {
  return body.split(/\n/).reduce<string[]>((segments, line) => {
    if (line.trim() === PRACTICE_MARKER) {
      segments.push(''); // start a new segment after the marker
    } else {
      if (segments.length === 0) segments.push('');
      segments[segments.length - 1] += (segments[segments.length - 1] ? '\n' : '') + line;
    }
    return segments;
  }, []);
}

export default function ChapterReader() {
  const { slug } = useParams<{ slug: string }>();
  const chapter = slug ? getChapter(slug) : undefined;
  const chapters = loadChapters();

  // Save reading bookmark whenever slug changes.
  useEffect(() => {
    if (slug) saveJSON('lastChapter', slug);
  }, [slug]);

  if (!chapter) {
    return (
      <div className="mx-auto max-w-3xl p-8 text-ink">
        <p className="mb-4 text-ink-soft">
          This chapter could not be found. It may have moved or the link may be incorrect.
        </p>
        <Link to="/" className="text-cyan underline underline-offset-2 hover:text-cyan-dim">
          Back to the guide
        </Link>
      </div>
    );
  }

  const currentIndex = chapters.findIndex((c) => c.slug === chapter.slug);
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : undefined;
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : undefined;

  const segments = splitOnMarker(chapter.body);

  return (
    <div className="anim-route mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <Link to="/" className="text-sm text-ink-faint hover:text-cyan transition-colors">
          Practical AI
        </Link>
        <span className="mx-2 text-ink-faint">/</span>
        <span className="text-sm text-ink-soft">{chapter.title}</span>
      </nav>

      {/* Chapter header */}
      <header className="mb-8">
        <p className="mb-2 text-sm font-medium text-cyan uppercase tracking-wide">
          Chapter {chapter.order}
        </p>
        <h1 className="font-display mb-3 text-4xl font-bold leading-tight text-ink">
          {chapter.title}
        </h1>
        <p className="text-lg text-ink-soft leading-relaxed">{chapter.summary}</p>
        {chapter.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {chapter.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-edge px-3 py-0.5 text-xs text-ink-faint"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Chapter body: prose segments with optional PracticeBox injections */}
      <article>
        {segments.map((segment, i) => (
          <div key={i}>
            {segment.trim() && <Markdown>{segment}</Markdown>}
            {i < segments.length - 1 && <PracticeBox spec={chapter.gym} />}
          </div>
        ))}
      </article>

      {/* Prev / next navigation */}
      <nav className="mt-12 border-t border-edge pt-8 grid grid-cols-2 gap-4">
        <div>
          {prevChapter && (
            <Link
              to={`/guide/${prevChapter.slug}`}
              className="group flex flex-col gap-1 rounded-xl border border-edge p-4 transition-colors hover:border-cyan"
            >
              <span className="text-xs text-ink-faint uppercase tracking-wide">Previous</span>
              <span className="font-display text-base font-semibold text-ink group-hover:text-cyan transition-colors">
                {prevChapter.title}
              </span>
            </Link>
          )}
        </div>
        <div className="flex justify-end">
          {nextChapter && (
            <Link
              to={`/guide/${nextChapter.slug}`}
              className="group flex flex-col gap-1 rounded-xl border border-edge p-4 text-right transition-colors hover:border-cyan w-full"
            >
              <span className="text-xs text-ink-faint uppercase tracking-wide">Next</span>
              <span className="font-display text-base font-semibold text-ink group-hover:text-cyan transition-colors">
                {nextChapter.title}
              </span>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
