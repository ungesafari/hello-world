/* Matematikk R1 – kursinnhold, kapittel 1 Potenser og logaritmer.
 *
 * Bare oppgaver som står i fremdriftsplanen (R1, klasse A, høsten 2026) er med:
 * 1A–1E (I timen, Lekser, E1, E2), Blandede oppgaver s. 54–59 og Kapitteltesten
 * s. 61, pluss «10 rette eller gale» fra kap. 1. Svarene er hentet fra fasiten
 * i læreboka Matematikk R1 (Aschehoug). Formler og definisjoner kommer fra
 * teoriboksene og sammendraget, og øves som egne kort.
 *
 * Oppgavene er gjort om til øvelser der du sjekker svaret ditt, i stedet for å
 * regne alt på nytt for hånd:
 *   mc   – velg riktig svar      N   – skriv inn et tall
 *   ord  – sett stegene i et bevis eller en utregning i riktig rekkefølge
 *   match – koble sammen         tf  – rett eller galt
 * src er oppgavenummeret i boka. u: true betyr «uten hjelpemidler» (ingen kalkulator).
 */
(function () {
  'use strict';

  const mc = (src, q, opts, e, x = {}) => ({ t: 'mc', src, q, opts, e, ...x });
  const code = (src, q, c, opts, e, x = {}) => ({ t: 'mc', src, q, code: c || undefined, monoOpts: !c, opts, e, ...x });
  const tf = (src, q, ans, e, x = {}) => ({ t: 'tf', src, q, ans, e, ...x });
  const N = (src, q, a, e, x = {}) => ({ t: 'num', src, gen: () => ({ q, a, u: x.unit || '', e, tol: x.tol }), ...x });
  const ord = (src, q, steps, dis, e, x = {}) => ({ t: 'bank', order: true, src, q, tpl: steps.map(() => '▢').join('\n'), ans: steps, dis, e, ...x });
  const match = (src, pairs, q, x = {}) => ({ t: 'match', src, pairs, q, ...x });
  const fx = (src, q, opts, e, x = {}) => mc(src, q, opts, e, { kind: 'formel', ...x });
  const U = { u: true };
  const T = (tol) => ({ tol });

  // ================================================================
  // 1A n-terøtter og potenser
  // ================================================================
  const r1a = {
    id: 'r1a', title: '1A n-terøtter og potenser',
    color: '#58cc02', dark: '#58a700',
    goal: 'Regne med n-terøtter og potenser med rasjonale eksponenter, og bruke potensreglene og rotreglene til å forenkle uttrykk. Uke 34.',
    guide: [
      ['n-terøtter', 'ⁿ√a er tallet som opphøyd i n blir a: (ⁿ√a)ⁿ = a.\nHvis n er et partall, skal både a og ⁿ√a være positive. Eksempel: ⁴√16 = 2.\nHvis n er et oddetall, kan a være negativ: ∛−8 = −2.\nGeoGebra: nrot(x, n).'],
      ['Definisjoner for potenser', 'aⁿ = a · a · … · a (n faktorer)\na⁰ = 1 (a ≠ 0)\na⁻ⁿ = 1/aⁿ (a ≠ 0)'],
      ['Potensreglene', 'aᵖ · a^q = a^(p+q)\naᵖ / a^q = a^(p−q)\n(a · b)ᵖ = aᵖ · bᵖ\n(a/b)ᵖ = aᵖ / bᵖ\n(aᵖ)^q = a^(p·q)'],
      ['Brøkeksponenter', 'a^(t/n) = ⁿ√(aᵗ) = (ⁿ√a)ᵗ\nder t er et helt tall, n et positivt helt tall og a > 0.\nEksempel: 8^(2/3) = (∛8)² = 4.'],
      ['Regning med røtter', 'ⁿ√(ab) = ⁿ√a · ⁿ√b\nⁿ√(a/b) = ⁿ√a / ⁿ√b\nEksempel: √75 = √(25 · 3) = 5√3.'],
    ],
    skills: [
      {
        id: 'r1a0', title: 'Formler: røtter og potenser',
        items: [
          fx('Formel', 'Hva er a⁻³ lik?', ['1/a³', '−a³', 'a^(1/3)', '−3a'], 'Definisjonen: a⁻ⁿ = 1/aⁿ.'),
          fx('Formel', 'Hva er a⁵ · a³?', ['a⁸', 'a¹⁵', 'a²', '2a⁸'], 'Like grunntall ganges: eksponentene legges sammen.'),
          fx('Formel', 'Hva er (a²)⁴?', ['a⁸', 'a⁶', 'a¹⁶', '4a²'], 'Potens av en potens: eksponentene ganges.'),
          fx('Formel', 'Hva er a⁷ / a²?', ['a⁵', 'a^(7/2)', 'a⁹', 'a¹⁴'], 'Like grunntall deles: eksponentene trekkes fra.'),
          fx('Formel', 'Hvilket rotuttrykk er lik a^(3/4)?', ['⁴√(a³)', '∛(a⁴)', '3√a⁴', 'a³/4'], 'Nevneren i eksponenten blir rotindeksen.'),
          fx('Formel', 'Hva er x^(1/n)?', ['ⁿ√x', 'x/n', '1/xⁿ', 'n√x'], 'x^(1/n) = ⁿ√x.'),
          tf('Formel', '⁴√(−16) er lik −2.', false, 'Er n et partall, må a være positiv. ⁴√(−16) er ikke definert.'),
          tf('Formel', '∛(−27) er lik −3.', true, 'Med odde rotindeks kan vi ta roten av negative tall: (−3)³ = −27.'),
          match('Formel', [['a⁰', '1'], ['a⁻¹', '1/a'], ['a^(1/2)', '√a'], ['(ab)²', 'a²b²']], 'Koble uttrykket med det det er lik'),
        ],
      },
      {
        id: 'r1a1', title: '1A I timen',
        items: [
          N('1.1 a', 'Regn ut ∛1000.', 10, '10³ = 1000.', U),
          N('1.1 b', 'Regn ut ∛64.', 4, '4³ = 64.', U),
          N('1.1 c', 'Regn ut ∛−1.', -1, '(−1)³ = −1.', U),
          N('1.1 d', 'Regn ut ⁵√32.', 2, '2⁵ = 32.', U),
          N('1.1 e', 'Regn ut ⁴√256.', 4, '4⁴ = 256.', U),
          N('1.3 a', 'Finn ∛10 med tre desimaler.', 2.154, '∛10 ≈ 2,154 (CAS: nrot(10, 3)).', T(0.0004)),
          N('1.3 b', 'Finn ⁴√17 med tre desimaler.', 2.031, '⁴√17 ≈ 2,031.', T(0.0004)),
          N('1.3 c', 'Finn ⁷√−64 med tre desimaler.', -1.811, '⁷√−64 ≈ −1,811.', T(0.0004)),
          N('1.3 d', 'Finn ¹²√1,065 med tre desimaler.', 1.005, '¹²√1,065 ≈ 1,005.', T(0.0004)),
          mc('1.5 a', 'Skriv så enkelt som mulig: a⁶b² / (a³b)', ['a³b', 'a²b', 'a³b²', 'a⁹b³'], 'a^(6−3) · b^(2−1) = a³b.'),
          mc('1.5 b', 'Skriv så enkelt som mulig: a³b⁹ / (a²(b⁻³)⁻³)', ['a', 'ab¹⁸', 'a⁵', 'a/b¹⁸'], '(b⁻³)⁻³ = b⁹, så uttrykket blir a³b⁹/(a²b⁹) = a.'),
          mc('1.5 c', 'Skriv så enkelt som mulig: (2a)² · b⁰ / (ab⁻³)', ['4ab³', '2ab³', '4a/b³', '4a²b³'], '(2a)² = 4a², b⁰ = 1. 4a²/(ab⁻³) = 4a^(2−1)b^(0+3) = 4ab³.'),
          mc('1.5 d', 'Skriv så enkelt som mulig: (2ab²)³ / (2a³ · 2ab⁻¹)', ['2b⁷/a', '2b⁵/a', '2ab⁷', '8b⁷/a'], '(2ab²)³ = 8a³b⁶ og 2a³ · 2ab⁻¹ = 4a⁴b⁻¹. 8a³b⁶/(4a⁴b⁻¹) = 2a⁻¹b⁷.'),
          match('1.7', [['∛7', '7^(1/3)'], ['5^(1/2)', '√5'], ['⁵√(3⁴)', '3^(4/5)'], ['y^(3/4)', '⁴√(y³)']], 'Skriv rotuttrykkene som potenser og potensene som rotuttrykk'),
          mc('1.7 e', 'Skriv 7^(1/4) som et rotuttrykk.', ['⁴√7', '√(7⁴)', '7/4', '∛7'], 'Nevneren i eksponenten blir rotindeksen.'),
          ord('1.12 a', 'Vis at √50 = 5√2.', ['√50 = √(25 · 2)', '= √25 · √2', '= 5√2'], ['= 25√2'], 'Vi deler opp 50 slik at én faktor er et kvadrattall.', U),
          ord('1.12 b', 'Vis at √45 = 3√5.', ['√45 = √(9 · 5)', '= √9 · √5', '= 3√5'], ['= 9√5'], 'Vi deler opp 45 = 9 · 5.', U),
          ord('1.12 c', 'Vis at ⁴√32 = 2 · ⁴√2.', ['⁴√32 = ⁴√(16 · 2)', '= ⁴√16 · ⁴√2', '= 2 · ⁴√2'], ['= 4 · ⁴√2'], '16 = 2⁴, så ⁴√16 = 2.', U),
          ord('1.12 d', 'Vis at ⁶√(a⁷) = a · ⁶√a.', ['⁶√(a⁷) = ⁶√(a⁶ · a)', '= ⁶√(a⁶) · ⁶√a', '= a · ⁶√a'], ['= a⁶ · ⁶√a'], 'Vi skriver a⁷ = a⁶ · a.', U),
          mc('1.13 a', 'Skriv så enkelt som mulig: ∛(8x³)', ['2x', '8x', '2x³', '∛8 · x'], '∛8 = 2 og ∛(x³) = x.', U),
          mc('1.13 b', 'Skriv så enkelt som mulig: √(64/x⁴)', ['8/x²', '8/x⁴', '32/x²', '8x²'], '√64 = 8 og √(x⁴) = x².', U),
          mc('1.13 c', 'Skriv så enkelt som mulig: ⁴√(16y⁴/10 000)', ['y/5', '2y/10', 'y/10', '2y/5'], '⁴√16 = 2, ⁴√(y⁴) = y og ⁴√10 000 = 10. 2y/10 = y/5.', U),
          N('1.13 d', 'Regn ut ∛32 · ∛2.', 4, '∛32 · ∛2 = ∛64 = 4.', U),
        ],
      },
      {
        id: 'r1a2', title: '1A Lekser',
        items: [
          ord('1.2', 'Skriv tallene i stigende rekkefølge.', ['⁵√−1', '⁷√1', '⁴√16', '⁴√40', '∛27', '√100'], [], 'Verdiene er −1, 1, 2, ca. 2,5, 3 og 10.', U),
          mc('1.4 a', 'Skriv så enkelt som mulig: x⁴ · x² / (x · x³)', ['x²', 'x⁴', 'x³', '1'], 'x⁶ / x⁴ = x².'),
          mc('1.4 b', 'Skriv så enkelt som mulig: (5x²)² / (5x³)', ['5x', '5x²', 'x', '25x'], '25x⁴ / (5x³) = 5x.'),
          mc('1.4 c', 'Skriv så enkelt som mulig: (1/x)⁶ · (x²)³', ['1', 'x', 'x¹²', 'x⁻¹²'], 'x⁻⁶ · x⁶ = x⁰ = 1.'),
          mc('1.4 d', 'Skriv så enkelt som mulig: (x⁻³)⁻¹ / (2x)²', ['x/4', 'x/2', '4x', 'x⁵/4'], 'x³ / (4x²) = x/4.'),
          ord('1.6 a', 'Begrunn at (a/b)ᵖ = aᵖ/bᵖ på samme måte som Cecilie.', ['(a/b)ᵖ = (a/b) · (a/b) · … · (a/b), med p faktorer', '= (a · a · … · a) / (b · b · … · b)', '= aᵖ / bᵖ'], ['= aᵖ · bᵖ'], 'Vi ganger sammen tellerne og nevnerne hver for seg.'),
          mc('1.6 a', 'Hva må du anta om b for at (a/b)ᵖ = aᵖ/bᵖ skal gjelde?', ['b ≠ 0', 'b > 0', 'b = 1', 'b er et partall'], 'Vi kan ikke dele på null.'),
          mc('1.6 b', 'Hva må du anta om a for at aᵖ/a^q = a^(p−q) skal gjelde?', ['a ≠ 0', 'a > 1', 'a = 1', 'Ingenting'], 'Vi kan ikke dele på null.'),
          mc('1.8 a', 'Skriv så enkelt som mulig: (√n)²', ['n', '2n', 'n²', '√(2n)'], '(n^(1/2))² = n.'),
          mc('1.8 b', 'Skriv så enkelt som mulig: ∛(y⁹)', ['y³', 'y⁶', 'y^(1/3)', '3y'], 'y^(9/3) = y³.'),
          mc('1.8 c', 'Skriv så enkelt som mulig: a√a', ['a^(3/2)', 'a²', 'a^(1/2)', '√(2a)'], 'a¹ · a^(1/2) = a^(3/2).'),
          mc('1.8 d', 'Skriv så enkelt som mulig: x · ∛x · ∛(x²)', ['x²', 'x', 'x^(5/3)', 'x³'], 'x^(1 + 1/3 + 2/3) = x².'),
          mc('1.9 a', 'Skriv så enkelt som mulig: ⁵√y · ¹⁰√(y⁸)', ['y', 'y²', 'y^(9/10)', 'y^(1/2)'], 'y^(1/5) · y^(8/10) = y^(2/10 + 8/10) = y.'),
          mc('1.9 b', 'Skriv så enkelt som mulig: √a · ∛a · ⁴√a / ¹²√a', ['a', 'a²', 'a^(13/12)', 'a^(1/12)'], 'a^(6/12 + 4/12 + 3/12 − 1/12) = a^(12/12) = a.'),
          N('1.9 c', 'Regn ut ⁴√(25⁵) · 25^(−3/4).', 5, '25^(5/4 − 3/4) = 25^(1/2) = 5.'),
          mc('1.9 d', 'Skriv så enkelt som mulig: a · ∛(a⁵) · a^(−2/3)', ['a²', 'a', 'a³', 'a^(8/3)'], 'a^(1 + 5/3 − 2/3) = a².'),
          ord('1.10', 'Skriv tallene i stigende rekkefølge.', ['8^(−2/3)', '√8 · ∛8 · ⁶√8', '⁷√(3¹⁴)', '9^(1/2) · (∛5)³'], [], 'Verdiene er 1/4, 8, 9 og 15.', U),
          N('1.10', 'Hva er 8^(−2/3)?', 0.25, '8^(−2/3) = 1/(∛8)² = 1/4.', U),
          N('1.10', 'Hva er √8 · ∛8 · ⁶√8?', 8, '8^(1/2 + 1/3 + 1/6) = 8¹ = 8.', U),
          code('1.11', 'Hvilket program regner ut √8 · ∛8 · ⁶√8 riktig?', null, ['print(8**(1/2) * 8**(1/3) * 8**(1/6))', 'print(8**1/2 * 8**1/3 * 8**1/6)', 'print(8^(1/2) * 8^(1/3) * 8^(1/6))', 'print(8**(1/2 + 1/3 + 1/6) / 3)'], 'I Python er ** potens, og eksponenten må stå i parentes. ^ betyr noe annet i Python.'),
        ],
      },
      {
        id: 'r1a3', title: '1A E1 (ekstra)', optional: true,
        items: [
          N('1.14 a', 'Regn ut √25.', 5, '5² = 25.', U),
          N('1.14 b', 'Regn ut 81^(1/2).', 9, '81^(1/2) = √81 = 9.', U),
          N('1.14 c', 'Regn ut ⁵√100 000.', 10, '10⁵ = 100 000.', U),
          N('1.14 d', 'Regn ut ⁷√1.', 1, '1⁷ = 1.', U),
          N('1.14 e', 'Regn ut 27^(1/3).', 3, '∛27 = 3.', U),
          N('1.14 f', 'Regn ut (⁶√2)⁶.', 2, 'Definisjonen: (ⁿ√a)ⁿ = a.', U),
          N('1.14 g', 'Regn ut ⁶√(2⁶).', 2, '2^(6/6) = 2.', U),
          match('1.15', [['∛2', '2^(1/3)'], ['7^(1/2)', '√7'], ['x^(2/3)', '∛(x²)'], ['⁴√(x³)', 'x^(3/4)']], 'Skriv som potens eller rotuttrykk'),
          mc('1.15 f', 'Skriv 32^(4/7) som et rotuttrykk.', ['⁷√(32⁴)', '⁴√(32⁷)', '32⁴/7', '7√(32⁴)'], 'Nevneren 7 blir rotindeksen.'),
          mc('1.15 g', 'Skriv ⁶√(11¹²) som en potens.', ['11²', '11⁶', '11^(1/2)', '11⁷²'], '11^(12/6) = 11².'),
          mc('1.16 a', 'Skriv så enkelt som mulig: √2 · √6', ['2√3', '√8', '3√2', '12'], '√12 = √(4 · 3) = 2√3.', U),
          N('1.16 b', 'Regn ut ∛36 · ⁶√36.', 6, '36^(1/3 + 1/6) = 36^(1/2) = 6.', U),
          mc('1.16 c', 'Skriv så enkelt som mulig: ∛(125/27)', ['5/3', '25/9', '5/9', '125/3'], '∛125 = 5 og ∛27 = 3.', U),
          N('1.16 d', 'Regn ut ⁴√(1/16).', 0.5, '⁴√1 / ⁴√16 = 1/2.', U),
          mc('1.16 e', 'Skriv så enkelt som mulig: ∛(x²) · ⁸√(x²) / ¹²√(x⁵)', ['√x', 'x', 'x^(1/3)', 'x²'], 'x^(8/12 + 3/12 − 5/12) = x^(6/12) = √x.', U),
          match('1.17', [['125^(1/3)', 'H (5)'], ['x⁰', 'D (1)'], ['⁴√(36²)', 'I (6)'], ['(√7)²', 'J (7)']], 'Koble tallet med punktet på tallinja (A = −2, B = −1, …, L = 9)', U),
          mc('1.17', 'Hvilket punkt på tallinja svarer 64^(1/2) til? (A = −2, B = −1, …, L = 9)', ['K (8)', 'J (7)', 'L (9)', 'H (5)'], '64^(1/2) = √64 = 8.', U),
          mc('1.17', 'Hvilket punkt på tallinja svarer ⁷√−1 til? (A = −2, B = −1, …, L = 9)', ['B (−1)', 'D (1)', 'A (−2)', 'C (0)'], '(−1)⁷ = −1.', U),
        ],
      },
      {
        id: 'r1a4', title: '1A E2 (ekstra)', optional: true,
        items: [
          N('1.18 a', 'Regn ut (∛n)³ / (√n)².', 1, '(∛n)³ = n og (√n)² = n.', U),
          mc('1.18 b', 'Skriv så enkelt som mulig: √x · x^(2/3) · x^(−1/6)', ['x', 'x²', 'x^(2/3)', '√x'], 'x^(3/6 + 4/6 − 1/6) = x¹.', U),
          mc('1.18 c', 'Skriv så enkelt som mulig: ∛(4x) · ∛(16x²)', ['4x', '8x', '4x²', '2x'], '∛(64x³) = 4x.', U),
          N('1.18 d', 'Regn ut (3√2 + 2√3)(3√2 − 2√3).', 6, 'Konjugatsetningen: (3√2)² − (2√3)² = 18 − 12 = 6.', U),
          N('1.19 a', '2^(a/b) = 4. Hva er eksponenten a/b?', 2, '4 = 2², for eksempel a = 2 og b = 1.'),
          N('1.19 b', '2^(a/b) = ∛2. Hva er eksponenten a/b? (Svar som desimaltall)', 1 / 3, '∛2 = 2^(1/3).'),
          N('1.19 c', '2^(a/b) = √8. Hva er eksponenten a/b?', 1.5, '√8 = (2³)^(1/2) = 2^(3/2).'),
          N('1.19 d', '2^(a/b) = 1/4. Hva er eksponenten a/b?', -2, '1/4 = 2⁻².'),
          N('1.19 e', '2^(a/b) = 16^0,75. Hva er eksponenten a/b?', 3, '16^0,75 = (2⁴)^(3/4) = 2³.'),
          mc('1.20 a', 'Skriv √50 / 5 så enkelt som mulig.', ['√2', '√10', '5√2', '2'], '√50 = 5√2, og 5√2/5 = √2.', U),
          ord('1.20 b', 'Vis at 4/∛2 er lik (∛2)⁵.', ['4/∛2 = 2² / 2^(1/3)', '= 2^(2 − 1/3)', '= 2^(5/3)', '= (2^(1/3))⁵ = (∛2)⁵'], ['= 2^(7/3)'], 'Vi skriver alt som potenser av 2.', U),
        ],
      },
    ],
  };

  // ================================================================
  // 1B Logaritmer
  // ================================================================
  const r1b = {
    id: 'r1b', title: '1B Logaritmer',
    color: '#1cb0f6', dark: '#1899d6',
    goal: 'Forstå og bruke definisjonene av briggske (lg) og naturlige (ln) logaritmer. Uke 34.',
    guide: [
      ['Briggske logaritmer (lg)', 'lg p er tallet vi må opphøye 10 i for å få p: 10^(lg p) = p.\nlg 10ᵏ = k\nlg 10 = 1\nlg 1 = 0\nlg er bare definert for positive tall. Logaritmen kan likevel være negativ: lg 0,1 = −1.\nGeoGebra: lg(x). Python: log10(x) fra pylab.'],
      ['Eulertallet e', '(1 + 1/n)ⁿ nærmer seg e ≈ 2,718 281 828 459 … når n blir stor.'],
      ['Naturlige logaritmer (ln)', 'ln p er tallet vi må opphøye e i for å få p: e^(ln p) = p.\nln eᵏ = k\nln e = 1\nln 1 = 0\nGeoGebra: ln(x). Python: log(x) fra pylab.'],
      ['Logaritmefunksjoner', 'f(x) = lg x har\nD_f = ⟨0, →⟩\nV_f = ℝ\nGrafene til lg x og 10ˣ ligger symmetrisk om linja y = x.'],
    ],
    skills: [
      {
        id: 'r1b0', title: 'Formler: lg og ln',
        items: [
          fx('Formel', 'Hva er lg 1?', ['0', '1', '10', 'Ikke definert'], '10⁰ = 1.'),
          fx('Formel', 'Hva er ln e?', ['1', '0', 'e', '10'], 'e¹ = e.'),
          fx('Formel', 'Hva er 10^(lg 7)?', ['7', 'lg 7', '10⁷', '70'], 'Definisjonen: 10^(lg p) = p.'),
          fx('Formel', 'Hva er ln e⁵?', ['5', 'e⁵', '5e', '1'], 'ln eᵏ = k.'),
          tf('10 rette eller gale 1', 'lg a er bare definert når a er et positivt tall.', true, 'Vi kan aldri opphøye 10 i noe og få null eller et negativt tall.'),
          tf('10 rette eller gale 2', 'Logaritmen til et tall er alltid et positivt tall.', false, 'lg 0,1 = −1. Logaritmen er negativ for tall mellom 0 og 1.'),
          tf('10 rette eller gale 3', 'Den naturlige logaritmen har 10 som grunntall.', false, 'Den naturlige logaritmen har grunntall e. Den briggske har grunntall 10.'),
          tf('10 rette eller gale 4', 'lg 0,8 er et positivt tall.', false, '0,8 < 1, så lg 0,8 < 0.'),
          match('Formel', [['lg 100', '2'], ['lg 0,1', '−1'], ['ln 1', '0'], ['ln √e', '1/2']], 'Koble logaritmen med verdien'),
        ],
      },
      {
        id: 'r1b1', title: '1B I timen',
        items: [
          N('1.21 a', 'Bruk definisjonen: 10^(lg 6)', 6, '10^(lg p) = p.'),
          N('1.21 b', 'Bruk definisjonen: 10^(lg 0,5)', 0.5, '10^(lg p) = p.'),
          N('1.21 c', 'Bruk definisjonen: 10^(lg (3/5))', 0.6, '10^(lg p) = p, altså 3/5.'),
          N('1.22 a', 'Bruk definisjonen: lg 10⁵', 5, 'lg 10ᵏ = k.'),
          N('1.22 b', 'Bruk definisjonen: lg 10^3,4', 3.4, 'lg 10ᵏ = k.'),
          N('1.22 c', 'Bruk definisjonen: lg 10^−2,5', -2.5, 'lg 10ᵏ = k.'),
          N('1.22 d', 'Bruk definisjonen: lg 10^(1/4)', 0.25, 'lg 10ᵏ = k.'),
          N('1.23 a', 'Finn lg 10 000.', 4, '10 000 = 10⁴.'),
          N('1.23 b', 'Finn lg 0,0001.', -4, '0,0001 = 10⁻⁴.'),
          mc('1.23 c', 'Finn lg ∛10.', ['1/3', '3', '−3', '10/3'], '∛10 = 10^(1/3).'),
          mc('1.23 d', 'Finn lg ⁵√1000.', ['3/5', '5/3', '3', '200'], '⁵√1000 = (10³)^(1/5) = 10^(3/5).'),
          N('1.26 a', 'Finn e^(ln 3).', 3, 'e^(ln p) = p.'),
          N('1.26 b', 'Finn ln e².', 2, 'ln eᵏ = k.'),
          N('1.26 c', 'Finn e^(ln 1).', 1, 'e^(ln p) = p.'),
          N('1.26 d', 'Finn ln e^(4²).', 16, 'ln eᵏ = k, og 4² = 16.'),
          N('1.27 a1', 'Finn e^(ln 0,6).', 0.6, 'e^(ln p) = p.'),
          N('1.27 a2', 'Finn ln (1/e³).', -3, '1/e³ = e⁻³.'),
          mc('1.27 a3', 'Finn ln ∛(e²).', ['2/3', '3/2', '6', '2'], '∛(e²) = e^(2/3).'),
          N('1.27 a4', 'Finn ln (e⁵/e²).', 3, 'e⁵/e² = e³.'),
          code('1.27 c', 'Hvilket program skriver ut svaret på ln (e⁵/e²)?', null, ['from pylab import *\nprint(log(e**5 / e**2))', 'from pylab import *\nprint(log10(e**5 / e**2))', 'from pylab import *\nprint(ln(e**5 / e**2))', 'from pylab import *\nprint(log(e^5 / e^2))'], 'I pylab er log() den naturlige logaritmen, og log10() den briggske. Potens skrives **.'),
        ],
      },
      {
        id: 'r1b2', title: '1B Lekser',
        items: [
          N('1.24 b1', 'Finn lg 7 med tre gjeldende siffer.', 0.845, 'CAS: lg(7) ≈ 0,845.', T(0.002)),
          N('1.24 b2', 'Finn lg 0,80 med tre gjeldende siffer.', -0.0969, 'lg 0,80 ≈ −0,0969.', T(0.003)),
          N('1.24 b3', 'Finn lg 4,5 med tre gjeldende siffer.', 0.653, 'lg 4,5 ≈ 0,653.', T(0.002)),
          N('1.24 b4', 'Finn lg 95 med tre gjeldende siffer.', 1.98, 'lg 95 ≈ 1,98.', T(0.003)),
          code('1.24 c', 'Hvilket program skriver ut lg 7?', null, ['from pylab import *\nprint(log10(7))', 'from pylab import *\nprint(log(7))', 'from pylab import *\nprint(lg(7))', 'from pylab import *\nprint(10**7)'], 'log10() er den briggske logaritmen i pylab.'),
          mc('1.24 d', 'Skriv 4,5 som en tierpotens.', ['10^0,653', '10^4,5', '4,5^10', '10^1,98'], '10^(lg 4,5) = 4,5, og lg 4,5 ≈ 0,653.'),
          N('1.25 a1', 'Les av grafen til lg x: tilnærmet verdi for lg 2.', 0.3, 'lg 2 ≈ 0,3.', T(0.05)),
          N('1.25 a2', 'Les av grafen til lg x: tilnærmet verdi for lg 0,5.', -0.3, 'lg 0,5 ≈ −0,3.', T(0.05)),
          mc('1.25 b', 'Hvorfor får lg 2 og lg 0,5 motsatt fortegn?', ['0,5 = 1/2 = 2⁻¹, så lg 0,5 = −lg 2', 'Fordi 0,5 er et desimaltall', 'Fordi lg alltid er negativ', 'Fordi 2 er et partall'], 'Hvis 10ᵏ = 2, er 10⁻ᵏ = 1/2.'),
          mc('1.28 b', 'Hvorfor stiger grafen til ln x brattere enn grafen til lg x for x > 1?', ['e < 10, så vi trenger en større eksponent på e enn på 10 for å få samme tall', 'ln x er alltid negativ', 'lg x er ikke definert for x > 1', 'De stiger like bratt'], 'Grunntallet e ≈ 2,718 er mindre enn 10. ln x ≈ 2,3 · lg x.'),
        ],
      },
      {
        id: 'r1b3', title: '1B E1 (ekstra)', optional: true,
        items: [
          N('1.29 a', 'Skriv så enkelt som mulig: lg 10⁸', 8, 'lg 10ᵏ = k.', U),
          mc('1.29 b', 'Skriv så enkelt som mulig: lg 10ˣ', ['x', '10x', 'lg x', '10ˣ'], 'lg 10ᵏ = k.', U),
          N('1.29 c', 'Skriv så enkelt som mulig: ln e²', 2, 'ln eᵏ = k.', U),
          mc('1.29 d', 'Skriv så enkelt som mulig: ln e^(5x)', ['5x', 'e^(5x)', '5', 'x⁵'], 'ln eᵏ = k.', U),
          N('1.30 a', 'Regn ut lg 10 000.', 4, '10⁴ = 10 000.', U),
          N('1.30 b', 'Regn ut lg 0,01.', -2, '10⁻² = 0,01.', U),
          N('1.30 c', 'Regn ut ln e.', 1, 'e¹ = e.', U),
          N('1.30 d', 'Regn ut e^(ln 10).', 10, 'e^(ln p) = p.', U),
          N('1.31 a', 'Regn ut lg 10 − lg 1.', 1, '1 − 0 = 1.', U),
          N('1.31 b', 'Regn ut ln 1 − ln e².', -2, '0 − 2 = −2.', U),
          N('1.31 c', 'Regn ut lg 100 − lg 10⁻².', 4, '2 − (−2) = 4.', U),
          N('1.31 d', 'Regn ut ln e³ − e^(ln 3).', 0, '3 − 3 = 0.', U),
          ord('1.32', 'Skriv tallene i stigende rekkefølge.', ['lg 0,1', 'lg 1', 'lg √10', 'ln e', 'ln e³'], [], 'Verdiene er −1, 0, 1/2, 1 og 3.', U),
        ],
      },
      {
        id: 'r1b4', title: '1B E2 (ekstra)', optional: true,
        items: [
          ord('1.33', 'Skriv tallene i stigende rekkefølge.', ['lg e', 'ln (lg 10ᵉ)', 'lg ∛(100²)', '10^(lg e)', 'lg 100³'], [], 'Verdiene er ca. 0,43, 1, 4/3, e ≈ 2,72 og 6.', U),
          mc('1.34 a', 'a og b er positive. Hvilket symbol skal stå mellom «a = b» og «lg a = lg b»?', ['⇔', '⇒', '⇐'], 'Like tall har like logaritmer, og like logaritmer betyr like tall.'),
          mc('1.34 b', 'a og b er positive. Hvilket symbol skal stå mellom «a > b» og «lg a > lg b»?', ['⇔', '⇒', '⇐'], 'lg er en voksende funksjon.'),
          N('1.35 a', 'Regn ut lg 100 − ln (1/e²).', 4, '2 − (−2) = 4.', U),
          N('1.35 b', 'Regn ut lg (ln e).', 0, 'ln e = 1 og lg 1 = 0.', U),
          N('1.35 c', 'Regn ut e^(ln 2 + ln 3).', 6, 'e^(ln 2) · e^(ln 3) = 2 · 3.', U),
          N('1.35 d', 'Regn ut ln ∛(e⁵) − lg ∛100.', 1, '5/3 − 2/3 = 1.', U),
          N('1.36 a', 'Regn ut e^(3 ln 3).', 27, '(e^(ln 3))³ = 3³.', U),
          mc('1.36 b', 'Skriv så enkelt som mulig: lg 100ˣ', ['2x', '100x', 'x²', '2ˣ'], '100ˣ = 10^(2x).', U),
          N('1.36 c', 'Regn ut ln (1/√e).', -0.5, '1/√e = e^(−1/2).', U),
          N('1.36 d', 'Regn ut 10^(2 lg 4).', 16, '(10^(lg 4))² = 4².', U),
          N('1.37 a', 'Skriv 1,35 som 10ˣ. Hva er x (to desimaler)?', 0.13, 'x = lg 1,35 ≈ 0,13.', T(0.04)),
          N('1.37 b', 'Skriv 1,35 som eˣ. Hva er x (to desimaler)?', 0.3, 'x = ln 1,35 ≈ 0,30.', T(0.02)),
        ],
      },
    ],
  };

  // ================================================================
  // 1C Logaritmesetningene
  // ================================================================
  const r1c = {
    id: 'r1c', title: '1C Logaritmesetningene',
    color: '#ff9600', dark: '#cc7900',
    goal: 'Bruke de tre logaritmesetningene til å forenkle uttrykk og regne ut logaritmer, og bevise setningene. Uke 34.',
    guide: [
      ['Første logaritmesetning', 'Når a og b er positive:\nlg ab = lg a + lg b\nln ab = ln a + ln b'],
      ['Andre logaritmesetning', 'lg (a/b) = lg a − lg b\nln (a/b) = ln a − ln b'],
      ['Tredje logaritmesetning', 'Når a er positiv:\nlg aᵇ = b · lg a\nln aᵇ = b · ln a\nMerk: lg x² betyr lg (x²). (lg x)² betyr (lg x) · (lg x).'],
      ['Sammenheng mellom lg og ln', 'lg x = ln x / ln 10.\nBevis: 10^(lg x) = x ⇒ ln 10^(lg x) = ln x ⇒ lg x · ln 10 = ln x.'],
      ['Vanlige feil', 'lg (a + b) er IKKE lg a + lg b.\nln (a² − b²) er IKKE ln a² − ln b², men ln (a + b) + ln (a − b).\nlg a / lg b er IKKE lg a − lg b.'],
    ],
    skills: [
      {
        id: 'r1c0', title: 'Formler: logaritmesetningene',
        items: [
          fx('Formel', 'Hva er ln (a · b)?', ['ln a + ln b', 'ln a · ln b', 'ln a − ln b', 'a · ln b'], '1. logaritmesetning.'),
          fx('Formel', 'Hva er lg (a/b)?', ['lg a − lg b', 'lg a / lg b', 'lg b − lg a', 'lg (a − b)'], '2. logaritmesetning.'),
          fx('Formel', 'Hva er ln x⁴?', ['4 ln x', '(ln x)⁴', 'ln 4x', 'x⁴ ln'], '3. logaritmesetning.'),
          fx('Formel', 'Hva er lg x uttrykt med naturlige logaritmer?', ['ln x / ln 10', 'ln x · ln 10', 'ln 10 / ln x', 'ln (x/10)'], 'lg x = ln x / ln 10.'),
          tf('10 rette eller gale 6', 'ln (x − 2) = ln x − ln 2', false, '2. setning gjelder for en brøk: ln (x/2) = ln x − ln 2. ln (x − 2) kan ikke deles opp.'),
          tf('10 rette eller gale 7', 'lg x / lg y = lg x − lg y', false, 'lg (x/y) = lg x − lg y, men lg x / lg y er noe helt annet.'),
          tf('Formel', '(lg x)² og lg x² er det samme.', false, 'lg x² = 2 lg x (for x > 0), mens (lg x)² = lg x · lg x.'),
          match('Formel', [['lg ab', 'lg a + lg b'], ['lg (a/b)', 'lg a − lg b'], ['lg aᵇ', 'b · lg a'], ['lg (1/a)', '−lg a']], 'Koble uttrykket med det det er lik'),
        ],
      },
      {
        id: 'r1c1', title: '1C I timen',
        items: [
          N('1.38 a', 'lg 2 ≈ 0,3 og lg 5 ≈ 0,7. Finn en tilnærmet verdi for lg 25.', 1.4, 'lg 25 = lg 5² = 2 · 0,7.', U),
          N('1.38 b', 'lg 2 ≈ 0,3 og lg 5 ≈ 0,7. Finn en tilnærmet verdi for lg 8.', 0.9, 'lg 8 = lg 2³ = 3 · 0,3.', U),
          N('1.38 c', 'lg 2 ≈ 0,3 og lg 5 ≈ 0,7. Finn en tilnærmet verdi for lg 20.', 1.3, 'lg 20 = lg (4 · 5) = 2 · 0,3 + 0,7.', U),
          N('1.43 a', 'lg 2 ≈ 0,3 og lg 5 ≈ 0,7. Finn en tilnærmet verdi for lg 2,5.', 0.4, 'lg (5/2) = 0,7 − 0,3.', U),
          N('1.43 b', 'lg 2 ≈ 0,3 og lg 5 ≈ 0,7. Finn en tilnærmet verdi for lg 0,4.', -0.4, 'lg (2/5) = 0,3 − 0,7.', U),
          N('1.43 c', 'lg 2 ≈ 0,3 og lg 5 ≈ 0,7. Finn en tilnærmet verdi for lg 0,8.', -0.1, 'lg (4/5) = 0,6 − 0,7.', U),
          mc('1.46 a', 'Forenkle: lg a³ + lg a²', ['5 lg a', '6 lg a', 'lg a⁶', '(lg a)⁵'], '3 lg a + 2 lg a.'),
          mc('1.46 b', 'Forenkle: 2 lg b⁸ − 2 lg b⁷', ['2 lg b', 'lg b', '30 lg b', '2'], '16 lg b − 14 lg b.'),
          mc('1.46 c', 'Forenkle: lg c + 8 lg c² − 2 lg c⁻²', ['21 lg c', '13 lg c', '17 lg c', '20 lg c'], 'lg c + 16 lg c + 4 lg c.'),
          mc('1.47 a', 'Forenkle: ln x⁵ + ln x⁻²', ['3 ln x', '7 ln x', '−10 ln x', 'ln 3x'], '5 ln x − 2 ln x.'),
          mc('1.47 b', 'Forenkle: 5 ln y⁴ − ln y⁷', ['13 ln y', '3 ln y', '27 ln y', '−3 ln y'], '20 ln y − 7 ln y.'),
          mc('1.47 c', 'Forenkle: 6 ln z³ + 2 ln √z + ln z⁻¹', ['18 ln z', '19 ln z', '20 ln z', '17 ln z'], '18 ln z + ln z − ln z.'),
          mc('1.48 a', 'Forenkle: lg ab + lg a²b + lg b⁻³', ['3 lg a − lg b', '3 lg a + lg b', '3 lg a', '2 lg a − lg b'], '(lg a + lg b) + (2 lg a + lg b) − 3 lg b.'),
          mc('1.48 b', 'Forenkle: 3 lg ab³ − lg b⁹', ['3 lg a', '3 lg a + 9 lg b', 'lg a', '3 lg a − 6 lg b'], '3 lg a + 9 lg b − 9 lg b.'),
          mc('1.48 c', 'Forenkle: 5 ln (ab²) + 2 ln (a³b) − 3 ln (ab⁶)', ['8 ln a − 6 ln b', '8 ln a + 6 ln b', '4 ln a − 6 ln b', '8 ln a − 8 ln b'], '(5 + 6 − 3) ln a + (10 + 2 − 18) ln b.'),
          mc('1.48 d', 'Forenkle: lg (a/b) + lg (a/b²) + 2 lg (1/b)', ['2 lg a − 5 lg b', '2 lg a − 3 lg b', '2 lg a + 5 lg b', 'lg a − 5 lg b'], '(lg a − lg b) + (lg a − 2 lg b) − 2 lg b.'),
          mc('1.48 e', 'Forenkle: ln (1/(a²b³)) − 3 ln (a/b⁻²)', ['−5 ln a − 9 ln b', '−5 ln a + 3 ln b', '−5 ln a − 3 ln b', '5 ln a − 9 ln b'], '(−2 ln a − 3 ln b) − 3(ln a + 2 ln b).'),
          mc('1.48 f', 'Forenkle: ln (5a²/b) − ln (5/a⁻²)', ['−ln b', 'ln b', '4 ln a − ln b', '−ln 5b'], '(ln 5 + 2 ln a − ln b) − (ln 5 + 2 ln a).'),
          N('1.49 a', 'lg 5 ≈ 0,7. Finn en tilnærmet verdi for lg 125.', 2.1, 'lg 5³ = 3 · 0,7.', U),
          N('1.49 b', 'lg 5 ≈ 0,7. Finn en tilnærmet verdi for lg √5.', 0.35, 'lg 5^(1/2) = 0,7/2.', U),
          N('1.49 c', 'lg 5 ≈ 0,7. Finn en tilnærmet verdi for lg 0,2.', -0.7, 'lg (1/5) = −lg 5.', U),
        ],
      },
      {
        id: 'r1c2', title: '1C Lekser',
        items: [
          mc('1.39 a', 'Forenkle: lg (100x) + lg (10x)', ['3 + 2 lg x', '3 + lg x', '1000 lg x', '3 lg x'], '(2 + lg x) + (1 + lg x).'),
          mc('1.39 b', 'Forenkle: ln 4e^(2x) − ln 4', ['2x', 'e^(2x)', '2x + ln 4', 'ln 2x'], '(ln 4 + 2x) − ln 4.'),
          mc('1.39 c', 'Forenkle: 3 ln 2e^(2x) + 2 ln e^(−3x)', ['3 ln 2 = ln 8', '12x', '3 ln 2 + 12x', 'ln 2'], '3(ln 2 + 2x) − 6x = 3 ln 2.'),
          ord('1.40', 'Vis at ln x² + ln x = 3 ln x.', ['ln x² + ln x', '= 2 ln x + ln x', '= 3 ln x'], ['= ln 2x + ln x'], '3. logaritmesetning gir ln x² = 2 ln x.', U),
          ord('1.41', 'Bevis at lg ab = lg a + lg b, der a > 0 og b > 0.', ['ab = 10^(lg ab)', 'ab = 10^(lg a) · 10^(lg b) = 10^(lg a + lg b)', 'Altså er 10^(lg ab) = 10^(lg a + lg b)', 'Like potenser med samme grunntall har like eksponenter: lg ab = lg a + lg b'], ['ab = 10^(lg a · lg b)'], 'Samme idé som i eksempel 9, med 10 som grunntall.'),
          ord('1.44', 'Vis at lg (1/a) = −lg a.', ['lg (1/a) = lg 1 − lg a', '= 0 − lg a', '= −lg a'], ['= 1 − lg a'], '2. logaritmesetning og lg 1 = 0.', U),
          ord('1.45', 'Bevis at ln (a/b) = ln a − ln b, der a > 0 og b > 0.', ['a/b = e^(ln (a/b))', 'a = e^(ln a) og b = e^(ln b)', 'a/b = e^(ln a) / e^(ln b) = e^(ln a − ln b)', 'Like eksponenter: ln (a/b) = ln a − ln b'], ['a/b = e^(ln a / ln b)'], 'Vi skriver a/b på to måter og sammenlikner eksponentene.'),
          ord('1.50 a', 'Vis at 3 ln 5 + 2 ln 10 = ln 12 500.', ['3 ln 5 + 2 ln 10 = ln 5³ + ln 10²', '= ln 125 + ln 100', '= ln (125 · 100)', '= ln 12 500'], ['= ln 225'], '3. og så 1. logaritmesetning.', U),
          ord('1.50 b', 'Vis at lg (x + 2) + lg 2 = lg (2x + 4).', ['lg (x + 2) + lg 2', '= lg (2(x + 2))', '= lg (2x + 4)'], ['= lg (x + 4)'], '1. logaritmesetning.', U),
          ord('1.50 c', 'Vis at lg (x² − 9) − lg (x + 3) = lg (x − 3).', ['lg (x² − 9) − lg (x + 3)', '= lg ((x² − 9)/(x + 3))', '= lg ((x + 3)(x − 3)/(x + 3))', '= lg (x − 3)'], ['= lg x² − lg 9 − lg x − lg 3'], '2. logaritmesetning og konjugatsetningen.', U),
          mc('1.51 a', 'Skal det stå = eller ≠?\nln (x − 4) + ln 4  □  ln x', ['≠', '='], 'ln (x − 4) + ln 4 = ln (4x − 16), ikke ln x.'),
          mc('1.51 b', 'Skal det stå = eller ≠?\nln (6 · x) + ln 2  □  ln 12x', ['=', '≠'], 'ln (6x · 2) = ln 12x.'),
          mc('1.51 c', 'Skal det stå = eller ≠?\nlg (x + 1) − lg 9  □  lg (x − 8)', ['≠', '='], 'lg (x + 1) − lg 9 = lg ((x + 1)/9).'),
          mc('1.51 d', 'Skal det stå = eller ≠?\nln x · ln 3  □  ln (x + 3)', ['≠', '='], 'Det finnes ingen regel for produktet av to logaritmer.'),
          mc('1.51 e', 'Skal det stå = eller ≠?\nlg (10x)  □  1 + lg x', ['=', '≠'], 'lg 10 + lg x = 1 + lg x.'),
          mc('1.51 f', 'Skal det stå = eller ≠?\nlg (10 + x)  □  1 + lg x', ['≠', '='], 'lg av en sum kan ikke deles opp.'),
        ],
      },
      {
        id: 'r1c3', title: '1C E1 (ekstra)', optional: true,
        items: [
          mc('1.52 a', 'Forenkle: lg a + lg a²', ['3 lg a', '2 lg a', 'lg 3a', '(lg a)³'], 'lg a + 2 lg a.'),
          mc('1.52 b', 'Forenkle: ln (a/b) + ln b', ['ln a', 'ln a + 2 ln b', 'ln ab', '0'], '(ln a − ln b) + ln b.'),
          mc('1.52 c', 'Forenkle: ln a³b + ln (1/b⁻¹)', ['3 ln a + 2 ln b', '3 ln a', '3 ln a + ln b', '3 ln a − 2 ln b'], '(3 ln a + ln b) + ln b.'),
          mc('1.52 d', 'Forenkle: lg ab − lg 10a', ['lg b − 1', 'lg b', 'lg b + 1', '1 − lg b'], '(lg a + lg b) − (1 + lg a).'),
          mc('1.53 a', 'Forenkle: ln (ab³) + ln (a/b³)', ['2 ln a', '2 ln a + 6 ln b', 'ln a', '2 ln ab'], '(ln a + 3 ln b) + (ln a − 3 ln b).'),
          mc('1.53 b', 'Forenkle: ln xy + ln (x/y) + lg 10^(ln x)', ['3 ln x', '2 ln x', '3 ln x + 2 ln y', 'ln x'], '(ln x + ln y) + (ln x − ln y) + ln x.'),
          mc('1.53 c', 'Forenkle: lg (3 · 10ˣ) − lg (3/10ˣ)', ['2x', '0', '2 lg 3 + 2x', 'x'], '(lg 3 + x) − (lg 3 − x).'),
          mc('1.54', 'Johannes og Vetle forenkler ln (a² − b²) − ln (a + b). Johannes får ln a − 3 ln b, Vetle får ln (a − b). Hvem har rett?', ['Vetle. Johannes har brukt at ln (a² − b²) = ln a² − ln b², som er feil.', 'Johannes', 'Begge', 'Ingen av dem'], 'a² − b² = (a + b)(a − b), så uttrykket blir ln (a − b).'),
        ],
      },
      {
        id: 'r1c4', title: '1C E2 (ekstra)', optional: true,
        items: [
          mc('1.55 a', 'Forenkle: ln (a · b)² − ln ab + ln (a − b)', ['ln a + ln b + ln (a − b)', '2 ln a + 2 ln b + ln (a − b)', 'ln (a − b)', 'ln a + ln b'], '2(ln a + ln b) − (ln a + ln b) + ln (a − b).'),
          N('1.55 b', 'Forenkle: (lg x³ − lg x⁻⁵) / lg (1/x²)', -4, '(3 lg x + 5 lg x) / (−2 lg x) = 8/(−2).'),
          N('1.55 c', 'Forenkle: (ln √x − 2 ln x) / (ln √x + ln x²). Svar som desimaltall.', -0.6, '(½ − 2)/(½ + 2) = (−3/2)/(5/2) = −3/5.'),
          mc('1.56 a', 'Skriv lg (ab)² + lg (b/a) − 2 lg (a⁻² · b) på formen s lg a + t lg b.', ['5 lg a + lg b', '5 lg a − lg b', 'lg a + 5 lg b', '3 lg a + lg b'], '(2 − 1 + 4) lg a + (2 + 1 − 2) lg b.'),
          mc('1.56 b', 'Skriv det samme uttrykket på formen lg u.', ['lg (a⁵b)', 'lg (5ab)', 'lg (a⁵ + b)', 'lg (ab⁵)'], '5 lg a + lg b = lg a⁵ + lg b = lg (a⁵b).'),
          mc('1.57 a', 'f(x) = lg (x + 1). Hva er definisjonsmengden?', ['⟨−1, →⟩', '⟨0, →⟩', '[−1, →⟩', 'ℝ'], 'x + 1 > 0.'),
          N('1.57 b', 'f(x) = lg (x + 1) og lg 2 ≈ 0,30. Finn f(3).', 0.6, 'f(3) = lg 4 = 2 lg 2.', U),
          N('1.57 b', 'f(x) = lg (x + 1) og lg 2 ≈ 0,30. Finn f(−0,5).', -0.3, 'f(−0,5) = lg 0,5 = −lg 2.', U),
          N('1.57 b', 'f(x) = lg (x + 1) og lg 2 ≈ 0,30. Finn f(7).', 0.9, 'f(7) = lg 8 = 3 lg 2.', U),
          ord('1.58', 'Vis at lg e · ln x = lg x.', ['lg e = ln e / ln 10 = 1 / ln 10', 'lg e · ln x = ln x / ln 10', '= lg x'], ['= ln x · ln 10'], 'Vi bruker lg y = ln y / ln 10 to ganger.'),
        ],
      },
    ],
  };

  // ================================================================
  // 1D Logaritme- og eksponentiallikninger
  // ================================================================
  const r1d = {
    id: 'r1d', title: '1D Logaritme- og eksponentiallikninger',
    color: '#ce82ff', dark: '#a568cc',
    goal: 'Løse logaritmelikninger og eksponentiallikninger uten og med hjelpemidler, og bruke halveringsmetoden. Uke 35.',
    guide: [
      ['Logaritmelikninger', 'lg x = a ⇔ x = 10ᵃ\nln x = a ⇔ x = eᵃ\nlg x = lg a ⇔ x = a\nKontroller alltid at logaritmene er definert (argumentet må være positivt).'],
      ['Andregradslikninger', '(lg x)² − 3 lg x + 2 = 0\nBruk abc-formelen med lg x som ukjent:\nlg x = 1 ∨ lg x = 2\nTilsvarende med eˣ eller 10ˣ som ukjent. Husk at eˣ > 0 og 10ˣ > 0 for alle x.'],
      ['Eksponentiallikninger', 'Samme grunntall: aˣ = aᵇ ⇔ x = b.\n10ˣ = b ⇔ x = lg b\neˣ = b ⇔ x = ln b\naˣ = b ⇔ x = lg b / lg a = ln b / ln a'],
      ['Halveringsmetoden', 'Løser f(x) = 0 numerisk. Start med [a, b] der f(a) og f(b) har motsatt fortegn.\n1: m = (a + b)/2\n2: Er f(m) ≈ 0, er vi ferdige.\n3: Er f(a) · f(m) < 0, fortsett med [a, m], ellers med [m, b].'],
    ],
    skills: [
      {
        id: 'r1d0', title: 'Formler: likninger',
        items: [
          fx('Formel', 'Hva er løsningen av ln x = a?', ['x = eᵃ', 'x = 10ᵃ', 'x = ln a', 'x = a/e'], 'Definisjonen av ln.'),
          fx('Formel', 'Hva er løsningen av 10ˣ = b?', ['x = lg b', 'x = ln b', 'x = b/10', 'x = 10ᵇ'], 'Ta lg på begge sider.'),
          fx('Formel', 'Hva er løsningen av 3ˣ = 5?', ['x = lg 5 / lg 3', 'x = lg 5 − lg 3', 'x = 5/3', 'x = lg (5/3)'], 'x · lg 3 = lg 5.'),
          tf('10 rette eller gale 8', '3ˣ = 81 ⇔ x = 4', true, '81 = 3⁴.'),
          tf('10 rette eller gale 9', 'Likningen lg x² = 4 har løsningsmengde L = {100}.', false, 'x² = 10⁴ gir x = ±100. Begge passer, så L = {−100, 100}.'),
          tf('10 rette eller gale 10', 'Likningen (lg x)² = 4 har løsningsmengde L = {1/100, 100}.', true, 'lg x = ±2 gir x = 10² eller x = 10⁻².'),
          tf('Formel', 'Likningen 10ˣ = −2 har ingen løsning.', true, '10ˣ > 0 for alle x.'),
          mc('Formel', 'I halveringsmetoden er f(a) · f(m) < 0. Hvor ligger nullpunktet?', ['I intervallet [a, m]', 'I intervallet [m, b]', 'Akkurat i m', 'Utenfor [a, b]'], 'f skifter fortegn mellom a og m.'),
        ],
      },
      {
        id: 'r1d1', title: '1D I timen',
        items: [
          N('1.59 a', 'Løs lg x = 3.', 1000, 'x = 10³.', U),
          mc('1.59 b', 'Løs ln x = 1.', ['L = {e}', 'L = {1}', 'L = {10}', 'L = {0}'], 'x = e¹.', U),
          mc('1.59 c', 'Løs ln x + 3 = 1.', ['L = {e⁻²}', 'L = {e²}', 'L = {e⁴}', 'L = {−2}'], 'ln x = −2.', U),
          N('1.59 d', 'Løs lg x = 0.', 1, 'x = 10⁰.', U),
          N('1.60 a', 'Løs ln 2x = 0.', 0.5, '2x = e⁰ = 1.', U),
          N('1.60 b', 'Løs lg (x + 3) = 2.', 97, 'x + 3 = 100.', U),
          mc('1.60 c', 'Løs ln x³ = 6.', ['L = {e²}', 'L = {e⁶}', 'L = {2}', 'L = {e³}'], '3 ln x = 6, så ln x = 2.', U),
          N('1.60 d', 'Løs lg (x − 4) = 3.', 1004, 'x − 4 = 1000.', U),
          N('1.62 a', 'Løs lg x = lg 3.', 3, 'lg x = lg a ⇔ x = a.', U),
          N('1.62 b', 'Løs ln x = 4 ln 2.', 16, '4 ln 2 = ln 2⁴ = ln 16.', U),
          N('1.62 c', 'Løs lg 3x = 2 lg 3.', 3, 'lg 3x = lg 9, så 3x = 9.', U),
          mc('1.63 a', 'Løs ln (8 − 2x) = ln x.', ['L = {8/3}', 'L = {4}', 'L = {8}', 'L = {2}'], '8 − 2x = x gir x = 8/3. Kontroll: begge sider er definert.', U),
          N('1.63 b', 'Løs lg x + lg (x + 3) = 1.', 2, 'x(x + 3) = 10 gir x = 2 eller x = −5. x = −5 forkastes fordi lg x ikke er definert.', U),
          mc('1.63 c', 'Løs lg (6 − 2x) − lg x = 2.', ['L = {1/17}', 'L = {3}', 'L = {17}', 'L = {6/102}'], '(6 − 2x)/x = 100 gir 6 = 102x, x = 1/17.', U),
          mc('1.64 a', 'Løs lg x² = 6.', ['L = {−1000, 1000}', 'L = {1000}', 'L = {100}', 'L = {10³, 10⁻³}'], 'x² = 10⁶. Husk den negative løsningen.'),
          mc('1.64 b', 'Løs ln x³ = 6.', ['L = {e²}', 'L = {e⁶}', 'L = {−e², e²}', 'L = {2}'], 'x³ = e⁶ har bare én løsning.'),
          N('1.64 c', 'Løs lg x⁵ + lg (100/x) = 6.', 10, '5 lg x + 2 − lg x = 6, så 4 lg x = 4.'),
          mc('1.65 a', 'Løs (lg x)² − 2 lg x − 3 = 0.', ['L = {1/10, 1000}', 'L = {−1, 3}', 'L = {10, 1000}', 'L = {1000}'], 'lg x = −1 ∨ lg x = 3.'),
          mc('1.65 b', 'Løs 10 ln x − (ln x)² = −11.', ['L = {1/e, e¹¹}', 'L = {−1, 11}', 'L = {e, e¹¹}', 'L = {e¹¹}'], '(ln x)² − 10 ln x − 11 = 0 gir ln x = −1 ∨ ln x = 11.'),
          mc('1.65 c', 'Løs (lg x)² − 2 lg x − 15 = 0.', ['L = {1/1000, 100 000}', 'L = {−3, 5}', 'L = {1000, 100 000}', 'L = {100 000}'], 'lg x = −3 ∨ lg x = 5.'),
          N('1.66 a', 'Løs 9ˣ = 81.', 2, '81 = 9².', U),
          N('1.66 b', 'Løs eˣ = √e.', 0.5, '√e = e^(1/2).', U),
          N('1.66 c', 'Løs 3ˣ = 1/81.', -4, '1/81 = 3⁻⁴.', U),
          mc('1.66 d', 'Løs 4^(x²) = 4.', ['L = {−1, 1}', 'L = {1}', 'L = {2}', 'L = {0, 1}'], 'x² = 1.', U),
          N('1.67 a', 'Løs 10^(2x − 1) = 1000.', 2, '2x − 1 = 3.', U),
          mc('1.67 b', 'Løs 3^(x² + x) = 1.', ['L = {−1, 0}', 'L = {0}', 'L = {1}', 'L = {0, 1}'], 'x² + x = 0, altså x(x + 1) = 0.', U),
          N('1.67 c', 'Løs (1/2)ˣ = 1/16.', 4, '1/16 = (1/2)⁴.', U),
          N('1.67 d', 'Løs 3 · 4^(x + 1) = 192.', 2, '4^(x + 1) = 64 = 4³.', U),
          mc('1.72 a', 'Løs 10^(2x) − 3 · 10ˣ = 0.', ['L = {lg 3}', 'L = {0, lg 3}', 'L = {3}', 'L = {lg 3 / 2}'], '10ˣ(10ˣ − 3) = 0. 10ˣ = 0 gir ingen løsning.', U),
          mc('1.72 b', 'Løs 3eˣ − 2e^(2x) = 0.', ['L = {ln (3/2)}', 'L = {ln 3 − 2}', 'L = {3/2}', 'L = {0, ln (3/2)}'], 'eˣ(3 − 2eˣ) = 0 gir eˣ = 3/2.', U),
          mc('1.72 c', 'Løs 3^(2x) − 5 · 3ˣ = 0.', ['L = {ln 5 / ln 3}', 'L = {5/3}', 'L = {ln 5}', 'L = {0, ln 5 / ln 3}'], '3ˣ = 5 gir x = ln 5 / ln 3.', U),
          mc('1.73 a', 'Løs 10^(2x) − 2 · 10ˣ − 8 = 0.', ['L = {2 lg 2}', 'L = {lg 4, lg (−2)}', 'L = {4}', 'L = {lg 2}'], '10ˣ = 4 ∨ 10ˣ = −2. Bare 10ˣ = 4 gir løsning: x = lg 4 = 2 lg 2.', U),
          N('1.73 b', 'Løs 3^(2x) − 2 · 3ˣ − 3 = 0.', 1, '3ˣ = 3 ∨ 3ˣ = −1. Bare 3ˣ = 3 gir løsning.', U),
          N('1.73 c', 'Løs eˣ + 1 = 2e⁻ˣ.', 0, 'Gang med eˣ: (eˣ)² + eˣ − 2 = 0 gir eˣ = 1 ∨ eˣ = −2.', U),
        ],
      },
      {
        id: 'r1d2', title: '1D Lekser',
        items: [
          mc('1.61 1', 'Løs 6 ln x − 2 = 1.', ['L = {√e}', 'L = {e³}', 'L = {e/2}', 'L = {e²}'], 'ln x = 1/2, så x = e^(1/2).'),
          mc('1.61 2', 'Løs lg (x − 2) · (lg x − 2) = 0.', ['L = {3, 100}', 'L = {2, 100}', 'L = {3}', 'L = {100}'], 'lg (x − 2) = 0 gir x = 3, og lg x = 2 gir x = 100.'),
          N('1.68 a', 'Bruk graftegner og løs 3 · 2^(x − 1) = 17.', 3.5, 'Skjæringspunktet er x ≈ 3,5.', T(0.02)),
          N('1.68 b', 'Bruk graftegner og løs 3 · 5ˣ = 7 · 2ˣ.', 0.92, 'Skjæringspunktet er x ≈ 0,92.', T(0.02)),
          N('1.68 c', 'Bruk graftegner og løs eˣ = 12 + e⁻ˣ.', 2.5, 'Skjæringspunktet er x ≈ 2,5.', T(0.02)),
          mc('1.69 a', 'Løs eˣ = 4.', ['L = {ln 4}', 'L = {lg 4}', 'L = {e⁴}', 'L = {4/e}'], 'Ta ln på begge sider.', U),
          mc('1.69 b', 'Løs 10ˣ = 6.', ['L = {lg 6}', 'L = {ln 6}', 'L = {0,6}', 'L = {10⁶}'], 'Ta lg på begge sider.', U),
          mc('1.69 c', 'Løs 3ˣ = 2.', ['L = {ln 2 / ln 3}', 'L = {ln 3 / ln 2}', 'L = {2/3}', 'L = {ln (2/3)}'], 'x ln 3 = ln 2.', U),
          mc('1.69 d', 'Løs 10^(3x) = 6.', ['L = {lg 6 / 3}', 'L = {lg 2}', 'L = {3 lg 6}', 'L = {lg 3}'], '3x = lg 6.', U),
          mc('1.70 a1', 'Løs eksakt: 10^(3x) = 8.', ['L = {lg 2}', 'L = {lg 8}', 'L = {8/3}', 'L = {ln 2}'], '3x = lg 8 = 3 lg 2.'),
          mc('1.70 a2', 'Løs eksakt: e^(x²) = 5.', ['L = {−√(ln 5), √(ln 5)}', 'L = {√(ln 5)}', 'L = {ln √5}', 'L = {±ln 5}'], 'x² = ln 5.'),
          mc('1.70 a3', 'Løs eksakt: 4^(x + 1) = 7.', ['L = {ln 7 / ln 4 − 1}', 'L = {ln 7 / ln 4}', 'L = {ln (7/4) − 1}', 'L = {7/4 − 1}'], 'x + 1 = ln 7 / ln 4.'),
          mc('1.70 a4', 'Løs eksakt: 5e^(3x) − 9 = 1.', ['L = {ln 2 / 3}', 'L = {ln 10 / 3}', 'L = {ln 2}', 'L = {3 ln 2}'], 'e^(3x) = 2.'),
          N('1.70 b1', 'Løs 10^(3x) = 8 med CAS. Rund av til to desimaler.', 0.3, 'x = lg 2 ≈ 0,30.', T(0.02)),
          N('1.70 b2', 'Løs e^(x²) = 5 med CAS. Oppgi den positive løsningen med to desimaler.', 1.27, 'x = √(ln 5) ≈ 1,27.', T(0.01)),
          N('1.70 b3', 'Løs 4^(x + 1) = 7 med CAS. Rund av til to desimaler.', 0.4, 'x ≈ 0,40.', T(0.03)),
          N('1.70 b4', 'Løs 5e^(3x) − 9 = 1 med CAS. Rund av til to desimaler.', 0.23, 'x = ln 2/3 ≈ 0,23.', T(0.02)),
          N('1.71 a', 'Bruk tabellen (lg 2 = 0,30, lg 4 = 0,60, lg 5 = 0,70) og løs 10^(2x) = 4.', 0.3, '2x = lg 4 = 0,60.', { u: true, tol: 0.02 }),
          N('1.71 b', 'Bruk tabellen (lg 2 = 0,30, lg 4 = 0,60, lg 5 = 0,70) og løs 5ˣ = 16.', 1.71, 'x = lg 16 / lg 5 = 4 · 0,30 / 0,70.', { u: true, tol: 0.01 }),
          N('1.71 c', 'Bruk tabellen (lg 2 = 0,30, lg 4 = 0,60) og løs 2 · 10^(3x) − 1 = 7.', 0.2, '10^(3x) = 4, så 3x = 0,60.', { u: true, tol: 0.02 }),
          N('1.74 a', 'Løs lg (x + 2) = 2 − x med halveringsmetoden (tre desimaler).', 1.461, 'x ≈ 1,461.', T(0.001)),
          N('1.74 b', 'Løs 350 · 1,2ˣ = 756 med halveringsmetoden (tre desimaler).', 4.224, 'x ≈ 4,224.', T(0.001)),
          code('1.74', 'I halveringsmetoden: Hva skal stå på linjen merket ???', 'while abs(f(m)) >= noyaktighet:\n  if f(a)*f(m) < 0:\n    ???\n  else:\n    a = m\n  m = (a + b)/2', ['b = m', 'a = m', 'm = b', 'b = a'], 'Har f(a) og f(m) motsatt fortegn, ligger nullpunktet i [a, m]. Da flytter vi b til m.'),
          mc('1.75 b', 'Likningen 0,5x³ = 2x² − 1 har tre løsninger. Hva er de?', ['x ≈ −0,655, x ≈ 0,789 og x ≈ 3,866', 'x ≈ −1, x ≈ 1 og x ≈ 4', 'x ≈ −0,655 og x ≈ 3,866', 'x ≈ 0,789, x ≈ 1,5 og x ≈ 3,866'], 'Halveringsmetoden brukt på tre intervaller, ett rundt hver løsning.'),
          mc('1.75 c', 'Hva skjer hvis du starter halveringsmetoden med et intervall som inneholder alle tre løsningene?', ['Metoden finner bare én av løsningene', 'Den finner alle tre', 'Den finner gjennomsnittet av løsningene', 'Programmet stopper alltid med feil'], 'Hvert steg velger bare én halvdel, så vi ender opp ved ett nullpunkt.'),
        ],
      },
      {
        id: 'r1d3', title: '1D E1 (ekstra)', optional: true,
        items: [
          N('1.76 a', 'Løs lg x = 3.', 1000, 'x = 10³.', U),
          N('1.76 b', 'Løs lg 2x = 4.', 5000, '2x = 10 000.', U),
          mc('1.76 c', 'Løs eˣ = 3.', ['L = {ln 3}', 'L = {e³}', 'L = {lg 3}', 'L = {3/e}'], 'x = ln 3.', U),
          N('1.76 d', 'Løs 2ˣ = √2.', 0.5, '√2 = 2^(1/2).', U),
          mc('1.77 a', 'Løs ln (x − 2) = 2.', ['L = {e² + 2}', 'L = {e²}', 'L = {e² − 2}', 'L = {4}'], 'x − 2 = e².', U),
          mc('1.77 b', 'Løs 4^(3x) + 7 = 23.', ['L = {2/3}', 'L = {2}', 'L = {16/3}', 'L = {3/2}'], '4^(3x) = 16 = 4², så 3x = 2.', U),
          mc('1.77 c', 'Løs e^(2x) − 2eˣ = 0.', ['L = {ln 2}', 'L = {0, ln 2}', 'L = {2}', 'L = {ln 2 / 2}'], 'eˣ(eˣ − 2) = 0.', U),
          mc('1.77 d', 'Løs 10^(2x) + 10ˣ − 6 = 0.', ['L = {lg 2}', 'L = {lg 2, lg 3}', 'L = {lg 3}', 'L = {2}'], '10ˣ = 2 ∨ 10ˣ = −3.', U),
          mc('1.78 a', 'Løs lg x² = 2.', ['L = {−10, 10}', 'L = {10}', 'L = {100}', 'L = {−100, 100}'], 'x² = 100.', U),
          mc('1.78 b', 'Løs ln x³ − ln x = 8.', ['L = {e⁴}', 'L = {e⁸}', 'L = {±e⁴}', 'L = {4}'], '2 ln x = 8. x må være positiv.', U),
          mc('1.78 c', 'Løs 5^(x² − 4x + 5) = 25.', ['L = {1, 3}', 'L = {3}', 'L = {−1, 3}', 'L = {1}'], 'x² − 4x + 5 = 2, altså x² − 4x + 3 = 0.', U),
          N('1.78 d', 'Løs lg x + lg (x + 3) = 1.', 2, 'x² + 3x − 10 = 0. x = −5 forkastes.', U),
          mc('1.79 a', 'Folketallet er 13 500 og vokser med 2,5 % per år. Hvilken likning gir tiden x det tar før folketallet er 15 000?', ['13 500 · 1,025ˣ = 15 000', '13 500 · 0,025ˣ = 15 000', '13 500 · 2,5ˣ = 15 000', '13 500 + 0,025x = 15 000'], 'Vekstfaktoren er 1 + 2,5/100 = 1,025.'),
          N('1.79 b', 'Løs likningen 13 500 · 1,025ˣ = 15 000. Svar i år med én desimal.', 4.3, 'x = ln (15 000/13 500) / ln 1,025 ≈ 4,3.', T(0.02)),
          code('1.79 d', 'Du løser 13 500 · 1,025ˣ = 15 000 med halveringsmetoden. Hva skal funksjonen returnere?', 'def f(x):\n    return ???', ['13500*1.025**x - 15000', '13500*1.025*x - 15000', '13500*1.025**x', '15000 - 13500*0.025**x'], 'Halveringsmetoden finner nullpunkter, så vi flytter alt over på én side.'),
        ],
      },
      {
        id: 'r1d4', title: '1D E2 (ekstra)', optional: true,
        items: [
          mc('1.80 a', 'Løs 3(ln x)² − 2 ln x − 1 = 0.', ['L = {e^(−1/3), e}', 'L = {−1/3, 1}', 'L = {e}', 'L = {e^(1/3), e}'], 'ln x = 1 ∨ ln x = −1/3.', U),
          mc('1.80 b', 'Løs 2 lg (2x − 5) = lg 4 + lg x².', ['L = ∅', 'L = {5/4}', 'L = {−5/4, 5/4}', 'L = {5}'], '(2x − 5)² = 4x² gir x = 5/4, men da er 2x − 5 < 0. Ingen løsning.', U),
          mc('1.80 c', 'Løs (5 − 2ˣ)(2^(2x) − 4) = 0.', ['L = {1, ln 5 / ln 2}', 'L = {1}', 'L = {±1, ln 5 / ln 2}', 'L = {2, ln 5 / ln 2}'], '2ˣ = 5 ∨ 2^(2x) = 4. Den siste gir 2x = 2.', U),
          N('1.81 a', 'Løs ln (x + 2) + ln (x − 2) = ln 21.', 5, 'x² − 4 = 21 gir x = ±5. x = −5 forkastes.', U),
          mc('1.81 b', 'Løs lg (2 − eˣ) − lg (1 + eˣ) = lg (2eˣ).', ['L = {−ln 2}', 'L = {ln 2}', 'L = {0}', 'L = ∅'], '2 − eˣ = 2eˣ(1 + eˣ) gir 2(eˣ)² + 3eˣ − 2 = 0, eˣ = 1/2.', U),
          N('1.81 c', 'Løs e^(2x) − e^(x + 1) = 0.', 1, 'eˣ(eˣ − e) = 0, så eˣ = e.', U),
          mc('1.82 a', 'Løs 3 · 2^(x − 1) = 4 eksakt.', ['L = {(3 lg 2 − lg 3) / lg 2}', 'L = {lg (4/3) / lg 2}', 'L = {(lg 4 − lg 3) / lg 2 − 1}', 'L = {lg 4 / lg 6}'], '2^(x − 1) = 4/3 gir x = 1 + (2 lg 2 − lg 3)/lg 2.'),
          N('1.82 b', 'Bruk tabellen (lg 2 = 0,30, lg 3 = 0,48) og finn en tilnærmet løsning på 3 · 2^(x − 1) = 4.', 1.4, '(3 · 0,30 − 0,48)/0,30 = 1,4.', { u: true, tol: 0.03 }),
          N('1.83 a', 'Konsentrasjonen går fra 3,00 til 2,35 mg/mL på 12 minutter. Hvor mange prosent avtar den per minutt?', 2.0, 'Vekstfaktor (2,35/3,00)^(1/12) ≈ 0,980, altså 2,0 % nedgang per minutt.', T(0.03)),
          N('1.83 b', 'Hvor mange minutter tar det før konsentrasjonen er 0,80 mg/mL?', 65, '3,00 · 0,980ᵗ = 0,80 gir t ≈ 65 minutter.', T(0.03)),
        ],
      },
    ],
  };

  // ================================================================
  // 1E Generelle logaritmer
  // ================================================================
  const r1e = {
    id: 'r1e', title: '1E Generelle logaritmer',
    color: '#00b8a9', dark: '#00897e',
    goal: 'Regne med logaritmer med vilkårlig grunntall, skifte grunntall og løse generelle logaritme- og eksponentiallikninger. Uke 35.',
    guide: [
      ['Definisjon', 'log_n p er tallet vi må opphøye n i for å få p: n^(log_n p) = p.\nn og p er positive, og n ≠ 1.\nlog_n nᵏ = k\nlog_n n = 1\nlog_n 1 = 0\nGeoGebra: log(n, p). Python: math.log(p, n).'],
      ['Logaritmesetningene', 'log_n ab = log_n a + log_n b\nlog_n (a/b) = log_n a − log_n b\nlog_n aᵇ = b · log_n a'],
      ['Bytte grunntall', 'log_n x = lg x / lg n = ln x / ln n\nVi oppgir vanligvis svar med lg eller ln.'],
      ['Likninger', 'log_n x = a ⇔ x = nᵃ\nnˣ = b ⇔ x = log_n b'],
    ],
    skills: [
      {
        id: 'r1e0', title: 'Formler: generelle logaritmer',
        items: [
          fx('Formel', 'Hva er log₂ 8?', ['3', '4', '16', '1/3'], '2³ = 8.'),
          fx('Formel', 'Hva er log_n 1?', ['0', '1', 'n', 'Ikke definert'], 'n⁰ = 1.'),
          fx('Formel', 'Hvordan regner du ut log₇ 45 på kalkulator?', ['ln 45 / ln 7', 'ln 45 − ln 7', 'ln (45/7)', '7 · ln 45'], 'log_n x = ln x / ln n.'),
          tf('10 rette eller gale 5', 'log₂ 16 = 4', true, '2⁴ = 16.'),
          match('Formel', [['log₂ 16', '4'], ['log₃ (1/9)', '−2'], ['log₄ 2', '1/2'], ['2^(log₂ 3)', '3']], 'Koble uttrykket med verdien'),
        ],
      },
      {
        id: 'r1e1', title: '1E I timen',
        items: [
          N('1.84 a', 'Regn ut 6^(log₆ 9).', 9, 'n^(log_n p) = p.', U),
          N('1.84 b', 'Regn ut 4^(log₄ 0,7).', 0.7, 'n^(log_n p) = p.', U),
          N('1.84 c', 'Regn ut log₃ 27.', 3, '27 = 3³.', U),
          N('1.84 d', 'Regn ut log₅ (1/125).', -3, '1/125 = 5⁻³.', U),
          N('1.84 e', 'Regn ut log₅ √5.', 0.5, '√5 = 5^(1/2).', U),
          mc('1.87 a', 'Forenkle: log₅ (25/x²) + log₅ 5x³', ['log₅ x + 3', '5 log₅ x + 3', 'log₅ x + 2', '3 log₅ x'], '(2 − 2 log₅ x) + (1 + 3 log₅ x).'),
          mc('1.87 b', 'Forenkle: log₃ (3a/b) + log₃ (9/(ab⁻²))', ['log₃ b + 3', 'log₃ b + 2', '3 log₃ b', 'log₃ a + 3'], '(1 + log₃ a − log₃ b) + (2 − log₃ a + 2 log₃ b).'),
          N('1.88 a', 'Løs log₂ x = 3.', 8, 'x = 2³.', U),
          N('1.88 b', 'Løs log₃ (x − 2) = 2.', 11, 'x − 2 = 9.', U),
          mc('1.88 c', 'Løs log₄ x² = 2.', ['L = {−4, 4}', 'L = {4}', 'L = {16}', 'L = {2}'], 'x² = 16.', U),
          mc('1.88 d', 'Løs (log₂ x)² = 16.', ['L = {1/16, 16}', 'L = {16}', 'L = {−16, 16}', 'L = {1/4, 4}'], 'log₂ x = ±4.', U),
        ],
      },
      {
        id: 'r1e2', title: '1E Lekser',
        items: [
          N('1.85 a', 'Regn ut log₂ 7 med to desimaler.', 2.81, 'ln 7 / ln 2 ≈ 2,81.', T(0.003)),
          N('1.85 b', 'Regn ut log₃ 4 med to desimaler.', 1.26, 'ln 4 / ln 3 ≈ 1,26.', T(0.004)),
          N('1.85 c', 'Regn ut log₇ 45 med to desimaler.', 1.96, 'ln 45 / ln 7 ≈ 1,96.', T(0.003)),
          code('1.85', 'Hvilket program regner ut log₂ 7?', null, ['import math\nprint(math.log(7, 2))', 'import math\nprint(math.log(2, 7))', 'import math\nprint(math.log(7) * math.log(2))', 'import math\nprint(math.log10(7))'], 'math.log(x, n) gir log_n x. Tallet etter kommaet er grunntallet.'),
          mc('1.86 a', 'Forenkle: log₂ x² − log₂ x', ['log₂ x', '2', 'log₂ 2x', 'x'], '2 log₂ x − log₂ x.'),
          mc('1.86 b', 'Forenkle: log₂ ab − log₂ 2a', ['log₂ b − 1', 'log₂ b', 'log₂ (b/2) + 1', '1 − log₂ b'], '(log₂ a + log₂ b) − (1 + log₂ a).'),
          N('1.86 c', 'Forenkle: log₂ 2x + log₂ (4/x)', 3, 'log₂ (2x · 4/x) = log₂ 8.'),
        ],
      },
      {
        id: 'r1e3', title: '1E E1 (ekstra)', optional: true,
        items: [
          N('1.89 a', 'Regn ut log₃ 3⁷.', 7, 'log_n nᵏ = k.', U),
          N('1.89 b', 'Regn ut 5^(log₅ 2).', 2, 'n^(log_n p) = p.', U),
          N('1.89 c', 'Regn ut log₂ 2³ − log₃ 3².', 1, '3 − 2.', U),
          N('1.89 d', 'Regn ut lg 100 − log₃ 1.', 2, '2 − 0.', U),
          mc('1.90 a', 'Forenkle: log₂ ab − log₂ (a/b)', ['2 log₂ b', '2 log₂ a', 'log₂ b', '0'], '(log₂ a + log₂ b) − (log₂ a − log₂ b).'),
          mc('1.90 b', 'Forenkle: log₃ 3a + log₃ (9/a²)', ['3 − log₃ a', '3 + log₃ a', '2 − log₃ a', '3 log₃ a'], '(1 + log₃ a) + (2 − 2 log₃ a).'),
          mc('1.90 c', 'Forenkle: log₄ a⁴ − log₄ (a³/16)', ['log₄ a + 2', 'log₄ a − 2', '7 log₄ a + 2', 'log₄ a'], '4 log₄ a − (3 log₄ a − 2).'),
          N('1.91 a', 'Løs 5 log₃ x = 20.', 81, 'log₃ x = 4, så x = 3⁴.', U),
          N('1.91 b', 'Løs 12 log₅ 2x − 4 = 20.', 12.5, 'log₅ 2x = 2, så 2x = 25.', U),
          mc('1.91 c', 'Løs (log₇ x)² = 4.', ['L = {1/49, 49}', 'L = {49}', 'L = {−49, 49}', 'L = {1/7, 7}'], 'log₇ x = ±2.', U),
          N('1.92', 'Bruk grafen til 2ˣ og finn log₂ 3 med to desimaler.', 1.58, 'Løs 2ˣ = 3 grafisk: x ≈ 1,58.', T(0.01)),
        ],
      },
      {
        id: 'r1e4', title: '1E E2 (ekstra)', optional: true,
        items: [
          mc('1.93 a', 'Skriv så enkelt som mulig: log₄ 16ˣ', ['2x', '16x', '4x', 'x²'], '16ˣ = 4^(2x).', U),
          N('1.93 b', 'Regn ut log₃ (1/81).', -4, '1/81 = 3⁻⁴.', U),
          mc('1.93 c', 'Regn ut log₂ ∛(2⁵).', ['5/3', '3/5', '15', '5'], '∛(2⁵) = 2^(5/3).', U),
          N('1.93 d', 'Regn ut log₂ 12 − log₂ 3.', 2, 'log₂ 4.', U),
          N('1.94 a', 'Løs log₂ x² − log₂ x = 4.', 16, 'log₂ x = 4.', U),
          mc('1.94 b', 'Løs (log₂ x)² − 2 log₂ x = 3.', ['L = {1/2, 8}', 'L = {8}', 'L = {−1, 3}', 'L = {2, 8}'], 'log₂ x = 3 ∨ log₂ x = −1.', U),
          mc('1.94 c', 'Løs log₃ x · (log₃ x − log₃ 2) = 0.', ['L = {1, 2}', 'L = {2}', 'L = {0, 2}', 'L = {1}'], 'log₃ x = 0 gir x = 1, og log₃ x = log₃ 2 gir x = 2.', U),
          N('1.95 a', 'Skriv 1,35 som 2ˣ. Hva er x (tre desimaler)?', 0.433, 'x = log₂ 1,35 ≈ 0,433.', T(0.003)),
          N('1.95 b', 'Skriv 1,35 som 5ˣ. Hva er x (tre desimaler)?', 0.186, 'x = log₅ 1,35 ≈ 0,186.', T(0.006)),
          ord('1.96', 'Løs 1/log₂ x + 1/log₃ x + 1/log₄ x = 1.', ['1/log_b x = log_x b, så likningen blir log_x 2 + log_x 3 + log_x 4 = 1', 'log_x (2 · 3 · 4) = 1', 'log_x 24 = 1', 'x = 24'], ['x = 9'], 'Vi bruker regelen log_x b = 1/log_b x og 1. logaritmesetning.'),
        ],
      },
    ],
  };

  // ================================================================
  // Blandede oppgaver s. 54–59
  // ================================================================
  const r1m = {
    id: 'r1m', title: 'Blandede oppgaver kap. 1',
    color: '#2b70c9', dark: '#1f5aa3',
    goal: 'Repetisjon og eksamenstrening: Blandede oppgaver s. 54–59 (1.97–1.127). Uke 35.',
    guide: [
      ['Sammendrag kap. 1', 'Røtter:\n(ⁿ√a)ⁿ = a\na^(t/n) = ⁿ√(aᵗ)\nLogaritmer:\n10^(lg p) = p\ne^(ln p) = p\nn^(log_n p) = p\nSetningene:\nlog ab = log a + log b\nlog (a/b) = log a − log b\nlog aᵇ = b log a\nlog_n x = lg x / lg n = ln x / ln n\nLikninger:\nlog_n x = a ⇔ x = nᵃ\nnˣ = b ⇔ x = log_n b'],
      ['Eksponentiell vekst', 'f(x) = a · bˣ\na er startverdien\nb = 1 + p/100 er vekstfaktoren\nNy verdi = gammel verdi · vekstfaktorⁿ.'],
    ],
    skills: [
      {
        id: 'r1m1', title: 'Potenser og logaritmer (1.97–1.105)',
        items: [
          N('1.97 a', 'Skriv så enkelt som mulig: ln e³', 3, 'ln eᵏ = k.', U),
          N('1.97 b', 'Skriv så enkelt som mulig: lg 10 + ln 1', 1, '1 + 0.', U),
          N('1.97 c', 'Skriv så enkelt som mulig: lg 1000 − lg 0,1', 4, '3 − (−1).', U),
          N('1.97 d', 'Skriv så enkelt som mulig: log₄ 4⁵ − 4^(log₄ 5)', 0, '5 − 5.', U),
          N('1.98 a', 'Regn ut log₄ 16.', 2, '4² = 16.', U),
          N('1.98 b', 'Regn ut log₃ 27.', 3, '3³ = 27.', U),
          N('1.98 c', 'Regn ut log₂ √2.', 0.5, '√2 = 2^(1/2).', U),
          N('1.98 d', 'Regn ut lg (1/1000).', -3, '10⁻³.', U),
          mc('1.98 e', 'Regn ut ln ∛(e²).', ['2/3', '3/2', '6', '2'], 'e^(2/3).', U),
          ord('1.99', 'Skriv tallene i stigende rekkefølge.', ['⁵√−1', 'log₂ 2', '¹⁰√(4⁵)', '(√2)⁴', '16^(3/4)', '81^(1/2)'], [], 'Verdiene er −1, 1, 2, 4, 8 og 9.', U),
          mc('1.100 a', 'Skriv så enkelt som mulig: √2 · ∛2 · ∛(2²)', ['2√2', '2', '4', '√8 · ∛2'], '∛2 · ∛4 = ∛8 = 2, og 2 · √2 = 2√2.', U),
          mc('1.100 b', 'Skriv så enkelt som mulig: √8 · ∛8 · ⁴√8', ['8 · ⁴√2', '8', '8√2', '16'], '8^(13/12) = 8 · 8^(1/12) = 8 · 2^(1/4).', U),
          mc('1.100 c', 'Skriv så enkelt som mulig: a · ∛(a⁵) · 1/∛(a²)', ['a²', 'a', 'a³', 'a^(4/3)'], 'a^(1 + 5/3 − 2/3) = a².', U),
          mc('1.100 d', 'Skriv så enkelt som mulig: ∛(n³/8)', ['n/2', 'n/8', 'n³/2', '2n'], '∛(n³) / ∛8 = n/2.', U),
          match('1.101', [['lg 0,001', 'B (−3)'], ['ln 1', 'E (0)'], ['2^(log₂ 0,5)', 'G (0,5)'], ['10^(2 lg 2)', 'I (4)']], 'Koble tallet med punktet på tallinja', U),
          mc('1.101', 'Hvilket punkt svarer lg 100 000 til (tallinja går fra −4 til 5)?', ['J (5)', 'I (4)', 'H (1)', 'A (−4)'], 'lg 10⁵ = 5.', U),
          mc('1.102 a', 'a og b er positive. Hvilket symbol skal stå mellom «lg aᵇ = c» og «b lg a = c»?', ['⇔', '⇒', '⇐'], '3. logaritmesetning gjelder begge veier når a > 0.'),
          mc('1.102 b', 'a og b er positive. Hvilket symbol skal stå mellom «lg ab = c» og «lg a + lg b = c»?', ['⇔', '⇒', '⇐'], '1. logaritmesetning gjelder begge veier når a, b > 0.'),
          mc('1.103 a', 'Forenkle: ln x⁵ − 3 ln x² + ln 1', ['−ln x', 'ln x', '−x', '11 ln x'], '5 ln x − 6 ln x + 0.'),
          mc('1.103 b', 'Forenkle: log₃ (ab²) + 2 log₃ a³ − 2 log₃ (ab)', ['5 log₃ a', '5 log₃ a + 4 log₃ b', '7 log₃ a', '5 log₃ a − 2 log₃ b'], '(1 + 6 − 2) log₃ a + (2 − 2) log₃ b.'),
          mc('1.103 c', 'Forenkle: lg ab⁻⁵ + lg (b/a³) − 2 lg (a⁴ · b)', ['−10 lg a − 6 lg b', '−10 lg a − 4 lg b', '−6 lg a − 6 lg b', '10 lg a − 6 lg b'], '(1 − 3 − 8) lg a + (−5 + 1 − 2) lg b.'),
          mc('1.103 d', 'Forenkle: ln (x/e)² + 2 ln (e³ · x³)', ['8 ln x + 4', '8 ln x + 8', '6 ln x + 4', '8 ln x − 4'], '2(ln x − 1) + 2(3 + 3 ln x).'),
          mc('1.104 a', 'Skriv så enkelt som mulig: (lg x)² / lg x', ['lg x', '2', 'lg x²', '1'], '(lg x)² / lg x = lg x.', U),
          N('1.104 b', 'Skriv så enkelt som mulig: ln x² / ln x', 2, '2 ln x / ln x.', U),
          N('1.104 c', 'Skriv så enkelt som mulig: log₂ x³ / log₂ x', 3, '3 log₂ x / log₂ x.', U),
          N('1.105 a', 'Tabell: ln 2 = 0,69, ln 3 = 1,10, ln 4 = 1,39, ln 5 = 1,61. Finn ln 8.', 2.07, 'ln 8 = 3 ln 2.', { u: true, tol: 0.01 }),
          N('1.105 b', 'Tabell: ln 2 = 0,69, ln 3 = 1,10, ln 4 = 1,39, ln 5 = 1,61. Finn ln 12.', 2.49, 'ln 12 = ln 3 + ln 4.', { u: true, tol: 0.01 }),
          N('1.105 c', 'Tabell: ln 2 = 0,69, ln 3 = 1,10, ln 4 = 1,39, ln 5 = 1,61. Finn ln 2,5.', 0.92, 'ln 2,5 = ln 5 − ln 2.', { u: true, tol: 0.01 }),
        ],
      },
      {
        id: 'r1m2', title: 'Likninger og funksjoner (1.106–1.115)',
        items: [
          mc('1.106 a', 'Løs ln x = 3.', ['L = {e³}', 'L = {10³}', 'L = {3e}', 'L = {ln 3}'], 'x = e³.', U),
          N('1.106 b', 'Løs log₅ x = 2.', 25, 'x = 5².', U),
          mc('1.106 c', 'Løs lg x = n.', ['L = {10ⁿ}', 'L = {eⁿ}', 'L = {n/10}', 'L = {lg n}'], 'x = 10ⁿ.', U),
          mc('1.107 a', 'Løs 10ˣ = 5.', ['L = {lg 5}', 'L = {ln 5}', 'L = {0,5}', 'L = {5/10}'], 'x = lg 5.', U),
          mc('1.107 b', 'Løs eˣ = 3.', ['L = {ln 3}', 'L = {lg 3}', 'L = {e³}', 'L = {3/e}'], 'x = ln 3.', U),
          N('1.107 c', 'Løs 2ˣ = 8.', 3, '8 = 2³.', U),
          N('1.108 1', 'Løs lg x² + lg x = 0.', 1, '3 lg x = 0 (x > 0 for at lg x skal være definert).'),
          N('1.108 2', 'Løs 10^(x + 5) = 1000.', -2, 'x + 5 = 3.'),
          N('1.108 3', 'Løs log₃ (2 − x) = log₃ 3.', -1, '2 − x = 3.'),
          mc('1.109 a', 'Løs 2^(x² − x) = 64.', ['L = {−2, 3}', 'L = {3}', 'L = {2, −3}', 'L = {6}'], 'x² − x = 6.', U),
          N('1.109 b', 'Løs (lg x − lg 3) · lg (x − 3) = 0.', 4, 'lg x = lg 3 gir x = 3, men da er lg (x − 3) ikke definert. lg (x − 3) = 0 gir x = 4.', U),
          mc('1.109 c', 'Løs (3^(2x) − 2 · 3ˣ) / (3ˣ + 2) = 0.', ['L = {ln 2 / ln 3}', 'L = {0, ln 2 / ln 3}', 'L = {2/3}', 'L = {ln 3 / ln 2}'], 'Telleren 3ˣ(3ˣ − 2) = 0 gir 3ˣ = 2.', U),
          mc('1.110 a', 'Løs (lg x)² − 2 lg x = 0.', ['L = {1, 100}', 'L = {0, 2}', 'L = {100}', 'L = {1, 10}'], 'lg x (lg x − 2) = 0.'),
          mc('1.110 b', 'Løs (ln x)² − 2 ln x − 8 = 0.', ['L = {e⁻², e⁴}', 'L = {−2, 4}', 'L = {e⁴}', 'L = {e², e⁴}'], 'ln x = 4 ∨ ln x = −2.'),
          mc('1.110 c', 'Løs (log₂ x)² − 2 log₂ x − 8 = 0.', ['L = {1/4, 16}', 'L = {−2, 4}', 'L = {16}', 'L = {4, 16}'], 'log₂ x = 4 ∨ log₂ x = −2.'),
          mc('1.110 d', 'Løs eˣ − 2 − 8e⁻ˣ = 0.', ['L = {ln 4}', 'L = {ln 4, ln (−2)}', 'L = {4}', 'L = {ln 2}'], 'Gang med eˣ: (eˣ)² − 2eˣ − 8 = 0 gir eˣ = 4 ∨ eˣ = −2.'),
          mc('1.113 a', 'f(x) = lg x − 2. Hva er definisjonsmengden og verdimengden?', ['D_f = ⟨0, →⟩ og V_f = ℝ', 'D_f = ℝ og V_f = ⟨−2, →⟩', 'D_f = ⟨2, →⟩ og V_f = ℝ', 'D_f = ⟨0, →⟩ og V_f = ⟨−2, →⟩'], 'lg x er definert for x > 0 og kan ta alle verdier.', U),
          N('1.113 c', 'f(x) = lg x − 2. Finn nullpunktet.', 100, 'lg x = 2.', U),
          N('1.113 d', 'Løs lg x − 2 = 1.', 1000, 'lg x = 3.', U),
          mc('1.114 a', 'f(x) = 2 lg (x + 3). Hva er definisjonsmengden?', ['⟨−3, →⟩', '⟨0, →⟩', '[−3, →⟩', '⟨3, →⟩'], 'x + 3 > 0.', U),
          N('1.114 b', 'f(x) = 2 lg (x + 3) og lg 2 ≈ 0,30. Finn f(1).', 1.2, 'f(1) = 2 lg 4 = 4 lg 2.', U),
          N('1.114 b', 'f(x) = 2 lg (x + 3) og lg 2 ≈ 0,30. Finn f(−2,5).', -0.6, 'f(−2,5) = 2 lg 0,5 = −2 lg 2.', U),
          N('1.114 b', 'f(x) = 2 lg (x + 3) og lg 2 ≈ 0,30. Finn f(7).', 2, 'f(7) = 2 lg 10.', U),
          mc('1.114 d', 'Løs ulikheten 2 lg (x + 3) ≤ 1,4 grafisk.', ['L = ⟨−3, 2,01]', 'L = [−3, 2,01]', 'L = ⟨−∞, 2,01]', 'L = ⟨2,01, →⟩'], 'lg (x + 3) ≤ 0,7 gir x + 3 ≤ 10^0,7 ≈ 5,01. Husk at x > −3.'),
          mc('1.115', 'Ingrid, Silje og Martine løser 3 · 5ˣ = 7 · 2ˣ. Ingrid svarer log₂,₅ (7/3), Silje (lg 7 − lg 3)/(lg 5 − lg 2) og Martine ln (7/3)/ln (5/2). Hvem har rett?', ['Alle tre', 'Bare Silje', 'Bare Ingrid og Martine', 'Ingen'], '(5/2)ˣ = 7/3. Svarene er samme tall skrevet med ulike logaritmer.'),
        ],
      },
      {
        id: 'r1m3', title: 'Anvendelser og bevis (1.111–1.127)',
        items: [
          N('1.111 a', 'E = 200 − 50 lg p, og lg 2 ≈ 0,30. Hva er etterspørselen når prisen er 8 kr?', 155, '200 − 50 · 3 · 0,30 = 155 boller.', U),
          N('1.111 b', 'En bil til 400 000 kr taper 20 % av verdien per år. Hvor mange år tar det før den er verdt 40 % av prisen? (lg 2 ≈ 0,30)', 4, '0,8ˣ = 0,4 gir x = lg 0,4 / lg 0,8 = (0,60 − 1)/(0,90 − 1) = 4.', U),
          mc('1.112', 'En bil koster 780 000 kr og synker 20 % i verdi per år. Ola vil selge når den er verdt mellom 400 000 og 500 000 kr. Når bør han selge?', ['Når bilen er mellom 2 og 3 år gammel', 'Etter mellom 1 og 2 år', 'Etter mellom 3 og 4 år', 'Etter 5 år'], '780 000 · 0,8ˣ = 500 000 gir x ≈ 2,0, og = 400 000 gir x ≈ 3,0.'),
          ord('1.116', 'Vis at xˣ = e^(x ln x), for x > 0.', ['x = e^(ln x)', 'xˣ = (e^(ln x))ˣ', '= e^(x · ln x)'], ['= e^(ln x + x)'], 'Vi skriver x som en potens av e og bruker (aᵖ)^q = a^(pq).', U),
          N('1.117 a', 'L = k − 20 lg r. Lydstyrken er 51 dB 5,0 m fra høyttaleren. Bestem k.', 65, 'k = 51 + 20 lg 5 ≈ 65.', T(0.01)),
          N('1.117 b', 'L = 65 − 20 lg r. Hvor langt fra høyttaleren er lydstyrken 55 dB?', 3.2, '20 lg r = 10 gir r = 10^0,5 ≈ 3,2 m.', T(0.02)),
          N('1.117 c', 'Berit står dobbelt så langt unna som Aslak. Hvor mange dB er forskjellen? (eksakt: 20 lg 2)', 6, '20 lg 2r − 20 lg r = 20 lg 2 ≈ 6,0 dB.', T(0.02)),
          N('1.118', 'I = I₀ · e^(−0,17x). Hvor langt inn i betongen (cm) er intensiteten halvert?', 4.1, 'e^(−0,17x) = 1/2 gir x = ln 2 / 0,17 ≈ 4,1 cm.', T(0.02)),
          N('1.119', 'm = 16 ln h + 31. Hvilken «menneskealder» svarer en 4 år gammel labrador til?', 53.2, '16 ln 4 + 31 ≈ 53,2. Artikkelen sa 54 år, som stemmer omtrent.', T(0.01)),
          N('1.120 a', 'U(x) = (ln x)³ − 7 ln x + 6. Regn ut U(e).', 0, '1 − 7 + 6 = 0. Derfor går U(x) : (ln x − 1) opp.'),
          mc('1.120 b', 'Skriv U(x) = (ln x)³ − 7 ln x + 6 på formen (ln x + a)(ln x + b)(ln x + c).', ['(ln x + 3)(ln x − 1)(ln x − 2)', '(ln x − 3)(ln x + 1)(ln x + 2)', '(ln x + 3)(ln x + 1)(ln x − 2)', '(ln x − 1)²(ln x + 6)'], 'Nullpunktene i t³ − 7t + 6 er t = 1, 2 og −3.'),
          mc('1.121 b', 'Løs ulikheten (lg x)² − 5 lg x + 6 > 0.', ['L = ⟨0, 100⟩ ∪ ⟨1000, →⟩', 'L = ⟨100, 1000⟩', 'L = ⟨2, 3⟩', 'L = ⟨−∞, 100⟩ ∪ ⟨1000, →⟩'], '(lg x − 2)(lg x − 3) > 0 gir lg x < 2 eller lg x > 3. Husk x > 0.'),
          mc('1.122', 'Løs ulikheten (e^(4x) − 2eˣ) / (x² − 1) ≥ 0.', ['L = ⟨−1, ln 2 / 3] ∪ ⟨1, →⟩', 'L = [−1, ln 2 / 3] ∪ [1, →⟩', 'L = ⟨ln 2 / 3, 1⟩', 'L = ⟨−1, 1⟩'], 'Telleren eˣ(e^(3x) − 2) er null for x = ln 2 / 3. Nevneren er null for x = ±1 (ikke med).'),
          mc('1.123', 'Grafen til f(x) = (lg x + a)(lg x + b) har nullpunkter i x = 10 og x = 100. Bestem a og b.', ['a = −1 og b = −2', 'a = 1 og b = 2', 'a = −10 og b = −100', 'a = 10 og b = 100'], 'lg 10 = 1 og lg 100 = 2.'),
          mc('1.124 b', 'Løs x² = n² · (x/n)^(lg x − 3), som kan skrives (lg x − lg n)(lg x − 5) = 0.', ['L = {n, 10⁵}', 'L = {n, 5}', 'L = {10ⁿ, 10⁵}', 'L = {n}'], 'lg x = lg n eller lg x = 5.'),
          mc('1.125', 'På grafen over dødsfall er det like langt mellom 10, 100, 1000 og 10 000 på andreaksen. Hva slags akse er det?', ['En logaritmisk akse', 'En lineær akse', 'En prosentakse', 'En feil i grafen'], 'Like avstander betyr at verdien ganges med 10 for hvert steg.'),
          N('1.126 a', 'Richterskalaen: 10ᴹ = A. Hvor mange ganger større er utslaget for et skjelv på 6,0 enn på 4,0?', 100, '10⁶ / 10⁴ = 10².'),
          N('1.126 c', 'M = (lg E − 4,4)/1,5. Hvor mye energi (J) blir utløst av et skjelv med styrke 7,2?', 1.6e15, 'lg E = 1,5 · 7,2 + 4,4 = 15,2, E ≈ 1,6 · 10¹⁵ J.', T(0.03)),
          mc('1.126 d', 'Skriv en formel for E uttrykt ved M.', ['E = 10^(1,5M + 4,4)', 'E = 10^((M − 4,4)/1,5)', 'E = 1,5M + 4,4', 'E = lg (1,5M + 4,4)'], 'lg E = 1,5M + 4,4.'),
          N('1.126 e', 'Hvor mange ganger større blir energien når M øker med 1? (omtrent)', 31.6, '10^1,5 ≈ 31,6, altså omtrent 30 ganger.', T(0.06)),
          ord('1.127 c', 'Vis at fordoblingstiden blir T = ln 2 / ln (1 + p/100) ≈ 70/p.', ['(1 + p/100)ᵀ = 2', 'T · ln (1 + p/100) = ln 2', 'T = ln 2 / ln (1 + p/100)', 'Med ln (1 + x) ≈ x får vi T ≈ ln 2 / (p/100) ≈ 69,3/p ≈ 70/p'], ['T = 2 / (1 + p/100)'], 'Ta ln på begge sider og bruk tilnærmingen fra oppgave a.'),
        ],
      },
    ],
  };

  // ================================================================
  // Kapittelprøve: Kapitteltesten s. 61 + 10 rette eller gale
  // ================================================================
  const examItems = [
    ord('Kapitteltest 1', 'Skriv tallene i stigende rekkefølge.', ['ln (1/e)', 'e^(−ln 3)', 'ln √e', 'log₂ 8', '(∛2)⁶'], [], 'Verdiene er −1, 1/3, 1/2, 3 og 4.', U),
    mc('Kapitteltest 2 a', 'Skriv så enkelt som mulig: lg x³ / (lg x)²', ['3 / lg x', '3 lg x', '3', 'lg x'], '3 lg x / (lg x)².', U),
    N('Kapitteltest 2 b', 'Regn ut lg 1 + ln e³ − lg 0,01.', 5, '0 + 3 + 2.', U),
    mc('Kapitteltest 2 c', 'Skriv så enkelt som mulig: ln ab⁻² − 2 ln (1/b)', ['ln a', 'ln a − 4 ln b', 'ln a + 4 ln b', '−ln a'], '(ln a − 2 ln b) + 2 ln b.', U),
    mc('Kapitteltest 2 d', 'Skriv så enkelt som mulig: log₂ 2x⁵ − 2 log₂ (1/(4x))', ['7 log₂ x + 5', '3 log₂ x + 5', '7 log₂ x − 3', '5 log₂ x + 1'], '(1 + 5 log₂ x) + 2(2 + log₂ x).', U),
    N('Kapitteltest 3 a', 'Løs (lg x)² − 2 lg x + 1 = 0.', 10, '(lg x − 1)² = 0.', U),
    mc('Kapitteltest 3 b', 'Løs e^(2x) − 5eˣ = 0.', ['L = {ln 5}', 'L = {0, ln 5}', 'L = {5}', 'L = {ln 5 / 2}'], 'eˣ(eˣ − 5) = 0, og eˣ ≠ 0.', U),
    N('Kapitteltest 3 c', 'Løs log₂ x² − log₂ x − 3 = 0.', 8, 'log₂ x = 3.', U),
    N('Kapitteltest 3 d', 'Løs 3^(4x) + 3^(4x) + 3^(4x) = 9.', 0.25, '3 · 3^(4x) = 9 gir 3^(4x) = 3.', U),
    ord('Kapitteltest 4 a', 'Vis at L = 3 lg x⁴ − lg (1/x) + lg (100x)³ kan forenkles til L = 16 lg x + 6.', ['3 lg x⁴ = 12 lg x', '−lg (1/x) = lg x', 'lg (100x)³ = 3(2 + lg x) = 6 + 3 lg x', 'L = 12 lg x + lg x + 3 lg x + 6 = 16 lg x + 6'], ['lg (100x)³ = 300 lg x'], 'Bruk de tre logaritmesetningene.', U),
    N('Kapitteltest 4 b', 'L = 16 lg x + 6. Bestem x slik at L = 38.', 100, '16 lg x = 32 gir lg x = 2.', U),
    N('Kapitteltest 5 a', 'ln 2 ≈ 0,7 og ln 3 ≈ 1,1. Finn en tilnærmet verdi for ln 1,5.', 0.4, 'ln (3/2) = 1,1 − 0,7.', U),
    N('Kapitteltest 5 b', 'Verdien av et kunstverk stiger 50 % per år. Hvor mange år tar det før verdien er fire ganger så stor? (ln 4 ≈ 1,4 og ln 1,5 ≈ 0,4)', 3.5, '1,5ˣ = 4 gir x = ln 4 / ln 1,5 = 1,4/0,4.', { u: true, tol: 0.03 }),
    N('Kapitteltest 6 a', 'A(t) = 7500 · 0,5^(0,033t). Hva er radioaktiviteten (Bq/kg) etter 6 år? Svar med to gjeldende siffer.', 6500, '7500 · 0,5^(0,198) ≈ 6540 ≈ 6500 Bq/kg.', T(0.02)),
    N('Kapitteltest 6 b', 'Hvor mange år tar det før radioaktiviteten er 7000 Bq/kg?', 3, '0,5^(0,033t) = 7000/7500 gir t ≈ 3,0 år.', T(0.04)),
    mc('Kapitteltest 7 b', 'Hvorfor har likningen ln (3 − x) = ln (x − 5) ingen løsning?', ['ln (3 − x) krever x < 3 og ln (x − 5) krever x > 5, så det finnes ingen x der begge er definert', 'Fordi 3 − x = x − 5 ikke har løsning', 'Fordi ln aldri kan være lik ln', 'Fordi likningen har to løsninger'], 'Definisjonsmengdene overlapper ikke.'),
    mc('Kapitteltest 7 c', 'Per løste ln (3 − x) = ln (x − 5) og svarte L = {4}. Hva har han gjort galt?', ['Han har ikke kontrollert svaret: for x = 4 er ln (x − 5) = ln (−1) ikke definert', 'Han har regnet feil, svaret skal være x = 8', 'Han har glemt en løsning', 'Ingenting, svaret er riktig'], 'Logaritmer er bare definert for positive tall.'),
    ord('Kapitteltest 8 a', 'Vis at 5³ · (x/5)^(ln x + 2) = x³ kan omformes til (ln x − ln 5)(ln x − 1) = 0.', ['Ta ln på begge sider: 3 ln 5 + (ln x + 2)(ln x − ln 5) = 3 ln x', 'Gang ut: (ln x)² − ln 5 · ln x + 2 ln x − 2 ln 5 + 3 ln 5 − 3 ln x = 0', 'Trekk sammen: (ln x)² − ln 5 · ln x − ln x + ln 5 = 0', 'Faktoriser: (ln x − ln 5)(ln x − 1) = 0'], ['Ta ln på begge sider: 3 ln 5 · (ln x + 2) = 3 ln x'], '3. logaritmesetning og faktorisering.'),
    mc('Kapitteltest 8 b', 'Løs 5³ · (x/5)^(ln x + 2) = x³.', ['L = {e, 5}', 'L = {5}', 'L = {1, 5}', 'L = {e, ln 5}'], 'ln x = ln 5 gir x = 5, og ln x = 1 gir x = e.'),
    tf('10 rette eller gale 1', 'lg a er bare definert når a er et positivt tall.', true, 'Vi kan aldri opphøye 10 i noe og få null eller et negativt tall.'),
    tf('10 rette eller gale 2', 'Logaritmen til et tall er alltid et positivt tall.', false, 'lg 0,1 = −1.'),
    tf('10 rette eller gale 3', 'Den naturlige logaritmen har 10 som grunntall.', false, 'Den naturlige logaritmen har grunntall e.'),
    tf('10 rette eller gale 4', 'lg 0,8 er et positivt tall.', false, '0,8 < 1, så lg 0,8 < 0.'),
    tf('10 rette eller gale 5', 'log₂ 16 = 4', true, '2⁴ = 16.'),
    tf('10 rette eller gale 6', 'ln (x − 2) = ln x − ln 2', false, 'ln (x/2) = ln x − ln 2, men ln (x − 2) kan ikke deles opp.'),
    tf('10 rette eller gale 7', 'lg x / lg y = lg x − lg y', false, 'Det er lg (x/y) som er lik lg x − lg y.'),
    tf('10 rette eller gale 8', '3ˣ = 81 ⇔ x = 4', true, '81 = 3⁴.'),
    tf('10 rette eller gale 9', 'Likningen lg x² = 4 har løsningsmengde L = {100}.', false, 'L = {−100, 100}.'),
    tf('10 rette eller gale 10', 'Likningen (lg x)² = 4 har løsningsmengde L = {1/100, 100}.', true, 'lg x = ±2.'),
  ];

  const r1p = {
    id: 'r1p', title: 'Kapittelprøve kap. 1',
    color: '#ff4b4b', dark: '#ea2b2b',
    goal: 'Hele kapitteltesten s. 61 og «10 rette eller gale». Du må svare på alle oppgavene og kan gjøre høyst to feil. Ellers må du ta prøven på nytt. Frist for prøven i kap. 1: onsdag 2. september 2026, kl. 08:30.',
    guide: [
      ['Om prøven', 'Prøven har alle delene av kapitteltesten på s. 61 og alle de ti påstandene i «10 rette eller gale».\nDu har tre liv. Ved den tredje feilen er prøven ikke bestått, og du må starte på nytt.\nOppgaver uten hjelpemidler har ikke kalkulator.'],
      ['Ikke med ennå', 'Kollokvieoppgaven til kap. 1 og eksamensoppgavene 8.1 og 8.7–8.10 fra oppgavesamlingen ligger ikke i appen ennå.'],
    ],
    skills: [],
    exam: { title: 'Kapittelprøve kap. 1', lives: 3, items: examItems },
  };

  // ---------- ordliste ----------
  const W = (w) => `(?<![\\p{L}\\p{N}])[${w[0].toUpperCase()}${w[0]}]${w.slice(1)}\\p{L}*`;
  const glossary = [
    ['n-terot', 'n-ter\\p{L}*', 'ⁿ√a er tallet som opphøyd i n blir a. Er n et partall, må a og roten være positive.'],
    ['Grunntall', W('grunntall'), 'Tallet som opphøyes: i aᵖ er a grunntallet. I log_n p er n grunntallet.'],
    ['Eksponent', W('eksponent'), 'Tallet en potens er opphøyd i: i aᵖ er p eksponenten.'],
    ['Potens', W('potens'), 'Et uttrykk på formen aᵖ.'],
    ['Logaritme', W('logaritm'), 'Eksponenten vi må opphøye grunntallet i for å få tallet.'],
    ['Briggsk logaritme', W('briggs'), 'lg, logaritmen med grunntall 10.'],
    ['Naturlig logaritme', W('naturlig'), 'ln, logaritmen med grunntall e.'],
    ['Eulertallet', W('eulertall'), 'e ≈ 2,718. Grunntallet for den naturlige logaritmen.'],
    ['Logaritmesetning', W('logaritmesetning'), 'log ab = log a + log b, log (a/b) = log a − log b, log aᵇ = b log a.'],
    ['Eksponentiallikning', W('eksponentiallikning'), 'En likning der den ukjente står i en eksponent.'],
    ['Halveringsmetoden', W('halveringsmetode'), 'Numerisk metode som halverer intervallet der funksjonen skifter fortegn, til nullpunktet er funnet.'],
    ['Definisjonsmengde', W('definisjonsmengde'), 'Alle x-verdier funksjonen er definert for. For lg x er den ⟨0, →⟩.'],
    ['Verdimengde', W('verdimengde'), 'Alle verdiene funksjonen kan få.'],
    ['Løsningsmengde', W('løsningsmengde'), 'Mengden L av alle løsninger på likningen.'],
    ['Vekstfaktor', W('vekstfaktor'), 'Tallet vi ganger med per periode: 1 + p/100.'],
    ['lg', '(?<![\\p{L}])lg(?![\\p{L}])', 'Briggsk logaritme: lg p er tallet vi må opphøye 10 i for å få p.'],
    ['ln', '(?<![\\p{L}])ln(?![\\p{L}])', 'Naturlig logaritme: ln p er tallet vi må opphøye e i for å få p.'],
    ['log', '(?<![\\p{L}])log(?![\\p{L}])', 'log_n p er tallet vi må opphøye n i for å få p.'],
    ['⇔', '⇔', 'Ekvivalens: utsagnene følger av hverandre begge veier.'],
    ['∨', '∨', '«eller» mellom to løsninger.'],
    ['∅', '∅', 'Den tomme mengden: likningen har ingen løsning.'],
  ].map(([t, m, d]) => ({ t, m, d }));


  // ================================================================
  // Trinnvis innføring
  // Formlene innføres i små noder med høyst tre nye formler eller begreper.
  // Hver formelnode følges av oppgavene i boka som bruker akkurat disse formlene,
  // og Lekser kommer til slutt i enheten som blandet repetisjon av alt.
  // ================================================================
  const sk = (u, id) => u.skills.find((s) => s.id === id);
  const pick = (s, idx) => idx.map((i) => s.items[i]);
  const bySrc = (s, re) => s.items.filter((it) => re.test(it.src));
  const migrate = {};
  function regroup(u, plan) {
    const keep = u.skills.filter((s) => !/[01]$/.test(s.id));
    plan.forEach((p) => { (migrate[p.from] = migrate[p.from] || []).push(p.id); delete p.from; });
    u.skills = plan.concat(keep);
  }

  {
    const F = sk(r1a, 'r1a0'), T = sk(r1a, 'r1a1');
    regroup(r1a, [
      { id: 'r1a-f1', from: 'r1a0', title: 'n-terøtter', intro: [
        ['ⁿ√a', 'n-teroten av a', 'Tallet som opphøyd i n blir a: (ⁿ√a)ⁿ = a.', 's'],
        ['∛−8 = −2', 'Odde og like rotindekser', 'Er n et oddetall, kan a være negativ.\nEr n et partall, må a og ⁿ√a være positive.', 'f'],
      ], items: pick(F, [6, 7]).concat([
        fx('Formel', 'Hva er (ⁿ√a)ⁿ?', ['a', 'aⁿ', 'n√a', '1'], 'Definisjonen: ⁿ√a er tallet som opphøyd i n blir a.'),
        fx('Formel', 'Hva er ∛125?', ['5', '25', '−5', '41,7'], '5³ = 125.', U),
      ]) },
      { id: 'r1a-t1', from: 'r1a1', title: '1A I timen: røtter', items: bySrc(T, /^1\.[13] /) },
      { id: 'r1a-f2', from: 'r1a0', title: 'Potensreglene', intro: [
        ['a⁰ = 1\na⁻ⁿ = 1/aⁿ', 'Null og negative eksponenter', 'Gjelder for alle a ≠ 0.', 'f'],
        ['aᵖ · a^q = a^(p+q)', 'Like grunntall ganges', 'Eksponentene legges sammen.', 'f'],
        ['aᵖ / a^q = a^(p−q)', 'Like grunntall deles', 'Eksponentene trekkes fra hverandre.', 'f'],
      ], items: pick(F, [0, 1, 3]).concat([
        fx('Formel', 'Hva er 5⁰?', ['1', '0', '5', '−5'], 'a⁰ = 1 for alle a ≠ 0.', U),
        fx('Formel', 'Hva er 2⁻³?', ['1/8', '−8', '−6', '8'], '2⁻³ = 1/2³ = 1/8.', U),
      ]) },
      { id: 'r1a-f3', from: 'r1a0', title: 'Potenser av produkt, brøk og potens', intro: [
        ['(aᵖ)^q = a^(p·q)', 'Potens av en potens', 'Eksponentene ganges.', 'f'],
        ['(a · b)ᵖ = aᵖ · bᵖ', 'Potens av et produkt', 'Hver faktor opphøyes for seg.', 'f'],
        ['(a/b)ᵖ = aᵖ/bᵖ', 'Potens av en brøk', 'Teller og nevner opphøyes hver for seg (b ≠ 0).', 'f'],
      ], items: pick(F, [2]).concat([
        fx('Formel', 'Hva er (2a)³?', ['8a³', '2a³', '6a³', '8a'], '(a · b)ᵖ = aᵖ · bᵖ: 2³ · a³ = 8a³.'),
        fx('Formel', 'Hva er (x/3)²?', ['x²/9', 'x²/3', 'x/9', '2x/6'], '(a/b)ᵖ = aᵖ/bᵖ.'),
        fx('Formel', 'Hva er (x³)⁻²?', ['x⁻⁶', 'x', 'x⁻⁵', 'x⁹'], 'Potens av en potens: 3 · (−2) = −6.'),
      ]) },
      { id: 'r1a-t2', from: 'r1a1', title: '1A I timen: potensregler', items: bySrc(T, /^1\.5 /) },
      { id: 'r1a-f4', from: 'r1a0', title: 'Brøkeksponenter', intro: [
        ['a^(1/n) = ⁿ√a', 'Eksponenten 1/n', 'Å opphøye i 1/n er det samme som å ta n-teroten.', 'f'],
        ['a^(t/n) = ⁿ√(aᵗ) = (ⁿ√a)ᵗ', 'Brøkeksponent', 'Nevneren i eksponenten blir rotindeksen: 8^(2/3) = (∛8)² = 4.', 'f'],
      ], items: pick(F, [4, 5, 8]).concat([
        fx('Formel', 'Hva er 27^(2/3)?', ['9', '18', '3', '81'], '(∛27)² = 3² = 9.', U),
      ]) },
      { id: 'r1a-f5', from: 'r1a0', title: 'Rotreglene', intro: [
        ['ⁿ√(ab) = ⁿ√a · ⁿ√b', 'Rot av et produkt', 'Brukes til å trekke faktorer ut av rota: √50 = 5√2.', 'f'],
        ['ⁿ√(a/b) = ⁿ√a / ⁿ√b', 'Rot av en brøk', 'Roten av teller delt på roten av nevner.', 'f'],
      ], items: [
        fx('Formel', 'Skriv √12 så enkelt som mulig.', ['2√3', '4√3', '3√2', '6√2'], '√12 = √(4 · 3) = √4 · √3 = 2√3.', U),
        fx('Formel', 'Hva er √(9/16)?', ['3/4', '9/4', '3/16', '81/256'], '√9 / √16 = 3/4.', U),
      ] },
      { id: 'r1a-t3', from: 'r1a1', title: '1A I timen: brøkeksponenter og røtter', items: bySrc(T, /^1\.(7|12|13)( |$)/) },
    ]);
  }
  {
    const F = sk(r1b, 'r1b0'), T = sk(r1b, 'r1b1');
    regroup(r1b, [
      { id: 'r1b-f1', from: 'r1b0', title: 'Briggske logaritmer', intro: [
        ['lg p', 'Briggsk logaritme', 'Tallet vi må opphøye 10 i for å få p. lg 1000 = 3 fordi 10³ = 1000.', 's'],
        ['10^(lg p) = p', 'Definisjonen av lg', 'Gjelder for alle positive tall p.', 'f'],
        ['lg 10ᵏ = k', 'Logaritmen til en tierpotens', 'lg 0,01 = lg 10⁻² = −2.', 'f'],
      ], items: pick(F, [0, 2, 4, 5, 7]) },
      { id: 'r1b-t1', from: 'r1b1', title: '1B I timen: lg', items: bySrc(T, /^1\.2[123] /) },
      { id: 'r1b-f2', from: 'r1b0', title: 'Naturlige logaritmer', intro: [
        ['e ≈ 2,718', 'Eulertallet', 'Grunntallet for de naturlige logaritmene.', 's'],
        ['ln p', 'Naturlig logaritme', 'Tallet vi må opphøye e i for å få p.', 's'],
        ['e^(ln p) = p\nln eᵏ = k', 'Definisjonen av ln', 'ln 1 = 0\nln e = 1', 'f'],
      ], items: pick(F, [1, 3, 6, 8]) },
      { id: 'r1b-t2', from: 'r1b1', title: '1B I timen: ln', items: bySrc(T, /^1\.2[67] /) },
    ]);
  }
  {
    const F = sk(r1c, 'r1c0'), T = sk(r1c, 'r1c1');
    regroup(r1c, [
      { id: 'r1c-f1', from: 'r1c0', title: 'Logaritmen til produkt og brøk', intro: [
        ['lg ab = lg a + lg b', '1. logaritmesetning', 'Logaritmen til et produkt er summen av logaritmene. Gjelder også for ln.', 'f'],
        ['lg (a/b) = lg a − lg b', '2. logaritmesetning', 'Logaritmen til en brøk er differansen. Gjelder også for ln.', 'f'],
      ], items: pick(F, [0, 1, 4, 5]) },
      { id: 'r1c-t1', from: 'r1c1', title: '1C I timen: produkt og brøk', items: bySrc(T, /^1\.(38|43) /) },
      { id: 'r1c-f2', from: 'r1c0', title: 'Logaritmen til en potens', intro: [
        ['lg aᵇ = b · lg a', '3. logaritmesetning', 'Eksponenten kan flyttes ned foran logaritmen.', 'f'],
        ['lg x = ln x / ln 10', 'Fra ln til lg', 'Følger av 10^(lg x) = x og 3. setning.', 'f'],
      ], items: pick(F, [2, 3, 6, 7]) },
      { id: 'r1c-t2', from: 'r1c1', title: '1C I timen: forenkling', items: bySrc(T, /^1\.4[6-9] /) },
    ]);
  }
  {
    const F = sk(r1d, 'r1d0'), T = sk(r1d, 'r1d1');
    regroup(r1d, [
      { id: 'r1d-f1', from: 'r1d0', title: 'Logaritmelikninger', intro: [
        ['lg x = a ⇔ x = 10ᵃ', 'Løse en lg-likning', 'Gjør begge sider til eksponent i 10.', 'f'],
        ['ln x = a ⇔ x = eᵃ', 'Løse en ln-likning', 'Gjør begge sider til eksponent i e.', 'f'],
        ['Kontroll', 'Logaritmen må være definert', 'Forkast løsninger der argumentet i en logaritme blir null eller negativt.', 'b'],
      ], items: pick(F, [0, 4, 5]) },
      { id: 'r1d-t1', from: 'r1d1', title: '1D I timen: logaritmelikninger', items: bySrc(T, /^1\.6[0-5] |^1\.59 /) },
      { id: 'r1d-f2', from: 'r1d0', title: 'Eksponentiallikninger', intro: [
        ['eˣ = b ⇔ x = ln b', 'Løse en e-likning', 'Ta ln på begge sider.', 'f'],
        ['aˣ = b ⇔ x = lg b / lg a', 'Løse en eksponentiallikning', 'Ta lg (eller ln) på begge sider og bruk 3. setning.', 'f'],
      ], items: pick(F, [1, 2, 3, 6]) },
      { id: 'r1d-t2', from: 'r1d1', title: '1D I timen: eksponentiallikninger', items: bySrc(T, /^1\.(6[67]|7[23]) /) },
      { id: 'r1d-f3', from: 'r1d0', title: 'Halveringsmetoden', intro: [
        ['m = (a + b)/2', 'Halveringsmetoden', 'Halver intervallet der f skifter fortegn, til f(m) ≈ 0.', 'f'],
      ], items: pick(F, [7]).concat([
        fx('Formel', 'f(1) = −2 og f(3) = 4. Hva er det første midtpunktet m i halveringsmetoden?', ['2', '1', '3', '1,5'], 'm = (a + b)/2 = (1 + 3)/2 = 2.', U),
        tf('Formel', 'Halveringsmetoden krever at f(a) og f(b) har motsatt fortegn.', true, 'Da vet vi at grafen krysser x-aksen mellom a og b (når f er kontinuerlig).'),
      ]) },
    ]);
  }
  {
    const F = sk(r1e, 'r1e0'), T = sk(r1e, 'r1e1');
    regroup(r1e, [
      { id: 'r1e-f1', from: 'r1e0', title: 'Generelle logaritmer', intro: [
        ['log_n p', 'Logaritme med grunntall n', 'Tallet vi må opphøye n i for å få p. log₂ 16 = 4.', 's'],
        ['n^(log_n p) = p', 'Definisjonen av log_n', 'Gjelder for positive n ≠ 1 og p > 0.', 'f'],
        ['log_n nᵏ = k', 'Logaritmen til en potens av grunntallet', 'log₃ (1/9) = log₃ 3⁻² = −2.', 'f'],
      ], items: pick(F, [0, 1, 3, 4]) },
      { id: 'r1e-t1', from: 'r1e1', title: '1E I timen: regne med log_n', items: bySrc(T, /^1\.8[47] /) },
      { id: 'r1e-f2', from: 'r1e0', title: 'Bytte grunntall og løse likninger', intro: [
        ['log_n x = ln x / ln n', 'Bytte grunntall', 'Også lik lg x / lg n.', 'f'],
        ['log_n x = a ⇔ x = nᵃ', 'Løse generelle likninger', 'Og nˣ = b ⇔ x = log_n b.', 'f'],
      ], items: pick(F, [2]).concat([
        fx('Formel', 'Hva er log₂ x uttrykt med naturlige logaritmer?', ['ln x / ln 2', 'ln 2 / ln x', 'ln (x/2)', 'ln x − ln 2'], 'Bytte grunntall: log_n x = ln x / ln n.'),
        fx('Formel', 'Løs log₃ x = 2.', ['9', '6', '8', '2/3'], 'log_n x = a ⇔ x = nᵃ, så x = 3² = 9.', U),
      ]) },
      { id: 'r1e-t2', from: 'r1e1', title: '1E I timen: likninger', items: bySrc(T, /^1\.88 /) },
    ]);
  }

  window.R1 = {
    id: 'r1',
    title: 'Matematikk R1',
    short: 'R1',
    icon: 'sigma',
    goalLabel: 'Mål',
    handDone: true,
    migrate,
    glossary,
    units: [r1a, r1b, r1c, r1d, r1e, r1m, r1p],
  };
})();
