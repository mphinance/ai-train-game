// STUB, pre-staged by Wave 1. Agent A (Guide reader) owns the real implementation:
// a table of contents from loadChapters() + a "Download the ebook" CTA (Wave 4).
import { Link } from 'react-router-dom';
import { loadChapters } from '../content/loader';

export default function GuideHome() {
  const chapters = loadChapters();
  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-3xl">Practical AI</h1>
      <ol className="space-y-2">
        {chapters.map((c) => (
          <li key={c.slug}>
            <Link className="text-cyan underline-offset-2 hover:underline" to={`/guide/${c.slug}`}>
              {c.order}. {c.title}
            </Link>
            <p className="text-ink-soft">{c.summary}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
