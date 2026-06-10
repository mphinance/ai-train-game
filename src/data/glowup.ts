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
  {
    id: 'couch-to-strong',
    topic: 'The comeback workout',
    tags: ['fitness'],
    lazyPrompt: 'Make me a workout plan.',
    weakOutput:
      'Do some cardio and lifting a few times a week. Remember to stretch and stay hydrated. Good luck.',
    winScore: 76,
    ingredients: [
      {
        key: 'role',
        label: 'Role',
        text: 'You are a calm coach who never makes me feel judged.',
        improvedOutput:
          'As your coach, no shame here. We meet your body where it is and build from there.',
      },
      {
        key: 'context',
        label: 'Context',
        text: 'I have not trained in two years and my knees get cranky.',
        improvedOutput:
          'Since it has been two years and your knees complain, we ramp slow and keep impact low.',
      },
      {
        key: 'constraints',
        label: 'Constraints',
        text: 'Three days a week, 30 minutes each, only dumbbells at home.',
        improvedOutput:
          'Three 30 minute sessions a week, dumbbells only, so it fits a living room and a real schedule.',
      },
      {
        key: 'format',
        label: 'Format',
        text: 'Lay it out as a weekly table I can follow day by day.',
        improvedOutput:
          'Mon: squats and rows. Wed: presses and hinges. Fri: carries and core. Each with sets and reps.',
      },
      {
        key: 'audience',
        label: 'Audience',
        text: 'It is for a busy 40 year old, not a gym influencer.',
        improvedOutput:
          'Built for a busy 40 year old, so no two hour sessions and no equipment you do not own.',
      },
      {
        key: 'tone',
        label: 'Tone',
        text: 'Encouraging and zero drill sergeant energy.',
        improvedOutput:
          'Show up, do what you can, and call it a win. Consistency beats heroics every single time.',
      },
    ],
  },
  {
    id: 'long-weekend-escape',
    topic: 'The weekend escape',
    tags: ['travel'],
    lazyPrompt: 'Plan a trip for me.',
    weakOutput:
      'Pick a destination you like, book a hotel and flights, and visit some popular attractions. Have fun.',
    winScore: 74,
    ingredients: [
      {
        key: 'role',
        label: 'Role',
        text: 'You are a savvy local guide who hates tourist traps.',
        improvedOutput:
          'As a local who skips the traps, I will point you at the streets the guidebooks forget.',
      },
      {
        key: 'context',
        label: 'Context',
        text: 'Three days in Lisbon in October, my first time there.',
        improvedOutput:
          'Three October days in Lisbon, first visit, so we balance the must sees with room to wander.',
      },
      {
        key: 'constraints',
        label: 'Constraints',
        text: 'Budget is moderate, lots of walking, and no early mornings.',
        improvedOutput:
          'Moderate budget, walkable routes, and gentle 10am starts so no one is dragging by noon.',
      },
      {
        key: 'audience',
        label: 'Audience',
        text: 'It is for a couple who love food and slow mornings.',
        improvedOutput:
          'For a food loving couple, each day centers a great meal and leaves space for a lazy coffee.',
      },
      {
        key: 'format',
        label: 'Format',
        text: 'Give me a day by day itinerary with a few backup options.',
        improvedOutput:
          'Day 1: Alfama and a tram ride. Day 2: Belem and pastries. Day 3: Sintra, or Cascais if it rains.',
      },
      {
        key: 'examples',
        label: 'Examples',
        text: 'Name a couple of real neighborhoods or dishes to anchor it.',
        improvedOutput:
          'Think bacalhau in Alfama and a pastel de nata in Belem, with a miradouro sunset to close.',
      },
    ],
  },
  {
    id: 'budget-reboot',
    topic: 'The budget reboot',
    tags: ['money'],
    lazyPrompt: 'Help me budget.',
    weakOutput:
      'Track your income and expenses, cut unnecessary spending, and try to save money each month.',
    winScore: 78,
    ingredients: [
      {
        key: 'role',
        label: 'Role',
        text: 'You are a friendly money coach, not a finance lecture.',
        improvedOutput:
          'As your money coach, no jargon and no guilt. We just get your dollars a job to do.',
      },
      {
        key: 'context',
        label: 'Context',
        text: 'I take home 4,000 a month and have no idea where it goes.',
        improvedOutput:
          'Working from 4,000 take home, we first shine a light on the leaks before we plug them.',
      },
      {
        key: 'constraints',
        label: 'Constraints',
        text: 'I want to save 500 a month without giving up my coffee.',
        improvedOutput:
          'We carve out 500 in savings and protect the coffee, because tiny joys keep a plan alive.',
      },
      {
        key: 'format',
        label: 'Format',
        text: 'Break it into simple percentage buckets I can copy.',
        improvedOutput:
          'Try 50 percent needs, 30 percent wants, 20 percent savings, then tweak to fit your real life.',
      },
      {
        key: 'audience',
        label: 'Audience',
        text: 'It is for someone who finds spreadsheets scary.',
        improvedOutput:
          'No spreadsheet required. Three labeled accounts and a five minute weekly check do the work.',
      },
      {
        key: 'tone',
        label: 'Tone',
        text: 'Supportive and judgment free.',
        improvedOutput:
          'You are not behind, you are starting. The fact that you are here already moved the needle.',
      },
    ],
  },
];
