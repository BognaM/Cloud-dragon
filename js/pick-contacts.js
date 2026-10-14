// Chooses the 2–3 numbers a help card shows, from what the person wrote:
// the language, whether they sound young, and whether they may be in danger.
// `text` is the message that showed the card; `texts` is everything the person
// has written in this chat so far (including `text`).

import { soundsYoung, inDangerNow, feelsUnwell } from "./signals.js";

// Suicide or self-harm. The pre-written reply names 143 and 144, so both stay.
export function crisisContacts(text, texts) {
  const young = soundsYoung(texts);
  if (inDangerNow(text)) return young ? ["144", "147", "143"] : ["144", "143"];
  return young ? ["147", "143", "144"] : ["143", "144"];
}

// Eating-disorder services that answer in each language. There is no free
// Italian-language one in Switzerland; 143 answers in Italian (Telefono Amico).
const EATING_SERVICE = { german: "aes", english: "aes", french: "aba" };

export function eatingContacts(text, texts, language) {
  const young = soundsYoung(texts);
  const service = EATING_SERVICE[language];
  const keys = [];
  if (feelsUnwell(text)) keys.push("144");
  if (service) keys.push(service);
  if (young) keys.push("147");
  if (!service || !young) keys.push("143");
  return keys;
}
