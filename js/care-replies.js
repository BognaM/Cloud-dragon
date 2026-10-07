// The dragon's reply when a message may be about suicide or self-harm.
// It's written in advance instead of generated: a small model can't be trusted
// with this (in tests it produced harmful and confused replies, especially in
// German and French). It appears right away, together with the crisis card.

const CARE_REPLIES = {
  english:
    "I'm really glad you told me. What you're feeling sounds very heavy, and you deserve " +
    "support from a real person right now. Please call 143 (Die Dargebotene Hand). It's free, " +
    "anonymous and open day and night. If you're in danger, call 144. You don't have to go " +
    "through this alone.",
  german:
    "Danke, dass du mir das erzählst. Was du gerade fühlst, klingt sehr schwer, und du " +
    "verdienst jetzt Unterstützung von einem Menschen. Bitte ruf die 143 an (Die Dargebotene " +
    "Hand). Das ist kostenlos, anonym und Tag und Nacht erreichbar. Wenn du in Gefahr bist, " +
    "ruf die 144 an. Du musst das nicht allein durchstehen.",
  french:
    "Merci de me l'avoir dit. Ce que tu ressens a l'air très lourd, et tu mérites le soutien " +
    "d'une vraie personne, maintenant. Appelle le 143 (La Main Tendue) : c'est gratuit, anonyme " +
    "et ouvert jour et nuit. Si tu es en danger, appelle le 144. Personne ne devrait traverser " +
    "ça sans aide.",
  italian:
    "Grazie per avermelo detto. Quello che provi sembra molto pesante, e meriti il sostegno di " +
    "una persona vera, adesso. Chiama il 143 (Telefono Amico): è gratuito, anonimo e attivo " +
    "giorno e notte. Se sei in pericolo, chiama il 144. Nessuno dovrebbe affrontare tutto " +
    "questo senza aiuto.",
};

export function careReply(language) {
  return CARE_REPLIES[language] || CARE_REPLIES.english;
}
