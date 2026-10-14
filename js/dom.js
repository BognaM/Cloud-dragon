// Every element the scripts touch, looked up once.

const byId = (id) => document.getElementById(id);

export const el = {
  app: byId("app"),
  themeColor: document.querySelector('meta[name="theme-color"]'),
  stars: byId("stars"),

  // Header
  dragonTitle: byId("dragonTitle"),
  subtitle: byId("subtitle"),
  bondButton: byId("bondButton"),
  bondPearl: byId("bondPearl"),
  newChatButton: byId("newChatButton"),

  // Bond panel
  bondPanel: byId("bondPanel"),
  bondPanelTitle: byId("bondPanelTitle"),
  bondPanelText: byId("bondPanelText"),
  bondLevels: byId("bondLevels"),
  releaseButton: byId("releaseButton"),

  // Welcome screen
  messages: byId("messages"),
  hero: byId("hero"),
  bonding: byId("bonding"),
  dragonNameInput: byId("dragonNameInput"),
  userNameInput: byId("userNameInput"),
  skipButton: byId("skipButton"),
  welcome: byId("welcome"),
  welcomeTitle: byId("welcomeTitle"),
  welcomeText: byId("welcomeText"),
  suggestions: document.querySelector(".suggestions"),

  // Composer
  thinkingSky: byId("thinkingSky"),
  thinkingStage: byId("thinkingStage"),
  thinkingText: byId("thinkingText"),
  status: byId("status"),
  input: byId("input"),
  sendButton: byId("sendButton"),
  toast: byId("toast"),
  helpDialog: byId("helpDialog"),
  crisisCardTemplate: byId("crisisCardTemplate"),
  eatingCardTemplate: byId("eatingCardTemplate"),
  breakNudgeTemplate: byId("breakNudgeTemplate"),
  violenceCardTemplate: byId("violenceCardTemplate"),
  harmOthersCardTemplate: byId("harmOthersCardTemplate"),
  substanceCardTemplate: byId("substanceCardTemplate"),
  selfHarmCardTemplate: byId("selfHarmCardTemplate"),
  researchDialog: byId("researchDialog"),
  researchBody: byId("researchBody"),
};
