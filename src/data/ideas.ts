// The Idea Forge fuel. A tagged bank of genuinely useful, specific AI-use ideas.
// Each card carries InterestTags so the Forge can rank by overlap with a player's
// inferred taste. Every body is actionable, with a copy-pasteable mini prompt.
// Voice: warm, playful, NO EM DASHES. Theme off tokens, never the network.

import type { IdeaCard } from '../engine';

export const IDEA_BANK: IdeaCard[] = [
  {
    id: 'cook-fridge-raid',
    tags: ['cooking'],
    title: 'Turn your fridge into dinner',
    body: 'Snap or list what is actually in there and let AI plan around it. Try: "Here is what is in my fridge: eggs, half an onion, spinach, feta, tortillas. Give me 3 dinners I can make tonight with only these plus pantry basics. Rank by least effort."',
  },
  {
    id: 'cook-flavor-swap',
    tags: ['cooking', 'study'],
    title: 'Learn the why behind a recipe',
    body: 'Stop following recipes blind and start understanding them. Try: "Explain why this carbonara uses no cream, what each step does, and what I can swap if I am out of pancetta. Keep it to a short paragraph per question."',
  },
  {
    id: 'cook-meal-prep',
    tags: ['cooking', 'fitness'],
    title: 'Build a meal-prep plan that fits your macros',
    body: 'Hand it your targets and let it do the math. Try: "Plan 4 lunches I can batch on Sunday, about 600 calories and 40g protein each, no fish, using a rice cooker and one sheet pan. Give me a single grocery list."',
  },
  {
    id: 'write-unstick',
    tags: ['writing'],
    title: 'Beat the blank page',
    body: 'Use AI as a sparring partner, not a ghostwriter. Try: "I want to write about why I quit my job. Ask me 5 sharp questions to pull out the real story, then wait for my answers before drafting anything."',
  },
  {
    id: 'write-edit-pass',
    tags: ['writing', 'study'],
    title: 'Get a brutal line edit',
    body: 'Paste your draft and ask for the cut, not the compliment. Try: "Edit this for clarity and punch. Mark anything that drags, flag any sentence over 25 words, and suggest a stronger opening line. Do not rewrite the whole thing for me."',
  },
  {
    id: 'write-voice-match',
    tags: ['writing', 'creative'],
    title: 'Find your own voice by naming it',
    body: 'Teach the AI your style so it stops sounding like a press release. Try: "Here are 3 things I wrote. Describe my voice in 5 adjectives and 3 quirks, then rewrite this stiff paragraph to match it."',
  },
  {
    id: 'code-rubber-duck',
    tags: ['coding'],
    title: 'Rubber-duck a bug out loud',
    body: 'Explain the problem to AI and half the time you solve it mid-sentence. Try: "Here is my function and the error. Do not fix it yet. Ask me what I expected to happen versus what actually happened, one question at a time."',
  },
  {
    id: 'code-explain-this',
    tags: ['coding', 'study'],
    title: 'Decode code you did not write',
    body: 'Paste the scary file and ask for a tour. Try: "Explain this code like I am a junior dev. Walk top to bottom, tell me what each block does and why, and flag anything that looks risky or clever."',
  },
  {
    id: 'code-test-first',
    tags: ['coding', 'business'],
    title: 'Generate tests before you trust it',
    body: 'Make the AI prove its own work. Try: "Write 6 test cases for this function, including 2 edge cases and 1 case you think I forgot. List them as plain English first, then as code."',
  },
  {
    id: 'parent-explain-eight',
    tags: ['parenting'],
    title: 'Explain anything like they are 8',
    body: 'Turn "why is the sky blue" into a real answer you can deliver. Try: "Explain how rainbows work to an 8 year old in under 60 words, then give me one 2-minute experiment we can do at the kitchen sink."',
  },
  {
    id: 'parent-roleplay-talk',
    tags: ['parenting', 'creative'],
    title: 'Rehearse a hard conversation',
    body: 'Practice the talk before you have the talk. Try: "Role-play my 13 year old who is upset about screen-time rules. You play them, I respond, and after a few turns tell me where I got defensive."',
  },
  {
    id: 'parent-boredom-buster',
    tags: ['parenting', 'travel'],
    title: 'Kill the "I am bored" in 30 seconds',
    body: 'Keep an instant idea machine in your pocket. Try: "Give me 5 screen-free activities for a 6 year old and a 9 year old in a small apartment on a rainy day, each needing only stuff most homes already have."',
  },
  {
    id: 'fit-form-check',
    tags: ['fitness'],
    title: 'Build a workout around your actual life',
    body: 'No app, no guru, just your constraints. Try: "Design a 3-day full-body plan, 40 minutes each, only dumbbells and a bench, scaled for someone returning after 6 months off. Tell me how to progress week to week."',
  },
  {
    id: 'fit-habit-coach',
    tags: ['fitness', 'study'],
    title: 'Use AI as a habit coach',
    body: 'Let it design the streak, you just show up. Try: "I want to run 3 times a week. Build me a 4-week beginner plan, anticipate the 2 excuses I am most likely to use, and write a one-line reply to each."',
  },
  {
    id: 'biz-cold-email',
    tags: ['business'],
    title: 'Write a cold email that gets a reply',
    body: 'Make it about them, not you. Try: "Draft a 4-sentence cold email to a small bakery offering my web design help. No buzzwords, lead with one specific thing I noticed about their site, end with a tiny ask."',
  },
  {
    id: 'biz-pricing',
    tags: ['business', 'money'],
    title: 'Pressure-test a pricing idea',
    body: 'Argue with a skeptic before your customers do. Try: "I want to charge 49 dollars a month for this tool. Play a skeptical buyer and give me your 3 strongest objections, then tell me which one I should fix first."',
  },
  {
    id: 'biz-meeting-notes',
    tags: ['business', 'writing'],
    title: 'Turn messy notes into a clean recap',
    body: 'Paste the chaos, get the summary. Try: "Here are my raw meeting notes. Pull out decisions, action items with owners, and open questions as 3 short lists. If something is ambiguous, flag it instead of guessing."',
  },
  {
    id: 'travel-local-plan',
    tags: ['travel'],
    title: 'Plan a day like a local, not a tourist',
    body: 'Skip the top-10 listicle. Try: "Plan one relaxed day in Lisbon for someone who hates crowds and loves food and walking. Group it by neighborhood, keep it to 4 stops, and tell me the best time of day for each."',
  },
  {
    id: 'travel-packing',
    tags: ['travel', 'study'],
    title: 'Get a packing list that fits the trip',
    body: 'Tailored beats generic every time. Try: "Make a carry-on-only packing list for 5 days in Tokyo in November, business-casual plus one nice dinner. Group by category and flag anything I can buy there instead of packing."',
  },
  {
    id: 'study-feynman',
    tags: ['study'],
    title: 'Learn it by teaching it back',
    body: 'The fastest way to find your gaps. Try: "I will explain photosynthesis to you in my own words. Listen, then tell me exactly where my explanation was wrong, vague, or missing a step."',
  },
  {
    id: 'study-quiz-me',
    tags: ['study', 'parenting'],
    title: 'Turn any topic into a quiz',
    body: 'Active recall beats re-reading. Try: "Quiz me on the French Revolution. Ask one question at a time, wait for my answer, tell me if I am right, and get harder only when I get one correct."',
  },
  {
    id: 'creative-brainstorm',
    tags: ['creative'],
    title: 'Brainstorm past the obvious 5 ideas',
    body: 'Push it to the weird zone. Try: "Give me 15 names for a cozy board-game cafe. First 5 obvious, next 5 playful, last 5 genuinely strange. Then tell me which one you would actually pick and why."',
  },
  {
    id: 'creative-worldbuild',
    tags: ['creative', 'writing'],
    title: 'Build a world one question at a time',
    body: 'Use AI as a curious co-author. Try: "Help me build the setting for a short story. Ask me one vivid worldbuilding question at a time, build on each answer, and stop after 6 to summarize what we made."',
  },
  {
    id: 'money-budget',
    tags: ['money'],
    title: 'Build a budget you will actually keep',
    body: 'Start from your real numbers, not a template. Try: "I take home 4200 a month. Help me build a simple 3-bucket budget, point out where I am probably overspending based on typical patterns, and suggest one painless cut."',
  },
  {
    id: 'money-explain-jargon',
    tags: ['money', 'study'],
    title: 'Translate finance jargon into plain talk',
    body: 'Never nod along to a term you do not get again. Try: "Explain what an ETF is like I am 12, then tell me one thing a beginner usually gets wrong about it, in under 100 words total."',
  },
  {
    id: 'money-side-hustle',
    tags: ['money', 'business'],
    title: 'Stress-test a side-hustle idea',
    body: 'Find the holes before you spend a dollar. Try: "I want to sell custom dog bandanas online. Walk me through the 3 biggest reasons this could flop and one cheap experiment to test demand this week."',
  },
];
