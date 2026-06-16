// Content schema for Practical AI. Wave 1 owns this file. Later waves import these.
// NO EM DASHES anywhere in this codebase.

import type { SignalKey } from '../engine/types';

// An inline practice drill attached to a chapter (rendered where ::practice:: appears)
// and reused standalone in the Gym. require[] narrows the rubric to the drill's target
// signals so a level grades on what it is teaching.
export interface PracticeSpec {
  brief: string; // what the learner should do, e.g. "Rewrite this so it earns a Strong score."
  starter: string; // the lazy starting prompt they improve
  require: SignalKey[]; // rubric signals this drill grades on (empty = grade on all)
}

// One chapter, parsed from content/chapters/*.md frontmatter + body.
export interface Chapter {
  order: number;
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  gym?: PracticeSpec; // optional inline drill; rendered at the ::practice:: marker
  body: string; // Markdown body (frontmatter stripped)
}

// Marker line (a chapter body line equal to this, trimmed) renders the chapter's PracticeBox.
export const PRACTICE_MARKER = '::practice::';

// One Cookbook Browser entry. Generated into content/cookbook.json by scripts/gen-cookbook.mjs.
export interface CookbookEntry {
  goal: string; // real-life bucket: writing, cooking, business, parenting, learning, money, ...
  title: string;
  prompt: string; // copy-able starter prompt
  source?: string; // which cookbook/provider it came from
}
