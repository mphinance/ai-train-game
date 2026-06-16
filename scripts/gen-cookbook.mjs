// Agent C: generates content/cookbook.json from curated entries inspired by
// ../ai-cookbook source files (PROVIDERS.md, apps.md, capabilities.md, gemini.md,
// tips-and-tricks.md). Deterministic, offline. Run via: npm run gen-cookbook
// NO EM DASHES anywhere in this file.

import { writeFileSync } from 'node:fs';

const OUT = new URL('../content/cookbook.json', import.meta.url);

function build() {
  // At least 30 entries, at least 2 per goal.
  // Goals: writing, cooking, business, parenting, learning, money, coding, travel, fitness, creative
  return [
    // WRITING (4 entries)
    {
      goal: 'writing',
      title: 'Polish a rough draft without losing your voice',
      prompt:
        'Here is a rough draft I wrote. Clean it up for clarity and flow, but keep my voice and word choices as much as possible. Flag any sentences you changed significantly so I can review them. Here is the draft:\n\n[paste your draft]',
      source: 'Anthropic cookbook',
    },
    {
      goal: 'writing',
      title: 'Turn bullet notes into a polished email',
      prompt:
        'I have a list of bullet points I need to send as a professional email. Convert these into a clear, friendly email with a subject line. Keep it concise and direct. Here are the bullets:\n\n[paste your bullet points]',
      source: 'Anthropic cookbook',
    },
    {
      goal: 'writing',
      title: 'Summarize a long document into a one-page brief',
      prompt:
        'Summarize the following document into a one-page executive brief. Lead with the main takeaway, then cover the three most important supporting points, and end with any recommended actions. Cut anything that is not directly useful to a decision-maker.\n\nDocument:\n[paste document]',
      source: 'Anthropic cookbook',
    },
    {
      goal: 'writing',
      title: 'Rewrite a section to be simpler and shorter',
      prompt:
        'Rewrite the following passage so a smart 14-year-old could understand it without losing any of the meaning. Aim for half the word count. Here is the passage:\n\n[paste passage]',
      source: 'tips-and-tricks',
    },

    // COOKING (3 entries)
    {
      goal: 'cooking',
      title: 'Build a dinner from whatever is in the fridge',
      prompt:
        "Here is what I have in my fridge and pantry right now: [list ingredients]. Suggest two or three dinners I could make tonight. For each one, give me an ingredient list (including rough quantities), a short set of steps, and the total cook time. I have about 45 minutes.",
      source: 'Anthropic cookbook',
    },
    {
      goal: 'cooking',
      title: 'Scale a recipe up or down',
      prompt:
        'Scale this recipe to serve [number] people instead of the original serving size. List each ingredient with the new amount on its own line, and note any adjustments to cook time or temperature that the change requires.\n\nRecipe:\n[paste recipe]',
      source: 'tips-and-tricks',
    },
    {
      goal: 'cooking',
      title: 'Plan a week of dinners with a shopping list',
      prompt:
        "Plan 5 weeknight dinners for a family of [number]. Our dietary preferences or restrictions are: [list them]. Make sure no ingredient goes to waste across the week. Then give me a single consolidated shopping list organized by grocery store section.",
      source: 'Gemini cookbook',
    },

    // BUSINESS (4 entries)
    {
      goal: 'business',
      title: 'Draft an FAQ page from a messy set of support tickets',
      prompt:
        'Here are 20 support tickets from our customers. Read through them, identify the 10 most common questions, and write a clean FAQ page with concise answers. Group similar questions together under shared headings.\n\nTickets:\n[paste tickets]',
      source: 'Anthropic cookbook',
    },
    {
      goal: 'business',
      title: 'Write a job posting that attracts serious candidates',
      prompt:
        "Write a job posting for a [role title] at a [company description]. The role involves: [key responsibilities]. Required skills: [skills]. Salary range: [range]. Lead with what makes this role interesting, be specific about the day-to-day, and skip the generic filler that every job posting uses.",
      source: 'Anthropic cookbook',
    },
    {
      goal: 'business',
      title: 'Analyze customer feedback and find the top themes',
      prompt:
        'Read through these customer reviews and feedback comments. Identify the top five recurring themes, positive and negative. For each theme, quote two or three representative examples and estimate what percentage of the comments mention it.\n\nFeedback:\n[paste feedback]',
      source: 'Anthropic cookbook',
    },
    {
      goal: 'business',
      title: 'Turn a meeting transcript into a decision log',
      prompt:
        'Here is a transcript from our team meeting. Extract: (1) every decision that was made, (2) every action item with the owner and due date if mentioned, and (3) any open questions that still need to be resolved. Format it as a clean document I can share with the team.\n\nTranscript:\n[paste transcript]',
      source: 'tips-and-tricks',
    },

    // PARENTING (3 entries)
    {
      goal: 'parenting',
      title: 'Explain a hard news topic to a child',
      prompt:
        'My child is [age] years old and asked me about [topic]. Explain it in a way that is honest, age-appropriate, and not scary. Keep it under 150 words. If there are things that are genuinely uncertain or adult, say so simply rather than glossing over them.',
      source: 'Anthropic cookbook',
    },
    {
      goal: 'parenting',
      title: 'Create a reading list for a reluctant reader',
      prompt:
        'My [age]-year-old is a reluctant reader. They love [interests or favorite movies/games]. Suggest 8 books they might actually enjoy, with a one-sentence pitch for each that I could use to sell it to them. Mix series and standalones.',
      source: 'Gemini cookbook',
    },
    {
      goal: 'parenting',
      title: 'Write a chore chart that actually works',
      prompt:
        "Create a weekly chore chart for a [age]-year-old. The goals are [what you want them to learn or help with]. Make the tasks specific and age-appropriate. Include a simple rewards system that does not require cash every week. Format it as a table.",
      source: 'tips-and-tricks',
    },

    // LEARNING (4 entries)
    {
      goal: 'learning',
      title: 'Make a custom study guide from a textbook chapter',
      prompt:
        'Here is a chapter from my textbook. Create a study guide with: (1) a bulleted summary of the key concepts, (2) a short list of vocabulary terms and definitions, and (3) five practice questions at different difficulty levels. Chapter:\n\n[paste chapter text]',
      source: 'Anthropic cookbook',
    },
    {
      goal: 'learning',
      title: 'Explain a concept three different ways until it clicks',
      prompt:
        'Explain [concept] to me in three different ways: first as if I am a complete beginner, second using a concrete real-world analogy, and third as a brief technical definition. If I say "try again" on any version, rephrase that one.',
      source: 'Anthropic cookbook',
    },
    {
      goal: 'learning',
      title: 'Build a 30-day learning plan for a new skill',
      prompt:
        'I want to learn [skill] from scratch in 30 days. I can spend about [hours per day] each day. Build a day-by-day plan with specific tasks, free resources (YouTube channels, docs, practice sites), and clear milestones so I can tell if I am on track.',
      source: 'tips-and-tricks',
    },
    {
      goal: 'learning',
      title: 'Quiz me on a topic until I actually know it',
      prompt:
        'Quiz me on [topic]. Start with an easy question and get harder based on my answers. After each answer, tell me if I got it right and briefly explain the correct answer. Keep going until I answer five in a row correctly, then give me a short summary of the areas where I struggled.',
      source: 'Anthropic cookbook',
    },

    // MONEY (4 entries)
    {
      goal: 'money',
      title: 'Spot the waste in a monthly budget',
      prompt:
        'Here are my monthly spending categories and amounts for the last three months. Identify the top three areas where I am likely overspending compared to typical household benchmarks, and suggest one concrete action for each to cut back without changing my lifestyle dramatically.\n\nSpending:\n[paste your numbers]',
      source: 'Anthropic cookbook',
    },
    {
      goal: 'money',
      title: 'Explain a financial product in plain English',
      prompt:
        'Explain [financial product, e.g. "a Roth IRA" or "an HSA" or "term life insurance"] in plain English. Tell me: what it is, who it is best for, the main catch or downside, and one thing most people get wrong about it. No jargon unless you define it.',
      source: 'OpenAI cookbook',
    },
    {
      goal: 'money',
      title: 'Build a debt payoff plan',
      prompt:
        'Here are my debts with their balances, interest rates, and minimum payments: [list them]. I have [extra amount] per month to put toward debt. Compare the avalanche method (highest rate first) vs the snowball method (lowest balance first) for my specific numbers, and tell me which saves more and by how much.',
      source: 'Anthropic cookbook',
    },
    {
      goal: 'money',
      title: 'Analyze a CSV of transactions and find patterns',
      prompt:
        'Here is a CSV export of my bank transactions from the last 90 days. Categorize each transaction, total up each category, and flag any recurring subscriptions I might have forgotten about. Then give me a summary of where my money actually went versus where I probably think it went.\n\n[paste CSV data]',
      source: 'Anthropic cookbook',
    },

    // CODING (4 entries)
    {
      goal: 'coding',
      title: 'Debug an error you cannot figure out',
      prompt:
        "I am getting this error and cannot figure out why: [paste error message]. Here is the relevant code:\n\n[paste code]\n\nHere is what I have already tried: [list what you tried]. Walk me through what is likely causing it and the most direct fix. If you are not certain, say so and give me the top two candidates.",
      source: 'Anthropic cookbook',
    },
    {
      goal: 'coding',
      title: 'Write a script to automate a repetitive file task',
      prompt:
        'Write a Python script that [describe what it should do, e.g. "renames all files in a folder by prepending today\'s date" or "moves all .jpg files from Downloads into a folder sorted by year-month"]. Add comments explaining each step. Print a summary of what it did when it finishes.',
      source: 'OpenAI cookbook',
    },
    {
      goal: 'coding',
      title: 'Code review: find the real issues, skip the nitpicks',
      prompt:
        'Review this code for bugs and logic errors only. Skip style, formatting, and minor naming preferences unless they would cause a bug. For each issue you find, tell me the line number, what is wrong, and how to fix it. Here is the code:\n\n[paste code]',
      source: 'Anthropic cookbook',
    },
    {
      goal: 'coding',
      title: 'Convert a SQL query to plain English, and back',
      prompt:
        'Explain what this SQL query does in plain English, step by step, as if the reader does not know SQL. Then, separately, rewrite it for better readability without changing the result.\n\nQuery:\n[paste query]',
      source: 'Anthropic cookbook',
    },

    // TRAVEL (3 entries)
    {
      goal: 'travel',
      title: 'Build a day-by-day itinerary for a city trip',
      prompt:
        'I am visiting [city] for [number] days. I like [interests, e.g. "history, good food, walkable neighborhoods, avoiding tourist traps"]. Build a day-by-day itinerary with morning, afternoon, and evening suggestions, grouped by neighborhood to minimize backtracking. Include one restaurant recommendation per meal.',
      source: 'Gemini cookbook',
    },
    {
      goal: 'travel',
      title: 'Pack the right bag for any trip',
      prompt:
        'Build a packing list for a [length] trip to [destination] in [month/season]. The trip involves: [activities, e.g. "two business days plus weekend hiking"]. I am checking one bag and want to avoid overpacking. Flag anything I will regret forgetting.',
      source: 'tips-and-tricks',
    },
    {
      goal: 'travel',
      title: 'Compare two destinations and pick the right one',
      prompt:
        'I am deciding between [destination A] and [destination B] for a trip in [month]. My priorities are: [list 3 to 5 things that matter to you, e.g. "warm weather, affordable, good food scene, not too crowded, direct flight from Chicago"]. Compare them honestly on each priority and make a recommendation.',
      source: 'Gemini cookbook',
    },

    // FITNESS (3 entries)
    {
      goal: 'fitness',
      title: 'Design a beginner strength program with minimal equipment',
      prompt:
        'Design a 3-day-per-week beginner strength training program I can do at home with [equipment available, e.g. "a pair of dumbbells and a pull-up bar"]. I want to build general strength. Give me a weekly schedule, the sets and reps for each exercise, and notes on what to focus on for form.',
      source: 'Anthropic cookbook',
    },
    {
      goal: 'fitness',
      title: 'Build a meal prep plan that supports your training',
      prompt:
        'I train [frequency and type, e.g. "4 days a week, mostly lifting"]. My goal is [goal, e.g. "building muscle without gaining too much fat"]. I can spend about [hours] on Sunday meal prep. Give me a weekly meal plan with rough macros per day and a prep sequence so nothing goes to waste.',
      source: 'tips-and-tricks',
    },
    {
      goal: 'fitness',
      title: 'Diagnose why you are stuck on a fitness plateau',
      prompt:
        "I have been stuck at [metric, e.g. 'the same weight on bench press' or 'the same body weight'] for [duration]. Here is my current routine: [describe it]. Here is what I eat on a typical day: [describe it]. Tell me the most likely reasons I am not progressing and what to change first.",
      source: 'Anthropic cookbook',
    },

    // CREATIVE (4 entries)
    {
      goal: 'creative',
      title: 'Generate cover art concepts for a blog or podcast',
      prompt:
        'I need cover art ideas for [project name], which is about [brief description]. My audience is [audience]. The tone is [e.g. "serious but approachable" or "playful and bold"]. Give me five distinct visual concepts, each described in two or three sentences. Include a color palette suggestion and a typeface direction for each.',
      source: 'Gemini cookbook',
    },
    {
      goal: 'creative',
      title: 'Write the first scene of a short story from a single premise',
      prompt:
        'Write the opening scene (300 to 400 words) of a short story based on this premise: [your premise]. Make it start in the middle of the action. Establish the main character, the setting, and the tension in this first scene without explaining too much. End on something that makes the reader want to continue.',
      source: 'OpenAI cookbook',
    },
    {
      goal: 'creative',
      title: 'Name a product, project, or business',
      prompt:
        'I need a name for [what it is]. Here is what it does: [description]. The target audience is [audience]. The tone should be [e.g. "professional and memorable" or "playful and irreverent"]. Give me 15 name candidates. For each one, tell me in one sentence why it works and note any obvious trademark or domain concerns.',
      source: 'Anthropic cookbook',
    },
    {
      goal: 'creative',
      title: 'Write lyrics for a short song from a feeling or story',
      prompt:
        'Write lyrics for a [genre, e.g. "folk" or "upbeat pop"] song about [theme or story]. Structure it with two verses and a chorus. The mood should be [mood]. Keep the language simple and concrete, no abstract filler. Suggest a chord progression that fits the feel.',
      source: 'Gemini cookbook',
    },
  ];
}

const entries = build();
if (entries.length > 0) {
  writeFileSync(OUT, JSON.stringify(entries, null, 2) + '\n');
  console.log(`wrote ${entries.length} entries to content/cookbook.json`);
} else {
  console.log('skeleton: no entries generated yet (Agent C to implement); leaving cookbook.json as-is');
}
