// Markdown renderer for Practical AI chapters and prose segments.
// Uses react-markdown + remark-gfm. Applies editorial theme tokens via the
// components prop. No Tailwind typography plugin; each element is mapped
// explicitly to keep the theme consistent and avoid any extra dependency.
//
// Usage: <Markdown>{someMarkdownString}</Markdown>

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';

// Element map: theme tokens only. No hardcoded colors.
const components: Components = {
  h1: ({ children }) => (
    <h1 className="font-display mb-4 mt-8 text-3xl font-bold leading-tight text-ink">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="font-display mb-3 mt-7 text-2xl font-bold leading-snug text-ink">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-display mb-2 mt-5 text-xl font-semibold leading-snug text-ink">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mb-4 leading-7 text-ink">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mb-4 ml-6 list-disc space-y-1 text-ink">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-4 ml-6 list-decimal space-y-1 text-ink">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="leading-7">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-4 border-l-4 border-cyan pl-4 text-ink-soft italic">
      {children}
    </blockquote>
  ),
  code: ({ children, className }) => {
    // Fenced code blocks come with a language className; inline code does not.
    const isBlock = Boolean(className);
    if (isBlock) {
      return (
        <pre className="my-4 overflow-x-auto rounded-lg border border-edge bg-abyss p-4 font-mono text-sm leading-6 text-ink">
          <code>{children}</code>
        </pre>
      );
    }
    return (
      <code className="rounded bg-abyss px-1.5 py-0.5 font-mono text-sm text-ink">
        {children}
      </code>
    );
  },
  a: ({ children, href }) => (
    <a
      href={href}
      className="text-cyan underline underline-offset-2 hover:text-cyan-dim"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-ink">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-ink-soft">{children}</em>
  ),
  hr: () => <hr className="my-8 border-edge" />,
};

interface MarkdownProps {
  children: string;
}

export default function Markdown({ children }: MarkdownProps) {
  return (
    <div className="max-w-prose leading-relaxed">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
