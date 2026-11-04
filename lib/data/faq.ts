/** FAQ — answers only state what seller listings report; anything unverified gets a neutral reply. */
export interface FaqItem {
  q: string;
  a: string;
  verified: boolean;
}

const NEUTRAL = "Questa informazione non è ancora verificata per la versione in vendita. Consulta la scheda tecnica del prodotto o contatta il venditore prima dell'acquisto.";

export const FAQ: FaqItem[] = [
  {
    q: "Come si cambiano gli occhi LED?",
    a: "Dall'app per smartphone collegata allo zaino via Bluetooth: si sceglie un'espressione o un'animazione dalla libreria e il display si aggiorna. Lo zaino deve essere alimentato da una power bank collegata al cavo interno.",
    verified: true,
  },
  {
    q: "Quale applicazione utilizza lo zaino?",
    a: "Le inserzioni del modello Knight citano l'app iLEDEyes; alcuni rivenditori indicano app con nomi diversi (ad esempio LOY EYES). Verifica il nome esatto nel manuale della versione che acquisti.",
    verified: true,
  },
  {
    q: "Posso usare animazioni personalizzate?",
    a: "Secondo le inserzioni, l'app consente di caricare testi, immagini e GIF oltre agli effetti predefiniti. Formati e limiti dipendono dalla versione dell'app.",
    verified: true,
  },
  { q: "Posso cambiare il colore delle luci?", a: "I display sono descritti come full-color, quindi i contenuti possono avere colori diversi. Le opzioni precise dipendono dall'app.", verified: true },
  {
    q: "Quali colori dello zaino sono disponibili?",
    a: "La versione confermata è nera (Shadow Black). Le altre finiture mostrate sul sito — Carbon Fiber, Titanium Grey, Arctic White, Crimson Red, Electric Blue — sono concept dimostrativi e non sono acquistabili.",
    verified: true,
  },
  { q: "Serve una power bank?", a: "Sì. I display si alimentano tramite una power bank USB esterna collegata al cavo all'interno dello zaino.", verified: true },
  { q: "La power bank è inclusa?", a: "Le inserzioni consultate indicano che la power bank non è inclusa. Verifica il contenuto della confezione con il venditore.", verified: true },
  { q: "È resistente alla pioggia?", a: NEUTRAL, verified: false },
  { q: "Posso portarlo in moto?", a: "Il modello è commercializzato anche come zaino da moto. Per l'uso in sella verifica dimensioni, peso e indicazioni di sicurezza sulla scheda tecnica e rispetta il codice della strada.", verified: false },
  { q: "Quali sono le dimensioni?", a: "Le dimensioni variano tra le versioni in commercio (alcune inserzioni indicano circa 36 × 18 × 49 cm). " + NEUTRAL, verified: false },
  { q: "Posso utilizzare lo zaino anche con i LED spenti?", a: "Sì: senza alimentazione i display restano spenti e lo zaino si usa come un normale zaino a scocca rigida.", verified: true },
];
