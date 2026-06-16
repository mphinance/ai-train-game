---
order: 8
slug: building-with-ai
title: 'Part Two: Building With AI'
summary: You can write a strong prompt now. This is how you compose prompts into something that builds.
tags: [intermediate, building]
gym:
  brief: Take this one-shot request and turn it into a small build. Break it into parts the model handles in turn, and end by having it check its own work.
  starter: write a launch announcement for my new app
  require: [decomposition, verification]
---

The first part of this guide had one job, to make you fluent. You can write a prompt that carries real
signals now. You know what to hand the model and what to keep. You verify the parts that matter. That
fluency is genuinely most of the game, and for most tasks on most days it is all you will ever need.

This part is for the next question, the one people ask once the prompting clicks. Not "how do I write a
better prompt," but "how do I get this thing to actually build something for me." A plan, a report, a
small app, a week of meals, a decision worked all the way through. The jump from a good answer to a
finished piece of work is real, and it is mostly about composition. You stop writing one prompt and
start arranging several into a process.

Here is the reassuring part. Nothing in Part Two is harder than Part One. There is no code, no setup,
no new tool to install. Everything here happens in the same chat box you already use. What changes is
how you think about the work in front of you. You start seeing a big task as a few smaller ones, and
you start treating the model less like an oracle you query once and more like a small team you direct.

## The three moves

There are three ideas underneath everything that follows, and they are the spine of how serious people
build with AI.

The first is **splitting the work.** A big request handed over whole gets a shallow answer, because the
model tries to do all of it at once. The same request broken into parts, a researcher step, a drafting
step, a cleanup step, gets a deep one, because each part gets the model's full attention in turn. You
can run that whole team inside a single conversation. The next chapter is about this.

The second is **checking the work.** A first answer is a first draft, and the cheapest way to make it
better is to have the model grade itself before you ever see it. Not "is this good," but "here are the
three things this has to get right, check it against them and fix what falls short." A single
self-review pass catches a surprising amount. Done well, with a fresh set of eyes on the answer, this is
the closest thing to a safety net these tools have. That is the chapter after.

The third is **knowing when to step in.** The point of all this is not to hand everything to the machine
and walk away. It is to let it carry the routine parts and to keep your hand on the moments that
matter. Where to put effort, where to loop until it is right, and where to stop and decide for yourself.
That is the last chapter.

## Why bother

You can get a long way on single prompts, so it is fair to ask what composition buys you. It buys you
the bigger jobs. The ones that were too sprawling for one prompt to handle become routine once you can
break them down. And it buys you trust. An answer the model has checked against criteria you set is one
you can act on without re-reading every line yourself. That combination, bigger work you can actually
rely on, is the whole reason to keep going past fluency.

## Try it

Take a request you would normally fire off in one line and build it up instead. Split it into parts the
model works through in order, and add a final instruction to check its own answer before finishing.
Watch the Decomposition and Verification signals light up.

::practice::

That is the shape of everything ahead. Split the work, check the work, keep your hand on the wheel. The
next three chapters take each one in turn.
