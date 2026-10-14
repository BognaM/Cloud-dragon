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
- Chat and bond are **saved in your browser** (localStorage). Nothing is stored on the server.

## Files

Each file does one job. Start with the file named in **Things to change** below.

```text
app.py               Modal entry point: image, GPU, `modal deploy app.py`
serve.py             local web server used by start.command (always serves fresh files)
server/              the chat API (runs on Modal)
  config.py          model and generation settings
  persona.py         who the dragon is and how it talks (START HERE)
  safety.py          safety rules for conversations about suicide and self-harm
  prompt.py          builds the system prompt from persona + user + safety
  request.py         reads and checks what the page sends
  model.py           loads Qwen
  generation.py      runs the model, yields the reply piece by piece
  events.py          streams those pieces to the browser (Server-Sent Events)
  middleware.py      CORS and request logging
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
  crisis-card.css    the crisis card in the chat
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
  crisis-detect.js   spots possible suicide/self-harm messages (EN, DE, FR, IT)
  crisis-card.js     shows the crisis card with 143/147/144 in the chat
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
```

## Deploy the backend

```bash
pip install modal
modal setup
modal deploy app.py
```

Modal prints a URL like `https://YOUR-WORKSPACE--ember-chat-web.modal.run`.
Put it in `API_BASE` in `js/config.js`.

## Open it online

`modal deploy app.py` also publishes the page itself, from a small CPU container
(the `site` function in `app.py`). The deploy output lists two addresses; open the
one for **site**, e.g. `https://YOUR-WORKSPACE--ember-chat-site.modal.run`. It works
on any device, but each browser has its own bond. Anyone with the link can chat,
which uses your GPU time, so only share it with people you trust.

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

To start over completely, tap the pearl → **Release bond…**.

## API

| Route | Input | Output |
| --- | --- | --- |
| `GET /health` | None | `{"ok": true, "model": "..."}` |
| `POST /chat` | `{"messages": [...], "user_name": "...", "dragon_name": "...", "time_of_day": "dawn"/"day"/"dusk"/"night"}` (all but `messages` optional) | `text/event-stream`: `data: {"text": "..."}` events, then `data: [DONE]` |

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

Redeploy (`modal deploy app.py`) after changes in `app.py` or `server/`. For page changes, just refresh.

## Logs and costs

```bash
modal app logs ember-chat
```

The first request after 5 idle minutes cold-starts the GPU container, which takes about 20 seconds.
The endpoint is public with open CORS and has no auth or rate limiting. Stop the app
(`modal app stop ember-chat`) when you're not using it, and `modal deploy app.py` to bring it back.

## Crisis safety

When a message may be about suicide or self-harm (phrases in English, German,
French and Italian, in `js/crisis-detect.js`), the page shows a crisis card with
143 / 147 / 144 and answers with a pre-written, careful reply in that language
(`js/care-replies.js`) instead of asking the model, which can't be trusted with
this. Later messages in that chat reach the model with an extra safety rule
(`server/safety.py`). After changing the phrases, run:

```bash
node tests/crisis-detect.test.mjs
```


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
   - Messages about suicide or self-harm are interrupted with a crisis card (see **Crisis safety**).
   - Missing:
     - no nudges to take a break
     - the bond still grows with days you come back
     - disordered eating isn't detected by the page (the dragon only declines to
       help with harmful diet plans)
3. **Prioritize privacy and protect user data.** *Partly followed.*
   - No accounts. The chat and bond are saved only in your browser.
   - The server keeps no chat history, nothing is used to train the model, and messages
     aren't written to the logs (`LOG_TEXT_PREVIEWS = False` in `server/config.py`).
   - Help & info explains this.
   - Missing: there's no clear "delete my data" button, only **Release bond…** in the bond panel.
4. **Protect users from misrepresentation, misinformation, bias and illusory effectiveness.** *Partly followed.*
   - The dragon never claims to be a human or a licensed professional.
   - It gently questions harsh self-judgment and distorted beliefs instead of simply agreeing.
   - Help & info warns that it can misunderstand, make things up or give advice
     that doesn't fit.
   - Missing:
     - honest opinions still lean toward praise, a limit of the small model
     - no bias testing or independent audit
5. **Create safeguards for children, teenagers and vulnerable people.** *Partly followed.*
   - Crisis detection in English, German, French and Italian.
   - Tap-to-call 143, 147 and 144, and a list of psychiatric emergency services per canton.
   - A pre-written reply with steps for the next few minutes.
   - The dragon never gives methods, means or doses.
   - 147 (Pro Juventute) is listed for young people.
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
