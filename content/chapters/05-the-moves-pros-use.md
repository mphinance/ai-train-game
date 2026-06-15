---
order: 5
slug: the-moves-pros-use
title: The Moves That Separate the Pros
summary: Give it tools, give it examples, let it think, and have it check its own work.
tags: [advanced, technique]
gym:
  brief: Upgrade this prompt with a worked example and a request to think step by step before answering.
  starter: write a product description for my handmade candles
  require: [examples, stepwise, specificity, format]
---

Everything so far gets you to capable. This chapter is about the handful of moves that separate
capable from genuinely good. They are not secret and they are not hard. They are the things people who
use AI all day reach for without thinking, and once you know them, you will reach for them too.

There are four, and they map onto a simple idea. The more you turn a guessing game into a guided
process, the better the output gets.

## Give it examples

This is the single highest-leverage move, and the most underused. Instead of describing the style you
want, show it. Paste in one or two examples of the kind of output you are after and say "match this
style." A model is far better at copying a pattern than at interpreting an adjective. "Make it punchy"
is vague. Three punchy sentences you wrote are not. One good example is worth a paragraph of
instructions, because it removes the guessing.

This is why the pros keep a small library of their own best work. When they want more of it, they show
the model what good looks like instead of describing it.

## Let it think before it answers

For anything with reasoning in it, a plan, a tricky problem, a decision with tradeoffs, tell the model
to work through it step by step before giving the final answer. "Think it through out loud, then give
me your recommendation." This sounds trivial. It is not. A model that reasons first lands the answer
far more often than one that blurts the conclusion, for the same reason you solve a hard problem better
on paper than in your head. For the big tasks, you can go further and ask for a plan first, review it,
and only then let it execute.

## Give it the right material

The model can only work with what is in front of it. Pros do not ask from memory, they bring the
material into the room. Paste in the document, the data, the past examples, the real context. When you
want an answer grounded in specific truth, the move is to supply that truth in the prompt rather than
hoping it was in training. The same idea scales up into connecting models to live tools and your own
files, but the core habit starts here. Stop asking it to recall, start giving it something to read.

## Have it check its own work

A first draft is a first draft, even a model's. So make it grade itself. "Review your answer against
these three criteria and fix anything that falls short." "What are the weakest parts of this and how
would you improve them?" A model is often a better critic of its output than it is a first-try author
of it, which means a single self-review pass catches a surprising number of problems before they reach
you. This is the same logic teams use when they have a second cheap pass grade the first one. You can
do it solo, in one prompt.

## Stack them

The real unlock is using these together. Give it an example, give it the material, ask it to think
step by step, then have it check itself against your criteria. That is a different machine than a
one-line request, and the output reflects it. You do not need all four every time. You need to know
they exist so you can reach for the right one when the stakes go up.

## Try it

Take an ordinary prompt and add the two moves with the most leverage, a real example and a request to
reason before answering.

::practice::

None of this is advanced in the scary sense. It is just deliberate. The people who look like naturals
with AI are mostly people who do these four things on purpose, until they stop having to think about
it.
