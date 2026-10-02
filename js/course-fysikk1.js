/* Fysikk 1 (LK20) – kursinnhold.
 *
 * Oppgavetyper:
 *   mc(spørsmål, [riktig, feil, feil, ...], forklaring, {code})   – flervalg, første alternativ er riktig
 *   tf(påstand, sant?, forklaring)                                 – sant/usant
 *   num(() => ({ q, a, u, e, tol }))                               – regneoppgave, nye tall hver gang
 *   bank(spørsmål, mal med ▢, [svar], [distraktorer], forklaring, {any, code})
 *   match([[venstre, høyre], ...], spørsmål)                        – koble par
 */
(function () {
  'use strict';

  // ---------- hjelpefunksjoner ----------
  const ri = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const rs = (a, b, s) => +(a + s * ri(0, Math.round((b - a) / s))).toFixed(6);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const rad = (deg) => (deg * Math.PI) / 180;
  const g = 9.81;
  const c = 3.0e8;
  const e0 = 1.6e-19;
  const h = 6.63e-34;
  const sigma = 5.67e-8;
  const wien = 2.9e-3;

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
  const code = (q, src, opts, e) => ({ t: 'mc', q, opts, e, code: src });
  const tf = (q, ans, e) => ({ t: 'tf', q, ans, e });
  const num = (gen) => ({ t: 'num', gen });
  const bank = (q, tpl, ans, dis, e, extra = {}) => ({ t: 'bank', q, tpl, ans, dis, e, ...extra });

  // Små grafer som SVG. Fargen følger teksten, så de fungerer i mørk modus.
  // vt: v-t-graf gjennom punktene [[t, v], …] med t fra 0 til 2,4 s og v fra −12 til 12 m/s.
  function vt(pts) {
    const X = (t) => 22 + t * 52, Y = (v) => 62 - v * 4.4;
    const path = pts.map(([t, v], i) => `${i ? 'L' : 'M'}${X(t).toFixed(1)} ${Y(v).toFixed(1)}`).join(' ');
    return `<svg class="graph" viewBox="0 0 170 124" role="img" aria-label="v-t-graf"><g stroke="currentColor" fill="none" stroke-width="1.6">
      <path d="M22 116 V6 M14 62 H160" stroke-opacity=".7"/><path d="M19 10 l3 -6 l3 6 M156 59 l6 3 l-6 3" stroke-opacity=".7"/>
      <path d="M74 59 v6 M126 59 v6" stroke-opacity=".7"/><path d="${path}" stroke="#1cb0f6" stroke-width="2.6"/></g>
      <g fill="currentColor" font-size="11" font-family="inherit"><text x="27" y="12">v</text><text x="160" y="76">t</text><text x="66" y="77">1 s</text><text x="118" y="77">2 s</text></g></svg>`;
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
  // ENHET 1 – RETTLINJET BEVEGELSE
  // ================================================================
  const u1 = {
    id: 'u1',
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
        id: 'u1s1', title: 'Fart og akselerasjon',
        // trinn med høyst tre nye begreper hver
        parts: [
          { title: 'Posisjon og fart', intro: [0, 1, 3], items: [1, 5, 6, 7] },
          { title: 'Akselerasjon', intro: [2, 4] },
        ],
        intro: [["s", "Posisjon eller strekning", "Hvor langt legemet er fra et valgt nullpunkt, eller hvor langt det har beveget seg. Enhet: meter (m).", "s"], ["v", "Fart eller hastighet", "Hvor fort (og i hvilken retning) legemet beveger seg. Enhet: m/s.", "s"], ["Δ", "Delta: «endring i»", "Δv = v − v₀ betyr endringen i fart. Δt betyr et tidsrom.", "s"], ["v̄ = Δs/Δt", "Gjennomsnittsfart", "Strekning delt på tid. Momentanfarten er stigningstallet til tangenten i s-t-grafen.", "f"], ["a = (v − v₀)/t", "Formel 1: akselerasjon", "Endring i fart per tid. Enhet: m/s².", "f"]],
        items: [
          mc('Hva er SI-enheten for akselerasjon?', ['m/s²', 'm/s', 'N', 'km/h'], 'Akselerasjon er endring i hastighet per tid: (m/s)/s = m/s².'),
          mc('Hva er forskjellen på fart og hastighet?', ['Hastighet har retning, fart har bare størrelse', 'Fart har retning, hastighet har bare størrelse', 'Det er ingen forskjell i fysikk', 'Fart måles i m/s², hastighet i m/s'], 'Hastighet er en vektor (størrelse og retning). Fart er bare størrelsen.'),
          tf('Hvis akselerasjonen er negativ, bremser legemet alltid ned.', false, 'Det kommer an på retningen til hastigheten. Er både v og a negative, øker farten.'),
          mc('Et legeme har negativ hastighet og negativ akselerasjon. Hva skjer med farten?', ['Farten øker', 'Farten avtar', 'Farten er konstant', 'Legemet står stille'], 'Når v og a har samme fortegn, peker de samme vei, og farten øker.'),
          match([['s', 'm'], ['v', 'm/s'], ['a', 'm/s²'], ['t', 's']], 'Koble størrelsen med SI-enheten'),
          num(() => { const s = ri(10, 90) * 10, t = ri(20, 80); return { q: `En syklist tilbakelegger ${s} m på ${t} s. Hva er gjennomsnittsfarten?`, a: s / t, u: 'm/s', e: `v = s / t = ${s} m / ${t} s = ${f(s / t)} m/s` }; }),
          num(() => { const v = pick([36, 54, 72, 90, 108]); return { q: `En bil kjører i ${v} km/h. Hva er farten i m/s?`, a: v / 3.6, u: 'm/s', e: `Del på 3,6: ${v} / 3,6 = ${f(v / 3.6)} m/s` }; }),
          num(() => { const v = pick([5, 10, 15, 20, 25]); return { q: `En løper holder ${v} m/s. Hva er farten i km/h?`, a: v * 3.6, u: 'km/h', e: `Gang med 3,6: ${v} · 3,6 = ${f(v * 3.6)} km/h` }; }),
          num(() => { const v0 = ri(0, 10), v = v0 + ri(5, 20), t = ri(2, 8); return { q: `Farten øker jevnt fra ${v0} m/s til ${v} m/s på ${t} s. Hva er akselerasjonen?`, a: (v - v0) / t, u: 'm/s²', e: `a = Δv / Δt = (${v} − ${v0}) / ${t} = ${f((v - v0) / t)} m/s²` }; }),
        ],
      },
      {
        id: 'u1s2', title: 'Bevegelseslikningene',
        // trinn med høyst tre nye begreper hver
        parts: [
          { title: 'Formel 2, 3 og 4', intro: [0, 1, 2], items: [2, 4, 8, 10] },
          { title: 'Formel 5, 6 og 7', intro: [3, 4, 5] },
        ],
        intro: [["v = v₀ + at", "Formel 2: fart", "Farten etter tiden t når akselerasjonen er konstant.", "f"], ["v̄ = (v₀ + v)/2", "Formel 3: gjennomsnittsfart", "Gjennomsnittsfarten ved konstant akselerasjon.", "f"], ["s = v̄·t", "Formel 4: strekning", "Strekning er gjennomsnittsfart ganger tid.", "f"], ["s = (v₀ + v)/2 · t", "Formel 5: strekning uten a", "Formel 3 satt inn i formel 4.", "f"], ["s = v₀t + ½at²", "Formel 6: strekning uten v", "Når du kjenner startfart, akselerasjon og tid.", "f"], ["2as = v² − v₀²", "Formel 7: den tidløse", "Kobler fart og strekning uten tiden t.", "f"]],
        items: [
          mc('Når gjelder bevegelseslikningene (som s = v₀t + ½at²)?', ['Bare når akselerasjonen er konstant', 'Bare når farten er konstant', 'Bare når legemet starter fra ro', 'Alltid'], 'Alle de fire bevegelseslikningene forutsetter konstant akselerasjon.'),
          mc('Du kjenner v₀, v og a, men ikke tiden. Hvilken likning bruker du for å finne strekningen?', ['2as = v² − v₀²', 'v = v₀ + at', 's = v₀t + ½at²', 's = ½(v₀ + v)t'], '2as = v² − v₀² er den eneste av likningene som ikke inneholder t.'),
          bank('Fullfør bevegelseslikningen', 'v = v₀ + ▢ · ▢', ['a', 't'], ['s', 'v', 'm'], 'v = v₀ + a·t: hastigheten øker med a for hvert sekund.', { any: true }),
          bank('Fullfør den tidløse likningen', '2 · ▢ · ▢ = v² − v₀²', ['a', 's'], ['t', 'v', 'g'], '2as = v² − v₀²', { any: true }),
          num(() => { const v0 = ri(0, 15), a = rs(0.5, 4, 0.5), t = ri(2, 10); return { q: `En bil har startfart ${v0} m/s og akselererer med ${f(a)} m/s² i ${t} s. Hva er farten etterpå?`, a: v0 + a * t, u: 'm/s', e: `v = v₀ + at = ${v0} + ${f(a)} · ${t} = ${f(v0 + a * t)} m/s` }; }),
          num(() => { const v0 = ri(0, 10), a = rs(1, 4, 0.5), t = ri(2, 8); const s = v0 * t + 0.5 * a * t * t; return { q: `Et tog har startfart ${v0} m/s og akselerasjon ${f(a)} m/s². Hvor langt kommer det på ${t} s?`, a: s, u: 'm', e: `s = v₀t + ½at² = ${v0}·${t} + ½·${f(a)}·${t}² = ${f(s)} m` }; }),
          num(() => { const v0 = ri(10, 30), a = rs(4, 8, 0.5); const s = (v0 * v0) / (2 * a); return { q: `En bil i ${v0} m/s bremser med akselerasjon −${f(a)} m/s² til den står stille. Hva er bremselengden?`, a: s, u: 'm', e: `2as = v² − v₀² ⇒ s = (0 − ${v0}²) / (2 · (−${f(a)})) = ${f(s)} m` }; }),
          num(() => { const v0 = ri(2, 10), v = v0 + ri(4, 15), t = ri(3, 10); const s = 0.5 * (v0 + v) * t; return { q: `Farten øker jevnt fra ${v0} m/s til ${v} m/s i løpet av ${t} s. Hvor langt beveger legemet seg?`, a: s, u: 'm', e: `s = ½(v₀ + v)t = ½(${v0} + ${v})·${t} = ${f(s)} m` }; }),
          num(() => { const v0 = ri(10, 30), a = rs(2, 6, 0.5); return { q: `En syklist i ${v0} m/s bremser med akselerasjonen −${f(a)} m/s². Hvor lang tid tar det før syklisten står stille?`, a: v0 / a, u: 's', e: `v = v₀ + at ⇒ t = (0 − ${v0}) / (−${f(a)}) = ${f(v0 / a)} s` }; }),
          mc('Du kjenner v₀, v og t, men ikke akselerasjonen. Hvilken formel gir strekningen direkte?', ['s = (v₀ + v)/2 · t', 's = v₀t + ½at²', '2as = v² − v₀²', 'v = v₀ + at'], 'Formel 5 er den eneste strekningsformelen uten a.'),
          num(() => { const v0 = ri(0, 10), v = v0 + ri(4, 16); return { q: `Farten øker jevnt fra ${v0} m/s til ${v} m/s. Hva er gjennomsnittsfarten?`, a: (v0 + v) / 2, u: 'm/s', e: `v̄ = (v₀ + v)/2 = (${v0} + ${v})/2 = ${f((v0 + v) / 2)} m/s` }; }),
          num(() => { const v0 = ri(2, 6), v = v0 * pick([2, 3, 4]), sx = ri(2, 6) * 10; const a = (v * v - v0 * v0) / (2 * sx); return { q: `En kloss øker farten fra ${v0} m/s til ${v} m/s over en strekning på ${sx} m. Hva er akselerasjonen?`, a, u: 'm/s²', e: `2as = v² − v₀² ⇒ a = (${v}² − ${v0}²)/(2·${sx}) = ${f(a)} m/s²` }; }),
        ],
      },
      {
        id: 'u1s3', title: 'Bevegelsesgrafer',
        // trinn med høyst tre nye begreper hver
        parts: [
          { title: 's-t-grafer', intro: [0, 2], items: [2, 4, 5] },
          { title: 'v-t-grafer', intro: [1, 3] },
        ],
        intro: [["s-t-graf", "Posisjon mot tid", "Stigningstallet er hastigheten.", "b"], ["v-t-graf", "Hastighet mot tid", "Stigningstallet er akselerasjonen. Arealet under grafen er forflytningen.", "b"], ["Stigningstall", "Hvor bratt grafen er", "Δy/Δx. For en v-t-graf: Δv/Δt = a.", "b"], ["Areal under grafen", "Høyde ganger bredde", "Under en v-t-graf har arealet enheten (m/s)·s = m, altså strekning.", "b"]],
        items: [
          mc('Hva forteller arealet under en v-t-graf?', ['Forflytningen', 'Akselerasjonen', 'Farten', 'Kraften'], 'Areal = v · t, som har enheten m. Det er forflytningen.'),
          mc('Hva er stigningstallet til en v-t-graf?', ['Akselerasjonen', 'Forflytningen', 'Posisjonen', 'Massen'], 'Stigningstall = Δv / Δt = a.'),
          mc('Hva gir stigningstallet til tangenten i et punkt på en s-t-graf?', ['Momentanhastigheten', 'Akselerasjonen', 'Gjennomsnittsfarten fra start', 'Strekningen'], 'Δs / Δt i et punkt er hastigheten akkurat da (momentanhastigheten).'),
          mc('En v-t-graf er en vannrett linje over t-aksen. Hva betyr det?', ['Konstant hastighet forskjellig fra null', 'Legemet står i ro', 'Konstant akselerasjon forskjellig fra null', 'Legemet bremser'], 'v endrer seg ikke, så a = 0, men v > 0.'),
          tf('En s-t-graf som er en rett, skrå linje betyr konstant akselerasjon.', false, 'Rett skrå linje i s-t-graf betyr konstant hastighet (a = 0).'),
          mc('En s-t-graf krummer oppover og blir brattere og brattere. Hva betyr det?', ['Hastigheten øker', 'Hastigheten avtar', 'Hastigheten er konstant', 'Legemet beveger seg bakover'], 'Brattere s-t-graf betyr større stigningstall, altså større hastighet.'),
          num(() => { const v = ri(4, 20), t = ri(3, 10); return { q: `I en v-t-graf øker farten jevnt fra 0 til ${v} m/s på ${t} s. Hvor langt har legemet beveget seg?`, a: 0.5 * v * t, u: 'm', e: `Arealet under grafen er en trekant: ½ · ${t} · ${v} = ${f(0.5 * v * t)} m` }; }),
          num(() => { const v1 = ri(0, 8), v2 = v1 + ri(4, 16), t = ri(2, 8); return { q: `En v-t-graf går i en rett linje fra (0 s, ${v1} m/s) til (${t} s, ${v2} m/s). Hva er akselerasjonen?`, a: (v2 - v1) / t, u: 'm/s²', e: `a = stigningstall = (${v2} − ${v1}) / ${t} = ${f((v2 - v1) / t)} m/s²` }; }),
        ],
      },
      {
        id: 'u1s5', title: 'Utled bevegelsesformlene',
        // trinn med høyst tre nye begreper hver
        parts: [
          { title: 'Utled formel 2 og 3', intro: [0, 1, 2], items: [0, 1, 6, 8, 11, 12] },
          { title: 'Utled formel 5, 6 og 7', intro: [3] },
        ],
        intro: [["a = (v − v₀)/t", "Formel 1: akselerasjon", "Definisjonen av akselerasjon når a er konstant. Utgangspunktet for alle utledningene.", "f"], ["v̄ = s/t", "Definisjonen av gjennomsnittsfart", "Gjennomsnittsfarten er strekning delt på tid. Gir formel 4: s = v̄t.", "f"], ["Lineær fart", "Farten øker jevnt", "Ved konstant a er v-t-grafen en rett linje. Da er gjennomsnittsfarten midt mellom v₀ og v.", "b"], ["Innsetting", "Sett en formel inn i en annen", "Slik får vi formel 5, 6 og 7.", "b"]],
        items: [
          order('Utled formel 2: v = v₀ + at', ['Start med formel 1: a = (v − v₀)/t', 'Gang begge sider med t: at = v − v₀', 'Legg v₀ til på begge sider: v = v₀ + at'], ['v = at − v₀'], 'Formel 2 er bare formel 1 løst for v.'),
          order('Utled formel 3: v̄ = (v₀ + v)/2', ['Med konstant akselerasjon øker farten lineært med tiden', 'v-t-grafen er en rett linje fra v₀ til v', 'Gjennomsnittet av en lineær størrelse er gjennomsnittet av start- og sluttverdien', 'v̄ = (v₀ + v)/2'], ['v̄ = v − v₀'], 'Formel 3 gjelder bare når akselerasjonen er konstant.'),
          order('Utled formel 5: s = (v₀ + v)/2 · t', ['Start med formel 4: s = v̄·t', 'Sett inn formel 3: v̄ = (v₀ + v)/2', 's = (v₀ + v)/2 · t'], ['s = (v₀ − v)/2 · t'], 'Grafisk er dette arealet av trapeset under v-t-grafen.'),
          order('Utled formel 6: s = v₀t + ½at²', ['Start med formel 5: s = (v₀ + v)/2 · t', 'Sett inn formel 2: v = v₀ + at', 's = (v₀ + v₀ + at)/2 · t', 's = (2v₀ + at)/2 · t', 's = v₀t + ½at²'], ['s = v₀t + at²'], 'Vi erstatter v med v₀ + at og ganger ut.'),
          order('Utled formel 7: 2as = v² − v₀²', ['Løs formel 1 for t: t = (v − v₀)/a', 'Sett inn i formel 5: s = (v₀ + v)/2 · (v − v₀)/a', 'Gang begge sider med 2a: 2as = (v + v₀)(v − v₀)', 'Bruk konjugatsetningen: 2as = v² − v₀²'], ['2as = (v − v₀)²'], 'Ved å fjerne t får vi den tidløse formelen. (a + b)(a − b) = a² − b².'),
          bank('Fullfør steget i utledningen av formel 6', 's = (v₀ + ▢)/2 · t', ['v₀ + at'], ['v − at', 'at', 'v'], 'Vi setter inn v = v₀ + at i formel 5.'),
          bank('Løs formel 1 for tiden', 't = (▢ − ▢)/a', ['v', 'v₀'], ['s', 'a', 't'], 'Fra a = (v − v₀)/t: t = (v − v₀)/a.'),
          bank('Fullfør det siste steget mot formel 7', '2as = (v + v₀)(▢)', ['v − v₀'], ['v + v₀', 'v₀ − v', 'at'], 'Konjugatsetningen gir (v + v₀)(v − v₀) = v² − v₀².'),
          bank('Fullfør formel 4 og 3', 's = ▢ · t\nv̄ = (v₀ + ▢)/2', ['v̄', 'v'], ['a', 's', 'v₀'], 's = v̄t, og ved konstant a er v̄ = (v₀ + v)/2.'),
          mc('Hvilken formel får du når du setter v = v₀ + at inn i s = (v₀ + v)/2 · t?', ['s = v₀t + ½at²', '2as = v² − v₀²', 's = v̄t', 'v̄ = (v₀ + v)/2'], 'Dette er formel 6.'),
          mc('Hva gjør du for å utlede den tidløse formelen 2as = v² − v₀²?', ['Løser formel 1 for t og setter inn i formel 5', 'Deriverer formel 6', 'Setter v₀ = 0', 'Ganger formel 2 med seg selv'], 'Da forsvinner t fra formelen.'),
          mc('Hvorfor gjelder v̄ = (v₀ + v)/2 bare når akselerasjonen er konstant?', ['Bare da øker farten lineært, så gjennomsnittet ligger midt mellom start og slutt', 'Fordi v₀ alltid er null', 'Fordi strekningen da er null', 'Den gjelder alltid'], 'Øker farten ujevnt, kan gjennomsnittsfarten ligge hvor som helst mellom v₀ og v.'),
          mc('Hvilken geometrisk figur er arealet under v-t-grafen når farten øker jevnt fra v₀ til v?', ['Et trapes', 'En sirkel', 'Et kvadrat', 'En parabel'], 'Trapesarealet (v₀ + v)/2 · t er formel 5.'),
          match([['v = v₀ + at', 'Mangler s'], ['s = (v₀ + v)/2 · t', 'Mangler a'], ['s = v₀t + ½at²', 'Mangler v'], ['2as = v² − v₀²', 'Mangler t']], 'Koble formelen med størrelsen den ikke inneholder'),
          tf('Formel 6 og 7 er utledet ved å sette formel 1 eller 2 inn i formel 5.', true, 'Formel 6: sett inn v = v₀ + at. Formel 7: sett inn t = (v − v₀)/a.'),
        ],
      },
      {
        id: 'u1s6', title: 'Parameterfremstilling',
        // trinn med høyst tre nye begreper hver
        parts: [
          { title: 'Posisjon, fart og akselerasjon', intro: [0, 1, 2], items: [0, 2, 3, 4, 9] },
          { title: 'Snupunktet', intro: [3] },
        ],
        intro: [["s(t)", "Posisjon som funksjon av tid", "En formel som gir posisjonen for hvert tidspunkt t.", "f"], ["v(t) = s′(t)", "Fart er den deriverte av posisjonen", "Stigningstallet til s(t) i hvert punkt.", "f"], ["a(t) = v′(t)", "Akselerasjon er den deriverte av farten", "Stigningstallet til v(t) i hvert punkt.", "f"], ["v(t) = 0", "Snupunktet", "Legemet snur når farten skifter fortegn.", "f"]],
        items: [
          mc('Hvordan finner du v(t) når posisjonen s(t) er gitt?', ['Deriverer s(t)', 'Integrerer s(t)', 'Deler s(t) på t', 'Setter t = 0'], 'v(t) = s′(t).'),
          mc('Hvordan finner du tidspunktet der legemet snur?', ['Løser v(t) = 0', 'Løser s(t) = 0', 'Løser a(t) = 0', 'Setter t = 0'], 'I snupunktet er farten null.'),
          mc('Posisjonen er s(t) = 3t − 0,5t². Hva er akselerasjonen?', ['−1 m/s², konstant', '3 m/s²', '−0,5 m/s²', 'Den endrer seg med tiden'], 'v(t) = 3 − t og a(t) = −1.'),
          bank('Deriver posisjonen', 's(t) = 3t − 0,5t²\nv(t) = ▢ − ▢', ['3', 't'], ['0,5t', '1,5', 't²'], 'Den deriverte av 3t er 3, og av 0,5t² er t.'),
          tf('Er s(t) et andregradspolynom i t, er akselerasjonen konstant.', true, 'Den andrederiverte av et andregradspolynom er en konstant.'),
          mc('Tea løper etter en buss som akselererer fra ro. Hvordan finner du ut om hun tar den igjen?', ['Setter s_T(t) = s_B(t) og sjekker om likningen har løsning', 'Sammenlikner startfartene', 'Setter v_B(t) = 0', 'Regner ut bussens akselerasjon'], 'Hun tar bussen igjen hvis posisjonene blir like for en verdi av t.'),
          num(() => { const b = ri(2, 8), c = pick([0.5, 1, 2]); return { q: `Posisjonen er s(t) = ${f(b)}t − ${f(c)}t² (s i m, t i s). Når snur legemet?`, a: b / (2 * c), u: 's', e: `v(t) = ${f(b)} − ${f(2 * c)}t = 0 ⇒ t = ${f(b / (2 * c))} s` }; }),
          num(() => { const b = ri(2, 8), c = pick([0.5, 1, 2]); const t = b / (2 * c); return { q: `Posisjonen er s(t) = ${f(b)}t − ${f(c)}t². Hvor langt fra start er legemet når det snur?`, a: b * t - c * t * t, u: 'm', e: `Snur ved t = ${f(t)} s. s = ${f(b)}·${f(t)} − ${f(c)}·${f(t)}² = ${f(b * t - c * t * t)} m` }; }),
          num(() => { const b = ri(2, 8), c = pick([0.5, 1, 2]); return { q: `Posisjonen er s(t) = ${f(b)}t − ${f(c)}t². Når er legemet tilbake ved utgangspunktet?`, a: b / c, u: 's', e: `s(t) = t(${f(b)} − ${f(c)}t) = 0 ⇒ t = ${f(b / c)} s` }; }),
          num(() => { const k = pick([2, 4.9, 8, 13]); return { q: `En stein faller på en annen planet. Høyden er H(t) = 100 − ${f(k)}t². Hva er tyngdeakselerasjonen der?`, a: 2 * k, u: 'm/s²', e: `H(t) = H₀ − ½gt², så ½g = ${f(k)} og g = ${f(2 * k)} m/s²` }; }),
        ],
      },
      {
        id: 'u1s4', title: 'Fritt fall og numeriske metoder',
        // trinn med høyst tre nye begreper hver
        parts: [
          { title: 'Fritt fall', intro: [0, 1], items: [0, 8, 9, 10] },
          { title: 'Eulers metode', intro: [2, 3, 4] },
        ],
        intro: [["g", "Tyngdeakselerasjonen", "9,81 m/s² nedover nær jordoverflaten.", "s"], ["Fritt fall", "Bare tyngden virker", "Uten luftmotstand faller alle legemer med samme akselerasjon g.", "b"], ["dt", "Tidssteg", "Et lite tidsrom i en numerisk beregning.", "s"], ["v = v + a·dt", "Eulers metode for fart", "I hvert lite tidssteg øker farten med a·dt.", "f"], ["s = s + v·dt", "Eulers metode for posisjon", "I hvert tidssteg flytter legemet seg v·dt.", "f"]],
        items: [
          mc('Vi ser bort fra luftmotstand. En hammer og en fjær slippes samtidig fra samme høyde. Hva skjer?', ['De treffer bakken samtidig', 'Hammeren lander først', 'Fjæra lander først', 'Det avhenger av høyden'], 'I fritt fall har alle legemer samme akselerasjon g, uansett masse.'),
          mc('Hvorfor trenger vi numeriske metoder for å beregne bevegelse med luftmotstand?', ['Akselerasjonen er ikke konstant, så bevegelseslikningene gjelder ikke', 'Luftmotstand kan ikke måles', 'Datamaskiner regner alltid mer nøyaktig enn formler', 'Tyngdekraften blir borte'], 'Luftmotstanden avhenger av farten, så a endrer seg hele tiden.'),
          mc('Hvordan oppdaterer vi farten i ett steg av Eulers metode?', ['v = v + a·dt', 'v = v + s·dt', 'v = a·dt', 'v = v·a·dt'], 'Endringen i fart i et lite tidssteg er a·dt.'),
          mc('Hva skjer med resultatet fra Eulers metode når tidssteget dt blir mindre?', ['Det blir mer nøyaktig, men krever flere steg', 'Det blir mindre nøyaktig', 'Ingenting endrer seg', 'Programmet slutter å virke'], 'Små tidssteg gjør at a er tilnærmet konstant i hvert steg.'),
          bank('Fullfør linja som oppdaterer posisjonen i Eulers metode', 's = s + ▢ * dt', ['v'], ['a', 's', 't'], 'Posisjonen endres med v·dt i hvert tidssteg.', { code: true }),
          code('Hva skriver programmet ut?', 'v = 0\ndt = 0.5\nfor i in range(4):\n    a = 2\n    v = v + a*dt\nprint(v)', ['4.0', '2.0', '8.0', '1.0'], 'Fire steg, og hvert steg legger til a·dt = 2 · 0,5 = 1. Altså v = 4,0.'),
          code('Hva skriver programmet ut?', 'v = 10\ndt = 1\nfor i in range(2):\n    a = -0.5*v\n    v = v + a*dt\nprint(v)', ['2.5', '5.0', '0.0', '7.5'], 'Steg 1: a = −5, v = 5. Steg 2: a = −2,5, v = 2,5.'),
          code('Hva modellerer denne linja i et program for et fallende legeme?', 'a = g - k/m * v**2', ['Fritt fall med luftmotstand proporsjonal med v²', 'Fritt fall uten luftmotstand', 'Konstant akselerasjon', 'Et legeme som akselererer oppover'], 'Tyngden gir g nedover, og luftmotstanden kv² virker motsatt vei og øker med farten.'),
          num(() => { const hh = pick([5, 10, 20, 45, 80]); const t = Math.sqrt((2 * hh) / g); return { q: `En stein slippes fra ${hh} m høyde. Hvor lang tid tar det før den treffer bakken? (g = 9,81 m/s², se bort fra luftmotstand)`, a: t, u: 's', e: `s = ½gt² ⇒ t = √(2s/g) = √(2·${hh}/9,81) = ${f(t)} s` }; }),
          num(() => { const t = ri(1, 5); return { q: `En ball faller fritt fra ro. Hvor stor er farten etter ${t} s? (g = 9,81 m/s²)`, a: g * t, u: 'm/s', e: `v = gt = 9,81 · ${t} = ${f(g * t)} m/s` }; }),
          num(() => { const v0 = ri(5, 25); return { q: `En ball kastes rett opp med ${v0} m/s. Hvor høyt over utkastpunktet kommer den? (g = 9,81 m/s²)`, a: (v0 * v0) / (2 * g), u: 'm', e: `I toppen er v = 0: s = v₀² / (2g) = ${v0}² / 19,62 = ${f((v0 * v0) / (2 * g))} m` }; }),
          num(() => { const a = ri(1, 4), dt = pick([0.1, 0.5, 1]), n = ri(3, 6); return { q: `Programmet starter med v = 0, a = ${a} og dt = ${f(dt)}, og kjører v = v + a*dt i ${n} steg. Hva blir v til slutt?`, a: n * a * dt, u: 'm/s', e: `v = ${n} · ${a} · ${f(dt)} = ${f(n * a * dt)} m/s` }; }),
        ],
      },
      {
        // Kapitteltest fra Flipclass (rettlinjet bevegelse). Flere oppgaver kommer.
        id: 'u1kt', title: 'Kapitteltest (Flipclass)',
        items: [
          mc('Vi kaster en ball rett oppover med farten 10 m/s og ser bort fra luftmotstand. Vi setter g = 10 m/s². Ballen bruker',
            ['1,0 s til toppen og 1,0 s ned igjen', '1,0 s til toppen og kortere tid ned igjen', '1,0 s til toppen og lengre tid ned igjen', '0,50 s til toppen og 0,50 s ned igjen'],
            'På toppen er v = 0. Formel 1, a = (v − v₀)/t, gir t = (v − v₀)/a = (0 − 10)/(−10) s = 1,0 s. Uten luftmotstand er bevegelsen symmetrisk, så det tar like lang tid ned igjen.',
            { src: 'Kapitteltest 1' }),
          mc('Vi kaster en ball rett oppover med farten 10 m/s og ser bort fra luftmotstand, samme situasjon som i oppgave 1. Akselerasjonen er',
            ['10 m/s² nedover i hele kastet', '10 m/s² nedover i hele kastet, unntatt på toppen der den er 0 m/s²', '−10 m/s² på vei opp, 10 m/s² på vei ned og 0 m/s² på toppen', 'varierende hele tiden'],
            'I fritt fall er akselerasjonen konstant og rettet nedover mot jordas sentrum. Også på toppen endrer farten seg, selv om den akkurat da er null.',
            { src: 'Kapitteltest 2' }),
          mc('Vi kaster en ball rett oppover med farten 10 m/s og ser bort fra luftmotstand, samme situasjon som i oppgave 1 og 2. Hvilken graf viser farten v som funksjon av tiden t?',
            [vt([[0, 10], [2, -10]]), vt([[0, 10], [1, 0], [2, 10]]), vt([[0, 0], [1, 10], [2, 0]]), vt([[0, 10], [2.3, 10]])],
            'Med positiv retning oppover gir formel 2, v = v₀ + at = 10 − 10t, en rett linje med negativt stigningstall. Farten er 0 etter 1 s og −10 m/s etter 2 s.',
            { src: 'Kapitteltest 3', svgOpts: true }),
          mc('En partikkel beveger seg rettlinjet. Grafen viser akselerasjonen a som funksjon av tiden t. I hvilket punkt er farten størst?',
            ['C', 'B', 'A', 'D'],
            'a > 0 betyr at farten øker, og a < 0 betyr at den avtar. Farten øker helt fram til C og avtar etterpå. I B øker farten raskest, men den fortsetter å øke etter B.',
            { src: 'Kapitteltest 4', fig: atFig() }),
        ],
      },
    ],
  };

  // ================================================================
  // ENHET 2 – NEWTONS LOVER
  // ================================================================
  const u2 = {
    id: 'u2',
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
        id: 'u2s1', title: 'Newtons tre lover',
        // trinn med høyst tre nye begreper hver
        parts: [
          { title: 'Kraft og Newtons 1. lov', intro: [0, 1, 2], items: [0, 3, 5, 7] },
          { title: 'Newtons 3. lov', intro: [3] },
        ],
        intro: [["F", "Kraft", "En påvirkning som kan endre bevegelsen. Enhet: newton (N).", "s"], ["ΣF", "Kraftsum", "Summen av alle kreftene som virker på legemet.", "s"], ["N1", "Newtons 1. lov", "ΣF = 0 betyr i ro eller konstant hastighet.", "b"], ["N3", "Newtons 3. lov", "Kraft og motkraft er like store, motsatt rettet og virker på hvert sitt legeme.", "b"]],
        items: [
          mc('Hva sier Newtons 1. lov?', ['Er summen av kreftene null, er legemet i ro eller har konstant hastighet', 'Kraft er lik masse ganger akselerasjon', 'Enhver kraft har en motkraft', 'Alle legemer faller like fort'], 'Dette kalles også treghetsloven.'),
          mc('Hva sier Newtons 3. lov?', ['Når A virker på B med en kraft, virker B på A med en like stor, motsatt rettet kraft', 'ΣF = ma', 'Et legeme i ro forblir i ro', 'Kraften er proporsjonal med farten'], 'Kraft og motkraft er like store, motsatt rettet og virker på hvert sitt legeme.'),
          mc('En bok ligger i ro på et bord. Hva er motkraften (etter Newtons 3. lov) til tyngden av boka?', ['Kraften fra boka som trekker jorda oppover', 'Normalkraften fra bordet på boka', 'Friksjonen fra bordet', 'Det finnes ingen motkraft'], 'Tyngden er jorda som trekker i boka. Motkraften er boka som trekker i jorda. Normalkraften er en annen kraft som også virker på boka.'),
          tf('Et legeme som beveger seg med konstant hastighet, har kraftsum lik null.', true, 'Newtons 1. lov: konstant hastighet ⇔ ΣF = 0.'),
          tf('Kraft og motkraft virker på det samme legemet.', false, 'De virker alltid på to forskjellige legemer. Derfor kan de ikke oppheve hverandre.'),
          mc('En heis beveger seg oppover med konstant fart. Hvordan er snordraget S sammenliknet med tyngden G?', ['S = G', 'S > G', 'S < G', 'S = 0'], 'Konstant fart betyr a = 0, så ΣF = S − G = 0.'),
          match([['Newtons 1. lov', 'ΣF = 0 ⇔ konstant v'], ['Newtons 2. lov', 'ΣF = m·a'], ['Newtons 3. lov', 'Kraft og motkraft'], ['1 newton', '1 kg·m/s²']]),
          mc('Du sitter i en buss som bremser brått, og kroppen din «kastes» framover. Hvilken lov forklarer dette best?', ['Newtons 1. lov (treghet)', 'Newtons 3. lov', 'Energibevaring', 'Coulombs lov'], 'Kroppen vil fortsette med samme hastighet når bussen bremser.'),
        ],
      },
      {
        id: 'u2s2', title: 'Newtons 2. lov',
        // trinn med høyst tre nye begreper hver
        parts: [
          { title: 'Newtons 2. lov', intro: [0, 1, 3], items: [0, 1, 2, 3, 5, 8] },
          { title: 'Tyngde', intro: [2] },
        ],
        intro: [["ΣF = m·a", "Newtons 2. lov", "Kraftsummen er masse ganger akselerasjon.", "f"], ["m", "Masse", "Hvor mye stoff legemet har. Enhet: kg.", "s"], ["G = m·g", "Tyngde", "Kraften fra jorda på et legeme.", "f"], ["1 N", "Én newton", "1 kg·m/s²: kraften som gir 1 kg akselerasjonen 1 m/s².", "b"]],
        items: [
          mc('1 N er det samme som …', ['1 kg·m/s²', '1 kg·m/s', '1 kg·m²/s²', '1 J/s'], 'F = ma gir enheten kg · m/s².'),
          bank('Fullfør Newtons 2. lov', 'ΣF = ▢ · ▢', ['m', 'a'], ['v', 'g', 's'], 'Kraftsummen er masse ganger akselerasjon.', { any: true }),
          tf('Dobler du kraftsummen på et legeme, dobles akselerasjonen.', true, 'a = ΣF/m, så a er proporsjonal med ΣF.'),
          num(() => { const F = ri(10, 200), m = ri(2, 50); return { q: `En kraftsum på ${F} N virker på et legeme med masse ${m} kg. Hva blir akselerasjonen?`, a: F / m, u: 'm/s²', e: `a = ΣF / m = ${F} / ${m} = ${f(F / m)} m/s²` }; }),
          num(() => { const m = ri(1, 100); return { q: `Hva er tyngden til et legeme med masse ${m} kg? (g = 9,81 m/s²)`, a: m * g, u: 'N', e: `G = mg = ${m} · 9,81 = ${f(m * g)} N` }; }),
          num(() => { const F1 = ri(60, 200), F2 = ri(10, F1 - 20), m = ri(5, 40); return { q: `En kasse på ${m} kg blir dratt med ${F1} N mot høyre og ${F2} N mot venstre. Hva er akselerasjonen?`, a: (F1 - F2) / m, u: 'm/s²', e: `ΣF = ${F1} − ${F2} = ${F1 - F2} N, a = ${F1 - F2} / ${m} = ${f((F1 - F2) / m)} m/s²` }; }),
          num(() => { const m = ri(50, 90), a = rs(0.5, 2, 0.5); return { q: `En person på ${m} kg står på en vekt i en heis som akselererer oppover med ${f(a)} m/s². Hvor stor er normalkraften fra vekta?`, a: m * (g + a), u: 'N', e: `N − mg = ma ⇒ N = m(g + a) = ${m}·(9,81 + ${f(a)}) = ${f(m * (g + a))} N` }; }),
          num(() => { const m = ri(50, 90), a = rs(0.5, 2, 0.5); return { q: `En person på ${m} kg står i en heis som akselererer nedover med ${f(a)} m/s². Hvor stor er normalkraften fra gulvet?`, a: m * (g - a), u: 'N', e: `mg − N = ma ⇒ N = m(g − a) = ${m}·(9,81 − ${f(a)}) = ${f(m * (g - a))} N` }; }),
          num(() => { const m = ri(8, 16) * 100, v0 = ri(10, 25), t = ri(2, 6); return { q: `En bil på ${m} kg bremser jevnt fra ${v0} m/s til ro på ${t} s. Hvor stor er kraftsummen på bilen?`, a: (m * v0) / t, u: 'N', e: `a = ${v0}/${t} = ${f(v0 / t)} m/s², ΣF = ma = ${m}·${f(v0 / t)} = ${f((m * v0) / t)} N` }; }),
        ],
      },
      {
        id: 'u2s3', title: 'Friksjon og luftmotstand',
        // trinn med høyst tre nye begreper hver
        parts: [
          { title: 'Friksjon', intro: [0, 1, 2], items: [2, 3, 4, 5, 7] },
          { title: 'Luftmotstand', intro: [3] },
        ],
        intro: [["N", "Normalkraft", "Kraft fra underlaget, vinkelrett ut fra det.", "s"], ["R = μN", "Friksjon", "Friksjonskraften er friksjonstallet ganger normalkraften.", "f"], ["μ", "Friksjonstall", "Tall uten enhet som sier hvor «ru» flatene er.", "s"], ["L = kv²", "Luftmotstand", "Luftmotstanden øker med kvadratet av farten.", "f"]],
        items: [
          mc('Hva er terminalfarten til en fallskjermhopper?', ['Farten der luftmotstanden er like stor som tyngden, så farten blir konstant', 'Farten hopperen har idet hen lander', 'Den største farten et legeme kan ha', 'Farten når skjermen åpnes'], 'Da er ΣF = 0 og a = 0.'),
          mc('Hva skjer med akselerasjonen til en fallskjermhopper før skjermen utløses?', ['Den avtar fra g mot null', 'Den er konstant lik g', 'Den øker', 'Den er null hele tiden'], 'Luftmotstanden øker med farten, så kraftsummen og dermed a avtar.'),
          tf('Friksjonskraften virker motsatt vei av bevegelsen (eller tendensen til bevegelse) langs underlaget.', true, 'Friksjon motvirker den relative bevegelsen mellom flatene.'),
          mc('Friksjonstallet μ mellom en kasse og gulvet er 0,3. Hva betyr det?', ['Friksjonskraften er 0,3 ganger normalkraften', 'Friksjonen er 0,3 N', 'Kassen glir 0,3 m', 'Friksjonen er 30 % av farten'], 'R = μN.'),
          num(() => { const m = ri(5, 40), mu = pick([0.2, 0.3, 0.4, 0.5]); return { q: `En kasse på ${m} kg glir på et vannrett gulv. Friksjonstallet er ${f(mu)}. Hvor stor er friksjonskraften?`, a: mu * m * g, u: 'N', e: `R = μN = μmg = ${f(mu)}·${m}·9,81 = ${f(mu * m * g)} N` }; }),
          num(() => { const m = ri(10, 30), mu = pick([0.1, 0.2, 0.3]); const F = Math.ceil(mu * m * g) + ri(10, 60); const a = (F - mu * m * g) / m; return { q: `Du skyver en kasse på ${m} kg bortover gulvet med ${F} N. Friksjonstallet er ${f(mu)}. Hva blir akselerasjonen?`, a, u: 'm/s²', e: `R = μmg = ${f(mu * m * g)} N. a = (F − R)/m = (${F} − ${f(mu * m * g)})/${m} = ${f(a)} m/s²` }; }),
          num(() => { const m = ri(60, 90), k = pick([0.2, 0.25, 0.3]); const v = Math.sqrt((m * g) / k); return { q: `En fallskjermhopper med utstyr har masse ${m} kg. Luftmotstanden er L = kv² med k = ${f(k)} kg/m. Hva er terminalfarten?`, a: v, u: 'm/s', e: `kv² = mg ⇒ v = √(mg/k) = √(${m}·9,81/${f(k)}) = ${f(v)} m/s` }; }),
          num(() => { const v0 = ri(5, 15), mu = pick([0.1, 0.2, 0.3, 0.4]); const s = (v0 * v0) / (2 * mu * g); return { q: `En hockeypuck sendes av gårde med ${v0} m/s på et vannrett underlag med friksjonstall ${f(mu)}. Hvor langt glir den?`, a: s, u: 'm', e: `a = −μg = −${f(mu * g)} m/s². s = v₀²/(2μg) = ${f(s)} m` }; }),
        ],
      },
      {
        id: 'u2s4', title: 'Skråplan og snordrag',
        // trinn med høyst tre nye begreper hver
        parts: [
          { title: 'Skråplan', intro: [0, 1, 2], items: [0, 1, 2, 3, 4, 5, 7] },
          { title: 'Snordrag', intro: [3] },
        ],
        intro: [["α", "Helningsvinkel", "Vinkelen mellom skråplanet og vannrett.", "s"], ["G∥ = mg·sin α", "Tyngden langs planet", "Komponenten som drar legemet nedover skråplanet.", "f"], ["G⊥ = mg·cos α", "Tyngden inn mot planet", "Komponenten som presser mot underlaget. N = G⊥.", "f"], ["S", "Snordrag", "Kraften fra en snor, rettet langs snora.", "s"]],
        items: [
          mc('En kloss glir på et friksjonsfritt skråplan. Hva er akselerasjonen uavhengig av?', ['Massen til klossen', 'Helningsvinkelen', 'Tyngdeakselerasjonen g', 'Ingen av delene'], 'a = g·sin α. Massen forkortes bort.'),
          mc('Hva skjer med normalkraften på en kloss når helningsvinkelen til skråplanet øker?', ['Den avtar', 'Den øker', 'Den er uendret', 'Den blir lik tyngden'], 'N = mg·cos α, og cos α avtar når α øker.'),
          bank('Fullfør uttrykket for tyngdekomponenten langs skråplanet', 'G∥ = m · g · ▢', ['sin α'], ['cos α', 'tan α', 'α'], 'Komponenten langs planet er mg·sin α.'),
          num(() => { const m = ri(5, 30), al = pick([20, 30, 40, 45]); const G = m * g * Math.sin(rad(al)); return { q: `En kloss på ${m} kg ligger på et skråplan med helning ${al}°. Hvor stor er tyngdekomponenten langs planet?`, a: G, u: 'N', e: `G∥ = mg·sin ${al}° = ${m}·9,81·${f(Math.sin(rad(al)))} = ${f(G)} N` }; }),
          num(() => { const al = pick([10, 20, 30, 40]); const a = g * Math.sin(rad(al)); return { q: `Hva er akselerasjonen til en kloss som glir ned et friksjonsfritt skråplan med helning ${al}°?`, a, u: 'm/s²', e: `a = g·sin ${al}° = ${f(a)} m/s²` }; }),
          num(() => { const m = ri(5, 30), al = pick([20, 30, 40]); const N = m * g * Math.cos(rad(al)); return { q: `En kloss på ${m} kg ligger på et skråplan med helning ${al}°. Hvor stor er normalkraften?`, a: N, u: 'N', e: `N = mg·cos ${al}° = ${f(N)} N` }; }),
          num(() => { const m1 = ri(2, 8), m2 = ri(1, 5); const a = (m2 * g) / (m1 + m2); return { q: `En vogn på ${m1} kg står på et friksjonsfritt bord. Den er festet med en snor over en trinse til et lodd på ${m2} kg som henger fritt. Hva blir akselerasjonen?`, a, u: 'm/s²', e: `ΣF = m₂g på hele systemet: a = m₂g/(m₁ + m₂) = ${f(m2 * g)}/${m1 + m2} = ${f(a)} m/s²` }; }),
          num(() => { const mu = pick([0.1, 0.2, 0.3]); const a = g * (Math.sin(rad(30)) - mu * Math.cos(rad(30))); return { q: `En kloss glir ned et skråplan med helning 30°. Friksjonstallet er ${f(mu)}. Hva er akselerasjonen?`, a, u: 'm/s²', e: `a = g(sin 30° − μ·cos 30°) = 9,81·(0,5 − ${f(mu)}·0,866) = ${f(a)} m/s²` }; }),
        ],
      },
    ],
  };

  // ================================================================
  // ENHET 3 – MEKANISK ENERGI
  // ================================================================
  const u3 = {
    id: 'u3',
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
        id: 'u3s1', title: 'Arbeid og effekt',
        // trinn med høyst tre nye begreper hver
        parts: [
          { title: 'Arbeid', intro: [0, 2], items: [2, 3, 4, 5] },
          { title: 'Effekt og kilowattimer', intro: [1, 3] },
        ],
        intro: [["W = F·s·cos α", "Arbeid", "Energien en kraft overfører. Enhet: joule (J).", "f"], ["P = W/t", "Effekt", "Arbeid per tid. Enhet: watt (W).", "f"], ["J", "Joule", "Enheten for energi og arbeid. 1 J = 1 N·m.", "s"], ["kWh", "Kilowattime", "1 kWh = 3,6 MJ. Brukes på strømregningen.", "s"]],
        items: [
          match([['Arbeid', 'J'], ['Effekt', 'W'], ['Kraft', 'N'], ['1 kWh', '3,6 MJ']]),
          tf('1 W er det samme som 1 J/s.', true, 'Effekt er energi per tid.'),
          mc('Du bærer en sekk vannrett bortover med konstant fart. Hvor mye arbeid gjør du på sekken i fysisk forstand?', ['Null', 'Like mye som tyngden ganger strekningen', 'Det avhenger av farten', 'Negativt arbeid'], 'Kraften din er rettet oppover, vinkelrett på forflytningen. cos 90° = 0.'),
          mc('Når gjør en kraft negativt arbeid?', ['Når kraften har en komponent motsatt av bevegelsesretningen', 'Når kraften er liten', 'Når legemet står stille', 'Aldri'], 'Vinkelen er større enn 90°, så cos α < 0. Friksjon gjør typisk negativt arbeid.'),
          num(() => { const F = ri(10, 100), s = ri(2, 20); return { q: `Du drar en kasse ${s} m med en kraft på ${F} N i bevegelsesretningen. Hvor stort arbeid gjør du?`, a: F * s, u: 'J', e: `W = F·s = ${F}·${s} = ${F * s} J` }; }),
          num(() => { const F = ri(20, 100), s = ri(5, 20); return { q: `Du drar en kjelke ${s} m med en kraft på ${F} N som danner 60° med bakken. Hvor stort arbeid gjør du?`, a: F * s * 0.5, u: 'J', e: `W = F·s·cos 60° = ${F}·${s}·0,5 = ${f(F * s * 0.5)} J` }; }),
          num(() => { const m = ri(20, 80), hh = ri(2, 10), t = ri(2, 10); const P = (m * g * hh) / t; return { q: `En kran løfter ${m} kg ${hh} m opp på ${t} s med konstant fart. Hva er den gjennomsnittlige effekten?`, a: P, u: 'W', e: `P = mgh/t = ${m}·9,81·${hh}/${t} = ${f(P)} W` }; }),
          num(() => { const P = pick([500, 1000, 1500, 2000, 2500]), t = ri(1, 5); return { q: `En ovn med effekt ${P} W står på i ${t} timer. Hvor mange kWh bruker den?`, a: (P / 1000) * t, u: 'kWh', e: `E = Pt = ${f(P / 1000)} kW · ${t} h = ${f((P / 1000) * t)} kWh` }; }),
        ],
      },
      {
        id: 'u3s2', title: 'Kinetisk og potensiell energi',
        // trinn med høyst tre nye begreper hver
        parts: [
          { title: 'Kinetisk energi', intro: [0], items: [0, 3, 4, 5, 6, 8] },
          { title: 'Potensiell energi', intro: [1, 2, 3] },
        ],
        intro: [["E_k = ½mv²", "Kinetisk energi", "Bevegelsesenergi.", "f"], ["E_p = mgh", "Potensiell energi", "Stillingsenergi i tyngdefeltet.", "f"], ["h", "Høyde", "Høyden over et nullnivå du velger selv.", "s"], ["Nullnivå", "Der h = 0", "Kan velges fritt. Bare endringer i E_p betyr noe.", "b"]],
        items: [
          mc('Farten til en bil dobles. Hva skjer med den kinetiske energien?', ['Den blir fire ganger så stor', 'Den dobles', 'Den halveres', 'Den er uendret'], 'E_k = ½mv². v → 2v gir v² → 4v².'),
          mc('Hvor må nullnivået for potensiell energi ligge?', ['Det kan velges fritt', 'Alltid ved havnivå', 'Alltid på bakken', 'Alltid i jordas sentrum'], 'Det er bare endringer i E_p som betyr noe fysisk.'),
          bank('Fullfør formelen for potensiell energi', 'E_p = ▢ · ▢ · ▢', ['m', 'g', 'h'], ['v', 't', 'a'], 'E_p = mgh', { any: true }),
          bank('Fullfør formelen for kinetisk energi', 'E_k = ½ · ▢ · ▢', ['m', 'v²'], ['v', 'g', 'h'], 'E_k = ½mv²', { any: true }),
          order('Utled uttrykket for kinetisk energi (arbeid-energi-setningen)', ['Arbeidet fra kraftsummen er W = F·s', 'Newtons 2. lov: F = m·a', 'W = m·a·s', 'Formel 7 gir a·s = (v² − v₀²)/2', 'W = ½mv² − ½mv₀² = ΔE_k'], ['W = m·v·s'], 'Arbeidet fra kraftsummen er lik endringen i kinetisk energi.'),
          num(() => { const m = ri(5, 20), F = ri(10, 40), sx = ri(5, 15); const v = Math.sqrt((2 * F * sx * Math.cos(Math.PI / 6)) / m); return { q: `En kloss på ${m} kg starter i ro og dras ${sx} m bortover et friksjonsfritt gulv med en kraft på ${F} N som danner 30° med bevegelsen. Hva blir farten?`, a: v, u: 'm/s', e: `W = F·s·cos 30° = ${f(F * sx * Math.cos(Math.PI / 6))} J = ½mv² ⇒ v = ${f(v)} m/s` }; }),
          num(() => { const m = ri(1, 80), v = ri(2, 20); return { q: `Hva er den kinetiske energien til et legeme på ${m} kg med fart ${v} m/s?`, a: 0.5 * m * v * v, u: 'J', e: `E_k = ½mv² = ½·${m}·${v}² = ${f(0.5 * m * v * v)} J` }; }),
          num(() => { const m = ri(1, 80), hh = ri(1, 30); return { q: `Hvor stor potensiell energi får et legeme på ${m} kg som løftes ${hh} m?`, a: m * g * hh, u: 'J', e: `E_p = mgh = ${m}·9,81·${hh} = ${f(m * g * hh)} J` }; }),
          num(() => { const m = pick([2, 4, 8, 10]), v = ri(2, 12); const Ek = 0.5 * m * v * v; return { q: `En kule på ${m} kg har kinetisk energi ${f(Ek)} J. Hvor stor er farten?`, a: v, u: 'm/s', e: `v = √(2E_k/m) = √(2·${f(Ek)}/${m}) = ${v} m/s` }; }),
        ],
      },
      {
        id: 'u3s3', title: 'Bevaring av energi',
        intro: [["E = E_k + E_p", "Mekanisk energi", "Summen av kinetisk og potensiell energi.", "f"], ["Energibevaring", "E før = E etter", "Når bare tyngden gjør arbeid, er mekanisk energi konstant.", "b"], ["v = √(2gh)", "Fart etter fall", "Følger av mgh = ½mv².", "f"]],
        items: [
          mc('Når er den mekaniske energien til et legeme bevart?', ['Når tyngdekraften er den eneste kraften som gjør arbeid', 'Alltid', 'Bare når legemet står i ro', 'Når friksjonen er stor'], 'Andre krefter som friksjon og luftmotstand endrer den mekaniske energien.'),
          tf('To kuler ruller ned hver sin friksjonsfrie bakke med samme høydeforskjell. Den ene bakken er brattere. Farten i bunnen blir lik.', true, 'mgh = ½mv² ⇒ v = √(2gh). Bare høydeforskjellen teller.'),
          order('Utled farten etter et fall: v = √(2gh)', ['Mekanisk energi er bevart: E_p øverst = E_k nederst', 'mgh = ½mv²', 'Del på m og gang med 2: v² = 2gh', 'v = √(2gh)'], ['v = 2gh'], 'Massen forkortes bort, så farten avhenger ikke av massen.'),
          mc('Hvor stort er arbeidet friksjonen gjør på et legeme?', ['Like stort som tapet i mekanisk energi (negativt arbeid)', 'Alltid null', 'Like stort som den kinetiske energien', 'Like stort som tyngden'], 'W_R = −R·s = ΔE (endringen i mekanisk energi).'),
          num(() => { const v0 = ri(6, 12); const ht = (v0 * v0) / (2 * g); const share = pick([0.7, 0.8, 0.9]); const hm = Math.round(ht * share * 100) / 100; const loss = (1 - hm / ht) * 100; return { q: `En snøball kastes rett opp med ${v0} m/s, men kommer bare ${f(hm)} m opp. Hvor mange prosent av den mekaniske energien gikk tapt?`, a: loss, u: '%', e: `Uten tap: h = v₀²/(2g) = ${f(ht)} m. Tap = (1 − ${f(hm)}/${f(ht)})·100 % = ${f(loss)} %` }; }),
          num(() => { const m = ri(10, 25), sx = ri(15, 40), v0 = ri(4, 10); const R = (m * v0 * v0) / (2 * sx); return { q: `En curlingstein på ${m} kg sklir ${sx} m før den stopper. Startfarten var ${v0} m/s. Hvor stor er friksjonskraften?`, a: R, u: 'N', e: `R·s = ½mv₀² ⇒ R = ${m}·${v0}²/(2·${sx}) = ${f(R)} N` }; }),
          mc('En ball kastes rett opp. Hva skjer med den mekaniske energien på vei opp (uten luftmotstand)?', ['Den er konstant: E_k går over til E_p', 'Den øker', 'Den avtar', 'Den blir null i toppen'], 'Summen er bevart. I toppen er all E_k blitt E_p.'),
          num(() => { const hh = ri(2, 40); const v = Math.sqrt(2 * g * hh); return { q: `En stein slippes fra ${hh} m høyde. Hvilken fart har den rett før den treffer bakken? (Se bort fra luftmotstand)`, a: v, u: 'm/s', e: `mgh = ½mv² ⇒ v = √(2gh) = √(2·9,81·${hh}) = ${f(v)} m/s` }; }),
          num(() => { const h1 = ri(30, 60), h2 = ri(5, h1 - 10); const v = Math.sqrt(2 * g * (h1 - h2)); return { q: `En berg-og-dal-banevogn starter i ro ${h1} m over bakken. Hvilken fart har den ${h2} m over bakken? (Ingen friksjon)`, a: v, u: 'm/s', e: `v = √(2g(h₁ − h₂)) = √(2·9,81·${h1 - h2}) = ${f(v)} m/s` }; }),
          num(() => { const hh = rs(0.2, 1.2, 0.1); const v = Math.sqrt(2 * g * hh); return { q: `Et pendellodd slippes fra ${f(hh)} m over det laveste punktet. Hvilken fart har det i bunnen?`, a: v, u: 'm/s', e: `v = √(2gh) = √(2·9,81·${f(hh)}) = ${f(v)} m/s` }; }),
          num(() => { const m = ri(20, 60), hh = ri(5, 15); const vmax = Math.sqrt(2 * g * hh); const v = ri(3, Math.floor(vmax) - 1); const loss = m * g * hh - 0.5 * m * v * v; return { q: `En aking på ${m} kg (person + kjelke) starter i ro og aker ned en bakke med høydeforskjell ${hh} m. I bunnen er farten ${v} m/s. Hvor mye mekanisk energi er omdannet til varme?`, a: loss, u: 'J', e: `mgh − ½mv² = ${f(m * g * hh)} − ${f(0.5 * m * v * v)} = ${f(loss)} J` }; }),
        ],
      },
      {
        id: 'u3s4', title: 'Virkningsgrad og energikvalitet',
        intro: [["η", "Virkningsgrad", "Nyttig energi delt på tilført energi.", "s"], ["η = E_nyttig / E_tilført", "Formel for virkningsgrad", "Alltid mellom 0 og 1 (0–100 %).", "f"], ["Energikvalitet", "Hvor nyttig energien er", "Elektrisk energi har høy kvalitet. Lunken varme har lav.", "b"]],
        items: [
          mc('Hvilken energiform har høyest energikvalitet?', ['Elektrisk energi', 'Varmt vann på 40 °C', 'Luft i romtemperatur', 'Spillvarme fra en bilmotor'], 'Elektrisk energi kan omformes til nesten alle andre former med høy virkningsgrad.'),
          mc('Hvorfor kan ikke virkningsgraden til en maskin være over 100 %?', ['Energi er bevart, så du kan ikke få ut mer enn du tilfører', 'Maskiner blir varme', 'Det er forbudt ved lov', 'Fordi friksjon alltid er null'], 'η = nyttig / tilført ≤ 1 fordi energi ikke kan skapes.'),
          tf('Når mekanisk energi blir til varme på grunn av friksjon, forsvinner energien.', false, 'Energien blir indre energi i omgivelsene. Den er bevart, men energikvaliteten har sunket.'),
          mc('Hva skjer med energikvaliteten når mekanisk energi blir omdannet til varme ved friksjon?', ['Den synker', 'Den øker', 'Den er uendret', 'Den blir uendelig'], 'Varme ved lav temperatur er vanskelig å gjøre om til nyttig arbeid igjen.'),
          match([['Vannkraftverk', 'Potensiell → elektrisk'], ['Solcelle', 'Stråling → elektrisk'], ['Elektrisk motor', 'Elektrisk → mekanisk'], ['Bilmotor', 'Kjemisk → mekanisk']], 'Koble kilden med energiomformingen'),
          num(() => { const tin = ri(10, 50) * 100, eta = pick([0.2, 0.3, 0.45, 0.6, 0.85]); const out = Math.round(tin * eta); return { q: `En motor får tilført ${tin} J og gjør ${out} J nyttig arbeid. Hva er virkningsgraden i prosent?`, a: (out / tin) * 100, u: '%', e: `η = ${out} / ${tin} = ${f(out / tin)} = ${f((out / tin) * 100)} %` }; }),
          num(() => { const Pin = ri(5, 20) * 100, eta = pick([0.25, 0.35, 0.6, 0.8, 0.9]); return { q: `En elektrisk motor bruker ${Pin} W og har virkningsgrad ${f(eta * 100)} %. Hvor stor er den nyttige mekaniske effekten?`, a: Pin * eta, u: 'W', e: `P_nyttig = η·P_tilført = ${f(eta)}·${Pin} = ${f(Pin * eta)} W` }; }),
        ],
      },
    ],
  };

  // ================================================================
  // ENHET 4 – BEVEGELSESMENGDE
  // ================================================================
  const u4 = {
    id: 'u4',
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
        id: 'u4s1', title: 'Bevegelsesmengde og impuls',
        intro: [["p = m·v", "Bevegelsesmengde", "En vektor. Enhet: kg·m/s.", "f"], ["I = F·Δt", "Impuls", "Kraft ganger tiden den virker.", "f"], ["I = Δp", "Impulsloven", "Impulsen er lik endringen i bevegelsesmengde.", "f"]],
        items: [
          tf('Bevegelsesmengde er en vektor.', true, 'p = mv har samme retning som hastigheten.'),
          mc('Hvilken enhet er lik kg·m/s?', ['N·s', 'J', 'W', 'N/s'], 'Impuls F·Δt har enheten N·s = kg·m/s² · s = kg·m/s.'),
          mc('Hvorfor reduserer en kollisjonspute skadene i en kollisjon?', ['Den forlenger tiden det tar å stoppe, så kraften blir mindre', 'Den reduserer endringen i bevegelsesmengde', 'Den øker farten', 'Den gjør støtet elastisk'], 'Δp er det samme, men F = Δp/Δt blir mindre når Δt øker.'),
          bank('Fullfør impulsloven', 'F · ▢ = ▢', ['Δt', 'Δp'], ['Δs', 'p', 'm'], 'Impulsen er lik endringen i bevegelsesmengde.'),
          order('Utled impulsloven', ['Newtons 2. lov: F = m·a', 'Formel 1: a = (v − v₀)/t', 'F = m(v − v₀)/t', 'F·t = mv − mv₀', 'Impulsen er lik endringen i bevegelsesmengde: F·t = Δp'], ['F·t = m·v·t'], 'Impulsloven er Newtons 2. lov skrevet med bevegelsesmengde.'),
          num(() => { const m = ri(1, 80), v = ri(2, 30); return { q: `Hva er bevegelsesmengden til et legeme på ${m} kg med fart ${v} m/s?`, a: m * v, u: 'kg·m/s', e: `p = mv = ${m}·${v} = ${m * v} kg·m/s` }; }),
          num(() => { const F = ri(10, 200) * 10, dt = pick([0.01, 0.02, 0.05, 0.1]); return { q: `En kraft på ${F} N virker i ${f(dt)} s. Hvor stor er impulsen?`, a: F * dt, u: 'N·s', e: `I = FΔt = ${F}·${f(dt)} = ${f(F * dt)} N·s` }; }),
          num(() => { const m = pick([0.06, 0.16, 0.43]), v = ri(10, 40), dt = pick([0.005, 0.01, 0.02]); return { q: `En ball på ${f(m)} kg ligger i ro og blir sparket til ${v} m/s. Kontakttiden er ${f(dt)} s. Hvor stor er den gjennomsnittlige kraften?`, a: (m * v) / dt, u: 'N', e: `F = Δp/Δt = ${f(m)}·${v}/${f(dt)} = ${f((m * v) / dt)} N` }; }),
          num(() => { const m = 0.43, v = ri(5, 15); return { q: `En fotball på 0,43 kg treffer en vegg med ${v} m/s og spretter rett tilbake med samme fart. Hvor stor er endringen i bevegelsesmengde (tallverdi)?`, a: 2 * m * v, u: 'kg·m/s', e: `Δp = m·v − m·(−v) = 2mv = 2·0,43·${v} = ${f(2 * m * v)} kg·m/s` }; }),
        ],
      },
      {
        id: 'u4s2', title: 'Bevaring av bevegelsesmengde',
        intro: [["Σp før = Σp etter", "Bevaring av bevegelsesmengde", "Gjelder når summen av ytre krefter er null.", "f"], ["Isolert system", "Ingen ytre kraftsum", "Bare indre krefter mellom legemene virker.", "b"], ["Rekyl", "Bevegelse bakover", "Når noe skytes ut forover, får resten fart bakover.", "b"]],
        items: [
          mc('Når er den totale bevegelsesmengden til et system bevart?', ['Når summen av ytre krefter på systemet er null', 'Bare i elastiske støt', 'Bare når legemene har lik masse', 'Når friksjonen mellom legemene er null'], 'Indre krefter (som kreftene i et støt) endrer ikke den totale bevegelsesmengden.'),
          tf('I et isolert system er bevegelsesmengden bevart i alle typer støt.', true, 'Det gjelder både elastiske og uelastiske støt.'),
          mc('En kanon skyter ut en kule. Hvorfor rekylerer kanonen bakover?', ['Total bevegelsesmengde var null før, og må være null etterpå', 'Kruttet dytter luft bakover', 'Tyngdekraften trekker den bakover', 'Energi er bevart'], 'm_k·v_k + m_kule·v_kule = 0, så kanonen må få motsatt bevegelsesmengde.'),
          num(() => { const m1 = ri(8, 15) * 100, v1 = ri(5, 20), m2 = ri(8, 15) * 100; const v = (m1 * v1) / (m1 + m2); return { q: `En bil på ${m1} kg i ${v1} m/s kjører inn i en bil på ${m2} kg som står i ro. Bilene henger sammen etter støtet. Hvilken fart får de?`, a: v, u: 'm/s', e: `v′ = m₁v₁/(m₁ + m₂) = ${m1}·${v1}/${m1 + m2} = ${f(v)} m/s` }; }),
          num(() => { const mg = pick([3, 4, 5]), mb = pick([0.005, 0.01, 0.02]), vb = ri(30, 80) * 10; return { q: `Et gevær på ${mg} kg skyter ut en kule på ${f(mb)} kg med fart ${vb} m/s. Hvor stor er rekylfarten til geværet?`, a: (mb * vb) / mg, u: 'm/s', e: `0 = m_k·v_k + m_g·v_g ⇒ |v_g| = ${f(mb)}·${vb}/${mg} = ${f((mb * vb) / mg)} m/s` }; }),
          num(() => { const m1 = ri(40, 80), m2 = ri(40, 80), v1 = rs(1, 3, 0.5); return { q: `To skøyteløpere står i ro og dytter seg fra hverandre. Den ene (${m1} kg) får farten ${f(v1)} m/s. Hvilken fart får den andre (${m2} kg)?`, a: (m1 * v1) / m2, u: 'm/s', e: `m₁v₁ = m₂v₂ ⇒ v₂ = ${m1}·${f(v1)}/${m2} = ${f((m1 * v1) / m2)} m/s` }; }),
          num(() => { let m1, v1, m2, v2; do { m1 = ri(1, 4); v1 = ri(2, 6); m2 = ri(1, 4); v2 = ri(1, 5); } while (m1 * v1 === m2 * v2); const v = (m1 * v1 - m2 * v2) / (m1 + m2); return { q: `En vogn på ${m1} kg i ${v1} m/s mot høyre kolliderer med en vogn på ${m2} kg i ${v2} m/s mot venstre. De henger sammen etterpå. Hva er hastigheten etter støtet? (Positiv retning mot høyre, svar med fortegn)`, a: v, u: 'm/s', e: `v′ = (${m1}·${v1} − ${m2}·${v2})/(${m1} + ${m2}) = ${f(v)} m/s` }; }),
        ],
      },
      {
        id: 'u4s3', title: 'Elastiske og uelastiske støt',
        intro: [["Elastisk støt", "p og E_k bevart", "Ingen kinetisk energi går tapt.", "b"], ["Uelastisk støt", "Bare p bevart", "Noe E_k blir til varme, lyd og deformasjon.", "b"], ["Fullstendig uelastisk", "Legemene henger sammen", "m₁v₁ + m₂v₂ = (m₁ + m₂)v′", "b"]],
        items: [
          mc('Hva kjennetegner et elastisk støt?', ['Både bevegelsesmengde og kinetisk energi er bevart', 'Bare kinetisk energi er bevart', 'Legemene henger sammen etterpå', 'Bevegelsesmengden er ikke bevart'], 'I elastiske støt går ingen kinetisk energi over til andre former.'),
          mc('Hva kjennetegner et fullstendig uelastisk støt?', ['Legemene henger sammen og får felles fart etterpå', 'Kinetisk energi er bevart', 'Bevegelsesmengden forsvinner', 'Legemene spretter fra hverandre med samme fart'], 'Her går mest mulig E_k over til andre energiformer.'),
          tf('I et uelastisk støt forsvinner noe av bevegelsesmengden.', false, 'Bevegelsesmengden er bevart. Det er den kinetiske energien som ikke er bevart.'),
          mc('Hvor blir det av den kinetiske energien som «forsvinner» i et uelastisk støt?', ['Den blir til varme, lyd og deformasjon', 'Den blir til bevegelsesmengde', 'Den forsvinner helt', 'Den blir til potensiell energi i tyngdefeltet'], 'Energien er bevart, men går over til andre former.'),
          mc('En biljardkule treffer en like tung kule som ligger i ro, rett forfra og helt elastisk. Hva skjer?', ['Den første stopper, og den andre fortsetter med samme fart', 'Begge fortsetter med halv fart', 'Begge stopper', 'Den første spretter tilbake med samme fart'], 'Med like masser i et elastisk sentralt støt bytter kulene hastighet.'),
          num(() => { const m1 = ri(1, 4), m2 = ri(1, 4) + 1, v1 = ri(2, 6); const u2 = (2 * m1 * v1) / (m1 + m2); return { q: `En vogn på ${m1} kg i ${v1} m/s støter helt elastisk og sentralt mot en vogn på ${m2} kg i ro. Hvilken fart får vogn 2?`, a: u2, u: 'm/s', e: `Bevaring av p og E_k gir u₂ = 2m₁v₁/(m₁ + m₂) = ${f(u2)} m/s` }; }),
          num(() => { const m = pick([0.005, 0.01]), M = pick([0.45, 1]), hh = pick([0.05, 0.07, 0.1]); const u = Math.sqrt(2 * g * hh); const v = ((m + M) / m) * u; return { q: `En kule på ${f(m)} kg skytes inn i en leirklump på ${f(M)} kg som henger i en snor. Klumpen med kula løftes ${f(hh)} m. Hva var kulas fart?`, a: v, u: 'm/s', e: `Etter støtet: u = √(2gh) = ${f(u)} m/s. Bevegelsesmengde: v = (m + M)u/m = ${f(v)} m/s` }; }),
          num(() => { const m1 = ri(1, 5), v1 = ri(2, 10), m2 = ri(1, 5); const v = (m1 * v1) / (m1 + m2); const loss = 0.5 * m1 * v1 * v1 - 0.5 * (m1 + m2) * v * v; return { q: `En vogn på ${m1} kg i ${v1} m/s kolliderer med en vogn på ${m2} kg i ro, og de henger sammen. Hvor mye kinetisk energi går tapt?`, a: loss, u: 'J', e: `v′ = ${f(v)} m/s. ΔE_k = ½·${m1}·${v1}² − ½·${m1 + m2}·${f(v)}² = ${f(loss)} J` }; }),
        ],
      },
    ],
  };

  // ================================================================
  // ENHET 5 – ELEKTRISITET
  // ================================================================
  const u5 = {
    id: 'u5',
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
        id: 'u5s1', title: 'Ladning, strøm og spenning',
        // trinn med høyst tre nye begreper hver
        parts: [
          { title: 'Ladning og strøm', intro: [0, 1, 3], items: [2, 3, 4, 5] },
          { title: 'Spenning', intro: [2] },
        ],
        intro: [["Q", "Ladning", "Enhet: coulomb (C).", "s"], ["I = Q/t", "Strøm", "Ladning per tid. Enhet: ampere (A).", "f"], ["U = W/Q", "Spenning", "Energi per ladning. Enhet: volt (V).", "f"], ["e", "Elementærladningen", "1,60 · 10⁻¹⁹ C, ladningen til ett elektron (med motsatt fortegn).", "s"]],
        items: [
          match([['Ladning', 'C'], ['Strøm', 'A'], ['Spenning', 'V'], ['Resistans', 'Ω']], 'Koble størrelsen med enheten'),
          mc('Hva er elektrisk spenning?', ['Energi per ladning', 'Ladning per tid', 'Kraft per ladning', 'Strøm per resistans'], 'U = W/Q. 1 V = 1 J/C.'),
          mc('Hvordan er strømretningen definert?', ['Fra + til − utenfor spenningskilden', 'Samme vei som elektronene', 'Fra − til + utenfor spenningskilden', 'Den er tilfeldig'], 'Konvensjonen er retningen positive ladninger ville gått. Elektronene går motsatt vei.'),
          tf('Strøm i en metalltråd er elektroner som beveger seg.', true, 'I metaller er det de frie elektronene som er ladningsbærerne.'),
          num(() => { const Q = ri(10, 120), t = ri(5, 60); return { q: `En ladning på ${Q} C passerer et tverrsnitt av en ledning på ${t} s. Hvor stor er strømmen?`, a: Q / t, u: 'A', e: `I = Q/t = ${Q}/${t} = ${f(Q / t)} A` }; }),
          num(() => { const Q = pick([0.5, 1, 2, 3.2]); return { q: `Hvor mange elektroner utgjør en ladning på ${f(Q)} C? (e = 1,60 · 10⁻¹⁹ C)`, a: Q / e0, u: 'elektroner', e: `n = Q/e = ${f(Q)}/(1,60 · 10⁻¹⁹) = ${f(Q / e0)}` }; }),
          num(() => { const Q = ri(2, 50), U = pick([1.5, 9, 12, 230]); return { q: `En ladning på ${Q} C flyttes gjennom en spenning på ${f(U)} V. Hvor mye energi blir omsatt?`, a: Q * U, u: 'J', e: `W = QU = ${Q}·${f(U)} = ${f(Q * U)} J` }; }),
        ],
      },
      {
        id: 'u5s2', title: 'Ohms lov og resistans',
        intro: [["U = R·I", "Ohms lov", "Spenning er resistans ganger strøm.", "f"], ["Ω", "Ohm", "Enheten for resistans. 1 Ω = 1 V/A.", "s"], ["R = ρL/A", "Resistans i en ledning", "ρ er resistiviteten, L lengden og A tverrsnittsarealet.", "f"]],
        items: [
          bank('Fullfør Ohms lov', 'U = ▢ · ▢', ['R', 'I'], ['P', 'Q', 't'], 'Spenning = resistans · strøm', { any: true }),
          mc('Hva skjer med resistansen hvis en ledning blir dobbelt så lang (samme materiale og tverrsnitt)?', ['Den dobles', 'Den halveres', 'Den firedobles', 'Den er uendret'], 'R = ρL/A, så R er proporsjonal med L.'),
          mc('Hva skjer med resistansen hvis tverrsnittsarealet til ledningen dobles?', ['Den halveres', 'Den dobles', 'Den firedobles', 'Den er uendret'], 'R = ρL/A, så R er omvendt proporsjonal med A.'),
          tf('En ohmsk motstand har en I-U-graf som er en rett linje gjennom origo.', true, 'Da er R = U/I konstant.'),
          num(() => { const R = ri(10, 200), I = rs(0.1, 2, 0.1); return { q: `Det går ${f(I)} A gjennom en motstand på ${R} Ω. Hva er spenningen over motstanden?`, a: R * I, u: 'V', e: `U = RI = ${R}·${f(I)} = ${f(R * I)} V` }; }),
          num(() => { const U = pick([4.5, 9, 12, 24]), R = ri(10, 100); return { q: `En motstand på ${R} Ω kobles til ${f(U)} V. Hvor stor blir strømmen?`, a: U / R, u: 'A', e: `I = U/R = ${f(U)}/${R} = ${f(U / R)} A` }; }),
          num(() => { const U = pick([6, 9, 12, 230]), I = rs(0.2, 3, 0.2); return { q: `Spenningen over en komponent er ${U} V, og strømmen er ${f(I)} A. Hva er resistansen?`, a: U / I, u: 'Ω', e: `R = U/I = ${U}/${f(I)} = ${f(U / I)} Ω` }; }),
          num(() => { const L = ri(1, 10) * 10, A = pick([1.5, 2.5]); const R = (1.7e-8 * L) / (A * 1e-6); return { q: `Hva er resistansen i en kobberledning som er ${L} m lang og har tverrsnitt ${f(A)} mm²? (ρ = 1,7 · 10⁻⁸ Ωm)`, a: R, u: 'Ω', e: `R = ρL/A = 1,7 · 10⁻⁸ · ${L} / (${f(A)} · 10⁻⁶) = ${f(R)} Ω` }; }),
        ],
      },
      {
        id: 'u5s3', title: 'Elektriske kretser',
        // trinn med høyst tre nye begreper hver
        parts: [
          { title: 'Serie- og parallellkobling', intro: [0, 1], items: [0, 1, 2, 3, 4, 5, 6] },
          { title: 'Ems og polspenning', intro: [2, 3] },
        ],
        intro: [["R = R₁ + R₂", "Seriekobling", "Resistansene legges sammen. Samme strøm overalt.", "f"], ["1/R = 1/R₁ + 1/R₂", "Parallellkobling", "Samme spenning over alle greinene.", "f"], ["ε", "Ems", "Spenningen kilden gir når det ikke går strøm.", "s"], ["U = ε − R_i·I", "Polspenning", "Spenningen ut fra kilden når det går strøm.", "f"]],
        items: [
          mc('Hva er likt for alle greinene i en parallellkobling?', ['Spenningen', 'Strømmen', 'Resistansen', 'Effekten'], 'Alle greinene er koblet mellom de samme to punktene.'),
          mc('Hva er likt for alle komponentene i en seriekobling?', ['Strømmen', 'Spenningen', 'Resistansen', 'Effekten'], 'Det finnes bare én vei for strømmen.'),
          mc('Hva sier Kirchhoffs 1. lov?', ['Summen av strømmene inn i et forgreiningspunkt er lik summen av strømmene ut', 'U = RI', 'Summen av spenningene i en sløyfe er lik strømmen', 'Strømmen er lik i alle greiner'], 'Det er en konsekvens av at ladning er bevart.'),
          tf('Når du kobler flere motstander i parallell, blir den totale resistansen mindre enn den minste enkeltmotstanden.', true, 'Hver ny grein gir strømmen en ekstra vei å gå.'),
          num(() => { const R1 = ri(10, 100), R2 = ri(10, 100), R3 = ri(10, 100); return { q: `Tre motstander på ${R1} Ω, ${R2} Ω og ${R3} Ω er seriekoblet. Hva er den totale resistansen?`, a: R1 + R2 + R3, u: 'Ω', e: `R = ${R1} + ${R2} + ${R3} = ${R1 + R2 + R3} Ω` }; }),
          num(() => { const R1 = pick([10, 20, 30, 40, 60]), R2 = pick([10, 20, 30, 60, 120]); const R = (R1 * R2) / (R1 + R2); return { q: `To motstander på ${R1} Ω og ${R2} Ω er parallellkoblet. Hva er den totale resistansen?`, a: R, u: 'Ω', e: `1/R = 1/${R1} + 1/${R2} ⇒ R = ${f(R)} Ω` }; }),
          num(() => { const U = pick([9, 12, 24]), R1 = ri(10, 50), R2 = ri(10, 50); return { q: `To motstander på ${R1} Ω og ${R2} Ω er seriekoblet til ${U} V. Hva er strømmen i kretsen?`, a: U / (R1 + R2), u: 'A', e: `I = U/(R₁ + R₂) = ${U}/${R1 + R2} = ${f(U / (R1 + R2))} A` }; }),
          num(() => { const eps = pick([4.5, 9, 12]), Ri = rs(0.5, 2, 0.5), R = ri(4, 20); const I = eps / (R + Ri); return { q: `Et batteri har ems ${f(eps)} V og indre resistans ${f(Ri)} Ω. Det kobles til en ytre motstand på ${R} Ω. Hva er polspenningen?`, a: R * I, u: 'V', e: `I = ε/(R + R_i) = ${f(I)} A. U_pol = RI = ${f(R * I)} V` }; }),
        ],
      },
      {
        id: 'u5s4', title: 'Elektrisk effekt og energi',
        intro: [["P = U·I", "Elektrisk effekt", "Effekten i en komponent.", "f"], ["P = R·I²", "Effekt og strøm", "Viser at varmetap øker med kvadratet av strømmen.", "f"], ["E = P·t", "Elektrisk energi", "Effekt ganger tid.", "f"]],
        items: [
          mc('Hvorfor overføres elektrisk energi med svært høy spenning i kraftledninger?', ['Lavere strøm gir mindre varmetap i ledningene', 'Høy spenning går raskere', 'Det trengs for at strømmen skal komme fram', 'Det gir mindre resistans i ledningene'], 'Tapet er P = R·I². Ved samme effekt gir høy U lav I.'),
          tf('Effekten i en motstand er proporsjonal med kvadratet av strømmen.', true, 'P = R·I²'),
          order('Utled P = R·I²', ['Start med P = U·I', 'Ohms lov: U = R·I', 'Sett inn: P = R·I·I', 'P = R·I²'], ['P = R/I'], 'Setter du i stedet inn I = U/R, får du P = U²/R.'),
          num(() => { const P = pick([25, 40, 60, 100]); return { q: `En lampe er merket 230 V / ${P} W. Hva er resistansen i lampen når den lyser normalt?`, a: (230 * 230) / P, u: 'Ω', e: `P = U²/R ⇒ R = 230²/${P} = ${f((230 * 230) / P)} Ω` }; }),
          mc('Tre like lamper er parallellkoblet til en konstant spenning. Den ene ryker. Hva skjer med de to andre?', ['De lyser like sterkt som før', 'De lyser sterkere', 'De lyser svakere', 'De slukner'], 'Spenningen over hver grein er den samme som før.'),
          mc('To lamper er seriekoblet. Den ene ryker. Hva skjer med den andre?', ['Den slukner', 'Den lyser sterkere', 'Den lyser like sterkt', 'Den lyser svakere'], 'Kretsen blir brutt, så det går ingen strøm.'),
          match([['P = U·I', 'Effekt'], ['E = P·t', 'Energi'], ['I = Q/t', 'Strøm'], ['U = R·I', 'Ohms lov']], 'Koble formelen med det den beskriver'),
          num(() => { const I = rs(1, 10, 0.5); return { q: `En vannkoker kobles til 230 V og trekker ${f(I)} A. Hva er effekten?`, a: 230 * I, u: 'W', e: `P = UI = 230·${f(I)} = ${f(230 * I)} W` }; }),
          num(() => { const U = pick([12, 24, 230]), R = ri(10, 100); return { q: `En motstand på ${R} Ω kobles til ${U} V. Hva er effekten?`, a: (U * U) / R, u: 'W', e: `P = U²/R = ${U}²/${R} = ${f((U * U) / R)} W` }; }),
          num(() => { const R = ri(5, 50), I = ri(1, 5); return { q: `Det går ${I} A gjennom en motstand på ${R} Ω. Hvor stor effekt utvikles i motstanden?`, a: R * I * I, u: 'W', e: `P = RI² = ${R}·${I}² = ${R * I * I} W` }; }),
          num(() => { const P = pick([1, 1.5, 2, 2.5]), t = ri(1, 8), pr = pick([1, 1.5, 2]); return { q: `En panelovn på ${f(P)} kW står på i ${t} timer. Strømprisen er ${f(pr)} kr/kWh. Hva koster det?`, a: P * t * pr, u: 'kr', e: `E = ${f(P)}·${t} = ${f(P * t)} kWh. Pris = ${f(P * t)}·${f(pr)} = ${f(P * t * pr)} kr` }; }),
          num(() => { const P = ri(5, 60), mins = ri(5, 60); return { q: `En lampe på ${P} W står på i ${mins} minutter. Hvor mye energi bruker den i joule?`, a: P * mins * 60, u: 'J', e: `E = Pt = ${P}·${mins * 60} s = ${f(P * mins * 60)} J` }; }),
        ],
      },
    ],
  };

  // ================================================================
  // ENHET 6 – TERMOFYSIKK
  // ================================================================
  const u6 = {
    id: 'u6',
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
        id: 'u6s1', title: 'Temperatur og indre energi',
        intro: [["T", "Absolutt temperatur", "Måles i kelvin (K).", "s"], ["T = t + 273,15", "Fra celsius til kelvin", "0 K er det absolutte nullpunktet.", "f"], ["Indre energi", "U", "Summen av energien til alle partiklene i stoffet.", "b"]],
        items: [
          mc('Hva er temperatur et mål på?', ['Den gjennomsnittlige kinetiske energien til partiklene', 'Den totale energien i stoffet', 'Hvor mye varme stoffet inneholder', 'Massen til partiklene'], 'Høyere temperatur betyr at partiklene i gjennomsnitt beveger seg raskere.'),
          tf('Varme og temperatur er det samme.', false, 'Varme er energi som overføres. Temperatur er en tilstandsstørrelse.'),
          mc('Hva er det absolutte nullpunktet?', ['0 K = −273,15 °C', '0 °C', '−100 °C', '−459 K'], 'Den lavest mulige temperaturen.'),
          match([['Ledning', 'Varm kjele, kaldt håndtak blir varmt'], ['Konveksjon', 'Varm luft stiger over en ovn'], ['Stråling', 'Sola varmer jorda'], ['Fordamping', 'Svette kjøler huden']], 'Koble varmetransporten med eksempelet'),
          num(() => { const t = ri(-50, 100); return { q: `Hva er ${t < 0 ? '−' + -t : t} °C i kelvin?`, a: t + 273.15, u: 'K', e: `T = t + 273,15 = ${f(t + 273.15, 5)} K`, tol: 0.003 }; }),
          num(() => { const T = ri(200, 400); return { q: `Hva er ${T} K i grader celsius?`, a: T - 273.15, u: '°C', e: `t = T − 273,15 = ${f(T - 273.15, 4)} °C`, tol: 0.02 }; }),
        ],
      },
      {
        id: 'u6s2', title: 'Spesifikk varmekapasitet',
        intro: [["Q = c·m·ΔT", "Varme og temperaturendring", "Energien som trengs for å endre temperaturen.", "f"], ["c", "Spesifikk varmekapasitet", "Energi per kg per kelvin. Vann: 4,18 kJ/(kg·K).", "s"], ["ΔT", "Temperaturendring", "Like stor i kelvin som i grader celsius.", "s"]],
        items: [
          mc('Hvorfor holder havet på varmen lenge utover høsten?', ['Vann har høy spesifikk varmekapasitet', 'Vann har lav spesifikk varmekapasitet', 'Saltet i havet varmer opp vannet', 'Havet reflekterer sollys'], 'Det trengs mye energi for å endre temperaturen til vann, og vannet avgir mye energi når det avkjøles.'),
          bank('Fullfør formelen for varme', 'Q = ▢ · ▢ · ΔT', ['c', 'm'], ['g', 'h', 'v'], 'Q = c·m·ΔT', { any: true }),
          num(() => { const m = rs(0.5, 3, 0.5), dT = ri(10, 80); return { q: `Hvor mye varme trengs for å varme ${f(m)} kg vann ${dT} °C? (c = 4,18 kJ/(kg·K))`, a: 4.18 * m * dT, u: 'kJ', e: `Q = cmΔT = 4,18·${f(m)}·${dT} = ${f(4.18 * m * dT)} kJ` }; }),
          num(() => { const m = pick([1, 2, 5]), Q = ri(5, 50) * 10; return { q: `${m} kg vann får tilført ${Q} kJ. Hvor mye stiger temperaturen?`, a: Q / (4.18 * m), u: 'K', e: `ΔT = Q/(cm) = ${Q}/(4,18·${m}) = ${f(Q / (4.18 * m))} K` }; }),
          num(() => { const P = pick([1500, 2000, 2200]), m = pick([0.5, 1, 1.5]); const t = (4180 * m * 80) / P; return { q: `En vannkoker på ${P} W varmer ${f(m)} kg vann fra 20 °C til 100 °C. Hvor lang tid tar det hvis all energien går til vannet?`, a: t, u: 's', e: `t = cmΔT/P = 4180·${f(m)}·80/${P} = ${f(t)} s` }; }),
          num(() => { const m1 = ri(1, 5), T1 = ri(10, 30), m2 = ri(1, 5), T2 = ri(50, 90); const T = (m1 * T1 + m2 * T2) / (m1 + m2); return { q: `Du blander ${m1} kg vann på ${T1} °C med ${m2} kg vann på ${T2} °C. Hva blir sluttemperaturen? (Ingen varmetap)`, a: T, u: '°C', e: `T = (m₁T₁ + m₂T₂)/(m₁ + m₂) = ${f(T)} °C` }; }),
          num(() => { const m = rs(0.5, 2, 0.5), dT = ri(20, 100); return { q: `Hvor mye varme trengs for å varme ${f(m)} kg aluminium ${dT} K? (c = 900 J/(kg·K))`, a: 900 * m * dT, u: 'J', e: `Q = cmΔT = 900·${f(m)}·${dT} = ${f(900 * m * dT)} J` }; }),
        ],
      },
      {
        id: 'u6s3', title: 'Faseoverganger og 1. lov',
        intro: [["Q = l·m", "Faseovergang", "Energien som trengs for å smelte eller fordampe massen m.", "f"], ["ΔU = Q + W", "Termofysikkens 1. lov", "Endring i indre energi = tilført varme + arbeid gjort på systemet.", "f"], ["l_s", "Spesifikk smeltevarme", "Is: 334 kJ/kg.", "s"]],
        items: [
          mc('Hva skjer med temperaturen mens is smelter ved normalt trykk?', ['Den er konstant på 0 °C', 'Den stiger jevnt', 'Den synker', 'Den svinger opp og ned'], 'Energien går med til å bryte bindinger mellom molekylene.'),
          tf('Når vann fordamper fra huden, tar det opp energi fra kroppen.', true, 'Fordamping krever energi, derfor kjøler svette.'),
          mc('Hva sier termofysikkens 1. lov, ΔU = Q + W?', ['Endringen i indre energi er tilført varme pluss arbeid gjort på systemet', 'Varme går alltid fra kald til varm', 'Temperaturen er alltid bevart', 'Indre energi kan ikke endres'], 'Det er energibevaring anvendt på et system.'),
          num(() => { const m = rs(0.2, 2, 0.2); return { q: `Hvor mye energi trengs for å smelte ${f(m)} kg is ved 0 °C? (l_s = 334 kJ/kg)`, a: 334 * m, u: 'kJ', e: `Q = l_s·m = 334·${f(m)} = ${f(334 * m)} kJ` }; }),
          num(() => { const m = rs(0.1, 1, 0.1); return { q: `Hvor mye energi trengs for å fordampe ${f(m)} kg vann ved 100 °C? (l_f = 2,26 MJ/kg)`, a: 2.26 * m, u: 'MJ', e: `Q = l_f·m = 2,26·${f(m)} = ${f(2.26 * m)} MJ` }; }),
          num(() => { const Q = ri(10, 80) * 10, W = ri(5, 30) * 10; return { q: `En gass får tilført ${Q} J varme, og det gjøres ${W} J arbeid på gassen. Hvor mye øker den indre energien?`, a: Q + W, u: 'J', e: `ΔU = Q + W = ${Q} + ${W} = ${Q + W} J` }; }),
          num(() => { const Q = ri(30, 80) * 10, W = ri(5, 25) * 10; return { q: `En gass får tilført ${Q} J varme og utvider seg slik at den gjør ${W} J arbeid på omgivelsene. Hvor mye øker den indre energien?`, a: Q - W, u: 'J', e: `Arbeid gjort på gassen er −${W} J. ΔU = ${Q} − ${W} = ${Q - W} J` }; }),
        ],
      },
      {
        id: 'u6s4', title: 'Energi og klima',
        intro: [["Fornybar energi", "Fylles på naturlig", "F.eks. vannkraft, sol og vind.", "b"], ["Drivhuseffekt", "Atmosfæren holder på varme", "Gasser absorberer infrarød stråling fra jorda.", "b"], ["Varmepumpe", "Flytter varme", "Henter varme utenfra og leverer mer varme enn strømmen den bruker.", "b"]],
        items: [
          mc('Påstand: «Vi holder på å gå tom for energi.» Hva er den fysisk mest presise kommentaren?', ['Energi er bevart. Vi går tom for energikilder med høy kvalitet', 'Påstanden er helt riktig', 'Energi kan lages fra ingenting', 'Vi går tom for varme'], 'Energien blir ikke borte, men blir til varme med lav kvalitet.'),
          mc('Hvilken av disse energikildene er fornybar?', ['Vannkraft', 'Kull', 'Naturgass', 'Uran'], 'Vannkraft drives av sola via vannets kretsløp.'),
          tf('En varmepumpe kan levere mer varmeenergi til et hus enn den elektriske energien den bruker.', true, 'Den henter i tillegg varme fra uteluft, jord eller sjø. Energien er fortsatt bevart.'),
          mc('Påstand: «Elbiler gir null utslipp.» Hva er den beste vurderingen?', ['Ingen eksosutslipp, men produksjon og strømkilde kan gi utslipp. Hele livsløpet må vurderes', 'Påstanden er helt riktig', 'Elbiler slipper ut mer enn bensinbiler', 'Strøm gir aldri utslipp'], 'En god vurdering ser på hele livsløpet og på hvor strømmen kommer fra.'),
          mc('Hvorfor fører økt CO₂ i atmosfæren til oppvarming?', ['CO₂ absorberer infrarød stråling fra jorda og sender noe tilbake ned', 'CO₂ reflekterer sollyset ned igjen', 'CO₂ er varmt i seg selv', 'CO₂ lager hull i ozonlaget'], 'Dette er den forsterkede drivhuseffekten.'),
          mc('Du leser en påstand om klima i sosiale medier. Hva er den beste måten å vurdere den på?', ['Sjekke kilden og om den støttes av data og fagfellevurdert forskning', 'Se hvor mange som har likt innlegget', 'Stole på den hvis den virker logisk', 'Se om den bekrefter det du allerede mener'], 'Gode kilder, målinger og faglig konsensus er viktigere enn popularitet.'),
        ],
      },
    ],
  };

  // ================================================================
  // ENHET 7 – BØLGER OG STRÅLINGSLOVENE
  // ================================================================
  const u7 = {
    id: 'u7',
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
        id: 'u7s1', title: 'Bølger og spekteret',
        // trinn med høyst tre nye begreper hver
        parts: [
          { title: 'Bølger', intro: [1, 2, 0], items: [1, 3, 4] },
          { title: 'Lys og spekteret', intro: [3] },
        ],
        intro: [["v = f·λ", "Bølgelikningen", "Fart er frekvens ganger bølgelengde.", "f"], ["λ", "Bølgelengde", "Avstanden mellom to bølgetopper.", "s"], ["f", "Frekvens", "Svingninger per sekund. Enhet: hertz (Hz).", "s"], ["c", "Lysfarten", "3,00 · 10⁸ m/s i vakuum.", "s"]],
        items: [
          mc('Hvilken type stråling har kortest bølgelengde?', ['Gammastråling', 'Synlig lys', 'Radiobølger', 'Infrarød stråling'], 'Gamma har kortest bølgelengde og høyest fotonenergi.'),
          mc('Hva slags bølge er lyd i luft?', ['Longitudinal', 'Transversal', 'Elektromagnetisk', 'Stående'], 'Luftmolekylene svinger fram og tilbake i samme retning som bølgen går.'),
          tf('Lys trenger et medium for å bre seg ut.', false, 'Elektromagnetiske bølger kan gå gjennom vakuum, for eksempel fra sola til jorda.'),
          bank('Fullfør bølgelikningen', 'v = ▢ · ▢', ['f', 'λ'], ['T', 'A', 'c'], 'Farten er frekvens ganger bølgelengde.', { any: true }),
          num(() => { const fr = pick([170, 340, 440, 680, 1000]); return { q: `Lyd går med 340 m/s i luft. Hva er bølgelengden til en tone på ${fr} Hz?`, a: 340 / fr, u: 'm', e: `λ = v/f = 340/${fr} = ${f(340 / fr)} m` }; }),
          num(() => { const fr = pick([88, 95, 100, 107]); return { q: `En radiostasjon sender på ${fr} MHz. Hva er bølgelengden? (c = 3,00 · 10⁸ m/s)`, a: c / (fr * 1e6), u: 'm', e: `λ = c/f = 3,00 · 10⁸ / (${fr} · 10⁶) = ${f(c / (fr * 1e6))} m` }; }),
        ],
      },
      {
        id: 'u7s2', title: 'Wiens forskyvningslov',
        intro: [["λ_maks·T = b", "Wiens forskyvningslov", "b = 2,90 · 10⁻³ m·K.", "f"], ["Svart legeme", "Perfekt absorbent", "Absorberer all stråling og stråler perfekt.", "b"], ["λ_maks", "Toppbølgelengde", "Bølgelengden der et legeme stråler mest.", "s"]],
        items: [
          tf('Jo varmere et legeme er, jo kortere bølgelengde har toppen i strålingsspekteret.', true, 'λ_maks = b/T'),
          mc('Hvorfor er røde stjerner kaldere enn blå stjerner?', ['Strålingstoppen ligger ved lengre bølgelengde, og etter Wiens lov betyr det lavere temperatur', 'Røde stjerner er lenger unna', 'Rødt lys har mer energi', 'Blå stjerner er mindre'], 'λ_maks · T er konstant.'),
          mc('Kroppen din har en temperatur på ca. 310 K. I hvilket område stråler den mest?', ['Infrarødt', 'Synlig lys', 'Ultrafiolett', 'Radiobølger'], 'λ = 2,90 · 10⁻³ / 310 ≈ 9,4 µm, som er infrarødt.'),
          mc('Hva er et svart legeme i fysikken?', ['Et legeme som absorberer all stråling som treffer det', 'Et legeme som er malt svart', 'Et legeme som ikke stråler', 'Et legeme med temperatur 0 K'], 'Et svart legeme er også en perfekt strålingskilde ved sin temperatur.'),
          num(() => { const T = pick([3000, 4000, 5800, 6000, 10000]); return { q: `Hva er bølgelengden til strålingstoppen fra et svart legeme med temperatur ${T} K? Svar i nm.`, a: (wien / T) * 1e9, u: 'nm', e: `λ_maks = 2,90 · 10⁻³ / ${T} = ${f((wien / T) * 1e9)} nm` }; }),
          num(() => { const l = pick([290, 400, 500, 725, 966]); return { q: `Strålingstoppen fra en stjerne ligger ved ${l} nm. Hva er overflatetemperaturen?`, a: wien / (l * 1e-9), u: 'K', e: `T = 2,90 · 10⁻³ / (${l} · 10⁻⁹) = ${f(wien / (l * 1e-9))} K` }; }),
        ],
      },
      {
        id: 'u7s3', title: 'Stefan–Boltzmanns lov',
        intro: [["I = σT⁴", "Stefan–Boltzmanns lov", "Utstrålt intensitet fra et svart legeme.", "f"], ["σ", "Stefan–Boltzmanns konstant", "5,67 · 10⁻⁸ W/(m²·K⁴).", "s"], ["e", "Emissivitet", "Fra 0 til 1: hvor godt flaten stråler.", "s"]],
        items: [
          mc('Den absolutte temperaturen til et svart legeme dobles. Hva skjer med utstrålt intensitet?', ['Den blir 16 ganger så stor', 'Den dobles', 'Den firedobles', 'Den blir 8 ganger så stor'], 'I = σT⁴, og 2⁴ = 16.'),
          mc('Hva forteller emissiviteten e til en flate?', ['Hvor godt flaten stråler sammenliknet med et svart legeme', 'Temperaturen til flaten', 'Hvor stor flaten er', 'Fargen til lyset'], 'e = 1 for et svart legeme, og e < 1 for virkelige flater.'),
          bank('Fullfør Stefan–Boltzmanns lov', 'I = σ · ▢', ['T⁴'], ['T²', 'T', 'λ'], 'Intensiteten er proporsjonal med T⁴.'),
          num(() => { const T = pick([300, 500, 1000, 5800]); return { q: `Hvor stor intensitet stråler et svart legeme med temperatur ${T} K ut? (σ = 5,67 · 10⁻⁸ W/(m²K⁴))`, a: sigma * T ** 4, u: 'W/m²', e: `I = σT⁴ = 5,67 · 10⁻⁸ · ${T}⁴ = ${f(sigma * T ** 4)} W/m²` }; }),
          num(() => { const A = pick([0.5, 1, 2]), T = pick([400, 600, 800]); return { q: `En svart flate på ${f(A)} m² har temperaturen ${T} K. Hvor stor effekt stråler den ut?`, a: sigma * A * T ** 4, u: 'W', e: `P = σAT⁴ = 5,67 · 10⁻⁸ · ${f(A)} · ${T}⁴ = ${f(sigma * A * T ** 4)} W` }; }),
          num(() => { const k = pick([1.5, 2, 3]); return { q: `Temperaturen til en stjerne er ${f(k)} ganger så høy som til en annen stjerne. Hvor mange ganger så stor er intensiteten fra overflaten?`, a: k ** 4, u: 'ganger', e: `(${f(k)})⁴ = ${f(k ** 4)}` }; }),
        ],
      },
      {
        id: 'u7s4', title: 'Jordas strålingsbalanse',
        intro: [["α", "Albedo", "Andelen av innstrålingen som reflekteres.", "s"], ["S", "Solarkonstanten", "≈ 1361 W/m² ved jordas avstand.", "s"], ["(1 − α)S/4", "Gjennomsnittlig absorbert", "Det jorda tar opp per m² i snitt.", "f"]],
        items: [
          mc('Hva er albedo?', ['Andelen av innkommende stråling som reflekteres', 'Temperaturen til jordoverflaten', 'Mengden CO₂ i atmosfæren', 'Strålingen jorda sender ut'], 'Snø og is har høy albedo. Hav og skog har lav.'),
          mc('Hvorfor deler vi solarkonstanten på 4 i modellen for jordas strålingsbalanse?', ['Jorda tar imot stråling på tverrsnittet πR², men stråler ut fra hele overflaten 4πR²', 'Bare en fjerdedel av sollyset når fram', 'Jorda roterer fire ganger i døgnet', 'Atmosfæren stopper tre fjerdedeler'], '4πR² / πR² = 4'),
          mc('Hva skjer med strålingsbalansen når isbreer og havis smelter?', ['Albedoen synker, jorda absorberer mer stråling og blir varmere', 'Albedoen øker, og jorda blir kaldere', 'Ingenting skjer', 'Jorda stråler mer sollys tilbake'], 'Dette er en positiv tilbakekobling.'),
          tf('Drivhusgasser slipper gjennom mesteparten av sollyset, men absorberer infrarød stråling fra jorda.', true, 'Sollys har kort bølgelengde, mens jorda stråler infrarødt.'),
          mc('Hvorfor er jordas middeltemperatur ca. 15 °C og ikke −18 °C som den enkle modellen gir?', ['Drivhuseffekten i atmosfæren', 'Varme fra jordas indre', 'Månen varmer jorda', 'Albedoen er null'], 'Atmosfæren sender en del av den infrarøde strålingen tilbake mot bakken.'),
          num(() => { const al = pick([0.25, 0.3, 0.35]); return { q: `Solarkonstanten er 1361 W/m², og albedoen er ${f(al)}. Hvor stor intensitet absorberer jorda i gjennomsnitt?`, a: ((1 - al) * 1361) / 4, u: 'W/m²', e: `(1 − α)·S/4 = ${f(1 - al)}·1361/4 = ${f(((1 - al) * 1361) / 4)} W/m²` }; }),
          num(() => { const al = pick([0.25, 0.3, 0.35]); const T = Math.pow(((1 - al) * 1361) / (4 * sigma), 0.25); return { q: `Bruk σT⁴ = (1 − α)S/4 med S = 1361 W/m² og α = ${f(al)}. Hva blir likevektstemperaturen til jorda uten drivhuseffekt?`, a: T, u: 'K', e: `T = ((1 − α)S/(4σ))^¼ = ${f(T)} K` }; }),
        ],
      },
    ],
  };

  // ================================================================
  // ENHET 8 – ATOMFYSIKK
  // ================================================================
  const u8 = {
    id: 'u8',
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
        id: 'u8s1', title: 'Atommodeller',
        intro: [["Thomson", "Rosinbollemodellen", "Positiv kule med elektroner i.", "b"], ["Rutherford", "Kjernemodellen", "Liten, tett, positiv kjerne.", "b"], ["Bohr", "Energinivåmodellen", "Elektroner i bestemte energinivåer.", "b"]],
        items: [
          mc('Hva viste Rutherfords gullfolieforsøk?', ['At atomet har en liten, tett og positivt ladd kjerne', 'At elektronene har bestemte energinivåer', 'At atomet er en jevn positiv kule med elektroner i', 'At lys består av fotoner'], 'De fleste alfapartiklene gikk rett gjennom, men noen få ble sendt kraftig tilbake.'),
          mc('Hvordan beskriver Thomsons atommodell atomet?', ['En positiv kule med elektroner spredt rundt i, som rosiner i en bolle', 'En liten kjerne med elektroner i baner', 'Elektroner i bestemte energinivåer', 'Elektronskyer rundt en kjerne'], 'Den kalles ofte rosinbollemodellen.'),
          mc('Hvilken observasjon forklarte Bohrs modell som Rutherfords ikke kunne?', ['Linjespekteret til hydrogen', 'At atomer har en kjerne', 'At atomer er nøytrale', 'Radioaktivitet'], 'Bestemte energinivåer gir bestemte fotonenergier og dermed linjer.'),
          mc('Hvilket problem hadde Rutherfords atommodell?', ['Elektroner i bane ville stråle ut energi og spiralere inn i kjernen', 'Den forklarte ikke gullfolieforsøket', 'Den hadde ingen elektroner', 'Den hadde negativ kjerne'], 'Klassisk fysikk sier at akselererte ladninger stråler.'),
          tf('Bohrs modell forklarer hydrogenspekteret godt, men fungerer dårlig for atomer med mange elektroner.', true, 'Derfor trengte man den kvantemekaniske modellen.'),
          match([['Thomson', 'Rosinbollemodellen'], ['Rutherford', 'Liten, tett kjerne'], ['Bohr', 'Bestemte energinivåer'], ['Kvantemekanisk', 'Elektronskyer']], 'Koble modellen med hovedideen'),
        ],
      },
      {
        id: 'u8s2', title: 'Fotoner',
        intro: [["E = h·f", "Fotonenergi", "Energien til ett foton.", "f"], ["h", "Plancks konstant", "6,63 · 10⁻³⁴ J·s.", "s"], ["eV", "Elektronvolt", "1 eV = 1,60 · 10⁻¹⁹ J.", "s"]],
        items: [
          mc('Hvilket foton har mest energi?', ['Et blått foton', 'Et rødt foton', 'De har like mye', 'Det avhenger av lysstyrken'], 'Blått lys har høyere frekvens (kortere bølgelengde), og E = hf.'),
          mc('Hvilken observasjon støtter at lys består av fotoner?', ['Fotoelektrisk effekt: elektroner løsrives bare over en bestemt frekvens', 'Lys brytes i et prisme', 'Lys kan reflekteres', 'Lys går rettlinjet'], 'Hvis lys bare var en bølge, ville sterkt nok lys alltid løsrevet elektroner.'),
          bank('Fullfør formelen for fotonenergi', 'E = ▢ · ▢', ['h', 'f'], ['c', 'λ', 'm'], 'E = hf', { any: true }),
          num(() => { const fr = pick([4.5, 5.5, 6.5, 7.5]); return { q: `Hva er energien til et foton med frekvens ${f(fr)} · 10¹⁴ Hz? (h = 6,63 · 10⁻³⁴ Js)`, a: h * fr * 1e14, u: 'J', e: `E = hf = 6,63 · 10⁻³⁴ · ${f(fr)} · 10¹⁴ = ${f(h * fr * 1e14)} J` }; }),
          num(() => { const l = pick([400, 450, 500, 550, 600, 650, 700]); return { q: `Hva er energien til et foton med bølgelengde ${l} nm, målt i eV?`, a: 1240 / l, u: 'eV', e: `E = hc/λ ≈ 1240 eV·nm / ${l} nm = ${f(1240 / l)} eV` }; }),
          num(() => { const E = pick([1.5, 2, 3, 4.5, 13.6]); return { q: `Gjør om ${f(E)} eV til joule.`, a: E * e0, u: 'J', e: `${f(E)} · 1,60 · 10⁻¹⁹ = ${f(E * e0)} J` }; }),
        ],
      },
      {
        id: 'u8s3', title: 'Spektre og energinivåer',
        intro: [["E_n = −13,6 eV/n²", "Energinivåene i hydrogen", "n = 1, 2, 3, …", "f"], ["n", "Kvantetall", "Nummeret på energinivået.", "s"], ["Linjespekter", "Bestemte bølgelengder", "Hvert grunnstoff har sitt eget.", "b"]],
        items: [
          mc('Hvorfor har hvert grunnstoff sitt eget linjespekter?', ['Hvert grunnstoff har sine egne energinivåer', 'Grunnstoffene har ulik farge', 'De har ulik masse', 'De har ulik temperatur'], 'Linjene tilsvarer forskjeller mellom energinivåene, som er unike for hvert grunnstoff.'),
          mc('Hva er forskjellen på et emisjonsspekter og et absorpsjonsspekter?', ['Emisjon gir lyse linjer på mørk bakgrunn, absorpsjon gir mørke linjer i et kontinuerlig spekter', 'Det er ingen forskjell', 'Emisjon gir et kontinuerlig spekter', 'Absorpsjon gir bare ultrafiolette linjer'], 'Linjene ligger ved de samme bølgelengdene for samme grunnstoff.'),
          mc('Hva skyldes de mørke linjene i sollysets spekter (Fraunhoferlinjene)?', ['Atomer i solas ytre lag absorberer bestemte bølgelengder', 'Skyer på jorda', 'Hull i sola', 'At sola er et svart legeme'], 'Linjene viser hvilke grunnstoff som finnes i solatmosfæren.'),
          tf('Ifølge Bohrs modell kan et elektron i et atom ha hvilken som helst energi.', false, 'Bare bestemte, kvantiserte energinivåer er tillatt.'),
          num(() => { const n = pick([1, 2, 3, 4, 5]); return { q: `Hva er energien til nivå n = ${n} i hydrogenatomet? (E_n = −13,6 eV/n², svar med fortegn)`, a: -13.6 / (n * n), u: 'eV', e: `E_${n} = −13,6/${n * n} = ${f(-13.6 / (n * n))} eV` }; }),
          num(() => { const n = pick([3, 4, 5]); const dE = 13.6 * (1 / 4 - 1 / (n * n)); return { q: `Et elektron i hydrogen faller fra n = ${n} til n = 2. Hvor stor energi har fotonet som sendes ut?`, a: dE, u: 'eV', e: `E = 13,6·(1/2² − 1/${n}²) = ${f(dE)} eV` }; }),
          num(() => { const n = pick([3, 4]); const dE = 13.6 * (1 / 4 - 1 / (n * n)); return { q: `Et elektron i hydrogen faller fra n = ${n} til n = 2. Hva er bølgelengden til lyset? Svar i nm.`, a: 1240 / dE, u: 'nm', e: `E = ${f(dE)} eV, λ = 1240/${f(dE)} = ${f(1240 / dE)} nm` }; }),
        ],
      },
    ],
  };

  // ================================================================
  // ENHET 9 – KJERNEFYSIKK
  // ================================================================
  const u9 = {
    id: 'u9',
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
        id: 'u9s1', title: 'Atomkjernen',
        // trinn med høyst tre nye begreper hver
        parts: [
          { title: 'Protoner og nukleoner', intro: [0, 1], items: [1] },
          { title: 'Nøytroner og isotoper', intro: [2, 3] },
        ],
        intro: [["Z", "Protontall", "Antall protoner i kjernen.", "s"], ["A", "Nukleontall", "Protoner + nøytroner.", "s"], ["N = A − Z", "Nøytrontall", "Antall nøytroner.", "f"], ["Isotop", "Samme Z, ulik N", "Samme grunnstoff, ulik masse.", "b"]],
        items: [
          tf('Isotoper av et grunnstoff har ulikt antall protoner.', false, 'Isotoper har likt antall protoner, men ulikt antall nøytroner.'),
          mc('Hvilken kraft holder protonene og nøytronene sammen i kjernen?', ['Den sterke kjernekraften', 'Tyngdekraften', 'Den elektriske kraften', 'Friksjon'], 'Den virker over svært korte avstander og er sterkere enn frastøtningen mellom protonene.'),
          match([['Z', 'Protontall'], ['N', 'Nøytrontall'], ['A', 'Nukleontall'], ['Isotoper', 'Samme Z, ulik N']], 'Koble symbolet med betydningen'),
          num(() => { const iso = pick([['karbon-12', 12, 6], ['karbon-14', 14, 6], ['uran-235', 235, 92], ['jern-56', 56, 26], ['helium-4', 4, 2], ['oksygen-16', 16, 8], ['uran-238', 238, 92]]); return { q: `Hvor mange nøytroner har ${iso[0]} (Z = ${iso[2]})?`, a: iso[1] - iso[2], u: 'nøytroner', e: `N = A − Z = ${iso[1]} − ${iso[2]} = ${iso[1] - iso[2]}` }; }),
        ],
      },
      {
        id: 'u9s2', title: 'E = mc² og bindingsenergi',
        intro: [["E = mc²", "Masse og energi", "Masse kan omdannes til energi.", "f"], ["Massedefekt", "Δm", "Kjernen veier mindre enn delene.", "b"], ["u", "Atommasseenhet", "1 u tilsvarer 931,5 MeV.", "s"]],
        items: [
          mc('Hva er massedefekten til en atomkjerne?', ['Forskjellen mellom summen av massene til nukleonene og massen til kjernen', 'Massen til elektronene', 'Massen som forsvinner ved radioaktivitet', 'Massen til nøytronene'], 'Kjernen veier mindre enn delene. Forskjellen tilsvarer bindingsenergien.'),
          mc('Hvor ligger toppen på kurven for bindingsenergi per nukleon?', ['Ved jern og nikkel (A ≈ 56–62)', 'Ved hydrogen', 'Ved uran', 'Ved helium'], 'Derfor gir fusjon av lette kjerner og fisjon av tunge kjerner energi.'),
          bank('Fullfør Einsteins formel', 'E = ▢ · ▢', ['m', 'c²'], ['v²', 'g', 'h'], 'E = mc²', { any: true }),
          num(() => { const m = pick([0.001, 0.01, 1]); return { q: `Hvor mye energi tilsvarer en masse på ${f(m)} kg? (c = 3,00 · 10⁸ m/s)`, a: m * c * c, u: 'J', e: `E = mc² = ${f(m)} · (3,00 · 10⁸)² = ${f(m * c * c)} J` }; }),
          num(() => { const dm = pick([0.0024, 0.0189, 0.0304]); return { q: `En kjernereaksjon har en massedefekt på ${f(dm)} u. Hvor mye energi frigjøres? (1 u tilsvarer 931,5 MeV)`, a: dm * 931.5, u: 'MeV', e: `E = ${f(dm)} · 931,5 = ${f(dm * 931.5)} MeV` }; }),
          num(() => ({ q: 'Sola stråler ut 3,85 · 10²⁶ W. Hvor mye masse mister den hvert sekund?', a: 3.85e26 / (c * c), u: 'kg', e: `Δm = P/c² = 3,85 · 10²⁶ / (3,00 · 10⁸)² = ${f(3.85e26 / (c * c))} kg` })),
        ],
      },
      {
        id: 'u9s3', title: 'Fusjon',
        intro: [["Fusjon", "Lette kjerner smelter sammen", "Frigjør energi opp til jern.", "b"], ["Fisjon", "Tunge kjerner deles", "Brukes i kjernekraftverk.", "b"], ["4 ¹H → ⁴He", "Fusjon i sola", "Hydrogen blir til helium.", "f"]],
        items: [
          mc('Hva er fusjon?', ['Lette atomkjerner smelter sammen til en tyngre kjerne', 'En tung kjerne deles i to', 'Et elektron hopper til et lavere energinivå', 'En kjerne sender ut et alfapartikkel'], 'Fisjon er det motsatte: deling av tunge kjerner.'),
          mc('Hvorfor krever fusjon svært høy temperatur?', ['Kjernene må ha stor fart for å komme nær nok hverandre til tross for den elektriske frastøtningen', 'Kjernene må smelte', 'Elektronene må fordampe', 'Det trengs lys for å starte reaksjonen'], 'Først på svært korte avstander tar den sterke kjernekraften over.'),
          mc('Hva er hovedreaksjonen i sola?', ['Hydrogen fusjonerer til helium', 'Uran deles til lettere stoffer', 'Karbon brenner med oksygen', 'Helium deles til hydrogen'], 'Netto: 4 ¹H → ⁴He + 2e⁺ + 2ν + energi'),
          mc('Hvorfor frigjør fusjon av lette kjerner energi?', ['Produktet er sterkere bundet, så massen etterpå er mindre enn før', 'Det dannes nye elektroner', 'Den sterke kjernekraften blir svakere', 'Massen øker'], 'Massetapet blir frigjort som energi etter E = mc².'),
          tf('Fusjon av to jernkjerner frigjør energi.', false, 'Jern har høyest bindingsenergi per nukleon. Fusjon av jern krever energi.'),
          bank('Fullfør fusjonsreaksjonen i en fusjonsreaktor', '²H + ³H → ⁴He + ▢', ['n'], ['p', 'e⁻', 'γ'], 'Deuterium + tritium gir helium-4 og et nøytron (1 + 2 = 2 + 1 nøytroner, 1 + 1 = 2 protoner).'),
          num(() => ({ q: 'Når fire hydrogenkjerner blir til en heliumkjerne i sola, er massetapet ca. 0,0287 u. Hvor mye energi frigjøres? (1 u tilsvarer 931,5 MeV)', a: 0.0287 * 931.5, u: 'MeV', e: `E = 0,0287 · 931,5 = ${f(0.0287 * 931.5)} MeV` })),
        ],
      },
    ],
  };

  // ================================================================
  // ENHET 10 – ASTROFYSIKK
  // ================================================================
  const u10 = {
    id: 'u10',
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
        id: 'u10s1', title: 'Stjerners liv',
        // trinn med høyst tre nye begreper hver
        parts: [
          { title: 'Hovedserien og røde kjemper', intro: [0, 1], items: [0, 1, 2] },
          { title: 'Supernova og hvite dverger', intro: [2, 3] },
        ],
        intro: [["Hovedserien", "H → He i kjernen", "Den lengste fasen i livet til en stjerne.", "b"], ["Rød kjempe", "Oppsvulmet stjerne", "Fusjon av helium til karbon og oksygen.", "b"], ["Supernova", "Eksplosjon", "Slutten for en massiv stjerne.", "b"], ["Hvit dverg", "Restkjerne", "Slutten for stjerner som sola.", "b"]],
        items: [
          mc('Hva gir en stjerne på hovedserien energi?', ['Fusjon av hydrogen til helium i kjernen', 'Fisjon av uran', 'Kjemisk forbrenning', 'Sammentrekning alene'], 'Dette er den lengste fasen i livet til en stjerne.'),
          mc('Hva bestemmer først og fremst hvordan livet til en stjerne blir?', ['Massen', 'Fargen', 'Avstanden til jorda', 'Hvor mange planeter den har'], 'Massen avgjør temperatur, levetid og hvordan stjerna dør.'),
          tf('Massive stjerner lever lenger enn små stjerner.', false, 'Massive stjerner bruker opp brenselet mye raskere og lever kortere.'),
          mc('Hvordan vil sola ende livet sitt?', ['Som en hvit dverg etter å ha vært rød kjempe', 'Som et svart hull', 'Som en nøytronstjerne etter en supernova', 'Den lever evig'], 'Sola er ikke massiv nok til å bli supernova.'),
          mc('Hva kan bli igjen etter en supernova fra en svært massiv stjerne?', ['En nøytronstjerne eller et svart hull', 'En hvit dverg', 'En planet', 'En ny sol av samme type'], 'Kjernen kollapser under sin egen tyngde.'),
          match([['Hovedserien', 'H → He'], ['Rød kjempe', 'He → C og O'], ['Supernova', 'Kjernekollaps'], ['Hvit dverg', 'Sluttstadiet for sola']], 'Koble fasen med prosessen'),
        ],
      },
      {
        id: 'u10s2', title: 'Dannelse av grunnstoff',
        intro: [["Big Bang", "H og He", "De første grunnstoffene.", "b"], ["Trippel-alfa", "3 He → C", "Dannelse av karbon i røde kjemper.", "b"], ["r-prosessen", "Rask nøytroninnfanging", "Lager gull i nøytronstjernekollisjoner.", "b"]],
        items: [
          mc('Hvilke grunnstoff ble i hovedsak dannet i Big Bang?', ['Hydrogen og helium (og litt litium)', 'Karbon og oksygen', 'Jern og nikkel', 'Gull og uran'], 'Tyngre grunnstoff er dannet senere, i stjerner.'),
          mc('Hvorfor stopper fusjonen i stjerner ved jern?', ['Jern har størst bindingsenergi per nukleon, så videre fusjon krever energi', 'Det finnes ikke mer hydrogen', 'Jern er magnetisk', 'Jern er for tungt til å bevege seg'], 'Toppen på bindingsenergikurven ligger ved jern og nikkel.'),
          mc('Hvordan dannes grunnstoff som er tyngre enn jern?', ['Ved at kjerner fanger inn nøytroner og deretter gjennomgår betaminus-henfall', 'Ved vanlig fusjon i hovedserien', 'I Big Bang', 'Ved kjemiske reaksjoner'], 'Dette skjer i s-prosessen og r-prosessen.'),
          mc('Hvor er mye av gullet i universet dannet?', ['Når nøytronstjerner kolliderer (og i supernovaer)', 'I sola i dag', 'I Big Bang', 'I jordas kjerne'], 'Den raske r-prosessen trenger enorme mengder frie nøytroner.'),
          mc('Hvordan dannes karbon i stjerner?', ['Tre heliumkjerner fusjonerer (trippel-alfa-prosessen)', 'To hydrogenkjerner fusjonerer', 'Jern deles', 'I Big Bang'], 'Dette skjer i røde kjemper med svært høy temperatur i kjernen.'),
          tf('Karbonet i kroppen din er dannet i stjerner.', true, 'Vi består bokstavelig talt av stjernestøv.'),
        ],
      },
      {
        id: 'u10s3', title: 'Stjernespektre',
        intro: [["Absorpsjonslinjer", "Mørke linjer", "Viser hvilke grunnstoff stjerna inneholder.", "b"], ["Kilonova", "Nøytronstjernekollisjon", "Observert i 2017, dannet tunge grunnstoff.", "b"], ["Farge", "Temperatur", "Blå stjerner er varme, røde er kalde.", "b"]],
        items: [
          mc('Hvordan vet vi hvilke grunnstoff fjerne stjerner består av?', ['Ved å studere absorpsjonslinjene i spekteret deres', 'Ved å hente prøver med romsonder', 'Ved å måle massen', 'Ved å se på fargen alene'], 'Hvert grunnstoff har sine egne linjer.'),
          mc('Hvorfor var kilonovaen som ble observert i 2017 viktig?', ['Den bekreftet at tunge grunnstoff som gull dannes når nøytronstjerner kolliderer', 'Den viste at sola er en nøytronstjerne', 'Den var den første supernovaen som ble sett', 'Den beviste at Big Bang lagde gull'], 'Både gravitasjonsbølger og lys ble observert fra samme hendelse.'),
          mc('En stjerne ser blåhvit ut. Hva kan vi si om den?', ['Den har høy overflatetemperatur', 'Den har lav overflatetemperatur', 'Den er nær ved å dø', 'Den er laget av is'], 'Etter Wiens lov ligger toppen ved kort bølgelengde.'),
          num(() => { const st = pick([['Betelgeuse', 3500], ['Sola', 5800], ['Sirius', 9900], ['Rigel', 12000]]); return { q: `${st[0]} har en overflatetemperatur på ca. ${st[1]} K. Hvor ligger strålingstoppen? Svar i nm.`, a: (wien / st[1]) * 1e9, u: 'nm', e: `λ = 2,90 · 10⁻³ / ${st[1]} = ${f((wien / st[1]) * 1e9)} nm` }; }),
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

  window.FYSIKK1 = {
    id: 'fysikk1',
    title: 'Fysikk 1',
    short: 'Fysikk 1',
    icon: 'atom',
    glossary,
    units: [u1, u2, u3, u4, u5, u6, u7, u8, u9, u10],
    fmt: f,
  };
})();
