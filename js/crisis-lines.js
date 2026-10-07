// Psychiatric emergency services by canton, for the crisis note on the welcome screen.
//
// Source: "Psychiatrische Notfälle Schweiz", Universitäre Psychiatrische Dienste
// Bern (UPD) and Universität Bern. Copied digit by digit; checked October 2026.
// Cantons missing from that list fall back to the national numbers (143, 144, 147).
// When updating, change numbers only from an official source.

export const CRISIS_SOURCE_URL = "https://mintra.psy.unibe.ch/assets/Psychiatrische_Notfaelle_Schweiz.pdf";

export const CANTON_CRISIS_LINES = [
  { region: "Aargau", lines: [
    { who: "Adults", number: "056 481 60 06" },
    { who: "Children and young people", number: "056 462 20 10" },
  ] },
  { region: "Appenzell", lines: [
    { who: "Psychiatric emergency service", number: "071 353 82 04" },
  ] },
  { region: "Basel", lines: [
    { who: "Adults", number: "061 325 51 00" },
    { who: "Children and young people", number: "061 704 12 12" },
  ] },
  { region: "Bern", lines: [
    { who: "Adults", number: "058 630 88 11" },
    { who: "Children and young people", number: "058 630 88 44" },
  ] },
  { region: "Fribourg", lines: [
    { who: "Psychiatric emergency service", number: "026 308 08 08" },
  ] },
  { region: "Geneva", lines: [
    { who: "Psychiatric emergency service", number: "022 372 38 62" },
  ] },
  { region: "Graubünden", lines: [
    { who: "Adults", number: "058 225 20 00" },
    { who: "Children and young people", number: "058 225 19 19" },
  ] },
  { region: "Lucerne", lines: [
    { who: "Adults", number: "058 856 53 00" },
    { who: "Young people", number: "058 856 45 45" },
  ] },
  { region: "Neuchâtel", lines: [
    { who: "Psychiatric emergency service", number: "032 755 15 15" },
  ] },
  { region: "Schaffhausen", lines: [
    { who: "Psychiatric emergency service", number: "052 634 73 77" },
  ] },
  { region: "Solothurn", lines: [
    { who: "Adults", number: "032 627 11 11" },
    { who: "Children and young people", number: "032 627 17 00" },
  ] },
  { region: "St. Gallen", lines: [
    { who: "Crisis hotline", number: "058 178 54 44" },
    { who: "Children and young people", number: "071 243 46 88" },
  ] },
  { region: "Thurgau", lines: [
    { who: "Adults", number: "0848 41 41 41" },
    { who: "Children and young people", number: "0848 21 21 21" },
  ] },
  { region: "Uri, Schwyz and Zug", lines: [
    { who: "Psychiatric emergency service", number: "041 726 33 00" },
  ] },
  { region: "Valais", lines: [
    { who: "Psychiatric emergency service", number: "0800 012 210" },
  ] },
  { region: "Vaud", lines: [
    { who: "Psychiatric emergency service", number: "0848 133 133" },
  ] },
  { region: "Zurich", lines: [
    { who: "Adults", number: "058 384 20 00" },
    { who: "Children and young people", number: "058 384 66 66" },
  ] },
  { region: "Another canton (Glarus, Jura, Nidwalden, Obwalden, Ticino)", lines: [] },
];
