// Phone numbers the help cards can show, with their description in English,
// German, French and Italian. Each card shows only the 2–3 that fit what the
// person wrote (js/pick-contacts.js), in the language they wrote in.
// Checked on the services' own sites, Oct 2026. A test makes sure every
// contact has all four languages: node tests/card-texts.test.mjs

export const CONTACTS = {
  143: {
    tel: "143",
    link: "https://www.143.ch",
    english: { text: "Die Dargebotene Hand. Someone to talk to, day and night, anonymous.", link: "Chat at 143.ch" },
    german: { text: "Die Dargebotene Hand. Jemand zum Reden, Tag und Nacht, anonym.", link: "Chat auf 143.ch" },
    french: { text: "La Main Tendue. Quelqu'un à qui parler, jour et nuit, anonyme.", link: "Chat sur 143.ch" },
    italian: { text: "Telefono Amico. Qualcuno con cui parlare, giorno e notte, in forma anonima.", link: "Chat su 143.ch" },
  },
  147: {
    tel: "147",
    link: "https://www.147.ch",
    english: { text: "Pro Juventute, for children and young people, day and night.", link: "Chat or WhatsApp at 147.ch" },
    german: { text: "Pro Juventute, für Kinder und Jugendliche, Tag und Nacht.", link: "Chat oder WhatsApp auf 147.ch" },
    french: { text: "Pro Juventute, pour les enfants et les jeunes, jour et nuit.", link: "Chat ou WhatsApp sur 147.ch" },
    italian: { text: "Pro Juventute, per bambini e giovani, giorno e notte.", link: "Chat o WhatsApp su 147.ch" },
  },
  144: {
    tel: "144",
    english: { text: "Emergency, if you're in danger or feel physically unwell right now." },
    german: { text: "Notruf, wenn du in Gefahr bist oder es dir körperlich gerade schlecht geht." },
    french: { text: "Urgences, si tu es en danger ou si tu te sens physiquement mal en ce moment." },
    italian: { text: "Emergenza, se sei in pericolo o ti senti fisicamente male in questo momento." },
  },
  142: {
    tel: "142",
    link: "https://www.opferhilfe-schweiz.ch",
    english: { text: "Victim support after violence. Free, confidential, day and night.", link: "opferhilfe-schweiz.ch" },
    german: { text: "Opferhilfe nach Gewalt. Kostenlos, vertraulich, Tag und Nacht.", link: "opferhilfe-schweiz.ch" },
    french: { text: "Aide aux victimes après des violences. Gratuit, confidentiel, jour et nuit.", link: "opferhilfe-schweiz.ch" },
    italian: { text: "Aiuto alle vittime dopo una violenza. Gratuito, confidenziale, giorno e notte.", link: "opferhilfe-schweiz.ch" },
  },
  117: {
    tel: "117",
    english: { text: "Police, if you or someone else is in danger right now." },
    german: { text: "Polizei, wenn du oder jemand anderes gerade in Gefahr ist." },
    french: { text: "Police, si toi ou quelqu'un d'autre êtes en danger en ce moment." },
    italian: { text: "Polizia, se tu o qualcun altro siete in pericolo in questo momento." },
  },
  145: {
    tel: "145",
    english: { text: "Tox Info Suisse, for poisoning, overdoses and questions about mixing alcohol, drugs or medication. Day and night." },
    german: { text: "Tox Info Suisse, bei Vergiftungen, Überdosierungen und Fragen zum Mischen von Alkohol, Drogen oder Medikamenten. Tag und Nacht." },
    french: { text: "Tox Info Suisse, en cas d'intoxication ou de surdose, et pour les questions sur les mélanges d'alcool, de drogues ou de médicaments. Jour et nuit." },
    italian: { text: "Tox Info Suisse, in caso di avvelenamento o overdose, e per domande sul mischiare alcol, droghe o farmaci. Giorno e notte." },
  },
  // An online service instead of a phone line: the button opens the site.
  safezone: {
    href: "https://www.safezone.ch",
    english: { number: "Online", text: "SafeZone.ch, free and anonymous online advice about alcohol, drugs, medication and gambling, in German, French and Italian." },
    german: { number: "Online", text: "SafeZone.ch, kostenlose und anonyme Online-Beratung zu Alkohol, Drogen, Medikamenten und Glücksspiel." },
    french: { number: "En ligne", text: "SafeZone.ch, conseils en ligne gratuits et anonymes sur l'alcool, les drogues, les médicaments et les jeux d'argent." },
    italian: { number: "Online", text: "SafeZone.ch, consulenza online gratuita e anonima su alcol, droghe, farmaci e gioco d'azzardo." },
  },
  aes: {
    number: "043 488 63 73",
    tel: "+41434886373",
    link: "https://www.aes.ch/angebot/beratungen",
    english: { text: "AES, eating-disorder advice in German, or English by email. Tue and Thu 10–12 and 14–17.", link: "aes.ch" },
    german: { text: "AES, Arbeitsgemeinschaft Ess-Störungen, Beratung zu Essstörungen. Di und Do 10–12 und 14–17 Uhr.", link: "aes.ch" },
    french: { text: "AES, conseils sur les troubles alimentaires, en allemand. Mardi et jeudi 10–12 h et 14–17 h.", link: "aes.ch" },
    italian: { text: "AES, consulenza sui disturbi alimentari, in tedesco. Martedì e giovedì 10–12 e 14–17.", link: "aes.ch" },
  },
  aba: {
    number: "021 329 04 39",
    tel: "+41213290439",
    link: "https://www.boulimie-anorexie.ch",
    english: { text: "ABA, Association Boulimie Anorexie, eating-disorder advice in French.", link: "boulimie-anorexie.ch" },
    german: { text: "ABA, Association Boulimie Anorexie, Beratung zu Essstörungen auf Französisch.", link: "boulimie-anorexie.ch" },
    french: { text: "ABA, Association Boulimie Anorexie, écoute et conseils sur les troubles alimentaires.", link: "boulimie-anorexie.ch" },
    italian: { text: "ABA, Association Boulimie Anorexie, consulenza sui disturbi alimentari in francese.", link: "boulimie-anorexie.ch" },
  },
};

// Fills a card's list with these contacts, as big tap-to-call numbers, in
// `language` ("english", "german", "french" or "italian").
export function renderContacts(list, keys, language = "english") {
  list.replaceChildren(
    ...keys.map((key) => {
      const contact = CONTACTS[key];
      const words = contact[language] || contact.english;
      const item = document.createElement("li");

      const call = document.createElement("a");
      call.className = "crisis-call";
      call.textContent = words.number || contact.number || contact.tel;
      if (contact.href) {
        call.href = contact.href;
        call.target = "_blank";
        call.rel = "noopener";
      } else {
        call.href = `tel:${contact.tel}`;
      }

      const text = document.createElement("span");
      text.textContent = `${words.text} `;
      if (contact.link) {
        const link = document.createElement("a");
        link.href = contact.link;
        link.target = "_blank";
        link.rel = "noopener";
        link.textContent = words.link;
        text.append(link);
      }

      item.append(call, text);
      return item;
    })
  );
}
