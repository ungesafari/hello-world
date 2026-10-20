/* Fysikk 1 (LK20) – pugg formler, begreper, symboler og definisjoner.
 *
 * Veikartet følger kapitlene og teorivideoene i Flipclass. Hvert deltema har høyst tre nye
 * begreper (intro), og de blir til flashkort som repeteres med mellomrom (som i Anki).
 * Regneoppgavene er tatt ut av appen for nå og ligger i arkiv/course-fysikk1-med-regneoppgaver.js.
 *
 * intro: [term, navn, forklaring, type]   type: 'f' formel, 's' symbol, 'b' begrep
 * Oppgavetyper:
 *   mc(spørsmål, [riktig, feil, feil, ...], forklaring, {code, fig, svgOpts, src})  – flervalg, første er riktig
 *   tf(påstand, sant?, forklaring)                                                 – sant/usant
 *   bank(spørsmål, mal med ▢, [svar], [distraktorer], forklaring, {any, order})    – fyll inn / sett i rekkefølge
 *   match([[venstre, høyre], ...], spørsmål)                                        – koble par
 *
 * Filen er laget av et byggeskript ut fra den arkiverte kursfilen, men kan redigeres direkte.
 */
(function () {
  'use strict';

  const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const trim = (s) => (s.indexOf('.') >= 0 ? s.replace(/0+$/, '').replace(/\.$/, '') : s);
  // Formaterer tall med norsk desimalkomma og ca. 3 gjeldende siffer.
  function f(x, sig = 3) {
    if (!isFinite(x)) return String(x);
    if (x === 0) return '0';
    const neg = x < 0;
    const ax = Math.abs(x);
    let ex = Math.floor(Math.log10(ax));
    let out;
    if (ex >= 6 || ex <= -4) {
      let m = ax / Math.pow(10, ex);
      if (+m.toFixed(sig - 1) >= 10) { m /= 10; ex += 1; }
      out = trim(m.toFixed(sig - 1)).replace('.', ',') + ' · 10' + String(ex).split('').map((ch) => SUP[ch]).join('');
    } else {
      const d = Math.max(0, sig - 1 - ex);
      out = trim(ax.toFixed(d)).replace('.', ',');
    }
    return (neg ? '−' : '') + out;
  }


  const mc = (q, opts, e, extra = {}) => ({ t: 'mc', q, opts, e, ...extra });
  const tf = (q, ans, e) => ({ t: 'tf', q, ans, e });
  const bank = (q, tpl, ans, dis, e, extra = {}) => ({ t: 'bank', q, tpl, ans, dis, e, ...extra });

  // Små grafer som SVG. Fargen følger teksten, så de fungerer i mørk modus.
  // vt: v-t-graf gjennom punktene [[t, v], …] med t fra 0 til 2,4 s og v fra −12 til 12 m/s.
  // Tar enten punkter [[t, v], …] (rette linjestykker) eller en ferdig SVG-bane for krumme grafer.
  function vt(pts) {
    const X = (t) => 22 + t * 52, Y = (v) => 62 - v * 4.4;
    const path = typeof pts === 'string' ? pts : pts.map(([t, v], i) => `${i ? 'L' : 'M'}${X(t).toFixed(1)} ${Y(v).toFixed(1)}`).join(' ');
    return `<svg class="graph" viewBox="0 0 170 124" role="img" aria-label="v-t-graf"><g stroke="currentColor" fill="none" stroke-width="1.6">
      <path d="M22 116 V6 M14 62 H160" stroke-opacity=".7"/><path d="M19 10 l3 -6 l3 6 M156 59 l6 3 l-6 3" stroke-opacity=".7"/>
      <path d="M74 59 v6 M126 59 v6" stroke-opacity=".7"/><path d="${path}" stroke="#1cb0f6" stroke-width="2.6"/></g>
      <g fill="currentColor" font-size="11" font-family="inherit"><text x="27" y="12">v</text><text x="160" y="76">t</text><text x="66" y="77">1 s</text><text x="118" y="77">2 s</text></g></svg>`;
  }
  // v-t-grafen for sykkelturen i kapitteltestens oppgave 11.
  function bikeFig() {
    return `<svg class="graph wide" viewBox="0 0 240 130" role="img" aria-label="v-t-graf: farten øker fra 0 til 10 m/s på 100 s og synker til 0 ved 400 s"><g stroke="currentColor" fill="none" stroke-width="1.6">
      <path d="M40 110 V8 M34 104 H228" stroke-opacity=".7"/><path d="M37 12 l3 -6 l3 6 M224 101 l6 3 l-6 3" stroke-opacity=".7"/>
      <path d="M40 30 H86 M86 30 V104" stroke-opacity=".6" stroke-dasharray="3 3"/><path d="M40 104 L86 30 L218 104" stroke="#1cb0f6" stroke-width="2.6"/></g>
      <g fill="currentColor" font-size="11" font-family="inherit"><text x="46" y="12">v/(m/s)</text><text x="20" y="34">10</text><text x="76" y="120">100</text><text x="206" y="120">400</text><text x="214" y="96">t/s</text></g></svg>`;
  }
  // a-t-grafen i kapitteltestens oppgave 4, med punktene A, B, C og D.
  function atFig() {
    return `<svg class="graph wide" viewBox="0 0 220 120" role="img" aria-label="a-t-graf med punktene A, B, C og D"><g stroke="currentColor" fill="none" stroke-width="1.6">
      <path d="M24 112 V6 M18 80 H210" stroke-opacity=".7"/><path d="M21 10 l3 -6 l3 6 M206 77 l6 3 l-6 3" stroke-opacity=".7"/>
      <path d="M24 80 C40 20, 100 18, 128 80 C138 100, 156 100, 168 80" stroke="#1cb0f6" stroke-width="2.6"/></g>
      <g fill="currentColor" font-size="12" font-family="inherit"><text x="29" y="12">a</text><text x="206" y="96">t</text>
      <circle cx="24" cy="80" r="3"/><text x="10" y="96">A</text><circle cx="76" cy="35" r="3"/><text x="71" y="27">B</text>
      <circle cx="128" cy="80" r="3"/><text x="132" y="97">C</text><circle cx="160" cy="94" r="3"/><text x="160" y="112">D</text></g></svg>`;
  }
  const match = (pairs, q = 'Koble sammen parene') => ({ t: 'match', pairs, q });
  // order: sett stegene i riktig rekkefølge (stegene oppgis i riktig rekkefølge her)
  const order = (q, steps, dis, e) => ({ t: 'bank', order: true, q, tpl: steps.map(() => '▢').join('\n'), ans: steps, dis, e });


  // ================================================================
  // VITENSKAPELIG METODE OG MÅLEUSIKKERHET
  // ================================================================
  const unit_vm = {
    id: 'vm',
    title: 'Vitenskapelig metode og måleusikkerhet',
    color: '#7a8b99', dark: '#5b6873',
    goal: 'Forstå hvordan fysikere bruker hypoteser, modeller og målinger, og hvordan måleusikkerhet oppgis.',
    guide: [
      ['Vitenskapelig metode', 'En hypotese er en antakelse som kan testes.\nEn modell er en forenklet beskrivelse av virkeligheten.\nResultater kontrolleres av andre forskere (fagfellevurdering) og må kunne gjentas.'],
      ['Måleusikkerhet', 'En måling oppgis som verdi ± usikkerhet, for eksempel (2,50 ± 0,05) m.\nRelativ usikkerhet = usikkerhet / måleverdi.\nSvaret skal ikke ha flere gjeldende siffer enn den minst nøyaktige måleverdien.'],
    ],
    skills: [
      {
        id: 'vm-metode', title: 'Vitenskapelig metode',
        intro: [
          ['Hypotese', 'Testbar antakelse', 'En antakelse som kan testes med forsøk eller observasjoner.', 'b'],
          ['Modell', 'Forenklet beskrivelse', 'En forenklet beskrivelse av virkeligheten som gjør det mulig å forutsi resultater. Den gjelder bare innenfor forutsetningene sine.', 'b'],
          ['Fagfellevurdering', 'Kontroll før publisering', 'Andre forskere går gjennom metode og resultater før en artikkel publiseres.', 'b'],
        ],
        items: [
          mc('Hva skiller en vitenskapelig hypotese fra en vanlig påstand?', ['Den kan testes med forsøk eller observasjoner', 'Den er skrevet av en forsker med doktorgrad', 'Den er allerede bevist gjennom mange forsøk', 'Den bygger på en modell som alltid gjelder'], 'En hypotese må kunne testes, og den kan vise seg å være feil. Et bevist resultat er ikke lenger bare en hypotese.'),
          tf('En modell i fysikken beskriver virkeligheten nøyaktig, uten forenklinger.', false, 'En modell er alltid en forenkling, for eksempel at vi ser bort fra luftmotstand. Den gjelder bare innenfor forutsetningene sine.'),
        ],
      },
      {
        id: 'vm-usikkerhet', title: 'Måleusikkerhet',
        intro: [
          ['± Δx', 'Absolutt usikkerhet', 'Hvor mye en måling kan avvike, i samme enhet som målingen: (2,50 ± 0,05) m.', 's'],
          ['Δx / x', 'Relativ usikkerhet', 'Usikkerheten delt på måleverdien, ofte oppgitt i prosent.', 'f'],
          ['Gjeldende siffer', 'Sifrene som sier noe', 'Alle sifre unntatt nuller foran. Svaret skal ikke ha flere gjeldende siffer enn den minst nøyaktige måleverdien.', 'b'],
        ],
        items: [
          mc('Hvor mange gjeldende siffer har 0,0450 m?', ['3', '2', '4', '5'], 'Nullene foran teller ikke, men nullen til slutt gjør det: 4, 5 og 0.'),
          tf('Relativ usikkerhet har samme enhet som måleverdien.', false, 'Relativ usikkerhet er usikkerheten delt på måleverdien, så enheten forsvinner. Den oppgis ofte i prosent.'),
        ],
      },
    ],
  };

  // ================================================================
  // RETTLINJET BEVEGELSE
  // ================================================================
  const unit_rb = {
    id: 'rb',
    title: 'Rettlinjet bevegelse',
    color: '#58cc02', dark: '#58a700',
    goal: 'Eleven skal kunne utforske, analysere og forstå rettlinjet bevegelse, og bruke numeriske metoder og programmering til å modellere og utforske bevegelse i situasjoner der akselerasjonen ikke er konstant.',
    guide: [
      ['Grunnbegreper', 'Posisjon s (m), hastighet v (m/s) og akselerasjon a (m/s²).\nFart er størrelsen av hastigheten. Hastighet har både størrelse og retning.\nGjennomsnittsfart: v = Δs / Δt\nAkselerasjon: a = Δv / Δt\n1 m/s = 3,6 km/h'],
      ['De sju bevegelsesformlene', 'Formler ved konstant akselerasjon:\n1. a = (v − v₀)/t\n2. v = v₀ + at\n3. v̄ = (v₀ + v)/2\n4. s = v̄·t\n5. s = (v₀ + v)/2 · t\n6. s = v₀t + ½at²\n7. 2as = v² − v₀²'],
      ['Slik utleder du dem', 'Formel 1: definisjonen av akselerasjon når a er konstant.\nFormel 2: gang formel 1 med t og løs for v.\nFormel 3: farten øker lineært, så gjennomsnittet ligger midt mellom v₀ og v.\nFormel 4: definisjonen av gjennomsnittsfart, v̄ = s/t.\nFormel 5: sett formel 3 inn i formel 4. (Grafisk: trapesarealet under v-t-grafen.)\nFormel 6: sett formel 2 inn i formel 5.\nFormel 7: løs formel 1 for t, sett inn i formel 5 og bruk konjugatsetningen.\nVelg formelen som mangler den størrelsen du verken kjenner eller spør etter.'],
      ['Grafer', 's-t-graf: stigningstallet er hastigheten.\nv-t-graf: stigningstallet er akselerasjonen, og arealet under grafen er forflytningen.\na-t-graf: arealet under grafen er endringen i hastighet.'],
      ['Fritt fall', 'Uten luftmotstand faller alle legemer med a = g = 9,81 m/s² nedover, uansett masse.'],
      ['Numeriske metoder (Euler)', 'Når a ikke er konstant, deler vi tiden i små steg dt:\na = (formel for akselerasjonen)\nv = v + a·dt\ns = s + v·dt\nt = t + dt\nMindre dt gir mer nøyaktig resultat, men flere regnesteg.'],
    ],
    skills: [
      {
        id: 'rb-intro', title: 'Posisjon, fart og endring',
        intro: [
          ['s', 'Posisjon eller strekning', 'Hvor langt legemet er fra et valgt nullpunkt, eller hvor langt det har beveget seg. Enhet: meter (m).', 's'],
          ['v', 'Fart eller hastighet', 'Hvor fort (og i hvilken retning) legemet beveger seg. Enhet: m/s.', 's'],
          ['Δ', 'Delta: «endring i»', 'Δv = v − v₀ betyr endringen i fart. Δt betyr et tidsrom.', 's'],
        ],
        items: [
          mc('Hva er forskjellen på fart og hastighet?', ['Hastighet har retning, fart har bare størrelse', 'Fart har retning, hastighet har bare størrelse', 'Det er ingen forskjell i fysikk', 'Fart måles i m/s², hastighet i m/s'], 'Hastighet er en vektor (størrelse og retning). Fart er bare størrelsen.'),
          match([['s', 'm'], ['v', 'm/s'], ['a', 'm/s²'], ['t', 's']], 'Koble størrelsen med SI-enheten'),
        ],
      },
      {
        id: 'rb-gjfart', title: 'Gjennomsnittsfart',
        intro: [
          ['v̄ = Δs/Δt', 'Gjennomsnittsfart', 'Strekning delt på tid. Momentanfarten er stigningstallet til tangenten i s-t-grafen.', 'f'],
          ['s-t-graf', 'Posisjon mot tid', 'Stigningstallet er hastigheten.', 'b'],
          ['Stigningstall', 'Hvor bratt grafen er', 'Δy/Δx. For en v-t-graf: Δv/Δt = a.', 'b'],
        ],
        items: [
          tf('En s-t-graf som er en rett, skrå linje betyr konstant akselerasjon.', false, 'Rett skrå linje i s-t-graf betyr konstant hastighet (a = 0).'),
        ],
      },
      {
        id: 'rb-momfart', title: 'Momentanfart',
        intro: [
          ['Momentanfart', 'Farten i ett øyeblikk', 'Stigningstallet til tangenten i s-t-grafen i et bestemt punkt.', 'b'],
          ['v(t) = s′(t)', 'Fart er den deriverte av posisjonen', 'Stigningstallet til s(t) i hvert punkt.', 'f'],
        ],
        items: [
          mc('Hva gir stigningstallet til tangenten i et punkt på en s-t-graf?', ['Momentanhastigheten', 'Akselerasjonen', 'Gjennomsnittsfarten fra start', 'Strekningen'], 'Δs / Δt i et punkt er hastigheten akkurat da (momentanhastigheten).'),
          mc('En s-t-graf krummer oppover og blir brattere og brattere. Hva betyr det?', ['Hastigheten øker', 'Hastigheten avtar', 'Hastigheten er konstant', 'Legemet beveger seg bakover'], 'Brattere s-t-graf betyr større stigningstall, altså større hastighet.'),
          mc('Hvordan finner du v(t) når posisjonen s(t) er gitt?', ['Deriverer s(t)', 'Integrerer s(t)', 'Deler s(t) på t', 'Setter t = 0'], 'v(t) = s′(t).'),
        ],
      },
      {
        id: 'rb-gjaks', title: 'Gjennomsnittsakselerasjon',
        intro: [
          ['a = (v − v₀)/t', 'Formel 1: akselerasjon', 'Endring i fart per tid. Enhet: m/s².', 'f'],
          ['v-t-graf', 'Hastighet mot tid', 'Stigningstallet er akselerasjonen. Arealet under grafen er forflytningen.', 'b'],
          ['m/s²', 'Enheten for akselerasjon', 'Meter per sekund per sekund: hvor mange m/s farten endrer seg med hvert sekund.', 's'],
        ],
        items: [
          mc('Hva er SI-enheten for akselerasjon?', ['m/s²', 'm/s', 'N', 'km/h'], 'Akselerasjon er endring i hastighet per tid: (m/s)/s = m/s².'),
          tf('Hvis akselerasjonen er negativ, bremser legemet alltid ned.', false, 'Det kommer an på retningen til hastigheten. Er både v og a negative, øker farten.'),
          mc('Et legeme har negativ hastighet og negativ akselerasjon. Hva skjer med farten?', ['Farten øker', 'Farten avtar', 'Farten er konstant', 'Legemet står stille'], 'Når v og a har samme fortegn, peker de samme vei, og farten øker.'),
          mc('Hva er stigningstallet til en v-t-graf?', ['Akselerasjonen', 'Forflytningen', 'Posisjonen', 'Massen'], 'Stigningstall = Δv / Δt = a.'),
          mc('En v-t-graf er en vannrett linje over t-aksen. Hva betyr det?', ['Konstant hastighet forskjellig fra null', 'Legemet står i ro', 'Konstant akselerasjon forskjellig fra null', 'Legemet bremser'], 'v endrer seg ikke, så a = 0, men v > 0.'),
        ],
      },
      {
        id: 'rb-momaks', title: 'Momentan akselerasjon',
        intro: [
          ['Momentan akselerasjon', 'Akselerasjonen i ett øyeblikk', 'Stigningstallet til tangenten i v-t-grafen i et bestemt punkt.', 'b'],
          ['a(t) = v′(t)', 'Akselerasjon er den deriverte av farten', 'Stigningstallet til v(t) i hvert punkt.', 'f'],
        ],
        items: [
          mc('En partikkel beveger seg rettlinjet. Grafen viser akselerasjonen a som funksjon av tiden t. I hvilket punkt er farten størst?', ['C', 'B', 'A', 'D'], 'a > 0 betyr at farten øker, og a < 0 betyr at den avtar. Farten øker helt fram til C og avtar etterpå. I B øker farten raskest, men den fortsetter å øke etter B.', { fig: '<svg class="graph wide" viewBox="0 0 220 120" role="img" aria-label="a-t-graf med punktene A, B, C og D"><g stroke="currentColor" fill="none" stroke-width="1.6">\n      <path d="M24 112 V6 M18 80 H210" stroke-opacity=".7"/><path d="M21 10 l3 -6 l3 6 M206 77 l6 3 l-6 3" stroke-opacity=".7"/>\n      <path d="M24 80 C40 20, 100 18, 128 80 C138 100, 156 100, 168 80" stroke="#1cb0f6" stroke-width="2.6"/></g>\n      <g fill="currentColor" font-size="12" font-family="inherit"><text x="29" y="12">a</text><text x="206" y="96">t</text>\n      <circle cx="24" cy="80" r="3"/><text x="10" y="96">A</text><circle cx="76" cy="35" r="3"/><text x="71" y="27">B</text>\n      <circle cx="128" cy="80" r="3"/><text x="132" y="97">C</text><circle cx="160" cy="94" r="3"/><text x="160" y="112">D</text></g></svg>', src: 'Kapitteltest 4' }),
        ],
      },
      {
        id: 'rb-areal', title: 'Arealet under en v/t-graf',
        intro: [
          ['Areal under grafen', 'Høyde ganger bredde', 'Under en v-t-graf har arealet enheten (m/s)·s = m, altså strekning.', 'b'],
          ['Forflytning', 'Endring i posisjon', 'Arealet under v-t-grafen. Areal under t-aksen teller negativt.', 'b'],
        ],
        items: [
          mc('Hva forteller arealet under en v-t-graf?', ['Forflytningen', 'Akselerasjonen', 'Farten', 'Kraften'], 'Areal = v · t, som har enheten m. Det er forflytningen.'),
          mc('Hvilken geometrisk figur er arealet under v-t-grafen når farten øker jevnt fra v₀ til v?', ['Et trapes', 'En sirkel', 'Et kvadrat', 'En parabel'], 'Trapesarealet (v₀ + v)/2 · t er formel 5.'),
        ],
      },
      {
        id: 'rb-formel1', title: 'Bevegelsesformlene 2, 3 og 4',
        intro: [
          ['v = v₀ + at', 'Formel 2: fart', 'Farten etter tiden t når akselerasjonen er konstant.', 'f'],
          ['v̄ = (v₀ + v)/2', 'Formel 3: gjennomsnittsfart', 'Gjennomsnittsfarten ved konstant akselerasjon.', 'f'],
          ['s = v̄·t', 'Formel 4: strekning', 'Strekning er gjennomsnittsfart ganger tid.', 'f'],
        ],
        items: [
          mc('Når gjelder bevegelseslikningene (som s = v₀t + ½at²)?', ['Bare når akselerasjonen er konstant', 'Bare når farten er konstant', 'Bare når legemet starter fra ro', 'Alltid'], 'Alle de fire bevegelseslikningene forutsetter konstant akselerasjon.'),
          bank('Fullfør bevegelseslikningen', 'v = v₀ + ▢ · ▢', ['a', 't'], ['s', 'v', 'm'], 'v = v₀ + a·t: hastigheten øker med a for hvert sekund.', { any: true }),
        ],
      },
      {
        id: 'rb-formel2', title: 'Bevegelsesformlene 5, 6 og 7',
        intro: [
          ['s = (v₀ + v)/2 · t', 'Formel 5: strekning uten a', 'Formel 3 satt inn i formel 4.', 'f'],
          ['s = v₀t + ½at²', 'Formel 6: strekning uten v', 'Når du kjenner startfart, akselerasjon og tid.', 'f'],
          ['2as = v² − v₀²', 'Formel 7: den tidløse', 'Kobler fart og strekning uten tiden t.', 'f'],
        ],
        items: [
          mc('Du kjenner v₀, v og a, men ikke tiden. Hvilken likning bruker du for å finne strekningen?', ['2as = v² − v₀²', 'v = v₀ + at', 's = v₀t + ½at²', 's = ½(v₀ + v)t'], '2as = v² − v₀² er den eneste av likningene som ikke inneholder t.'),
          bank('Fullfør den tidløse likningen', '2 · ▢ · ▢ = v² − v₀²', ['a', 's'], ['t', 'v', 'g'], '2as = v² − v₀²', { any: true }),
          mc('Du kjenner v₀, v og t, men ikke akselerasjonen. Hvilken formel gir strekningen direkte?', ['s = (v₀ + v)/2 · t', 's = v₀t + ½at²', '2as = v² − v₀²', 'v = v₀ + at'], 'Formel 5 er den eneste strekningsformelen uten a.'),
          mc('Ei kule starter å trille fra ro på et skråplan med lengde s. Den bruker tiden t på strekningen s. Akselerasjonen er da gitt ved', ['a = 2s/t²', 'a = 2s/t', 'a = v/s', 'a = t²/(2s)'], 'Formel 6: s = v₀t + ½at². Med v₀ = 0 blir s = ½at². Ganger du med 2 og deler på t², får du a = 2s/t².', { src: 'Kapitteltest 8' }),
          match([['v = v₀ + at', 'Mangler s'], ['s = (v₀ + v)/2 · t', 'Mangler a'], ['s = v₀t + ½at²', 'Mangler v'], ['2as = v² − v₀²', 'Mangler t']], 'Koble formelen med størrelsen den ikke inneholder'),
        ],
      },
      {
        id: 'rb-utled', title: 'Utled bevegelsesformlene',
        intro: [
          ['Lineær fart', 'Farten øker jevnt', 'Ved konstant a er v-t-grafen en rett linje. Da er gjennomsnittsfarten midt mellom v₀ og v.', 'b'],
          ['Innsetting', 'Sett en formel inn i en annen', 'Slik får vi formel 5, 6 og 7.', 'b'],
        ],
        items: [
          bank('Utled formel 2: v = v₀ + at', '▢\n▢\n▢', ['Start med formel 1: a = (v − v₀)/t', 'Gang begge sider med t: at = v − v₀', 'Legg v₀ til på begge sider: v = v₀ + at'], ['v = at − v₀'], 'Formel 2 er bare formel 1 løst for v.', { order: true }),
          bank('Utled formel 3: v̄ = (v₀ + v)/2', '▢\n▢\n▢\n▢', ['Med konstant akselerasjon øker farten lineært med tiden', 'v-t-grafen er en rett linje fra v₀ til v', 'Gjennomsnittet av en lineær størrelse er gjennomsnittet av start- og sluttverdien', 'v̄ = (v₀ + v)/2'], ['v̄ = v − v₀'], 'Formel 3 gjelder bare når akselerasjonen er konstant.', { order: true }),
          bank('Utled formel 5: s = (v₀ + v)/2 · t', '▢\n▢\n▢', ['Start med formel 4: s = v̄·t', 'Sett inn formel 3: v̄ = (v₀ + v)/2', 's = (v₀ + v)/2 · t'], ['s = (v₀ − v)/2 · t'], 'Grafisk er dette arealet av trapeset under v-t-grafen.', { order: true }),
          bank('Utled formel 6: s = v₀t + ½at²', '▢\n▢\n▢\n▢\n▢', ['Start med formel 5: s = (v₀ + v)/2 · t', 'Sett inn formel 2: v = v₀ + at', 's = (v₀ + v₀ + at)/2 · t', 's = (2v₀ + at)/2 · t', 's = v₀t + ½at²'], ['s = v₀t + at²'], 'Vi erstatter v med v₀ + at og ganger ut.', { order: true }),
          bank('Utled formel 7: 2as = v² − v₀²', '▢\n▢\n▢\n▢', ['Løs formel 1 for t: t = (v − v₀)/a', 'Sett inn i formel 5: s = (v₀ + v)/2 · (v − v₀)/a', 'Gang begge sider med 2a: 2as = (v + v₀)(v − v₀)', 'Bruk konjugatsetningen: 2as = v² − v₀²'], ['2as = (v − v₀)²'], 'Ved å fjerne t får vi den tidløse formelen. (a + b)(a − b) = a² − b².', { order: true }),
          bank('Fullfør steget i utledningen av formel 6', 's = (v₀ + ▢)/2 · t', ['v₀ + at'], ['v − at', 'at', 'v'], 'Vi setter inn v = v₀ + at i formel 5.'),
          bank('Løs formel 1 for tiden', 't = (▢ − ▢)/a', ['v', 'v₀'], ['s', 'a', 't'], 'Fra a = (v − v₀)/t: t = (v − v₀)/a.'),
          bank('Fullfør det siste steget mot formel 7', '2as = (v + v₀)(▢)', ['v − v₀'], ['v + v₀', 'v₀ − v', 'at'], 'Konjugatsetningen gir (v + v₀)(v − v₀) = v² − v₀².'),
          bank('Fullfør formel 4 og 3', 's = ▢ · t\nv̄ = (v₀ + ▢)/2', ['v̄', 'v'], ['a', 's', 'v₀'], 's = v̄t, og ved konstant a er v̄ = (v₀ + v)/2.'),
          mc('Hvilken formel får du når du setter v = v₀ + at inn i s = (v₀ + v)/2 · t?', ['s = v₀t + ½at²', '2as = v² − v₀²', 's = v̄t', 'v̄ = (v₀ + v)/2'], 'Dette er formel 6.'),
          mc('Hva gjør du for å utlede den tidløse formelen 2as = v² − v₀²?', ['Løser formel 1 for t og setter inn i formel 5', 'Løser formel 1 for a og setter inn i formel 5', 'Løser formel 5 for t og setter inn i formel 4', 'Deriverer formel 6 med hensyn på tiden t'], 'Fra formel 1 er t = (v − v₀)/a. Setter du dette inn i formel 5, s = (v₀ + v)/2 · t, forsvinner t, og du får 2as = v² − v₀². Å løse for a ville gitt en formel uten a, ikke uten t.'),
          mc('Hvorfor gjelder v̄ = (v₀ + v)/2 bare når akselerasjonen er konstant?', ['Bare da øker farten lineært, så snittet ligger midt mellom v₀ og v', 'Bare da er startfarten v₀ null, så snittet blir halvparten av v', 'Bare da er strekningen proporsjonal med tiden, så snittet blir v/2', 'Bare da er farten konstant, så snittet blir lik både v₀ og v'], 'Ved konstant akselerasjon er v-t-grafen en rett linje, og da ligger gjennomsnittet midt mellom start og slutt. Øker farten ujevnt, kan gjennomsnittsfarten ligge hvor som helst mellom v₀ og v. Formelen krever verken v₀ = 0 eller konstant fart.'),
          tf('Formel 6 og 7 er utledet ved å sette formel 1 eller 2 inn i formel 5.', true, 'Formel 6: sett inn v = v₀ + at. Formel 7: sett inn t = (v − v₀)/a.'),
        ],
      },
      {
        id: 'rb-param', title: 'Parameterfremstilling',
        intro: [
          ['s(t)', 'Posisjon som funksjon av tid', 'En formel som gir posisjonen for hvert tidspunkt t.', 'f'],
          ['v(t) = 0', 'Snupunktet', 'Legemet snur når farten skifter fortegn.', 'f'],
        ],
        items: [
          mc('Hvordan finner du tidspunktet der legemet snur?', ['Løser v(t) = 0', 'Løser s(t) = 0', 'Løser a(t) = 0', 'Setter t = 0'], 'I snupunktet er farten null.'),
          mc('Posisjonen er s(t) = 3t − 0,5t². Hva er akselerasjonen?', ['−1 m/s², konstant', '3 m/s²', '−0,5 m/s²', 'Den endrer seg med tiden'], 'v(t) = 3 − t og a(t) = −1.'),
          bank('Deriver posisjonen', 's(t) = 3t − 0,5t²\nv(t) = ▢ − ▢', ['3', 't'], ['0,5t', '1,5', 't²'], 'Den deriverte av 3t er 3, og av 0,5t² er t.'),
          tf('Er s(t) et andregradspolynom i t, er akselerasjonen konstant.', true, 'Den andrederiverte av et andregradspolynom er en konstant.'),
          mc('Tea løper etter en buss som akselererer fra ro. Hvordan finner du ut om hun tar den igjen?', ['Setter s_T(t) = s_B(t) og sjekker om likningen har en løsning', 'Setter v_T(t) = v_B(t) og sjekker om likningen har en løsning', 'Setter a_T(t) = a_B(t) og sjekker om likningen har en løsning', 'Setter s_B(t) = 0 og sjekker om Tea da har løpt lengst'], 'Hun tar bussen igjen hvis de er på samme sted samtidig, altså hvis posisjonene er like for en verdi av t. Lik fart betyr bare at avstanden mellom dem slutter å minke.'),
        ],
      },
      {
        id: 'rb-fritt', title: 'Fritt fall',
        intro: [
          ['g', 'Tyngdeakselerasjonen', '9,81 m/s² nedover nær jordoverflaten.', 's'],
          ['Fritt fall', 'Bare tyngden virker', 'Uten luftmotstand faller alle legemer med samme akselerasjon g.', 'b'],
        ],
        items: [
          mc('Vi ser bort fra luftmotstand. En hammer og en fjær slippes samtidig fra samme høyde. Hva skjer?', ['De treffer bakken samtidig', 'Hammeren lander først', 'Fjæra lander først', 'Det avhenger av høyden'], 'I fritt fall har alle legemer samme akselerasjon g, uansett masse.'),
          mc('Vi kaster en ball rett oppover med farten 10 m/s og ser bort fra luftmotstand, samme situasjon som i oppgave 1. Akselerasjonen er', ['10 m/s² nedover i hele kastet', '10 m/s² nedover i hele kastet, unntatt på toppen der den er 0 m/s²', '−10 m/s² på vei opp, 10 m/s² på vei ned og 0 m/s² på toppen', 'varierende hele tiden'], 'I fritt fall er akselerasjonen konstant og rettet nedover mot jordas sentrum. Også på toppen endrer farten seg, selv om den akkurat da er null.', { src: 'Kapitteltest 2' }),
          mc('Vi kaster en ball rett oppover med farten 10 m/s og ser bort fra luftmotstand, samme situasjon som i oppgave 1 og 2. Hvilken graf viser farten v som funksjon av tiden t?', ['<svg class="graph" viewBox="0 0 170 124" role="img" aria-label="v-t-graf"><g stroke="currentColor" fill="none" stroke-width="1.6">\n      <path d="M22 116 V6 M14 62 H160" stroke-opacity=".7"/><path d="M19 10 l3 -6 l3 6 M156 59 l6 3 l-6 3" stroke-opacity=".7"/>\n      <path d="M74 59 v6 M126 59 v6" stroke-opacity=".7"/><path d="M22.0 18.0 L126.0 106.0" stroke="#1cb0f6" stroke-width="2.6"/></g>\n      <g fill="currentColor" font-size="11" font-family="inherit"><text x="27" y="12">v</text><text x="160" y="76">t</text><text x="66" y="77">1 s</text><text x="118" y="77">2 s</text></g></svg>', '<svg class="graph" viewBox="0 0 170 124" role="img" aria-label="v-t-graf"><g stroke="currentColor" fill="none" stroke-width="1.6">\n      <path d="M22 116 V6 M14 62 H160" stroke-opacity=".7"/><path d="M19 10 l3 -6 l3 6 M156 59 l6 3 l-6 3" stroke-opacity=".7"/>\n      <path d="M74 59 v6 M126 59 v6" stroke-opacity=".7"/><path d="M22.0 18.0 L74.0 62.0 L126.0 18.0" stroke="#1cb0f6" stroke-width="2.6"/></g>\n      <g fill="currentColor" font-size="11" font-family="inherit"><text x="27" y="12">v</text><text x="160" y="76">t</text><text x="66" y="77">1 s</text><text x="118" y="77">2 s</text></g></svg>', '<svg class="graph" viewBox="0 0 170 124" role="img" aria-label="v-t-graf"><g stroke="currentColor" fill="none" stroke-width="1.6">\n      <path d="M22 116 V6 M14 62 H160" stroke-opacity=".7"/><path d="M19 10 l3 -6 l3 6 M156 59 l6 3 l-6 3" stroke-opacity=".7"/>\n      <path d="M74 59 v6 M126 59 v6" stroke-opacity=".7"/><path d="M22.0 62.0 L74.0 18.0 L126.0 62.0" stroke="#1cb0f6" stroke-width="2.6"/></g>\n      <g fill="currentColor" font-size="11" font-family="inherit"><text x="27" y="12">v</text><text x="160" y="76">t</text><text x="66" y="77">1 s</text><text x="118" y="77">2 s</text></g></svg>', '<svg class="graph" viewBox="0 0 170 124" role="img" aria-label="v-t-graf"><g stroke="currentColor" fill="none" stroke-width="1.6">\n      <path d="M22 116 V6 M14 62 H160" stroke-opacity=".7"/><path d="M19 10 l3 -6 l3 6 M156 59 l6 3 l-6 3" stroke-opacity=".7"/>\n      <path d="M74 59 v6 M126 59 v6" stroke-opacity=".7"/><path d="M22.0 18.0 L141.6 18.0" stroke="#1cb0f6" stroke-width="2.6"/></g>\n      <g fill="currentColor" font-size="11" font-family="inherit"><text x="27" y="12">v</text><text x="160" y="76">t</text><text x="66" y="77">1 s</text><text x="118" y="77">2 s</text></g></svg>'], 'Med positiv retning oppover gir formel 2, v = v₀ + at = 10 − 10t, en rett linje med negativt stigningstall. Farten er 0 etter 1 s og −10 m/s etter 2 s.', { svgOpts: true, src: 'Kapitteltest 3' }),
          mc('En ball slippes fra stor høyde. Vi tar hensyn til luftmotstanden. Hvilken graf viser farten v som funksjon av tiden t?', ['<svg class="graph" viewBox="0 0 170 124" role="img" aria-label="v-t-graf"><g stroke="currentColor" fill="none" stroke-width="1.6">\n      <path d="M22 116 V6 M14 62 H160" stroke-opacity=".7"/><path d="M19 10 l3 -6 l3 6 M156 59 l6 3 l-6 3" stroke-opacity=".7"/>\n      <path d="M74 59 v6 M126 59 v6" stroke-opacity=".7"/><path d="M22 62 C 50 20, 80 24, 150 24" stroke="#1cb0f6" stroke-width="2.6"/></g>\n      <g fill="currentColor" font-size="11" font-family="inherit"><text x="27" y="12">v</text><text x="160" y="76">t</text><text x="66" y="77">1 s</text><text x="118" y="77">2 s</text></g></svg>', '<svg class="graph" viewBox="0 0 170 124" role="img" aria-label="v-t-graf"><g stroke="currentColor" fill="none" stroke-width="1.6">\n      <path d="M22 116 V6 M14 62 H160" stroke-opacity=".7"/><path d="M19 10 l3 -6 l3 6 M156 59 l6 3 l-6 3" stroke-opacity=".7"/>\n      <path d="M74 59 v6 M126 59 v6" stroke-opacity=".7"/><path d="M22.0 62.0 L141.6 18.0" stroke="#1cb0f6" stroke-width="2.6"/></g>\n      <g fill="currentColor" font-size="11" font-family="inherit"><text x="27" y="12">v</text><text x="160" y="76">t</text><text x="66" y="77">1 s</text><text x="118" y="77">2 s</text></g></svg>', '<svg class="graph" viewBox="0 0 170 124" role="img" aria-label="v-t-graf"><g stroke="currentColor" fill="none" stroke-width="1.6">\n      <path d="M22 116 V6 M14 62 H160" stroke-opacity=".7"/><path d="M19 10 l3 -6 l3 6 M156 59 l6 3 l-6 3" stroke-opacity=".7"/>\n      <path d="M74 59 v6 M126 59 v6" stroke-opacity=".7"/><path d="M22 62 Q 74 -10 126 62" stroke="#1cb0f6" stroke-width="2.6"/></g>\n      <g fill="currentColor" font-size="11" font-family="inherit"><text x="27" y="12">v</text><text x="160" y="76">t</text><text x="66" y="77">1 s</text><text x="118" y="77">2 s</text></g></svg>', '<svg class="graph" viewBox="0 0 170 124" role="img" aria-label="v-t-graf"><g stroke="currentColor" fill="none" stroke-width="1.6">\n      <path d="M22 116 V6 M14 62 H160" stroke-opacity=".7"/><path d="M19 10 l3 -6 l3 6 M156 59 l6 3 l-6 3" stroke-opacity=".7"/>\n      <path d="M74 59 v6 M126 59 v6" stroke-opacity=".7"/><path d="M22.0 62.0 L141.6 106.0" stroke="#1cb0f6" stroke-width="2.6"/></g>\n      <g fill="currentColor" font-size="11" font-family="inherit"><text x="27" y="12">v</text><text x="160" y="76">t</text><text x="66" y="77">1 s</text><text x="118" y="77">2 s</text></g></svg>'], 'I starten er farten liten, og dermed også luftmotstanden. Farten øker da nesten som en rett linje, med a ≈ g. Luftmotstanden øker med farten, så akselerasjonen avtar, og farten nærmer seg en konstant terminalfart. En rett linje oppover gjelder bare uten luftmotstand.', { svgOpts: true, src: 'Kapitteltest 7' }),
        ],
      },
    ],
  };

  // ================================================================
  // NEWTONS LOVER
  // ================================================================
  const unit_nl = {
    id: 'nl',
    title: 'Newtons lover',
    color: '#1cb0f6', dark: '#1899d6',
    goal: 'Eleven skal kunne forstå sammenhenger mellom krefter og bruke dem til å gjøre beregninger, og bruke numeriske metoder og programmering til å modellere og utforske bevegelse i situasjoner der akselerasjonen ikke er konstant.',
    guide: [
      ['Newtons tre lover', '1. lov: Er ΣF = 0, er legemet i ro eller beveger seg med konstant hastighet.\n2. lov: ΣF = m·a\n3. lov: Når A virker på B med en kraft, virker B på A med en like stor, motsatt rettet kraft. Kraft og motkraft virker på hvert sitt legeme.'],
      ['Vanlige krefter', 'Tyngde: G = m·g\nNormalkraft N: står vinkelrett på underlaget.\nFriksjon: R = μ·N\nLuftmotstand: L = k·v (lav fart) eller L = k·v² (høy fart)\nSnordrag S: virker langs snora.'],
      ['Heis', 'Akselerasjon oppover: N = m(g + a)\nAkselerasjon nedover: N = m(g − a)\nKonstant fart: N = mg'],
      ['Skråplan', 'Tyngden deles i to komponenter:\nG∥ = mg·sin α (nedover langs planet)\nG⊥ = mg·cos α (inn mot planet)\nN = mg·cos α\nUten friksjon: a = g·sin α'],
      ['Terminalfart', 'Når luftmotstanden blir like stor som tyngden, er ΣF = 0 og farten konstant.\nMed L = kv²:\nv_t = √(mg/k)'],
    ],
    skills: [
      {
        id: 'nl-kraft', title: 'Kraftbegrepet',
        intro: [
          ['F', 'Kraft', 'En påvirkning som kan endre bevegelsen. Enhet: newton (N).', 's'],
          ['ΣF', 'Kraftsum', 'Summen av alle kreftene som virker på legemet.', 's'],
          ['1 N', 'Én newton', '1 kg·m/s²: kraften som gir 1 kg akselerasjonen 1 m/s².', 'b'],
        ],
        items: [
          mc('1 N er det samme som …', ['1 kg·m/s²', '1 kg·m/s', '1 kg·m²/s²', '1 J/s'], 'F = ma gir enheten kg · m/s².'),
        ],
      },
      {
        id: 'nl-lover', title: 'Newtons 1. og 3. lov',
        intro: [
          ['N1', 'Newtons 1. lov', 'ΣF = 0 betyr i ro eller konstant hastighet.', 'b'],
          ['N3', 'Newtons 3. lov', 'Kraft og motkraft er like store, motsatt rettet og virker på hvert sitt legeme.', 'b'],
        ],
        items: [
          mc('Hva sier Newtons 1. lov?', ['Er kraftsummen null, er legemet i ro eller har konstant hastighet', 'Er kraftsummen null, er legemet i ro, og det kan ikke bevege seg', 'Er kraftsummen konstant, har legemet konstant hastighet', 'Er legemet i bevegelse, må det virke en kraft i bevegelsesretningen'], 'Newtons 1. lov kalles også treghetsloven. Et legeme trenger ingen kraft for å holde farten, bare for å endre den. En konstant kraftsum gir konstant akselerasjon, ikke konstant hastighet.'),
          mc('Hva sier Newtons 3. lov?', ['Kraften A virker på B med, er like stor og motsatt rettet som kraften B virker på A med', 'Kraften A virker på B med, er like stor og motsatt rettet som tyngden til B', 'Kraft og motkraft er like store og motsatt rettet, men bare når A og B står i ro', 'Kraft og motkraft virker begge veier, men den tyngste av A og B virker med størst kraft'], 'Kraft og motkraft er alltid like store og motsatt rettet, også når legemene beveger seg eller har ulik masse. De virker på hvert sitt legeme, så de kan ikke oppheve hverandre. At en kraft er like stor som tyngden, gjelder bare i likevekt, og det følger av Newtons 1. lov, ikke 3. lov.'),
          mc('En bok ligger i ro på et bord. Hva er motkraften (etter Newtons 3. lov) til tyngden av boka?', ['Kraften fra boka som trekker jorda oppover', 'Normalkraften fra bordet som skyver boka oppover', 'Kraften fra boka som skyver bordet nedover', 'Kraften fra jorda som trekker bordet nedover'], 'Tyngden er jorda som trekker i boka. Motkraften er derfor boka som trekker i jorda, med like stor kraft. Normalkraften virker også på boka og er like stor som tyngden, men den er en annen kraft, og likheten skyldes Newtons 1. lov.'),
          tf('Et legeme som beveger seg med konstant hastighet, har kraftsum lik null.', true, 'Newtons 1. lov: konstant hastighet ⇔ ΣF = 0.'),
          tf('Kraft og motkraft virker på det samme legemet.', false, 'De virker alltid på to forskjellige legemer. Derfor kan de ikke oppheve hverandre.'),
          match([['Newtons 1. lov', 'ΣF = 0 ⇔ konstant v'], ['Newtons 2. lov', 'ΣF = m·a'], ['Newtons 3. lov', 'Kraft og motkraft'], ['1 newton', '1 kg·m/s²']], 'Koble sammen parene'),
          mc('Du sitter i en buss som bremser brått, og kroppen din «kastes» framover. Hvilken lov forklarer dette best?', ['Newtons 1. lov', 'Newtons 2. lov', 'Newtons 3. lov', 'Loven om bevaring av energi'], 'Treghetsloven: kroppen fortsetter med samme hastighet når bussen bremser, helt til setet eller beltet gir den en kraft bakover. Ingen kraft dytter deg framover.'),
        ],
      },
      {
        id: 'nl-n2', title: 'Newtons 2. lov og tyngde',
        intro: [
          ['ΣF = m·a', 'Newtons 2. lov', 'Kraftsummen er masse ganger akselerasjon.', 'f'],
          ['m', 'Masse', 'Hvor mye stoff legemet har. Enhet: kg.', 's'],
          ['G = m·g', 'Tyngde', 'Kraften fra jorda på et legeme.', 'f'],
        ],
        items: [
          bank('Fullfør Newtons 2. lov', 'ΣF = ▢ · ▢', ['m', 'a'], ['v', 'g', 's'], 'Kraftsummen er masse ganger akselerasjon.', { any: true }),
          tf('Dobler du massen til et legeme og holder kraftsummen lik, dobles akselerasjonen.', false, 'a = ΣF/m. Dobbel masse med samme kraftsum gir halv akselerasjon, ikke dobbel.'),
          mc('En heis beveger seg oppover med konstant fart. Hvordan er snordraget S sammenliknet med tyngden G?', ['S = G', 'S > G', 'S < G', 'S = 0'], 'Konstant fart betyr a = 0, så ΣF = S − G = 0.'),
        ],
      },
      {
        id: 'nl-friksjon', title: 'Friksjon og normalkraft',
        intro: [
          ['N', 'Normalkraft', 'Kraft fra underlaget, vinkelrett ut fra det.', 's'],
          ['R = μN', 'Friksjon', 'Friksjonskraften er friksjonstallet ganger normalkraften.', 'f'],
          ['μ', 'Friksjonstall', 'Tall uten enhet som sier hvor «ru» flatene er.', 's'],
        ],
        items: [
          tf('Friksjonskraften virker motsatt vei av bevegelsen (eller tendensen til bevegelse) langs underlaget.', true, 'Friksjon motvirker den relative bevegelsen mellom flatene.'),
          mc('Friksjonstallet μ mellom en kasse og gulvet er 0,3. Hva betyr det?', ['Friksjonskraften er 0,3 ganger normalkraften', 'Friksjonskraften er 0,3 ganger farten til kassa', 'Friksjonskraften er 0,3 ganger massen til kassa', 'Friksjonskraften er 0,3 newton for hver meter'], 'R = μN. Friksjonstallet har ingen enhet og sier hvor stor friksjonen er i forhold til normalkraften. På vannrett underlag er N = mg, så friksjonen avhenger av tyngden, ikke av massen alene.'),
        ],
      },
      {
        id: 'nl-luft', title: 'Luftmotstand',
        intro: [
          ['L = kv²', 'Luftmotstand', 'Luftmotstanden øker med kvadratet av farten.', 'f'],
          ['Terminalfart', 'Konstant sluttfart', 'Farten der luftmotstanden er like stor som tyngden, så ΣF = 0 og farten slutter å øke.', 'b'],
        ],
        items: [
          mc('Hva er terminalfarten til en fallskjermhopper?', ['Farten der luftmotstanden er like stor som tyngden, så farten er konstant', 'Farten der luftmotstanden er større enn tyngden, så farten synker', 'Farten der tyngden forsvinner, så bare luftmotstanden virker', 'Farten der akselerasjonen er størst, rett før skjermen åpnes'], 'Ved terminalfarten er ΣF = 0, så a = 0 og farten er konstant. Tyngden forsvinner ikke, den blir bare balansert av luftmotstanden.'),
          mc('Hva skjer med akselerasjonen til en fallskjermhopper før skjermen utløses?', ['Den avtar fra g mot null', 'Den er konstant lik g', 'Den øker', 'Den er null hele tiden'], 'Luftmotstanden øker med farten, så kraftsummen og dermed a avtar.'),
        ],
      },
      {
        id: 'nl-skraplan', title: 'Skråplan',
        intro: [
          ['α', 'Helningsvinkel', 'Vinkelen mellom skråplanet og vannrett.', 's'],
          ['G∥ = mg·sin α', 'Tyngden langs planet', 'Komponenten som drar legemet nedover skråplanet.', 'f'],
          ['G⊥ = mg·cos α', 'Tyngden inn mot planet', 'Komponenten som presser mot underlaget. N = G⊥.', 'f'],
        ],
        items: [
          mc('En kloss glir på et friksjonsfritt skråplan. Hva er akselerasjonen uavhengig av?', ['Massen til klossen', 'Helningsvinkelen', 'Tyngdeakselerasjonen g', 'Ingen av delene'], 'a = g·sin α. Massen forkortes bort.'),
          mc('Hva skjer med normalkraften på en kloss når helningsvinkelen til skråplanet øker?', ['Den avtar', 'Den øker', 'Den er uendret', 'Den blir lik tyngden'], 'N = mg·cos α, og cos α avtar når α øker.'),
          bank('Fullfør uttrykket for tyngdekomponenten langs skråplanet', 'G∥ = m · g · ▢', ['sin α'], ['cos α', 'tan α', 'α'], 'Komponenten langs planet er mg·sin α.'),
        ],
      },
      {
        id: 'nl-system', title: 'Sammensatte systemer',
        intro: [
          ['S', 'Snordrag', 'Kraften fra en snor, rettet langs snora.', 's'],
          ['Indre krefter', 'Krefter mellom delene', 'Snordrag mellom to klosser er indre krefter for systemet. De faller bort når vi ser på systemet som helhet.', 'b'],
          ['ΣF = (m₁ + m₂)·a', 'Newtons 2. lov for hele systemet', 'Når delene henger sammen og har samme akselerasjon, bruker vi den totale massen og bare de ytre kreftene.', 'f'],
        ],
        items: [
          mc('To klosser henger sammen med en snor og trekkes bortover. Hvilke krefter tar du med i ΣF når du ser på begge klossene som ett system?', ['Bare de ytre kreftene, ikke snordraget mellom klossene', 'Alle kreftene, også snordraget mellom klossene', 'Bare snordraget, fordi det holder systemet sammen', 'Bare tyngden og normalkraften på hver kloss'], 'Snordraget mellom klossene er en indre kraft. Det virker like mye på begge klossene i hver sin retning og faller bort for systemet som helhet.'),
        ],
      },
    ],
  };

  // ================================================================
  // MEKANISK ENERGI
  // ================================================================
  const unit_me = {
    id: 'me',
    title: 'Mekanisk energi',
    color: '#ff9600', dark: '#cc7900',
    goal: 'Eleven skal kunne forstå sammenhenger mellom krefter, bevegelse og energi og bruke dem til å gjøre beregninger, forstå og gjøre rede for konsekvenser av at energi er bevart og bruke dette i beregninger, og utforske hvordan energi kan gå fra en form til en annen og vurdere energikvalitet og virkningsgrad i slike overganger.',
    guide: [
      ['Arbeid og effekt', 'Arbeid: W = F·s·cos α (J)\nEffekt: P = W/t (W = J/s)\n1 kWh = 3,6 MJ'],
      ['Energiformer', 'Kinetisk energi: E_k = ½mv²\nPotensiell energi: E_p = mgh (nullnivået kan velges fritt)\nMekanisk energi: E = E_k + E_p'],
      ['Bevaring', 'Når bare tyngdekraften gjør arbeid, er mekanisk energi bevart:\n½mv₀² + mgh₀ = ½mv² + mgh\nArbeid-energi-setningen: ΣW = ΔE_k\nFriksjon gjør mekanisk energi om til indre energi (varme).'],
      ['Virkningsgrad og energikvalitet', 'η = nyttig energi / tilført energi\nEnergi blir aldri borte, men energikvaliteten synker ved omforming. Elektrisk og mekanisk energi har høy kvalitet. Varme ved lav temperatur har lav kvalitet.'],
    ],
    skills: [
      {
        id: 'me-arbeid', title: 'Arbeid',
        intro: [
          ['W = F·s·cos α', 'Arbeid', 'Energien en kraft overfører. Enhet: joule (J).', 'f'],
          ['J', 'Joule', 'Enheten for energi og arbeid. 1 J = 1 N·m.', 's'],
        ],
        items: [
          mc('Du bærer en sekk vannrett bortover med konstant fart. Hvor mye arbeid gjør du på sekken i fysisk forstand?', ['Null', 'Like mye som tyngden ganger strekningen', 'Det avhenger av farten', 'Negativt arbeid'], 'Kraften din er rettet oppover, vinkelrett på forflytningen. cos 90° = 0.'),
          mc('Når gjør en kraft negativt arbeid?', ['Når kraften har en komponent motsatt av bevegelsesretningen', 'Når kraften har en komponent vinkelrett på bevegelsesretningen', 'Når kraften er mindre enn de andre kreftene som virker', 'Når kraften virker på et legeme som står helt i ro'], 'W = F · s · cos α. Er vinkelen større enn 90°, er cos α < 0 og arbeidet negativt. Friksjon gjør typisk negativt arbeid. En kraft vinkelrett på bevegelsen gjør null arbeid, og står legemet i ro, er s = 0.'),
        ],
      },
      {
        id: 'me-kin', title: 'Kinetisk energi',
        intro: [
          ['E_k = ½mv²', 'Kinetisk energi', 'Bevegelsesenergi.', 'f'],
        ],
        items: [
          mc('Farten til en bil dobles. Hva skjer med den kinetiske energien?', ['Den blir 4 ganger så stor', 'Den blir 2 ganger så stor', 'Den blir 8 ganger så stor', 'Den blir √2 ganger så stor'], 'E_k = ½mv². Når v blir 2v, blir v² til 4v², så energien blir 4 ganger så stor. Derfor blir bremselengden også 4 ganger så lang.'),
          bank('Fullfør formelen for kinetisk energi', 'E_k = ½ · ▢ · ▢', ['m', 'v²'], ['v', 'g', 'h'], 'E_k = ½mv²', { any: true }),
        ],
      },
      {
        id: 'me-totarb', title: 'Totalt arbeid',
        intro: [
          ['W_tot = ΔE_k', 'Arbeid-energi-setningen', 'Det totale arbeidet fra alle kreftene er lik endringen i kinetisk energi.', 'f'],
        ],
        items: [
          bank('Utled uttrykket for kinetisk energi (arbeid-energi-setningen)', '▢\n▢\n▢\n▢\n▢', ['Arbeidet fra kraftsummen er W = F·s', 'Newtons 2. lov: F = m·a', 'W = m·a·s', 'Formel 7 gir a·s = (v² − v₀²)/2', 'W = ½mv² − ½mv₀² = ΔE_k'], ['W = m·v·s'], 'Arbeidet fra kraftsummen er lik endringen i kinetisk energi.', { order: true }),
        ],
      },
      {
        id: 'me-pot', title: 'Potensiell energi',
        intro: [
          ['E_p = mgh', 'Potensiell energi', 'Stillingsenergi i tyngdefeltet.', 'f'],
          ['h', 'Høyde', 'Høyden over et nullnivå du velger selv.', 's'],
          ['Nullnivå', 'Der h = 0', 'Kan velges fritt. Bare endringer i E_p betyr noe.', 'b'],
        ],
        items: [
          mc('Hvor må nullnivået for potensiell energi ligge?', ['Det kan velges fritt', 'Alltid ved havnivå', 'Alltid på bakken', 'Alltid i jordas sentrum'], 'Det er bare endringer i E_p som betyr noe fysisk.'),
          bank('Fullfør formelen for potensiell energi', 'E_p = ▢ · ▢ · ▢', ['m', 'g', 'h'], ['v', 't', 'a'], 'E_p = mgh', { any: true }),
        ],
      },
      {
        id: 'me-bevaring', title: 'Bevaring av mekanisk energi',
        intro: [
          ['E = E_k + E_p', 'Mekanisk energi', 'Summen av kinetisk og potensiell energi.', 'f'],
          ['Energibevaring', 'E før = E etter', 'Når bare tyngden gjør arbeid, er mekanisk energi konstant.', 'b'],
          ['v = √(2gh)', 'Fart etter fall', 'Følger av mgh = ½mv².', 'f'],
        ],
        items: [
          mc('Når er den mekaniske energien til et legeme bevart?', ['Når tyngden er den eneste kraften som gjør arbeid', 'Når tyngden er den eneste kraften som virker på legemet', 'Når farten til legemet er konstant hele tiden', 'Når legemet beveger seg uten å endre høyde'], 'Krefter som friksjon og luftmotstand endrer den mekaniske energien. Andre krefter kan godt virke, som normalkraften på et friksjonsfritt skråplan, så lenge de ikke gjør arbeid. Konstant fart er ikke nok: en heis med konstant fart oppover får mer potensiell energi.'),
          tf('To kuler ruller ned hver sin friksjonsfrie bakke med samme høydeforskjell. Kula i den brattere bakken får størst fart i bunnen.', false, 'mgh = ½mv² gir v = √(2gh). Bare høydeforskjellen teller, så farten i bunnen blir lik. Den brattere bakken gir bare kortere tid.'),
          bank('Utled farten etter et fall: v = √(2gh)', '▢\n▢\n▢\n▢', ['Mekanisk energi er bevart: E_p øverst = E_k nederst', 'mgh = ½mv²', 'Del på m og gang med 2: v² = 2gh', 'v = √(2gh)'], ['v = 2gh'], 'Massen forkortes bort, så farten avhenger ikke av massen.', { order: true }),
          mc('En ball kastes rett opp. Hva skjer med den mekaniske energien på vei opp (uten luftmotstand)?', ['Den er konstant, fordi E_k går over til E_p', 'Den avtar, fordi E_k går over til E_p', 'Den øker, fordi E_p øker med høyden', 'Den er konstant, fordi E_k og E_p begge er konstante'], 'Den mekaniske energien er summen E = E_k + E_p. På vei opp avtar E_k og E_p øker like mye, så summen er bevart. I toppen er all E_k blitt E_p.'),
        ],
      },
      {
        id: 'me-ikke', title: 'Ikke-bevart mekanisk energi',
        intro: [
          ['W_R = ΔE', 'Friksjonsarbeid', 'Arbeidet friksjonen gjør, er lik endringen i mekanisk energi. Det er negativt.', 'f'],
          ['Varme', 'Tapt mekanisk energi', 'Mekanisk energi som går tapt på grunn av friksjon, blir til indre energi i legemet og omgivelsene.', 'b'],
        ],
        items: [
          mc('Hvor stort er arbeidet friksjonen gjør på et legeme?', ['Like stort som endringen i mekanisk energi, og negativt', 'Like stort som endringen i kinetisk energi, og positivt', 'Like stort som endringen i potensiell energi, og negativt', 'Like stort som tyngden ganger strekningen, og positivt'], 'W_R = −R·s = ΔE, der ΔE er endringen i mekanisk energi. Arbeidet er negativt fordi friksjonen virker mot bevegelsen. Endringen i kinetisk energi alene er arbeidet fra alle kreftene til sammen.'),
          tf('Når mekanisk energi blir til varme på grunn av friksjon, forsvinner energien.', false, 'Energien blir indre energi i omgivelsene. Den er bevart, men energikvaliteten har sunket.'),
        ],
      },
      {
        id: 'me-effekt', title: 'Effekt',
        intro: [
          ['P = W/t', 'Effekt', 'Arbeid per tid. Enhet: watt (W).', 'f'],
          ['kWh', 'Kilowattime', '1 kWh = 3,6 MJ. Brukes på strømregningen.', 's'],
          ['W', 'Watt', 'Enheten for effekt. 1 W = 1 J/s.', 's'],
        ],
        items: [
          match([['Arbeid', 'J'], ['Effekt', 'W'], ['Kraft', 'N'], ['1 kWh', '3,6 MJ']], 'Koble sammen parene'),
          tf('1 W er det samme som 1 J/s.', true, 'Effekt er energi per tid.'),
        ],
      },
      {
        id: 'me-kvalitet', title: 'Energikvalitet',
        intro: [
          ['Energikvalitet', 'Hvor nyttig energien er', 'Elektrisk energi har høy kvalitet. Lunken varme har lav.', 'b'],
          ['Energiomforming', 'Energi skifter form', 'Energi går over fra én form til en annen, men den totale energien er bevart.', 'b'],
        ],
        items: [
          mc('Hvilken energiform har høyest energikvalitet?', ['Elektrisk energi', 'Varmt vann på 40 °C', 'Luft i romtemperatur', 'Spillvarme fra en bilmotor'], 'Elektrisk energi kan omformes til nesten alle andre former med høy virkningsgrad.'),
          mc('Hva skjer med energikvaliteten når mekanisk energi blir omdannet til varme ved friksjon?', ['Den synker', 'Den øker', 'Den er uendret', 'Den blir uendelig'], 'Varme ved lav temperatur er vanskelig å gjøre om til nyttig arbeid igjen.'),
          match([['Vannkraftverk', 'Potensiell → elektrisk'], ['Solcelle', 'Stråling → elektrisk'], ['Elektrisk motor', 'Elektrisk → mekanisk'], ['Bilmotor', 'Kjemisk → mekanisk']], 'Koble kilden med energiomformingen'),
        ],
      },
      {
        id: 'me-virk', title: 'Energi og virkningsgrad',
        intro: [
          ['η', 'Virkningsgrad', 'Nyttig energi delt på tilført energi.', 's'],
          ['η = E_nyttig / E_tilført', 'Formel for virkningsgrad', 'Alltid mellom 0 og 1 (0–100 %).', 'f'],
        ],
        items: [
          mc('Hvorfor kan ikke virkningsgraden til en maskin være over 100 %?', ['Energi er bevart, så nyttig energi kan ikke bli større enn tilført', 'Energi går alltid tapt som varme, så den kan ikke engang nå 100 %', 'Effekt er bevart, så nyttig effekt må være lik tilført effekt', 'Virkningsgraden er definert som tilført delt på nyttig energi'], 'η = nyttig energi / tilført energi, og energi kan ikke skapes, så η ≤ 1. Det er energibevaringen som setter grensen. At det i praksis alltid blir noe varmetap, forklarer at η < 100 %, men ikke hvorfor den ikke kan bli større.'),
        ],
      },
    ],
  };

  // ================================================================
  // BEVEGELSESMENGDE
  // ================================================================
  const unit_bm = {
    id: 'bm',
    title: 'Bevegelsesmengde',
    color: '#ce82ff', dark: '#a568cc',
    goal: 'Eleven skal kunne forstå og gjøre rede for konsekvenser av at bevegelsesmengde er bevart, og bruke dette i beregninger.',
    guide: [
      ['Bevegelsesmengde og impuls', 'Bevegelsesmengde: p = m·v (kg·m/s), en vektor.\nImpuls: I = F·Δt = Δp (N·s)\nSamme Δp over lengre tid gir mindre kraft (kollisjonspute, knebøy ved landing).'],
      ['Bevaring', 'I et isolert system (summen av ytre krefter er null) er den totale bevegelsesmengden bevart:\nm₁v₁ + m₂v₂ = m₁v₁′ + m₂v₂′\nHusk fortegn. Velg en positiv retning.'],
      ['Støt', 'Elastisk støt: både p og E_k er bevart.\nUelastisk støt: p er bevart, men noe E_k blir til varme, lyd og deformasjon.\nFullstendig uelastisk: legemene henger sammen etterpå: m₁v₁ + m₂v₂ = (m₁ + m₂)v′\nRekyl eller eksplosjon: total p før = 0\nm₁v₁′ = −m₂v₂′'],
    ],
    skills: [
      {
        id: 'bm-p', title: 'Bevegelsesmengde',
        intro: [
          ['p = m·v', 'Bevegelsesmengde', 'En vektor. Enhet: kg·m/s.', 'f'],
          ['kg·m/s', 'Enheten for bevegelsesmengde', 'Samme enhet som N·s.', 's'],
        ],
        items: [
          tf('Bevegelsesmengde er en skalar, akkurat som kinetisk energi.', false, 'p = mv har samme retning som hastigheten, så bevegelsesmengde er en vektor. Kinetisk energi er en skalar.'),
          mc('Hvilken enhet er lik kg·m/s?', ['N·s', 'J', 'W', 'N/s'], 'Impuls F·Δt har enheten N·s = kg·m/s² · s = kg·m/s.'),
        ],
      },
      {
        id: 'bm-impuls', title: 'Impulsloven',
        intro: [
          ['I = F·Δt', 'Impuls', 'Kraft ganger tiden den virker.', 'f'],
          ['I = Δp', 'Impulsloven', 'Impulsen er lik endringen i bevegelsesmengde.', 'f'],
        ],
        items: [
          mc('Hvorfor reduserer en kollisjonspute skadene i en kollisjon?', ['Den forlenger tiden det tar å stoppe, så kraften blir mindre', 'Den reduserer endringen i bevegelsesmengde, så kraften blir mindre', 'Den forkorter tiden det tar å stoppe, så støtet blir over fortere', 'Den gjør støtet elastisk, så den kinetiske energien blir bevart'], 'Impulsen F·Δt = Δp er den samme med og uten pute, fordi du uansett går fra full fart til stillstand. Når Δt blir lengre, blir F = Δp/Δt mindre.'),
          bank('Fullfør impulsloven', 'F · ▢ = ▢', ['Δt', 'Δp'], ['Δs', 'p', 'm'], 'Impulsen er lik endringen i bevegelsesmengde.'),
          bank('Utled impulsloven', '▢\n▢\n▢\n▢\n▢', ['Newtons 2. lov: F = m·a', 'Formel 1: a = (v − v₀)/t', 'F = m(v − v₀)/t', 'F·t = mv − mv₀', 'Impulsen er lik endringen i bevegelsesmengde: F·t = Δp'], ['F·t = m·v·t'], 'Impulsloven er Newtons 2. lov skrevet med bevegelsesmengde.', { order: true }),
        ],
      },
      {
        id: 'bm-bevaring', title: 'Bevaring av bevegelsesmengde',
        intro: [
          ['Σp før = Σp etter', 'Bevaring av bevegelsesmengde', 'Gjelder når summen av ytre krefter er null.', 'f'],
          ['Isolert system', 'Ingen ytre kraftsum', 'Bare indre krefter mellom legemene virker.', 'b'],
          ['Rekyl', 'Bevegelse bakover', 'Når noe skytes ut forover, får resten fart bakover.', 'b'],
        ],
        items: [
          mc('Når er den totale bevegelsesmengden til et system bevart?', ['Når summen av ytre krefter på systemet er null', 'Bare i elastiske støt', 'Bare når legemene har lik masse', 'Når friksjonen mellom legemene er null'], 'Indre krefter (som kreftene i et støt) endrer ikke den totale bevegelsesmengden.'),
          tf('I et isolert system er bevegelsesmengden bevart i alle typer støt.', true, 'Det gjelder både elastiske og uelastiske støt.'),
          mc('En kanon skyter ut en kule. Hvorfor rekylerer kanonen bakover?', ['Total bevegelsesmengde var null før skuddet og må være null etterpå', 'Total kinetisk energi var null før skuddet og må være null etterpå', 'Kruttgassene dytter på lufta bak kanonen, og lufta dytter tilbake', 'Kula trekker kanonen bakover med en kraft så lenge den er i løpet'], 'Med m_k·v_k + m_kule·v_kule = 0 må kanonen få like stor bevegelsesmengde som kula, men motsatt rettet. Kinetisk energi er ikke bevart: den kommer fra kruttet.'),
        ],
      },
      {
        id: 'bm-stot', title: 'Elastiske og uelastiske støt',
        intro: [
          ['Elastisk støt', 'p og E_k bevart', 'Ingen kinetisk energi går tapt.', 'b'],
          ['Uelastisk støt', 'Bare p bevart', 'Noe E_k blir til varme, lyd og deformasjon.', 'b'],
          ['Fullstendig uelastisk', 'Legemene henger sammen', 'm₁v₁ + m₂v₂ = (m₁ + m₂)v′', 'b'],
        ],
        items: [
          mc('Hva kjennetegner et elastisk støt?', ['Både bevegelsesmengde og kinetisk energi er bevart', 'Bevegelsesmengden er bevart, men ikke kinetisk energi', 'Kinetisk energi er bevart, men ikke bevegelsesmengde', 'Legemene henger sammen og har felles fart etterpå'], 'I alle støt uten ytre krefter er bevegelsesmengden bevart. I et elastisk støt går i tillegg ingen kinetisk energi over til andre former. Henger legemene sammen etterpå, er støtet fullstendig uelastisk.'),
          mc('Hva kjennetegner et fullstendig uelastisk støt?', ['Legemene henger sammen og får felles fart etterpå', 'Kinetisk energi er bevart', 'Bevegelsesmengden forsvinner', 'Legemene spretter fra hverandre med samme fart'], 'Her går mest mulig E_k over til andre energiformer.'),
          tf('I et uelastisk støt forsvinner noe av bevegelsesmengden.', false, 'Bevegelsesmengden er bevart. Det er den kinetiske energien som ikke er bevart.'),
          mc('Hvor blir det av den kinetiske energien som «forsvinner» i et uelastisk støt?', ['Den blir til varme, lyd og deformasjon', 'Den blir til bevegelsesmengde', 'Den forsvinner helt', 'Den blir til potensiell energi i tyngdefeltet'], 'Energien er bevart, men går over til andre former.'),
        ],
      },
      {
        id: 'bm-sentralt', title: 'Sentralt elastisk støt',
        intro: [
          ['Sentralt støt', 'Langs samme linje', 'Legemene beveger seg langs samme linje før og etter støtet.', 'b'],
          ['Like masser', 'Bytter fart', 'I et sentralt elastisk støt mellom to like tunge legemer bytter de hastighet.', 'b'],
        ],
        items: [
          mc('En biljardkule treffer en like tung kule som ligger i ro, rett forfra og helt elastisk. Hva skjer?', ['Den første stopper, og den andre fortsetter med samme fart', 'Begge fortsetter framover med halvparten av farten', 'Den første spretter tilbake, og den andre får dobbel fart', 'Begge fortsetter framover, den andre med litt større fart'], 'Med like masser i et elastisk sentralt støt bytter kulene hastighet. Halv fart til begge bevarer bevegelsesmengden, men bare halvparten av den kinetiske energien, så det passer et uelastisk støt.'),
        ],
      },
    ],
  };

  // ================================================================
  // ELEKTRISITET
  // ================================================================
  const unit_el = {
    id: 'el',
    title: 'Elektrisitet',
    color: '#00b8a9', dark: '#00897e',
    goal: 'Eleven skal kunne gjøre rede for sammenhengene mellom ladning, spenning og elektrisk energi og utforske effektomsetning i elektriske kretser.',
    guide: [
      ['Ladning og strøm', 'Elementærladningen: e = 1,60 · 10⁻¹⁹ C\nStrøm: I = Q/t (A = C/s)\nStrømretningen er definert fra + til − utenfor spenningskilden (motsatt av elektronene).'],
      ['Spenning og resistans', 'Spenning er energi per ladning: U = W/Q (V = J/C)\nOhms lov: U = R·I\nResistans i en ledning: R = ρ·L/A'],
      ['Kretser', 'Serie: R = R₁ + R₂ + … (samme strøm gjennom alle)\nParallell: 1/R = 1/R₁ + 1/R₂ + … (samme spenning over alle)\nKirchhoffs 1. lov: strøm inn i et punkt = strøm ut.\nKirchhoffs 2. lov: summen av spenningene rundt en lukket sløyfe er null.\nEms og indre resistans:\nU_pol = ε − R_i·I\nI = ε/(R + R_i)'],
      ['Effekt og energi', 'P = U·I = R·I² = U²/R\nE = P·t\nStrøm overføres med høy spenning fordi lavere strøm gir mindre varmetap (R·I²).'],
    ],
    skills: [
      {
        id: 'el-ladning', title: 'Ladning og strøm',
        intro: [
          ['Q', 'Ladning', 'Enhet: coulomb (C).', 's'],
          ['I = Q/t', 'Strøm', 'Ladning per tid. Enhet: ampere (A).', 'f'],
          ['e', 'Elementærladningen', '1,60 · 10⁻¹⁹ C, ladningen til ett elektron (med motsatt fortegn).', 's'],
        ],
        items: [
          match([['Ladning', 'C'], ['Strøm', 'A'], ['Spenning', 'V'], ['Resistans', 'Ω']], 'Koble størrelsen med enheten'),
          mc('Hvordan er strømretningen definert?', ['Fra + til − utenfor spenningskilden', 'Samme vei som elektronene', 'Fra − til + utenfor spenningskilden', 'Den er tilfeldig'], 'Konvensjonen er retningen positive ladninger ville gått. Elektronene går motsatt vei.'),
          tf('Strøm i en metalltråd er elektroner som beveger seg.', true, 'I metaller er det de frie elektronene som er ladningsbærerne.'),
        ],
      },
      {
        id: 'el-spenning', title: 'Spenning',
        intro: [
          ['U = W/Q', 'Spenning', 'Energi per ladning. Enhet: volt (V).', 'f'],
          ['V', 'Volt', 'Enheten for spenning. 1 V = 1 J/C.', 's'],
        ],
        items: [
          mc('Hva er elektrisk spenning?', ['Energi per ladning', 'Ladning per tid', 'Kraft per ladning', 'Strøm per resistans'], 'U = W/Q. 1 V = 1 J/C.'),
        ],
      },
      {
        id: 'el-ohm', title: 'Ohms lov',
        intro: [
          ['U = R·I', 'Ohms lov', 'Spenning er resistans ganger strøm.', 'f'],
          ['Ω', 'Ohm', 'Enheten for resistans. 1 Ω = 1 V/A.', 's'],
          ['R = ρL/A', 'Resistans i en ledning', 'ρ er resistiviteten, L lengden og A tverrsnittsarealet.', 'f'],
        ],
        items: [
          bank('Fullfør Ohms lov', 'U = ▢ · ▢', ['R', 'I'], ['P', 'Q', 't'], 'Spenning = resistans · strøm', { any: true }),
          mc('Hva skjer med resistansen hvis en ledning blir dobbelt så lang (samme materiale og tverrsnitt)?', ['Den dobles', 'Den halveres', 'Den firedobles', 'Den er uendret'], 'R = ρL/A, så R er proporsjonal med L.'),
          mc('Hva skjer med resistansen hvis tverrsnittsarealet til ledningen dobles?', ['Den halveres', 'Den dobles', 'Den firedobles', 'Den er uendret'], 'R = ρL/A, så R er omvendt proporsjonal med A.'),
          tf('En ohmsk motstand har en I-U-graf som er en rett linje gjennom origo.', true, 'Da er R = U/I konstant.'),
        ],
      },
      {
        id: 'el-serie', title: 'Seriekobling av motstander',
        intro: [
          ['R = R₁ + R₂', 'Seriekobling', 'Resistansene legges sammen. Samme strøm overalt.', 'f'],
          ['Seriekobling', 'Etter hverandre', 'Samme strøm går gjennom alle komponentene, og spenningene over dem legges sammen.', 'b'],
        ],
        items: [
          mc('Hva er likt for alle komponentene i en seriekobling?', ['Strømmen', 'Spenningen', 'Resistansen', 'Effekten'], 'Det finnes bare én vei for strømmen.'),
          mc('To lamper er seriekoblet. Den ene ryker. Hva skjer med den andre?', ['Den slukner', 'Den lyser sterkere', 'Den lyser like sterkt', 'Den lyser svakere'], 'Kretsen blir brutt, så det går ingen strøm.'),
        ],
      },
      {
        id: 'el-parallell', title: 'Parallellkobling av motstander',
        intro: [
          ['1/R = 1/R₁ + 1/R₂', 'Parallellkobling', 'Samme spenning over alle greinene.', 'f'],
          ['Parallellkobling', 'I hver sin grein', 'Samme spenning over alle greinene, og strømmene i greinene legges sammen.', 'b'],
        ],
        items: [
          mc('Hva er likt for alle greinene i en parallellkobling?', ['Spenningen', 'Strømmen', 'Resistansen', 'Effekten'], 'Alle greinene er koblet mellom de samme to punktene.'),
          tf('Når du kobler flere motstander i parallell, blir den totale resistansen større enn den største enkeltmotstanden.', false, 'Det er omvendt: hver ny grein gir strømmen en ekstra vei å gå, så den totale resistansen blir mindre enn den minste enkeltmotstanden. Det er i seriekobling at resistansene legges sammen.'),
          mc('Tre like lamper er parallellkoblet til en konstant spenning. Den ene ryker. Hva skjer med de to andre?', ['De lyser like sterkt som før', 'De lyser sterkere enn før', 'De lyser svakere enn før', 'Begge to slukner'], 'Spenningen over hver grein er den samme som før.'),
        ],
      },
      {
        id: 'el-krets', title: 'Elektriske kretser',
        intro: [
          ['ε', 'Ems', 'Spenningen kilden gir når det ikke går strøm.', 's'],
          ['U = ε − R_i·I', 'Polspenning', 'Spenningen ut fra kilden når det går strøm.', 'f'],
          ['Kirchhoffs 1. lov', 'Strømmen inn = strømmen ut', 'Summen av strømmene inn i et forgreiningspunkt er lik summen av strømmene ut.', 'b'],
        ],
        items: [
          mc('Hva sier Kirchhoffs 1. lov?', ['Summen av strømmene inn i et forgreiningspunkt er lik summen ut', 'Summen av spenningene inn i et forgreiningspunkt er lik summen ut', 'Strømmen er like stor i alle greinene i en parallellkobling', 'Summen av spenningene rundt en lukket sløyfe er lik null'], 'Kirchhoffs 1. lov følger av at ladning er bevart. Strømmen deler seg i et forgreiningspunkt, men ikke nødvendigvis likt. At spenningene rundt en sløyfe summeres til null, er Kirchhoffs 2. lov.'),
        ],
      },
      {
        id: 'el-effekt', title: 'Elektrisk energi og effekt',
        intro: [
          ['P = U·I', 'Elektrisk effekt', 'Effekten i en komponent.', 'f'],
          ['P = R·I²', 'Effekt og strøm', 'Viser at varmetap øker med kvadratet av strømmen.', 'f'],
          ['E = P·t', 'Elektrisk energi', 'Effekt ganger tid.', 'f'],
        ],
        items: [
          mc('Hvorfor overføres elektrisk energi med svært høy spenning i kraftledninger?', ['Lavere strøm gir mindre varmetap i ledningene', 'Høy spenning går raskere', 'Det trengs for at strømmen skal komme fram', 'Det gir mindre resistans i ledningene'], 'Tapet er P = R·I². Ved samme effekt gir høy U lav I.'),
          tf('Effekten i en motstand er proporsjonal med kvadratet av strømmen.', true, 'P = R·I²'),
          bank('Utled P = R·I²', '▢\n▢\n▢\n▢', ['Start med P = U·I', 'Ohms lov: U = R·I', 'Sett inn: P = R·I·I', 'P = R·I²'], ['P = R/I'], 'Setter du i stedet inn I = U/R, får du P = U²/R.', { order: true }),
          match([['P = U·I', 'Effekt'], ['E = P·t', 'Energi'], ['I = Q/t', 'Strøm'], ['U = R·I', 'Ohms lov']], 'Koble formelen med det den beskriver'),
        ],
      },
    ],
  };

  // ================================================================
  // TERMOFYSIKK
  // ================================================================
  const unit_tf = {
    id: 'tf',
    title: 'Termofysikk',
    color: '#ff4b4b', dark: '#ea2b2b',
    goal: 'Eleven skal kunne forstå begrepet temperatur og forklare hvordan tilført varme til et system fører til temperaturendring i dette systemet, og vurdere ulike påstander og argumenter om energi og klima i samfunnsaktuelle problemstillinger.',
    guide: [
      ['Temperatur', 'Temperatur er et mål på den gjennomsnittlige kinetiske energien til partiklene.\nT (K) = t (°C) + 273,15\nDet absolutte nullpunktet er 0 K = −273,15 °C.'],
      ['Varme og indre energi', 'Varme Q er energi som overføres på grunn av temperaturforskjell.\nTermofysikkens 1. lov: ΔU = Q + W (W er arbeid gjort på systemet).\nVarmetransport: ledning, konveksjon (strømning) og stråling.'],
      ['Varmekapasitet', 'Q = c·m·ΔT\nVann: c = 4,18 kJ/(kg·K)\nBlanding: varme avgitt = varme mottatt.'],
      ['Faseoverganger', 'Under smelting og fordamping er temperaturen konstant.\nSpesifikk smeltevarme for is: 334 kJ/kg\nSpesifikk fordampingsvarme for vann: 2,26 MJ/kg'],
      ['Energi og klima', 'Energi blir aldri brukt opp, men energikvaliteten synker.\nVurder påstander ved å se på kilder, data, enheter og hele livsløpet.'],
    ],
    skills: [
      {
        id: 'tf-temp', title: 'Temperatur',
        intro: [
          ['T', 'Absolutt temperatur', 'Måles i kelvin (K).', 's'],
          ['T = t + 273,15', 'Fra celsius til kelvin', '0 K er det absolutte nullpunktet.', 'f'],
          ['Absolutt nullpunkt', '0 K = −273,15 °C', 'Den lavest mulige temperaturen. Der har partiklene minst mulig bevegelse.', 'b'],
        ],
        items: [
          mc('Hva er temperatur et mål på?', ['Den gjennomsnittlige kinetiske energien til partiklene', 'Den samlede kinetiske energien til alle partiklene', 'Den gjennomsnittlige potensielle energien til partiklene', 'Den samlede indre energien i hele stoffet'], 'Høyere temperatur betyr at partiklene i gjennomsnitt beveger seg raskere. Den samlede energien avhenger også av hvor mye stoff det er: et stort basseng med lunkent vann har mer indre energi enn en kopp varm te.'),
          mc('Hva er det absolutte nullpunktet?', ['0 K = −273,15 °C', '0 K = 273,15 °C', '0 °C = −273,15 K', '0 K = −373,15 °C'], 'Det absolutte nullpunktet er den lavest mulige temperaturen. Kelvin og celsius har like store skrittlengder, og T = t + 273,15.'),
        ],
      },
      {
        id: 'tf-indre', title: 'Indre energi og varme',
        intro: [
          ['Indre energi', 'U', 'Summen av energien til alle partiklene i stoffet.', 'b'],
          ['Q', 'Varme', 'Energi som overføres fordi det er en temperaturforskjell. Varme er ikke det samme som temperatur.', 's'],
          ['Varmetransport', 'Ledning, stråling og strømning', 'Varme overføres ved varmeledning, varmestråling og varmestrømning (konveksjon).', 'b'],
        ],
        items: [
          tf('Varme og temperatur er det samme.', false, 'Varme er energi som overføres. Temperatur er en tilstandsstørrelse.'),
          match([['Ledning', 'Varm kjele, kaldt håndtak blir varmt'], ['Konveksjon', 'Varm luft stiger over en ovn'], ['Stråling', 'Sola varmer jorda'], ['Fordamping', 'Svette kjøler huden']], 'Koble varmetransporten med eksempelet'),
        ],
      },
      {
        id: 'tf-varmekap', title: 'Varmekapasitet',
        intro: [
          ['Q = c·m·ΔT', 'Varme og temperaturendring', 'Energien som trengs for å endre temperaturen.', 'f'],
          ['c', 'Spesifikk varmekapasitet', 'Energi per kg per kelvin. Vann: 4,18 kJ/(kg·K).', 's'],
          ['ΔT', 'Temperaturendring', 'Like stor i kelvin som i grader celsius.', 's'],
        ],
        items: [
          mc('Hvorfor holder havet på varmen lenge utover høsten?', ['Vann har høy spesifikk varmekapasitet', 'Vann har lav spesifikk varmekapasitet', 'Saltet i havet varmer opp vannet', 'Havet reflekterer sollys'], 'Det trengs mye energi for å endre temperaturen til vann, og vannet avgir mye energi når det avkjøles.'),
          bank('Fullfør formelen for varme', 'Q = ▢ · ▢ · ΔT', ['c', 'm'], ['g', 'h', 'v'], 'Q = c·m·ΔT', { any: true }),
        ],
      },
      {
        id: 'tf-fase', title: 'Aggregattilstander og faseoverganger',
        intro: [
          ['Aggregattilstand', 'Fast stoff, væske eller gass', 'Formen et stoff er i. Under en faseovergang endres den uten at temperaturen endres.', 'b'],
          ['Q = l·m', 'Faseovergang', 'Energien som trengs for å smelte eller fordampe massen m.', 'f'],
          ['l_s', 'Spesifikk smeltevarme', 'Is: 334 kJ/kg.', 's'],
        ],
        items: [
          mc('Hva skjer med temperaturen mens is smelter ved normalt trykk?', ['Den er konstant på 0 °C', 'Den stiger jevnt', 'Den synker', 'Den svinger opp og ned'], 'Energien går med til å bryte bindinger mellom molekylene.'),
          tf('Når vann fordamper fra huden, tar det opp energi fra kroppen.', true, 'Fordamping krever energi, derfor kjøler svette.'),
        ],
      },
      {
        id: 'tf-fordamp', title: 'Smeltevarme og fordampningsvarme',
        intro: [
          ['l_f', 'Spesifikk fordampningsvarme', 'Vann: 2,26 MJ/kg, mye større enn smeltevarmen for is.', 's'],
          ['Kondensasjon', 'Gass blir til væske', 'Stoffet gir fra seg like mye energi som trengs for å fordampe det.', 'b'],
        ],
        items: [
          tf('Det trengs mer energi for å fordampe 1 kg vann enn for å smelte 1 kg is.', true, 'Fordampningsvarmen for vann er 2,26 MJ/kg, mens smeltevarmen for is er 334 kJ/kg.'),
          mc('Hvorfor kan damp gi verre brannskader enn like varmt vann?', ['Dampen gir fra seg fordampningsvarmen når den kondenserer på huden', 'Dampen har høyere temperatur enn vannet, selv ved 100 °C', 'Dampen har større spesifikk varmekapasitet enn vannet', 'Dampen trekker varme ut av huden når den kondenserer'], 'Når damp kondenserer, frigjøres like mye energi som trengtes for å fordampe vannet. Den energien går inn i huden.'),
        ],
      },
      {
        id: 'tf-1lov', title: 'Termodynamikkens 1. lov',
        intro: [
          ['ΔU = Q + W', 'Termofysikkens 1. lov', 'Endring i indre energi = tilført varme + arbeid gjort på systemet.', 'f'],
        ],
        items: [
          mc('Hva sier termofysikkens 1. lov, ΔU = Q + W?', ['Endringen i indre energi er tilført varme pluss arbeid gjort på systemet', 'Endringen i indre energi er tilført varme minus arbeid gjort på systemet', 'Endringen i temperatur er tilført varme pluss arbeid gjort på systemet', 'Tilført varme er alltid lik arbeidet systemet gjør på omgivelsene'], 'Det er energibevaring anvendt på et system. Med fortegnsvalget i læreboka er W arbeid gjort på systemet, så det legges til. Gjør systemet arbeid på omgivelsene, er W negativ.'),
        ],
      },
      {
        id: 'tf-2lov', title: 'Termodynamikkens 2. lov',
        intro: [
          ['2. lov', 'Varme går fra varmt til kaldt', 'Varme går av seg selv bare fra et varmere til et kaldere legeme.', 'b'],
          ['Entropi', 'Mål for uorden', 'I et isolert system kan entropien ikke avta. Den øker i alle naturlige prosesser.', 'b'],
        ],
        items: [
          tf('Varme kan av seg selv gå fra et kaldt legeme til et varmere.', false, 'Etter termodynamikkens 2. lov går varme av seg selv bare fra varmt til kaldt. En varmepumpe kan flytte varme den andre veien, men bare ved å bruke energi.'),
        ],
      },
      {
        id: 'tf-trykk', title: 'Trykk',
        intro: [
          ['p = F/A', 'Trykk', 'Kraft per areal. Enhet: pascal (Pa).', 'f'],
          ['Pa', 'Pascal', '1 Pa = 1 N/m². Lufttrykket ved havnivå er ca. 101 kPa.', 's'],
          ['p = ρgh', 'Trykk i en væske', 'Trykket fra væsken øker med dybden h. ρ er tettheten til væsken.', 'f'],
        ],
        items: [
          mc('Hvorfor synker du mindre ned i snøen med truger enn med vanlige sko?', ['Tyngden fordeles på et større areal, så trykket blir mindre', 'Tyngden blir mindre når den fordeles på et større areal', 'Trykket blir større, men snøen tåler mer trykk under truger', 'Normalkraften fra snøen blir større enn tyngden din'], 'p = F/A. Kraften (tyngden) er den samme, men arealet er større, så trykket blir mindre.'),
        ],
      },
      {
        id: 'tf-oppdrift', title: 'Oppdrift',
        intro: [
          ['Arkimedes\' lov', 'Oppdrift', 'Oppdriften er lik tyngden av væsken eller gassen legemet fortrenger.', 'b'],
          ['O = ρ·V·g', 'Oppdriftskraften', 'ρ er tettheten til væsken, og V er volumet av den fortrengte væsken.', 'f'],
        ],
        items: [
          tf('Et legeme flyter når oppdriften kan bli like stor som tyngden av legemet.', true, 'Da er kraftsummen null. Et legeme med lavere tetthet enn væsken flyter.'),
        ],
      },
      {
        id: 'tf-varmepumpe', title: 'Varmepumpe og COP',
        intro: [
          ['Varmepumpe', 'Flytter varme', 'Henter varme utenfra og leverer mer varme enn strømmen den bruker.', 'b'],
          ['COP = Q/E', 'Effektfaktor (COP)', 'Levert varme delt på tilført elektrisk energi. Typisk 3 til 4 for en luft-til-luft-varmepumpe.', 'f'],
        ],
        items: [
          tf('En varmepumpe kan levere mer varmeenergi til et hus enn den elektriske energien den bruker.', true, 'Den henter i tillegg varme fra uteluft, jord eller sjø. Energien er fortsatt bevart.'),
        ],
      },
      {
        id: 'tf-klima', title: 'Klima og påstander om energi',
        intro: [
          ['Fornybar energi', 'Fylles på naturlig', 'F.eks. vannkraft, sol og vind.', 'b'],
          ['Drivhuseffekt', 'Atmosfæren holder på varme', 'Gasser absorberer infrarød stråling fra jorda.', 'b'],
        ],
        items: [
          mc('Påstand: «Vi holder på å gå tom for energi.» Hva er den fysisk mest presise kommentaren?', ['Energi er bevart. Vi går tom for energikilder med høy kvalitet', 'Energi er bevart. Vi går tom for varme, fordi den stråler ut i rommet', 'Energi blir brukt opp. Derfor må vi spare på den vi har igjen', 'Energi blir brukt opp. Men sola lager ny energi hver dag'], 'Energien blir ikke borte, men går over til varme med lav kvalitet som er vanskelig å utnytte. Det vi kan gå tom for, er lett tilgjengelige kilder med høy kvalitet, som fossile brensler. Sola lager ikke energi fra ingenting, men omdanner masse til energi.'),
          mc('Hvilken av disse energikildene er fornybar?', ['Vannkraft', 'Kull', 'Naturgass', 'Uran'], 'Vannkraft drives av sola via vannets kretsløp.'),
          mc('Påstand: «Elbiler gir null utslipp.» Hva er den beste vurderingen?', ['Ingen eksosutslipp, men produksjon og strømkilde kan gi utslipp', 'Ingen utslipp i det hele tatt, fordi strøm er en ren energikilde', 'Like mye utslipp som bensinbiler når produksjonen tas med', 'Ingen utslipp i Norge, så påstanden stemmer for norske forhold'], 'En god vurdering ser på hele livsløpet og på hvor strømmen kommer fra. Også norsk strøm og produksjon av batterier gir noe utslipp. Over hele livsløpet slipper elbiler i Norge likevel ut mindre enn bensinbiler.'),
          mc('Hvorfor fører økt CO₂ i atmosfæren til oppvarming?', ['CO₂ absorberer infrarød stråling fra jorda og sender noe tilbake ned', 'CO₂ absorberer synlig lys fra sola og varmer opp lufta direkte', 'CO₂ reflekterer sollyset og sender det tilbake mot bakken', 'CO₂ bryter ned ozonlaget og slipper inn mer ultrafiolett stråling'], 'Atmosfæren slipper det meste av sollyset gjennom, men CO₂ absorberer den infrarøde strålingen jorda sender ut. Noe av den sendes tilbake mot bakken. Dette er den forsterkede drivhuseffekten. Ozonhullet er et eget problem.'),
          mc('Du leser en påstand om klima i sosiale medier. Hva er den beste måten å vurdere den på?', ['Sjekke kilden og om den støttes av data og fagfellevurdert forskning', 'Sjekke om mange eksperter på ulike fagfelt har delt eller likt den', 'Sjekke om den virker logisk og stemmer med din egen erfaring', 'Sjekke om den er publisert av en kjent avis eller nyhetskanal'], 'Gode kilder, målinger og faglig konsensus er viktigere enn popularitet, logikk alene eller hvem som har delt påstanden. Også kjente medier kan gjengi feil, så det er kilden bak som teller.'),
        ],
      },
    ],
  };

  // ================================================================
  // BØLGER OG STRÅLINGSLOVENE
  // ================================================================
  const unit_bs = {
    id: 'bs',
    title: 'Bølger og strålingslovene',
    color: '#2b70c9', dark: '#1f5aa3',
    goal: 'Eleven skal kunne utforske, sammenligne og beskrive stråling fra legemer med ulik temperatur og overflate, og bruke modeller av strålingsbalansen til jorda til å gjøre beregninger og vurdere hvordan endringer på jordoverflaten og i atmosfæren påvirker denne balansen.',
    guide: [
      ['Bølger', 'Bølgelikningen: v = f·λ\nTransversal bølge: svingning på tvers av utbredelsen (lys).\nLongitudinal bølge: svingning langs utbredelsen (lyd).\nLys i vakuum: c = 3,00 · 10⁸ m/s'],
      ['Elektromagnetisk spekter', 'Fra lang til kort bølgelengde: radio, mikrobølger, infrarødt, synlig lys, ultrafiolett, røntgen, gamma.\nKortere bølgelengde betyr høyere frekvens og mer energi per foton.'],
      ['Wiens forskyvningslov', 'λ_maks · T = 2,90 · 10⁻³ m·K\nVarmere legemer har topp i spekteret ved kortere bølgelengde.'],
      ['Stefan–Boltzmanns lov', 'Utstrålt intensitet fra et svart legeme: I = σT⁴\nσ = 5,67 · 10⁻⁸ W/(m²·K⁴)\nEffekt fra en flate: P = e·σ·A·T⁴, der e er emissiviteten (0 til 1).'],
      ['Jordas strålingsbalanse', 'Solarkonstanten S ≈ 1361 W/m²\nAlbedo α: andelen som reflekteres (jorda ≈ 0,30).\nInnstrålt i snitt: (1 − α)·S/4 (vi deler på 4 fordi jordas overflate er 4πR², mens tverrsnittet er πR²)\nLikevekt uten atmosfære: σT⁴ = (1 − α)S/4 gir T ≈ 255 K (−18 °C).\nDrivhuseffekten gir i dag ca. 288 K (15 °C).'],
    ],
    skills: [
      {
        id: 'bs-bolger', title: 'Bølgelengde, periode og frekvens',
        intro: [
          ['λ', 'Bølgelengde', 'Avstanden mellom to bølgetopper.', 's'],
          ['f', 'Frekvens', 'Svingninger per sekund. Enhet: hertz (Hz).', 's'],
          ['T', 'Periode', 'Tiden én svingning tar. T = 1/f.', 's'],
        ],
        items: [
          mc('Hva slags bølge er lyd i luft?', ['Longitudinal', 'Transversal', 'Elektromagnetisk', 'Stående'], 'Luftmolekylene svinger fram og tilbake i samme retning som bølgen går.'),
          tf('Lys trenger et medium for å bre seg ut.', false, 'Elektromagnetiske bølger kan gå gjennom vakuum, for eksempel fra sola til jorda.'),
        ],
      },
      {
        id: 'bs-spekter', title: 'Bølgelikningen og spekteret',
        intro: [
          ['v = f·λ', 'Bølgelikningen', 'Fart er frekvens ganger bølgelengde.', 'f'],
          ['c', 'Lysfarten', '3,00 · 10⁸ m/s i vakuum.', 's'],
          ['Elektromagnetisk spekter', 'Fra radio til gamma', 'Radiobølger, mikrobølger, infrarødt, synlig lys, ultrafiolett, røntgen og gamma, ordnet etter bølgelengde.', 'b'],
        ],
        items: [
          mc('Hvilken type stråling har kortest bølgelengde?', ['Gammastråling', 'Synlig lys', 'Radiobølger', 'Infrarød stråling'], 'Gamma har kortest bølgelengde og høyest fotonenergi.'),
          bank('Fullfør bølgelikningen', 'v = ▢ · ▢', ['f', 'λ'], ['T', 'A', 'c'], 'Farten er frekvens ganger bølgelengde.', { any: true }),
        ],
      },
      {
        id: 'bs-interferens', title: 'Interferens',
        intro: [
          ['Interferens', 'Bølger som møtes', 'Når bølger møtes, legges utslagene sammen.', 'b'],
          ['Konstruktiv interferens', 'Topp møter topp', 'Bølgene forsterker hverandre.', 'b'],
          ['Destruktiv interferens', 'Topp møter bunn', 'Bølgene svekker eller opphever hverandre.', 'b'],
        ],
        items: [
          tf('To bølger som møtes, kan oppheve hverandre helt.', true, 'Ved destruktiv interferens møter toppen i den ene bølgen bunnen i den andre. Har de like stort utslag, blir summen null.'),
        ],
      },
      {
        id: 'bs-intensitet', title: 'Lysintensitet og utstrålingstetthet',
        intro: [
          ['I = P/A', 'Intensitet', 'Effekt per areal. Enhet: W/m².', 'f'],
          ['I ∝ 1/r²', 'Avstandskvadratloven', 'Intensiteten fra en punktkilde avtar med kvadratet av avstanden.', 'f'],
        ],
        items: [
          mc('Du flytter deg dobbelt så langt fra en lampe. Hva skjer med intensiteten du mottar?', ['Den blir en fjerdedel', 'Den blir halvparten', 'Den blir en åttendedel', 'Den er uendret'], 'Intensiteten avtar med kvadratet av avstanden: dobbel avstand gir 1/2² = 1/4.'),
        ],
      },
      {
        id: 'bs-wien', title: 'Wiens lov',
        intro: [
          ['λ_maks·T = b', 'Wiens forskyvningslov', 'b = 2,90 · 10⁻³ m·K.', 'f'],
          ['Svart legeme', 'Perfekt absorbent', 'Absorberer all stråling og stråler perfekt.', 'b'],
          ['λ_maks', 'Toppbølgelengde', 'Bølgelengden der et legeme stråler mest.', 's'],
        ],
        items: [
          tf('Jo varmere et legeme er, jo lengre bølgelengde har toppen i strålingsspekteret.', false, 'λ_maks = b/T, så høyere temperatur gir kortere bølgelengde. Derfor er de varmeste stjernene blå.'),
          mc('Hvorfor er røde stjerner kaldere enn blå stjerner?', ['Strålingstoppen ligger ved lengre bølgelengde, og det betyr lavere temperatur', 'Strålingstoppen ligger ved kortere bølgelengde, og det betyr lavere temperatur', 'Rødt lys har høyere frekvens, så stjernen mister mer energi og blir kald', 'Røde stjerner er lenger unna, så mindre av varmen deres når fram til oss'], 'Etter Wiens forskyvningslov er λ_maks · T konstant, så lang bølgelengde på toppen betyr lav temperatur. Rødt lys har lavere frekvens enn blått. Avstanden påvirker hvor sterkt stjernen lyser hos oss, ikke fargen.'),
          mc('Kroppen din har en temperatur på ca. 310 K. I hvilket område stråler den mest?', ['Infrarødt', 'Synlig lys', 'Ultrafiolett', 'Radiobølger'], 'λ = 2,90 · 10⁻³ / 310 ≈ 9,4 µm, som er infrarødt.'),
          mc('Hva er et svart legeme i fysikken?', ['Et legeme som absorberer all stråling som treffer det', 'Et legeme som reflekterer all stråling som treffer det', 'Et legeme som ikke sender ut noen stråling i det hele tatt', 'Et legeme som bare sender ut infrarød stråling'], 'Et svart legeme absorberer all innkommende stråling. Det er også en perfekt strålingskilde ved sin temperatur, så det sender ut stråling. Sola er tilnærmet et svart legeme, selv om den lyser sterkt.'),
        ],
      },
      {
        id: 'bs-stefan', title: 'Stefan–Boltzmanns lov',
        intro: [
          ['I = σT⁴', 'Stefan–Boltzmanns lov', 'Utstrålt intensitet fra et svart legeme.', 'f'],
          ['σ', 'Stefan–Boltzmanns konstant', '5,67 · 10⁻⁸ W/(m²·K⁴).', 's'],
          ['e', 'Emissivitet', 'Fra 0 til 1: hvor godt flaten stråler.', 's'],
        ],
        items: [
          mc('Den absolutte temperaturen til et svart legeme dobles. Hva skjer med utstrålt intensitet?', ['Den blir 16 ganger så stor', 'Den dobles', 'Den firedobles', 'Den blir 8 ganger så stor'], 'I = σT⁴, og 2⁴ = 16.'),
          mc('Hva forteller emissiviteten e til en flate?', ['Hvor godt flaten stråler sammenliknet med et svart legeme', 'Hvor godt flaten reflekterer sammenliknet med et speil', 'Hvor mye flaten stråler per kvadratmeter ved 0 °C', 'Hvor høy temperatur flaten har sammenliknet med sola'], 'e = 1 for et svart legeme og e < 1 for virkelige flater. Stefan–Boltzmanns lov blir da I = eσT⁴.'),
          bank('Fullfør Stefan–Boltzmanns lov', 'I = σ · ▢', ['T⁴'], ['T²', 'T', 'λ'], 'Intensiteten er proporsjonal med T⁴.'),
        ],
      },
      {
        id: 'bs-balanse', title: 'Strålingsbalanse og modell for jordas klima',
        intro: [
          ['α', 'Albedo', 'Andelen av innstrålingen som reflekteres.', 's'],
          ['S', 'Solarkonstanten', '≈ 1361 W/m² ved jordas avstand.', 's'],
          ['(1 − α)S/4', 'Gjennomsnittlig absorbert', 'Det jorda tar opp per m² i snitt.', 'f'],
        ],
        items: [
          mc('Hva er albedo?', ['Andelen av innkommende stråling som reflekteres', 'Andelen av innkommende stråling som absorberes', 'Andelen av utgående stråling som slipper ut i rommet', 'Andelen av utgående stråling som drivhusgassene fanger'], 'Snø og is har høy albedo, mens hav og skog har lav. Andelen som absorberes, er 1 − α.'),
          mc('Hvorfor deler vi solarkonstanten på 4 i modellen for jordas strålingsbalanse?', ['Jorda tar imot stråling på tverrsnittet πR², men stråler ut fra hele overflaten 4πR²', 'Jorda tar imot stråling på halvkula 2πR², og bare halvparten av den absorberes', 'Jorda tar imot stråling på hele overflaten 4πR², men bare dagsiden stråler ut', 'Jorda tar imot stråling bare i dagslys, som i snitt utgjør en fjerdedel av døgnet'], 'Sett fra sola er jorda en skive med areal πR². Den stråler ut fra hele kuleoverflaten 4πR². Forholdet 4πR² / πR² = 4.'),
          mc('Hva skjer med strålingsbalansen når isbreer og havis smelter?', ['Albedoen synker, jorda absorberer mer stråling og blir varmere', 'Albedoen øker, jorda absorberer mindre stråling og blir kaldere', 'Albedoen synker, jorda reflekterer mer stråling og blir kaldere', 'Albedoen er uendret, men smeltingen tar opp varme og kjøler jorda'], 'Is og snø reflekterer mye sollys. Når de smelter, kommer mørkere hav og land fram, albedoen synker, og mer stråling blir absorbert. Det gir mer oppvarming og mer smelting: en positiv tilbakekobling.'),
          mc('Hvorfor er jordas middeltemperatur ca. 15 °C og ikke −18 °C som den enkle modellen gir?', ['Drivhusgasser sender infrarød stråling tilbake mot bakken', 'Varme fra jordas indre holder overflaten varm', 'Atmosfæren reflekterer sollys ned mot bakken', 'Havet lagrer varme fra sommeren gjennom året'], 'Den enkle modellen ser bort fra atmosfæren. Drivhusgassene absorberer infrarød stråling fra bakken og sender en del av den tilbake. Varmen fra jordas indre er svært liten sammenliknet med sollyset.'),
        ],
      },
      {
        id: 'bs-drivhus', title: 'Drivhuseffekten',
        intro: [
          ['Drivhusgass', 'Absorberer infrarødt', 'Gasser som CO₂, metan og vanndamp absorberer infrarød stråling fra jorda og sender noe tilbake ned.', 'b'],
          ['Forsterket drivhuseffekt', 'Mer drivhusgass', 'Mer drivhusgasser i atmosfæren gir høyere temperatur ved bakken.', 'b'],
          ['−18 °C', 'Jorda uten drivhuseffekt', 'Temperaturen den enkle strålingsmodellen gir. Med drivhuseffekt er snittet ca. 15 °C.', 's'],
        ],
        items: [
          tf('Drivhusgasser slipper gjennom mesteparten av sollyset, men absorberer infrarød stråling fra jorda.', true, 'Sollys har kort bølgelengde, mens jorda stråler infrarødt.'),
        ],
      },
    ],
  };

  // ================================================================
  // ATOMFYSIKK
  // ================================================================
  const unit_at = {
    id: 'at',
    title: 'Atomfysikk',
    color: '#ff86d0', dark: '#cc6ba6',
    goal: 'Eleven skal kunne beskrive ulike atommodeller og drøfte hvordan observerbare effekter støtter eller utfordrer dem.',
    guide: [
      ['Atommodeller', 'Thomson (rosinbollemodellen): positiv masse med elektroner spredt i.\nRutherford: liten, tett, positiv kjerne. Bygger på gullfolieforsøket.\nBohr: elektronene har bestemte energinivåer. Forklarer linjespekteret til hydrogen.\nKvantemekanisk modell: elektronene beskrives som sannsynlighetsskyer (orbitaler).'],
      ['Fotoner', 'E = h·f = h·c/λ\nh = 6,63 · 10⁻³⁴ J·s\n1 eV = 1,60 · 10⁻¹⁹ J\nHurtigregel: E (eV) ≈ 1240 / λ (nm)'],
      ['Spektre', 'Emisjonsspekter: lyse linjer når elektroner faller til lavere nivå.\nAbsorpsjonsspekter: mørke linjer når elektroner løftes til høyere nivå.\nHydrogen (Bohr): E_n = −13,6 eV / n²\nFotonenergi ved overgang: E = E_øvre − E_nedre'],
      ['Fotoelektrisk effekt', 'Lys kan rive løs elektroner fra et metall, men bare over en grensefrekvens, uansett intensitet. Det støtter at lys består av fotoner.'],
    ],
    skills: [
      {
        id: 'at-modeller', title: 'Atommodeller',
        intro: [
          ['Thomson', 'Rosinbollemodellen', 'Positiv kule med elektroner i.', 'b'],
          ['Rutherford', 'Kjernemodellen', 'Liten, tett, positiv kjerne.', 'b'],
          ['Bohr', 'Energinivåmodellen', 'Elektroner i bestemte energinivåer.', 'b'],
        ],
        items: [
          mc('Hva viste Rutherfords gullfolieforsøk?', ['At atomet har en liten, tett og positivt ladd kjerne', 'At elektronene har bestemte energinivåer', 'At atomet er en jevn positiv kule med elektroner i', 'At lys består av fotoner'], 'De fleste alfapartiklene gikk rett gjennom, men noen få ble sendt kraftig tilbake.'),
          mc('Hvordan beskriver Thomsons atommodell atomet?', ['En positiv kule med elektroner spredt rundt i seg, som rosiner i en bolle', 'En liten positiv kjerne med elektroner i baner rundt, som planeter rundt sola', 'En liten positiv kjerne med elektroner i bestemte energinivåer rundt seg', 'En negativ kule med positive ladninger spredt rundt i seg, som rosiner'], 'Thomsons modell kalles rosinbollemodellen. Planetmodellen med kjerne er Rutherfords, og energinivåene er Bohrs.'),
          mc('Hvilken observasjon forklarte Bohrs modell som Rutherfords ikke kunne?', ['Linjespekteret til hydrogen', 'At atomer har en kjerne', 'At atomer er nøytrale', 'Radioaktivitet'], 'Bestemte energinivåer gir bestemte fotonenergier og dermed linjer.'),
          mc('Hvilket problem hadde Rutherfords atommodell?', ['Elektroner i bane ville stråle ut energi og spiralere inn i kjernen', 'Elektroner i bane ville miste ladning og fly vekk fra kjernen', 'Kjernen ville være for stor til å forklare gullfolieforsøket', 'Kjernen ville være negativ, så den ville frastøte elektronene'], 'Klassisk fysikk sier at akselererte ladninger stråler. Et elektron i sirkelbane akselererer hele tiden og ville miste energi. Rutherfords modell forklarte nettopp gullfolieforsøket, med en liten, positiv kjerne.'),
          tf('Bohrs modell forklarer hydrogenspekteret godt, men fungerer dårlig for atomer med mange elektroner.', true, 'Derfor trengte man den kvantemekaniske modellen.'),
          match([['Thomson', 'Rosinbollemodellen'], ['Rutherford', 'Liten, tett kjerne'], ['Bohr', 'Bestemte energinivåer'], ['Kvantemekanisk', 'Elektronskyer']], 'Koble modellen med hovedideen'),
        ],
      },
      {
        id: 'at-straling', title: 'Elektromagnetisk stråling og fotoner',
        intro: [
          ['E = h·f', 'Fotonenergi', 'Energien til ett foton.', 'f'],
          ['h', 'Plancks konstant', '6,63 · 10⁻³⁴ J·s.', 's'],
          ['eV', 'Elektronvolt', '1 eV = 1,60 · 10⁻¹⁹ J.', 's'],
        ],
        items: [
          mc('Hvilket foton har mest energi?', ['Et blått foton', 'Et rødt foton', 'De har like mye', 'Det avhenger av lysstyrken'], 'Blått lys har høyere frekvens (kortere bølgelengde), og E = hf.'),
          mc('Hvilken observasjon støtter at lys består av fotoner?', ['Elektroner løsrives fra et metall bare når lyset har høy nok frekvens', 'Elektroner løsrives fra et metall bare når lyset er sterkt nok', 'Lys som går gjennom to smale spalter, gir et mønster av lyse og mørke striper', 'Lys brytes i et prisme, så de ulike fargene går i hver sin retning'], 'Dette er fotoelektrisk effekt. Hvis lys bare var en bølge, ville sterkt nok lys alltid løsrevet elektroner. Dobbeltspalte og brytning viser bølgeegenskaper ved lys.'),
          bank('Fullfør formelen for fotonenergi', 'E = ▢ · ▢', ['h', 'f'], ['c', 'λ', 'm'], 'E = hf', { any: true }),
        ],
      },
      {
        id: 'at-bohr', title: 'Bohrs atomteori',
        intro: [
          ['E_n = −13,6 eV/n²', 'Energinivåene i hydrogen', 'n = 1, 2, 3, …', 'f'],
          ['n', 'Kvantetall', 'Nummeret på energinivået.', 's'],
          ['Grunntilstand', 'Laveste energinivå', 'n = 1. Høyere nivåer kalles eksiterte tilstander.', 'b'],
        ],
        items: [
          tf('Ifølge Bohrs modell kan et elektron i et atom ha hvilken som helst energi.', false, 'Bare bestemte, kvantiserte energinivåer er tillatt.'),
        ],
      },
      {
        id: 'at-spekter', title: 'Emisjons- og absorpsjonsspekter',
        intro: [
          ['Linjespekter', 'Bestemte bølgelengder', 'Hvert grunnstoff har sitt eget.', 'b'],
          ['Emisjonsspekter', 'Lyse linjer', 'Lys sendes ut når elektroner faller ned til et lavere energinivå.', 'b'],
          ['Absorpsjonsspekter', 'Mørke linjer', 'Lys tas opp når elektroner løftes til et høyere energinivå.', 'b'],
        ],
        items: [
          mc('Hvorfor har hvert grunnstoff sitt eget linjespekter?', ['Hvert grunnstoff har sine egne energinivåer', 'Hvert grunnstoff har sin egen temperatur', 'Hvert grunnstoff har sin egen farge', 'Hvert grunnstoff har sin egen kjernemasse'], 'Linjene tilsvarer energiforskjeller mellom energinivåene til elektronene, og de er unike for hvert grunnstoff. Temperaturen påvirker hvor sterke linjene er, men ikke hvor de ligger.'),
          mc('Hva er forskjellen på et emisjonsspekter og et absorpsjonsspekter?', ['Emisjon gir lyse linjer på mørk bakgrunn, absorpsjon gir mørke linjer i et fullt spekter', 'Emisjon gir mørke linjer i et fullt spekter, absorpsjon gir lyse linjer på mørk bakgrunn', 'Emisjon gir et fullt spekter uten linjer, absorpsjon gir lyse linjer på mørk bakgrunn', 'Emisjon gir lyse linjer på mørk bakgrunn, absorpsjon gir linjer ved andre bølgelengder'], 'En varm gass sender ut lys ved bestemte bølgelengder (lyse linjer). En kald gass foran en varm lyskilde tar opp de samme bølgelengdene (mørke linjer). For samme grunnstoff ligger linjene på samme sted.'),
          mc('Hva skyldes de mørke linjene i sollysets spekter (Fraunhoferlinjene)?', ['Atomer i solas ytre lag absorberer bestemte bølgelengder', 'Atomer i solas indre sender ut bestemte bølgelengder', 'Atomer i jordas atmosfære sender ut bestemte bølgelengder', 'Sola er et svart legeme og stråler ikke ved visse bølgelengder'], 'Gassen i solatmosfæren er kaldere enn laget under og tar opp lys ved bølgelengdene som passer til sine energinivåer. Linjene viser hvilke grunnstoff som finnes der. Et svart legeme gir et sammenhengende spekter uten hull.'),
        ],
      },
      {
        id: 'at-drivhus', title: 'Drivhuseffekten og atomfysikk',
        intro: [
          ['Molekylvibrasjon', 'Tar opp infrarødt', 'Molekyler som CO₂ kan vibrere med frekvenser som passer med infrarød stråling, og absorberer den.', 'b'],
          ['N₂ og O₂', 'Ikke drivhusgasser', 'Molekyler med to like atomer absorberer nesten ikke infrarød stråling.', 'b'],
        ],
        items: [
          mc('Hvorfor er ikke nitrogen (N₂) en drivhusgass, selv om det er den vanligste gassen i lufta?', ['Molekylet har to like atomer og absorberer nesten ikke infrarød stråling', 'Molekylet har to like atomer og absorberer nesten ikke synlig lys', 'Molekylet er for tungt til å vibrere når det treffes av stråling', 'Molekylet reflekterer infrarød stråling tilbake ut i rommet'], 'Et molekyl med to like atomer får ingen skjev ladningsfordeling når det vibrerer, og tar derfor nesten ikke opp infrarød stråling. CO₂ og vanndamp gjør det.'),
        ],
      },
    ],
  };

  // ================================================================
  // KJERNEFYSIKK
  // ================================================================
  const unit_kf = {
    id: 'kf',
    title: 'Kjernefysikk',
    color: '#7c5cff', dark: '#5f43d6',
    goal: 'Eleven skal kunne forstå begrepet fusjon.',
    guide: [
      ['Atomkjernen', 'Protontall Z, nøytrontall N og nukleontall A = Z + N.\nIsotoper: samme Z, ulikt N.\nDen sterke kjernekraften holder nukleonene sammen og er mye sterkere enn den elektriske frastøtningen på korte avstander.'],
      ['Masse og energi', 'E = m·c²\nMassedefekt: en kjerne veier mindre enn summen av nukleonene. Forskjellen tilsvarer bindingsenergien.\n1 u = 1,66 · 10⁻²⁷ kg, som tilsvarer 931,5 MeV.'],
      ['Fusjon', 'Lette kjerner smelter sammen til tyngre og frigjør energi, fordi produktet er sterkere bundet (opp til jern og nikkel).\nKrever svært høy temperatur og tetthet for å overvinne den elektriske frastøtningen.\nI sola: 4 ¹H → ⁴He + 2e⁺ + 2ν, ca. 26,7 MeV per heliumkjerne.\nFisjon er det motsatte: tunge kjerner deles.'],
    ],
    skills: [
      {
        id: 'kf-kjernen', title: 'Atomkjernen',
        intro: [
          ['Z', 'Protontall', 'Antall protoner i kjernen.', 's'],
          ['A', 'Nukleontall', 'Protoner + nøytroner.', 's'],
          ['N = A − Z', 'Nøytrontall', 'Antall nøytroner.', 'f'],
        ],
        items: [
          mc('Hvilken kraft holder protonene og nøytronene sammen i kjernen?', ['Den sterke kjernekraften', 'Tyngdekraften', 'Den elektriske kraften', 'Friksjon'], 'Den virker over svært korte avstander og er sterkere enn frastøtningen mellom protonene.'),
          match([['Z', 'Protontall'], ['N', 'Nøytrontall'], ['A', 'Nukleontall'], ['Isotoper', 'Samme Z, ulik N']], 'Koble symbolet med betydningen'),
        ],
      },
      {
        id: 'kf-isotop', title: 'Isotoper og sterk kjernekraft',
        intro: [
          ['Isotop', 'Samme Z, ulik N', 'Samme grunnstoff, ulik masse.', 'b'],
          ['Sterk kjernekraft', 'Holder kjernen sammen', 'Virker mellom nukleonene på svært korte avstander, og er mye sterkere enn den elektriske frastøtningen.', 'b'],
        ],
        items: [
          tf('Isotoper av et grunnstoff har ulikt antall protoner.', false, 'Isotoper har likt antall protoner, men ulikt antall nøytroner.'),
        ],
      },
      {
        id: 'kf-radioaktiv', title: 'Radioaktiv stråling',
        intro: [
          ['α-stråling', 'Heliumkjerner', 'To protoner og to nøytroner. Stoppes av et ark papir.', 's'],
          ['β⁻-stråling', 'Elektroner', 'Et nøytron i kjernen blir til et proton, og et elektron sendes ut.', 's'],
          ['γ-stråling', 'Fotoner med høy energi', 'Elektromagnetisk stråling fra kjernen. Trenger gjennom mye materiale.', 's'],
        ],
        items: [
          mc('Hvilken type stråling stoppes av et ark papir?', ['α-stråling', 'β⁻-stråling', 'γ-stråling', 'Røntgenstråling'], 'α-partikler er store og har dobbel ladning, så de vekselvirker sterkt og stoppes raskt. β-stråling stoppes av noen millimeter aluminium, og γ-stråling trenger bly eller betong.'),
        ],
      },
      {
        id: 'kf-bevaring', title: 'Bevaringslover i kjernereaksjoner',
        intro: [
          ['ΣA før = ΣA etter', 'Nukleontallet er bevart', 'Summen av nukleontallene er den samme før og etter en kjernereaksjon.', 'f'],
          ['ΣZ før = ΣZ etter', 'Ladningen er bevart', 'Summen av ladningene (protontallene) er den samme før og etter.', 'f'],
        ],
        items: [
          tf('I et β⁻-henfall øker protontallet med 1, mens nukleontallet er uendret.', true, 'Et nøytron blir til et proton og et elektron. Nukleontallet er det samme, og ladningen er bevart fordi elektronet tar med seg −1.'),
        ],
      },
      {
        id: 'kf-masse', title: 'Masse og energi',
        intro: [
          ['E = mc²', 'Masse og energi', 'Masse kan omdannes til energi.', 'f'],
          ['Massedefekt', 'Δm', 'Kjernen veier mindre enn delene.', 'b'],
          ['u', 'Atommasseenhet', '1 u tilsvarer 931,5 MeV.', 's'],
        ],
        items: [
          mc('Hva er massedefekten til en atomkjerne?', ['Summen av massene til nukleonene minus massen til kjernen', 'Massen til kjernen minus summen av massene til nukleonene', 'Summen av massene til elektronene minus massen til kjernen', 'Massen kjernen mister hver gang den sender ut stråling'], 'Kjernen veier mindre enn delene hver for seg. Forskjellen, Δm, tilsvarer bindingsenergien E = Δm·c².'),
          mc('Hvor ligger toppen på kurven for bindingsenergi per nukleon?', ['Ved jern og nikkel', 'Ved helium og litium', 'Ved uran og plutonium', 'Ved karbon og oksygen'], 'Toppen ligger rundt A ≈ 56–62. Derfor gir fusjon av lette kjerner og fisjon av tunge kjerner energi, fordi produktene kommer nærmere toppen. Helium har en lokal topp, men ikke den høyeste.'),
          bank('Fullfør Einsteins formel', 'E = ▢ · ▢', ['m', 'c²'], ['v²', 'g', 'h'], 'E = mc²', { any: true }),
        ],
      },
      {
        id: 'kf-fusjon', title: 'Fusjon og fisjon',
        intro: [
          ['Fusjon', 'Lette kjerner smelter sammen', 'Frigjør energi opp til jern.', 'b'],
          ['Fisjon', 'Tunge kjerner deles', 'Brukes i kjernekraftverk.', 'b'],
          ['4 ¹H → ⁴He', 'Fusjon i sola', 'Hydrogen blir til helium.', 'f'],
        ],
        items: [
          mc('Hva er fusjon?', ['Lette atomkjerner smelter sammen til en tyngre kjerne', 'En tung kjerne deles i to', 'Et elektron hopper til et lavere energinivå', 'En kjerne sender ut et alfapartikkel'], 'Fisjon er det motsatte: deling av tunge kjerner.'),
          mc('Hvorfor krever fusjon svært høy temperatur?', ['Kjernene må ha stor fart for å komme nær hverandre tross den elektriske frastøtningen', 'Kjernene må ha stor fart for å overvinne den sterke kjernekraften som frastøter dem', 'Elektronene må fjernes helt fra atomene før kjernene kan tiltrekke hverandre', 'Kjernene må varmes opp til de smelter sammen, slik som metaller gjør'], 'Kjernene er positive og frastøter hverandre. Først på svært korte avstander tar den sterke kjernekraften over, og den er tiltrekkende. Høy temperatur gir kjernene nok fart til å komme så nær.'),
          mc('Hva er hovedreaksjonen i sola?', ['Hydrogen fusjonerer til helium', 'Uran deles til lettere stoffer', 'Karbon brenner med oksygen', 'Helium deles til hydrogen'], 'Netto: 4 ¹H → ⁴He + 2e⁺ + 2ν + energi'),
          mc('Hvorfor frigjør fusjon av lette kjerner energi?', ['Produktet er sterkere bundet, så massen etterpå er mindre enn før', 'Produktet er svakere bundet, så massen etterpå er mindre enn før', 'Produktet er sterkere bundet, så massen etterpå er større enn før', 'Produktet har flere nukleoner, så massen etterpå er større enn før'], 'Lette kjerner ligger lavt på bindingsenergikurven. Når de smelter sammen, blir produktet sterkere bundet, og den totale massen synker. Massetapet blir frigjort som energi etter E = mc².'),
          tf('Fusjon av to jernkjerner frigjør energi.', false, 'Jern har høyest bindingsenergi per nukleon. Fusjon av jern krever energi.'),
          bank('Fullfør fusjonsreaksjonen i en fusjonsreaktor', '²H + ³H → ⁴He + ▢', ['n'], ['p', 'e⁻', 'γ'], 'Deuterium + tritium gir helium-4 og et nøytron (1 + 2 = 2 + 1 nøytroner, 1 + 1 = 2 protoner).'),
        ],
      },
      {
        id: 'kf-kjede', title: 'Kjedereaksjon og anvendelser',
        intro: [
          ['Kjedereaksjon', 'Nøytroner starter nye fisjoner', 'Hver fisjon sender ut nøytroner som kan spalte nye kjerner.', 'b'],
          ['Kritisk masse', 'Nok til å holde reaksjonen i gang', 'Den minste massen som gir en kjedereaksjon som holder seg selv i gang.', 'b'],
          ['Moderator', 'Bremser nøytronene', 'Langsomme nøytroner spalter uran-235 lettere. Vann eller grafitt brukes.', 'b'],
        ],
        items: [
          mc('Hva gjør moderatoren i et kjernekraftverk?', ['Bremser nøytronene, så de lettere spalter nye urankjerner', 'Tar opp nøytronene, så kjedereaksjonen stopper helt', 'Øker farten til nøytronene, så de spalter flere kjerner', 'Kjøler ned reaktoren, så vannet ikke begynner å koke'], 'Langsomme nøytroner fanges lettere inn av uran-235. Kontrollstaver, ikke moderatoren, tar opp nøytroner for å regulere reaksjonen.'),
        ],
      },
    ],
  };

  // ================================================================
  // ASTROFYSIKK
  // ================================================================
  const unit_as = {
    id: 'as',
    title: 'Astrofysikk',
    color: '#3949ab', dark: '#283593',
    goal: 'Eleven skal kunne forstå hvordan ulike grunnstoff kan dannes når stjerner lever, kolliderer og dør.',
    guide: [
      ['Stjerners liv', 'Stjerner dannes når gass- og støvskyer trekker seg sammen.\nHovedserien: fusjon av hydrogen til helium i kjernen.\nMassen bestemmer levetiden: tunge stjerner lever kort, lette stjerner lever lenge.\nSola: rød kjempe → planetarisk tåke → hvit dverg.\nMassive stjerner: rød superkjempe → supernova → nøytronstjerne eller svart hull.'],
      ['Dannelse av grunnstoff', 'Big Bang: hydrogen, helium og litt litium.\nRøde kjemper: helium → karbon og oksygen (trippel-alfa-prosessen).\nMassive stjerner: fusjon i lag helt opp til jern.\nFusjon stopper ved jern, fordi jern har størst bindingsenergi per nukleon.'],
      ['Tyngre enn jern', 'Dannes ved nøytroninnfanging etterfulgt av betaminus-henfall.\ns-prosessen (langsom): i store, gamle stjerner.\nr-prosessen (rask): i supernovaer og kolliderende nøytronstjerner (kilonova). Kilonovaen som ble observert i 2017, bekreftet at tunge grunnstoffer som gull dannes slik.'],
      ['Stjernespektre', 'Absorpsjonslinjene i spekteret viser hvilke grunnstoff stjerna består av.\nFargen (Wiens lov) forteller overflatetemperaturen.'],
    ],
    skills: [
      {
        id: 'as-hr', title: 'HR-diagrammet',
        intro: [
          ['HR-diagram', 'Luminositet mot temperatur', 'Stjernene plottes etter overflatetemperatur (synkende mot høyre) og luminositet.', 'b'],
          ['Luminositet', 'Total utstrålt effekt', 'Hvor mye energi stjerna stråler ut per sekund.', 'b'],
          ['Farge', 'Temperatur', 'Blå stjerner er varme, røde er kalde.', 'b'],
        ],
        items: [
          mc('En stjerne ser blåhvit ut. Hva kan vi si om den?', ['Den har høy overflatetemperatur', 'Den har lav overflatetemperatur', 'Den er nær ved å dø', 'Den er laget av is'], 'Etter Wiens lov ligger toppen ved kort bølgelengde.'),
        ],
      },
      {
        id: 'as-liv1', title: 'Livssyklus til stjerner 1',
        intro: [
          ['Hovedserien', 'H → He i kjernen', 'Den lengste fasen i livet til en stjerne.', 'b'],
          ['Rød kjempe', 'Oppsvulmet stjerne', 'Fusjon av helium til karbon og oksygen.', 'b'],
        ],
        items: [
          mc('Hva gir en stjerne på hovedserien energi?', ['Fusjon av hydrogen til helium i kjernen', 'Fusjon av helium til karbon i kjernen', 'Fisjon av tunge grunnstoff i kjernen', 'Sammentrekning som varmer opp kjernen'], 'Hydrogenfusjon i kjernen er den lengste fasen i livet til en stjerne. Heliumfusjon til karbon skjer senere, i røde kjemper.'),
          mc('Hva bestemmer først og fremst hvordan livet til en stjerne blir?', ['Massen', 'Fargen', 'Avstanden til jorda', 'Hvor mange planeter den har'], 'Massen avgjør temperatur, levetid og hvordan stjerna dør.'),
          tf('Massive stjerner lever lenger enn små stjerner.', false, 'Massive stjerner bruker opp brenselet mye raskere og lever kortere.'),
        ],
      },
      {
        id: 'as-liv2', title: 'Livssyklus til stjerner 2',
        intro: [
          ['Supernova', 'Eksplosjon', 'Slutten for en massiv stjerne.', 'b'],
          ['Hvit dverg', 'Restkjerne', 'Slutten for stjerner som sola.', 'b'],
        ],
        items: [
          mc('Hvordan vil sola ende livet sitt?', ['Som en hvit dverg etter å ha vært rød kjempe', 'Som et svart hull', 'Som en nøytronstjerne etter en supernova', 'Den lever evig'], 'Sola er ikke massiv nok til å bli supernova.'),
          mc('Hva kan bli igjen etter en supernova fra en svært massiv stjerne?', ['En nøytronstjerne eller et svart hull', 'En hvit dverg eller en nøytronstjerne', 'En hvit dverg eller en rød kjempe', 'En rød kjempe eller et svart hull'], 'Kjernen kollapser under sin egen tyngde. Hvite dverger er sluttstadiet for stjerner som sola, som ikke blir supernovaer. En rød kjempe er en fase før slutten, ikke en rest.'),
          match([['Hovedserien', 'H → He'], ['Rød kjempe', 'He → C og O'], ['Supernova', 'Kjernekollaps'], ['Hvit dverg', 'Sluttstadiet for sola']], 'Koble fasen med prosessen'),
        ],
      },
      {
        id: 'as-bigbang', title: 'Big Bang og standardmodellen',
        intro: [
          ['Big Bang', 'H og He', 'De første grunnstoffene.', 'b'],
          ['Kosmisk bakgrunnsstråling', 'Ekko fra Big Bang', 'Mikrobølgestråling fra hele himmelen, som viser at universet en gang var varmt og tett.', 'b'],
          ['Ekspanderende univers', 'Galaksene fjerner seg', 'Lyset fra fjerne galakser er rødforskjøvet: jo lenger unna, jo raskere fjerner de seg.', 'b'],
        ],
        items: [
          mc('Hvilke grunnstoff ble i hovedsak dannet i Big Bang?', ['Hydrogen og helium', 'Hydrogen og karbon', 'Helium og oksygen', 'Karbon og oksygen'], 'Big Bang ga i hovedsak hydrogen og helium, og litt litium. Universet ble for raskt for kaldt og tynt til at tyngre kjerner rakk å dannes. Karbon og oksygen er dannet senere, i stjerner.'),
        ],
      },
      {
        id: 'as-nukleo', title: 'Stjerne-nukleosyntesen',
        intro: [
          ['Trippel-alfa', '3 He → C', 'Dannelse av karbon i røde kjemper.', 'b'],
          ['r-prosessen', 'Rask nøytroninnfanging', 'Lager gull i nøytronstjernekollisjoner.', 'b'],
          ['Kilonova', 'Nøytronstjernekollisjon', 'Observert i 2017, dannet tunge grunnstoff.', 'b'],
        ],
        items: [
          mc('Hvorfor stopper fusjonen i stjerner ved jern?', ['Jern ligger på toppen av bindingsenergikurven, så videre fusjon frigjør ikke energi', 'Jern ligger på toppen av bindingsenergikurven, så videre fusjon frigjør ekstra mye energi', 'Jern har lavest bindingsenergi per nukleon, så kjernen er for ustabil til å fusjonere', 'Temperaturen i kjernen synker når jern dannes, så fusjonen stopper av seg selv'], 'Bindingsenergien per nukleon øker opp til jern og nikkel og avtar etterpå. Fusjon av lettere kjerner gir energi fordi produktet er sterkere bundet. Fusjon av jern ville gitt svakere bundne kjerner, så den krever energi i stedet for å gi energi. Stjernekjernen slutter da å produsere energi og kollapser.'),
          mc('Hvordan dannes grunnstoff som er tyngre enn jern?', ['Kjerner fanger inn nøytroner og gjennomgår deretter betaminus-henfall', 'Kjerner fanger inn protoner og gjennomgår deretter betapluss-henfall', 'Kjerner fusjonerer med helium i kjernen til stjerner på hovedserien', 'Kjerner av jern fusjonerer med hverandre i kjernen til røde kjemper'], 'Nøytroner har ingen ladning og frastøtes ikke av kjernen. Når kjernen får for mange nøytroner, gjør et betaminus-henfall et nøytron om til et proton, og grunnstoffet blir et nytt. Dette skjer i s-prosessen og r-prosessen. Fusjon av jern frigjør ikke energi.'),
          mc('Hvor er mye av gullet i universet dannet?', ['Når nøytronstjerner kolliderer', 'Når hvite dverger kolliderer', 'I kjernen til røde kjemper', 'I kjernen til stjerner som sola'], 'Den raske r-prosessen trenger enorme mengder frie nøytroner, slik det finnes når nøytronstjerner kolliderer. Noe kan også dannes i supernovaer. Vanlige stjerner lager ikke grunnstoff tyngre enn jern i stor grad.'),
          mc('Hvordan dannes karbon i stjerner?', ['Tre heliumkjerner fusjonerer til én karbonkjerne', 'To heliumkjerner fusjonerer til én karbonkjerne', 'Seks hydrogenkjerner fusjonerer til én karbonkjerne', 'En oksygenkjerne deles i to, og gir karbon og helium'], 'Dette er trippel-alfa-prosessen, som skjer i røde kjemper med svært høy temperatur i kjernen. To heliumkjerner gir beryllium-8, som er ustabilt, så en tredje heliumkjerne må komme til raskt.'),
          tf('Karbonet i kroppen din er dannet i stjerner.', true, 'Vi består bokstavelig talt av stjernestøv.'),
          mc('Hvorfor var kilonovaen som ble observert i 2017 viktig?', ['Den bekreftet at tunge grunnstoff som gull dannes når nøytronstjerner kolliderer', 'Den bekreftet at tunge grunnstoff som gull dannes når hvite dverger kolliderer', 'Den bekreftet at tunge grunnstoff som gull dannes i kjernen til røde kjemper', 'Den bekreftet at tunge grunnstoff som gull ble dannet like etter Big Bang'], 'Både gravitasjonsbølger og lys ble observert fra samme hendelse, en kollisjon mellom to nøytronstjerner, og spekteret viste tegn på tunge grunnstoff.'),
        ],
      },
      {
        id: 'as-spekter', title: 'Stjernespektre',
        intro: [
          ['Absorpsjonslinjer', 'Mørke linjer', 'Viser hvilke grunnstoff stjerna inneholder.', 'b'],
          ['Rødforskyvning', 'Lengre bølgelengde', 'Lys fra en kilde som fjerner seg fra oss, får lengre bølgelengde.', 'b'],
        ],
        items: [
          mc('Hvordan vet vi hvilke grunnstoff fjerne stjerner består av?', ['Ved å studere absorpsjonslinjene i spekteret deres', 'Ved å måle temperaturen ut fra fargen på lyset deres', 'Ved å måle massen ut fra hvor sterkt de lyser', 'Ved å måle avstanden ut fra hvor fort lyset deres når oss'], 'Hvert grunnstoff har sine egne linjer i spekteret. Fargen og Wiens lov gir temperaturen, men ikke hva stjernen består av.'),
        ],
      },
    ],
  };

  // ================================================================
  // SIMULERINGER I PYTHON
  // ================================================================
  const unit_py = {
    id: 'py',
    title: 'Simuleringer i Python',
    color: '#2b70c9', dark: '#1f5296',
    goal: 'Kjenne igjen byggesteinene i et Python-program og bruke Eulers metode til å simulere bevegelse.',
    guide: [
      ['Eulers metode', 'Del tiden i små steg dt.\nI hvert steg: a = (formel), v = v + a·dt, s = s + v·dt, t = t + dt.\nMindre dt gir mer nøyaktig resultat.'],
      ['Python', 'for i in range(n): gjentar n ganger.\nwhile betingelse: gjentar så lenge betingelsen er sann.\nif betingelse: kjører bare når betingelsen er sann.\nv**2 betyr v².'],
    ],
    skills: [
      {
        id: 'py-euler', title: 'Eulers metode',
        intro: [
          ['dt', 'Tidssteg', 'Et lite tidsrom i en numerisk beregning.', 's'],
          ['v = v + a·dt', 'Eulers metode for fart', 'I hvert lite tidssteg øker farten med a·dt.', 'f'],
          ['s = s + v·dt', 'Eulers metode for posisjon', 'I hvert tidssteg flytter legemet seg v·dt.', 'f'],
        ],
        items: [
          mc('Hvorfor trenger vi numeriske metoder for å beregne bevegelse med luftmotstand?', ['Akselerasjonen endrer seg med farten, så bevegelsesformlene gjelder ikke', 'Farten endrer seg med akselerasjonen, så bevegelsesformlene gjelder ikke', 'Tyngdekraften endrer seg med høyden, så bevegelsesformlene gjelder ikke', 'Luftmotstanden er konstant, så bevegelsesformlene gir for store verdier'], 'Luftmotstanden avhenger av farten, så akselerasjonen endrer seg hele tiden. De sju bevegelsesformlene forutsetter konstant akselerasjon. At farten endrer seg, er ikke problemet i seg selv: det gjør den også ved konstant akselerasjon.'),
          mc('Hvordan oppdaterer vi farten i ett steg av Eulers metode?', ['v = v + a·dt', 'v = v + s·dt', 'v = a·dt', 'v = v·a·dt'], 'Endringen i fart i et lite tidssteg er a·dt.'),
          mc('Hva skjer med resultatet fra Eulers metode når tidssteget dt blir mindre?', ['Resultatet blir mer nøyaktig, men programmet må regne flere steg', 'Resultatet blir mer nøyaktig, og programmet må regne færre steg', 'Resultatet blir det samme, men programmet må regne flere steg', 'Resultatet blir mindre nøyaktig, fordi farten endrer seg mer per steg'], 'Eulers metode antar at akselerasjonen og farten er konstante gjennom hvert tidssteg. Jo mindre dt er, desto mindre endrer de seg i løpet av ett steg, og feilen blir mindre. Til gjengjeld trengs flere steg for å dekke samme tidsrom.'),
          bank('Fullfør linja som oppdaterer posisjonen i Eulers metode', 's = s + ▢ * dt', ['v'], ['a', 's', 't'], 'Posisjonen endres med v·dt i hvert tidssteg.', { code: true }),
          mc('Hva modellerer denne linja i et program for et fallende legeme?', ['Fritt fall med luftmotstand som øker med kvadratet av farten', 'Fritt fall med luftmotstand som er konstant gjennom hele fallet', 'Fritt fall uten luftmotstand, der akselerasjonen øker med farten', 'Et kast oppover der luftmotstanden øker med kvadratet av farten'], 'Tyngden gir g nedover, og leddet k/m · v² er luftmotstanden delt på massen. Den virker motsatt vei av bevegelsen og øker med kvadratet av farten. Uten det leddet ville akselerasjonen vært konstant lik g.', { code: 'a = g - k/m * v**2' }),
        ],
      },
      {
        id: 'py-lokker', title: 'Løkker og beslutninger',
        intro: [
          ['for i in range(n)', 'for-løkke', 'Gjentar koden et bestemt antall ganger, her n ganger.', 'b'],
          ['while t < t_slutt', 'while-løkke', 'Gjentar koden så lenge betingelsen er sann.', 'b'],
          ['if v < 0', 'if-setning', 'Kjører koden bare når betingelsen er sann.', 'b'],
        ],
        items: [
          mc('Du vil simulere et fall til ballen treffer bakken, men vet ikke hvor mange steg det tar. Hvilken løkke passer best?', ['En while-løkke med betingelsen s > 0', 'En for-løkke med range(100)', 'En if-setning med betingelsen s > 0', 'En for-løkke med range(s)'], 'En while-løkke fortsetter så lenge betingelsen er sann, så den stopper av seg selv når ballen når bakken.'),
        ],
      },
      {
        id: 'py-lister', title: 'Lister og datatyper',
        intro: [
          ['Liste', 'Samling av verdier', 't = [0, 0.1, 0.2] lagrer flere verdier. append() legger til en ny verdi.', 'b'],
          ['float', 'Desimaltall', 'Tall med desimaler, som 9.81. Python bruker punktum som desimaltegn.', 'b'],
          ['**', 'Potens i Python', 'v**2 betyr v². Tegnet ^ betyr noe annet i Python.', 's'],
        ],
        items: [
          tf('I Python skriver du v² som v^2.', false, 'I Python er ** potens: v**2. Tegnet ^ er en annen operasjon (bitvis XOR) og gir feil svar.'),
        ],
      },
    ],
  };

  // ================================================================
  // MATEMATIKK FOR FYSIKK 1
  // ================================================================
  const unit_ma = {
    id: 'ma',
    title: 'Matematikk for Fysikk 1',
    color: '#ce82ff', dark: '#a568cc',
    goal: 'Kunne de matematiske verktøyene som brukes i Fysikk 1: trigonometri, Pytagoras og omforming av formler.',
    guide: [
      ['Trigonometri', 'I en rettvinklet trekant:\nsin v = motstående / hypotenus\ncos v = hosliggende / hypotenus\ntan v = motstående / hosliggende'],
      ['Pytagoras og formler', 'a² + b² = c², der c er hypotenusen.\nFor å snu en formel gjør du det samme på begge sider til den ukjente står alene.'],
    ],
    skills: [
      {
        id: 'ma-trig', title: 'Sinus, cosinus og tangens',
        intro: [
          ['sin v = motstående / hypotenus', 'Sinus', 'Gjelder i en rettvinklet trekant.', 'f'],
          ['cos v = hosliggende / hypotenus', 'Cosinus', 'Gjelder i en rettvinklet trekant.', 'f'],
          ['tan v = motstående / hosliggende', 'Tangens', 'Gjelder i en rettvinklet trekant.', 'f'],
        ],
        items: [
          mc('På et skråplan med helningsvinkel α er tyngdekomponenten langs planet G·sin α. Hvorfor brukes sinus?', ['Komponenten langs planet ligger motstående til vinkelen α i krafttrekanten', 'Komponenten langs planet ligger hosliggende til vinkelen α i krafttrekanten', 'Komponenten langs planet er hypotenusen i krafttrekanten', 'Sinus brukes alltid for krefter, og cosinus for strekninger'], 'I krafttrekanten er G hypotenusen. Komponenten langs planet ligger motstående til α, så den er G·sin α, og komponenten inn mot planet er G·cos α.'),
        ],
      },
      {
        id: 'ma-pyt', title: 'Pytagoras og vinkler',
        intro: [
          ['a² + b² = c²', 'Pytagorassetningen', 'c er hypotenusen i en rettvinklet trekant.', 'f'],
          ['v = sin⁻¹(…)', 'Finne vinkelen', 'sin⁻¹, cos⁻¹ og tan⁻¹ gir vinkelen når verdien til sinus, cosinus eller tangens er kjent.', 'f'],
        ],
        items: [
          tf('Pytagorassetningen gjelder i alle trekanter.', false, 'Den gjelder bare i rettvinklede trekanter, der c er hypotenusen, siden motstående til den rette vinkelen.'),
        ],
      },
      {
        id: 'ma-formler', title: 'Bokstavuttrykk og likninger',
        intro: [
          ['Snu formelen', 'Løse for en størrelse', 'Gjør det samme på begge sider av likhetstegnet til den ukjente står alene.', 'b'],
          ['s = v·t ⇔ t = s/v', 'Eksempel på omforming', 'Del på v på begge sider.', 'f'],
        ],
        items: [
          mc('Løs formelen F = m·a for m.', ['m = F/a', 'm = a/F', 'm = F·a', 'm = F − a'], 'Del på a på begge sider: F/a = m.'),
        ],
      },
    ],
  };

  // ---------- ordliste (trykk på ordet i appen for forklaring) ----------
  // W(): ord med valgfri bøyningsendelse. Første bokstav kan være stor eller liten.
  const W = (w) => `(?<![\\p{L}\\p{N}])[${w[0].toUpperCase()}${w[0]}]${w.slice(1)}\\p{L}*`;
  const glossary = [
    ['Akselerasjon', W('akselerasjon'), 'Endring i hastighet per tid. a = Δv/Δt, enhet m/s².'],
    ['Hastighet', W('hastighet'), 'Hvor fort og i hvilken retning noe beveger seg. En vektor, enhet m/s.'],
    ['Fart', W('fart'), 'Størrelsen av hastigheten, uten retning. Enhet m/s.'],
    ['Forflytning', W('forflytning'), 'Endring i posisjon, med retning. Kan være mindre enn strekningen du har gått.'],
    ['Bevegelseslikningene', W('bevegelseslikning'), 'De fire formlene for bevegelse med konstant akselerasjon, f.eks. v = v₀ + at.'],
    ['Eulers metode', W('euler'), 'Numerisk metode: del tiden i små steg dt og oppdater v = v + a·dt og s = s + v·dt i hvert steg.'],
    ['Numerisk metode', W('numerisk'), 'Regner seg fram til en tilnærmet løsning steg for steg, ofte med et program.'],
    ['Kraftsum', W('kraftsum'), 'Summen av alle kreftene som virker på et legeme, ΣF. Newtons 2. lov: ΣF = ma.'],
    ['Normalkraft', W('normalkraft'), 'Kraften fra et underlag, rettet vinkelrett ut fra underlaget.'],
    ['Friksjon', W('friksjon'), 'Kraft langs underlaget som motvirker gliding. R = μN.'],
    ['Friksjonstall', W('friksjonstall'), 'μ: forholdet mellom friksjonskraften og normalkraften. Uten enhet.'],
    ['Tyngde', W('tyngde'), 'Kraften fra jorda på et legeme: G = mg.'],
    ['Luftmotstand', W('luftmotstand'), 'Kraft fra lufta mot bevegelsen. Øker med farten, f.eks. L = kv².'],
    ['Terminalfart', W('terminalfart'), 'Farten der luftmotstanden er like stor som tyngden, slik at farten slutter å øke.'],
    ['Snordrag', W('snordrag'), 'Kraften fra en snor eller et tau, rettet langs snora.'],
    ['Skråplan', W('skråplan'), 'Et skrått underlag. Tyngden deles i komponentene mg·sin α langs og mg·cos α inn mot planet.'],
    ['Arbeid', W('arbeid'), 'Energi overført av en kraft: W = F·s·cos α. Enhet J.'],
    ['Effekt', W('effekt'), 'Energi per tid: P = W/t. Enhet W = J/s.'],
    ['Kinetisk energi', W('kinetisk'), 'Bevegelsesenergi: E_k = ½mv².'],
    ['Potensiell energi', W('potensiell'), 'Stillingsenergi i tyngdefeltet: E_p = mgh.'],
    ['Mekanisk energi', W('mekanisk'), 'Summen av kinetisk og potensiell energi.'],
    ['Virkningsgrad', W('virkningsgrad'), 'η = nyttig energi / tilført energi. Alltid mindre enn 100 %.'],
    ['Energikvalitet', W('energikvalitet'), 'Hvor lett energien kan gjøres om til andre former. Elektrisk energi har høy kvalitet, lunken varme lav.'],
    ['Bevegelsesmengde', W('bevegelsesmengde'), 'p = mv. En vektor, enhet kg·m/s. Er bevart i et isolert system.'],
    ['Impuls', W('impuls'), 'I = F·Δt. Er lik endringen i bevegelsesmengde.'],
    ['Isolert system', W('isolert'), 'Et system der summen av ytre krefter er null.'],
    ['Elastisk støt', W('elastisk'), 'Støt der både bevegelsesmengde og kinetisk energi er bevart.'],
    ['Uelastisk støt', W('uelastisk'), 'Støt der bevegelsesmengden er bevart, men noe kinetisk energi blir til andre former.'],
    ['Rekyl', W('rekyl'), 'Bevegelse bakover når noe skytes ut forover, fordi total bevegelsesmengde må forbli den samme.'],
    ['Ladning', W('ladning'), 'Egenskap som gir elektriske krefter. Måles i coulomb (C). e = 1,60 · 10⁻¹⁹ C.'],
    ['Strøm', W('strøm'), 'Ladning per tid gjennom en leder: I = Q/t. Enhet ampere (A).'],
    ['Spenning', W('spenning'), 'Energi per ladning: U = W/Q. Enhet volt (V).'],
    ['Resistans', W('resistans'), 'Hvor mye en komponent hindrer strømmen: R = U/I. Enhet ohm (Ω).'],
    ['Resistivitet', W('resistivitet'), 'ρ: materialkonstant. R = ρL/A.'],
    ['Ems', W('ems'), 'Elektromotorisk spenning: energien spenningskilden gir hver ladning, ε.'],
    ['Polspenning', W('polspenning'), 'Spenningen mellom polene på en kilde når det går strøm: U = ε − R_i·I.'],
    ['Indre resistans', W('indre resistans'), 'Resistansen inne i selve batteriet, R_i.'],
    ['Seriekobling', W('seriekobl'), 'Komponenter etter hverandre. Samme strøm gjennom alle.'],
    ['Parallellkobling', W('parallellkobl'), 'Komponenter i hver sin grein. Samme spenning over alle.'],
    ['Temperatur', W('temperatur'), 'Mål på den gjennomsnittlige kinetiske energien til partiklene.'],
    ['Kelvin', W('kelvin'), 'SI-enheten for temperatur. T (K) = t (°C) + 273,15.'],
    ['Varme', W('varme'), 'Energi som overføres på grunn av temperaturforskjell, Q.'],
    ['Indre energi', W('indre energi'), 'Den totale energien til alle partiklene i et stoff, U.'],
    ['Spesifikk varmekapasitet', W('spesifikk varmekapasitet'), 'c: energien som trengs for å varme 1 kg av stoffet 1 K. Q = cmΔT.'],
    ['Smeltevarme', W('smeltevarme'), 'Energi per kg som trengs for å smelte et stoff ved konstant temperatur.'],
    ['Konveksjon', W('konveksjon'), 'Varmetransport ved at væske eller gass strømmer.'],
    ['Bølgelengde', W('bølgelengde'), 'λ: avstanden mellom to bølgetopper. Enhet m.'],
    ['Frekvens', W('frekvens'), 'f: antall svingninger per sekund. Enhet Hz.'],
    ['Svart legeme', W('svart legeme'), 'Et legeme som absorberer all stråling som treffer det, og som stråler perfekt ved sin temperatur.'],
    ['Wiens forskyvningslov', W('wien'), 'λ_maks · T = 2,90 · 10⁻³ m·K.'],
    ['Stefan–Boltzmanns lov', W('stefan'), 'Utstrålt intensitet fra et svart legeme: I = σT⁴.'],
    ['Emissivitet', W('emissivitet'), 'e: hvor godt en flate stråler sammenliknet med et svart legeme (0 til 1).'],
    ['Albedo', W('albedo'), 'Andelen av innkommende stråling som reflekteres. Jorda ≈ 0,30.'],
    ['Solarkonstanten', W('solarkonstant'), 'Intensiteten fra sola ved jordas avstand, S ≈ 1361 W/m².'],
    ['Drivhuseffekt', W('drivhus'), 'Gasser i atmosfæren absorberer infrarød stråling fra jorda og sender noe tilbake, så jorda blir varmere.'],
    ['Foton', W('foton'), 'Et lyskvant med energi E = hf.'],
    ['Elektronvolt', W('elektronvolt'), '1 eV = 1,60 · 10⁻¹⁹ J.'],
    ['Linjespekter', W('linjespekter'), 'Spekter med bare bestemte bølgelengder, typisk for hvert grunnstoff.'],
    ['Energinivå', W('energinivå'), 'De bestemte energiene et elektron kan ha i et atom (Bohr).'],
    ['Isotop', W('isotop'), 'Atomer med samme antall protoner, men ulikt antall nøytroner.'],
    ['Nukleon', W('nukleon'), 'Fellesnavn på protoner og nøytroner.'],
    ['Massedefekt', W('massedefekt'), 'Kjernen veier mindre enn delene sine. Forskjellen tilsvarer bindingsenergien.'],
    ['Bindingsenergi', W('bindingsenergi'), 'Energien som trengs for å dele en kjerne i frie nukleoner.'],
    ['Fusjon', W('fusjon'), 'Lette kjerner smelter sammen til tyngre og frigjør energi.'],
    ['Fisjon', W('fisjon'), 'En tung kjerne deles i to lettere og frigjør energi.'],
    ['Hovedserien', W('hovedserie'), 'Den lengste fasen i livet til en stjerne, med fusjon av hydrogen til helium i kjernen.'],
    ['Supernova', W('supernova'), 'Eksplosjonen når en massiv stjerne dør.'],
    ['Nøytronstjerne', W('nøytronstjerne'), 'Svært tett rest etter en supernova, nesten bare nøytroner.'],
    ['Delta (Δ)', 'Δ', 'Δ betyr «endring i», f.eks. Δv = v − v₀.'],
    ['Sum (Σ)', 'Σ', 'Σ betyr «summen av», f.eks. ΣF = summen av kreftene.'],
    ['My (μ)', 'μ', 'μ er friksjonstallet: R = μN.'],
    ['Sigma (σ)', 'σ', 'σ = 5,67 · 10⁻⁸ W/(m²K⁴), Stefan–Boltzmanns konstant.'],
    ['Lambda (λ)', 'λ', 'λ er bølgelengden.'],
    ['Rho (ρ)', 'ρ', 'ρ er resistiviteten i elektrisitet (Ωm), eller tetthet.'],
    ['Epsilon (ε)', 'ε', 'ε er ems, spenningen fra kilden.'],
    ['Eta (η)', 'η', 'η er virkningsgraden.'],
    ['v₀', 'v₀', 'Startfarten, farten ved t = 0.'],
    ['v̄', 'v̄', 'Gjennomsnittsfart. Ved konstant akselerasjon er v̄ = (v₀ + v)/2.'],
    ['Momentanfart', W('momentanfart'), 'Farten i et bestemt øyeblikk: stigningstallet til tangenten i s-t-grafen, eller v(t) = s′(t).'],
    ['Parameterfremstilling', W('parameterfremstilling'), 'Posisjonen gitt som en funksjon av tiden, s(t).'],
    ['E_k', 'E_k', 'Kinetisk energi, ½mv².'],
    ['E_p', 'E_p', 'Potensiell energi, mgh.'],
    ['Ohm (Ω)', 'Ω', 'Ω (ohm) er enheten for resistans. 1 Ω = 1 V/A.'],
    ['kWh', 'kWh', 'Kilowattime: 1 kWh = 3,6 · 10⁶ J.'],
  ].map(([t, m, d]) => ({ t, m, d }));


  // Gamle ferdigheter → nye deltemaer, så fremgangen blir med over.
  const migrate = { u1s1: ['rb-intro', 'rb-gjfart'], u1s3: ['rb-gjfart', 'rb-momfart'], u1s1b: ['rb-gjaks'], u1s3b: ['rb-gjaks', 'rb-momaks', 'rb-areal'], u1s2: ['rb-formel1'], u1s2b: ['rb-formel2'], u1s5: ['rb-utled'], u1s5b: ['rb-utled'], u1s6: ['rb-param'], u1s6b: ['rb-param'], u1s4: ['rb-fritt'], u2s1: ['nl-kraft'], u2s1b: ['nl-lover'], u2s2: ['nl-n2'], u2s2b: ['nl-n2'], u2s3: ['nl-friksjon'], u2s3b: ['nl-luft'], u2s4: ['nl-skraplan'], u2s4b: ['nl-system'], u3s1: ['me-arbeid'], u3s2: ['me-kin', 'me-totarb'], u3s2b: ['me-pot'], u3s3: ['me-bevaring', 'me-ikke'], u3s1b: ['me-effekt'], u3s4: ['me-kvalitet', 'me-virk'], u4s1: ['bm-p', 'bm-impuls'], u4s2: ['bm-bevaring'], u4s3: ['bm-stot', 'bm-sentralt'], u5s1: ['el-ladning'], u5s1b: ['el-spenning'], u5s2: ['el-ohm'], u5s3: ['el-serie', 'el-parallell'], u5s3b: ['el-krets'], u5s4: ['el-effekt'], u6s1: ['tf-temp', 'tf-indre'], u6s2: ['tf-varmekap'], u6s3: ['tf-fase', 'tf-fordamp', 'tf-1lov'], u6s4: ['tf-varmepumpe', 'tf-klima'], u7s1: ['bs-bolger'], u7s1b: ['bs-spekter'], u7s2: ['bs-wien'], u7s3: ['bs-stefan'], u7s4: ['bs-balanse', 'bs-drivhus'], u8s1: ['at-modeller'], u8s2: ['at-straling'], u8s3: ['at-bohr', 'at-spekter'], u9s1: ['kf-kjernen'], u9s1b: ['kf-isotop'], u9s2: ['kf-masse'], u9s3: ['kf-fusjon'], u10s3: ['as-hr', 'as-spekter'], u10s1: ['as-liv1'], u10s1b: ['as-liv2'], u10s2: ['as-bigbang', 'as-nukleo'], u1s4b: ['py-euler'] };

  window.FYSIKK1 = {
    id: 'fysikk1',
    title: 'Fysikk 1',
    short: 'Fysikk 1',
    icon: 'atom',
    // pugg-modus: flashkort med selvvurdering, og 10–40 % av kortene fra andre temaer
    drill: true,
    glossary,
    migrate,
    units: [unit_vm, unit_rb, unit_nl, unit_me, unit_bm, unit_el, unit_tf, unit_bs, unit_at, unit_kf, unit_as, unit_py, unit_ma],
    fmt: f,
  };
})();
