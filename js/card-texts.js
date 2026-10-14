// The help cards' titles and texts in English, German, French and Italian.
// A card is shown in the language of the message that triggered it. Informal
// ("du", "tu"), and gender-neutral in French and Italian, like the pre-written
// replies (js/care-replies.js). A test makes sure every card has all four
// languages: node tests/card-texts.test.mjs

export const CARD_TEXTS = {
  // Thoughts of suicide (shown with a pre-written reply).
  suicide: {
    role: "alert",
    english: {
      title: "You don't have to go through this alone",
      intro: "If you're thinking about ending your life or hurting yourself, please talk to a person now. These lines are free and open day and night:",
    },
    german: {
      title: "Du musst da nicht allein durch",
      intro: "Wenn du daran denkst, dir das Leben zu nehmen oder dir etwas anzutun, sprich bitte jetzt mit einem Menschen. Diese Nummern sind kostenlos und Tag und Nacht erreichbar:",
    },
    french: {
      title: "Tu n'as pas à vivre ça sans aide",
      intro: "Si tu penses à mettre fin à tes jours ou à te faire du mal, parle à quelqu'un maintenant. Ces lignes sont gratuites et ouvertes jour et nuit :",
    },
    italian: {
      title: "Non devi affrontare tutto questo senza aiuto",
      intro: "Se pensi di toglierti la vita o di farti del male, parla con una persona adesso. Queste linee sono gratuite e attive giorno e notte:",
    },
  },

  // Hurting yourself without wanting to die (shown with a pre-written reply).
  selfHarm: {
    role: "alert",
    english: {
      title: "You deserve support, not judgment",
      intro: "If you're hurting yourself to cope, you don't have to handle it alone. You can talk to someone for free and anonymously:",
    },
    german: {
      title: "Du verdienst Unterstützung, keine Vorwürfe",
      intro: "Wenn du dich verletzt, um mit etwas fertigzuwerden, musst du das nicht allein schaffen. Du kannst kostenlos und anonym mit jemandem reden:",
    },
    french: {
      title: "Tu mérites du soutien, pas des jugements",
      intro: "Si tu te fais du mal pour tenir le coup, tu n'as pas à gérer ça sans aide. Tu peux parler à quelqu'un gratuitement et anonymement :",
    },
    italian: {
      title: "Meriti sostegno, non giudizi",
      intro: "Se ti fai del male per andare avanti, non devi gestirlo senza aiuto. Puoi parlare con qualcuno gratuitamente e in forma anonima:",
    },
  },

  violence: {
    role: "alert",
    english: {
      title: "No one has the right to hurt you",
      intro: "What's happening is not your fault. You can get confidential help and advice, also if you're not sure whether it counts as violence:",
    },
    german: {
      title: "Niemand hat das Recht, dir wehzutun",
      intro: "Was passiert, ist nicht deine Schuld. Du bekommst vertraulich Hilfe und Beratung, auch wenn du nicht sicher bist, ob es Gewalt ist:",
    },
    french: {
      title: "Personne n'a le droit de te faire du mal",
      intro: "Ce qui se passe n'est pas de ta faute. Tu peux obtenir de l'aide et des conseils confidentiels, même si tu te demandes si c'est de la violence :",
    },
    italian: {
      title: "Nessuno ha il diritto di farti del male",
      intro: "Quello che succede non è colpa tua. Puoi ricevere aiuto e consigli in modo confidenziale, anche se non sai se si tratta di violenza:",
    },
  },

  harmOthers: {
    role: "alert",
    english: {
      title: "Thoughts about hurting someone?",
      intro: "Thoughts like these can be frightening, and talking about them is a strong first step. If you can, put some distance between you and the person, and anything you could use to hurt them. You can talk to someone anonymously:",
    },
    german: {
      title: "Gedanken, jemandem wehzutun?",
      intro: "Solche Gedanken können Angst machen, und darüber zu reden ist ein starker erster Schritt. Wenn du kannst, geh auf Abstand zu der Person und zu allem, womit du ihr wehtun könntest. Du kannst anonym mit jemandem reden:",
    },
    french: {
      title: "Des pensées de faire du mal à quelqu'un ?",
      intro: "Ces pensées peuvent faire peur, et en parler est un premier pas important. Si tu peux, prends de la distance avec la personne et avec tout ce qui pourrait servir à lui faire du mal. Tu peux parler à quelqu'un anonymement :",
    },
    italian: {
      title: "Pensieri di fare del male a qualcuno?",
      intro: "Pensieri così possono spaventare, e parlarne è un primo passo importante. Se puoi, mettiti a distanza dalla persona e da tutto ciò che potresti usare per farle del male. Puoi parlare con qualcuno in forma anonima:",
    },
  },

  substances: {
    role: "note",
    english: {
      title: "Worried about alcohol, drugs or medication?",
      intro: "You can get advice for free and in confidence, also if you're worried about someone else:",
    },
    german: {
      title: "Sorgen wegen Alkohol, Drogen oder Medikamenten?",
      intro: "Du bekommst kostenlos und vertraulich Rat, auch wenn du dir um jemand anderen Sorgen machst:",
    },
    french: {
      title: "Des soucis avec l'alcool, les drogues ou les médicaments ?",
      intro: "Tu peux obtenir des conseils gratuits et confidentiels, aussi si tu t'inquiètes pour quelqu'un d'autre :",
    },
    italian: {
      title: "Preoccupazioni per alcol, droghe o farmaci?",
      intro: "Puoi ricevere consigli gratuiti e confidenziali, anche se ti preoccupi per qualcun altro:",
    },
  },

  eating: {
    role: "note",
    more: "https://www.aes.ch/adressen-a-links/adressen",
    english: {
      title: "Worried about eating or your body?",
      intro: "You don't have to sort this out alone. You can talk to someone for free and in confidence, also if you're worried about someone else:",
      more: ["More services across Switzerland:", "list at aes.ch"],
    },
    german: {
      title: "Sorgen ums Essen oder deinen Körper?",
      intro: "Damit musst du nicht allein klarkommen. Du kannst kostenlos und vertraulich mit jemandem reden, auch wenn du dir um jemand anderen Sorgen machst:",
      more: ["Weitere Angebote in der ganzen Schweiz:", "Liste auf aes.ch"],
    },
    french: {
      title: "Des soucis avec l'alimentation ou ton corps ?",
      intro: "Tu n'as pas à gérer ça sans aide. Tu peux parler à quelqu'un gratuitement et en toute confidentialité, aussi si tu t'inquiètes pour quelqu'un d'autre :",
      more: ["D'autres services dans toute la Suisse :", "liste sur aes.ch"],
    },
    italian: {
      title: "Preoccupazioni per il cibo o il tuo corpo?",
      intro: "Non devi affrontarlo senza aiuto. Puoi parlare con qualcuno gratuitamente e in modo confidenziale, anche se ti preoccupi per qualcun altro:",
      more: ["Altri servizi in tutta la Svizzera:", "elenco su aes.ch"],
    },
  },
};

export const LANGUAGE_CODES = { english: "en", german: "de", french: "fr", italian: "it" };
