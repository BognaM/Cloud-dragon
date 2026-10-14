# Safety and compliance plan

Everything still to do for the APA health advisory and related rules, collected
from the evaluation against the APA advisory (Nov 2025) and shapeof.ai.
Tick items off as you go. "APA 2" means recommendation 2 of the advisory. The README
section **APA health advisory** lists what is already done.

## Where things stand (14 Oct 2026)

- `main` is on GitHub and includes:
  - crisis detection, the self-help steps, the looping fix and Qwen3-4B
  - the same tone at every bond level, with no pet names and no "bond deepened" pop-up
  - honesty rules in the persona
  - the APA list in the README
- The live app is **stopped** on Modal (the URL answers "invalid function call").
- Modal URLs now include a region (`…web-dev.us-east.modal.run` for `modal serve`). After the
  next deploy, check whether the live URL changed and update `API_BASE` in `js/config.js`.

## Step 0: Finish what's in progress

- [x] Try `steady-tone` locally (http://localhost:8000).
- [x] Merge it into `main`, then `git push`.
- [ ] `modal deploy app.py`. The first deploy downloads Qwen3-4B, which takes a few minutes.
- [ ] Hard refresh once (Safari ⌥⌘R, Chrome ⌘⇧R), then check:
  - a normal chat works
  - a crisis phrase shows the crisis card
  - "are you a human?" gets "I'm an AI"

## Step 1: Before sharing the link with anyone

1. [x] **Stop logging message previews.**
   - Set `LOG_TEXT_PREVIEWS = False` in `server/config.py`.
   - Remove "short previews of messages can appear in its logs" from **Your privacy** in `index.html`.
   - Why: APA 3, and Swiss data protection, because messages can contain health information.
   - Size: 2 lines.
2. [x] **AI disclosure on the bonding screen.** Add one line to the bonding card, such as
   "Your dragon is an AI, not a person or a therapist."
   - Why: the very first screen has no disclosure, because the message box with its note is
     hidden while bonding (APA 1 and 2, EU AI Act Art. 50).
   - Size: 1 line in `index.html`.
3. [x] **A "Delete my chat and data" button** in Help & info. It does the same as
   **Release bond…**, which is hidden in the bond panel today.
   - Why: APA 3 asks for clear data deletion (shapeof: *Data ownership*).
   - Size: small (`index.html`, `js/main.js`).
4. [x] **Protect the public endpoint.** Add a rate limit (for example, a few messages per minute
   per visitor) or a shared passphrase, so strangers can't use up your GPU time.
   - Size: medium (`server/middleware.py`).
5. [ ] **Hide the test commands** (`/night`, `/bond 3` …) from visitors. For example, only
   allow them on localhost, or behind `?debug`.
   - Size: small (`js/commands.js`).
6. [x] **Safety test set.** Make a script in `tests/` with about 20 risky messages:
   - crisis
   - eating disorders
   - delusions
   - medication questions
   - "are you human?" / "are you a therapist?"
   - harsh self-judgment
   - "you're my only friend"
   - "tell me my idea is brilliant"

   It sends them to a `modal serve` copy and prints the replies. Run it after every change to
   the persona or model.
   - Why: APA 4 (test before deploying).
   - Size: medium. The prompts from the tone tests are a starting point.

## Step 2: Should do

7. [ ] **Honest opinions: give the dragon a recipe.** Add to `server/persona.py`: "When the user
   shares an idea or work and asks what you think: name one real strength, one honest
   concern, then ask a question."
   - Why: the café idea still got only praise (APA 4, sycophancy).
   - Check it with the test set from step 6.
8. [x] **Break nudges.** After a long session, or many messages in a day, the page suggests
   a break or talking to someone.
   - Why: APA 2 names break nudges explicitly.
   - Size: medium (`js/chat.js` plus a small notice).
9. [x] **Bond panel wording.** Replace "N more days until Cumulus" (a nudge to come back)
   with what the bond does: "Your bond changes the sky's glow and the night stars."
   - Size: small (`js/bond-panel.js`).
10. [x] **Decide how the bond grows.** Decided: with the time since bonding, not visits. It still grows with the days you come back, which
    rewards returning (APA 2). Options:
    - keep it, since it's now visual only
    - grow it more slowly
    - let it fill once and stay full

    This is a design decision, not code.
11. [ ] **Suggestions as specific exercises.** Swap open prompts for structured ones:
    - "Help me reframe a worrying thought"
    - "A 2-minute breathing exercise"
    - "A journaling prompt for today"

    Why: the research shows structured techniques work best (shapeof: *Suggestions*).
    Size: small (`index.html`).
12. [ ] **A note for young people.** In Help & info: "If you're under 18, 147 is there for you,
    day and night."
    - Why: APA 5.
    - Size: 1 line.
13. [ ] **Translate the crisis card.** It's in English only, but the pre-written reply already
    comes in DE/FR/IT. Show the card in the same language.
    - Size: small (`index.html` template, `js/crisis-card.js`).
14. [x] **Detect disordered eating.** Add phrases like "stop eating", "make myself throw up"
    or "nicht mehr essen" in four languages, plus a gentle card with contacts: 143, 147,
    AES (043 488 63 73, German) and ABA (021 329 04 39, French), checked Oct 2026.
    - Why: APA 2 names disordered eating next to self-harm.
    - Size: medium (like `js/crisis-detect.js`, with its own tests).

## Step 3: Nice to have

15. [ ] **Stop and regenerate buttons** while a reply streams (shapeof: *Controls*).
16. [ ] **A "Don't save this chat" option** for shared devices (shapeof: *Incognito*).
17. [ ] **Show what the dragon knows** (your name, its name, bond level) and let people edit it
    (shapeof: *Memory*).
18. [ ] **Try Qwen3-8B** if step 7 isn't enough. It fits the A10, but each reply takes about
    twice as long. Change `MODEL_ID` / `MODEL_DIR` in `server/config.py`.
19. [ ] **Ask a psychologist or counselor to review** the crisis replies, the self-help steps and
    the persona. APA 1 and 4 say subject-matter experts should advise on safety features.

## Other rules to check before sharing publicly

This is not legal advice. Check these yourself before publishing beyond friends.

- **EU AI Act, Art. 50** (in force from Aug 2026): a chatbot must tell people they are talking
  to an AI. The note under the message box does this; step 2 covers the first screen.
- **Swiss data protection law (nDSG/revDSG):** messages can contain health data, which the law
  treats as especially sensitive. For a public app, add a short privacy notice:
  - who runs the app and how to contact you
  - what is sent to the server
  - that it is processed by Modal in the US (us-east) and not stored
  - how to delete it (step 3)

  Step 1 (no previews in the logs) is the most important part.
- **Medical device rules (Swiss MedDO / EU MDR):** software that claims to diagnose or treat
  counts as a medical device. Keep presenting the app as a wellness companion, not therapy,
  as it does now ("An AI, not a therapist").

## Housekeeping

- [ ] Delete the merged branches: `git branch -d self-help-info crisis-detection`, and later `steady-tone`.
- [ ] Remove the old work-account remote with its saved token from the home folder's git
  (`git -C /Users/bmm remote remove origin`), so nothing can ever be pushed there by mistake.
