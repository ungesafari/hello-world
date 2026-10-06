/* Basketballregler (FIBA 2026) – kursinnhold.
 *
 * Kilde: Norges Basketballforbund, «Offisielle spilleregler for basketball 2026»
 * (oversettelse av FIBA Official Basketball Rules 2026), og FIBAs oppsummering
 * av regelendringene som gjelder fra 1. oktober 2026.
 *
 * Rekkefølgen er lagt opp praktisk for spillere: først det du møter i hver
 * angrepsrunde (poeng, dribling, skritt, ball ut), så fouls, tidsregler og
 * kampsituasjoner, deretter detaljer og nye 2026-regler. Banens mål kommer sist.
 *
 * Samme oppgavetyper som i Fysikk 1 (se course-fysikk1.js). intro: nye begreper
 * som vises som kort i første leksjon av hver ferdighet.
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
  // ENHET 1 – GRUNNLEGGENDE SPILL
  // ================================================================
  const k1 = {
    id: 'k1',
    title: 'Grunnleggende spill',
    color: '#58cc02', dark: '#58a700',
    goal: 'Det du trenger i hver angrepsrunde: hvordan du scorer, hvordan du dribler og flytter føttene lovlig, og hva som skjer når ballen går ut (§ 13, 16, 23–25).',
    guide: [
      ['Poeng (§ 16)', 'Straffekast: 1 poeng. Fra 2-poengsområdet: 2 poeng. Fra 3-poengsområdet: 3 poeng.\n3-poengslinjen er ikke en del av 3-poengsområdet. Tråkker du på linja, gir skuddet 2 poeng.\nScorer du ved et uhell i egen kurv, får motstanderne 2 poeng.'],
      ['Dribling (§ 24)', 'Du dribler ved å sprette, rulle eller kaste ballen i gulvet med én hånd om gangen.\nDriblingen slutter når du tar ballen med begge hender eller lar den hvile i hånden.\nDu kan ikke drible på nytt etter at driblingen er slutt (dobbeldribling).\nDu kan ikke ha hånden under ballen og bære den.'],
      ['Skrittfeil (§ 25)', 'Med ballen i bevegelse kan du ta to skritt for å stoppe, sentre eller skyte.\nStår du stille, er den ene foten pivoteringsfot og må bli på samme sted.\nFor å starte en dribling må ballen slippes før det andre skrittet.'],
      ['Ball utenfor (§ 23)', 'Linjene er utenfor banen.\nBallen er ute når den berører gulvet på eller utenfor linjen, eller en spiller som står utenfor.\nLaget som ikke sist berørte ballen, får innkast.'],
      ['Overtredelser', 'Skrittfeil, dobbeldribling, ball ut og sparket ball med vilje er overtredelser.\nStraff: innkast til motstanderne nærmest stedet.'],
    ],
    skills: [
      {
        id: 'k1s1', title: 'Poeng og scoring',
        intro: [['1 – 2 – 3', 'Verdien av en kurv', 'Straffekast gir 1, skudd innenfor 3-poengslinjen 2, og skudd utenfor 3.', 'b'], ['3-poengslinjen', 'Grensen for 3 poeng', 'Linja hører til 2-poengsområdet. Foten må være bak linja.', 'b'], ['Egen kurv', 'Uhell gir motstanderne 2', 'Scorer du ved et uhell i egen kurv, får motstanderne 2 poeng.', 'b']],
        items: [
          match([['Straffekast', '1 poeng'], ['Skudd innenfor 3-poengslinjen', '2 poeng'], ['Skudd utenfor 3-poengslinjen', '3 poeng'], ['Uhell i egen kurv', '2 poeng til motstanderne']]),
          tf('En spiller som står med foten på 3-poengslinjen og scorer, får 3 poeng.', false, '3-poengslinjen er ikke en del av 3-poengsområdet, så scoringen gir 2 poeng.'),
          mc('Når er et mål gyldig?', ['Når en levende ball går ned i kurven ovenfra og blir i den eller går gjennom den', 'Når ballen går gjennom kurven, enten den kommer inn ovenfra eller nedenfra', 'Når en levende ball går ned i kurven ovenfra, men bare hvis den ikke har truffet ringen', 'Når ballen går ned i kurven ovenfra, også etter at dommeren har blåst og ballen er død'], 'Etter § 16.1.1 er det mål når en levende ball går ned i kurven ovenfra og blir i den eller går gjennom. Det spiller ingen rolle om ballen har truffet ringen eller platen først. En ball som kommer inn nedenfra, eller som er død fordi dommeren har blåst, gir ikke mål.'),
          mc('En spiller scorer ved et uhell i sitt eget lags kurv. Hva skjer?', ['Målet gir 2 poeng til motstanderne og føres på kapteinen deres på banen', 'Målet gir 2 poeng til motstanderne og føres på spilleren som scoret', 'Målet teller ikke, og motstanderne får innkast fra endelinjen', 'Målet gir 2 poeng til spillerens eget lag og føres på spilleren'], 'Et uhell i egen kurv gir alltid 2 poeng til motstanderne. Poengene føres på kapteinen deres som er på banen, siden ingen av dem scoret.'),
          mc('En spiller scorer med vilje i sitt eget lags kurv. Hva skjer?', ['Det er en overtredelse, og målet teller ikke', 'Det er lovlig, og målet gir 2 poeng til motstanderne', 'Det er en teknisk foul, og målet gir 2 poeng til motstanderne', 'Det er en usportslig foul, og målet teller ikke'], 'Å score med vilje i egen kurv er en overtredelse (ikke en foul), så målet teller ikke, og motstanderne får innkast. Forskjellen fra et uhell er altså stor: et uhell gir 2 poeng til motstanderne.'),
          tf('Det er en overtredelse å få ballen til å gå opp gjennom kurven nedenfra.', true, '§ 16.2.4'),
          num(() => { const a = pick([[2, 3, 1], [4, 2, 3], [5, 1, 2]]); return { q: `Et lag scorer ${a[0]} straffekast, ${a[1]} topoengere og ${a[2]} trepoengere. Hvor mange poeng blir det?`, a: a[0] + 2 * a[1] + 3 * a[2], u: 'poeng', e: `${a[0]}·1 + ${a[1]}·2 + ${a[2]}·3 = ${a[0] + 2 * a[1] + 3 * a[2]}`, tol: 0 }; }),
        ],
      },
      {
        id: 'k1s2', title: 'Dribling',
        intro: [['Dribling', 'Sprett ballen i gulvet', 'Du kan bevege deg med ballen så lenge du dribler med én hånd om gangen.', 'b'], ['Dobbeldribling', 'Drible på nytt etter stopp', 'Når du har tatt ballen med begge hender, kan du ikke drible igjen.', 'b'], ['Bæring', 'Hånden under ballen', 'Du kan ikke legge hånden under ballen, bære den og så fortsette å drible.', 'b']],
        items: [
          mc('Når er en dribling avsluttet?', ['Når spilleren tar ballen med begge hender samtidig eller lar den hvile i hånden', 'Når spilleren lar ballen hvile i hånden, men ikke når spilleren tar den med begge hender', 'Når spilleren bytter hånd eller slutter å bevege seg mens ballen spretter', 'Når spilleren har tatt to skritt etter å ha sprettet ballen siste gang'], 'Driblingen er over når spilleren tar ballen med begge hender samtidig, eller lar den hvile i én eller begge hender. Å bytte hånd eller stå stille mens ballen spretter er fortsatt dribling. Skritt handler om fotarbeid og er en egen regel. Etter at driblingen er avsluttet, kan spilleren ikke drible igjen.'),
          mc('Hva er dobbeldribling?', ['Å drible på nytt etter at driblingen er avsluttet', 'Å drible videre etter å ha byttet hånd underveis', 'Å sprette ballen to ganger på rad med samme hånd', 'Å drible videre etter at en motspiller har berørt ballen'], 'Dobbeldribling er en overtredelse. Å bytte hånd eller sprette ballen flere ganger med samme hånd er vanlig dribling. Har en motspiller berørt ballen, får spilleren lov til å drible på nytt.'),
          mc('Hva er ikke lov under en dribling?', ['Å ha hånden under ballen, bære den og så fortsette å drible', 'Å bytte hånd bak ryggen eller mellom beina og fortsette å drible', 'Å stoppe opp og stå stille mens ballen fortsatt spretter', 'Å drible lavt, med ballen under kneet, for å beskytte den'], 'Lar spilleren ballen hvile i hånden, for eksempel ved å ha hånden under den, er driblingen avsluttet. Å fortsette etterpå er dobbeldribling. Spilleren kan ikke «pause» driblingen og fortsette.'),
          tf('Det er lov å drible med begge hender samtidig.', false, 'Berører du ballen med begge hender samtidig, er driblingen slutt.'),
          tf('Mens ballen er i lufta under en dribling, er det ingen grense for hvor mange skritt du kan ta.', true, '§ 24.1.2: Begrensningen på skritt gjelder bare når du holder ballen.'),
          tf('Det er en overtredelse å berøre ballen tilfeldig med beinet.', false, 'Bare det å sparke eller blokkere ballen med beinet med vilje er en overtredelse.'),
          mc('Hva er straffen for dobbeldribling?', ['Motstanderne får innkast nærmest stedet', 'Motstanderne får innkast fra midtlinjen', 'Motstanderne får 1 straffekast og innkast', 'Spilleren får en foul, og laget mister ballen'], 'Dobbeldribling er en overtredelse, ikke en foul. Overtredelser straffes med innkast til motstanderne nærmest stedet der den skjedde, men ikke rett bak platen.'),
        ],
      },
      {
        id: 'k1s3', title: 'Skrittfeil – det grunnleggende',
        intro: [['Skrittfeil', 'For mange skritt med ballen', 'Ulovlig bevegelse med føttene mens du holder ballen.', 'b'], ['To skritt', 'Etter mottak i fart', 'I bevegelse kan du ta to skritt for å stoppe, sentre eller skyte.', 'b'], ['Pivoteringsfot', 'Foten som står i ro', 'Når du står med ballen, kan du vri deg rundt på den ene foten.', 'b']],
        items: [
          mc('En spiller mottar ballen i full fart. Hvor mange skritt kan spilleren ta for å stoppe, sentre eller skyte?', ['To', 'Ett', 'Tre', 'Så mange som nødvendig'], 'En spiller i bevegelse eller som avslutter en dribling, kan ta to skritt.'),
          tf('For å starte en dribling må spilleren slippe ballen før det andre skrittet.', true, 'Ellers er det skrittfeil.'),
          mc('Hva er en pivoteringsfot?', ['Foten som holdes på samme sted mens spilleren tråkker med den andre', 'Foten spilleren lander på sist når spilleren stopper med ballen', 'Foten som er nærmest kurven når spilleren tar imot ballen', 'Foten spilleren hopper fra når spilleren skyter eller sentrer'], 'Pivotering er lovlig så lenge pivoteringsfoten holdes på samme sted. Lander spilleren på én fot og så den andre, er det den første foten som blir pivoteringsfot, ikke den siste.'),
          tf('En spiller som står stille med ballen, kan løfte pivoteringsfoten før ballen har forlatt hånden i starten av en dribling.', false, 'Pivoteringsfoten kan ikke løftes for å starte en dribling før ballen har forlatt hånden.'),
          tf('En spiller som faller med ballen og sklir bortover gulvet, har gjort skrittfeil.', false, 'Det er lov å falle og skli med ballen. Det er skrittfeil å rulle eller reise seg mens man holder ballen.'),
          mc('Hva er straffen for skrittfeil?', ['Motstanderne får innkast nærmest stedet, men ikke rett bak platen', 'Motstanderne får innkast fra midtlinjens forlengelse ved sidelinjen', 'Motstanderne får 1 straffekast og deretter innkast fra sidelinjen', 'Spilleren får en personlig foul, og motstanderne får innkast'], 'Skrittfeil er en overtredelse, ikke en foul. Motstanderne får innkast nærmest stedet der overtredelsen skjedde, men aldri rett bak platen.'),
        ],
      },
      {
        id: 'k1s4', title: 'Ball utenfor banen',
        intro: [['Grenselinjene', 'Sidelinjer og endelinjer', 'Linjene er utenfor banen.', 'b'], ['Sist berørt', 'Den som sendte ballen ut', 'Laget til spilleren som sist berørte ballen, mister den.', 'b'], ['Innkast', 'Ballen settes i spill', 'Motstanderne tar innkast fra stedet der ballen gikk ut.', 'b']],
        items: [
          mc('Hvem har sendt ballen utenfor banen?', ['Spilleren som sist berørte, eller ble berørt av, ballen før den gikk ut', 'Spilleren som sist hadde kontroll over ballen før den gikk ut', 'Spilleren som var nærmest linjen da ballen gikk ut', 'Laget som angrep da ballen gikk ut, uansett hvem som berørte den'], 'Det er siste berøring som teller, ikke kontroll. Sprettes ballen i en motspiller og går ut, er det motspilleren som har sendt den ut. Motstanderne til det laget får innkast.'),
          tf('En spiller som står med hælen på sidelinjen og tar imot ballen, er fortsatt inne på banen.', false, 'Linjene er utenfor banen. Berører spilleren linjen, er spilleren ute, og motstanderne får innkast.'),
          mc('Ballen treffer baksiden av platen. Hva skjer?', ['Ballen er ute, og motstanderne til laget som sist berørte den får innkast', 'Spillet fortsetter, fordi platen er en del av spilleområdet', 'Det blir en hoppballsituasjon, og laget med pilen får innkast', 'Spillet fortsetter hvis ballen etterpå går ned i kurven'], 'Baksiden av platen og kurvstativet regnes som utenfor banen. Forsiden av platen er i spill.'),
          tf('En spiller i lufta over sidelinjen kan redde ballen tilbake inn på banen, hvis spilleren hoppet fra innsiden.', true, 'Spilleren er ikke utenfor før kroppen berører gulvet på eller utenfor linjen.'),
          mc('En angriper sender ballen ut over sidelinjen. Hva skjer?', ['Forsvarslaget får innkast fra stedet der ballen gikk ut', 'Forsvarslaget får innkast fra midtlinjens forlengelse', 'Angrepslaget får innkast fra stedet der ballen gikk ut', 'Forsvarslaget får innkast fra endelinjen bak egen kurv'], 'Laget som ikke sist berørte ballen, får innkast nærmest stedet der den gikk ut.'),
        ],
      },
    ],
  };

  // ================================================================
  // ENHET 2 – KAMPENS GANG
  // ================================================================
  const k2 = {
    id: 'k2',
    title: 'Kampens gang',
    color: '#1cb0f6', dark: '#1899d6',
    goal: 'Hvordan en kamp er bygd opp: spilletid, start av perioder, innkast, time-out og innbytte (§ 4, 8, 9, 17–19).',
    guide: [
      ['Spilletid (§ 8)', '4 perioder à 10 minutter. 2 minutters pause mellom 1.–2. og 3.–4. periode og før forlengning. Halvtid: 15 minutter.\nUavgjort etter 4. periode: forlengninger på 5 minutter.\nEt lag har høyst 12 spilleberettigede lagmedlemmer, og 5 på banen.'],
      ['Start av perioder', '1. periode starter med hoppball i midtsirkelen.\nAndre perioder og forlengninger starter med innkast fra midtlinjens forlengelse, på motsatt side av sekretariatet.'],
      ['Innkast (§ 17)', 'Innkasteren har 5 sekunder og kan flytte seg høyst 1 m sidelengs.\nBallen kan ikke kastes direkte i kurven.\nEtter scoring: innkast fra hvor som helst bak endelinjen.'],
      ['Time-out (§ 18)', '1 minutt. 2 i første omgang, 3 i andre (høyst 2 av dem i de siste 2 minuttene av 4. periode), 1 per forlengning.\nBare laglederen eller første assisterende lagleder kan be om time-out.'],
      ['Innbytte (§ 19)', 'Innbytteren selv ber om innbytte ved sekretariatet.\nEn spiller med fem fouls må byttes ut innen 30 sekunder.'],
    ],
    skills: [
      {
        id: 'k2s1', title: 'Spilletid og kampstart',
        intro: [['4 × 10 min', 'Spilletid', 'En kamp har fire perioder på ti minutter.', 'b'], ['Forlengning', '5 minutter ekstra', 'Brukes når det står likt etter 4. periode.', 'b'], ['Hoppball', 'Starter kampen', 'Dommeren kaster ballen opp mellom to motspillere i midtsirkelen.', 'b']],
        items: [
          mc('Hvordan er spilletiden i en FIBA-kamp?', ['4 perioder à 10 minutter', '2 omganger à 20 minutter', '4 perioder à 12 minutter', '4 perioder à 8 minutter'], 'Kampen består av 4 perioder på 10 minutter.'),
          mc('Hvor lang er halvtidspausen?', ['15 minutter', '10 minutter', '20 minutter', '5 minutter'], 'Halvtidspausen er 15 minutter. Pausene mellom 1.–2. og 3.–4. periode er 2 minutter.'),
          mc('Hvor lang er en forlengningsperiode?', ['5 minutter', '3 minutter', '10 minutter', '2 minutter'], 'Det spilles så mange forlengninger på 5 minutter som trengs for å få en vinner.'),
          tf('I forlengning bytter lagene banehalvdel, slik de gjør i pausen.', false, 'Lagene bytter ikke banehalvdel før forlengningsperiodene. De spiller mot samme kurver som i 4. periode.'),
          mc('Hvordan starter 2., 3. og 4. periode?', ['Med innkast fra midtlinjens forlengelse, motsatt side av sekretariatet', 'Med innkast fra midtlinjens forlengelse, på samme side som sekretariatet', 'Med hoppball i midtsirkelen, akkurat som ved kampstart', 'Med innkast fra endelinjen bak kurven laget forsvarer'], 'Laget som har pilen for vekslende ballbesittelse, tar innkastet fra midtlinjens forlengelse på motsatt side av sekretariatet. Hoppball brukes bare ved kampstart.'),
          mc('Hvor mange spilleberettigede lagmedlemmer kan et lag høyst ha i en kamp?', ['12', '10', '15', '14'], 'Høyst 12 spilleberettigede lagmedlemmer, inkludert en kaptein.'),
          mc('Hvor mange spillere må et lag ha klare for at kampen skal kunne starte?', ['5', '4', '3', '2'], 'Kampen kan ikke starte hvis ett eller begge lag ikke har fem spillere klare.'),
          match([['Periode', '10 min'], ['Forlengning', '5 min'], ['Halvtid', '15 min'], ['Pause mellom perioder', '2 min']]),
          num(() => ({ q: 'Hvor mange minutter varer ordinær spilletid totalt (uten forlengning)?', a: 40, u: 'min', e: '4 perioder × 10 minutter = 40 minutter.', tol: 0 })),
        ],
      },
      {
        id: 'k2s2', title: 'Innkast',
        intro: [['5 sekunder', 'Tid på innkastet', 'Innkasteren må slippe ballen innen 5 sekunder.', 'b'], ['1 meter', 'Sidelengs bevegelse', 'Innkasteren kan flytte seg høyst 1 m sidelengs til sammen.', 'b'], ['Endelinjen', 'Innkast etter scoring', 'Etter scoring kan innkasteren bevege seg langs hele endelinjen.', 'b']],
        items: [
          mc('Hvor lang tid har en spiller på seg til å slippe ballen ved et innkast?', ['5 sekunder', '3 sekunder', '8 sekunder', '10 sekunder'], 'Innkasteren har 5 sekunder på seg.'),
          mc('Hvor langt sidelengs kan innkasteren bevege seg før ballen slippes?', ['Til sammen høyst 1 m', 'Fritt langs hele linjen', '2 m i hver retning', 'Ingenting'], 'Bakover kan spilleren gå så langt forholdene tillater, men sidelengs høyst 1 m til sammen.'),
          tf('Etter at laget har sluppet inn en kurv, kan innkasteren bevege seg langs endelinjen og sentre til en medspiller som også står bak linjen.', true, 'Etter et vellykket mål tas innkastet fra hvor som helst bak endelinjen.'),
          tf('Innkasteren kan kaste ballen direkte i kurven og få poeng.', false, 'Det er en overtredelse å forårsake at ballen går direkte i kurven fra et innkast.'),
          tf('En forsvarer kan strekke armene over grenselinjen for å blokkere innkastet.', false, 'Andre spillere kan ikke ha noen kroppsdel over grenselinjen før ballen er kastet inn.'),
          tf('Innkasteren kan selv berøre ballen igjen inne på banen før en annen spiller har berørt den.', false, 'Ballen må berøre en annen spiller først.'),
        ],
      },
      {
        id: 'k2s3', title: 'Time-out og innbytte',
        intro: [['Time-out', '1 minutts pause', 'Laglederen ber om time-out ved sekretariatet.', 'b'], ['2 + 3', 'Time-outs per omgang', '2 i første omgang og 3 i andre omgang.', 'b'], ['Innbytte', 'Bytte spiller', 'Innbytteren selv ber om innbytte.', 'b']],
        items: [
          mc('Hvor mange time-outs får et lag i andre omgang?', ['3, men høyst 2 når klokka viser 2:00 eller mindre i 4. periode', '3, men høyst 1 når klokka viser 2:00 eller mindre i 4. periode', '2, men høyst 1 når klokka viser 2:00 eller mindre i 4. periode', '3, og alle kan brukes når som helst i omgangen'], 'Første omgang: 2 time-outs. Andre omgang: 3, men høyst 2 av dem når klokka viser 2:00 eller mindre i 4. periode. Ubrukte time-outs kan ikke tas med videre.'),
          mc('Hvor lenge varer en time-out?', ['1 minutt', '30 sekunder', '2 minutter', '90 sekunder'], 'Hver time-out skal vare 1 minutt.'),
          tf('En ubrukt time-out fra første omgang kan spares til andre omgang.', false, 'Ubrukte time-outs kan ikke overføres til neste omgang eller forlengning.'),
          mc('Hvem kan be om time-out?', ['Laglederen eller første assisterende lagleder', 'Laglederen eller kapteinen på banen', 'Kapteinen eller spilleren med ballen', 'Hvilken som helst spiller eller laglederen'], 'Bare laglederen eller første assisterende lagleder kan be om time-out. Spillerne, også kapteinen, kan ikke det.'),
          mc('Hvem ber om innbytte?', ['Innbytteren selv', 'Laglederen', 'Kapteinen på banen', 'Spilleren som skal ut'], 'Innbytteren går til sekretariatet og ber om innbytte, eller setter seg på innbytterbenken.'),
          mc('Hvor lang tid har laget på å bytte ut en spiller som har fått fem fouls?', ['30 sekunder', '1 minutt', '10 sekunder', 'Til neste time-out'], 'Spilleren må byttes ut umiddelbart, innen maksimalt 30 sekunder.'),
          tf('En spiller som får behandling av lagets helsepersonell på banen, må byttes ut.', true, 'Unntaket er hvis laget da får færre enn fem spillere på banen.'),
          num(() => ({ q: 'Hvor mange time-outs kan et lag til sammen bruke i ordinær spilletid (uten forlengning)?', a: 5, u: 'time-outs', e: '2 i første omgang + 3 i andre omgang = 5.', tol: 0 })),
        ],
      },
    ],
  };

  // ================================================================
  // ENHET 3 – FOULS OG STRAFFEKAST
  // ================================================================
  const k3 = {
    id: 'k3',
    title: 'Fouls og straffekast',
    color: '#ff4b4b', dark: '#ea2b2b',
    goal: 'Hva som er lovlig og ulovlig kontakt, hvordan personlige fouls straffes, og hvordan straffekast tas (§ 33, 34, 41, 44).',
    guide: [
      ['Kontakt (§ 33)', 'Sylinderprinsippet: Hver spiller har rett til rommet i en tenkt sylinder rundt seg.\nVertikalitetsprinsippet: Den som forlater sin vertikale posisjon og lager kontakt, er ansvarlig.\nLovlig forsvarsposisjon: vendt mot motspilleren med begge føttene på gulvet.'],
      ['Personlig foul (§ 34)', 'Ikke i skuddbevegelse: innkast (eller 2 straffekast hvis laget har 4 lagfouls i perioden).\nI skuddbevegelse: scoring teller + 1 straffekast. Bom fra 2-poengsområdet gir 2, fra 3-poengsområdet 3.\n5 fouls: spilleren må ut.'],
      ['Straffekast (§ 44)', 'Bak straffekastlinjen og innenfor halvsirkelen. 5 sekunder.\nIkke tråkk på linjen før ballen har truffet ringen. Ikke lov å finte.\nOppstillingsplassene langs feltet er 1 m dype.'],
    ],
    skills: [
      {
        id: 'k3s1', title: 'Lovlig og ulovlig kontakt',
        intro: [['Sylinder', 'Ditt eget rom', 'Hver spiller har rett til rommet i en tenkt sylinder rundt seg.', 'b'], ['Vertikalitet', 'Hopp rett opp', 'Den som hopper rett opp i sin sylinder, er ikke ansvarlig for kontakt.', 'b'], ['Lovlig forsvarsposisjon', 'Riktig forsvar', 'Vendt mot motspilleren med begge føttene på gulvet.', 'b']],
        items: [
          mc('Hva sier sylinderprinsippet?', ['Hver spiller har rett til rommet i en tenkt sylinder rundt seg', 'Hver spiller har rett til rommet i en tenkt sylinder rundt ballen', 'Bare spilleren med ballen har rett til en tenkt sylinder rundt seg', 'Hver forsvarer har rett til rommet mellom angriperen og kurven'], 'Alle spillere, med eller uten ball, har rett til sin sylinder. Ingen kan gå inn i en annens sylinder og lage ulovlig kontakt.'),
          mc('Hva sier vertikalitetsprinsippet?', ['Den som forlater sin vertikale posisjon og lager kontakt, er ansvarlig for kontakten', 'Den som hopper rett opp med armene over seg, er ansvarlig for kontakten', 'Den høyeste av spillerne er ansvarlig for kontakt som skjer i lufta', 'Den som har ballen, er alltid ansvarlig for kontakt med en forsvarer'], 'En forsvarer som hopper rett opp i sin egen sylinder, skal ikke straffes for kontakt. Det er den som forlater sin vertikale posisjon og lager kontakt med en spiller som allerede sto der, som er ansvarlig.'),
          tf('En forsvarer som hopper rett opp med armene over seg innenfor sin egen sylinder, skal ikke straffes for kontakt.', true, '§ 33.2'),
          mc('Når har en forsvarer etablert en lovlig forsvarsposisjon?', ['Når forsvareren står vendt mot motspilleren med begge føttene på gulvet', 'Når forsvareren står vendt mot motspilleren med armene strakt ut til siden', 'Når forsvareren står vendt mot kurven med begge føttene på gulvet', 'Når forsvareren står vendt mot motspilleren med én fot i lufta'], '§ 33.3. Forsvareren må stå vendt mot motspilleren med begge føttene på gulvet. Armene kan være over hodet, men ikke strukket ut til siden for å stenge.'),
          mc('Hva er hensikten med den charging-frie halvsirkelen under kurven?', ['En forsvarer inne i den kan normalt ikke få dømt charging mot en angriper i lufta', 'En forsvarer inne i den får alltid dømt charging når en angriper løper på ham', 'Ingen angrepsspillere kan stå der i mer enn 3 sekunder om gangen', 'Spillerne som står i returplassene under straffekast, skal stå der'], 'Den skal hindre at forsvarere står rett under kurven bare for å «ta» offensive fouls. Tre sekunders-regelen gjelder for hele det malte feltet, ikke bare halvsirkelen.'),
        ],
      },
      {
        id: 'k3s2', title: 'Personlig foul',
        intro: [['Personlig foul', 'Ulovlig kontakt', 'Ulovlig kontakt med en motspiller, med eller uten ball.', 'b'], ['Skuddfoul', 'Foul i skuddbevegelse', 'Gir straffekast: 1 hvis kurven går i, ellers 2 eller 3.', 'b'], ['5 fouls', 'Ute av kampen', 'En spiller med fem fouls må forlate banen.', 'b']],
        items: [
          mc('En spiller i skuddbevegelse blir foulet og scorer et 2-poengsskudd. Hva blir straffen?', ['Målet teller, og spilleren får 1 straffekast', 'Målet teller, og spilleren får 2 straffekast', 'Målet teller ikke, og spilleren får 2 straffekast', 'Målet teller, og laget får innkast fra sidelinjen'], 'Scores målet, teller det, og det gis 1 ekstra straffekast. Bommer spilleren, gis like mange straffekast som skuddet var verdt.'),
          mc('En spiller blir foulet i et 3-poengsskudd som bommer. Hvor mange straffekast?', ['3', '2', '1', '0'], 'Bom fra 3-poengsområdet gir 3 straffekast.'),
          mc('En spiller som ikke er i skuddbevegelse blir foulet. Laget som foulet har 2 lagfouls i perioden. Hva skjer?', ['Innkast til laget som ble foulet', 'Innkast til laget som foulet', '2 straffekast til spilleren som ble foulet', '1 straffekast til spilleren som ble foulet'], 'Med 2 lagfouls har laget som foulet, ikke nådd bestrafningsgrensen på 4 lagfouls i perioden ennå. Da blir det innkast. Fra og med femte lagfoul blir det 2 straffekast.'),
          mc('Hvor mange fouls kan en spiller få før spilleren må forlate kampen?', ['5', '6', '4', '3'], 'En spiller med fem fouls må forlate banen.'),
          tf('Spilleren som ble foulet, skal selv ta straffekastene etter en personlig foul.', true, 'Unntaket er hvis spilleren må forlate banen, da tar innbytteren dem.'),
          num(() => { const v = pick([[2, 'scoret ikke', '2-poengsområdet', 2], [3, 'scoret ikke', '3-poengsområdet', 3], [2, 'scoret', '2-poengsområdet', 1]]); return { q: `En spiller blir foulet i skuddbevegelse fra ${v[2]} og ${v[1]}. Hvor mange straffekast får spilleren?`, a: v[3], u: 'straffekast', e: v[1] === 'scoret' ? 'Målet teller, og spilleren får 1 straffekast i tillegg.' : `Bom fra ${v[2]} gir ${v[3]} straffekast.`, tol: 0 }; }),
        ],
      },
      {
        id: 'k3s3', title: 'Straffekast',
        intro: [['Straffekastlinjen', 'Her står skytteren', 'Skytteren står bak linja og innenfor halvsirkelen.', 'b'], ['5 sekunder', 'Tid på straffekastet', 'Ballen må slippes innen 5 sekunder.', 'b'], ['Returplasser', 'Langs feltet', 'Spillerne står annenhver i plassene langs 3-sekundersområdet.', 'b']],
        items: [
          mc('Hvor lang tid har skytteren på seg ved et straffekast?', ['5 sekunder', '10 sekunder', '3 sekunder', '8 sekunder'], 'Ballen må slippes innen 5 sekunder etter at dommeren har stilt den til disposisjon.'),
          tf('Straffekastskytteren kan tråkke på straffekastlinjen idet ballen slippes, så lenge ballen går i.', false, 'Skytteren kan ikke berøre linjen eller gå inn i feltet før ballen har gått i kurven eller truffet ringen.'),
          tf('Det er lov å finte et straffekast.', false, 'Skytteren skal ikke finte.'),
          mc('Hvor dype er oppstillingsplassene langs 3-sekundersområdet under straffekast?', ['1 m', '2 m', '50 cm', '1,80 m'], 'Feltene regnes som 1 m dype.'),
          mc('Hvor skal spillere som ikke står i oppstillingsplassene, stå under et straffekast?', ['Bak straffekastlinjens forlengelse og utenfor 3-poengslinjen', 'Bak straffekastlinjens forlengelse og innenfor 3-poengslinjen', 'Foran straffekastlinjens forlengelse og utenfor 3-poengslinjen', 'Bak midtlinjen, i lagets eget forsvarsfelt'], 'De må stå bak straffekastlinjens forlengelse og utenfor 3-poengslinjen til straffekastet er avsluttet.'),
          mc('Når kan spillerne i returplassene gå inn i feltet?', ['Når ballen har forlatt skytterens hånd', 'Når ballen har truffet ringen', 'Når dommeren gir ballen til skytteren', 'Når ballen er på vei ned mot ringen'], '§ 44.2.4. Spillerne i returplassene kan gå inn i feltet så snart ballen har forlatt skytterens hånd. Skytteren selv må vente til ballen har truffet ringen.'),
        ],
      },
    ],
  };

  // ================================================================
  // ENHET 4 – TIDSREGLER
  // ================================================================
  const k4 = {
    id: 'k4',
    title: 'Tidsregler og tilbakespill',
    color: '#ce82ff', dark: '#a568cc',
    goal: 'Skuddklokken, 8-sekundersregelen, tilbakespill, 3 sekunder og tett oppdekket spiller (§ 26–30).',
    guide: [
      ['24 sekunder (§ 29)', 'Laget har 24 sekunder på å skyte. Ballen må forlate hånden før signalet og så treffe ringen eller gå i.\nTreffer ballen ringen og samme lag tar returen: 14 s. Tar motstanderne den: 24 s.'],
      ['8 sekunder og tilbakespill', 'Laget må få ballen fra forsvarsfeltet til angrepsfeltet innen 8 sekunder.\nMidtlinjen hører til forsvarsfeltet.\nEtter at laget har kontroll i angrepsfeltet, kan det ikke spille ballen tilbake og berøre den i forsvarsfeltet.'],
      ['3 og 5 sekunder', '3 sekunder: Ikke mer enn 3 sammenhengende sekunder i motstandernes 3-sekundersområde.\n5 sekunder: Står en forsvarer innen 1 m (tett oppdekket), må du sentre, skyte eller drible innen 5 s.'],
    ],
    skills: [
      {
        id: 'k4s1', title: 'Skuddklokken (24 sekunder)',
        intro: [['24', 'Skuddklokken', 'Laget har 24 sekunder på å skyte.', 'b'], ['Treffe ringen', 'Gyldig skuddforsøk', 'Skuddet må treffe ringen eller gå i for å nullstille klokka.', 'b'], ['14', 'Retur til samme lag', 'Tar samme lag returen etter ringen, stilles klokka til 14.', 'b']],
        items: [
          mc('Hvor lang tid har et lag på seg til å gjøre et skuddforsøk?', ['24 sekunder', '30 sekunder', '14 sekunder', '20 sekunder'], 'Skuddklokken starter på 24 sekunder.'),
          mc('Hva må til for at et skudd regnes som skuddforsøk innen 24 sekunder?', ['Ballen må forlate hånden før signalet og så treffe ringen eller gå i kurven', 'Ballen må forlate hånden før signalet og så treffe platen eller ringen', 'Spilleren må være i lufta før signalet, og ballen må så treffe ringen', 'Ballen må treffe ringen før signalet, ellers teller ikke kurven'], '§ 29.1.1. Ballen må ha forlatt hånden før signalet, og deretter må den treffe ringen eller gå i kurven. Det holder ikke at den treffer platen.'),
          mc('Et skudd treffer ringen, og det samme laget tar returen. Hva stilles skuddklokken til?', ['14 sekunder', '24 sekunder', 'Den fortsetter', '10 sekunder'], 'Samme lag får 14 sekunder etter at ballen har berørt ringen.'),
          mc('Et skudd treffer ringen, og motstanderne tar returen. Hva stilles skuddklokken til?', ['24 sekunder', '14 sekunder', 'Den fortsetter', '8 sekunder'], 'Nytt lag i angrep etter returen får 24 sekunder.'),
          tf('Skuddklokken lyder mens ballen er i lufta, og ballen går i kurven. Målet teller ikke.', false, 'Ballen forlot hånden før signalet, så signalet overses, og målet teller.'),
          tf('Skuddklokken lyder mens ballen er i lufta, og skuddet bommer på ringen. Det er alltid en overtredelse.', false, 'Det er en overtredelse, men spillet fortsetter hvis motstanderne umiddelbart og tydelig har fått kontroll over ballen.'),
        ],
      },
      {
        id: 'k4s2', title: '8 sekunder og tilbakespill',
        // trinn med høyst tre nye begreper hver
        parts: [
          { title: '8 sekunder', intro: [0, 1, 2], items: [0, 1, 2] },
          { title: 'Tilbakespill', intro: [3] },
        ],
        intro: [['Forsvarsfelt', 'Egen banehalvdel', 'Banehalvdelen med din egen kurv, inkludert midtlinjen.', 'b'], ['Angrepsfelt', 'Motstandernes halvdel', 'Banehalvdelen med kurven dere angriper.', 'b'], ['8 sekunder', 'Over midtlinjen', 'Laget må få ballen inn i angrepsfeltet innen 8 sekunder.', 'b'], ['Tilbakespill', 'Tilbake over midten', 'Ballen kan ikke spilles tilbake til forsvarsfeltet og berøres der av samme lag.', 'b']],
        items: [
          mc('Hvor lang tid har et lag på å få ballen fra forsvarsfeltet til angrepsfeltet?', ['8 sekunder', '10 sekunder', '5 sekunder', '24 sekunder'], 'Laget må bringe ballen inn i angrepsfeltet innen 8 sekunder.'),
          tf('Midtlinjen er en del av angrepsfeltet.', false, 'Midtlinjen hører til forsvarsfeltet. Står du med én fot på midtlinjen, er du i forsvarsfeltet.'),
          mc('Når har en spiller som dribler, fått ballen inn i angrepsfeltet?', ['Når begge føttene og ballen er i full kontakt med angrepsfeltet', 'Når én fot og ballen er i kontakt med angrepsfeltet', 'Når ballen er i kontakt med angrepsfeltet, uansett hvor føttene er', 'Når begge føttene er i angrepsfeltet, uansett hvor ballen er'], '§ 28.1.2. Både begge føttene og ballen må være i full kontakt med angrepsfeltet. Først da stopper 8-sekunderstellingen.'),
          mc('Et lag har kontroll i angrepsfeltet. En spiller sentrer ballen, og en medspiller som står i forsvarsfeltet tar imot. Hva er dette?', ['Tilbakespill', 'Lovlig spill', '8 sekunder', 'Skrittfeil'], 'Ballen ble sist berørt av laget i angrepsfeltet og deretter berørt av samme lag i forsvarsfeltet. Det er tilbakespill, som er en overtredelse.'),
          mc('Hva er straffen for tilbakespill?', ['Motstanderne får innkast i sitt angrepsfelt nærmest stedet for overtredelsen', 'Motstanderne får innkast i sitt forsvarsfelt nærmest stedet for overtredelsen', 'Motstanderne får innkast fra midtlinjens forlengelse ved sidelinjen', 'Motstanderne får 1 straffekast og deretter innkast fra sidelinjen'], 'Tilbakespill er en overtredelse. Motstanderne får innkast i sitt angrepsfelt nærmest stedet, men ikke rett bak platen.'),
          tf('En spiller hopper fra angrepsfeltet, får ny lagkontroll over ballen i lufta og lander i forsvarsfeltet. Dette er ikke tilbakespill.', true, 'Dette unntaket står i § 30.1.2.'),
        ],
      },
      {
        id: 'k4s3', title: '3 og 5 sekunder',
        intro: [['3-sekundersområdet', 'Feltet under kurven', 'Angripere kan ikke stå der mer enn 3 sammenhengende sekunder.', 'b'], ['Tett oppdekket', 'Forsvarer innen 1 m', 'Da har spilleren med ballen 5 sekunder på seg.', 'b'], ['Begge føttene ut', 'Ute av feltet', 'Du er ute av 3-sekundersområdet når begge føttene er utenfor.', 'b']],
        items: [
          mc('Hvor lenge kan en angrepsspiller stå sammenhengende i motstandernes 3-sekundersområde?', ['Under 3 sekunder', 'Under 5 sekunder', 'Under 8 sekunder', 'Så lenge laget ikke skyter'], 'Mer enn 3 sammenhengende sekunder er en overtredelse når laget har ballen i angrepsfeltet og kampklokken går. 5 sekunder gjelder tett oppdekket spiller, og 8 sekunder gjelder å få ballen over midtlinjen.'),
          mc('Hva skal til for at en spiller etablerer seg utenfor 3-sekundersområdet?', ['Begge føttene på gulvet utenfor området', 'Én fot på gulvet utenfor området', 'Begge føttene på linjen rundt området', 'Én fot i lufta over linjen rundt området'], 'Spilleren må plassere begge føttene på gulvet utenfor området. Linjene er en del av området, så å stå på linjen er ikke nok.'),
          tf('En spiller som har vært under 3 sekunder i feltet og dribler inn for å skyte, kan fortsette selv om 3 sekunder passeres.', true, 'Det er et av unntakene i § 26.'),
          mc('En spiller med ballen er tett oppdekket. Hva betyr det?', ['En forsvarer står i aktiv, lovlig forsvarsposisjon innen 1 m', 'En forsvarer står i aktiv, lovlig forsvarsposisjon innen 2 m', 'To forsvarere står i lovlig forsvarsposisjon rundt spilleren', 'En forsvarer berører spilleren med hånden eller kroppen'], 'En forsvarer i aktiv, lovlig forsvarsposisjon innen 1 m betyr tett oppdekket. Da må spilleren sentre, skyte eller drible innen 5 sekunder.'),
          match([['3 sekunder', '3-sekundersområdet'], ['5 sekunder', 'Tett oppdekket'], ['8 sekunder', 'Over midtlinjen'], ['24 sekunder', 'Skuddklokke']], 'Koble tidsregelen med situasjonen'),
        ],
      },
    ],
  };

  // ================================================================
  // ENHET 5 – LAGFOULS OG SPESIELLE SITUASJONER
  // ================================================================
  const k5 = {
    id: 'k5',
    title: 'Lagfouls og kampsituasjoner',
    color: '#00b8a9', dark: '#00897e',
    goal: 'Lagfouls og bestrafningsgrensen, hoppballsituasjoner med vekslende ballbesittelse, og ulovlig ballberøring (§ 12, 31, 35, 42).',
    guide: [
      ['Lagfouls (§ 42)', 'Etter 4 lagfouls i en periode gir personlige fouls på spiller som ikke er i skuddbevegelse, 2 straffekast.\nFouls av laget med ballen gir bare innkast.\nLagfouls i forlengning regnes med i 4. periode.\nDobbelfoul: ingen straffekast.'],
      ['Vekslende ballbesittelse (§ 12)', 'Ved holdt ball og andre hoppballsituasjoner får lagene innkast annenhver gang.\nLaget som tapte åpningshoppballen, får det første innkastet.\nPilen peker mot kurven laget angriper.'],
      ['Ulovlig ballberøring (§ 31)', 'Goaltending: berøre ballen når den er helt over ringens nivå og på vei ned, eller etter at den har truffet platen.\nForsvarer: angrepslaget får poengene. Angriper: ingen poeng.\nUlovlig påvirkning: f.eks. berøre ringen eller platen mens ballen er på ringen.'],
    ],
    skills: [
      {
        id: 'k5s1', title: 'Lagfouls',
        intro: [['Lagfoul', 'Lagets fouls i perioden', 'Alle fouls spillerne på laget får, teller som lagfouls.', 'b'], ['4 lagfouls', 'Bestrafningsgrensen', 'Fra og med 5. lagfoul gir fouls straffekast.', 'b'], ['Dobbelfoul', 'Samtidige fouls', 'To motspillere fouler hverandre omtrent samtidig.', 'b']],
        items: [
          mc('Etter hvor mange lagfouls i en periode har et lag nådd bestrafningsgrensen?', ['4', '5', '3', '6'], 'Etter 4 lagfouls er grensen nådd. Fra og med 5. foul gis det straffekast.'),
          mc('Laget har 4 lagfouls i perioden og fouler en spiller som ikke er i skuddbevegelse. Hva er straffen?', ['2 straffekast', 'Innkast', '1 straffekast', '3 straffekast'], 'Når bestrafningsgrensen er nådd, gir personlige fouls 2 straffekast i stedet for innkast.'),
          tf('Et lag har nådd bestrafningsgrensen. En spiller på laget som har ballen, begår en personlig foul. Motstanderne får 2 straffekast.', false, 'En foul av laget med kontroll over ballen gir bare innkast til motstanderne.'),
          mc('Hvordan telles lagfouls i forlengning?', ['De regnes som begått i 4. periode', 'De starter på null i hver forlengning', 'De telles ikke', 'De regnes som begått i 1. periode'], 'Alle lagfouls i forlengningene regnes med i 4. periode.'),
          mc('Hva er en dobbelfoul?', ['To motspillere begår fouls mot hverandre omtrent samtidig', 'To spillere på samme lag begår fouls mot én motspiller samtidig', 'En spiller begår to fouls mot samme motspiller rett etter hverandre', 'En spiller begår én foul som rammer to motspillere samtidig'], 'Ved en dobbelfoul noteres foulene på begge spillerne, og det gis ingen straffekast. Spillet fortsetter som om ingen foul hadde skjedd.'),
          tf('En teknisk foul på en spiller teller ikke som lagfoul.', false, 'En teknisk foul på en spiller noteres som spillerfoul og teller som lagfoul, uansett kategori.'),
          num(() => ({ q: 'Et lag har begått 3 lagfouls i 2. periode. Hvor mange fouls til kan laget begå før det har nådd bestrafningsgrensen?', a: 1, u: 'foul', e: 'Grensen nås ved 4 lagfouls, så det gjenstår 1.', tol: 0 })),
        ],
      },
      {
        id: 'k5s2', title: 'Holdt ball og vekslende ballbesittelse',
        intro: [['Holdt ball', 'Begge holder ballen', 'Spillere fra begge lag holder ballen så fast at ingen får kontroll.', 'b'], ['Pilen', 'Hvem som står for tur', 'Pilen for vekslende ballbesittelse viser hvem som får neste innkast.', 'b'], ['Vekslende ballbesittelse', 'Annenhver gang', 'Lagene får innkast annenhver gang i stedet for hoppball.', 'b']],
        items: [
          mc('Hva er en «holdt ball»?', ['Spillere fra begge lag holder så fast i ballen at ingen får kontroll uten overdreven kraft', 'En spiller holder ballen i mer enn 5 sekunder uten å drible, sentre eller skyte', 'Spillere fra samme lag holder i ballen samtidig, så ingen av dem kan sentre den', 'En forsvarer holder armene rundt ballføreren, så ballføreren ikke kommer løs'], 'Holdt ball er en hoppballsituasjon og løses med vekslende ballbesittelse. Å holde ballen for lenge mens man er tett oppdekket er 5-sekundersregelen, og å holde rundt en motspiller er en foul.'),
          mc('Hvilket lag får det første innkastet etter vekslende ballbesittelse?', ['Laget som ikke fikk den første lagkontrollen etter åpningshoppballen', 'Laget som fikk den første lagkontrollen etter åpningshoppballen', 'Hjemmelaget, som står oppført først i kampskjemaet', 'Bortelaget, som står oppført sist i kampskjemaet'], 'Laget som ikke fikk den første lagkontrollen etter åpningshoppballen, får den første vekslende ballbesittelsen.'),
          mc('Hvilken vei peker pilen for vekslende ballbesittelse?', ['Mot motstanderlagets kurv, den veien laget som skal ha ballen angriper', 'Mot lagets egen kurv, den veien laget som skal ha ballen forsvarer', 'Mot motstanderlagets kurv, den veien laget som sist hadde ballen angriper', 'Mot sekretariatet, og dommeren sier hvilket lag som skal ha ballen'], 'Pilen peker den veien laget som skal ha neste vekslende ballbesittelse, angriper. Den snus straks innkastet etter vekslende ballbesittelse er avsluttet.'),
          tf('Laget som tar et innkast etter vekslende ballbesittelse og begår en overtredelse, mister ballbesittelsen, og pilen snus.', true, 'Motstanderne får innkast, og retten til neste vekslende ballbesittelse går også til dem.'),
          mc('Hvor mange ganger kan en spiller som er med i hoppballen, berøre ballen før den har berørt en annen spiller eller gulvet?', ['Høyst to ganger, og ballen kan ikke fanges', 'Høyst én gang, og ballen kan ikke fanges', 'Høyst to ganger, og ballen kan fanges andre gang', 'Høyst tre ganger, og ballen kan ikke fanges'], 'De to spillerne i hoppballen får slå ballen høyst to ganger og kan ikke fange den før den har berørt en annen spiller eller gulvet.'),
          mc('Ballen går ut, og dommerne er uenige om hvem som berørte den sist. Hva skjer?', ['Det er en hoppballsituasjon, og laget med pilen får innkast', 'Det er en hoppballsituasjon, og laget uten pilen får innkast', 'Det blir hoppball i midtsirkelen mellom to spillere', 'Laget som angrep, beholder ballen og får innkast'], '§ 12.4. Når dommerne er uenige, er det en hoppballsituasjon. Den løses med vekslende ballbesittelse, ikke med en ny hoppball.'),
        ],
      },
      {
        id: 'k5s3', title: 'Ulovlig ballberøring',
        intro: [['Goaltending', 'Ulovlig ballberøring', 'Å berøre ballen over ringens nivå på vei ned mot kurven.', 'b'], ['Ulovlig påvirkning', 'Rør ikke ringen', 'Å berøre ringen eller platen mens ballen er på ringen.', 'b'], ['Platen', 'Etter platetreff', 'Ballen kan ikke berøres etter at den har truffet platen på vei mot kurven.', 'b']],
        items: [
          mc('Når er det ulovlig ballberøring (goaltending) på et skudd?', ['Når ballen berøres mens den er helt over ringens nivå og på vei ned', 'Når ballen berøres mens den er helt over ringens nivå og på vei opp', 'Når ballen berøres mens den er under ringens nivå og på vei ned', 'Når ballen berøres i lufta før den har nådd sitt høyeste punkt'], 'Ballberøring er ulovlig når ballen er helt over ringens nivå og på vei ned mot kurven, og også etter at den har truffet platen. Reglene gjelder til ballen har berørt ringen eller ikke lenger kan gå i. På vei opp kan ballen blokkeres lovlig.'),
          mc('En forsvarer begår goaltending på et 3-poengsskudd. Hva skjer?', ['Angrepslaget får 3 poeng', 'Angrepslaget får 2 poeng', 'Skuddet tas om', 'Det blir hoppball'], 'Poeng gis som om ballen hadde gått i kurven.'),
          mc('En angrepsspiller begår goaltending på lagkameratens skudd, og ballen går i. Hva skjer?', ['Ingen poeng, og motstanderne får innkast fra straffekastlinjens forlengelse', 'Poengene teller, og motstanderne får innkast fra endelinjen', 'Ingen poeng, og det blir en hoppballsituasjon med pilen', 'Poengene teller, og angrepsspilleren får en teknisk foul'], 'En overtredelse av en angriper gir ingen poeng. Motstanderne får innkast fra straffekastlinjens forlengelse.'),
          tf('Det er ulovlig påvirkning når en spiller berører kurven eller platen mens ballen er i kontakt med ringen etter et skuddforsøk.', true, '§ 31.2.4'),
          tf('Det er ulovlig å føre hånden gjennom kurven nedenfra og berøre ballen.', true, 'Det er ulovlig påvirkning.'),
          num(() => { const p = pick([['straffekast', 1], ['skudd fra 2-poengsområdet', 2], ['skudd fra 3-poengsområdet', 3]]); return { q: `En forsvarer berører ballen ulovlig på vei ned mot kurven på et ${p[0]}. Hvor mange poeng får angrepslaget?`, a: p[1], u: 'poeng', e: `Poeng gis som om ballen gikk i: ${p[1]}.${p[1] === 1 ? ' På et siste straffekast får forsvareren i tillegg en teknisk foul kategori 2.' : ''}`, tol: 0 }; }),
        ],
      },
    ],
  };

  // ================================================================
  // ENHET 6 – AVANSERTE REGLER
  // ================================================================
  const k6 = {
    id: 'k6',
    title: 'Avanserte regler',
    color: '#2b70c9', dark: '#1f5aa3',
    goal: 'Detaljene: skrittregler, dobbeldribling (2026), skuddbevegelse (2026), skuddklokke 24/14 og de siste to minuttene (§ 15, 17, 18, 24, 25, 29, 34).',
    guide: [
      ['Skritt og dribling i detalj', 'Stopper du med begge føttene samtidig på første skritt, kan du velge pivoteringsfot. Lander du på én fot, er den pivoteringsfot.\nDu kan ikke berøre gulvet gjentatte ganger med samme fot etter at driblingen er slutt.\nNytt i 2026: Du kan drible igjen bare etter et skuddforsøk, etter at en motspiller har berørt ballen, eller etter at ballen i en pasning eller fomling har berørt en annen spiller.'],
      ['Skuddbevegelse (nytt i 2026)', 'Hoppskudd: starter når skuldrene og ballen beveges oppover mot kurven.\nDrive: starter når ballen er samlet og hviler i hånden.\nSpilleren må være i angrepsfeltet (unntak: siste aksjon før periodeslutt eller skuddklokka går ut).\nIngen sammenheng mellom antall skritt og skuddbevegelsen.'],
      ['Skuddklokke 24/14', 'Foul eller overtredelse av forsvaret, innkast i angrepsfeltet: 14 eller mer fortsetter, 13 eller mindre stilles til 14.\nInnkast i forsvarsfeltet: 24.\nEtter usportslig foul: 14.'],
      ['De siste 2 minuttene', 'Gjelder når klokka viser 2:00 eller mindre i 4. periode og forlengning.\nInnkastfoul: 1 straffekast + innkast.\nEtter time-out kan laglederen velge innkast fra angrepsfeltet.\nLaget som scoret, får ikke time-out eller innbytte, med mindre dommeren har stoppet spillet.'],
    ],
    skills: [
      {
        id: 'k6s1', title: 'Skritt og dribling i detalj',
        intro: [['Hoppstopp', 'Begge føttene samtidig', 'Lander du på begge føttene samtidig, kan du velge pivoteringsfot.', 'b'], ['Ett-fots-stopp', 'Den foten er pivot', 'Lander du på én fot, kan bare den foten være pivoteringsfot.', 'b'], ['Fomling', 'Mistet og fanget igjen', 'Å miste ballen tilfeldig og ta den igjen er ikke en ny dribling.', 'b']],
        items: [
          mc('Etter 2026-reglene: Når kan en spiller drible på nytt etter at første dribling er avsluttet?', ['Etter et skuddforsøk, etter berøring fra en motspiller, eller etter en pasning eller fomling som har berørt en annen spiller', 'Etter et skuddforsøk, etter å ha pivotert, eller etter en pasning eller fomling som har berørt gulvet', 'Etter et skuddforsøk, etter å ha holdt ballen i 5 sekunder, eller etter at ballen har berørt gulvet', 'Etter at spilleren har tatt to skritt og stoppet helt opp, eller etter at dommeren har blåst'], 'FIBA presiserte i 2026 at én av disse tre situasjonene må ha skjedd: et skuddforsøk, at en motspiller har berørt ballen, eller at ballen i en pasning eller fomling har berørt en annen spiller.'),
          tf('En spiller som stopper med begge føttene samtidig på første skritt, kan velge hvilken fot som er pivoteringsfot.', true, '§ 25.2.1'),
          tf('Lander en spiller på én fot etter å ha tatt ballen, kan bare den foten brukes som pivoteringsfot.', true, '§ 25.2.1'),
          tf('Det er lov å berøre gulvet flere ganger med samme fot etter at driblingen er avsluttet, så lenge man ikke tar et nytt skritt.', false, 'En spiller kan ikke berøre banen gjentatte ganger med samme fot eller begge føtter etter å ha avsluttet driblingen.'),
          tf('En spiller som ligger på gulvet med ballen og reiser seg opp, har gjort skrittfeil.', true, 'Det er en overtredelse å rulle eller forsøke å reise seg mens man holder ballen.'),
          mc('Hvilken av disse handlingene regnes ikke som en dribling?', ['Å kaste ballen mot platen og få kontroll over den igjen', 'Å sprette ballen i gulvet', 'Å rulle ballen bortover gulvet og ta den opp igjen', 'Å sprette ballen med venstre hånd'], '§ 24.1.4 lister handlinger som ikke er driblinger, blant annet å kaste ballen mot platen.'),
        ],
      },
      {
        id: 'k6s2', title: 'Skuddbevegelse (nytt i 2026)',
        intro: [['Skuddbevegelse', 'Når skuddet starter', 'Avgjør om en foul gir straffekast for skudd.', 'b'], ['Samle ballen', 'Starten på en drive', 'Når ballen hviler i hånden etter driblingen.', 'b'], ['Angrepsfeltet', 'Må være på riktig side', 'Skudd fra forsvarsfeltet regnes normalt ikke som skuddbevegelse.', 'b']],
        items: [
          mc('Når starter skuddbevegelsen i et hoppskudd etter 2026-reglene?', ['Når spilleren begynner å bevege skuldrene og ballen oppover mot kurven', 'Når spilleren begynner å bøye knærne for å hoppe opp mot kurven', 'Når spilleren tar ballen opp fra driblingen med begge hender', 'Når spilleren har forlatt gulvet og er i lufta på vei opp'], 'Det er bevegelsen av skuldrene og ballen oppover mot kurven som markerer starten. Foul før dette regnes ikke som foul i skuddbevegelse.'),
          mc('Når starter skuddbevegelsen ved en kontinuerlig bevegelse mot kurven (drive)?', ['Når ballen er samlet og hviler i hånden, og spilleren fortsetter mot kurven for å skyte', 'Når spilleren tar det første skrittet mot kurven etter siste sprett med ballen', 'Når spilleren begynner driblingen mot kurven fra utenfor 3-poengslinjen', 'Når spilleren har forlatt gulvet, uansett om ballen er samlet eller ikke'], 'Det er samlingen av ballen som markerer starten på en drive: ballen hviler i hånden etter dribling eller mottak i lufta, og spilleren fortsetter skuddbevegelsen.'),
          tf('Etter 2026-reglene må en spiller normalt være i angrepsfeltet for å regnes som i skuddbevegelse.', true, 'Unntaket er den siste aksjonen før perioden slutter eller skuddklokken går ut.'),
          mc('En spiller blir foulet i sitt eget forsvarsfelt mens spilleren kaster ballen mot kurven midt i perioden. Er spilleren i skuddbevegelse?', ['Nei, med mindre perioden eller skuddklokken er i ferd med å gå ut', 'Nei, et kast fra forsvarsfeltet er aldri skuddbevegelse', 'Ja, et kast mot kurven fra hvor som helst er skuddbevegelse', 'Ja, men bare hvis ballen treffer ringen eller går i'], 'Nytt i 2026: et «skudd» fra forsvarsfeltet regnes ikke som skuddbevegelse, unntatt ved periodeslutt eller når skuddklokken går ut. Da kan det være et ekte forsøk på å score.'),
          tf('Antall lovlige skritt spilleren har tatt, avgjør om spilleren er i skuddbevegelse.', false, 'Reglene sier uttrykkelig at det ikke er noen sammenheng mellom antall skritt og skuddbevegelsen.'),
          mc('En spiller blir foulet i skuddbevegelse, men sentrer deretter ballen til en medspiller. Hva gjelder?', ['Spilleren regnes ikke lenger som i skuddbevegelse', 'Spilleren får likevel straffekast for skudd', 'Det blir teknisk foul', 'Det blir hoppball'], 'Sentrer spilleren etter foulen, er spilleren ikke lenger i skuddbevegelse.'),
          mc('Når slutter skuddbevegelsen for en spiller som hopper?', ['Når ballen har forlatt hånden og spilleren har landet med begge føttene', 'Når ballen har forlatt hånden, selv om spilleren fortsatt er i lufta', 'Når ballen har truffet ringen eller gått ned i kurven', 'Når spilleren har landet med én fot, selv om ballen fortsatt er i hånden'], 'For en spiller i lufta varer skuddbevegelsen til ballen har forlatt hånden og begge føttene er tilbake på gulvet. En foul i landingen er derfor fortsatt en foul i skuddbevegelse.'),
          tf('En spiller i et hoppskudd blir foulet og beveger deretter ballen oppover i retning bort fra kurven. Spilleren regnes fortsatt som i skuddbevegelse.', false, 'Beveger spilleren ballen oppover bort fra kurven, eller har ikke ansiktet mot kurven, er spilleren ikke lenger i skuddbevegelse.'),
        ],
      },
      {
        id: 'k6s3', title: 'Skuddklokke: 24 eller 14',
        intro: [['13 eller mindre', 'Stilles til 14', 'Ved foul av forsvaret og innkast i angrepsfeltet.', 'b'], ['14 eller mer', 'Fortsetter', 'Klokka stilles ikke tilbake.', 'b'], ['Forsvarsfeltet', 'Alltid 24', 'Innkast i forsvarsfeltet etter feil av forsvaret gir 24.', 'b']],
        items: [
          mc('Forsvaret begår en foul (laget er ikke i bonus). Angrepslaget får innkast i angrepsfeltet, og skuddklokken viser 9 sekunder. Hva stilles den til?', ['14 sekunder', '24 sekunder', 'Den fortsetter fra 9', '19 sekunder'], 'Viser klokka 13 eller mindre, stilles den til 14.'),
          mc('Forsvaret sparker ballen. Angrepslaget får innkast i angrepsfeltet, og skuddklokken viser 17 sekunder. Hva skjer med den?', ['Den fortsetter fra 17', 'Den stilles til 24', 'Den stilles til 14', 'Den stilles til 20'], 'Viser klokka 14 eller mer, fortsetter den der den stoppet.'),
          mc('Forsvaret begår en foul mens angrepslaget er i sitt forsvarsfelt. Hva stilles skuddklokken til?', ['24 sekunder', '14 sekunder', 'Den fortsetter', '8 sekunder'], 'Innkast i forsvarsfeltet gir 24 sekunder.'),
          mc('Hva stilles skuddklokken til etter en usportslig foul med innkast fra innkastlinjen i angrepsfeltet?', ['14 sekunder', '24 sekunder', 'Den fortsetter', '8 sekunder'], 'Innkast etter usportslig (kategori 1 eller 2) eller diskvalifiserende foul gir 14 sekunder.'),
          num(() => { const v = pick([[3, 'motstanderne har sparket ballen', 14], [16, 'forsvaret har begått en foul (ikke i bonus)', 16], [12, 'forsvaret har begått en foul (ikke i bonus)', 14]]); return { q: `Angrepslaget skal ta innkast i angrepsfeltet fordi ${v[1]}. Skuddklokken viste ${v[0]} sekunder. Hva skal skuddklokken vise ved innkastet?`, a: v[2], u: 's', e: v[0] >= 14 ? `Klokka viste 14 eller mer, så den fortsetter fra ${v[0]}.` : 'Klokka viste 13 eller mindre, så den stilles til 14.', tol: 0 }; }),
        ],
      },
      {
        id: 'k6s4', title: 'De siste 2 minuttene',
        intro: [['2:00', 'Sluttminuttene', 'Egne regler gjelder når klokka viser 2:00 eller mindre i 4. periode og forlengning.', 'b'], ['Innkastfoul', 'Foul før innkastet', 'Gir 1 straffekast og innkast.', 'b'], ['Frontcourt-innkast', 'Laglederens valg', 'Etter time-out kan laglederen velge innkast fra angrepsfeltet.', 'b']],
        items: [
          mc('Hva er en innkastfoul?', ['En foul av en forsvarer mens ballen er ute for innkast, i de siste 2 minuttene', 'En foul av innkasteren mens ballen er ute for innkast, i de siste 2 minuttene', 'En foul av en forsvarer mens ballen er ute for innkast, når som helst i kampen', 'En foul av en forsvarer rett etter at innkastet er tatt, i de siste 2 minuttene'], 'En innkastfoul er en personlig foul av en forsvarer mens ballen er utenfor banen for innkast, når klokka viser 2:00 eller mindre i 4. periode eller forlengning. Straffen er 1 straffekast og innkast til laget som ble foulet.'),
          mc('Klokka viser 2:00 eller mindre i 4. periode, og et lag med ballen i forsvarsfeltet tar time-out. Hva kan laglederen velge?', ['Om innkastet skal tas fra innkastlinjen i angrepsfeltet eller fra forsvarsfeltet', 'Om innkastet skal tas fra sidelinjen eller fra endelinjen i forsvarsfeltet', 'Om skuddklokken skal stå på 14 eller stilles tilbake til 24 sekunder', 'Om laget skal få innkast fra midtlinjen eller 1 straffekast'], 'Laglederen bestemmer om laget skal fortsette fra innkastlinjen i angrepsfeltet eller fra forsvarsfeltet. Hva skuddklokken skal vise, følger av reglene for valget, ikke av et eget valg.'),
          mc('Klokka viser 1:30 i 4. periode, og laget ditt har nettopp scoret. Kan dere få time-out?', ['Nei, ikke med mindre dommeren har stoppet kampen', 'Ja, alltid', 'Ja, men bare 30 sekunder', 'Bare hvis motstanderne også tar time-out'], '§ 18.2.8'),
          tf('Når klokka viser 2:00 eller mindre i 4. periode, kan laget som slipper inn en kurv, bytte spillere.', true, '§ 19.2.2: Laget som ikke scorer, får innbyttemulighet.'),
          mc('I de siste 2 minuttene har dommeren advart forsvaret før et innkast. En forsvarer strekker likevel armene over sidelinjen. Hva skjer?', ['Forsvareren får en teknisk foul', 'Forsvareren får en personlig foul', 'Forsvareren får en usportslig foul', 'Innkastet tas om, og forsvaret advares igjen'], '§ 17.3.3. Når forsvaret allerede er advart, gir det å bryte grenselinjen ved innkast en teknisk foul.'),
          tf('Et lag kan bruke alle tre time-outene sine i andre omgang i de siste to minuttene av 4. periode.', false, 'Høyst 2 av time-outene i andre omgang kan brukes når klokka viser 2:00 eller mindre i 4. periode.'),
        ],
      },
    ],
  };

  // ================================================================
  // ENHET 7 – TEKNISKE OG USPORTSLIGE FOULS (NYTT I 2026)
  // ================================================================
  const k7 = {
    id: 'k7',
    title: 'Tekniske og usportslige fouls (2026)',
    color: '#ff9600', dark: '#cc7900',
    goal: 'De nye kategoriene for tekniske og usportslige fouls fra 2026, straffene, bortvisning og slagsmål (§ 36–40).',
    guide: [
      ['Teknisk foul (§ 36)', 'Nytt i 2026: to kategorier.\nKategori 1 (oppførsel, teller mot bortvisning): respektløs oppførsel, gester mot publikum, provosering, vifting foran øynene til en motspiller, albuesving uten kontakt, skuespill.\nKategori 2 (teller ikke): forsinke spillet, henge i ringen, goaltending på siste straffekast (1 poeng + teknisk foul).\nStraff: 1 straffekast, deretter innkast til laget som hadde ballen.'],
      ['Usportslig foul kategori 2 – «disruptive» (§ 37)', 'Kontakt som stopper en kontring uten forsøk på å spille ballen, eller kontakt bakfra eller fra siden på en spiller på vei mot kurven uten motspillere foran seg.\nTeller IKKE mot bortvisning.'],
      ['Usportslig foul kategori 1 – «flagrant» (§ 38)', 'Ikke legitim basketballhandling, hensynsløs, voldsom eller farlig handling, eller unødvendig hard kontakt.\nTeller mot bortvisning.'],
      ['Straff for usportslige fouls', '2 straffekast (eller scoring + 1, eller 2/3 ved bom), deretter innkast fra innkastlinjen i angrepsfeltet. Skuddklokke 14.'],
      ['Bortvisning', 'Spiller: to tekniske kat. 1, to usportslige kat. 1, eller én av hver.\nLagleder: to tekniske for egen oppførsel («L»), eller tre der noen skyldes benken («B»).\nSlagsmål: innbyttere som forlater benkområdet, bortvises.'],
    ],
    skills: [
      {
        id: 'k7s1', title: 'Teknisk foul kategori 1 og 2',
        intro: [['Teknisk foul', 'Oppførsel eller administrasjon', 'Gir 1 straffekast og innkast til laget som hadde ballen.', 'b'], ['Kategori 1', 'Teller mot bortvisning', 'Oppførselsrelatert, f.eks. skuespill eller provosering.', 'b'], ['Kategori 2', 'Teller ikke mot bortvisning', 'Administrativ, f.eks. henge i ringen eller forsinke spillet.', 'b']],
        items: [
          mc('Hva er forskjellen på teknisk foul kategori 1 og kategori 2 (nytt i 2026)?', ['Kategori 1 teller mot bortvisning, kategori 2 gjør det ikke', 'Kategori 2 gir to straffekast', 'Kategori 1 gjelder bare lagledere', 'Det er ingen forskjell i straff eller konsekvens'], 'De alvorligste, oppførselsrelaterte tekniske foulene er kategori 1.'),
          mc('Hvilken av disse er en teknisk foul kategori 1?', ['Late som man blir foulet (skuespill)', 'Henge i ringen', 'Forsinke spillet ved å holde ballen etter scoring', 'Komme for sent ut til andre omgang'], 'Skuespill er oppførselsrelatert og teller mot bortvisning.'),
          mc('Hvilken av disse er en teknisk foul kategori 2?', ['Henge i ringen slik at ringen bærer spillerens vekt', 'Vifte med hendene foran øynene til en motspiller', 'Respektløs kommunikasjon med dommeren', 'Provosere en motspiller'], 'Å henge i ringen er av administrativ art og teller ikke mot bortvisning.'),
          mc('En forsvarer berører ballen ulovlig (goaltending) på et siste straffekast. Hva er straffen etter 2026-reglene?', ['Angrepslaget får 1 poeng, og forsvareren får en teknisk foul kategori 2', 'Angrepslaget får 1 poeng, og forsvareren får en usportslig foul', 'Straffekastet tas om, og forsvareren får en teknisk foul kategori 2', 'Angrepslaget får 1 poeng, og forsvareren får en personlig foul'], 'Dette er nytt: 1 poeng etterfulgt av bestrafning for teknisk foul kategori 2.'),
          mc('Hva er straffen for en teknisk foul?', ['1 straffekast, deretter innkast til laget som hadde ballen', '1 straffekast, deretter innkast til laget som fikk straffekastet', '2 straffekast, deretter innkast til laget som hadde ballen', '1 straffekast, deretter hoppballsituasjon med pilen'], 'Straffekastet tas umiddelbart av en hvilken som helst motspiller laglederen utpeker. Spillet fortsetter deretter fra der det ble stoppet, med laget som hadde ballen.'),
          tf('En teknisk foul kategori 1 på en person på lagbenken noteres på laglederen og teller ikke som lagfoul.', true, 'Benkens tekniske fouls noteres på laglederen.'),
          mc('Hvem tar straffekastet etter en teknisk foul?', ['En hvilken som helst motspiller som laglederen utpeker', 'Spilleren som ble utsatt for den tekniske foulen', 'Kapteinen på motstanderlaget som er på banen', 'Den spilleren på banen som dommeren peker ut'], '§ 44.2.2. Det er laglederen til laget som får straffekastet, som bestemmer hvem som skal ta det.'),
        ],
      },
      {
        id: 'k7s2', title: 'Usportslig foul (disruptive og flagrant)',
        intro: [['Disruptive', 'Usportslig kategori 2', 'Stopper spillflyten. Teller ikke mot bortvisning.', 'b'], ['Flagrant', 'Usportslig kategori 1', 'Farlig eller ikke legitim kontakt. Teller mot bortvisning.', 'b'], ['2 + ball', 'Straffen', '2 straffekast og innkast fra innkastlinjen i angrepsfeltet.', 'b']],
        items: [
          mc('Hva er den tidligere «usportslige foulen» blitt til i 2026?', ['Den er delt i usportslig foul kategori 1 (flagrant) og kategori 2 (disruptive)', 'Den er delt i teknisk foul kategori 1 (flagrant) og kategori 2 (disruptive)', 'Den er slått sammen med den diskvalifiserende foulen til én foultype', 'Den er delt i usportslig foul med straffekast og usportslig foul uten'], 'FIBA delte den usportslige foulen i to typer i 2026: flagrant (kategori 1) og disruptive (kategori 2). Straffen er den samme.'),
          mc('En forsvarer drar ned en spiller på en kontring uten å forsøke å spille ballen, bare for å stoppe angrepet. Hva dømmes?', ['Usportslig foul kategori 2 (disruptive)', 'Personlig foul', 'Teknisk foul', 'Usportslig foul kategori 1 (flagrant)'], 'Unødvendig kontakt for å stoppe angrepslaget i overgangen er en disruptive foul.'),
          mc('En spiller gjør en farlig og voldsom handling som kan skade en motspiller. Hva dømmes?', ['Usportslig foul kategori 1 (flagrant)', 'Usportslig foul kategori 2 (disruptive)', 'Personlig foul', 'Teknisk foul kategori 2'], 'Hensynsløse, voldsomme eller farlige handlinger er flagrante.'),
          tf('En usportslig foul kategori 2 (disruptive) teller mot bortvisning.', false, 'Bare kategori 1 (flagrant) teller mot bortvisning. Kategori 2 teller som lagfoul.'),
          mc('En spiller som ikke er i skuddbevegelse, får en usportslig foul mot seg. Hva er straffen?', ['2 straffekast, deretter innkast fra innkastlinjen i angrepsfeltet', '2 straffekast, deretter innkast fra midtlinjens forlengelse', '1 straffekast, deretter innkast fra innkastlinjen i angrepsfeltet', '2 straffekast, deretter hoppballsituasjon med pilen'], 'Begge typene usportslige fouls har samme straff: 2 straffekast og innkast fra innkastlinjen i angrepsfeltet. Tidligere var innkastet fra midtlinjens forlengelse.'),
          mc('En angriper på vei mot kurven, uten motspillere mellom seg og kurven, blir foulet bakfra før skuddbevegelsen starter. Hva dømmes?', ['Usportslig foul kategori 2 (disruptive)', 'Personlig foul', 'Usportslig foul kategori 1, alltid', 'Ingenting'], 'Kontakt bakfra eller fra siden i denne situasjonen er et av kriteriene for disruptive foul.'),
          tf('Både usportslig foul kategori 1 og kategori 2 teller som lagfoul.', true, 'Begge noteres på spilleren og teller som en av lagfoulene.'),
          match([['Skuespill', 'Teknisk kat. 1'], ['Henge i ringen', 'Teknisk kat. 2'], ['Stoppe en kontring uten å spille ballen', 'Usportslig kat. 2'], ['Farlig, voldsom kontakt', 'Usportslig kat. 1']], 'Koble handlingen med foulen'),
        ],
      },
      {
        id: 'k7s3', title: 'Bortvisning og slagsmål',
        intro: [['Bortvisning', 'Ut resten av kampen', 'Spilleren eller laglederen må forlate kampen.', 'b'], ['T1 + T1', 'To tekniske kat. 1', 'Gir bortvisning, det samme gjør to flagrante eller én av hver.', 'b'], ['Slagsmål', 'Bli på benken', 'Innbyttere som forlater benkområdet under slagsmål, bortvises.', 'b']],
        items: [
          mc('Hvilken kombinasjon fører til at en spiller bortvises?', ['To tekniske fouls kategori 1', 'To tekniske fouls kategori 2', 'To usportslige fouls kategori 2', 'Én teknisk foul kategori 2 og én usportslig foul kategori 2'], 'Bortvisning: to T kat. 1, to usportslige kat. 1, eller én av hver.'),
          mc('En spiller har fått én teknisk foul kategori 1 og får deretter en usportslig foul kategori 1. Hva skjer?', ['Spilleren bortvises fra kampen', 'Ingenting ekstra', 'Spilleren må sitte ute ett minutt', 'Laget får teknisk foul'], 'Én teknisk kat. 1 + én usportslig kat. 1 gir bortvisning.'),
          tf('En spiller med to usportslige fouls kategori 2 (disruptive) og én teknisk foul kategori 2 kan fortsette å spille (hvis spilleren ikke har fem fouls).', true, 'Ingen av disse foulene teller mot bortvisning. Men de teller som personlige fouls, så fem fouls totalt gir utvisning.'),
          mc('Hvor mange tekniske fouls for egen usportslig oppførsel («L») gir bortvisning for en lagleder?', ['2', '3', '1', '4'], 'To tekniske fouls for egen oppførsel, eller tre der noen skyldes andre på benken.'),
          mc('Det oppstår et slagsmål på banen. Hvem kan forlate lagbenkområdet uten å bli bortvist?', ['Laglederen og første assisterende lagleder, hvis de hjelper dommerne å skape ro', 'Laglederen og kapteinen, hvis de hjelper dommerne å skape ro', 'Alle innbytterne, hvis de hjelper dommerne å skape ro', 'Bare laglederen, og bare hvis dommeren ber om det'], 'Innbyttere og andre som forlater benken under et slagsmål, bortvises. Bare laglederen og første assisterende lagleder kan gå inn for å hjelpe dommerne.'),
          mc('Hva skal en person som har fått en diskvalifiserende foul, gjøre?', ['Gå til garderoben og bli der til kampen er slutt, eller forlate hallen', 'Sette seg på lagbenken og bli der til kampen er slutt', 'Sette seg på tribunen og bli der til kampen er slutt', 'Gå til garderoben og bli der til neste periode starter'], '§ 39.3.2. Den diskvalifiserte skal gå til garderoben og bli der resten av kampen, eller forlate hallen.'),
        ],
      },
    ],
  };

  // ================================================================
  // ENHET 8 – SPESIELLE REGLER
  // ================================================================
  const k8 = {
    id: 'k8',
    title: 'Spesielle regler',
    color: '#ff86d0', dark: '#cc6ba6',
    goal: 'Sjeldne, men viktige situasjoner: tidsgrenser på slutten av perioder, tapt kamp, videoavspilling (IRS) og dommernes roller (§ 1, 16, 20, 21, 46–51, vedlegg F).',
    guide: [
      ['Brøkdeler av sekunder (§ 16.2.5)', 'Kampklokken må vise minst 0,3 s for at en spiller skal kunne fange og skyte.\nPå 0,2 og 0,1 kan det bare scores ved å slå eller dunke ballen direkte.'],
      ['Tapt kamp (§ 20–21)', 'Ikke fem spillere 15 minutter etter oppsatt start: tapt 0–20.\nFærre enn to spillere klare: lederen beholder stillingen, ellers 2–0.'],
      ['IRS (vedlegg F)', 'Dommerne kan bruke video for å kontrollere bestemte situasjoner.\nNytt i 2026: goaltending etter en foul kan kontrolleres når som helst, og i de siste 2 minuttene om ballen fortsatt var hos innkasteren ved en foul.'],
      ['Dommere og sekretariat', 'Dommerne (førstedommeren har siste ord), sekretariatet (sekretær, tidtaker, skuddklokkeoperatør) og eventuelt en kommissær eller teknisk delegat.\nLaglederen er lagets hovedtrener.'],
    ],
    skills: [
      {
        id: 'k8s1', title: 'Klokka og brøkdeler av sekunder',
        intro: [['0,3 s', 'Fange og skyte', 'Minst 0,3 s på klokka for å fange ballen og skyte.', 'b'], ['0,2 eller 0,1', 'Bare tip eller dunk', 'Med så lite tid kan ballen bare slås eller dunkes direkte.', 'b'], ['Kampklokke', 'Spilletiden', 'Den offisielle klokka for perioden.', 'b']],
        items: [
          mc('Kampklokken viser 0,2 sekunder ved et innkast i angrepsfeltet. Hvordan kan laget score?', ['Bare ved å slå eller dunke ballen direkte i kurven', 'Ved å fange ballen og skyte i samme bevegelse', 'Ved å fange ballen og ta et raskt hoppskudd', 'Det er ikke mulig å score på så kort tid'], 'Det trengs minst 0,3 sekunder for å fange og skyte. Med mindre tid kan laget bare score ved å slå eller dunke ballen direkte inn (en «tip-in»).'),
          num(() => ({ q: 'Hvor mange sekunder må kampklokken minst vise for at en spiller skal kunne fange ballen og skyte etter et innkast?', a: 0.3, u: 's', e: 'Kampklokken må vise 0,3 sekunder eller mer.', tol: 0 })),
          tf('Etter et siste straffekast som treffer ringen og blir lovlig slått i kurven av en spiller, gir målet 1 poeng, som et straffekast.', false, 'Når en spiller slår ballen i etter at den har truffet ringen, regnes det som et vanlig mål fra spill og gir 2 poeng.'),
          tf('Kampklokken viser 0,1 sekunder, og en spiller dunker ballen direkte fra innkastet. Målet kan godkjennes.', true, 'Forutsatt at hånden ikke lenger berører ballen når klokka viser 0,0.'),
          tf('En periode er slutt når kampklokkens signal lyder.', true, '§ 9.7. Har platen rødt lys, gjelder lyset foran lyden.'),
        ],
      },
      {
        id: 'k8s2', title: 'Tapt kamp',
        intro: [['20–0', 'Tapt kamp som straff', 'Når et lag ikke møter eller nekter å spille.', 'b'], ['2–0', 'Utfouling eller skade', 'Når laget har færre enn to spillere og ikke leder.', 'b'], ['15 minutter', 'Ventetid', 'Så lenge venter man på et lag som ikke har fem spillere.', 'b']],
        items: [
          mc('Et lag kan ikke stille fem spillere 15 minutter etter oppsatt kampstart. Hva blir resultatet?', ['Laget taper 0–20', 'Laget taper 0–2', 'Kampen utsettes', 'Kampen spilles med fire spillere'], 'Motstanderne vinner 20–0, og laget som taper får 0 poeng i tabellen.'),
          mc('Et lag har færre enn to spillere igjen på banen på grunn av utfouling. Motstanderne leder 61–55. Hva blir resultatet?', ['Stillingen står, 61–55', '20–0 til motstanderne', '2–0 til motstanderne', 'Kampen spilles på nytt'], 'Leder laget som får seieren, blir stillingen stående. Ellers blir resultatet 2–0. 20–0 gjelder tapt kamp på grunn av at et lag ikke stiller eller nekter å spille.'),
          mc('Et lag har færre enn to spillere igjen på grunn av skader. Motstanderne ligger under 40–44. Hva blir resultatet?', ['2–0 til motstanderne', '44–40', '20–0 til motstanderne', 'Uavgjort'], 'Leder ikke laget som får seieren, blir resultatet 2–0 i deres favør.'),
          tf('Et lag som taper på grunn av utfouling eller skade, får 1 poeng i tabellen.', true, 'Ved tapt kamp som straff (§ 20) får laget 0 poeng, ved utfouling eller skade (§ 21) 1 poeng.'),
        ],
      },
      {
        id: 'k8s3', title: 'IRS og dommere',
        // trinn med høyst tre nye begreper hver
        parts: [
          { title: 'IRS', intro: [0], items: [0, 1, 2] },
          { title: 'Dommere og sekretariat', intro: [1, 2, 3] },
        ],
        intro: [['IRS', 'Videoavspilling', 'Instant Replay System: dommerne ser på video.', 'b'], ['Førstedommer', 'Har siste ord', 'Dommeren med det overordnede ansvaret.', 'b'], ['Sekretariatet', 'Bordet ved siden av banen', 'Sekretær, tidtaker og skuddklokkeoperatør.', 'b'], ['Lagleder', 'Hovedtrener', 'Lagets trener, «head coach».', 'b']],
        items: [
          mc('Hva er IRS?', ['Videoavspilling som dommerne kan bruke til å kontrollere situasjoner', 'Et system som viser lagfouls og spillerfouls på resultattavla', 'Et elektronisk system som stopper skuddklokken automatisk', 'Et system der dommerne snakker med hverandre via headset'], 'IRS står for Instant Replay System. Dommerne bruker det til å kontrollere bestemte situasjoner på video.'),
          mc('Hvilken ny situasjon kan dommerne nå kontrollere med IRS når som helst i kampen (2026)?', ['Om det var ulovlig ballberøring eller påvirkning etter at en foul ble begått', 'Om det var foul eller ikke ved enhver kontakt mellom to spillere', 'Hvilket lag som fikk kontroll over ballen etter en hoppball', 'Om en spiller hadde riktig drakt og utstyr da kampen startet'], 'Det gjør det mulig å rette feil som direkte påvirker poengene.'),
          mc('Hva kan dommerne kontrollere med IRS i de siste 2 minuttene av 4. periode og i forlengning (nytt i 2026)?', ['Om ballen fortsatt var i hånden til innkasteren da forsvaret foulet', 'Om innkasteren tråkket på linjen da innkastet ble tatt', 'Hvor mange lagfouls hvert lag har fått i perioden', 'Om tilskuere forstyrret innkasteren før innkastet'], 'Det avgjør om det er en innkastfoul, som gir en egen straff.'),
          match([['Tidtaker', 'Kampklokken'], ['Skuddklokkeoperatør', 'Skuddklokken'], ['Sekretær', 'Kampskjemaet'], ['Førstedommer', 'Siste ord']], 'Koble rollen med oppgaven'),
          mc('Hva betyr «lagleder» i de norske spillereglene?', ['Lagets hovedtrener', 'Lagets kaptein', 'Lagets manager utenfor banen', 'Dommeren'], 'Lagleder tilsvarer «head coach» i de engelske reglene.'),
          tf('Fra 2026 gjelder alt reglene sier om «kommissær» også for en «teknisk delegat».', true, 'Dette ble presisert i § 1.1 i 2026.'),
        ],
      },
    ],
  };

  // ================================================================
  // ENHET 9 – BANEN OG UTSTYRET (tekniske detaljer)
  // ================================================================
  const k9 = {
    id: 'k9',
    title: 'Banen og utstyret',
    color: '#3949ab', dark: '#283593',
    goal: 'Tekniske detaljer: målene på banen, linjene og reglene for drakter og utstyr (§ 2–4).',
    guide: [
      ['Banen (§ 2)', 'Banen er 28 m lang og 15 m bred, målt fra innsiden av grenselinjene.\nMinst 2 m fritt område rundt banen.\nAlle linjer er 5 cm brede.\nNytt i 2026: linjene kan ha ulike farger, men alle grenselinjer må ha samme farge.'],
      ['Viktige mål', 'Midtsirkelen: radius 1,80 m.\nStraffekastlinjen: 5,80 m fra innerkanten av endelinjen, 3,60 m lang.\n3-poengslinjen: radius 6,75 m, og 0,90 m fra sidelinjene i hjørnene.\nCharging-fri halvsirkel: radius 1,30 m.'],
      ['Drakter (§ 4.3)', 'Draktnumre: 0, 00 og 1–99. Ingen like numre på samme lag.\nTrøya nedi buksa. Ermer må slutte over albuen.\nNytt i 2026: sokker i samme dominerende farge for hele laget.\nKompresjonsplagg i samme farge for hele laget.'],
    ],
    skills: [
      {
        id: 'k9s1', title: 'Banens mål',
        // trinn med høyst tre nye begreper hver
        parts: [
          { title: 'Banens størrelse og 3-poengslinjen', intro: [0, 1], items: [0, 1] },
          { title: 'Straffekastlinjen og midtsirkelen', intro: [2, 3] },
        ],
        intro: [['28 × 15 m', 'Banens størrelse', 'Målt fra innsiden av grenselinjene.', 'b'], ['6,75 m', '3-poengslinjen', 'Radius fra punktet rett under kurven.', 'b'], ['5,80 m', 'Straffekastlinjen', 'Fra innerkanten av endelinjen.', 'b'], ['1,80 m', 'Midtsirkelen', 'Radius til ytterkanten.', 'b']],
        items: [
          mc('Hvor stor er en basketballbane etter FIBA-reglene?', ['28 m × 15 m', '30 m × 15 m', '28 m × 17 m', '26 m × 14 m'], 'Banen er 28 m lang og 15 m bred, målt fra innsiden av grenselinjene.'),
          mc('Hvor langt er det fra punktet under kurvens sentrum til 3-poengslinjen (halvsirkelen)?', ['6,75 m', '6,25 m', '7,24 m', '5,80 m'], 'Radiusen er 6,75 m, målt til ytterkanten av linjen.'),
          mc('Hvor langt fra endelinjen ligger straffekastlinjen?', ['5,80 m', '4,60 m', '6,75 m', '5,00 m'], 'Avstanden er 5,80 m fra innerkanten av endelinjen til ytterkanten av straffekastlinjen. Straffekastlinjen er 3,60 m lang. 6,75 m er avstanden til 3-poengslinjen.'),
          mc('Hvor brede er linjene på banen?', ['5 cm', '3 cm', '10 cm', '8 cm'], 'Alle linjer er 5 cm brede og skal ha sterk kontrast til banen.'),
          mc('Hva er radiusen til midtsirkelen?', ['1,80 m', '1,25 m', '2,00 m', '3,60 m'], 'Midtsirkelen har radius 1,80 m. Det samme gjelder halvsirklene ved straffekastlinjene.'),
          mc('Hva er radiusen til den charging-frie halvsirkelen under kurven?', ['1,30 m', '1,80 m', '1,00 m', '2,45 m'], 'Halvsirkelen har radius 1,30 m fra punktet rett under kurvens sentrum.'),
          mc('Hvor stort fritt område skal det minst være rundt banen?', ['2 m', '1 m', '3 m', '50 cm'], 'Gulvet må derfor være minst 32 m × 19 m.'),
          tf('Fra 2026 kan banelinjer ha flere farger, men alle grenselinjer må ha samme farge.', true, 'FIBA ga mer fleksibilitet i linjefarger, men visse linjer må fortsatt matche.'),
          match([['Banens lengde', '28 m'], ['Banens bredde', '15 m'], ['3-poengslinjen', '6,75 m'], ['Straffekastlinjen', '5,80 m']], 'Koble målet med verdien'),
        ],
      },
      {
        id: 'k9s2', title: 'Drakter og utstyr',
        intro: [['0, 00, 1–99', 'Lovlige draktnumre', 'To på samme lag kan ikke ha samme nummer.', 'b'], ['Sokker', 'Samme farge (2026)', 'Alle på laget skal ha sokker i samme dominerende farge.', 'b'], ['Ermer', 'Over albuen', 'Langermede trøyer er ikke tillatt.', 'b']],
        items: [
          mc('Hvilke draktnumre er lovlige?', ['0, 00 og 1–99', 'Bare 4–15', '1–99', '0–100'], 'Lagene kan bruke 0, 00 og tallene fra 1 til 99.'),
          tf('To spillere på samme lag kan ha samme draktnummer hvis de ikke er på banen samtidig.', false, 'Spillere på samme lag kan aldri ha samme nummer.'),
          tf('Etter 2026-reglene er langermede spillertrøyer tillatt.', false, 'Har trøya ermer, må de slutte over albuen. Langermede trøyer er ikke tillatt.'),
          mc('Hva er nytt om sokker i reglene fra 2026?', ['Alle lagmedlemmer skal ha sokker i samme dominerende farge', 'Alle lagmedlemmer skal ha sokker i samme farge som draktene', 'Alle lagmedlemmer skal ha hvite eller svarte sokker', 'Alle lagmedlemmer skal ha sokker i samme farge som skoene'], 'Fra 2026 skal alle på laget ha sokker i samme dominerende farge. Det er ikke krav om at fargen skal være lik draktene.'),
          tf('Spillerne skal ha trøya nedi spillebuksa.', true, 'Alle spillere må ha trøya nedi buksa. Heldrakter er tillatt.'),
          mc('Hva gjelder for kompresjonsplagg på armer og bein?', ['Alle på samme lag skal ha samme farge', 'De er forbudt', 'De må være svarte', 'Hver spiller velger farge fritt'], 'Kompresjonsplagg skal ha samme farge for hele laget.'),
        ],
      },
    ],
  };

  // ================================================================
  // ENHET 10 – NORSKE TILPASNINGER FOR U13–U15 (NBBF)
  // Kilder: «Tilpasninger for EasyBasket U13 ordinært seriespill» (23.10.2025)
  // og «Regler U14 – U15» (2026).
  // ================================================================
  const k10 = {
    id: 'k10',
    title: 'Norske tilpasninger U13–U15',
    color: '#00cd9c', dark: '#00a57c',
    goal: 'NBBFs tilpasninger av spillereglene for U13 (EasyBasket ordinært seriespill), U14 og U15.',
    guide: [
      ['U13 – EasyBasket ordinært seriespill', '5 spillere på stor bane med ordinær kurvhøyde (3,05 m).\nSpilletid: 6 perioder à 5 minutter effektiv tid.\nBallstørrelse 5.\n8-sekunders- og 24-sekundersregelen brukes, men dommerne skal utvise skjønn. Tilbakespill-regelen brukes.\nDet er tillatt å ta ballen ut av hendene på en spiller som holder den med begge hender.\nIngen 3-poengere. Ingen ekstraomganger, kampen kan ende uavgjort.\nIngen screen for ballfører.\nPåbudt personlig oppdekning («mann-mot-mann»). Ikke soneforsvar eller sonepress (teknisk foul på lagleder).\nEtter scoring og innkast får lagene bare spille forsvar på egen banehalvdel.\nInnbytte: den som spiller mest, får bare spille én periode mer enn den som spiller minst. Ikke innbytte i periodene.\nHjemmelaget starter med innkast fra midtbanen.'],
      ['U14', 'Ordinære regler, med disse tilpasningene:\nBallstørrelse 6.\nIkke soneforsvar og ikke sonepress. Straff: teknisk foul på laglederen.\nPersonlig helbanepress er ikke tillatt når et lag leder med mer enn 20 poeng.'],
      ['U15', 'Ordinære regler, men ikke soneforsvar og ikke sonepress. Straff: teknisk foul på laglederen.'],
    ],
    skills: [
      {
        id: 'k10s1', title: 'U13 (EasyBasket)',
        // trinn med høyst tre nye begreper hver
        parts: [
          { title: 'U13: spilletid og ball', intro: [0, 1, 3], items: [0, 1, 2, 3] },
          { title: 'U13: forsvar og spill', intro: [2] },
        ],
        intro: [['6 × 5 min', 'Spilletid i U13', 'Seks perioder på fem minutter effektiv tid.', 'b'], ['Str. 5', 'Ballstørrelse i U13', 'U13 spiller med ball i størrelse 5.', 'b'], ['Mann-mot-mann', 'Påbudt forsvar', 'Lagene skal spille personlig oppdekning, ikke sone.', 'b'], ['Ingen 3-poengere', 'Alle skudd gir 2', 'U13 bruker ikke 3-poengsregelen.', 'b']],
        items: [
          mc('Hvordan er spilletiden i U13 ordinært seriespill?', ['6 perioder à 5 minutter effektiv tid', '4 perioder à 8 minutter effektiv tid', '6 perioder à 6 minutter effektiv tid', '4 perioder à 10 minutter effektiv tid'], 'NBBFs tilpasninger for U13 bruker 6 perioder à 5 minutter, slik at innbytteregelen kan følges.'),
          mc('Hvilken ballstørrelse brukes i U13?', ['5', '6', '7', '4'], 'U13 spiller med ballstørrelse 5.'),
          tf('I U13 ordinært seriespill gir et skudd utenfor 3-poengslinjen 3 poeng.', false, 'U13 bruker ikke 3-poengere.'),
          tf('En U13-kamp kan ende uavgjort.', true, 'Det spilles ingen ekstraomganger i U13.'),
          mc('Et U13-lag spiller soneforsvar. Hva er straffen?', ['Teknisk foul på laglederen', 'Teknisk foul på kapteinen', 'To straffekast og ball', 'Ingen straff'], 'Soneforsvar og sonepress er ikke tillatt.'),
          tf('I U13 er det tillatt å ta ballen ut av hendene på en spiller som holder den med begge hender.', true, 'Dette er en egen tilpasning for U13.'),
          mc('Hvor kan et U13-lag spille forsvar etter scoring og innkast?', ['Bare på egen banehalvdel', 'Over hele banen', 'Bare i 3-sekundersområdet', 'Hvor som helst, men bare med sone'], 'Lagene får bare spille forsvar på egen banehalvdel etter scoring og innkast.'),
          mc('Hva er innbytteregelen i U13?', ['Ingen får spille mer enn én periode mer enn den som spiller minst, og det byttes ikke i periodene', 'Ingen får spille mer enn to perioder mer enn den som spiller minst, og det byttes fritt', 'Alle må spille nøyaktig like mange perioder, og det byttes ikke i periodene', 'Innbytte er fritt i alle perioder, men alle må spille minst én hel periode'], 'Spilletiden fordeles jevnt: den som spiller mest, får bare spille én periode mer enn den som spiller minst. Det byttes ikke inne i periodene.'),
          tf('8-sekunders- og 24-sekundersregelen brukes i U13, men dommerne skal utvise skjønn.', true, 'Tilbakespill-regelen brukes også.'),
          tf('I U13 er det lov å sette screen for ballføreren.', false, 'Det skal ikke settes screen for ballfører i EasyBasket.'),
        ],
      },
      {
        id: 'k10s2', title: 'U14 og U15',
        intro: [['Str. 6', 'Ballstørrelse i U14', 'U14 spiller med ball i størrelse 6.', 'b'], ['Soneforsvar', 'Ikke lov i U14–U15', 'Straff: teknisk foul på laglederen.', 'b'], ['+20 poeng', 'Ikke helbanepress', 'I U14 kan et lag som leder med mer enn 20, ikke presse over hele banen.', 'b']],
        items: [
          mc('Hvilken ballstørrelse brukes i U14?', ['6', '5', '7', '4'], 'NBBFs tilpasning for U14.'),
          mc('Et U15-lag spiller sonepress. Hva er straffen?', ['Teknisk foul på laglederen', 'Personlig foul', 'Innkast til motstanderne', 'Ingen straff, det er lov i U15'], 'Soneforsvar og sonepress er ikke tillatt i U14 og U15.'),
          tf('I U14 kan et lag som leder med 25 poeng, fortsatt spille personlig helbanepress.', false, 'Personlig helbanepress er ikke tillatt når laget leder med mer enn 20 poeng.'),
          tf('I U15 brukes de ordinære spillereglene, men uten soneforsvar og sonepress.', true, 'Det er de eneste tilpasningene for U15.'),
          tf('Soneforsvar er tillatt i U14 hvis laget ligger under.', false, 'Soneforsvar er ikke tillatt i U14, uansett stilling.'),
          match([['U13', 'Ball str. 5'], ['U14', 'Ball str. 6'], ['U13–U15', 'Ikke soneforsvar'], ['U14, leder med over 20', 'Ikke helbanepress']], 'Koble aldersgruppen med regelen'),
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
    ['Soneforsvar', W('soneforsvar'), 'Forsvar der hver spiller dekker et område i stedet for en bestemt motspiller. Ikke tillatt i U13–U15.'],
    ['Sonepress', W('sonepress'), 'Soneforsvar som presser over hele eller store deler av banen. Ikke tillatt i U13–U15.'],
    ['Helbanepress', W('helbanepress'), 'Forsvar som presser motspillerne over hele banen.'],
    ['EasyBasket', W('easyBasket'), 'NBBFs tilpassede spilleform for de yngste aldersgruppene.'],
    ['Screen', W('screen'), 'En sperre: en angriper stiller seg lovlig i veien for en forsvarer for å frigjøre en medspiller.'],
  ].map(([t, m, d]) => ({ t, m, d }));

  window.BASKET = {
    id: 'basket',
    title: 'Basketballregler 2026',
    short: 'Basket',
    icon: 'ball',
    goalLabel: 'Hva du lærer',
    glossary,
    units: [k1, k2, k3, k4, k5, k6, k7, k8, k10, k9],
  };
})();
