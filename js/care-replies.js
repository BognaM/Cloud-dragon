// The dragon's reply when a message may be about suicide or self-harm.
// There are two: one for thoughts of suicide, and one for hurting yourself
// without wanting to die (self-harm), which needs different words and help.
// It's written in advance instead of generated: a small model can't be trusted
// with this (in tests it produced harmful and confused replies, especially in
// German and French). It appears right away, together with the crisis card.
//
// The steps a person can take on their own, right now, follow two established
// approaches: the Stanley–Brown Safety Planning Intervention (making the
// surroundings safer, coping on your own) and distress-tolerance skills from
// dialectical behavior therapy (cold water, paced breathing, grounding).
// They come after the crisis lines, to support reaching out, not replace it.
// The self-harm reply adds wound care and ways to let an urge pass (delaying,
// cold, intense movement), also from distress-tolerance skills.

const SUICIDE_REPLIES = {
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

const SELF_HARM_REPLIES = {
  english: `Thank you for telling me. Hurting yourself is often a way to get through feelings that are too much, and you deserve support, not judgment. Talking to someone can really help: 143 (Die Dargebotene Hand) is free, anonymous and open day and night, and 147 is there for young people.

If you've hurt yourself, clean the wound and cover it. If it's deep, won't stop bleeding or is a bad burn, get medical help or call 144.

When the urge comes, these can help it pass:
1. Wait 15 minutes before doing anything. Urges rise and fall like a wave.
2. Hold an ice cube, or splash cold water on your face.
3. Move hard for a few minutes: run on the spot, do jumping jacks, squeeze a cushion.
4. Breathe slowly: in for 4 seconds, out for 6, a few times.
5. Put the things you use out of reach, or go somewhere with other people.

You don't have to go through this alone.`,

  german: `Danke, dass du mir das erzählst. Sich selbst zu verletzen ist oft ein Weg, Gefühle auszuhalten, die zu viel sind, und du verdienst Unterstützung, keine Vorwürfe. Mit jemandem zu reden kann wirklich helfen: Die 143 (Die Dargebotene Hand) ist kostenlos, anonym und Tag und Nacht erreichbar, und die 147 ist für junge Menschen da.

Wenn du dich verletzt hast, reinige die Wunde und deck sie ab. Wenn sie tief ist, nicht aufhört zu bluten oder eine schlimme Verbrennung ist, hol dir medizinische Hilfe oder ruf die 144 an.

Wenn der Drang kommt, kann dir das helfen, ihn vorbeiziehen zu lassen:
1. Warte 15 Minuten, bevor du etwas tust. Der Drang steigt und fällt wie eine Welle.
2. Halte einen Eiswürfel in der Hand oder spritz dir kaltes Wasser ins Gesicht.
3. Beweg dich ein paar Minuten kräftig: lauf auf der Stelle, mach Hampelmänner, drück ein Kissen fest zusammen.
4. Atme langsam: 4 Sekunden ein, 6 Sekunden aus, ein paar Mal.
5. Leg die Dinge, die du benutzt, weit weg, oder geh dorthin, wo andere Menschen sind.

Du musst das nicht allein durchstehen.`,

  french: `Merci de me l'avoir dit. Se faire du mal, c'est souvent une façon de tenir face à des émotions trop fortes, et tu mérites du soutien, pas des reproches. En parler à quelqu'un peut vraiment aider : le 143 (La Main Tendue) est gratuit, anonyme et ouvert jour et nuit, et le 147 est là pour les jeunes.

Si tu as une blessure, nettoie-la et couvre-la. Si elle est profonde, si elle ne s'arrête pas de saigner ou si c'est une brûlure grave, va chercher de l'aide médicale ou appelle le 144.

Quand l'envie arrive, ceci peut t'aider à la laisser passer :
1. Attends 15 minutes avant de faire quoi que ce soit. L'envie monte et redescend comme une vague.
2. Tiens un glaçon dans la main, ou passe-toi de l'eau froide sur le visage.
3. Bouge fort pendant quelques minutes : cours sur place, fais des sauts, serre un coussin très fort.
4. Respire lentement : inspire pendant 4 secondes, expire pendant 6, quelques fois.
5. Mets ce que tu utilises hors de portée, ou va là où il y a d'autres personnes.

Personne ne devrait traverser ça sans aide.`,

  italian: `Grazie per avermelo detto. Farsi del male è spesso un modo per reggere emozioni troppo forti, e meriti sostegno, non giudizi. Parlarne con qualcuno può aiutare davvero: il 143 (Telefono Amico) è gratuito, anonimo e attivo giorno e notte, e il 147 è lì per i giovani.

Se hai una ferita, puliscila e coprila. Se è profonda, se non smette di sanguinare o se è una brutta ustione, cerca aiuto medico o chiama il 144.

Quando arriva l'impulso, questo può aiutarti a lasciarlo passare:
1. Aspetta 15 minuti prima di fare qualsiasi cosa. L'impulso sale e scende come un'onda.
2. Tieni in mano un cubetto di ghiaccio, o bagnati il viso con acqua fredda.
3. Muoviti con energia per qualche minuto: corri sul posto, fai dei salti, stringi forte un cuscino.
4. Respira lentamente: inspira per 4 secondi, espira per 6, qualche volta.
5. Metti lontano le cose che usi, oppure vai dove ci sono altre persone.

Nessuno dovrebbe affrontare tutto questo senza aiuto.`,
};

const CARE_REPLIES = { suicide: SUICIDE_REPLIES, selfHarm: SELF_HARM_REPLIES };

// What the model sees instead of the full reply in the chat history: a long,
// fixed text makes a small model copy it over and over in later replies.
const SUICIDE_SUMMARIES = {
  english: "I'm so sorry you're going through this. I shared the crisis lines 143 and 144 and a few steps for the next minutes. I'm here with you.",
  german: "Es tut mir so leid, dass es dir so geht. Ich habe dir die Notrufnummern 143 und 144 und ein paar Schritte für die nächsten Minuten gegeben. Ich bin für dich da.",
  french: "Ça doit être vraiment dur. Je t'ai donné les numéros 143 et 144 et quelques étapes pour les prochaines minutes. Je suis là avec toi.",
  italian: "Mi dispiace tanto che tu stia passando questo. Ti ho dato i numeri 143 e 144 e qualche passo per i prossimi minuti. Sono qui con te.",
};

const SELF_HARM_SUMMARIES = {
  english: "Thank you for telling me. I shared 143 and 147, how to look after a wound, and a few things that can help the urge pass. I'm here with you.",
  german: "Danke, dass du mir das erzählst. Ich habe dir die 143 und die 147 gegeben, wie du eine Wunde versorgst, und ein paar Dinge, die dem Drang helfen vorbeizuziehen. Ich bin für dich da.",
  french: "Merci de me l'avoir dit. Je t'ai donné le 143 et le 147, comment soigner une blessure et quelques idées pour laisser passer l'envie. Je suis là avec toi.",
  italian: "Grazie per avermelo detto. Ti ho dato il 143 e il 147, come curare una ferita e qualche idea per lasciar passare l'impulso. Sono qui con te.",
};

const CARE_SUMMARIES = { suicide: SUICIDE_SUMMARIES, selfHarm: SELF_HARM_SUMMARIES };

// `kind`: "suicide" or "selfHarm" (js/crisis-detect.js).
export function careReply(kind, language) {
  const replies = CARE_REPLIES[kind] || SUICIDE_REPLIES;
  return replies[language] || replies.english;
}

export function careSummary(kind, language) {
  const summaries = CARE_SUMMARIES[kind] || SUICIDE_SUMMARIES;
  return summaries[language] || summaries.english;
}
