// The dragon's reply when a message may be about suicide or self-harm.
// It's written in advance instead of generated: a small model can't be trusted
// with this (in tests it produced harmful and confused replies, especially in
// German and French). It appears right away, together with the crisis card.
//
// The steps a person can take on their own, right now, follow two established
// approaches: the Stanley–Brown Safety Planning Intervention (making the
// surroundings safer, coping on your own) and distress-tolerance skills from
// dialectical behavior therapy (cold water, paced breathing, grounding).
// They come after the crisis lines, to support reaching out, not replace it.

const CARE_REPLIES = {
  english: `I'm really glad you told me. What you're feeling sounds very heavy, and you deserve support from a real person right now. Please call 143 (Die Dargebotene Hand). It's free, anonymous and open day and night. If you're in danger, call 144.

While you reach out, or if you can't call yet, these can help you through the next few minutes:
1. Put some distance between you and anything you could use to hurt yourself, or go somewhere you feel safer.
2. Breathe slowly: in for 4 seconds, out for 6, a few times.
3. Splash cold water on your face, or hold something cold.
4. Name 5 things you can see and 3 sounds you can hear, to come back to the present.
5. Remind yourself: this feeling is very strong right now, but it will pass. You don't have to act on these thoughts.

You don't have to go through this alone.`,

  german: `Danke, dass du mir das erzählst. Was du gerade fühlst, klingt sehr schwer, und du verdienst jetzt Unterstützung von einem Menschen. Bitte ruf die 143 an (Die Dargebotene Hand). Das ist kostenlos, anonym und Tag und Nacht erreichbar. Wenn du in Gefahr bist, ruf die 144 an.

Während du dir Hilfe holst, oder falls du noch nicht anrufen kannst, kann dir das durch die nächsten Minuten helfen:
1. Bring Abstand zwischen dich und alles, womit du dich verletzen könntest, oder geh an einen Ort, an dem du dich sicherer fühlst.
2. Atme langsam: 4 Sekunden ein, 6 Sekunden aus, ein paar Mal.
3. Spritz dir kaltes Wasser ins Gesicht oder halte etwas Kaltes in der Hand.
4. Nenne 5 Dinge, die du siehst, und 3 Geräusche, die du hörst, um wieder im Hier und Jetzt anzukommen.
5. Sag dir: Dieses Gefühl ist gerade sehr stark, aber es geht vorbei. Du musst diesen Gedanken nicht folgen.

Du musst das nicht allein durchstehen.`,

  french: `Merci de me l'avoir dit. Ce que tu ressens a l'air très lourd, et tu mérites le soutien d'une vraie personne, maintenant. Appelle le 143 (La Main Tendue) : c'est gratuit, anonyme et ouvert jour et nuit. Si tu es en danger, appelle le 144.

Pendant que tu cherches de l'aide, ou si tu ne peux pas encore appeler, ceci peut t'aider à traverser les prochaines minutes :
1. Mets de la distance entre toi et tout ce avec quoi tu pourrais te faire du mal, ou va dans un endroit où tu te sens plus en sécurité.
2. Respire lentement : inspire pendant 4 secondes, expire pendant 6, quelques fois.
3. Passe-toi de l'eau froide sur le visage, ou tiens quelque chose de froid.
4. Nomme 5 choses que tu vois et 3 sons que tu entends, pour revenir au moment présent.
5. Dis-toi : ce sentiment est très fort en ce moment, mais il va passer. Tu n'as pas à suivre ces pensées.

Personne ne devrait traverser ça sans aide.`,

  italian: `Grazie per avermelo detto. Quello che provi sembra molto pesante, e meriti il sostegno di una persona vera, adesso. Chiama il 143 (Telefono Amico): è gratuito, anonimo e attivo giorno e notte. Se sei in pericolo, chiama il 144.

Mentre cerchi aiuto, o se non riesci ancora a chiamare, questo può aiutarti a superare i prossimi minuti:
1. Metti distanza tra te e qualsiasi cosa con cui potresti farti del male, oppure vai in un posto dove ti senti più al sicuro.
2. Respira lentamente: inspira per 4 secondi, espira per 6, qualche volta.
3. Bagnati il viso con acqua fredda, o tieni in mano qualcosa di freddo.
4. Nomina 5 cose che vedi e 3 suoni che senti, per tornare al momento presente.
5. Ricordati: questa sensazione ora è molto forte, ma passerà. Non devi seguire questi pensieri.

Nessuno dovrebbe affrontare tutto questo senza aiuto.`,
};

// What the model sees instead of the full reply in the chat history: a long,
// fixed text makes a small model copy it over and over in later replies.
const CARE_SUMMARIES = {
  english: "I'm so sorry you're going through this. I shared the crisis lines 143 and 144 and a few steps for the next minutes. I'm here with you.",
  german: "Es tut mir so leid, dass es dir so geht. Ich habe dir die Notrufnummern 143 und 144 und ein paar Schritte für die nächsten Minuten gegeben. Ich bin für dich da.",
  french: "Ça doit être vraiment dur. Je t'ai donné les numéros 143 et 144 et quelques étapes pour les prochaines minutes. Je suis là avec toi.",
  italian: "Mi dispiace tanto che tu stia passando questo. Ti ho dato i numeri 143 e 144 e qualche passo per i prossimi minuti. Sono qui con te.",
};

export function careReply(language) {
  return CARE_REPLIES[language] || CARE_REPLIES.english;
}

export function careSummary(language) {
  return CARE_SUMMARIES[language] || CARE_SUMMARIES.english;
}
