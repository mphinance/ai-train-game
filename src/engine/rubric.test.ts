import { describe, it, expect } from 'vitest';
import { scorePrompt } from './rubric';
import type { SignalKey } from './types';

const STRONG_PROMPT =
  'You are a seasoned chef. For my beginner readers who are new to cooking, ' +
  'write a 5 step recipe for a 20 minute pasta dish. Use a numbered list and a ' +
  'friendly, casual tone. Keep it under 200 words and do not use rare ingredients. ' +
  'For example, swap saffron for paprika. Walk me through it step by step.';

const WEAK_PROMPT = 'write something about dogs';

function signalMap(prompt: string): Record<SignalKey, boolean> {
  const result = scorePrompt(prompt);
  const map = {} as Record<SignalKey, boolean>;
  for (const s of result.signals) map[s.key] = s.present;
  return map;
}

describe('rubric: signal detection', () => {
  it('detects the role signal in a simple prompt', () => {
    const map = signalMap('You are a chef. Write a recipe.');
    expect(map.role).toBe(true);
  });

  it('detects all core signals across a strong prompt', () => {
    const map = signalMap(STRONG_PROMPT);
    for (const key of [
      'role',
      'context',
      'audience',
      'format',
      'constraints',
      'examples',
      'tone',
    ] as SignalKey[]) {
      expect(map[key], `expected ${key} present`).toBe(true);
    }
  });

  it('catches natural audience phrasings the old keyword set missed', () => {
    // The previously-missed case: an implied audience with "for me and one
    // picky teenager" must now register as an AUDIENCE signal.
    expect(signalMap('Plan dinners. It is for me and one picky teenager.').audience).toBe(
      true,
    );
    // A few more natural phrasings should also light the audience signal.
    expect(signalMap('Summarize this for my boss.').audience).toBe(true);
    expect(signalMap('Explain it to a beginner.').audience).toBe(true);
    expect(signalMap('Make a snack the kids will eat.').audience).toBe(true);
  });

  it('catches natural constraint and format phrasings', () => {
    expect(signalMap('Keep it under 200 words.').constraints).toBe(true);
    expect(signalMap('Give me a 20 minute recipe.').constraints).toBe(true);
    expect(signalMap('No cilantro please.').constraints).toBe(true);
    expect(signalMap('Put it in a numbered list.').format).toBe(true);
    expect(signalMap('Lay it out as a table.').format).toBe(true);
  });
});

describe('rubric: scoring', () => {
  it('scores a strong prompt high (>80)', () => {
    expect(scorePrompt(STRONG_PROMPT).score).toBeGreaterThan(80);
  });

  it('scores a weak prompt low (<35)', () => {
    expect(scorePrompt(WEAK_PROMPT).score).toBeLessThan(35);
  });

  it('returns tier elite for a top prompt and weak for a lazy one', () => {
    expect(scorePrompt(STRONG_PROMPT).tier).toBe('elite');
    expect(scorePrompt(WEAK_PROMPT).tier).toBe('weak');
  });

  it('is deterministic across repeated calls', () => {
    const a = scorePrompt(STRONG_PROMPT);
    const b = scorePrompt(STRONG_PROMPT);
    expect(a.score).toBe(b.score);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it('returns a per-signal feedback tip for every signal', () => {
    const result = scorePrompt(WEAK_PROMPT);
    expect(result.signals).toHaveLength(10);
    for (const s of result.signals) {
      expect(typeof s.tip).toBe('string');
      expect(s.tip.length).toBeGreaterThan(0);
      expect(s.tip).not.toContain(String.fromCharCode(0x2014)); // no em dash character
    }
  });

  it('populates evidence for both a present and an absent signal', () => {
    // STRONG_PROMPT lights role (present) and a weak prompt leaves role absent.
    const strong = scorePrompt(STRONG_PROMPT).signals.find((s) => s.key === 'role');
    expect(strong?.present).toBe(true);
    expect(typeof strong?.evidence).toBe('string');
    expect((strong?.evidence ?? '').length).toBeGreaterThan(0);

    const absent = scorePrompt(WEAK_PROMPT).signals.find((s) => s.key === 'role');
    expect(absent?.present).toBe(false);
    expect(typeof absent?.evidence).toBe('string');
    expect((absent?.evidence ?? '').length).toBeGreaterThan(0);

    // Evidence is honest copy too: no em dashes anywhere.
    for (const s of scorePrompt(STRONG_PROMPT).signals) {
      expect(s.evidence ?? '').not.toContain(String.fromCharCode(0x2014));
    }
  });
});

describe('rubric: topFix', () => {
  it('names the single highest-impact missing signal on a weak prompt', () => {
    const result = scorePrompt(WEAK_PROMPT);
    expect(result.topFix).not.toBeNull();
    // The missing signal with the largest weight should drive topFix.
    const missing = result.signals.filter((s) => !s.present);
    const heaviest = missing.reduce((a, b) => (b.weight > a.weight ? b : a));
    expect(result.topFix).toBe(heaviest.tip);
  });

  it('returns null topFix when nothing is missing', () => {
    // Use require to grade against a small target the strong prompt fully meets.
    const result = scorePrompt(STRONG_PROMPT, { require: ['role', 'format'] });
    expect(result.topFix).toBeNull();
  });
});

describe('rubric: edge cases and purity', () => {
  it('empty prompt returns score 0 with all signals absent and does not throw', () => {
    const result = scorePrompt('');
    expect(result.score).toBe(0);
    expect(result.tier).toBe('weak');
    expect(result.signals.every((s) => s.present === false)).toBe(true);
  });

  it('whitespace-only prompt returns score 0', () => {
    expect(scorePrompt('     \n\t  ').score).toBe(0);
  });

  it('handles a very long prompt without error', () => {
    const huge = 'You are a chef. '.repeat(5000);
    expect(() => scorePrompt(huge)).not.toThrow();
    expect(scorePrompt(huge).score).toBeGreaterThanOrEqual(0);
  });

  it('is pure: same input twice yields identical deep result', () => {
    const p = 'Act as a coach for my team. Use bullet points.';
    expect(scorePrompt(p)).toEqual(scorePrompt(p));
  });
});

describe('rubric: require re-normalization', () => {
  it('grades only the required signals and re-normalizes to 100', () => {
    // A prompt that satisfies exactly the two required signals scores 100.
    const result = scorePrompt('You are a chef. Use a numbered list.', {
      require: ['role', 'format'],
    });
    expect(result.score).toBe(100);
  });

  it('a required signal that is missing pulls the score down proportionally', () => {
    const result = scorePrompt('You are a chef.', { require: ['role', 'format'] });
    // role present, format missing. role carries the larger normalized share,
    // so the score lands above zero but well below a full pass.
    expect(result.score).toBeGreaterThan(0);
    expect(result.score).toBeLessThan(100);
    expect(result.topFix).not.toBeNull();
  });
});
