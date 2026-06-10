// Did-You-Know Deck content. Each card is an unexpected AI use, tagged so the
// Taste Engine learns what the player reaches for. Voice is warm and playful.
// NO EM DASHES anywhere. Use periods, commas, or "and".

import type { DeckCard } from '../engine';

export const DECK_CARDS: DeckCard[] = [
  {
    id: 'rubber-duck',
    title: 'Rubber-duck your bug',
    tags: ['coding', 'study'],
    front: 'Stuck on code? Explain it out loud to nobody.',
    reveal:
      'Paste your broken code and narrate what you THINK each line does. The AI catches the spot where your story and your code disagree. That gap is almost always the bug.',
    challenge:
      'Write a prompt that asks the AI to play rubber-duck. Tell it to read your explanation, then point only at the line where your intention and your code part ways.',
  },
  {
    id: 'explain-like-8',
    title: 'Explain it like I am 8',
    tags: ['study', 'parenting'],
    front: 'Any scary topic, shrunk to kid-size.',
    reveal:
      'Hand the AI something dense like a tax form or a science paper and ask for the eight-year-old version. Simple words force out the jargon and you finally see the actual idea.',
    challenge:
      'Pick a topic you find confusing. Write a prompt asking the AI to explain it to an eight-year-old, in under one hundred words, with one everyday example.',
  },
  {
    id: 'fridge-recipes',
    title: 'Turn your fridge into dinner',
    tags: ['cooking'],
    front: 'Random leftovers, one real meal.',
    reveal:
      'List whatever is actually in your fridge, even the sad half onion, and the AI builds a recipe around it. No grocery run, no decision fatigue, less waste.',
    challenge:
      'Write a prompt that lists five things in your kitchen right now and asks for one dinner using only those plus pantry basics. Add a constraint like time or no oven.',
  },
  {
    id: 'hard-conversation',
    title: 'Rehearse a hard talk',
    tags: ['parenting', 'business'],
    front: 'Practice the talk before you have it.',
    reveal:
      'Ask the AI to role-play the other person, a tense boss or a teen, and push back like they would. You get to flub your lines in private and walk in calmer.',
    challenge:
      'Write a prompt that casts the AI as someone you need to talk to. Give it their mood and your goal, and ask it to respond in character so you can practice.',
  },
  {
    id: 'contract-summary',
    title: 'Decode the fine print',
    tags: ['money', 'business'],
    front: 'A wall of legalese, in plain English.',
    reveal:
      'Paste a lease or terms of service and ask what you are actually agreeing to, plus anything that could bite you later. It will not replace a lawyer, but it shows you where to look.',
    challenge:
      'Write a prompt asking the AI to summarize a contract in plain language, flag three clauses that could cost you, and list the questions you should ask before signing.',
  },
  {
    id: 'trip-constraints',
    title: 'Plan a trip with rules',
    tags: ['travel'],
    front: 'Real budget, real limits, real plan.',
    reveal:
      'Throw the AI your real constraints, a budget, dates, a kid who naps, a fear of flying, and it builds an itinerary that respects all of them at once instead of a generic top ten list.',
    challenge:
      'Write a prompt for a three-day trip. Include a budget, who is going, one hard constraint, and ask for a day-by-day plan with a backup for bad weather.',
  },
  {
    id: 'notes-to-outline',
    title: 'Rambling notes to an outline',
    tags: ['writing', 'study'],
    front: 'Brain dump in, clean structure out.',
    reveal:
      'Dump your messy meeting notes or shower thoughts and ask the AI to find the spine. It groups the chaos into themes so you can see the shape of what you were trying to say.',
    challenge:
      'Write a prompt that hands the AI a pile of unordered notes and asks for a three-level outline grouped by theme, with anything off-topic moved to a parking lot list.',
  },
  {
    id: 'reply-in-tone',
    title: 'Reply in your own voice',
    tags: ['writing', 'business'],
    front: 'Sound like you, just faster.',
    reveal:
      'Give the AI a sample of how you actually write, then a message to answer. It drafts a reply in your tone, so you ship the email instead of staring at it for twenty minutes.',
    challenge:
      'Write a prompt that includes a short sample of your writing style and a message to respond to. Ask for a reply that matches your tone and keeps it under five sentences.',
  },
  {
    id: 'workout-from-gear',
    title: 'A workout from whatever you have',
    tags: ['fitness'],
    front: 'No gym? No problem.',
    reveal:
      'Tell the AI your gear, a chair and one dumbbell, your time, and any tweaky knee, and it builds a workout that fits your body and your living room, not a magazine cover.',
    challenge:
      'Write a prompt asking for a twenty-minute workout using only your bodyweight. Name one area to focus on and one injury or limit to work around.',
  },
  {
    id: 'devil-advocate',
    title: 'Stress-test your idea',
    tags: ['business', 'creative'],
    front: 'Find the holes before someone else does.',
    reveal:
      'Pitch your plan and ask the AI to argue against it like a skeptical investor. Better to hear the three weakest points now, in private, than in the meeting.',
    challenge:
      'Write a prompt that describes an idea you have, then asks the AI to play a tough critic and name the three biggest risks plus one way to test each one cheaply.',
  },
  {
    id: 'budget-coach',
    title: 'Talk through your money',
    tags: ['money', 'study'],
    front: 'A judgment-free numbers buddy.',
    reveal:
      'Share rough income and spending and ask the AI to spot where the money leaks and what to try first. It does the boring math so you can make one real change this month.',
    challenge:
      'Write a prompt that gives the AI a simple monthly income and three expenses, and asks for one specific saving move plus the math on what it adds up to in a year.',
  },
  {
    id: 'story-spark',
    title: 'Beat creative block',
    tags: ['creative', 'writing'],
    front: 'A blank page, gently un-blanked.',
    reveal:
      'Ask for ten wildly different first lines or plot twists for your idea. You are not stealing one, you are jostling your own brain loose until your version shows up.',
    challenge:
      'Write a prompt asking for five opening lines for a story in a genre you like. Give it a mood and one rule, like no weather and no dreams.',
  },
];
