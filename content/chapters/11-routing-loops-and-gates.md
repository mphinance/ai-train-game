---
order: 11
slug: routing-loops-and-gates
title: Routing, Loops, and Knowing When to Step In
summary: Put effort where it counts, let it loop until it is right, and keep your hand on the moments that matter.
tags: [intermediate, building, control]
gym:
  brief: Direct a full build. Give the model a role, break the work into parts, set a clear guardrail, and make it check itself at the end. Keep it to a useful length.
  starter: build me a 30-day plan to learn a new skill
  require: [role, decomposition, constraints, verification, lengthFit]
---

You can split work across roles now, and you can make the model check itself. This chapter is about the
judgment that ties them together, the three small decisions that separate someone who can direct AI from
someone who just talks to it. Where to spend effort, when to let it loop, and when to take your hand off
the keyboard and decide for yourself.

## Route the effort

Not every part of a job deserves the same care. A long task is usually a mix of trivial stretches and a
few hard turns, and treating them all the same wastes effort on the easy parts and starves the hard
ones. The move is to route. Tell the model which parts are routine and which need real thought, so it
spends its reasoning where it counts.

"Draft the intro and the boilerplate quickly, those are easy. Then slow down on the cost analysis, work
through it step by step, and double-check the math." That one instruction does what a smart manager
does, it matches the effort to the difficulty. In bigger systems this is literally a routing layer
picking a fast cheap model for the easy parts and a slow careful one for the hard parts. You are doing
the same thing in plain language, inside one chat, and it costs you nothing but a sentence.

## Let it loop

Some work is not done after one pass. It is done when it meets a bar. For those, the trick is to define
the bar and let the model keep going until it clears it, instead of stopping at the first attempt and
fixing things yourself.

"Keep revising until every one of these is true: it is under 150 words, it names the benefit in the
first line, and it has no jargon. Show me only the version that passes." Now the model is not handing you
a draft to grade. It is grading itself against your finish line and looping until it gets there. The
finish line is everything, so make it something the model can actually check. "Make it good" is not a
bar. "Under 150 words, benefit first, no jargon" is. The clearer the test, the more of the work the loop
can carry without you.

This is the engine inside the autonomous tools that look like magic. Try, check against the bar, fix,
try again, until it passes. There is no secret beyond that, and you can run it by hand any time the work
has a clear definition of done.

## Keep your hand on the wheel

Here is the part people get wrong in both directions. Some hand everything to the model and are surprised
when it confidently does the wrong thing. Others check every word themselves and get none of the
leverage. The skill is in between, and it has a name in the systems world, human in the loop. Let the
model carry the routine work on its own, and put a hard stop on the moments that actually matter.

Decide in advance where your checkpoints are. The low-stakes, reversible parts, a draft, a list of
options, a first pass, let those run without you. The high-stakes, hard-to-undo parts, anything with
money, anything you will send to someone who matters, anything you cannot easily take back, stop and put
your own eyes on those before they go anywhere. "Plan the whole week of meals on your own, but show me
the shopping list and the total before I commit to it." The model does the labor. You keep the judgment.
That is not a lack of trust. It is how you get the leverage of automation without handing over the
decisions that should stay yours.

## Putting it together

Every piece of Part Two folds into one move now. A real build gives the model a role, splits the work
into parts, routes the effort to where it is needed, sets guardrails it cannot cross, checks itself
against a clear bar, and stops at the points where you want a say. That is not a longer prompt for its
own sake. It is a small, well-run operation, and the output reflects it. You will not need all of it
every time. You need to know the moves exist so you can reach for the right one when the work gets big.

## Try it

Direct a full build with the starter below. Give the model a role, break the work into parts, set at
least one clear guardrail, and make it check itself at the end, all at a useful length. This is the
capstone, so aim to light every required signal at once.

::practice::

That is the whole of it. Split the work, check the work, route the effort, and keep your hand on the
decisions that matter. None of it is exotic and none of it needs a single line of code. It is just
deliberate direction, and once it becomes a habit you will build things with these tools that a single
prompt could never have reached.
