// Short pop-up messages that fade away on their own.

import { el } from "./dom.js";

const VISIBLE_MS = 3200;
let hideTimer = null;

export function showToast(message) {
  el.toast.textContent = message;
  el.toast.classList.add("show");
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => el.toast.classList.remove("show"), VISIBLE_MS);
}
