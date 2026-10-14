// Phone numbers the help cards can show. Each card shows only the 2–3 that fit
// what the person wrote (js/pick-contacts.js), so it doesn't overwhelm them.
// Checked on the services' own sites, Oct 2026.

export const CONTACTS = {
  143: {
    number: "143",
    tel: "143",
    text: "Die Dargebotene Hand · La Main Tendue · Telefono Amico. Someone to talk to, day and night, anonymous.",
    link: { href: "https://www.143.ch", label: "Chat at 143.ch" },
  },
  147: {
    number: "147",
    tel: "147",
    text: "Pro Juventute, for children and young people, day and night.",
    link: { href: "https://www.147.ch", label: "Chat or WhatsApp at 147.ch" },
  },
  144: {
    number: "144",
    tel: "144",
    text: "Emergency, if you're in danger or feel physically unwell right now.",
  },
  aes: {
    number: "043 488 63 73",
    tel: "+41434886373",
    text: "AES, eating-disorder advice in German, or English by email. Tue and Thu 10–12 and 14–17.",
    link: { href: "https://www.aes.ch/angebot/beratungen", label: "aes.ch" },
  },
  aba: {
    number: "021 329 04 39",
    tel: "+41213290439",
    text: "ABA, Association Boulimie Anorexie, eating-disorder advice in French.",
    link: { href: "https://www.boulimie-anorexie.ch", label: "boulimie-anorexie.ch" },
  },
};

// Fills a card's list with these contacts, as big tap-to-call numbers.
export function renderContacts(list, keys) {
  list.replaceChildren(
    ...keys.map((key) => {
      const contact = CONTACTS[key];
      const item = document.createElement("li");

      const call = document.createElement("a");
      call.className = "crisis-call";
      call.href = `tel:${contact.tel}`;
      call.textContent = contact.number;

      const text = document.createElement("span");
      text.textContent = `${contact.text} `;
      if (contact.link) {
        const link = document.createElement("a");
        link.href = contact.link.href;
        link.target = "_blank";
        link.rel = "noopener";
        link.textContent = contact.link.label;
        text.append(link);
      }

      item.append(call, text);
      return item;
    })
  );
}
