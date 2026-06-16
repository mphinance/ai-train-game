---
order: 9
slug: agent-teams
title: Run a Team, Not a Genie
summary: Split a big job across roles the model plays in turn. One chat, several specialists.
tags: [intermediate, agent-teams, decomposition]
gym:
  brief: Turn this into a team. Name a few specialist roles, say what each one does, and hand the work from one to the next. Add a concrete detail or two so nothing stays vague.
  starter: help me write a deep dive on my industry
  require: [decomposition, specificity]
---

Most people treat AI like a genie. You make one wish, the whole thing at once, and you hope the answer
that comes back is the one you wanted. For small wishes that works fine. For anything big it does not,
because a model asked to do everything in one breath spreads itself thin and gives you something
shallow that touches every part and lands none of them.

The people who get real work out of these tools do something different. They stop wishing and start
directing. They take the big job, break it into the parts a small team of specialists would handle, and
have the model play each role in turn. Not one genie granting one enormous wish. A researcher, then a
writer, then an editor, each doing one job well before handing off to the next.

## Why splitting works

A model does better on a narrow task than a broad one, for the same reason a person does. Ask someone to
"research, write, and fact-check a report" all at once and they will juggle and drop things. Ask them to
just research first, then just write from that research, then just check the result, and each pass is
sharper because it has one thing to think about. Breaking the work up is not busywork. It is how you get
the model's full attention on each piece instead of a thin slice spread across all of them.

The clever part is that you do not need any special software to do this. The team lives inside one
conversation. You describe the roles, you set the order, and you let the model move through them. Real
production systems wire this up with separate agents passing work between them, but the thinking is
identical, and you can do the thinking version today in the same chat box you already have open.

## How to run the team

Start by naming the parts. Look at the big job and ask what a competent small team would split it into.
A report might be a researcher, a writer, and a fact-checker. A product launch might be a positioning
pass, a copy pass, and a channel plan. A hard decision might be a "make the case for" pass, a "make the
case against" pass, and a "weigh them" pass. You are not inventing job titles for fun. Each role is a
chunk of the work that deserves its own focused turn.

Then set the order and the handoff. Tell the model to do the first role fully, show its work, and only
then move to the next, using what the first one produced. "First, as a researcher, pull together the key
facts and list them. Then, as a writer, turn only those facts into a draft. Then, as an editor, tighten
the draft and flag anything the research did not support." The handoff is the whole point. Each role
builds on the last instead of starting over.

One specialist worth always including is a coordinator, the part of the prompt that says how the pieces
fit and what the finished thing should look like. Without it you get three good fragments and no whole.
With it you get a researcher who knows what the writer needs, and a writer who knows what the final
piece is for.

## A worked example

Take "help me write a deep dive on my industry," which as a single wish gets you a vague, encyclopedic
blur. As a team it gets sharp.

"You are going to work as three specialists in turn. First, as an analyst, list the five forces shaping
the home-coffee market right now, with one concrete data point or example for each. Then, as a writer,
turn that list into a 600-word piece for small roasters, leading with the force that matters most. Then,
as an editor, cut anything vague, make sure every claim ties back to the analyst's list, and flag the
two weakest spots for me to review."

Notice what that does. The analyst step forces concrete material onto the table before any writing
happens, so the draft has something real to stand on. The writer step has a clear audience and a length.
The editor step ties the prose back to the facts and tells you where to look. Three focused turns,
stacked, beat one sprawling wish every time.

## Try it

Take the starter below and turn it into a team. Name a few roles, say what each one does, hand the work
from one to the next, and drop in at least one concrete detail so the model has something real to work
with. Watch the Decomposition and Specificity signals light up.

::practice::

You do not need a team for everything, and you should not reach for one on a task a single good prompt
would handle. But the moment a job feels too big for one answer, that is the signal to stop wishing and
start directing. Name the roles, set the order, and let the model work through them one at a time.
