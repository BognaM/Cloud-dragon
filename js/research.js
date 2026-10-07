// The research summary ("AI and mental health: what the research says") in a
// pop-up window. The text lives in research.html, which also works as a page
// on its own; it's loaded into the window the first time it's opened.

import { el } from "./dom.js";
import { connectDialog } from "./dialogs.js";

let loaded = null;

// Takes the article from research.html, without its title (the window has one)
// and its "Back to Cloud Dragon" links.
async function loadResearch() {
  const response = await fetch("research.html");
  if (!response.ok) throw new Error(`research.html: ${response.status}`);
  const page = new DOMParser().parseFromString(await response.text(), "text/html");
  const article = page.querySelector("main");
  article.querySelectorAll("h1, .back-link").forEach((node) => node.remove());
  el.researchBody.replaceChildren(...article.childNodes);
}

async function openResearch(link) {
  try {
    loaded ??= loadResearch();
    await loaded;
    el.researchDialog.showModal();
    el.researchDialog.scrollTop = 0;
  } catch (error) {
    // If the window can't be filled, open the page itself instead.
    loaded = null;
    console.info("Research window unavailable; opening the page.", error);
    location.href = link.href;
  }
}

export function initResearch() {
  connectDialog(el.researchDialog);

  // The links live in the help text, which is also copied into the Help & info
  // window, so listen on the whole page rather than on each link.
  document.addEventListener("click", (event) => {
    const link = event.target.closest("[data-open-research]");
    if (!link) return;
    event.preventDefault();
    openResearch(link);
  });
}
