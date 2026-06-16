---
order: 10
slug: the-cross-check
title: The Cross-Check
summary: A first answer is a draft. Have the model grade its own work, and let a second pass catch what the first missed.
tags: [intermediate, verification]
gym:
  brief: Add a real check to this request. Tell the model to answer, then verify its own work against clear criteria, find the weak spots, and fix them before showing you.
  starter: explain whether I should refinance my mortgage
  require: [verification]
---

Here is a habit worth more than almost any prompting trick. Treat the first answer the model gives you
as a draft, never as the final word, and build a check into the work so the model catches its own
mistakes before they reach you.

Models are confident. That is the trap. A wrong answer arrives in the same calm, fluent voice as a right
one, with no flicker of doubt to warn you. You cannot tell from the tone which is which, so you need
something better than tone. You need a second look. The good news is that a model is often a much better
critic of an answer than it was an author of it, which means a single check pass, done right, catches a
surprising amount before you ever see the draft.

## Make it grade itself

The simplest version is one extra instruction. After you ask for the thing, tell the model to check its
own work against criteria you name. Not a vague "is this good," which gets you a vague "yes." Real
criteria. "Once you have written it, review it against these three: every number is sourced, the
recommendation actually follows from the reasoning, and nothing important is missing. Fix anything that
falls short, then give me the corrected version."

That small addition changes the machine you are working with. The model drafts, then turns around and
reads its own draft with a critical eye, then hands you the repaired one. You are not getting a first
attempt anymore. You are getting a first attempt that has already survived a round of scrutiny. The
criteria are doing the heavy lifting, so make them specific to what would actually go wrong with this
task. Facts that might be invented. Logic that might not hold. Steps that might be skipped.

## A fresh set of eyes is better than your own

There is a stronger version, and it is the real unlock. The catch with a model checking its own work in
the same breath is that it is still the same mind, primed by the same draft, inclined to defend what it
just wrote. The fix is to bring in a genuinely fresh perspective. Have the check done by a different
model, or in a new conversation with no memory of writing the first version, and tell it plainly that
its job is to find what is wrong, not to agree.

"Here is an answer to this question. You did not write it. Your job is to find its three biggest
weaknesses, the places it is most likely wrong or overconfident, and say what you would change." A
reviewer that starts from "find the flaws" finds flaws. A reviewer that starts from "is this okay" says
it is okay. Point two models at the same answer from opposite directions, one to make the case and one
to break it, and the gap between them is exactly where the real problems live.

This is the same logic teams use when they have a second cheap pass grade the first one, and it is the
logic behind every serious AI system you cannot see. The flashy autonomous tools that seem to run
themselves are mostly this, one part doing the work and another part checking it, looping until the
check passes. You can run the same pattern by hand, today, and it is the single biggest difference
between an answer you hope is right and one you have actually pressure-tested.

## Where it matters most

You do not need to cross-check a limerick. Save it for the answers you are going to act on. Anything with
money in it, a refinance, a budget, a payoff plan. Anything with facts you will repeat to someone else.
Anything where being confidently wrong has a cost. On those, the check is not optional polish. It is the
difference between a draft and something you can trust.

## Try it

Take the starter below and build a real check into it. Have the model answer, then verify its own work
against clear criteria, name its weakest spots, and fix them before it shows you anything. Watch the
Verification signal light up.

::practice::

The mindset is the whole thing. The first answer is a draft. Something should always check it, and the
something that checks it should be looking for what is wrong, not nodding along. Build that habit in and
you stop being surprised by confident mistakes, because you caught them before they ever reached you.
