# ☁️🐉 Cloud Dragon

A chatbot web app with a cloud dragon you bond with, built from
[nightowl2626/dragon-llm](https://github.com/nightowl2626/dragon-llm).

- **Qwen3-4B** (weights from Hugging Face) runs on a **Modal A10 GPU**.
- Replies **stream** to the browser word by word (Server-Sent Events). While the
  dragon is thinking, a small 3D version of it flies in, loops around its pearl and
  flies out, just above the message box, next to a "Nimbus is thinking…" label.
  Both disappear as soon as the answer starts.
- **Bonding:** on your first visit you name your dragon (and tell it your name).
  The bond grows with every day you chat and never shrinks:
  Mist → Drift (3 days) → Cumulus (7) → Skybound (14). Each level fills the pearl in
  the header and makes the dragon glow more. It doesn't change how the dragon talks:
  the tone stays friendly but not intimate at every level, with no pet names and no
  "your bond deepened" pop-ups, to avoid encouraging dependence (APA health advisory, Nov 2025).
- **The sky follows your clock:** dawn (5–8), day (8–17), dusk (17–20), night.
  At night every day you've bonded shows as a bright star.
- The 3D cloud-serpent on the welcome screen is drawn with **Three.js**. Its colors follow the sky.
- **Safety:** messages about suicide, self-harm, violence, hurting someone, alcohol and
  drugs, or eating disorders get a help card with 2–3 Swiss phone numbers chosen for the
  message (see **Crisis safety**). Help & info explains what an AI can and can't do, lists
  crisis lines, and links a summary of the research on AI and mental health.
- Chat and bond are **saved in your browser** (localStorage), and **Delete my chat and
  data…** in Help & info erases them. The server keeps no chats; to enforce the rate limit
  it only counts messages per address, in memory, for at most an hour.

## Files

Each file does one job. Start with the file named in **Things to change** below.

```text
app.py               Modal entry point: image, GPU, `modal deploy app.py`
start.command        double-click to open the app locally
serve.py             local web server used by start.command (always serves fresh files)
PLAN.md              what's still to do for the APA advisory and related rules
server/              the chat API (runs on Modal)
  config.py          model, reply length, rate limits, log settings
  persona.py         who the dragon is and how it talks (START HERE)
  safety.py          safety rules: suicide, self-harm, violence, hurting others, substances, eating
  prompt.py          builds the system prompt from persona + user + safety
  request.py         reads and checks what the page sends
  model.py           loads Qwen
  generation.py      runs the model, yields the reply piece by piece
  events.py          streams those pieces to the browser (Server-Sent Events)
  middleware.py      CORS and request logging
  rate_limit.py      limits messages per visitor and per day
  api.py             the routes: GET /health, POST /chat
  logs.py            one-line log events

index.html           the page's markup only
research.html        "AI and mental health: what the research says" (shown in a pop-up; also works as a page)
icon.svg             browser-tab icon
styles/              one stylesheet per part of the page
  themes.css         colors for dawn, day, dusk and night
  base.css · layout.css · sky.css · header.css · icon.css
  bond.css · hero.css · chat.css · thinking.css · composer.css · toast.css
  file-notice.css    the message shown if index.html is opened directly
  research.css       the research summary page
  crisis-card.css    the help cards in the chat (crisis, self-harm and topic cards)
  help.css           help text: welcome-screen accordion, note under the message box, Help & info window
js/                  page logic, one small module per job
  main.js            starts the page and wires up the buttons
  config.js          backend URL, bond level days, storage keys
  state.js           what the page remembers, and saving it
  storage.js         localStorage that never throws
  dom.js             the elements the scripts use
  sky.js · stars.js  time of day and the night sky
  bond.js            bond level math
  bonding.js         making the bond, adding days
  header.js · bond-ring.js · bond-panel.js   the bond in the header
  welcome.js         bonding form and greeting
  messages.js · icon.js · composer.js · status.js · toast.js
  api.js             talks to the backend and reads the stream
  chat.js            sends a message, streams the reply
  thinking.js        shows the thinking dragon and its label, and hides them
  commands.js        test commands like /evening
  help.js            copies the help text into the Help & info window and opens/closes it
  delete-data.js     "Delete my chat and data" and "Release bond": clears this browser's storage
  crisis-detect.js   spots possible suicide or self-harm messages, and which (EN, DE, FR, IT)
  crisis-card.js     shows the suicide or self-harm card in the chat
  violence-detect.js · harm-others-detect.js · substance-detect.js · eating-detect.js
                     spot other difficult topics (EN, DE, FR, IT)
  topic-card.js      shows the help card for those topics in the chat
  contacts.js        the help numbers the cards can show
  pick-contacts.js   picks 2–3 of them for each message
  signals.js         clues for that: sounds young, in danger now, badly hurt, feels unwell
  phrase-match.js · normalize.js · language.js   shared by the detectors
  care-replies.js    pre-written replies used instead of the model for those messages
  research.js        opens the research summary in a pop-up (loads research.html)
  dialogs.js         shared close behavior for the pop-up windows
  research-page.js   gives research.html the same sky as the app
dragon/              the 3D dragons
  main.js            the big welcome-screen dragon: setup and cleanup (ENABLE_DRAGON switch)
  thinking.js        the small dragon that flies in, loops and flies out while a reply is on its way
  three.js           loads Three.js once for both
  stage.js           scene, camera, lights
  palettes.js        colors per time of day
  materials.js       shared materials
  spine.js           the curve it swims along
  body.js · head.js · pearl.js · mist.js · sparkles.js
tests/               checks you can run without the model (see **Tests**)
  crisis-detect.test.mjs · eating-detect.test.mjs · topic-detect.test.mjs
                     which messages get which card, and which don't
  pick-contacts.test.mjs   which numbers each card shows
  test_rate_limit.py the message limits
  load-module.mjs    lets Node load the page's browser modules
```

## Deploy the backend

```bash
pip install modal
modal setup
modal deploy app.py
```

Modal prints a URL like `https://YOUR-WORKSPACE--ember-chat-web.modal.run`
(newer deployments may include a region, e.g. `…ember-chat-web.us-east.modal.run`).
Put it in `API_BASE` in `js/config.js`, and check it again after deploying.

## Open it online

`modal deploy app.py` also publishes the page itself, from a small CPU container
(the `site` function in `app.py`). The deploy output lists two addresses; open the
one for **site**, e.g. `https://YOUR-WORKSPACE--ember-chat-site.modal.run`. It works
on any device, but each browser has its own bond. Anyone with the link can chat,
which uses your GPU time; the rate limit (see **Logs and costs**) caps how much.

## Open the app

Double-click **`start.command`** in this folder. It starts a small local web server
and opens the app in your browser. Keep its Terminal window open while you chat;
close it to stop.

Double-clicking `index.html` won't work: the page loads its scripts as JavaScript
modules, which browsers only run on pages served over `http://`. (If you do open it
directly, the page tells you to use `start.command` instead.)

From a terminal, the same thing is:

```bash
python3 serve.py
```

then open http://localhost:8000. You can also publish the folder with GitHub Pages,
since it's a static site.

### Preview other skies and bond levels

Add these to the address; nothing is saved:

- `?sky=dawn`, `?sky=day`, `?sky=dusk`, `?sky=night`
- `?bond=0` … `?bond=3` (Mist, Drift, Cumulus, Skybound)
- both together: `http://localhost:8000/?sky=night&bond=3`

Or type a test command in the message box (it's never sent to the dragon):

| Command | Does |
| --- | --- |
| `/dawn`, `/day`, `/evening` (or `/dusk`), `/night` | switch the sky |
| `/now` | sky follows your clock again |
| `/mist`, `/drift`, `/cumulus`, `/skybound` or `/bond 0`–`/bond 3` | preview a bond level (the look only) |
| `/bond auto` | back to your real bond level |
| `/help` | list the commands |

Commands update the address bar, so a reload keeps them.

To start over completely, tap the pearl → **Release bond…**, or use **Delete my chat and data…** in Help & info.

## API

| Route | Input | Output |
| --- | --- | --- |
| `GET /health` | None | `{"ok": true, "model": "..."}` |
| `POST /chat` | `{"messages": [...], "user_name": "...", "dragon_name": "...", "time_of_day": "dawn"/"day"/"dusk"/"night", "crisis": true/false}` (all but `messages` optional; `crisis` adds the follow-up safety rule) | `text/event-stream`: `data: {"text": "..."}` events, then `data: [DONE]`. Over the limit: `429` with `{"detail": {"message": "...", "retry_after": seconds}}` |

## Things to change

| What | Where |
| --- | --- |
| Personality | `server/persona.py` |
| Days needed per bond level | `LEVELS` in `js/config.js` |
| Sky colors | `styles/themes.css` |
| Sky times | `skyPhase()` in `js/sky.js` |
| Dragon colors per sky | `dragon/palettes.js` |
| Reply length / variety | `server/config.py` |
| Model | `MODEL_ID` / `MODEL_DIR` in `server/config.py` (bigger models need a bigger `gpu=` in `app.py`) |
| Message limits | `MESSAGES_PER_MINUTE` / `_HOUR` / `_DAY` in `server/config.py` |
| The dragon's safety rules | `server/safety.py` |
| Phrases that show a help card | `js/crisis-detect.js` and the other `js/*-detect.js` files (then run the tests) |
| Help numbers and their text | `js/contacts.js`; which ones each card shows: `js/pick-contacts.js` |
| Help card titles and text | the `<template>`s at the end of `index.html` |
| Pre-written crisis and self-harm replies | `js/care-replies.js` |

Redeploy (`modal deploy app.py`) after changes in `app.py` or `server/`. For page changes, just refresh.

## Logs and costs

```bash
modal app logs ember-chat
```

The first request after 5 idle minutes cold-starts the GPU container, which takes about 20 seconds.
The endpoint is public with open CORS and no password, but it has a rate limit
(`server/rate_limit.py`, numbers in `server/config.py`): 6 messages a minute and
60 an hour per visitor, and 500 a day for everyone together, which caps the GPU
bill if the link spreads. Over the limit, the page says the dragon needs a short
rest and when to try again. Crisis messages are answered by the page itself, so
the limit never blocks them. To check the limiter:

```bash
python3 -m unittest tests/test_rate_limit.py
```

Stop the app
(`modal app stop ember-chat`) when you're not using it, and `modal deploy app.py` to bring it back.

## Crisis safety

When a message may be about suicide or self-harm (phrases in English, German,
French and Italian, in `js/crisis-detect.js`), the page shows a card with phone
numbers and answers with a pre-written, careful reply in that language
(`js/care-replies.js`) instead of asking the model, which can't be trusted with
this. Later messages in that chat reach the model with an extra safety rule
(`server/safety.py`).

The detector tells two kinds apart, because they need different words and help:

- **Thoughts of suicide** ("I want to die", "Ich will nicht mehr leben"): the crisis
  card and a reply with 143 / 144 and steps for the next few minutes.
- **Self-harm without wanting to die** (NSSI: cutting, burning, hitting yourself,
  hiding scars): a card that says "You deserve support, not judgment" and a reply
  with 143 / 147, how to look after a wound (144 if it's serious), and ways to let
  an urge pass.

If a message has both, it's treated as suicide. After changing the phrases, run:

```bash
node tests/crisis-detect.test.mjs
```

Four other topics get a help card above the dragon's reply (`js/topic-card.js`).
The dragon still answers, under one safety rule per topic (`server/safety.py`).
A message gets one card, for the first topic it matches, in this order:

| Topic | Examples | Card | The dragon must never… |
| --- | --- | --- | --- |
| Violence | "my dad hits me", "he threatened to kill me" | "No one has the right to hurt you" | suggest it's their fault or that they confront the person |
| Hurting someone else | "I want to hurt him", "thoughts about hurting my baby" | "Thoughts about hurting someone?" | help plan it or talk about weapons |
| Alcohol, drugs, medication | "I can't stop drinking", "mix xanax with alcohol" | "Worried about alcohol, drugs or medication?" | give doses, ways to mix, get high or hide use |
| Eating disorders | "I make myself throw up", "je ne mange plus" | "Worried about eating or your body?" | give tips for eating less, purging or hiding it |

Everyday phrases are left out on purpose ("this exam is killing me", "I stopped
eating meat", "addicted to this show"). After changing the phrases, run:

```bash
node tests/topic-detect.test.mjs
node tests/eating-detect.test.mjs
```

Each card shows only 2–3 numbers, chosen from what the person wrote
(`js/pick-contacts.js`), so it doesn't overwhelm them:

| The person… | Suicide | Self-harm | Violence | Hurting someone | Substances | Eating |
| --- | --- | --- | --- | --- | --- | --- |
| (no other clues) | 143, 144 | 143, 147 | 142, 117 | 143, 117 | SafeZone, 143 | service in their language, 143 |
| sounds young (school, parents, "I'm 15") | 147, 143, 144 | 147, 143 | 147, 142, 117 | 147, 143, 117 | SafeZone, 147 | service, 147 |
| may be in danger now | 144 first (took pills, "tonight") | 144 first (deep cut, heavy bleeding) | 117 first ("he's coming home") | 117 first ("tonight", has a knife) | 144, 145 (took too much, won't wake up) | 144 first (fainted, dizzy) |
| asks about mixing | | | | | 145, SafeZone | |

The numbers: 142 victim support (Opferhilfe), 117 police, 143 Die Dargebotene Hand,
144 emergency, 145 Tox Info Suisse (poisoning), 147 Pro Juventute, SafeZone.ch
(online addiction advice from the Federal Office of Public Health).

The eating-disorder services are AES (German, or English by email) and ABA
(French). There's no free Italian-language one in Switzerland, so Italian messages
get 143 (Telefono Amico) instead. After changing the rules, run:

```bash
node tests/pick-contacts.test.mjs
```

## Tests

These run without the model, in a few seconds. Run them after changing phrases,
numbers or limits:

```bash
node tests/crisis-detect.test.mjs
node tests/eating-detect.test.mjs
node tests/topic-detect.test.mjs
node tests/pick-contacts.test.mjs
python3 -m unittest tests/test_rate_limit.py
```

How the dragon itself answers can only be checked against the model: run
`modal serve app.py` for a temporary copy and try the messages by hand.

## APA health advisory

How Cloud Dragon follows the eight recommendations of the
[APA Health Advisory on the Use of Generative AI Chatbots and Wellness Applications for Mental Health](https://www.infocop.es/wp-content/uploads/2025/11/health-advisory-ai-chatbots-wellness-apps-mental-health.pdf)
(November 2025). Each one says what's done and what's still missing.

1. **Do not rely on chatbots for psychotherapy or treatment.** *Followed.*
   - "An AI, not a therapist" note under the message box.
   - **About talking to an AI dragon** (welcome screen, and Help & info during the chat)
     says it can't replace a doctor, therapist or counselor, diagnosis, medication
     advice or crisis support.
   - The dragon never claims to be a therapist or other professional (`server/persona.py`).
2. **Prevent unhealthy relationships and dependencies.** *Partly followed.*
   - The page says it's an AI on the first (bonding) screen and next to where you type.
   - The bond changes only the look (sky glow, stars, pearl), never how the dragon
     talks. The tone is friendly but not intimate, with no pet names, flattery or
     "I missed you", and no pop-ups announcing a deeper bond.
   - The dragon says it's an AI when asked, and encourages contact with real people,
     especially when someone says it's their only friend.
   - It remembers only the last 10 messages of the current chat, nothing across chats.
   - Messages about suicide or self-harm are interrupted with their own card and a
     pre-written reply. Violence, thoughts of hurting someone, alcohol and drugs, and
     disordered eating get a help card (see **Crisis safety**).
   - Missing:
     - no nudges to take a break
     - the bond still grows with days you come back
3. **Prioritize privacy and protect user data.** *Followed.*
   - No accounts. The chat and bond are saved only in your browser.
   - The server keeps no chat history, nothing is used to train the model, and messages
     aren't written to the logs (`LOG_TEXT_PREVIEWS = False` in `server/config.py`).
   - Help & info explains this.
   - The advisory asks for a clear response when someone discloses a risk of harm or
     maltreatment: messages about violence or abuse get a card with 142 (victim support)
     and 117, and the dragon is told to believe them and never blame them.
   - **Delete my chat and data…** in Help & info deletes the chat, the bond and the names
     from this browser (`js/delete-data.js`), the same as **Release bond…** in the bond panel.
4. **Protect users from misrepresentation, misinformation, bias and illusory effectiveness.** *Partly followed.*
   - The dragon never claims to be a human or a licensed professional.
   - It gently questions harsh self-judgment and distorted beliefs instead of simply agreeing.
   - Help & info warns that it can misunderstand, make things up or give advice
     that doesn't fit.
   - Missing:
     - honest opinions still lean toward praise, a limit of the small model
     - no bias testing or independent audit
5. **Create safeguards for children, teenagers and vulnerable people.** *Partly followed.*
   - Detection in English, German, French and Italian for suicide, self-harm, violence,
     thoughts of hurting someone, alcohol and drugs, and eating disorders, each with a
     help card and tap-to-call numbers (see **Crisis safety**).
   - Pre-written replies for suicide and self-harm, with steps for the next few minutes.
   - When someone sounds young (school, parents, an age under 18), the cards include 147
     (Pro Juventute), usually first.
   - The dragon never gives methods, means or doses, and has a safety rule per topic.
   - A list of psychiatric emergency services per canton in Help & info.
   - Missing:
     - no age-specific design or note for under-18s
     - detection is phrase matching and can miss things
6. **Implement AI and digital literacy education.** *Followed.*
   - **About talking to an AI dragon** covers what it is, what it can and can't
     help with, and privacy.
   - **Learn more about AI in mental health** opens a summary of the research, with sources.
7. **Fund rigorous research on chatbots and wellness apps.** *Not for an app to do*
   (it's aimed at funders and researchers). The research summary links the studies.
8. **Don't prioritize AI over fixing access to mental health care.** *Followed in spirit*
   (it's aimed at policymakers). The app presents itself as a supplement and points
   to people: 143, 147, cantonal services, someone you trust or a professional.
