---
description: work on the next most important feature and commit
---

1. read [./project/overview](./project/overview.md) for goals and tasks
2. pick a single todo from there, it must be the most important unfinished item
3. create a file under `./project` named `<date>__<type>__<name>.md` (example `2026-01-22__feat__add-analytics.md`). Reference this file in the overview todo line
3.1. That file is for you to track your work and remember important learnings across time. It must have the following format:

```md
# Task
[brief description of this task]

# Learnings
[things that are worth remembembering that are not obvious like research that was needed, why decisions were made, what was tried but did not work, trade-offs. concise bullet points. these learnings are exclusively to this feature]
Examples of good learnings for a a fictional feature to create an analytics dashboard (specific, concise, outline decisions and information that's not part of the codebase)
- there was no chart library, analyzed option A, B and C, decided to go with option B as it was most relevant to requirements X Y
- had to upgrade to react v42 for improved hook performance
- tried using existing /analyze endpoint but it was too slow, created /analyze/my-feature endpoint
Examples of bad learnings (redundant, simplistic, answers that could be found by reading the code, detailing actions you took)
- the database existed and had what i needed
- used the same pattern for my new button as existing one
- tests passed, build passed
```
4. Continue iterating until done. update the task file as needed
5. Once done, mark the todo as complete and then commit your changes using the `gai` command line (it's a special alias for `git commit -m`)
