// Cookbook Browser screen. Agent C owns this file.
// Shows loadCookbook() entries with goal-filter chips, text search, and a
// copy-prompt button per card. Uses theme tokens only. NO EM DASHES.
import { useState, useMemo } from 'react';
import { loadCookbook, cookbookGoals } from '../content/cookbook';
import type { CookbookEntry } from '../content/types';

function GoalChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        'rounded-full border px-3 py-1 text-sm font-medium capitalize transition-colors',
        active
          ? 'border-cyan bg-cyan text-white'
          : 'border-edge bg-abyss text-ink-soft hover:border-cyan-dim hover:text-ink',
      ].join(' ')}
    >
      {label}
    </button>
  );
}

function CopyButton({ prompt }: { prompt: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <button
      onClick={handleCopy}
      className={[
        'rounded border px-3 py-1 text-sm font-medium transition-colors',
        copied
          ? 'border-lime text-lime'
          : 'border-edge text-ink-soft hover:border-cyan-dim hover:text-cyan',
      ].join(' ')}
    >
      {copied ? 'Copied' : 'Copy prompt'}
    </button>
  );
}

function EntryCard({ entry }: { entry: CookbookEntry }) {
  return (
    <article className="panel p-5 flex flex-col gap-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-ink-faint">
            {entry.goal}
          </span>
          <h2 className="font-display text-lg font-bold text-ink leading-snug">
            {entry.title}
          </h2>
          {entry.source && (
            <span className="mt-0.5 block text-xs text-ink-faint">
              Source: {entry.source}
            </span>
          )}
        </div>
        <CopyButton prompt={entry.prompt} />
      </div>
      <pre className="whitespace-pre-wrap rounded bg-void border border-edge p-3 font-mono text-sm text-ink-soft leading-relaxed">
        {entry.prompt}
      </pre>
    </article>
  );
}

export default function Cookbook() {
  const allEntries = useMemo(() => loadCookbook(), []);
  const goals = useMemo(() => cookbookGoals(), []);

  const [activeGoal, setActiveGoal] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo<CookbookEntry[]>(() => {
    const q = search.trim().toLowerCase();
    return allEntries.filter((e) => {
      const goalMatch = activeGoal === 'all' || e.goal === activeGoal;
      if (!goalMatch) return false;
      if (!q) return true;
      return e.title.toLowerCase().includes(q) || e.prompt.toLowerCase().includes(q);
    });
  }, [allEntries, activeGoal, search]);

  return (
    <div className="anim-route mx-auto max-w-3xl px-4 py-10">
      {/* Header */}
      <header className="mb-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-cyan">
          Practical AI
        </p>
        <h1 className="font-display text-3xl font-bold text-ink mb-2">
          What Can AI Actually Do?
        </h1>
        <p className="text-ink-soft text-base">
          Real uses by goal. Each entry has a starter prompt you can copy and paste directly
          into any AI assistant.
        </p>
      </header>

      {/* Search */}
      <div className="mb-5">
        <input
          type="search"
          placeholder="Search prompts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-edge bg-abyss px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-cyan-dim focus:outline-none"
        />
      </div>

      {/* Goal filter chips */}
      <div className="mb-7 flex flex-wrap gap-2">
        <GoalChip
          label="All"
          active={activeGoal === 'all'}
          onClick={() => setActiveGoal('all')}
        />
        {goals.map((g) => (
          <GoalChip
            key={g}
            label={g}
            active={activeGoal === g}
            onClick={() => setActiveGoal(g)}
          />
        ))}
      </div>

      {/* Results count */}
      <p className="mb-4 text-xs text-ink-faint">
        {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}
        {activeGoal !== 'all' ? ` in ${activeGoal}` : ''}
        {search ? ` matching "${search}"` : ''}
      </p>

      {/* Entry cards */}
      {filtered.length > 0 ? (
        <ul className="space-y-5">
          {filtered.map((entry, i) => (
            <li key={`${entry.goal}-${i}`}>
              <EntryCard entry={entry} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="panel p-8 text-center text-ink-soft">
          No entries match your search. Try a different term or clear the filter.
        </div>
      )}
    </div>
  );
}
