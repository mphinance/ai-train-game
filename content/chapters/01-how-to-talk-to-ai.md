---
order: 1
slug: how-to-talk-to-ai
title: How to Actually Talk to AI
summary: The anatomy of a prompt that works, and why most of yours don't yet.
tags: [prompting, fundamentals]
gym:
  brief: Rewrite this lazy prompt so it earns a Strong score. Add who it is for, the format you want, and a real constraint.
  starter: write something about dogs
  require: [role, context, format, constraints]
---

Most people talk to AI the way they talk to a search box. They type a few words, get back
something generic, and conclude the tool is overrated. The tool is fine. The prompt was thin.

A good prompt is not longer for the sake of it. It carries a few specific signals that tell the
model what you actually want. Once you can see those signals, you cannot unsee them, and your
results change immediately.

## The signals that matter

Think of a prompt as a short brief you would hand a sharp new assistant who knows nothing about
your situation. The brief works when it answers a few questions before they are asked:

- **Who should it be?** Give it a role. "You are a careful copy editor" beats silence.
- **What is the situation?** A line of context tells it why you need this and what you are working on.
- **Who is it for?** "For my boss" and "for a five year old" produce very different answers.
- **What shape do you want?** Ask for a list, a table, three options, a single paragraph.
- **What are the limits?** Under 200 words. No jargon. Skip the intro. Limits sharpen everything.

You do not need all of them every time. You need enough that the model is not guessing.

## Try it

Here is the move. Take a lazy prompt and add the signals until the answer would actually be useful.

::practice::

Notice what happened to the score as you added a role, a reason, a format, and a constraint. That
climb is the whole skill in miniature. You are not learning magic words. You are learning to say
what you mean before the model has to guess it.
