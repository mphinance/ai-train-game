// STUB, pre-staged by Wave 1. Agent A (Guide reader) owns the real implementation:
// render the chapter body as Markdown, split on PRACTICE_MARKER to inline <PracticeBox>,
// add prev/next nav, and remember reading position via engine/storage.ts.
import { useParams, Link } from 'react-router-dom';
import { getChapter, loadChapters } from '../content/loader';
import { PRACTICE_MARKER } from '../content/types';
import PracticeBox from '../components/PracticeBox';

export default function ChapterReader() {
  const { slug } = useParams();
  const chapter = slug ? getChapter(slug) : undefined;
  if (!chapter) return <div className="p-6">Chapter not found. <Link to="/">Back to guide</Link></div>;

  // Minimal stub render: split body on the practice marker; Agent A upgrades to full Markdown.
  const parts = chapter.body.split(new RegExp(`^\\s*${PRACTICE_MARKER}\\s*$`, 'm'));
  return (
    <article className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-3xl">{chapter.title}</h1>
      {parts.map((part, i) => (
        <div key={i}>
          <pre className="whitespace-pre-wrap font-body">{part}</pre>
          {i < parts.length - 1 && <PracticeBox spec={chapter.gym} />}
        </div>
      ))}
      <p className="mt-8 text-ink-faint">{loadChapters().length} chapters</p>
    </article>
  );
}
