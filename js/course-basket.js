/* Basketballregler (FIBA 2026) – kursinnhold.
 *
 * Kilde: Norges Basketballforbund, «Offisielle spilleregler for basketball 2026»
 * (oversettelse av FIBA Official Basketball Rules 2026), og FIBAs oppsummering
 * av regelendringene som gjelder fra 1. oktober 2026.
 *
 * Samme oppgavetyper som i Fysikk 1 (se course-fysikk1.js).
 */
(function () {
  'use strict';

  const mc = (q, opts, e, extra = {}) => ({ t: 'mc', q, opts, e, ...extra });
  const tf = (q, ans, e) => ({ t: 'tf', q, ans, e });
  const num = (gen) => ({ t: 'num', gen });
  const bank = (q, tpl, ans, dis, e, extra = {}) => ({ t: 'bank', q, tpl, ans, dis, e, ...extra });
  const match = (pairs, q = 'Koble sammen parene') => ({ t: 'match', pairs, q });
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // ================================================================
  // ENHET 1 – BANEN OG UTSTYRET
  // ================================================================
  const b1 = {
    id: 'b1',
    title: 'Banen og utstyret',
    color: '#ff9600', dark: '#cc7900',
    goal: 'Kjenne målene på banen, de viktigste linjene og områdene, og reglene for drakter og utstyr (§ 2–4).',
    guide: [
      ['Banen (§ 2)', 'Banen er 28 m lang og 15 m bred, målt fra innsiden av grenselinjene.\nDet skal være minst 2 m fritt område rundt banen.\nAlle linjer er 5 cm brede.\nMidtlinjen er en del av forsvarsfeltet.'],
      ['Viktige mål', 'Midtsirkelen: radius 1,80 m.\nStraffekastlinjen: ytterkanten er 5,80 m fra innerkanten av endelinjen, og linjen er 3,60 m lang.\n3-poengslinjen: halvsirkel med radius 6,75 m fra punktet rett under kurvens sentrum. Langs sidene går rette linjer 0,90 m fra sidelinjene.\nCharging-fri halvsirkel: radius 1,30 m.'],
      ['Felt og områder', 'Forsvarsfeltet: egen kurv og banehalvdelen bak midtlinjen, inkludert midtlinjen.\nAngrepsfeltet: motstandernes kurv og banehalvdelen foran midtlinjen.\n3-poengslinjen er ikke en del av 3-poengsområdet. Tråkker du på linja, er skuddet et 2-poengsskudd.'],
      ['Drakter (§ 4.3)', 'Draktnumre: 0, 00 og 1–99. To spillere på samme lag kan ikke ha samme nummer.\nTrøya skal være nedi buksa. Ermer må slutte over albuen. Langermede trøyer er ikke tillatt.\nNytt i 2026: Alle på laget skal ha sokker i samme dominerende farge.\nKompresjonsplagg på armer og bein skal ha samme farge for hele laget.'],
    ],
    skills: [
      {
        id: 'b1s1', title: 'Banens mål',
        items: [
          mc('Hvor stor er en basketballbane etter FIBA-reglene?', ['28 m × 15 m', '30 m × 15 m', '28 m × 17 m', '26 m × 14 m'], 'Banen er 28 m lang og 15 m bred, målt fra innsiden av grenselinjene.'),
          mc('Hvor langt er det fra punktet under kurvens sentrum til 3-poengslinjen (halvsirkelen)?', ['6,75 m', '6,25 m', '7,24 m', '5,80 m'], 'Radiusen er 6,75 m, målt til ytterkanten av linjen.'),
          mc('Hvor langt fra endelinjen ligger straffekastlinjen?', ['5,80 m fra innerkanten av endelinjen til ytterkanten av straffekastlinjen', '4,60 m', '6,75 m', '5,00 m'], 'Straffekastlinjen er 3,60 m lang, og ytterkanten er 5,80 m fra endelinjen.'),
          mc('Hvor brede er linjene på banen?', ['5 cm', '3 cm', '10 cm', '8 cm'], 'Alle linjer er 5 cm brede og skal ha sterk kontrast til banen.'),
          mc('Hva er radiusen til midtsirkelen?', ['1,80 m', '1,25 m', '2,00 m', '3,60 m'], 'Midtsirkelen har radius 1,80 m, målt til ytterkanten. Det samme gjelder halvsirklene ved straffekastlinjene.'),
          mc('Hva er radiusen til den charging-frie halvsirkelen under kurven?', ['1,30 m', '1,80 m', '1,00 m', '2,45 m'], 'Halvsirkelen har radius 1,30 m fra punktet rett under kurvens sentrum.'),
          match([['Banens lengde', '28 m'], ['Banens bredde', '15 m'], ['3-poengslinjen', '6,75 m'], ['Straffekastlinjen', '5,80 m']], 'Koble målet med verdien'),
          num(() => { const k = pick([['lengde', 28], ['bredde', 15]]); return { q: `Hva er banens ${k[0]} i meter?`, a: k[1], u: 'm', e: `Banen er 28 m × 15 m.`, tol: 0 }; }),
        ],
      },
      {
        id: 'b1s2', title: 'Linjer og felt',
        items: [
          tf('Midtlinjen er en del av forsvarsfeltet.', true, 'Midtlinjen hører til forsvarsfeltet. Står du med én fot på midtlinjen, er du i forsvarsfeltet.'),
          tf('En spiller som står med foten på 3-poengslinjen og scorer, får 3 poeng.', false, '3-poengslinjen er ikke en del av 3-poengsområdet, så scoringen gir 2 poeng.'),
          mc('Hvilken del av banen er et lags angrepsfelt?', ['Banehalvdelen der motstandernes kurv er, men ikke midtlinjen', 'Banehalvdelen der lagets egen kurv er', 'Området innenfor 3-poengslinjen', 'Hele banen'], 'Angrepsfeltet er avgrenset av endelinjen bak motstandernes kurv, sidelinjene og innsiden av midtlinjen.'),
          mc('Hva er hensikten med den charging-frie halvsirkelen?', ['En forsvarer som står inne i den, kan normalt ikke få dømt charging mot en angriper i luften', 'Angrepsspillere kan ikke stå der', 'Det er der straffekast tas', 'Det er 3-sekundersområdet'], 'Den skal hindre at forsvarere står rett under kurven bare for å «ta» offensive fouls.'),
          mc('Hvor stort fritt område skal det minst være rundt banen?', ['2 m', '1 m', '3 m', '50 cm'], 'Gulvet må derfor være minst 32 m × 19 m.'),
          match([['Forsvarsfelt', 'Egen kurv og midtlinjen'], ['Angrepsfelt', 'Motstandernes kurv'], ['3-sekundersområdet', 'Feltet under kurven'], ['Halvsirkel 1,30 m', 'Charging-fritt område']]),
        ],
      },
      {
        id: 'b1s3', title: 'Drakter og utstyr',
        items: [
          mc('Hvilke draktnumre er lovlige?', ['0, 00 og 1–99', 'Bare 4–15', '1–99', '0–100'], 'Lagene kan bruke 0, 00 og tallene fra 1 til 99.'),
          tf('To spillere på samme lag kan ha samme draktnummer hvis de ikke er på banen samtidig.', false, 'Spillere på samme lag kan aldri ha samme nummer.'),
          tf('Etter 2026-reglene er langermede spillertrøyer tillatt.', false, 'Har trøya ermer, må de slutte over albuen. Langermede trøyer er ikke tillatt.'),
          mc('Hva er nytt om sokker i reglene fra 2026?', ['Alle lagmedlemmer skal ha sokker i samme dominerende farge', 'Sokkene skal være hvite', 'Sokkene må ha nummer', 'Sokker er ikke lenger påbudt'], 'Alle på laget skal ha sokker i samme dominerende farge.'),
          tf('Spillerne skal ha trøya nedi spillebuksa.', true, 'Alle spillere må ha trøya nedi buksa. Heldrakter er tillatt.'),
          mc('Hva gjelder for kompresjonsplagg på armer og bein?', ['Alle på samme lag skal ha samme farge', 'De er forbudt', 'De må være svarte', 'Hver spiller velger farge fritt'], 'Kompresjonsplagg skal ha samme farge for hele laget.'),
        ],
      },
    ],
  };

  // ================================================================
  // ENHET 2 – LAG, SPILLETID OG KAMPSTART
  // ================================================================
  const b2 = {
    id: 'b2',
    title: 'Lag, spilletid og kampstart',
    color: '#58cc02', dark: '#58a700',
    goal: 'Kunne reglene for lagene, spilletiden, hoppball, vekslende ballbesittelse og tapt kamp (§ 4, 8, 9, 12, 20, 21).',
    guide: [
      ['Lagene', 'Basketball spilles av to lag med fem spillere på banen hver.\nEt lag kan ha høyst 12 spilleberettigede lagmedlemmer, inkludert en kaptein.\nKampen kan ikke starte hvis et lag ikke har fem spillere klare.'],
      ['Spilletid (§ 8)', '4 perioder à 10 minutter.\n2 minutters pause mellom 1. og 2. periode, mellom 3. og 4. periode og før hver forlengning.\nHalvtidspausen er 15 minutter.\nUavgjort etter 4. periode: forlengningsperioder på 5 minutter til kampen er avgjort.\nLagene bytter kurv til andre omgang og spiller mot samme kurv i forlengning som i 4. periode.'],
      ['Start av perioder', '1. periode starter med hoppball i midtsirkelen.\nAndre perioder og forlengninger starter med innkast fra midtlinjens forlengelse, på motsatt side av sekretariatet. Spilleren har én fot på hver side av linjen og kan sentre hvor som helst.'],
      ['Vekslende ballbesittelse (§ 12)', 'I hoppballsituasjoner får lagene annenhver gang innkast i stedet for hoppball.\nLaget som ikke fikk kontroll etter den første hoppballen, får det første innkastet.\nPilen peker mot motstandernes kurv og snus når innkastet er avsluttet.\nHoppballsituasjoner: holdt ball, uklart hvem som sendte ballen ut, ball fast mellom ring og plate med mer.'],
      ['Tapt kamp (§ 20–21)', 'Laget er ikke til stede eller kan ikke stille fem spillere 15 minutter etter oppsatt start: tapt 20–0.\nFærre enn to spillere klare på banen (utfouling/skade): lederen beholder stillingen, ellers 2–0.'],
    ],
    skills: [
      {
        id: 'b2s1', title: 'Lag og spilletid',
        items: [
          mc('Hvor mange spilleberettigede lagmedlemmer kan et lag høyst ha i en kamp?', ['12', '10', '15', '14'], 'Høyst 12 spilleberettigede lagmedlemmer, inkludert en kaptein.'),
          mc('Hvordan er spilletiden i en FIBA-kamp?', ['4 perioder à 10 minutter', '2 omganger à 20 minutter', '4 perioder à 12 minutter', '4 perioder à 8 minutter'], 'Kampen består av 4 perioder på 10 minutter.'),
          mc('Hvor lang er halvtidspausen?', ['15 minutter', '10 minutter', '20 minutter', '5 minutter'], 'Halvtidspausen er 15 minutter. Pausene mellom 1.–2. og 3.–4. periode er 2 minutter.'),
          mc('Hvor lang er en forlengningsperiode?', ['5 minutter', '3 minutter', '10 minutter', '2 minutter'], 'Det spilles så mange forlengninger på 5 minutter som trengs for å få en vinner.'),
          tf('I forlengning spiller lagene mot samme kurver som i 4. periode.', true, 'Lagene bytter ikke banehalvdel før forlengningsperiodene.'),
          match([['Periode', '10 min'], ['Forlengning', '5 min'], ['Halvtid', '15 min'], ['Pause mellom perioder', '2 min']]),
          num(() => ({ q: 'Hvor mange minutter varer ordinær spilletid totalt (uten forlengning)?', a: 40, u: 'min', e: '4 perioder × 10 minutter = 40 minutter.', tol: 0 })),
        ],
      },
      {
        id: 'b2s2', title: 'Hoppball og vekslende ballbesittelse',
        items: [
          mc('Hvordan starter 2., 3. og 4. periode?', ['Med innkast fra midtlinjens forlengelse, motsatt side av sekretariatet', 'Med hoppball i midtsirkelen', 'Med innkast fra endelinjen', 'Laget som tapte forrige periode får ballen'], 'Laget som har pilen for vekslende ballbesittelse, tar innkastet.'),
          mc('Hvilket lag får det første innkastet etter vekslende ballbesittelse?', ['Laget som ikke fikk den første lagkontrollen etter åpningshoppballen', 'Hjemmelaget', 'Laget som vant hoppballen', 'Bortelaget'], 'Den som taper åpningshoppballen, får den første vekslende ballbesittelsen.'),
          mc('Hvilken vei peker pilen for vekslende ballbesittelse?', ['Mot motstanderlagets kurv, altså den veien laget som skal ha ballen angriper', 'Mot lagets egen kurv', 'Mot sekretariatet', 'Mot laget som sist fikk ballen'], 'Pilen snus straks innkastet etter vekslende ballbesittelse er avsluttet.'),
          mc('Hva er en «holdt ball»?', ['Spillere fra begge lag holder så fast i ballen at ingen får kontroll uten overdreven kraft', 'En spiller holder ballen i mer enn 5 sekunder', 'Ballen setter seg fast i kurven', 'En spiller holder en motspiller'], 'Holdt ball er en hoppballsituasjon, og løses med vekslende ballbesittelse.'),
          tf('Laget som tar et innkast etter vekslende ballbesittelse og begår en overtredelse, mister ballbesittelsen, og pilen snus.', true, 'Motstanderne får innkast, og retten til neste vekslende ballbesittelse går også til dem.'),
          mc('Hvor mange ganger kan en spiller som er med i hoppballen, berøre ballen før den har berørt en annen spiller eller gulvet?', ['Høyst to ganger, og ballen kan ikke fanges', 'Bare én gang', 'Så mange ganger spilleren vil', 'Tre ganger'], 'De involverte spillerne får slå ballen høyst to ganger og kan ikke fange den.'),
        ],
      },
      {
        id: 'b2s3', title: 'Tapt kamp',
        items: [
          mc('Et lag kan ikke stille fem spillere 15 minutter etter oppsatt kampstart. Hva blir resultatet?', ['Laget taper 0–20', 'Laget taper 0–2', 'Kampen utsettes', 'Kampen spilles med fire spillere'], 'Motstanderne vinner 20–0, og laget som taper får 0 poeng i tabellen.'),
          mc('Et lag har færre enn to spillere igjen på banen på grunn av utfouling. Motstanderne leder 61–55. Hva blir resultatet?', ['61–55, stillingen står', '20–0', '2–0', 'Kampen spilles om'], 'Leder laget som får seieren, blir stillingen stående.'),
          mc('Et lag har færre enn to spillere igjen på grunn av skader. Motstanderne ligger under 40–44. Hva blir resultatet?', ['2–0 til motstanderne', '44–40', '20–0 til motstanderne', 'Uavgjort'], 'Leder ikke laget som får seieren, blir resultatet 2–0 i deres favør.'),
          tf('Et lag som taper på grunn av utfouling eller skade, får 1 poeng i tabellen.', true, 'Ved tapt kamp som straff (§ 20) får laget 0 poeng, ved utfouling eller skade (§ 21) 1 poeng.'),
          mc('Hvor mange spillere må et lag ha klare for at kampen skal kunne starte?', ['5', '4', '3', '2'], 'Kampen kan ikke starte hvis ett eller begge lag ikke har fem spillere klare.'),
        ],
      },
    ],
  };

  // ================================================================
  // ENHET 3 – POENG, INNKAST, TIME-OUT OG INNBYTTE
  // ================================================================
  const b3 = {
    id: 'b3',
    title: 'Poeng, innkast og time-out',
    color: '#1cb0f6', dark: '#1899d6',
    goal: 'Kunne reglene for scoring, innkast, time-out og innbytte (§ 16–19).',
    guide: [
      ['Poeng (§ 16)', 'Straffekast: 1 poeng. Fra 2-poengsområdet: 2 poeng. Fra 3-poengsområdet: 3 poeng.\nScorer en spiller ved et uhell i egen kurv: 2 poeng, registrert på motstandernes kaptein.\nScorer en spiller med vilje i egen kurv: overtredelse, målet teller ikke.\nKampklokken må vise minst 0,3 s for å fange og skyte. På 0,2 og 0,1 kan det bare scores ved å slå eller dunke ballen direkte.'],
      ['Innkast (§ 17)', 'Innkasteren har 5 sekunder på seg.\nInnkasteren kan ikke flytte seg mer enn 1 m sidelengs til sammen.\nBallen kan ikke kastes direkte i kurven.\nForsvarere kan ikke ha noen kroppsdel over grenselinjen.\nEtter scoring: innkast fra hvor som helst bak endelinjen. Spilleren kan bevege seg og sentre til en medspiller bak linjen.'],
      ['Time-out (§ 18)', 'En time-out varer 1 minutt.\n2 i første omgang, 3 i andre omgang (høyst 2 av dem når klokka viser 2:00 eller mindre i 4. periode), og 1 per forlengning.\nUbrukte time-outs kan ikke overføres.\nBare laglederen eller første assisterende lagleder kan be om time-out.'],
      ['Innbytte (§ 19)', 'Det er innbytteren selv som ber om innbytte ved sekretariatet.\nEn spiller med fem fouls må byttes ut innen 30 sekunder.\nFår en spiller behandling for skade, må spilleren byttes ut (hvis laget ellers har nok spillere).'],
    ],
    skills: [
      {
        id: 'b3s1', title: 'Poeng og scoring',
        items: [
          match([['Straffekast', '1 poeng'], ['Skudd innenfor 3-poengslinjen', '2 poeng'], ['Skudd utenfor 3-poengslinjen', '3 poeng'], ['Uhell i egen kurv', '2 poeng til motstanderne']]),
          mc('En spiller scorer ved et uhell i sitt eget lags kurv. Hva skjer?', ['Målet gir 2 poeng til motstanderne og registreres på kapteinen deres på banen', 'Målet teller ikke', 'Det blir hoppball', 'Spilleren får teknisk foul'], 'Et uhell i egen kurv gir alltid 2 poeng til motstanderne.'),
          mc('En spiller scorer med vilje i sin egen kurv. Hva skjer?', ['Det er en overtredelse, og målet teller ikke', 'Motstanderne får 2 poeng', 'Motstanderne får 3 poeng', 'Spilleren blir bortvist'], 'Å score med vilje i egen kurv er en overtredelse.'),
          mc('Kampklokken viser 0,2 sekunder ved et innkast i angrepsfeltet. Hvordan kan laget score?', ['Bare ved å slå eller dunke ballen direkte i kurven', 'Ved et vanlig hoppskudd', 'Det er umulig å score', 'Bare med et 3-poengsskudd'], 'Det trengs minst 0,3 s for å fange og skyte.'),
          num(() => ({ q: 'Hvor mange sekunder må kampklokken minst vise for at en spiller skal kunne fange ballen og skyte etter et innkast?', a: 0.3, u: 's', e: 'Kampklokken må vise 0,3 sekunder eller mer.', tol: 0 })),
          tf('Etter et siste straffekast som treffer ringen og blir lovlig slått i kurven av en spiller, gir målet 2 poeng.', true, 'Da regnes det som et vanlig mål fra spill, ikke som straffekast.'),
        ],
      },
      {
        id: 'b3s2', title: 'Innkast',
        items: [
          mc('Hvor lang tid har en spiller på seg til å slippe ballen ved et innkast?', ['5 sekunder', '3 sekunder', '8 sekunder', '10 sekunder'], 'Innkasteren har 5 sekunder på seg.'),
          mc('Hvor langt sidelengs kan innkasteren bevege seg før ballen slippes?', ['Til sammen høyst 1 m', 'Fritt langs hele linjen', '2 m i hver retning', 'Ingenting'], 'Bakover kan spilleren gå så langt forholdene tillater, men sidelengs høyst 1 m til sammen.'),
          tf('Etter at laget har sluppet inn en kurv, kan innkasteren bevege seg langs endelinjen og sentre til en medspiller som også står bak linjen.', true, 'Etter et vellykket mål tas innkastet fra hvor som helst bak endelinjen.'),
          mc('Hvor tas innkastet etter en usportslig foul (kategori 1 eller 2)?', ['Fra innkastlinjen i lagets angrepsfelt, på motsatt side av sekretariatet', 'Fra endelinjen', 'Fra midtlinjen', 'Fra nærmeste sted'], 'Etter usportslig eller diskvalifiserende foul: innkast fra innkastlinjen i angrepsfeltet.'),
          mc('Hvor tas innkastet etter en teknisk foul?', ['Fra stedet nærmest der ballen var da den tekniske foulen ble dømt', 'Fra midtlinjen', 'Fra innkastlinjen i angrepsfeltet', 'Fra endelinjen'], 'Laget som hadde ballen, fortsetter med innkast fra nærmeste sted.'),
          tf('Innkasteren kan kaste ballen direkte i kurven og få poeng.', false, 'Det er en overtredelse å forårsake at ballen går direkte i kurven fra et innkast.'),
          mc('Klokka viser 2:00 eller mindre i 4. periode, og et lag med ballen i forsvarsfeltet tar time-out. Hva kan laglederen velge?', ['Om innkastet skal tas fra innkastlinjen i angrepsfeltet eller fra forsvarsfeltet', 'Om laget skal få to straffekast', 'Om skuddklokken skal stilles til 24', 'Ingenting'], 'Laglederen bestemmer om laget skal fortsette fra angrepsfeltet eller forsvarsfeltet.'),
        ],
      },
      {
        id: 'b3s3', title: 'Time-out og innbytte',
        items: [
          mc('Hvor mange time-outs får et lag i andre omgang?', ['3, men høyst 2 når klokka viser 2:00 eller mindre i 4. periode', '2', '3, uten begrensning', '4'], 'Første omgang: 2. Andre omgang: 3, med høyst 2 i de siste to minuttene.'),
          mc('Hvor lenge varer en time-out?', ['1 minutt', '30 sekunder', '2 minutter', '90 sekunder'], 'Hver time-out skal vare 1 minutt.'),
          tf('En ubrukt time-out fra første omgang kan spares til andre omgang.', false, 'Ubrukte time-outs kan ikke overføres til neste omgang eller forlengning.'),
          mc('Hvem kan be om time-out?', ['Laglederen eller første assisterende lagleder', 'Kapteinen', 'Hvilken som helst spiller', 'Sekretæren'], 'Bare laglederen eller første assisterende lagleder kan be om time-out.'),
          mc('Hvem ber om innbytte?', ['Innbytteren selv', 'Laglederen', 'Kapteinen', 'Dommeren'], 'Innbytteren går til sekretariatet og ber om innbytte (eller setter seg på innbytterbenken).'),
          mc('Hvor lang tid har laget på å bytte ut en spiller som har fått fem fouls?', ['30 sekunder', '1 minutt', '10 sekunder', 'Til neste time-out'], 'Spilleren må byttes ut umiddelbart, innen maksimalt 30 sekunder.'),
          tf('En spiller som får behandling av lagets helsepersonell på banen, må byttes ut.', true, 'Unntaket er hvis laget da får færre enn fem spillere på banen.'),
          num(() => ({ q: 'Hvor mange time-outs kan et lag til sammen bruke i ordinær spilletid (uten forlengning)?', a: 5, u: 'time-outs', e: '2 i første omgang + 3 i andre omgang = 5.', tol: 0 })),
        ],
      },
    ],
  };

  // ================================================================
  // ENHET 4 – OVERTREDELSER
  // ================================================================
  const b4 = {
    id: 'b4',
    title: 'Overtredelser',
    color: '#ce82ff', dark: '#a568cc',
    goal: 'Kjenne igjen de vanligste overtredelsene: dribling, skrittfeil, 3 og 5 sekunder, 8 sekunder, tilbakespill og ball utenfor banen (§ 23–28, 30).',
    guide: [
      ['Ball og spiller utenfor (§ 23)', 'En spiller er utenfor når noen del av kroppen berører gulvet på eller utenfor grenselinjen.\nBallen er utenfor når den berører noe på eller utenfor linjen, kurvstativet eller baksiden av platen.\nSpilleren som sist berørte ballen, har sendt den ut.'],
      ['Dribling (§ 24)', 'En dribling slutter når spilleren berører ballen med begge hender samtidig eller lar den hvile i hånden.\nNytt i 2026: Du kan bare drible på nytt hvis du har mistet kontrollen på grunn av et skuddforsøk, at en motspiller berører ballen, eller at ballen i en pasning eller fomling berører en annen spiller.'],
      ['Skrittfeil (§ 25)', 'En spiller i bevegelse kan ta to skritt for å stoppe, sentre eller skyte.\nFor å starte en dribling må ballen slippes før det andre skrittet.\nPivoteringsfoten må holdes på samme sted.\nEn spiller som ligger med ballen, kan ikke rulle eller reise seg med den.'],
      ['Tidsregler', '3 sekunder: Ikke mer enn 3 sammenhengende sekunder i motstandernes 3-sekundersområde mens laget har ballen i angrepsfeltet.\n5 sekunder: En tett oppdekket spiller (forsvarer innenfor 1 m) må sentre, skyte eller drible innen 5 s.\n8 sekunder: Laget må få ballen inn i angrepsfeltet innen 8 s.'],
      ['Tilbakespill (§ 30)', 'Et lag med kontroll i angrepsfeltet kan ikke spille ballen tilbake til forsvarsfeltet sitt og berøre den der.\nStraff: motstanderne får innkast i sitt angrepsfelt.'],
    ],
    skills: [
      {
        id: 'b4s1', title: 'Dribling og skrittfeil',
        items: [
          mc('Når er en dribling avsluttet?', ['Når spilleren berører ballen med begge hender samtidig eller lar den hvile i hånden', 'Etter tre sprett', 'Når spilleren stopper å løpe', 'Når ballen går over midtlinjen'], 'Etter at driblingen er avsluttet, kan spilleren ikke drible igjen før kontrollen er mistet på en av de tre godkjente måtene.'),
          mc('Etter 2026-reglene: Når kan en spiller drible på nytt etter at første dribling er avsluttet?', ['Etter et skuddforsøk, etter at en motspiller har berørt ballen, eller etter at ballen i en pasning eller fomling har berørt en annen spiller', 'Etter 5 sekunder', 'Når spilleren har pivotert', 'Aldri'], 'FIBA presiserte i 2026 at én av disse tre situasjonene må ha skjedd.'),
          mc('En spiller mottar ballen i full fart. Hvor mange skritt kan spilleren ta for å stoppe, sentre eller skyte?', ['To', 'Ett', 'Tre', 'Så mange som nødvendig'], 'En spiller i bevegelse eller som avslutter en dribling, kan ta to skritt.'),
          tf('For å starte en dribling må spilleren slippe ballen før det andre skrittet.', true, 'Ellers er det skrittfeil.'),
          mc('Hva er en pivoteringsfot?', ['Foten som holdes i ro på samme sted mens spilleren vrir seg med den andre', 'Foten spilleren hopper fra', 'Den foten som er nærmest kurven', 'Foten som berører linjen'], 'Pivotering er lovlig så lenge pivoteringsfoten holdes på samme sted.'),
          tf('En spiller som faller med ballen og sklir bortover gulvet, har gjort skrittfeil.', false, 'Det er lov å falle og skli med ballen. Det er skrittfeil å rulle eller reise seg mens man holder ballen.'),
          tf('Det er en overtredelse å berøre ballen tilfeldig med beinet.', false, 'Bare det å sparke eller blokkere ballen med beinet med vilje er en overtredelse.'),
        ],
      },
      {
        id: 'b4s2', title: '3, 5 og 8 sekunder',
        items: [
          mc('Hvor lenge kan en angrepsspiller stå sammenhengende i motstandernes 3-sekundersområde?', ['Under 3 sekunder', '5 sekunder', '8 sekunder', 'Ubegrenset'], 'Mer enn 3 sammenhengende sekunder er en overtredelse når laget har ballen i angrepsfeltet og kampklokken går.'),
          mc('Hva skal til for at en spiller etablerer seg utenfor 3-sekundersområdet?', ['Begge føttene på gulvet utenfor området', 'Én fot utenfor', 'Å hoppe ut av området', 'Å berøre linjen'], 'Spilleren må plassere begge føttene på banen utenfor området.'),
          mc('En spiller med ballen er tett oppdekket. Hva betyr det?', ['En forsvarer står i aktiv, lovlig forsvarsposisjon innen 1 m', 'To forsvarere står rundt spilleren', 'Spilleren står i hjørnet', 'Spilleren har stått stille i 3 s'], 'Da må spilleren sentre, skyte eller drible innen 5 sekunder.'),
          mc('Hvor lang tid har et lag på å få ballen fra forsvarsfeltet til angrepsfeltet?', ['8 sekunder', '10 sekunder', '5 sekunder', '24 sekunder'], 'Laget må bringe ballen inn i angrepsfeltet innen 8 sekunder.'),
          match([['3 sekunder', '3-sekundersområdet'], ['5 sekunder', 'Tett oppdekket'], ['8 sekunder', 'Over midtlinjen'], ['24 sekunder', 'Skuddklokke']], 'Koble tidsregelen med situasjonen'),
          tf('En spiller som har vært under 3 sekunder i feltet og dribler inn for å skyte, kan fortsette selv om 3 sekunder passeres.', true, 'Det er et av unntakene i § 26.'),
        ],
      },
      {
        id: 'b4s3', title: 'Utenfor banen og tilbakespill',
        items: [
          mc('Ballen treffer baksiden av platen. Hva skjer?', ['Ballen er utenfor banen', 'Spillet fortsetter', 'Det blir hoppball', 'Det blir 2 poeng'], 'Baksiden av platen og kurvstativet regnes som utenfor banen.'),
          mc('Hvem har sendt ballen utenfor banen?', ['Spilleren som sist berørte, eller ble berørt av, ballen', 'Spilleren nærmest linjen', 'Laget som angrep', 'Dommeren bestemmer fritt'], 'Den siste spilleren som berørte ballen, har forårsaket at den gikk ut.'),
          tf('En spiller som står med hælen på sidelinjen og tar imot ballen, er utenfor banen.', true, 'Linjene er utenfor banen. Berører spilleren linjen, er spilleren utenfor.'),
          mc('Et lag har kontroll i angrepsfeltet. En spiller sentrer ballen, og en medspiller som står i forsvarsfeltet tar imot. Hva er dette?', ['Tilbakespill (overtredelse)', 'Lovlig spill', 'Skrittfeil', '8 sekunder'], 'Ballen ble sist berørt i angrepsfeltet og deretter berørt av samme lag i forsvarsfeltet.'),
          mc('Hva er straffen for tilbakespill?', ['Motstanderne får innkast i sitt angrepsfelt nærmest stedet for overtredelsen', 'To straffekast', 'Hoppball', 'Teknisk foul'], 'Innkast til motstanderne, ikke rett bak platen.'),
          tf('En spiller hopper fra angrepsfeltet, får ny lagkontroll over ballen i lufta og lander i forsvarsfeltet. Dette er ikke tilbakespill.', true, 'Dette unntaket står i § 30.1.2.'),
        ],
      },
    ],
  };

  // ================================================================
  // ENHET 5 – SKUDDKLOKKE OG SKUDDBEVEGELSE
  // ================================================================
  const b5 = {
    id: 'b5',
    title: 'Skuddklokke og skuddbevegelse',
    color: '#00b8a9', dark: '#00897e',
    goal: 'Kunne reglene for skuddklokken (24/14) og den nye definisjonen av spiller i skuddbevegelse fra 2026 (§ 15 og 29).',
    guide: [
      ['Skuddklokken (§ 29)', 'Laget har 24 sekunder på seg til å skyte.\nBallen må ha forlatt hånden før signalet, og deretter treffe ringen eller gå i kurven.\nSignal mens ballen er i lufta: går den i kurven, teller målet. Treffer den ringen, fortsetter spillet. Bommer den på ringen, er det overtredelse (med mindre motstanderne straks har fått kontroll).'],
      ['Tilbakestilling', 'Ballen treffer ringen: 24 s hvis motstanderne tar ballen, 14 s hvis samme lag tar ballen.\nFoul eller overtredelse av forsvaret, innkast i angrepsfeltet: 14 eller mer på klokka fortsetter, 13 eller mindre stilles til 14.\nInnkast i forsvarsfeltet etter feil av forsvaret: 24 s.\nNytt lag i angrep etter innkast i angrepsfeltet: 14 s.\nEtter usportslig eller diskvalifiserende foul: 14 s.'],
      ['Skuddbevegelse (nytt i 2026)', 'Hoppskudd: starter når spilleren begynner å bevege skuldrene og ballen oppover mot kurven.\nKontinuerlig bevegelse mot kurven: starter når spilleren har samlet ballen og den hviler i hånden etter dribling eller mottak i lufta.\nSlutter når ballen har forlatt hånden, og en spiller i lufta har landet med begge føttene.\nSpilleren må være i angrepsfeltet. Unntak: siste aksjon før periodeslutt eller før skuddklokken går ut.\nDet er ingen sammenheng mellom antall lovlige skritt og skuddbevegelsen.\nSentrer spilleren etter å ha blitt foulet, er spilleren ikke lenger i skuddbevegelse.'],
    ],
    skills: [
      {
        id: 'b5s1', title: '24 og 14 sekunder',
        items: [
          mc('Hvor lang tid har et lag på seg til å gjøre et skuddforsøk?', ['24 sekunder', '30 sekunder', '14 sekunder', '20 sekunder'], 'Skuddklokken starter på 24 sekunder.'),
          mc('Et skudd treffer ringen, og det samme laget tar returen. Hva stilles skuddklokken til?', ['14 sekunder', '24 sekunder', 'Den fortsetter', '10 sekunder'], 'Samme lag får 14 sekunder etter at ballen har berørt ringen.'),
          mc('Et skudd treffer ringen, og motstanderne tar returen. Hva stilles skuddklokken til?', ['24 sekunder', '14 sekunder', 'Den fortsetter', '8 sekunder'], 'Nytt lag i angrep etter returen får 24 sekunder.'),
          mc('Forsvaret begår en foul (laget er ikke i bonus). Angrepslaget får innkast i angrepsfeltet, og skuddklokken viser 9 sekunder. Hva stilles den til?', ['14 sekunder', '24 sekunder', 'Den fortsetter fra 9', '19 sekunder'], 'Viser klokka 13 eller mindre, stilles den til 14.'),
          mc('Forsvaret sparker ballen. Angrepslaget får innkast i angrepsfeltet, og skuddklokken viser 17 sekunder. Hva skjer med den?', ['Den fortsetter fra 17', 'Den stilles til 24', 'Den stilles til 14', 'Den stilles til 20'], 'Viser klokka 14 eller mer, fortsetter den der den stoppet.'),
          mc('Hva stilles skuddklokken til etter en usportslig foul med innkast fra innkastlinjen i angrepsfeltet?', ['14 sekunder', '24 sekunder', 'Den fortsetter', '8 sekunder'], 'Innkast etter usportslig (kategori 1 eller 2) eller diskvalifiserende foul gir 14 sekunder.'),
          tf('Skuddklokken lyder mens ballen er i lufta, og ballen går i kurven. Målet teller.', true, 'Signalet overses, og målet teller.'),
          tf('Skuddklokken lyder mens ballen er i lufta, og skuddet bommer på ringen. Det er alltid en overtredelse.', false, 'Det er en overtredelse, men spillet fortsetter hvis motstanderne umiddelbart og tydelig har fått kontroll over ballen.'),
          num(() => { const v = pick([[3, 14, 'motstanderne har sparket ballen', 14], [16, 16, 'forsvaret har begått en foul (ikke i bonus)', 16], [12, 14, 'forsvaret har begått en foul (ikke i bonus)', 14]]); return { q: `Angrepslaget skal ta innkast i angrepsfeltet fordi ${v[2]}. Skuddklokken viste ${v[0]} sekunder. Hva skal skuddklokken vise ved innkastet?`, a: v[3], u: 's', e: v[0] >= 14 ? `Klokka viste 14 eller mer, så den fortsetter fra ${v[0]}.` : 'Klokka viste 13 eller mindre, så den stilles til 14.', tol: 0 }; }),
        ],
      },
      {
        id: 'b5s2', title: 'Skuddbevegelse (nytt i 2026)',
        items: [
          mc('Når starter skuddbevegelsen i et hoppskudd etter 2026-reglene?', ['Når spilleren begynner å bevege skuldrene og ballen oppover mot kurven', 'Når spilleren tar det første skrittet', 'Når spilleren mottar ballen', 'Når spilleren er i lufta'], 'Bevegelsen av skuldrene og ballen oppover markerer starten.'),
          mc('Når starter skuddbevegelsen ved en kontinuerlig bevegelse mot kurven (drive)?', ['Når spilleren har samlet ballen og den hviler i hånden etter dribling eller mottak i lufta, og spilleren fortsetter skuddbevegelsen', 'Når spilleren passerer 3-poengslinjen', 'Når spilleren starter driblingen', 'Når forsvareren tar kontakt'], 'Det er samlingen av ballen som markerer starten på en drive.'),
          tf('Etter 2026-reglene må en spiller normalt være i angrepsfeltet for å regnes som i skuddbevegelse.', true, 'Unntaket er den siste aksjonen før perioden slutter eller skuddklokken går ut.'),
          mc('En spiller blir foulet i sitt eget forsvarsfelt mens spilleren kaster ballen mot kurven midt i perioden. Er spilleren i skuddbevegelse?', ['Nei, et «skudd» fra forsvarsfeltet regnes ikke som skuddbevegelse, unntatt ved periodeslutt eller når skuddklokken går ut', 'Ja, alltid', 'Ja, hvis ballen treffer ringen', 'Bare hvis det er siste periode'], 'Dette er nytt i 2026 og skal hindre at spillere «kjøper» straffekast langt fra kurven.'),
          tf('Antall lovlige skritt spilleren har tatt, avgjør om spilleren er i skuddbevegelse.', false, 'Reglene sier uttrykkelig at det ikke er noen sammenheng mellom antall skritt og skuddbevegelsen.'),
          mc('En spiller blir foulet i skuddbevegelse, men sentrer deretter ballen til en medspiller. Hva gjelder?', ['Spilleren regnes ikke lenger som i skuddbevegelse', 'Spilleren får likevel straffekast for skudd', 'Det blir teknisk foul', 'Det blir hoppball'], 'Sentrer spilleren etter foulen, er spilleren ikke lenger i skuddbevegelse.'),
          mc('Når slutter skuddbevegelsen for en spiller som hopper?', ['Når ballen har forlatt hånden og spilleren har landet med begge føttene', 'Når ballen treffer ringen', 'Når spilleren er på toppen av hoppet', 'Når dommeren blåser'], 'For en spiller i lufta varer skuddbevegelsen til begge føttene er tilbake på gulvet.'),
          tf('En spiller i et hoppskudd blir foulet og beveger deretter ballen oppover i retning bort fra kurven. Spilleren regnes fortsatt som i skuddbevegelse.', false, 'Beveger spilleren ballen oppover bort fra kurven, eller har ikke ansiktet mot kurven, er spilleren ikke lenger i skuddbevegelse.'),
        ],
      },
    ],
  };

  // ================================================================
  // ENHET 6 – PERSONLIGE FOULS OG LAGFOULS
  // ================================================================
  const b6 = {
    id: 'b6',
    title: 'Personlige fouls og lagfouls',
    color: '#ff4b4b', dark: '#ea2b2b',
    goal: 'Kunne prinsippene for kontakt, straffen for personlige fouls og reglene for lagfouls og foulgrenser (§ 33–35, 41–42).',
    guide: [
      ['Kontaktprinsipper (§ 33)', 'Sylinderprinsippet: Hver spiller har rett til rommet i en tenkt sylinder rundt seg.\nVertikalitetsprinsippet: Den som forlater sin vertikale posisjon og lager kontakt, er ansvarlig for kontakten.\nLovlig forsvarsposisjon: Forsvareren står vendt mot motspilleren med begge føttene på gulvet.'],
      ['Personlig foul (§ 34)', 'Ikke i skuddbevegelse: innkast (eller 2 straffekast hvis laget har nådd bestrafningsgrensen).\nI skuddbevegelse: scorer spilleren, teller målet og det gis 1 straffekast. Bom fra 2-poengsområdet gir 2 straffekast, bom fra 3-poengsområdet gir 3.\nInnkastfoul (2:00 eller mindre i 4. periode/forlengning): 1 straffekast og innkast.'],
      ['Lagfouls (§ 42)', 'Et lag har nådd bestrafningsgrensen etter 4 lagfouls i en periode.\nFra og med 5. lagfoul gir personlige fouls på spiller som ikke er i skuddbevegelse, 2 straffekast.\nFouls av laget med ballen gir alltid bare innkast til motstanderne.\nLagfouls i forlengning regnes med i 4. periode.'],
      ['Foulgrenser (§ 41)', 'En spiller med 5 fouls må forlate banen og byttes ut innen 30 sekunder.\nDobbelfoul: begge motspillere fouler omtrent samtidig. Ingen straffekast.'],
    ],
    skills: [
      {
        id: 'b6s1', title: 'Kontakt og personlig foul',
        items: [
          mc('Hva sier sylinderprinsippet?', ['Hver spiller har rett til rommet i en tenkt sylinder rundt seg på banen', 'Ballen skal alltid være innenfor sylinderen', 'Forsvarere må stå i ro', 'Angriperen har alltid rett'], 'Ingen kan gå inn i en annens sylinder og lage ulovlig kontakt.'),
          mc('Hva sier vertikalitetsprinsippet?', ['Den som forlater sin vertikale posisjon og lager kontakt med en spiller som allerede sto der, er ansvarlig for kontakten', 'Det er alltid foul på den høyeste spilleren', 'Bare forsvarere kan hoppe', 'Spillere kan ikke hoppe rett opp'], 'En forsvarer som hopper rett opp i sin egen sylinder, skal ikke straffes.'),
          mc('En spiller i skuddbevegelse blir foulet og scorer et 2-poengsskudd. Hva blir straffen?', ['Målet teller, og spilleren får 1 straffekast', '2 straffekast', 'Målet teller ikke, 2 straffekast', 'Bare innkast'], 'Scores målet, teller det og det gis 1 ekstra straffekast.'),
          mc('En spiller blir foulet i et 3-poengsskudd som bommer. Hvor mange straffekast?', ['3', '2', '1', '0'], 'Bom fra 3-poengsområdet gir 3 straffekast.'),
          mc('En spiller som ikke er i skuddbevegelse blir foulet. Laget som foulet har 2 lagfouls i perioden. Hva skjer?', ['Innkast til laget som ble foulet', '2 straffekast', '1 straffekast', 'Hoppball'], 'Laget som foulet, har ikke nådd bestrafningsgrensen ennå.'),
          mc('Hva er en innkastfoul?', ['En personlig foul av en forsvarer mens ballen er utenfor banen for innkast, når klokka viser 2:00 eller mindre i 4. periode eller forlengning', 'En foul av innkasteren', 'En foul på midtlinjen', 'En foul etter at innkastet er tatt'], 'Straffen er 1 straffekast og innkast til laget som ble foulet.'),
          num(() => { const v = pick([[2, 'scoret ikke', '2-poengsområdet', 2], [3, 'scoret ikke', '3-poengsområdet', 3], [2, 'scoret', '2-poengsområdet', 1]]); return { q: `En spiller blir foulet i skuddbevegelse fra ${v[2]} og ${v[1]}. Hvor mange straffekast får spilleren?`, a: v[3], u: 'straffekast', e: v[1] === 'scoret' ? 'Målet teller, og spilleren får 1 straffekast i tillegg.' : `Bom fra ${v[2]} gir ${v[3]} straffekast.`, tol: 0 }; }),
        ],
      },
      {
        id: 'b6s2', title: 'Lagfouls og foulgrenser',
        items: [
          mc('Etter hvor mange lagfouls i en periode har et lag nådd bestrafningsgrensen?', ['4', '5', '3', '6'], 'Etter 4 lagfouls er grensen nådd. Fra og med 5. foul gis det straffekast.'),
          mc('Laget har 4 lagfouls i perioden og fouler en spiller som ikke er i skuddbevegelse. Hva er straffen?', ['2 straffekast', 'Innkast', '1 straffekast', '3 straffekast'], 'Når bestrafningsgrensen er nådd, gir personlige fouls 2 straffekast i stedet for innkast.'),
          tf('Et lag har nådd bestrafningsgrensen. En spiller på laget som har ballen, begår en personlig foul. Motstanderne får 2 straffekast.', false, 'En foul av laget med kontroll over ballen gir bare innkast til motstanderne.'),
          mc('Hvordan telles lagfouls i forlengning?', ['De regnes som begått i 4. periode', 'De starter på null i hver forlengning', 'De telles ikke', 'De regnes som begått i 1. periode'], 'Alle lagfouls i forlengningene regnes med i 4. periode.'),
          mc('Hvor mange fouls kan en spiller få før spilleren må forlate kampen?', ['5', '6', '4', '3'], 'En spiller med fem fouls må forlate banen.'),
          mc('Hva er en dobbelfoul?', ['To motspillere begår fouls mot hverandre omtrent samtidig', 'To fouls av samme spiller', 'En foul som gir dobbel straff', 'En foul på to spillere samtidig'], 'Foulene noteres på begge spillerne, og det gis ingen straffekast.'),
          num(() => ({ q: 'Et lag har begått 3 lagfouls i 2. periode. Hvor mange fouls til kan laget begå før det har nådd bestrafningsgrensen?', a: 1, u: 'foul', e: 'Grensen nås ved 4 lagfouls, så det gjenstår 1.', tol: 0 })),
          tf('En teknisk foul på en spiller teller som en lagfoul.', true, 'En teknisk foul på en spiller noteres som spillerfoul og teller som lagfoul, uansett kategori.'),
        ],
      },
    ],
  };

  // ================================================================
  // ENHET 7 – TEKNISKE OG USPORTSLIGE FOULS (NYTT I 2026)
  // ================================================================
  const b7 = {
    id: 'b7',
    title: 'Tekniske og usportslige fouls (2026)',
    color: '#2b70c9', dark: '#1f5aa3',
    goal: 'Forstå de nye kategoriene for tekniske fouls og usportslige fouls fra 2026, straffene og reglene for bortvisning (§ 36–40).',
    guide: [
      ['Teknisk foul (§ 36)', 'Nytt i 2026: to kategorier.\nKategori 1 (oppførsel, teller mot bortvisning): respektløs oppførsel mot dommere eller motspillere, gester som opphisser publikum, provosering, vifting med hendene foran øynene til en motspiller, overdreven albuesving uten kontakt, og skuespill (late som man blir foulet).\nKategori 2 (teller ikke mot bortvisning): forsinke spillet, henge i ringen, og at en forsvarer berører ballen ulovlig på et siste straffekast (1 poeng + teknisk foul).\nStraff: 1 straffekast, deretter innkast til laget som hadde ballen.'],
      ['Usportslig foul kategori 2 – «disruptive» (§ 37)', 'Ny i 2026. Kontakt som bryter spillflyten og gir motstanderne en ulempe:\nUnødvendig kontakt for å stoppe et kontringsangrep, uten et legitimt forsøk på å spille ballen.\nKontakt bakfra eller fra siden på en spiller på vei mot kurven uten motspillere mellom seg og kurven.\nTeller IKKE mot bortvisning.'],
      ['Usportslig foul kategori 1 – «flagrant» (§ 38)', 'Ikke legitim basketballhandling, hensynsløs, voldsom eller farlig handling, eller unødvendig hard kontakt.\nTeller mot bortvisning.'],
      ['Straff for usportslige fouls', 'Ikke i skuddbevegelse: 2 straffekast. Scoring i skuddbevegelse: målet teller + 1 straffekast. Bom: 2 eller 3 straffekast.\nDeretter innkast fra innkastlinjen i angrepsfeltet, motsatt side av sekretariatet. Skuddklokken stilles til 14.'],
      ['Bortvisning', 'En spiller bortvises etter to tekniske fouls kategori 1, to usportslige fouls kategori 1, eller én av hver.\nEn lagleder bortvises etter to tekniske fouls for egen oppførsel («L»), eller tre tekniske fouls der noen skyldes andre på benken («B»).\nDiskvalifiserende foul: grovt usportslig handling. Personen må gå til garderoben.\nSlagsmål: innbyttere som forlater lagbenkområdet, bortvises. Bare laglederen og første assisterende lagleder kan gå ut for å hjelpe dommerne.'],
    ],
    skills: [
      {
        id: 'b7s1', title: 'Teknisk foul kategori 1 og 2',
        items: [
          mc('Hva er forskjellen på teknisk foul kategori 1 og kategori 2 (nytt i 2026)?', ['Kategori 1 teller mot bortvisning, kategori 2 gjør det ikke', 'Kategori 2 gir to straffekast', 'Kategori 1 gjelder bare lagledere', 'Det er ingen forskjell i straff eller konsekvens'], 'De alvorligste, oppførselsrelaterte tekniske foulene er kategori 1.'),
          mc('Hvilken av disse er en teknisk foul kategori 1?', ['Late som man blir foulet (skuespill)', 'Henge i ringen', 'Forsinke spillet ved å holde ballen etter scoring', 'Komme for sent ut til andre omgang'], 'Skuespill er oppførselsrelatert og teller mot bortvisning.'),
          mc('Hvilken av disse er en teknisk foul kategori 2?', ['Henge i ringen slik at ringen bærer spillerens vekt', 'Vifte med hendene foran øynene til en motspiller', 'Respektløs kommunikasjon med dommeren', 'Provosere en motspiller'], 'Å henge i ringen er av administrativ art og teller ikke mot bortvisning.'),
          mc('En forsvarer berører ballen ulovlig (goaltending) på et siste straffekast. Hva er straffen etter 2026-reglene?', ['Angrepslaget får 1 poeng, og forsvareren får en teknisk foul kategori 2', 'Straffekastet tas om', '2 poeng og usportslig foul', 'Bare 1 poeng'], 'Dette er nytt: 1 poeng etterfulgt av bestrafning for teknisk foul kategori 2.'),
          mc('Hva er straffen for en teknisk foul?', ['1 straffekast, deretter innkast til laget som hadde ballen', '2 straffekast og ball', '1 straffekast og hoppball', 'Bare innkast'], 'Straffekastet tas umiddelbart av en hvilken som helst motspiller laglederen utpeker.'),
          tf('En teknisk foul kategori 1 på en person på lagbenken noteres på laglederen og teller ikke som lagfoul.', true, 'Benkens tekniske fouls noteres på laglederen.'),
          match([['Skuespill', 'Teknisk kat. 1'], ['Henge i ringen', 'Teknisk kat. 2'], ['Stoppe en kontring uten å spille ballen', 'Usportslig kat. 2'], ['Farlig, voldsom kontakt', 'Usportslig kat. 1']], 'Koble handlingen med foulen'),
        ],
      },
      {
        id: 'b7s2', title: 'Usportslig foul (disruptive og flagrant)',
        items: [
          mc('Hva kalles den tidligere «usportslige foulen» nå?', ['Den er delt i usportslig foul kategori 1 (flagrant) og kategori 2 (disruptive)', 'Teknisk foul', 'Diskvalifiserende foul', 'Den er fjernet'], 'FIBA delte den usportslige foulen i to typer i 2026.'),
          mc('En forsvarer drar ned en spiller på en kontring uten å forsøke å spille ballen, bare for å stoppe angrepet. Hva dømmes?', ['Usportslig foul kategori 2 (disruptive)', 'Personlig foul', 'Teknisk foul', 'Usportslig foul kategori 1 (flagrant)'], 'Unødvendig kontakt for å stoppe angrepslaget i overgangen er en disruptive foul.'),
          mc('En spiller gjør en farlig og voldsom handling som kan skade en motspiller. Hva dømmes?', ['Usportslig foul kategori 1 (flagrant)', 'Usportslig foul kategori 2 (disruptive)', 'Personlig foul', 'Teknisk foul kategori 2'], 'Hensynsløse, voldsomme eller farlige handlinger er flagrante.'),
          tf('En usportslig foul kategori 2 (disruptive) teller mot bortvisning.', false, 'Bare kategori 1 (flagrant) teller mot bortvisning. Kategori 2 teller som lagfoul.'),
          mc('En spiller som ikke er i skuddbevegelse, får en usportslig foul mot seg. Hva er straffen?', ['2 straffekast, deretter innkast fra innkastlinjen i angrepsfeltet', '1 straffekast og innkast', '2 straffekast og hoppball', 'Bare innkast'], 'Begge typene usportslige fouls har samme straff.'),
          mc('En angriper på vei mot kurven, uten motspillere mellom seg og kurven, blir foulet bakfra før skuddbevegelsen starter. Hva dømmes?', ['Usportslig foul kategori 2 (disruptive)', 'Personlig foul', 'Usportslig foul kategori 1, alltid', 'Ingenting'], 'Kontakt bakfra eller fra siden i denne situasjonen er et av kriteriene for disruptive foul.'),
          tf('Både usportslig foul kategori 1 og kategori 2 teller som lagfoul.', true, 'Begge noteres på spilleren og teller som en av lagfoulene.'),
        ],
      },
      {
        id: 'b7s3', title: 'Bortvisning og slagsmål',
        items: [
          mc('Hvilken kombinasjon fører til at en spiller bortvises?', ['To tekniske fouls kategori 1', 'To tekniske fouls kategori 2', 'To usportslige fouls kategori 2', 'Én teknisk foul kategori 2 og én usportslig foul kategori 2'], 'Bortvisning: to T kat. 1, to usportslige kat. 1, eller én av hver.'),
          mc('En spiller har fått én teknisk foul kategori 1 og får deretter en usportslig foul kategori 1. Hva skjer?', ['Spilleren bortvises fra kampen', 'Ingenting ekstra', 'Spilleren må sitte ute ett minutt', 'Laget får teknisk foul'], 'Én teknisk kat. 1 + én usportslig kat. 1 gir bortvisning.'),
          tf('En spiller med to usportslige fouls kategori 2 (disruptive) og én teknisk foul kategori 2 kan fortsette å spille (hvis spilleren ikke har fem fouls).', true, 'Ingen av disse foulene teller mot bortvisning. Men de teller som personlige fouls, så fem fouls totalt gir utvisning.'),
          mc('Hvor mange tekniske fouls for egen usportslig oppførsel («L») gir bortvisning for en lagleder?', ['2', '3', '1', '4'], 'To tekniske fouls for egen oppførsel, eller tre der noen skyldes andre på benken.'),
          mc('Det oppstår et slagsmål på banen. Hvem kan forlate lagbenkområdet uten å bli bortvist?', ['Laglederen og første assisterende lagleder, hvis de hjelper dommerne å skape ro', 'Alle innbyttere', 'Kapteinen', 'Ingen'], 'Innbyttere og andre som forlater benken under et slagsmål, bortvises.'),
          mc('Hva skal en person som har fått en diskvalifiserende foul, gjøre?', ['Gå til garderoben og bli der til kampen er slutt, eller forlate hallen', 'Sette seg på benken', 'Sitte på tribunen', 'Vente ved sekretariatet'], '§ 39.3.2'),
        ],
      },
      {
        id: 'b7s4', title: 'IRS og andre endringer i 2026',
        items: [
          mc('Hva er IRS?', ['Avspilling av videopptak (Instant Replay System) som dommerne kan bruke', 'Et nytt skuddklokkesystem', 'Et system for lagfouls', 'Dommerens fløyte'], 'IRS brukes til å kontrollere bestemte situasjoner på video.'),
          mc('Hvilken ny situasjon kan dommerne nå kontrollere med IRS når som helst i kampen (2026)?', ['Om det skjedde ulovlig ballberøring eller ulovlig påvirkning etter at en foul ble begått', 'Hvem som vant hoppballen', 'Om en spiller har riktig sokkefarge', 'Hvem som skal ta innkast'], 'Det gjør det mulig å rette feil som direkte påvirker poengene.'),
          mc('Hva kan dommerne kontrollere med IRS i de siste 2 minuttene av 4. periode og i forlengning (nytt i 2026)?', ['Om ballen fortsatt var i hånden til innkasteren da forsvaret fouler ved et innkast', 'Om tilskuerne oppførte seg', 'Hvor mange time-outs som er brukt', 'Om ballen var for lett'], 'Det avgjør om det er en innkastfoul.'),
          tf('Fra 2026 kan banelinjer ha flere farger, men alle grenselinjer må ha samme farge.', true, 'FIBA ga mer fleksibilitet i linjefarger, men visse linjer må fortsatt matche.'),
          match([['Disruptive', 'Usportslig kategori 2'], ['Flagrant', 'Usportslig kategori 1'], ['IRS', 'Videoavspilling'], ['Lagleder', 'Hovedtrener']], 'Koble begrepet med betydningen'),
        ],
      },
    ],
  };

  // ================================================================
  // ENHET 8 – STRAFFEKAST, BALLBERØRING OG DOMMERE
  // ================================================================
  const b8 = {
    id: 'b8',
    title: 'Straffekast og ballberøring',
    color: '#ff86d0', dark: '#cc6ba6',
    goal: 'Kunne reglene for straffekast, ulovlig ballberøring og ulovlig påvirkning, og kjenne rollene til dommerne og sekretariatet (§ 31, 44, 46–51).',
    guide: [
      ['Straffekast (§ 44)', 'Skytteren står bak straffekastlinjen og innenfor halvsirkelen.\nBallen må slippes innen 5 sekunder.\nSkytteren kan ikke berøre straffekastlinjen eller gå inn i 3-sekundersområdet før ballen har gått i kurven eller truffet ringen. Det er ikke lov å finte.\nOppstillingsplassene langs feltet er 1 m dype, og lagene står annenhver.\nAndre spillere står bak straffekastlinjens forlengelse og utenfor 3-poengslinjen.'],
      ['Ulovlig ballberøring (§ 31)', 'Goaltending: å berøre ballen når den er helt over ringens nivå og på vei ned mot kurven, eller etter at den har truffet platen.\nForsvarer: angrepslaget får 1, 2 eller 3 poeng som om ballen gikk i.\nAngriper: ingen poeng, motstanderne får innkast.\nUlovlig påvirkning: f.eks. berøre kurven eller platen mens ballen er på ringen, eller føre hånden opp gjennom kurven nedenfra.'],
      ['Dommere og sekretariat', 'Kampen ledes av dommerne (førstedommeren har siste ord), sekretariatet og eventuelt en kommissær (eller teknisk delegat).\nSekretariatet består av sekretær, assisterende sekretær, tidtaker og skuddklokkeoperatør.\nLaglederen er lagets hovedtrener.'],
    ],
    skills: [
      {
        id: 'b8s1', title: 'Straffekast',
        items: [
          mc('Hvor lang tid har skytteren på seg ved et straffekast?', ['5 sekunder', '10 sekunder', '3 sekunder', '8 sekunder'], 'Ballen må slippes innen 5 sekunder etter at dommeren har stilt den til disposisjon.'),
          tf('Straffekastskytteren kan tråkke på straffekastlinjen idet ballen slippes, så lenge ballen går i.', false, 'Skytteren kan ikke berøre linjen eller gå inn i feltet før ballen har gått i kurven eller truffet ringen.'),
          tf('Det er lov å finte et straffekast.', false, 'Skytteren skal ikke finte.'),
          mc('Hvor dype er oppstillingsplassene langs 3-sekundersområdet under straffekast?', ['1 m', '2 m', '50 cm', '1,80 m'], 'Feltene regnes som 1 m dype.'),
          mc('Hvor skal spillere som ikke står i oppstillingsplassene, stå under et straffekast?', ['Bak straffekastlinjens forlengelse og utenfor 3-poengslinjen', 'Hvor som helst', 'Ved midtlinjen', 'På benken'], 'De må holde seg der til straffekastet er avsluttet.'),
          mc('Hvem tar straffekastene etter en teknisk foul?', ['En hvilken som helst spiller på banen som laglederen utpeker', 'Spilleren som ble foulet', 'Kapteinen', 'Lagets beste skytter, bestemt av dommeren'], 'Ved teknisk foul kan laglederen velge skytter.'),
        ],
      },
      {
        id: 'b8s2', title: 'Ulovlig ballberøring og påvirkning',
        items: [
          mc('Når er det ulovlig ballberøring (goaltending) på et skudd?', ['Når en spiller berører ballen mens den er helt over ringens nivå og på vei ned, eller etter at den har truffet platen', 'Når ballen berøres på vei opp', 'Når ballen berøres under ringens nivå', 'Når ballen er på ringen'], 'Reglene gjelder til ballen har berørt ringen eller ikke lenger kan gå i.'),
          mc('En forsvarer begår goaltending på et 3-poengsskudd. Hva skjer?', ['Angrepslaget får 3 poeng', 'Angrepslaget får 2 poeng', 'Skuddet tas om', 'Det blir hoppball'], 'Poeng gis som om ballen hadde gått i kurven.'),
          mc('En angrepsspiller begår goaltending på lagkameratens skudd, og ballen går i. Hva skjer?', ['Ingen poeng, og motstanderne får innkast fra straffekastlinjens forlengelse', '2 poeng', 'Hoppball', 'Teknisk foul'], 'Overtredelse av angriper gir ingen poeng.'),
          tf('Det er ulovlig påvirkning når en spiller berører kurven eller platen mens ballen er i kontakt med ringen etter et skuddforsøk.', true, '§ 31.2.4'),
          tf('Det er ulovlig å føre hånden gjennom kurven nedenfra og berøre ballen.', true, 'Det er ulovlig påvirkning.'),
          num(() => { const p = pick([['straffekast', 1], ['skudd fra 2-poengsområdet', 2], ['skudd fra 3-poengsområdet', 3]]); return { q: `En forsvarer berører ballen ulovlig på vei ned mot kurven på et ${p[0]}. Hvor mange poeng får angrepslaget?`, a: p[1], u: 'poeng', e: `Poeng gis som om ballen gikk i: ${p[1]}.${p[1] === 1 ? ' På et siste straffekast får forsvareren i tillegg en teknisk foul kategori 2.' : ''}`, tol: 0 }; }),
        ],
      },
      {
        id: 'b8s3', title: 'Dommere og sekretariat',
        items: [
          mc('Hvem leder kampen etter FIBA-reglene?', ['Dommerne, sekretariatet og en kommissær hvis til stede', 'Bare førstedommeren', 'Laglederne', 'Kapteinene'], '§ 1.1. Fra 2026 gjelder alt om kommissæren også en teknisk delegat.'),
          match([['Tidtaker', 'Kampklokken'], ['Skuddklokkeoperatør', 'Skuddklokken'], ['Sekretær', 'Kampskjemaet'], ['Førstedommer', 'Siste ord']], 'Koble rollen med oppgaven'),
          mc('Hva betyr «lagleder» i de norske spillereglene?', ['Lagets hovedtrener', 'Lagets kaptein', 'Lagets manager utenfor banen', 'Dommeren'], 'Lagleder tilsvarer «head coach» i de engelske reglene.'),
          tf('Fra 2026 gjelder alt reglene sier om «kommissær» også for en «teknisk delegat».', true, 'Dette ble presisert i § 1.1 i 2026.'),
        ],
      },
    ],
  };

  // ---------- ordliste ----------
  const W = (w) => `(?<![\\p{L}\\p{N}])[${w[0].toUpperCase()}${w[0]}]${w.slice(1)}\\p{L}*`;
  const glossary = [
    ['Angrepsfelt', W('angrepsfelt'), 'Banehalvdelen der motstandernes kurv er. Midtlinjen er ikke en del av angrepsfeltet.'],
    ['Forsvarsfelt', W('forsvarsfelt'), 'Banehalvdelen der lagets egen kurv er, inkludert midtlinjen.'],
    ['Innkast', W('innkast'), 'Ballen sentres inn på banen av en spiller som står utenfor. Spilleren har 5 sekunder.'],
    ['Hoppball', W('hoppball'), 'Dommeren kaster ballen opp mellom to motspillere. Brukes bare ved kampstart, ellers vekslende ballbesittelse.'],
    ['Vekslende ballbesittelse', W('vekslende ballbesittelse'), 'Lagene får innkast annenhver gang i hoppballsituasjoner. Pilen viser hvem som står for tur.'],
    ['Holdt ball', W('holdt ball'), 'Spillere fra begge lag holder ballen så fast at ingen får kontroll uten overdreven kraft.'],
    ['Skuddklokke', W('skuddklokke'), 'Viser hvor lang tid laget har igjen til å skyte: 24 sekunder, eller 14 i noen situasjoner.'],
    ['Kampklokke', W('kampklokke'), 'Den offisielle klokka som viser spilletiden.'],
    ['Skuddbevegelse', W('skuddbevegelse'), 'Tiden fra skuddet starter (skuldre og ball oppover, eller samling av ballen på en drive) til ballen har forlatt hånden og spilleren har landet.'],
    ['Lagfoul', W('lagfoul'), 'Alle personlige, tekniske, usportslige og diskvalifiserende fouls av en spiller. Etter 4 i en periode gis det straffekast.'],
    ['Bestrafningsgrense', W('bestrafningsgrense'), 'Nås etter 4 lagfouls i en periode. Deretter gir personlige fouls 2 straffekast.'],
    ['Personlig foul', W('personlig foul'), 'Ulovlig kontakt med en motspiller, med eller uten ball.'],
    ['Teknisk foul', W('teknisk foul'), 'Foul uten (eller med lett) kontakt knyttet til oppførsel eller administrative brudd. Kategori 1 teller mot bortvisning, kategori 2 ikke.'],
    ['Usportslig foul', W('usportslig foul'), 'Kategori 1 (flagrant): farlig eller ikke legitim kontakt, teller mot bortvisning. Kategori 2 (disruptive): stopper spillflyten, teller ikke.'],
    ['Disruptive', W('disruptive'), 'Engelsk navn på usportslig foul kategori 2. Stopper spillflyten, men teller ikke mot bortvisning.'],
    ['Flagrant', W('flagrant'), 'Engelsk navn på usportslig foul kategori 1. Teller mot bortvisning.'],
    ['Diskvalifiserende foul', W('diskvalifiserende'), 'Grovt usportslig handling. Personen må forlate kampen.'],
    ['Bortvisning', W('bortvis'), 'Å bli diskvalifisert for resten av kampen.'],
    ['Dobbelfoul', W('dobbelfoul'), 'To motspillere fouler hverandre omtrent samtidig. Ingen straffekast.'],
    ['Innkastfoul', W('innkastfoul'), 'Foul av forsvaret mens ballen er ute for innkast i de siste 2 minuttene. Straff: 1 straffekast og innkast.'],
    ['Straffekast', W('straffekast'), 'Uhindret skudd fra straffekastlinjen som gir 1 poeng.'],
    ['Skrittfeil', W('skrittfeil'), 'Ulovlig bevegelse med føttene mens man holder ballen, f.eks. tre skritt.'],
    ['Pivoteringsfot', W('pivoteringsfot'), 'Foten som holdes i ro når en spiller med ballen vrir seg på den andre.'],
    ['Dribling', W('dribl'), 'Å sprette, rulle eller kaste ballen i gulvet mens man har kontroll over den.'],
    ['Tett oppdekket', W('tett oppdekket'), 'En forsvarer står i aktiv, lovlig posisjon innen 1 m. Spilleren med ball har da 5 sekunder.'],
    ['3-sekundersområdet', '3-sekunders\\p{L}*', 'Feltet under kurven. Angripere kan ikke stå der mer enn 3 sammenhengende sekunder.'],
    ['Tilbakespill', W('tilbakespill'), 'Laget spiller ballen fra angrepsfeltet tilbake til forsvarsfeltet sitt og berører den der. Overtredelse.'],
    ['Overtredelse', W('overtredelse'), 'Brudd på reglene uten foul, f.eks. skrittfeil. Straff: innkast til motstanderne.'],
    ['Sylinderprinsippet', W('sylinder'), 'Hver spiller har rett til rommet i en tenkt sylinder rundt seg.'],
    ['Vertikalitetsprinsippet', W('vertikalitet'), 'Den som forlater sin vertikale posisjon og lager kontakt, er ansvarlig for kontakten.'],
    ['Lovlig forsvarsposisjon', W('lovlig forsvarsposisjon'), 'Forsvareren står vendt mot motspilleren med begge føttene på gulvet.'],
    ['Charging', W('charging'), 'Offensiv foul der angriperen løper inn i en forsvarer som har lovlig posisjon.'],
    ['Ulovlig ballberøring', W('ulovlig ballberøring'), '«Goaltending»: å berøre ballen over ringens nivå på vei ned mot kurven, eller etter at den har truffet platen.'],
    ['Ulovlig påvirkning', W('ulovlig påvirkning'), 'F.eks. å berøre kurven eller platen mens ballen er på ringen.'],
    ['Goaltending', W('goaltending'), 'Ulovlig ballberøring på et skudd på vei ned mot kurven.'],
    ['Lagleder', W('lagleder'), 'Lagets hovedtrener («head coach»).'],
    ['Sekretariat', W('sekretariat'), 'Sekretær, assisterende sekretær, tidtaker og skuddklokkeoperatør.'],
    ['Førstedommer', W('førstedommer'), 'Dommeren med det overordnede ansvaret i kampen.'],
    ['Kommissær', W('kommissær'), 'Representant for arrangøren som overvåker kampen. Gjelder også teknisk delegat.'],
    ['IRS', 'IRS', 'Instant Replay System: avspilling av videopptak for å kontrollere bestemte situasjoner.'],
    ['Forlengning', W('forlengning'), 'Ekstra periode på 5 minutter når det står uavgjort etter 4. periode.'],
    ['Time-out', '[Tt]ime-out\\p{L}*', 'Pause på 1 minutt som laglederen kan be om.'],
  ].map(([t, m, d]) => ({ t, m, d }));

  window.BASKET = {
    id: 'basket',
    title: 'Basketballregler 2026',
    short: 'Basket',
    icon: 'ball',
    goalLabel: 'Hva du lærer',
    glossary,
    units: [b1, b2, b3, b4, b5, b6, b7, b8],
  };
})();
