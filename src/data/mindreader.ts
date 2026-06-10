// Mind Reader goals. Each goal is a secret brief the player must fully specify
// in ONE prompt. requirements are lowercase keywords/phrases that must appear in
// the prompt (case-insensitive substring match). literalReply is the deliberately
// too-literal answer the AI gives when specifics are missing. satisfiedReply is the
// payoff when every requirement is present.
// Voice: warm, playful, second person. NO EM DASHES anywhere.

import type { MindReaderGoal } from '../engine';

export const MIND_READER_GOALS: MindReaderGoal[] = [
  {
    id: 'gymbro-meals',
    tags: ['fitness', 'cooking'],
    brief:
      'Get a 3 day vegetarian meal plan for a gym bro who hates mushrooms and wants high protein.',
    requirements: ['3 day', 'vegetarian', 'no mushrooms', 'high protein'],
    literalReply:
      'Here is a meal plan: Day 1, eat food. It is technically a plan, and it is technically meals. You did not say how many days, whether it was vegetarian, how much protein, or which fungi to avoid, so I guessed. Bon appetit, I guess.',
    satisfiedReply:
      'Locked in. A 3 day vegetarian plan, high protein on every plate (tofu, lentils, Greek yogurt, edamame), and not a single mushroom in sight. Your gym bro gets his gains and keeps his sanity. Nice reading of the room.',
  },
  {
    id: 'cold-email',
    tags: ['business', 'writing'],
    brief:
      'Write a cold email to a busy founder that is under 100 words, friendly in tone, and ends with one clear call to action.',
    requirements: ['cold email', 'under 100 words', 'friendly', 'call to action'],
    literalReply:
      'Dear Sir or Madam, I am writing to write you an email. This email exists. It is nine paragraphs long, sounds like a robot lawyer, and never actually asks you for anything. Regards. You never said short, warm, or what you wanted them to DO.',
    satisfiedReply:
      'Sharp. A friendly cold email, comfortably under 100 words, that respects a founder\'s time and closes with one clean ask: "Open to a 15 minute call next Tuesday?" No fluff, one clear next step. That one actually gets a reply.',
  },
  {
    id: 'tokyo-trip',
    tags: ['travel', 'money'],
    brief:
      'Plan a 5 day Tokyo trip for a first timer on a budget who wants food spots and easy public transit.',
    requirements: ['5 day', 'tokyo', 'budget', 'food', 'public transit'],
    literalReply:
      'Trip planned. Step one: go to a place. Step two: do a thing. I picked Tokyo because you whispered it once. I did not know your budget, how many days, that you are new, or that you care about food or trains, so enjoy your vague vacation.',
    satisfiedReply:
      'Now we are traveling. A 5 day Tokyo itinerary built for a first timer, with budget eats from ramen counters to Tsukiji, and every day routed around an easy Metro pass. You get the city without torching your wallet. Bon voyage.',
  },
  {
    id: 'study-plan',
    tags: ['study', 'writing'],
    brief:
      'Make a 1 week study plan for a beginner learning Python, 1 hour per day, using free resources only.',
    requirements: ['1 week', 'python', 'beginner', '1 hour', 'free'],
    literalReply:
      'Study plan: study. You will learn things by learning them. I did not know the subject for sure, your level, how long you have, or that paid courses are off the table, so this plan fits absolutely anyone and helps absolutely no one.',
    satisfiedReply:
      'There it is. A 1 week Python plan for a true beginner, one focused hour a day, built entirely on free resources (official docs, freeCodeCamp, a couple of YouTube playlists). Doable, paced, and zero dollars spent. Go learn the thing.',
  },
  {
    id: 'kid-bedtime',
    tags: ['parenting', 'creative'],
    brief:
      'Write a short bedtime story for a 5 year old about a brave dinosaur, with a calm ending and no scary parts.',
    requirements: ['bedtime story', '5 year old', 'dinosaur', 'calm ending', 'not scary'],
    literalReply:
      'Once upon a time there was a story. The end. I did not know the age, the character, the mood, or that it needed to wind down gently, so here is a plot free tale that will absolutely not put anyone to sleep. Goodnight.',
    satisfiedReply:
      'Aww. A gentle little tale for a 5 year old about Rumble, a brave dinosaur who helps a lost firefly find home, soft all the way through with a cozy, sleepy ending. No jump scares, just a slow drift to dreamland. Sweet dreams.',
  },
];
