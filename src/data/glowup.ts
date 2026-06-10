// Glow-Up level content. Three levels across distinct topics and tags.
// Each ingredient carries the text that gets stitched into the live prompt and
// an improvedOutput snippet used to assemble the simulated AI reply.
// NO EM DASHES anywhere.

import type { GlowUpLevel } from '../engine';

export const GLOWUP_LEVELS: GlowUpLevel[] = [
  {
    id: 'weeknight-dinner',
    topic: 'Weeknight dinner',
    tags: ['cooking'],
    lazyPrompt: 'Give me a dinner recipe.',
    weakOutput:
      'Here is a recipe: cook some chicken with vegetables and rice. Season to taste. Serve hot.',
    winScore: 75,
    ingredients: [
      {
        key: 'role',
        label: 'Role',
        text: 'You are a practical home cook who keeps things simple.',
        improvedOutput:
          'As a home cook, I will keep this doable on a busy night with tools you already own.',
      },
      {
        key: 'context',
        label: 'Context',
        text: 'I have 20 minutes after work and only a few pantry staples.',
        improvedOutput:
          'Working with 20 minutes and pantry staples, here is a one pan plan that respects your time.',
      },
      {
        key: 'constraints',
        label: 'Constraints',
        text: 'No nuts, under 600 calories, and use only one pan.',
        improvedOutput:
          'It stays nut free, lands under 600 calories, and dirties just one pan for easy cleanup.',
      },
      {
        key: 'format',
        label: 'Format',
        text: 'Give me a numbered ingredient list, then numbered steps.',
        improvedOutput:
          'Ingredients: 1) chicken thighs 2) garlic 3) spinach 4) olive oil. Steps: 1) sear 2) wilt greens 3) plate.',
      },
      {
        key: 'audience',
        label: 'Audience',
        text: 'It is for me and one picky teenager.',
        improvedOutput:
          'Flavors stay friendly for a picky teenager, with a side of hot sauce for anyone who wants a kick.',
      },
      {
        key: 'tone',
        label: 'Tone',
        text: 'Keep it warm and encouraging, like a friend in the kitchen.',
        improvedOutput:
          'You have got this. Crank the heat, trust your nose, and do not stress a little char.',
      },
    ],
  },
  {
    id: 'reschedule-email',
    topic: 'The awkward email',
    tags: ['writing', 'business'],
    lazyPrompt: 'Write an email to reschedule a meeting.',
    weakOutput:
      'Hi, I need to reschedule our meeting. Please let me know what time works. Thanks.',
    winScore: 75,
    ingredients: [
      {
        key: 'role',
        label: 'Role',
        text: 'You are a polished but friendly executive assistant.',
        improvedOutput:
          'Writing as a polished assistant, I will keep it respectful and easy to say yes to.',
      },
      {
        key: 'context',
        label: 'Context',
        text: 'A client demo ran long, so I cannot make our 2pm call today.',
        improvedOutput:
          'Subject: Quick reschedule. A client demo ran long, so I cannot make our 2pm today.',
      },
      {
        key: 'audience',
        label: 'Audience',
        text: 'It goes to a busy client I want to keep happy.',
        improvedOutput:
          'It leads with their convenience, since this is a busy client worth protecting.',
      },
      {
        key: 'constraints',
        label: 'Constraints',
        text: 'Keep it under 90 words and offer two new time slots.',
        improvedOutput:
          'Under 90 words, it offers two slots: Thursday 10am or Friday 1pm, your pick.',
      },
      {
        key: 'tone',
        label: 'Tone',
        text: 'Warm and apologetic without groveling.',
        improvedOutput:
          'The tone is warm and genuinely sorry, but it never grovels or over explains.',
      },
      {
        key: 'format',
        label: 'Format',
        text: 'Give me a subject line and a short body.',
        improvedOutput:
          'You get a clean subject line up top and a tight body ready to copy and send.',
      },
    ],
  },
  {
    id: 'explain-blockchain',
    topic: 'Explain it simply',
    tags: ['study', 'coding'],
    lazyPrompt: 'Explain blockchain.',
    weakOutput:
      'Blockchain is a distributed ledger technology that uses cryptographic hashing across a decentralized peer to peer network of nodes.',
    winScore: 72,
    ingredients: [
      {
        key: 'role',
        label: 'Role',
        text: 'You are a patient teacher who loves a good analogy.',
        improvedOutput:
          'As your patient teacher, let me trade the jargon for a picture you can actually hold.',
      },
      {
        key: 'audience',
        label: 'Audience',
        text: 'Explain it to a curious 12 year old.',
        improvedOutput:
          'Imagine you and your friends share a notebook. Everyone has a copy, so no one can cheat.',
      },
      {
        key: 'examples',
        label: 'Examples',
        text: 'Use one everyday example, like passing notes in class.',
        improvedOutput:
          'It is like passing notes where the whole class watches, so a fake note gets caught instantly.',
      },
      {
        key: 'constraints',
        label: 'Constraints',
        text: 'Keep it under 120 words and avoid technical jargon.',
        improvedOutput:
          'In under 120 plain words: a shared list everyone checks, so it is very hard to fake.',
      },
      {
        key: 'format',
        label: 'Format',
        text: 'Use three short bullet points.',
        improvedOutput:
          'Shared notebook. Everyone has a copy. Changing the past would break every copy at once.',
      },
      {
        key: 'tone',
        label: 'Tone',
        text: 'Keep it playful and curious.',
        improvedOutput:
          'Fun part: it is basically a group project where cheating is almost impossible. Wild, right?',
      },
    ],
  },
];
