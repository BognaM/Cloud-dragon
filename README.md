# ☁️🐉 Cloud Dragon

A chatbot web app with a cloud dragon you bond with, built from
[nightowl2626/dragon-llm](https://github.com/nightowl2626/dragon-llm).

- **Qwen3-0.6B** (weights from Hugging Face) runs on a **Modal A10 GPU**.
- Replies **stream** to the browser word by word (Server-Sent Events). While the
  dragon is thinking, a small 3D version of it flies in, loops around its pearl and
  flies out, just above the message box, next to a "Nimbus is thinking…" label.
  Both disappear as soon as the answer starts.
- **Bonding:** on your first visit you name your dragon (and tell it your name).
  The bond grows with every day you chat and never shrinks:
  Mist → Drift (3 days) → Cumulus (7) → Skybound (14). Each level changes how the
  dragon talks to you, fills the pearl in the header, and makes the dragon glow more.
- **The sky follows your clock:** dawn (5–8), day (8–17), dusk (17–20), night.
  At night every day you've bonded shows as a bright star.
- The 3D cloud-serpent on the welcome screen is drawn with **Three.js**. Its colors follow the sky.
- Chat and bond are **saved in your browser** (localStorage). Nothing is stored on the server.

## Files

Each file does one job. Start with the file named in **Things to change** below.

```text
app.py               Modal entry point: image, GPU, `modal deploy app.py`
server/              the chat API (runs on Modal)
  config.py          model and generation settings
  persona.py         who the dragon is (START HERE)
  bond_levels.py     how the dragon talks at each bond level
  prompt.py          builds the system prompt from persona + bond + user
  request.py         reads and checks what the page sends
  model.py           loads Qwen
  generation.py      runs the model, yields the reply piece by piece
  events.py          streams those pieces to the browser (Server-Sent Events)
  middleware.py      CORS and request logging
  api.py             the routes: GET /health, POST /chat
  logs.py            one-line log events

index.html           the page's markup only
icon.svg             browser-tab icon
styles/              one stylesheet per part of the page
  themes.css         colors for dawn, day, dusk and night
  base.css · layout.css · sky.css · header.css · icon.css
  bond.css · hero.css · chat.css · thinking.css · composer.css · toast.css
  file-notice.css    the message shown if index.html is opened directly
  help.css           the Help & info window, its welcome-screen button and the note under the message box
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
  help.js            opens and closes the Help & info window
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
python3 -m http.server 8000
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
| `/mist`, `/drift`, `/cumulus`, `/skybound` or `/bond 0`–`/bond 3` | preview a bond level (the dragon talks at that level too) |
| `/bond auto` | back to your real bond level |
| `/help` | list the commands |

Commands update the address bar, so a reload keeps them.

To start over completely, tap the pearl → **Release bond…**.

## API

| Route | Input | Output |
| --- | --- | --- |
| `GET /health` | None | `{"ok": true, "model": "..."}` |
| `POST /chat` | `{"messages": [...], "bond": 0-3, "user_name": "...", "dragon_name": "...", "time_of_day": "dawn"/"day"/"dusk"/"night"}` (all but `messages` optional) | `text/event-stream`: `data: {"text": "..."}` events, then `data: [DONE]` |

## Things to change

| What | Where |
| --- | --- |
| Personality | `server/persona.py` |
| How each bond level talks | `server/bond_levels.py` |
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
