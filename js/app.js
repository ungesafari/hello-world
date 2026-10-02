(function () {
  'use strict';

  const COURSES = [window.FYSIKK1, window.BASKET, window.R1].filter(Boolean);
  const fmt = window.FYSIKK1.fmt;
  const app = document.getElementById('app');
  let COURSE = COURSES[0];
  let NODES = [];

  const LEVELS = 3; // leksjoner per ferdighet
  const LESSON_LEN = 8;
  const REVIEW_LEN = 12;
  const JUMP_LEN = 12;
  const JUMP_LIVES = 3;
  const MAX_HEARTS = 5;
  const HEART_MS = 4 * 3600 * 1000;
  const BOOST_MS = 15 * 60 * 1000;
  const DAY_MS = 86400000;
  const KEY = 'fysikkling-v1';

  // ------------------------------------------------------------------
  // Hjelpefunksjoner
  // ------------------------------------------------------------------
  const pad = (n) => String(n).padStart(2, '0');
  const dayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parseDay = (k) => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
  const addDays = (k, n) => { const d = parseDay(k); d.setDate(d.getDate() + n); return dayKey(d); };
  const weekStart = (d = new Date()) => { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return dayKey(x); };
  const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
  const nl = (s) => esc(s).replace(/\n/g, '<br>');

  function hash(str) {
    let hh = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) { hh = Math.imul(hh ^ str.charCodeAt(i), 3432918353); hh = (hh << 13) | (hh >>> 19); }
    return hh >>> 0;
  }
  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shuffle(arr, r = Math.random) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  const pickR = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // ------------------------------------------------------------------
  // Matematikk-visning: a/b blir en brøk med vannrett brøkstrek, x^(…) blir
  // hevet skrift og log_n blir senket skrift. Nye linjer (\n) blir linjebytte.
  // ------------------------------------------------------------------
  const FUNC_RE = /^(ln|lg|log\S*|sin|cos|tan)$/;
  const STOP_WORDS = new Set(['er', 'og', 'eller', 'men', 'der', 'når', 'som', 'gir', 'så', 'for', 'av', 'med', 'ved', 'ikke', 'i', 'på', 'til', 'fra', 'blir', 'betyr', 'altså', 'hvis', 'fordi', 'om']);
  const DELIMS = new Set(['=', '≈', '⇔', '⇒', '→', ',', ';', ':', '+', '−', '-', '<', '>', '≤', '≥', '∨', '∧', '≠', '±', '|', '?', '!']);
  const isAtomCh = (ch) => /[\p{L}\p{N}\p{M}√∛∜π′″°%▢∞⁺⁻⁼₊₋ʹ']/u.test(ch);
  function matchParen(str, i) {
    let d = 0;
    for (let j = i; j < str.length; j++) { if (str[j] === '(') d++; else if (str[j] === ')') { d--; if (!d) return j; } }
    return -1;
  }
  function readRun(str, i, allowSign) {
    let j = i;
    if (allowSign && /[−\-+]/.test(str[j] || '')) j++;
    for (; j < str.length; j++) {
      const ch = str[j];
      if (isAtomCh(ch)) continue;
      if ((ch === ',' || ch === '.') && /\d/.test(str[j - 1] || '') && /\d/.test(str[j + 1] || '')) continue;
      // tusenskille: «10 000» er ett tall
      if ((ch === ' ' || ch === '\u00a0') && /\d/.test(str[j - 1] || '') && /^\d{3}(?!\d)/.test(str.slice(j + 1))) continue;
      break;
    }
    return j;
  }
  function parsePieces(str) {
    const P = [];
    const lastAtom = () => (P.length && P[P.length - 1].k === 'atom' ? P[P.length - 1] : null);
    for (let i = 0; i < str.length;) {
      const ch = str[i];
      if (ch === ' ' || ch === ' ') { P.push({ k: 'sp', h: ch }); i++; continue; }
      if (ch === '(') {
        const j = matchParen(str, i);
        if (j > 0) { const inner = str.slice(i + 1, j); P.push({ k: 'atom', grp: inner, h: '(' + renderSeq(inner) + ')' }); i = j + 1; continue; }
      }
      if (ch === '^' || ch === '_') {
        const tag = ch === '^' ? 'sup' : 'sub';
        let html, j;
        if (str[i + 1] === '(' && matchParen(str, i + 1) > 0) { j = matchParen(str, i + 1); html = renderSeq(str.slice(i + 2, j)); j++; }
        else { j = readRun(str, i + 1, ch === '^'); html = esc(str.slice(i + 1, j)); }
        if (j > i + 1) {
          const a = lastAtom();
          if (a) a.h += `<${tag}>${html}</${tag}>`; else P.push({ k: 'atom', h: `<${tag}>${html}</${tag}>` });
          i = j; continue;
        }
      }
      if (ch === '/') { P.push({ k: 'slash', spaced: str[i - 1] === ' ' || str[i + 1] === ' ' }); i++; continue; }
      if (isAtomCh(ch)) { const j = readRun(str, i, false); const w = str.slice(i, j); P.push({ k: 'atom', h: esc(w), w }); i = j; continue; }
      P.push({ k: 'op', h: esc(ch), raw: ch }); i++;
    }
    // funksjonsnavn hører sammen med argumentet sitt: «ln (7/3)», «lg 5», «log₂ x»
    for (let k = 0; k < P.length - 1; k++) {
      const a = P[k];
      if (a.k !== 'atom' || !a.w || !FUNC_RE.test(a.w)) continue;
      let n = k + 1;
      if (P[n] && P[n].k === 'sp' && P[n + 1] && P[n + 1].k === 'atom') n++;
      if (P[n] && P[n].k === 'atom') { a.h += (n > k + 1 ? ' ' : '') + P[n].h; a.w = null; P.splice(k + 1, n - k); k--; }
    }
    return P;
  }
  const isStop = (p) => p.k === 'slash' || (p.k === 'op' && DELIMS.has(p.raw)) || (p.k === 'atom' && p.w && STOP_WORDS.has(p.w.toLowerCase()));
  const fracPart = (arr) => (arr.length === 1 && arr[0].grp !== undefined ? renderSeq(arr[0].grp) : arr.map((x) => x.h).join(''));
  function renderSeq(str) {
    const P = parsePieces(str);
    const out = [];
    for (let i = 0; i < P.length; i++) {
      const p = P[i];
      if (p.k !== 'slash') { out.push(p); continue; }
      let num = [], den = [], j = i + 1, trail = [];
      if (!p.spaced) {
        while (out.length && out[out.length - 1].k === 'atom') num.unshift(out.pop());
        while (j < P.length && P[j].k === 'atom') den.push(P[j++]);
      } else {
        const lead = [];
        while (out.length && out[out.length - 1].k === 'sp') out.pop();
        while (out.length && !isStop(out[out.length - 1])) num.unshift(out.pop());
        while (num.length && num[0].k === 'sp') lead.push(num.shift());
        out.push(...lead);
        while (j < P.length && P[j].k === 'sp') j++;
        if (P[j] && P[j].k === 'op' && (P[j].raw === '−' || P[j].raw === '-')) den.push(P[j++]);
        while (j < P.length && !isStop(P[j]) && !(P[j].k === 'op' && (P[j].raw === '·' || P[j].raw === '.'))) den.push(P[j++]);
        while (den.length && den[den.length - 1].k === 'sp') trail.unshift(den.pop());
      }
      if (!num.length || !den.length) { out.push(...num, { k: 'op', h: '/' }, ...den, ...trail); i = j - 1; continue; }
      out.push({ k: 'atom', h: `<span class="frac"><span class="fn">${fracPart(num)}</span><span class="fd">${fracPart(den)}</span></span>` }, ...trail);
      i = j - 1;
    }
    return out.map((x) => x.h).join('');
  }
  // Ny setning på ny linje: etter . ! eller ? (og eventuelt et avsluttende anførselstegn
  // eller en parentes) brytes linja når neste ord starter med stor bokstav.
  // Vanlige forkortelser som «f.eks.» og «kap.» brytes ikke.
  const ABBR = /(?:^|[\s(])(?:f\.eks|bl\.a|dvs|ca|kap|nr|jf|evt|osv|mht|ifm|o\.l|s)$/i;
  function sentenceBreaks(str) {
    return str.replace(/([.!?])(["»”)\]]?)[ \u00a0]+(?=\p{Lu})/gu, (m, p, q, off) => {
      if (p === '.' && !q && ABBR.test(str.slice(Math.max(0, off - 8), off))) return m;
      return p + q + '\n';
    });
  }
  function mathHTML(text) {
    if (text === undefined || text === null) return '';
    return sentenceBreaks(String(text)).split('\n').map(renderSeq).join('<br>')
      // «s-t-grafen» og «v-t-graf» skal ikke deles over to linjer
      .replace(/(?<![\p{L}<])(\p{L}-\p{L}-\p{L}+)/gu, '<span class="nw">$1</span>');
  }

  // ------------------------------------------------------------------
  // Ordliste: nøkkelord og symboler i teksten kan trykkes på for en kort forklaring.
  // Hver oppføring har et regex-mønster (m) og en forklaring (d).
  // Teksten tegnes først med mathHTML, deretter lenkes ordene i tekstnodene.
  // ------------------------------------------------------------------
  function glossRe(c) {
    if (c._gre !== undefined) return c._gre;
    const g = (c.glossary || []).slice().sort((a, b) => b.m.length - a.m.length);
    c._gl = g;
    try { c._gre = g.length ? new RegExp(g.map((e) => `(${e.m})`).join('|'), 'gu') : null; }
    catch (err) { c._gre = null; } // eldre nettlesere uten støtte for lookbehind
    return c._gre;
  }
  function gloss(text, c = COURSE) {
    return `<span class="gl" data-c="${c.id}">${mathHTML(text || '')}</span>`;
  }
  function applyGloss(root) {
    root.querySelectorAll('.gl[data-c]').forEach((el) => {
      const c = COURSES.find((cc) => cc.id === el.dataset.c);
      const re = c && glossRe(c);
      if (!re) return;
      const seen = new Set();
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach((node) => {
        const text = node.nodeValue;
        re.lastIndex = 0;
        let m, last = 0, changed = false;
        const frag = document.createDocumentFragment();
        while ((m = re.exec(text))) {
          if (!m[0]) { re.lastIndex++; continue; }
          let gi = -1;
          for (let k = 1; k < m.length; k++) if (m[k] !== undefined) { gi = k - 1; break; }
          if (gi < 0 || seen.has(gi)) continue;
          seen.add(gi); changed = true;
          frag.appendChild(document.createTextNode(text.slice(last, m.index)));
          const b = document.createElement('button');
          b.type = 'button'; b.className = 'term'; b.dataset.a = 'term'; b.dataset.c = c.id; b.dataset.g = gi;
          b.textContent = m[0];
          frag.appendChild(b);
          last = m.index + m[0].length;
        }
        if (!changed) return;
        frag.appendChild(document.createTextNode(text.slice(last)));
        node.parentNode.replaceChild(frag, node);
      });
    });
  }
  function closeTip() { const t = document.querySelector('.tip'); if (t) t.remove(); }
  function showTip(el) {
    closeTip();
    const c = COURSES.find((cc) => cc.id === el.dataset.c);
    const e = c && c._gl[+el.dataset.g];
    if (!e) return;
    const tip = document.createElement('div');
    tip.className = 'tip';
    tip.innerHTML = `<b>${esc(e.t)}</b><span>${mathHTML(e.d)}</span>`;
    document.body.appendChild(tip);
    const r = el.getBoundingClientRect();
    const w = Math.min(300, window.innerWidth - 24);
    tip.style.width = w + 'px';
    tip.style.left = Math.max(12, Math.min(window.innerWidth - w - 12, r.left + r.width / 2 - w / 2)) + 'px';
    const below = r.bottom + 10 + tip.offsetHeight < window.innerHeight;
    tip.style.top = (below ? r.bottom + 10 : r.top - 10 - tip.offsetHeight) + 'px';
    sfx.tap();
  }
  window.addEventListener('scroll', closeTip, { passive: true });

  // ------------------------------------------------------------------
  // Ikoner (enkle SVG-er)
  // ------------------------------------------------------------------
  const I = {
    flame: (on = true) => `<svg viewBox="0 0 24 24" class="ic"><path fill="${on ? '#ff9600' : '#e5e5e5'}" d="M12 2c1 3.5 5 6 5 11a5 5 0 0 1-10 0c0-2.2 1-3.6 2-4.6.2 1.6 1 2.6 2 2.9C10.5 8.5 11 5 12 2z"/><path fill="${on ? '#ffc800' : '#f2f2f2'}" d="M12 12c1 1.4 2.6 2.4 2.6 4.4a2.6 2.6 0 0 1-5.2 0c0-1.4.9-2.4 2.6-4.4z"/></svg>`,
    heart: (on = true) => `<svg viewBox="0 0 24 24" class="ic"><path fill="${on ? '#ff4b4b' : '#e5e5e5'}" d="M12 21s-7.5-4.6-9.6-9.2C.8 8.3 2.8 4.5 6.4 4.5c2.2 0 3.5 1.2 4.2 2.3h2.8c.7-1.1 2-2.3 4.2-2.3 3.6 0 5.6 3.8 4 7.3C19.5 16.4 12 21 12 21z"/><path fill="#fff" opacity=".45" d="M6 7.5c-1.4.2-2.2 1.6-1.8 3 .3-1.2 1-2 2.2-2.3z"/></svg>`,
    bolt: () => `<svg viewBox="0 0 24 24" class="ic"><path fill="#ffc800" d="M13.5 2 4 13.5h6.5L9.5 22 20 9.5h-6.5z"/></svg>`,
    star: () => `<svg viewBox="0 0 24 24" class="nic"><path fill="#fff" d="m12 2.8 2.8 5.8 6.3.8-4.6 4.4 1.2 6.3L12 17l-5.7 3.1 1.2-6.3L2.9 9.4l6.3-.8z"/></svg>`,
    check: () => `<svg viewBox="0 0 24 24" class="nic"><path fill="none" stroke="#fff" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" d="m5 12.5 4.5 4.5L19 7.5"/></svg>`,
    lock: () => `<svg viewBox="0 0 24 24" class="nic"><rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="currentColor"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none" stroke="currentColor" stroke-width="2.6"/></svg>`,
    chest: (open) => `<svg viewBox="0 0 48 48" class="nic big"><rect x="6" y="${open ? 22 : 18}" width="36" height="${open ? 20 : 24}" rx="4" fill="#d18e3f"/><rect x="6" y="${open ? 10 : 12}" width="36" height="${open ? 8 : 10}" rx="4" fill="#e6a656" transform="${open ? 'rotate(-14 6 18)' : ''}"/><rect x="20" y="${open ? 24 : 20}" width="8" height="9" rx="2" fill="#ffc800"/><rect x="6" y="${open ? 30 : 26}" width="36" height="3" fill="#b8742d"/></svg>`,
    trophy: () => `<svg viewBox="0 0 48 48" class="nic big"><path fill="#ffc800" d="M14 8h20v10a10 10 0 0 1-20 0z"/><path fill="none" stroke="#ffc800" stroke-width="3.5" d="M14 11H8v3a6 6 0 0 0 6 6M34 11h6v3a6 6 0 0 1-6 6"/><rect x="21" y="27" width="6" height="7" fill="#e5a800"/><rect x="15" y="34" width="18" height="6" rx="2" fill="#e5a800"/></svg>`,
    book: () => `<svg viewBox="0 0 24 24" class="ic"><path fill="currentColor" d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v16H6.5a1 1 0 0 0 0 2H20v2H6.5A2.5 2.5 0 0 1 4 19.5z"/></svg>`,
    home: () => `<svg viewBox="0 0 24 24" class="ic"><path fill="currentColor" d="M3 11 12 3l9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>`,
    shield: () => `<svg viewBox="0 0 24 24" class="ic"><path fill="currentColor" d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z"/></svg>`,
    target: () => `<svg viewBox="0 0 24 24" class="ic"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>`,
    user: () => `<svg viewBox="0 0 24 24" class="ic"><circle cx="12" cy="8" r="4.5" fill="currentColor"/><path fill="currentColor" d="M3.5 21a8.5 8.5 0 0 1 17 0z"/></svg>`,
    x: () => `<svg viewBox="0 0 24 24" class="ic"><path stroke="currentColor" stroke-width="3" stroke-linecap="round" d="m6 6 12 12M18 6 6 18"/></svg>`,
    clock: () => `<svg viewBox="0 0 24 24" class="ic"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>`,
    aim: () => `<svg viewBox="0 0 24 24" class="ic"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="m8 12 3 3 5-6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>`,
    sigma: () => `<svg viewBox="0 0 64 64" class="logo-ic"><rect x="4" y="4" width="56" height="56" rx="14" fill="#ce82ff"/><path d="M44 16H20l14 16-14 16h24" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    exam: () => `<svg viewBox="0 0 48 48" class="nic big"><rect x="9" y="5" width="30" height="38" rx="4" fill="#fff" stroke="#ff4b4b" stroke-width="3"/><path d="M15 15h18M15 22h18M15 29h11" stroke="#afafaf" stroke-width="3" stroke-linecap="round"/><circle cx="34" cy="35" r="8" fill="#ff4b4b"/><path d="m30.5 35 2.5 2.5 4.5-5" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    repeat: () => `<svg viewBox="0 0 24 24" class="ic"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M4 12a8 8 0 0 1 13.7-5.6M20 12a8 8 0 0 1-13.7 5.6"/><path fill="currentColor" d="M19.5 3v5.5H14zM4.5 21v-5.5H10z"/></svg>`,
    dumbbell: () => `<svg viewBox="0 0 24 24" class="ic"><g fill="currentColor"><rect x="1.5" y="9" width="3" height="6" rx="1"/><rect x="4.5" y="6.5" width="3.5" height="11" rx="1.2"/><rect x="8" y="10.8" width="8" height="2.4"/><rect x="16" y="6.5" width="3.5" height="11" rx="1.2"/><rect x="19.5" y="9" width="3" height="6" rx="1"/></g></svg>`,
    calc: () => `<svg viewBox="0 0 24 24" class="ic"><rect x="4" y="2" width="16" height="20" rx="3" fill="currentColor"/><rect x="7" y="5" width="10" height="4" rx="1" fill="#fff"/><g fill="#fff"><circle cx="8.5" cy="13" r="1.2"/><circle cx="12" cy="13" r="1.2"/><circle cx="15.5" cy="13" r="1.2"/><circle cx="8.5" cy="17" r="1.2"/><circle cx="12" cy="17" r="1.2"/><circle cx="15.5" cy="17" r="1.2"/></g></svg>`,
    ball: () => `<svg viewBox="0 0 64 64" class="logo-ic"><circle cx="32" cy="32" r="27" fill="#ff9600"/><g fill="none" stroke="#7a3d00" stroke-width="3"><path d="M5 32h54M32 5v54"/><path d="M13 13c8 8 8 30 0 38M51 13c-8 8-8 30 0 38"/></g></svg>`,
    crack: () => `<svg viewBox="0 0 72 66" class="crack"><path d="M20 6 30 22 22 30 34 44 28 60M52 10 44 24 52 34 46 48" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    atom: () => `<svg viewBox="0 0 64 64" class="logo-ic"><g fill="none" stroke="#58cc02" stroke-width="4"><ellipse cx="32" cy="32" rx="27" ry="10"/><ellipse cx="32" cy="32" rx="27" ry="10" transform="rotate(60 32 32)"/><ellipse cx="32" cy="32" rx="27" ry="10" transform="rotate(-60 32 32)"/></g><circle cx="32" cy="32" r="6" fill="#58cc02"/></svg>`,
  };

  // Enkel maskot: et smilende atom.
  const mascot = (mood = 'happy') => `<svg viewBox="0 0 120 120" class="mascot ${mood}"><g fill="none" stroke="#1cb0f6" stroke-width="5" opacity=".9"><ellipse cx="60" cy="62" rx="54" ry="18" transform="rotate(25 60 62)"/><ellipse cx="60" cy="62" rx="54" ry="18" transform="rotate(-25 60 62)"/></g><circle cx="60" cy="62" r="32" fill="#58cc02"/><circle cx="60" cy="62" r="32" fill="url(#mg)"/><defs><radialGradient id="mg" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><circle cx="48" cy="56" r="8" fill="#fff"/><circle cx="72" cy="56" r="8" fill="#fff"/><circle cx="${mood === 'sad' ? 48 : 50}" cy="${mood === 'sad' ? 59 : 57}" r="4" fill="#333"/><circle cx="${mood === 'sad' ? 72 : 74}" cy="${mood === 'sad' ? 59 : 57}" r="4" fill="#333"/>${mood === 'sad' ? '<path d="M50 80q10-8 20 0" fill="none" stroke="#333" stroke-width="4" stroke-linecap="round"/>' : '<path d="M48 72q12 12 24 0" fill="#7a1d1d" stroke="#333" stroke-width="3" stroke-linecap="round"/>'}<circle cx="12" cy="40" r="6" fill="#1cb0f6"/><circle cx="108" cy="86" r="6" fill="#1cb0f6"/></svg>`;

  // ------------------------------------------------------------------
  // Tilstand
  // ------------------------------------------------------------------
  function fresh() {
    return {
      v: 1, created: Date.now(), xp: 0, xpDays: {}, goal: 20,
      streak: { n: 0, last: null, best: 0 },
      hearts: { n: MAX_HEARTS, t: Date.now() },
      prog: {}, chests: {}, reviews: {},
      stats: { lessons: 0, perfect: 0, maxCombo: 0, correct: 0, answered: 0, seconds: 0 },
      today: null, quests: null, boost: 0,
      league: null, leagueBest: 0,
      sound: true, theme: 'auto', name: '',
      course: 'fysikk1', mem: {}, wrong: {},
    };
  }
  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      if (s && s.v === 1) { const base = fresh(); return Object.assign(base, s, { stats: Object.assign(base.stats, s.stats) }); }
    } catch (err) { /* ignorer */ }
    return fresh();
  }
  let S = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (err) { /* ignorer */ } }

  // UI-tilstand som ikke lagres
  const UI = { tab: 'learn', open: -1, modal: null, scrollToCurrent: true };
  let LESSON = null;

  // ------------------------------------------------------------------
  // Kursstien
  // ------------------------------------------------------------------
  // Ferdigheter med mange nye begreper deles i trinn med høyst tre nye begreper hver.
  // parts: [{ intro: [indekser], items: [indekser] }, …]. Oppgaver som ikke er nevnt, havner i siste trinn.
  const SPLIT_IDS = [];
  function expandSkill(sk) {
    if (!sk.parts) return [sk];
    const used = new Set(sk.parts.flatMap((p) => p.items || []));
    return sk.parts.map((p, k) => {
      const last = k === sk.parts.length - 1;
      const items = (p.items || []).map((i) => sk.items[i]).concat(last ? sk.items.filter((_, i) => !used.has(i)) : []);
      const id = k === 0 ? sk.id : sk.id + String.fromCharCode(97 + k);
      if (k) SPLIT_IDS.push([sk.id, id]);
      return { id, title: p.title || `${sk.title} ${k + 1}`, intro: (p.intro || []).map((i) => sk.intro[i]), items, optional: sk.optional };
    });
  }
  COURSES.forEach((c) => {
    const nodes = [];
    c.concepts = [];
    c.units.forEach((u) => { u.skills = u.skills.flatMap(expandSkill); });
    c.units.forEach((u, ui) => {
      u.index = ui;
      u.first = nodes.length;
      u.course = c;
      u.skills.forEach((sk, si) => {
        sk.unit = u;
        sk.items = sk.items.map((it, k) => ({ ...it, id: `${sk.id}#${k}`, skill: sk.id }));
        sk.items.forEach((it) => { if (it.t === 'num') { const g1 = it.gen(), g2 = it.gen(); it.fixed = g1.q === g2.q; } });
        sk.concepts = (sk.intro || []).map(([term, name, d, kind], k) => ({ term, name, d, kind: kind || 'b', id: `${sk.id}~${k}`, skill: sk.id, unit: u }));
        c.concepts.push(...sk.concepts);
        // begrepene som er i bruk på dette punktet i enheten (for repetisjon i oppgavenoder)
        sk.active = c.concepts.filter((cc) => cc.unit === u).slice(-6);
        if (!sk.active.length) sk.active = c.concepts.slice(-4);
        nodes.push({ id: sk.id, type: 'skill', unit: u, skill: sk, title: sk.title, optional: !!sk.optional });
        if (si === 1 && u.skills.length > 2) nodes.push({ id: u.id + '-chest', type: 'chest', unit: u, title: 'Skattekiste' });
      });
      if (u.exam) nodes.push({ id: u.id + '-review', type: 'exam', unit: u, title: u.exam.title });
      else nodes.push({ id: u.id + '-review', type: 'review', unit: u, title: 'Enhetsrepetisjon' });
    });
    nodes.forEach((n, i) => { n.i = i; });
    c.nodes = nodes;
  });
  function setCourse(id) {
    COURSE = COURSES.find((c) => c.id === id) || COURSES[0];
    NODES = COURSE.nodes;
    S.course = COURSE.id;
  }
  setCourse(S.course);

  // Når en ferdighet deles i trinn eller flyttes, beholder du fremgangen du allerede hadde.
  (function migrate() {
    S.migr = S.migr || {};
    const pairs = SPLIT_IDS.slice();
    COURSES.forEach((c) => Object.entries(c.migrate || {}).forEach(([old, news]) => news.forEach((nw) => pairs.push([old, nw]))));
    let changed = false;
    for (const [old, nw] of pairs) {
      const key = old + '>' + nw;
      if (S.migr[key]) continue;
      S.migr[key] = 1; changed = true;
      if (S.prog[old] && !S.prog[nw]) S.prog[nw] = S.prog[old];
      if (S.mem[old] && !S.mem[nw]) S.mem[nw] = { ...S.mem[old] };
    }
    if (changed) save();
  })();

  const nodeDone = (n) => (n.type === 'skill' ? (S.prog[n.id] || 0) >= LEVELS : n.type === 'chest' ? !!S.chests[n.id] : !!S.reviews[n.unit.id]);
  // Valgfrie ferdigheter (E1/E2) blokkerer ikke stien videre.
  // Fremdrift i prosent: fullførte leksjoner og enhetsrepetisjoner. Temaer du ikke har vært innom, står på 0 %.
  function progressPct(nodes) {
    let have = 0, need = 0;
    for (const n of nodes) {
      if (n.optional || n.type === 'chest') continue;
      if (n.type === 'skill') { need += LEVELS; have += Math.min(LEVELS, S.prog[n.id] || 0); }
      else { need += 1; have += S.reviews[n.unit.id] ? 1 : 0; }
    }
    return need ? Math.round((100 * have) / need) : 0;
  }
  function currentIndex(nodes = NODES) { const i = nodes.findIndex((n) => !n.optional && !nodeDone(n)); return i < 0 ? nodes.length : i; }

  // ------------------------------------------------------------------
  // Styrke per ferdighet (repetisjon over tid)
  // Styrken halveres etter h dager. Gode økter dobler h, svake økter halverer den.
  // ------------------------------------------------------------------
  function strength(id) {
    const m = S.mem[id];
    if (!m) return 1;
    return Math.pow(2, -(Date.now() - m.t) / (m.h * DAY_MS));
  }
  const practiced = (id) => (S.prog[id] || 0) > 0;
  const isWeak = (id) => practiced(id) && strength(id) < 0.5;
  function updateMem(id, acc) {
    const m = S.mem[id];
    const good = acc >= 0.8;
    if (!m) S.mem[id] = { t: Date.now(), h: good ? 2 : 1 };
    else { m.h = good ? Math.min(120, m.h * 2) : Math.max(1, m.h / 2); m.t = Date.now(); }
  }
  function courseSkills(c = COURSE) { return c.nodes.filter((n) => n.type === 'skill').map((n) => n.skill); }
  function weakest(n = 3) {
    return courseSkills().filter((sk) => practiced(sk.id)).sort((a, b) => strength(a.id) - strength(b.id)).slice(0, n);
  }
  const weakCount = () => courseSkills().filter((sk) => isWeak(sk.id)).length;

  // ------------------------------------------------------------------
  // Dag, rekke, hjerter, XP
  // ------------------------------------------------------------------
  const QPOOL = [
    { s: 'lessons', n: [2, 3], txt: (n) => `Fullfør ${n} leksjoner` },
    { s: 'acc90', n: [1, 2], txt: (n) => (n > 1 ? `Få minst 90 % riktig i ${n} leksjoner` : 'Få minst 90 % riktig i en leksjon') },
    { s: 'combo', n: [5, 10], txt: (n) => `Svar riktig på ${n} oppgaver på rad` },
    { s: 'perfect', n: [1], txt: () => 'Fullfør en leksjon uten feil' },
    { s: 'minutes', n: [5, 10], txt: (n) => `Lær i ${n} minutter` },
  ];
  function makeQuests(k) {
    const r = rng(hash('q' + k));
    const xpN = [20, 30, 40][Math.floor(r() * 3)];
    const others = shuffle(QPOOL, r).slice(0, 2).map((q) => ({ s: q.s, n: q.n[Math.floor(r() * q.n.length)] }));
    return [{ s: 'xp', n: xpN }, ...others].map((q) => ({ ...q, claimed: false }));
  }
  const questText = (q) => (q.s === 'xp' ? `Tjen ${q.n} XP` : QPOOL.find((p) => p.s === q.s).txt(q.n));
  const questVal = (q) => Math.min(q.n, q.s === 'minutes' ? Math.floor((S.today.seconds || 0) / 60) : S.today[q.s] || 0);

  function today() {
    const k = dayKey();
    if (!S.today || S.today.day !== k) {
      S.today = { day: k, xp: 0, lessons: 0, acc90: 0, combo: 0, perfect: 0, seconds: 0 };
      S.quests = makeQuests(k);
    }
    return S.today;
  }
  function streakNow() {
    const s = S.streak;
    if (!s.last) return 0;
    const t = dayKey();
    return s.last === t || s.last === addDays(t, -1) ? s.n : 0;
  }
  function extendStreak() {
    const t = dayKey(), s = S.streak;
    if (s.last === t) return false;
    s.n = s.last === addDays(t, -1) ? s.n + 1 : 1;
    s.last = t;
    s.best = Math.max(s.best, s.n);
    return true;
  }
  function hearts() {
    const hh = S.hearts;
    if (hh.n >= MAX_HEARTS) { hh.n = MAX_HEARTS; hh.t = Date.now(); return hh.n; }
    const gain = Math.floor((Date.now() - hh.t) / HEART_MS);
    if (gain > 0) { hh.n = Math.min(MAX_HEARTS, hh.n + gain); hh.t += gain * HEART_MS; }
    return hh.n;
  }
  function loseHeart() { hearts(); S.hearts.n = Math.max(0, S.hearts.n - 1); }
  function gainHeart() { hearts(); S.hearts.n = Math.min(MAX_HEARTS, S.hearts.n + 1); }
  function nextHeartText() {
    const ms = Math.max(0, S.hearts.t + HEART_MS - Date.now());
    const hrs = Math.floor(ms / 3600000), mins = Math.ceil((ms % 3600000) / 60000);
    return hrs > 0 ? `${hrs} t ${mins} min` : `${mins} min`;
  }
  const boostActive = () => Date.now() < S.boost;
  function addXp(n) {
    if (boostActive()) n *= 2;
    const k = dayKey();
    S.xp += n;
    S.xpDays[k] = (S.xpDays[k] || 0) + n;
    today().xp += n;
    return n;
  }
  const xpToday = () => S.xpDays[dayKey()] || 0;

  // ------------------------------------------------------------------
  // Liga: toppliste over dagene dine med mest XP (uke, måned eller år)
  // ------------------------------------------------------------------
  function periodStart(kind, d = new Date()) {
    if (kind === 'week') return weekStart(d);
    if (kind === 'month') return dayKey(new Date(d.getFullYear(), d.getMonth(), 1));
    return dayKey(new Date(d.getFullYear(), 0, 1));
  }
  // Alle dager fra periodens start til i dag, rangert. Like poengsummer deler plass.
  function dayBoard(kind) {
    const end = dayKey();
    const rows = [];
    for (let k = periodStart(kind); k <= end; k = addDays(k, 1)) rows.push({ day: k, xp: S.xpDays[k] || 0, today: k === end });
    rows.sort((x, y) => y.xp - x.xp || (x.day < y.day ? -1 : 1));
    rows.forEach((r, i) => { r.rank = i > 0 && rows[i - 1].xp === r.xp ? rows[i - 1].rank : i + 1; });
    return rows;
  }
  const bestDay = () => Object.values(S.xpDays).reduce((m, x) => Math.max(m, x), 0);
  const dayLabel = (k, kind) => cap(parseDay(k).toLocaleDateString('nb-NO', kind === 'year' ? { weekday: 'short', day: 'numeric', month: 'short' } : { weekday: 'long', day: 'numeric', month: 'short' }));
  function cap(t) { return t.charAt(0).toUpperCase() + t.slice(1); }

  // ------------------------------------------------------------------
  // Prestasjoner
  // ------------------------------------------------------------------
  const ACH = [
    { name: 'Ildsjel', icon: '🔥', desc: (n) => `Oppnå en dagsrekke på ${n} dager`, val: () => S.streak.best, t: [3, 7, 14, 30, 60, 100, 365] },
    { name: 'Vismann', icon: '🦉', desc: (n) => `Tjen ${n} XP`, val: () => S.xp, t: [100, 250, 500, 1000, 2000, 5000, 10000] },
    { name: 'Lærd', icon: '📚', desc: (n) => `Fullfør ${n} leksjoner`, val: () => S.stats.lessons, t: [5, 15, 30, 60, 100, 200] },
    { name: 'Perfeksjonist', icon: '💯', desc: (n) => `Fullfør ${n} leksjoner uten feil`, val: () => S.stats.perfect, t: [1, 5, 15, 30, 60] },
    { name: 'Erobrer', icon: '🏆', desc: (n) => `Fullfør ${n} enheter`, val: () => Object.keys(S.reviews).length, t: [1, 3, 5, 8, 10] },
    { name: 'Skarpskytter', icon: '🎯', desc: (n) => `Svar riktig på ${n} oppgaver på rad`, val: () => S.stats.maxCombo, t: [5, 10, 20, 30, 50] },
    { name: 'Rekorddag', icon: '💎', desc: (n) => `Tjen ${n} XP på én dag`, val: bestDay, t: [50, 100, 200, 400, 800] },
  ];
  function achLevel(a) { const v = a.val(); let l = 0; while (l < a.t.length && v >= a.t[l]) l++; return l; }

  // ------------------------------------------------------------------
  // Lyd
  // ------------------------------------------------------------------
  let actx = null;
  function tone(seq) {
    if (!S.sound) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === 'suspended') actx.resume();
      let t = actx.currentTime;
      seq.forEach(([freq, dur, type = 'sine', vol = 0.18]) => {
        const o = actx.createOscillator(), gn = actx.createGain();
        o.type = type; o.frequency.value = freq;
        gn.gain.setValueAtTime(vol, t);
        gn.gain.exponentialRampToValueAtTime(0.001, t + dur);
        o.connect(gn).connect(actx.destination);
        o.start(t); o.stop(t + dur);
        t += dur * 0.8;
      });
    } catch (err) { /* ingen lyd */ }
  }
  const sfx = {
    right: () => tone([[784, 0.09], [1047, 0.2]]),
    wrong: () => tone([[220, 0.12, 'square', 0.08], [180, 0.25, 'square', 0.08]]),
    done: () => tone([[523, 0.12], [659, 0.12], [784, 0.12], [1047, 0.35]]),
    tap: () => tone([[600, 0.04, 'sine', 0.06]]),
  };

  // ------------------------------------------------------------------
  // Oppgaver: instansiering og retting
  // ------------------------------------------------------------------
  function instantiate(item) {
    const x = makeInstance(item);
    if (x) { x.id = item.id; x.skill = item.skill; x.src = item.src; x.noCalc = !!item.u; x.monoOpts = !!item.monoOpts; }
    return x;
  }
  function makeInstance(item) {
    if (item.t === 'num') {
      const g = item.gen();
      return { t: 'num', q: g.q, a: g.a, u: g.u, e: g.e, tol: g.tol, input: '' };
    }
    if (item.t === 'tf') return { t: 'mc', q: item.q, opts: ['Sant', 'Usant'], correct: item.ans ? 0 : 1, e: item.e, sel: -1, tf: true };
    if (item.t === 'mc') {
      const order = shuffle(item.opts.map((_, i) => i));
      return { t: 'mc', q: item.q, code: item.code, opts: order.map((i) => item.opts[i]), correct: order.indexOf(0), e: item.e, sel: -1 };
    }
    if (item.t === 'bank') {
      const tokens = shuffle([...item.ans, ...item.dis]).map((text, id) => ({ id, text }));
      return { t: 'bank', q: item.q, tpl: item.tpl, ans: item.ans, any: item.any, code: item.code, order: item.order, tokens, slots: item.ans.map(() => null), e: item.e };
    }
    if (item.t === 'match') {
      const left = shuffle(item.pairs.map((p, i) => ({ i, text: p[0] })));
      const right = shuffle(item.pairs.map((p, i) => ({ i, text: p[1] })));
      return { t: 'match', q: item.q, left, right, done: [], selL: null, selR: null, bad: null };
    }
    return null;
  }
  function parseNum(str) {
    let s = String(str).trim().toLowerCase()
      .replace(/−/g, '-').replace(/\s+/g, '').replace(/,/g, '.')
      .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]/g, (ch) => ({ '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-' }[ch]));
    const fr = s.match(/^([-+]?\d*\.?\d+)\/(\d*\.?\d+)$/);
    if (fr) return parseFloat(fr[1]) / parseFloat(fr[2]);
    const m = s.match(/^([-+]?\d*\.?\d+)(?:(?:e|[*·x×]10\^?)([-+]?\d+))?/);
    if (!m) return NaN;
    return parseFloat(m[1]) * (m[2] !== undefined ? Math.pow(10, parseInt(m[2], 10)) : 1);
  }
  function roundSig(x, n) { if (x === 0) return 0; const p = Math.pow(10, n - 1 - Math.floor(Math.log10(Math.abs(x)))); return Math.round(x * p) / p; }
  function numOk(user, ans, tol = 0.02) {
    if (!isFinite(user)) return false;
    if (Math.abs(ans) < 1e-12) return Math.abs(user) < 1e-9;
    if (Math.abs(user - ans) <= tol * Math.abs(ans)) return true;
    return Math.abs(user - roundSig(ans, 2)) <= 1e-9 * Math.abs(ans);
  }
  function grade(x) {
    if (x.t === 'mc') return x.sel === x.correct;
    if (x.t === 'num') return numOk(parseNum(x.input), x.a, x.tol);
    if (x.t === 'bank') {
      const got = x.slots.map((id) => x.tokens[id].text);
      if (x.any) return [...got].sort().join('|') === [...x.ans].sort().join('|');
      return got.join('|') === x.ans.join('|');
    }
    return true;
  }
  function canCheck(x) {
    if (x.t === 'mc') return x.sel >= 0;
    if (x.t === 'num') return x.input.trim() !== '';
    if (x.t === 'bank') return x.slots.every((s) => s !== null);
    return false;
  }
  function correctText(x) {
    if (x.t === 'mc') return x.opts[x.correct];
    if (x.t === 'num') return `${fmt(x.a)} ${x.u}`;
    if (x.t === 'bank' && x.order) return x.ans.map((a, i) => `${i + 1}. ${a}`).join('\n');
    if (x.t === 'bank') { let k = 0; return x.tpl.replace(/▢/g, () => x.ans[k++]); }
    return '';
  }

  // ------------------------------------------------------------------
  // Kalkulator (enkel, uten eval). Vinkler regnes i grader.
  // ------------------------------------------------------------------
  function calcEval(src) {
    const toks = [];
    const s = src.replace(/,/g, '.').replace(/−/g, '-').replace(/\s+/g, '');
    let i = 0;
    while (i < s.length) {
      const ch = s[i];
      const num = s.slice(i).match(/^(\d+\.?\d*|\.\d+)(e[-+]?\d+)?/i);
      if (num) { toks.push({ t: 'n', v: parseFloat(num[0]) }); i += num[0].length; continue; }
      const fn = s.slice(i).match(/^(sin|cos|tan|√|ln|log)/);
      if (fn) { toks.push({ t: 'f', v: fn[1] }); i += fn[1].length; continue; }
      if (ch === 'π') { toks.push({ t: 'n', v: Math.PI }); i++; continue; }
      if ('+-−×*÷/^²()·'.includes(ch)) { toks.push({ t: 'o', v: ch === '−' ? '-' : ch === '×' || ch === '·' ? '*' : ch === '÷' ? '/' : ch }); i++; continue; }
      throw new Error('tegn');
    }
    let p = 0;
    const peek = () => toks[p];
    const isOp = (v) => peek() && peek().t === 'o' && peek().v === v;
    const startsFactor = () => peek() && (peek().t === 'n' || peek().t === 'f' || (peek().t === 'o' && peek().v === '('));
    const rad = (d) => (d * Math.PI) / 180;
    const F = { sin: (x) => Math.sin(rad(x)), cos: (x) => Math.cos(rad(x)), tan: (x) => Math.tan(rad(x)), '√': Math.sqrt, ln: Math.log, log: Math.log10 };
    function expr() {
      let v = term();
      while (isOp('+') || isOp('-')) { const o = toks[p++].v; const r = term(); v = o === '+' ? v + r : v - r; }
      return v;
    }
    function term() {
      let v = unary();
      for (;;) {
        if (isOp('*') || isOp('/')) { const o = toks[p++].v; const r = unary(); v = o === '*' ? v * r : v / r; }
        else if (startsFactor()) v *= unary(); // underforstått gange, f.eks. 2π
        else return v;
      }
    }
    function unary() {
      if (isOp('-')) { p++; return -unary(); }
      if (isOp('+')) { p++; return unary(); }
      return power();
    }
    function power() {
      const b = postfix();
      if (isOp('^')) { p++; return Math.pow(b, unary()); }
      return b;
    }
    function postfix() {
      let v = primary();
      while (isOp('²')) { p++; v = v * v; }
      return v;
    }
    function primary() {
      const tk = toks[p++];
      if (!tk) throw new Error('slutt');
      if (tk.t === 'n') return tk.v;
      if (tk.t === 'f') {
        let arg;
        if (isOp('(')) { p++; arg = expr(); if (isOp(')')) p++; } else arg = unary();
        return F[tk.v](arg);
      }
      if (tk.v === '(') { const v = expr(); if (isOp(')')) p++; return v; }
      throw new Error('uventet');
    }
    const v = expr();
    if (p < toks.length) throw new Error('rest');
    return v;
  }
  function calcFmt(v) {
    if (!isFinite(v)) return 'Feil';
    if (v === 0) return '0';
    const a = Math.abs(v);
    let out = a >= 1e9 || a < 1e-4 ? v.toExponential(6).replace(/\.?0+e/, 'e').replace('e+', 'e') : String(+v.toPrecision(10));
    return out.replace('.', ',');
  }
  const CALC_KEYS = [
    ['C', '(', ')', '⌫', '÷'],
    ['sin', 'cos', 'tan', '√', '×'],
    ['7', '8', '9', '^', '−'],
    ['4', '5', '6', 'x²', '+'],
    ['1', '2', '3', '·10^', 'π'],
    ['0', ',', 'e', 'ans', '='],
  ];
  function calcPanel(L) {
    const c = L.calc;
    return `<div class="calc" data-stop>
      <div class="calc-disp"><div class="calc-expr" id="calcExpr">${esc(c.expr) || '&nbsp;'}</div><div class="calc-res" id="calcRes">${esc(c.res || '')}</div></div>
      <div class="calc-keys">${CALC_KEYS.flat().map((k) => `<button class="ck ${/^[0-9,]$/.test(k) ? 'd' : k === '=' ? 'eq' : 'op'}" data-a="ck" data-k="${k}">${k === 'ans' ? 'Ans' : k === 'e' ? 'EXP' : k}</button>`).join('')}</div>
      <button class="btn blue wide calc-use" data-a="calcUse" ${c.last === undefined ? 'disabled' : ''}>Bruk ${c.last !== undefined ? esc(calcFmt(c.last)) : 'svaret'} som svar</button>
      <p class="hint">Vinkler regnes i grader. EXP gir tierpotens: 6,6 EXP −34 = 6,6 · 10⁻³⁴.</p>
    </div>`;
  }
  function calcKey(k) {
    const L = LESSON, c = L.calc;
    if (c.fresh && /^[0-9,(π]|sin|cos|tan|√/.test(k)) c.expr = '';
    c.fresh = false;
    if (k === 'C') { c.expr = ''; c.res = ''; }
    else if (k === '⌫') c.expr = c.expr.replace(/(sin\(|cos\(|tan\(|√\(|·10\^|.)$/, '');
    else if (k === '=') {
      try { const v = calcEval(c.expr); c.last = v; c.res = '= ' + calcFmt(v); c.expr = calcFmt(v); c.fresh = true; }
      catch (err) { c.res = 'Feil i uttrykket'; }
    }
    else if (k === 'ans') { if (c.last !== undefined) c.expr += calcFmt(c.last); }
    else if (k === 'x²') c.expr += '²';
    else if (['sin', 'cos', 'tan', '√'].includes(k)) c.expr += k + '(';
    else c.expr += k;
    const ex = document.getElementById('calcExpr'), rs = document.getElementById('calcRes');
    if (ex) ex.textContent = c.expr || '\u00a0';
    if (rs) rs.textContent = c.res || '';
    const use = document.querySelector('[data-a="calcUse"]');
    if (use && c.last !== undefined) { use.disabled = false; use.textContent = `Bruk ${calcFmt(c.last)} som svar`; }
    sfx.tap();
  }

  // ------------------------------------------------------------------
  // Leksjoner
  // ------------------------------------------------------------------
  // Nye begreper, symboler og formler kommer ett og ett, slik Duolingo introduserer nye ord:
  // først et kort, så en oppgave på akkurat det begrepet, før neste begrep kommer.
  // Hver node har høyst tre nye begreper, og de øves igjen i de neste leksjonene.
  const KIND_LABEL = { f: 'Ny formel', s: 'Nytt symbol', b: 'Nytt begrep' };
  const cardOf = (c) => ({ t: 'card', term: c.term, name: c.name, d: c.d, kind: KIND_LABEL[c.kind] || KIND_LABEL.b, skill: c.skill });
  const normTxt = (t) => String(t).replace(/\s+/g, '').toLowerCase();
  function uniqueOpts(correct, pool, n = 3) {
    const seen = new Set([normTxt(correct)]);
    const out = [];
    for (const o of pool) {
      const k = normTxt(o);
      if (!o || seen.has(k)) continue;
      seen.add(k); out.push(o);
      if (out.length >= n) break;
    }
    return out;
  }
  // Andre begreper i samme kurs som feilalternativer: helst samme type og samme enhet.
  function distractorPool(c, key) {
    const all = COURSE.concepts.filter((o) => o !== c);
    const at = COURSE.concepts.indexOf(c);
    // helst begreper du allerede har møtt, så feilalternativene ikke avslører det som kommer senere
    const score = (o) => (o.kind === c.kind ? 2 : 0) + (o.unit === c.unit ? 1 : 0) + (COURSE.concepts.indexOf(o) < at ? 1.5 : 0) + Math.random() * 1.5;
    return all.map((o) => ({ o, w: score(o) })).sort((x, y) => y.w - x.w).map(({ o }) => (typeof key === 'function' ? key(o) : o[key]));
  }
  // Deler en formel i venstre og høyre side: «v = v₀ + at» blir ['v', 'v₀ + at'].
  function formulaSides(term) {
    const lines = String(term).split('\n').filter((l) => / (=|⇔) /.test(l));
    if (!lines.length) return null;
    const line = pickR(lines);
    const m = line.match(/^(.*?) (=|⇔) (.*)$/);
    return m ? { lhs: m[1], op: m[2], rhs: m[3] } : null;
  }
  const rhsOf = (o) => { const f = formulaSides(o.term); return f ? f.rhs : null; };
  function makeDrill(c, type) {
    const types = [];
    if (c.kind === 'f' && formulaSides(c.term)) types.push('fill');
    types.push('name', 'term');
    if (!type || !types.includes(type)) type = pickR(types);
    const e = `${c.term}\n${c.name}. ${c.d}`;
    const base = { id: `${c.id}${type[0]}`, skill: c.skill, drill: true };
    if (type === 'fill') {
      const f = formulaSides(c.term);
      const dis = uniqueOpts(f.rhs, distractorPool(c, rhsOf));
      if (dis.length >= 2) return { ...base, t: 'mc', q: `Fullfør formelen (${c.name}):\n${f.lhs} ${f.op} ?`, opts: [f.rhs, ...dis], e };
      type = 'name';
    }
    if (type === 'term') {
      const dis = uniqueOpts(c.term, distractorPool(c, 'term'));
      const q = c.kind === 'f' ? `Hvilken formel er «${c.name}»?` : c.kind === 's' ? `Hvilket symbol står for «${c.name}»?` : `Hvilket begrep passer til «${c.name}»?`;
      if (dis.length >= 2) return { ...base, t: 'mc', q, opts: [c.term, ...dis], e };
    }
    const dis = uniqueOpts(c.name, distractorPool(c, 'name'));
    if (dis.length < 2) return null;
    const q = c.kind === 'f' ? `Hva sier denne formelen?\n${c.term}` : c.kind === 's' ? `Hva står dette symbolet for?\n${c.term}` : `Hva betyr «${c.term}»?`;
    return { ...base, id: `${c.id}n`, t: 'mc', q, opts: [c.name, ...dis], e };
  }
  // Velger begreper å repetere: de du har bommet på kommer oftere.
  function drillsFor(cs, n) {
    const picked = cs.map((c) => ({ c, w: ['f', 'n', 't'].reduce((a, k) => a + (S.wrong[c.id + k] || 0), 0) * 2 + Math.random() * 1.5 }))
      .sort((x, y) => y.w - x.w).slice(0, n).map(({ c }) => c);
    return picked.map((c) => makeDrill(c)).filter(Boolean);
  }
  function conceptMatch(cs) {
    const more = COURSE.concepts.filter((o) => !cs.includes(o) && o.unit === cs[0].unit && COURSE.concepts.indexOf(o) < COURSE.concepts.indexOf(cs[0]));
    const list = cs.concat(more.slice(-Math.max(0, 4 - cs.length)));
    if (list.length < 3) return null;
    const pairs = list.slice(0, 4).map((c) => [c.term, c.name]);
    if (new Set(pairs.map((p) => normTxt(p[1]))).size !== pairs.length || new Set(pairs.map((p) => normTxt(p[0]))).size !== pairs.length) return null;
    return { t: 'match', pairs, q: 'Koble sammen det du har lært', skill: cs[0].skill };
  }

  function buildItems(pool, n) {
    let list = shuffle(pool);
    // maks én koble-oppgave per leksjon
    let seenMatch = false;
    list = list.filter((it) => (it.t === 'match' ? (seenMatch ? false : (seenMatch = true)) : true));
    list = list.slice(0, n);
    // utledninger (sett stegene i rekkefølge) er kjernen der de finnes: minst tre per leksjon
    const orders = pool.filter((it) => it.order);
    const want = Math.min(3, orders.length);
    for (const it of shuffle(orders)) {
      if (list.filter((x) => x.order).length >= want) break;
      if (list.includes(it)) continue;
      const k = list.findIndex((x) => !x.order);
      if (k >= 0) list[k] = it; else list.push(it);
    }
    list = shuffle(list);
    // tilfeldige talloppgaver kan gjentas med nye tall, faste oppgaver gjentas ikke
    const gens = pool.filter((it) => it.t === 'num' && !it.fixed);
    while (list.length < n && gens.length) list.push(pickR(gens));
    return list;
  }
  const allItems = (skills) => skills.reduce((acc, sk) => acc.concat(sk.items), []);
  // Litt tidligere stoff blandes inn: helst fra samme enhet og fra ferdigheter som har blitt svake.
  function mixItems(node, n) {
    if (!node || n <= 0) return [];
    const prev = NODES.slice(0, node.i).filter((m) => m.type === 'skill' && !m.optional && practiced(m.id) && m.skill.items.length);
    const ranked = prev.map((m) => ({ m, w: (m.unit === node.unit ? 1 : 0) + (1 - strength(m.id)) + (node.i - m.i < 4 ? 0.6 : 0) + Math.random() * 0.8 }))
      .sort((x, y) => y.w - x.w).slice(0, n);
    return ranked.map(({ m }) => {
      const cs = m.skill.concepts;
      if (cs.length && Math.random() < 0.4) { const d = makeDrill(pickR(cs)); if (d) return d; }
      return pickR(m.skill.items.filter((it) => it.t !== 'match'));
    }).filter(Boolean);
  }
  // Setter inn elementer på tilfeldige plasser i siste halvdel av leksjonen.
  function sprinkle(list, extra) {
    const out = list.slice();
    for (const it of extra) out.splice(Math.floor(out.length / 2) + Math.floor(Math.random() * (Math.ceil(out.length / 2) + 1)), 0, it);
    return out;
  }
  function skillLesson(node, first) {
    const sk = node.skill;
    const cs = sk.concepts;
    if (first && cs.length) {
      const out = [];
      cs.forEach((c, k) => { out.push(cardOf(c)); const d = makeDrill(c, k % 2 ? 'term' : 'name'); if (d) out.push(d); });
      const m = cs.length >= 2 && conceptMatch(cs);
      if (m) out.push(m);
      const own = buildItems(sk.items.filter((it) => it.t !== 'match'), Math.max(4, LESSON_LEN - 3));
      const recall = drillsFor(cs, Math.min(2, cs.length));
      return out.concat(sprinkle(own, recall));
    }
    const nd = cs.length ? Math.min(3, cs.length) : Math.min(2, sk.active.length);
    const drills = drillsFor(cs.length ? cs : sk.active, nd);
    const mix = mixItems(node, 2);
    let own = buildItems(sk.items, LESSON_LEN - drills.length - mix.length + 1);
    let list = sprinkle(drills.slice(0, 1).concat(own, drills.slice(1)), mix);
    // for få egne oppgaver: fyll på med mer repetisjon i stedet for å gjenta samme oppgave
    if (list.length < LESSON_LEN) list = list.concat(mixItems(node, LESSON_LEN - list.length), drillsFor(cs.length ? cs : sk.active, Math.max(0, LESSON_LEN - list.length - 2)));
    const seen = new Set();
    list = list.filter((it) => !it.id || it.t === 'num' && !it.fixed || (seen.has(it.id) ? false : seen.add(it.id)));
    return list.slice(0, LESSON_LEN + 2);
  }
  // Øving på svake emner: oppgaver du har svart feil på før kommer oftere.
  function buildWeakItems(skills, n) {
    const scored = allItems(skills).map((it) => ({ it, w: (S.wrong[it.id] || 0) * 2 + Math.random() * 1.5 }));
    scored.sort((a, b) => b.w - a.w);
    let seenMatch = false;
    const list = [];
    for (const { it } of scored) {
      if (list.length >= n) break;
      if (it.t === 'match') { if (seenMatch) continue; seenMatch = true; }
      list.push(it);
    }
    const cs = skills.flatMap((sk) => (sk.concepts.length ? sk.concepts : sk.active));
    return shuffle(list).concat(drillsFor([...new Set(cs)], 2));
  }

  function startLesson(kind, node, opts = {}) {
    let items, title;
    if (opts.items) { items = opts.items; title = opts.title; }
    else if (kind === 'skill' || kind === 'redo') { items = skillLesson(node, kind === 'skill' && !(S.prog[node.id] || 0)); title = node.skill.title; }
    else if (kind === 'review') {
      const sks = node.unit.skills.filter((sk) => !sk.optional);
      items = sprinkle(buildItems(allItems(sks), REVIEW_LEN - 3), drillsFor(sks.flatMap((sk) => sk.concepts), 3));
      title = 'Enhetsrepetisjon';
    }
    else if (kind === 'exam') { items = node.unit.exam.items; title = node.unit.exam.title; }
    else if (kind === 'jump') {
      const skills = COURSE.units.slice(0, opts.unit.index).reduce((a, u) => a.concat(u.skills), []);
      items = buildItems(allItems(skills), JUMP_LEN); title = 'Hopp hit';
    } else {
      const weak = weakest(3);
      items = buildWeakItems(weak.length ? weak : [NODES[0].skill], LESSON_LEN - 2); title = 'Styrk svake emner';
    }
    items = items.map((it) => (it.t === 'card' ? it : instantiate(it))).filter(Boolean);
    LESSON = {
      kind, node, title, unit: opts.unit || (node && node.unit),
      queue: items, total: items.length, correct: 0, mistakes: 0, combo: 0, maxCombo: 0,
      lives: kind === 'exam' ? node.unit.exam.lives : JUMP_LIVES, maxLives: kind === 'exam' ? node.unit.exam.lives : JUMP_LIVES, answered: 0,
      cur: items[0], state: 'idle', start: Date.now(), flash: '',
      tally: {}, calc: { open: false, expr: '' },
    };
    UI.open = -1;
    UI.modal = null;
    window.scrollTo(0, 0);
    render();
  }
  const usesHearts = (L) => L.kind === 'skill' || L.kind === 'review' || L.kind === 'redo';

  // Husker hvilke oppgaver og ferdigheter du får til, for repetisjon senere.
  function recordAnswer(x, ok) {
    if (x.id) {
      if (ok) { if (S.wrong[x.id]) { S.wrong[x.id]--; if (!S.wrong[x.id]) delete S.wrong[x.id]; } }
      else S.wrong[x.id] = Math.min(5, (S.wrong[x.id] || 0) + 1);
    }
    if (x.skill && LESSON) {
      const t = LESSON.tally[x.skill] || (LESSON.tally[x.skill] = { ok: 0, n: 0 });
      t.n++; if (ok) t.ok++;
    }
  }

  function check() {
    const L = LESSON, x = L.cur;
    if (L.state !== 'idle' || !canCheck(x)) return;
    const ok = grade(x);
    L.ok = ok;
    L.state = ok ? 'right' : 'wrong';
    S.stats.answered++;
    recordAnswer(x, ok);
    if (ok) {
      S.stats.correct++;
      L.correct++; L.combo++;
      L.maxCombo = Math.max(L.maxCombo, L.combo);
      S.stats.maxCombo = Math.max(S.stats.maxCombo, L.combo);
      today().combo = Math.max(today().combo, L.combo);
      L.praise = pickR(['Flott!', 'Riktig!', 'Strålende!', 'Helt rett!', 'Bra jobbet!', 'Supert!']);
      sfx.right();
    } else {
      L.mistakes++; L.combo = 0;
      if (usesHearts(L)) loseHeart();
      if (L.kind === 'jump' || L.kind === 'exam') L.lives--;
      sfx.wrong();
    }
    save();
    render();
  }

  function cont() {
    const L = LESSON;
    if (L.state === 'idle') return;
    const x = L.queue.shift();
    L.answered++;
    if (!L.ok && L.kind !== 'exam') {
      // samme oppgave kommer igjen senere, nullstilt
      if (x.t === 'mc') x.sel = -1;
      if (x.t === 'num') x.input = '';
      if (x.t === 'bank') x.slots = x.slots.map(() => null);
      L.queue.push(x);
    }
    if (usesHearts(L) && hearts() <= 0) { L.screen = 'noHearts'; return render(); }
    if (L.kind === 'jump' && L.lives <= 0) { L.screen = 'jumpFail'; return render(); }
    if (L.kind === 'exam' && L.lives <= 0) { L.screen = 'examFail'; return render(); }
    if (!L.queue.length) return finish();
    L.cur = L.queue[0];
    L.state = 'idle';
    // kalkulatoren nullstilles før hver nye oppgave
    L.calc = { open: L.calc.open, expr: '' };
    L.flash = L.combo > 0 && L.combo % 5 === 0 ? `${L.combo} på rad!` : '';
    render();
  }

  function finish() {
    const L = LESSON;
    const secs = Math.round((Date.now() - L.start) / 1000);
    const acc = L.kind === 'exam' ? Math.round((100 * L.correct) / L.total) : Math.round((100 * L.total) / (L.total + L.mistakes));
    let base = { skill: 10, redo: 5, review: 15, jump: 15, practice: 10, exam: 30 }[L.kind];
    if (L.mistakes === 0 && L.kind !== 'redo') base += 5;
    const xp = addXp(base);
    const t = today();
    t.lessons++; t.seconds = (t.seconds || 0) + secs;
    if (acc >= 90) t.acc90++;
    if (L.mistakes === 0) { t.perfect++; S.stats.perfect++; }
    S.stats.lessons++;
    S.stats.seconds += secs;
    if (L.kind === 'skill') S.prog[L.node.id] = Math.min(LEVELS, (S.prog[L.node.id] || 0) + 1);
    if (L.kind === 'review' || L.kind === 'exam') S.reviews[L.unit.id] = true;
    if (L.kind === 'jump') {
      NODES.slice(0, L.unit.first).forEach((n) => {
        if (n.type === 'skill') S.prog[n.id] = LEVELS;
        if (n.type === 'chest') S.chests[n.id] = true;
        if (n.type === 'review') S.reviews[n.unit.id] = true;
      });
    }
    if (L.kind === 'practice') { L.heartGained = hearts() < MAX_HEARTS; gainHeart(); }
    Object.keys(L.tally).forEach((id) => { const t = L.tally[id]; updateMem(id, t.ok / t.n); });
    const streakUp = extendStreak();
    const goalHit = xpToday() >= S.goal && xpToday() - xp < S.goal;
    save();
    L.screen = 'done';
    L.result = { xp, acc, secs, streakUp, goalHit };
    sfx.done();
    render();
  }

  function afterDone() {
    const L = LESSON;
    if (L.screen === 'done' && L.result.streakUp) { L.screen = 'streak'; return render(); }
    if ((L.screen === 'done' || L.screen === 'streak') && L.result.goalHit) { L.screen = 'goal'; return render(); }
    exitLesson();
  }
  function exitLesson() { LESSON = null; UI.scrollToCurrent = true; render(); }

  // ------------------------------------------------------------------
  // Visning: leksjon
  // ------------------------------------------------------------------
  const TYPE_LABEL = { mc: 'Velg riktig svar', num: 'Regn ut', bank: 'Fyll inn', match: 'Koble sammen parene', order: 'Sett stegene i riktig rekkefølge' };

  function renderLesson() {
    const L = LESSON;
    if (L.screen) return renderLessonScreen();
    const x = L.cur;
    const pct = Math.round((100 * (L.kind === 'exam' ? L.answered : L.correct)) / L.total);
    let top;
    if (L.kind === 'jump' || L.kind === 'exam') top = `<div class="l-hearts">${Array.from({ length: L.maxLives }, (_, i) => I.heart(i < L.lives)).join('')}</div>`;
    else if (usesHearts(L)) top = `<div class="l-hearts">${I.heart()}<b class="red">${hearts()}</b></div>`;
    else top = `<div class="l-hearts"><span class="pill">${L.kind === 'practice' ? 'Styrk' : ''}</span></div>`;

    let body = '';
    if (x.t === 'mc') {
      body = `${x.code ? `<pre class="code">${esc(x.code)}</pre>` : ''}
        <div class="opts ${x.tf ? 'tf' : ''}">${x.opts.map((o, i) => {
          let cls = x.sel === i ? 'sel' : '';
          if (L.state !== 'idle' && i === x.correct) cls = 'good';
          if (L.state === 'wrong' && i === x.sel) cls = 'bad';
          return `<button class="opt ${cls}" data-a="sel" data-i="${i}" ${L.state !== 'idle' ? 'disabled' : ''}><span class="k">${i + 1}</span><span class="${x.monoOpts ? 'mono-opt' : ''}">${x.monoOpts ? esc(o) : mathHTML(o)}</span></button>`;
        }).join('')}</div>`;
    } else if (x.t === 'num') {
      body = `<div class="num-wrap"><input id="numIn" class="num-in ${L.state}" inputmode="decimal" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="Skriv svaret" value="${esc(x.input)}" ${L.state !== 'idle' ? 'disabled' : ''}><span class="num-unit">${mathHTML(x.u)}</span></div>
        <div class="num-tools"><p class="hint">Bruk komma eller punktum. Store og små tall kan skrives som 6,2e18 eller 6,2·10^18.</p>
        ${L.state === 'idle' && !x.noCalc ? `<button class="calc-btn ${L.calc.open ? 'on' : ''}" data-a="calc" aria-label="Kalkulator">${I.calc()}<span>${L.calc.open ? 'Skjul' : 'Kalkulator'}</span></button>` : ''}</div>
        ${L.state === 'idle' && L.calc.open && !x.noCalc ? calcPanel(L) : ''}`;
    } else if (x.t === 'bank' && x.order) {
      body = `<ol class="order-list">${x.slots.map((id, i) => `<li><span class="ord-n">${i + 1}</span>${id === null ? '<span class="slot empty wide"></span>' : `<button class="tile in step" data-a="unslot" data-i="${i}" ${L.state !== 'idle' ? 'disabled' : ''}>${mathHTML(x.tokens[id].text)}</button>`}</li>`).join('')}</ol>
        <div class="bank steps">${x.tokens.map((tk) => {
          const used = x.slots.includes(tk.id);
          return `<button class="tile step ${used ? 'used' : ''}" data-a="tile" data-i="${tk.id}" ${used || L.state !== 'idle' ? 'disabled' : ''}>${mathHTML(tk.text)}</button>`;
        }).join('')}</div>`;
    } else if (x.t === 'card') {
      body = '';
    } else if (x.t === 'bank') {
      let k = 0;
      const show = (t) => (x.code ? esc(t) : mathHTML(t));
      const line = (x.code ? esc(x.tpl).replace(/\n/g, '<br>') : mathHTML(x.tpl)).replace(/<br>/g, '<span class="lb"></span>').replace(/▢/g, () => {
        const i = k++, id = x.slots[i];
        return id === null ? `<span class="slot empty"></span>` : `<button class="tile in" data-a="unslot" data-i="${i}" ${L.state !== 'idle' ? 'disabled' : ''}>${show(x.tokens[id].text)}</button>`;
      });
      body = `<div class="bank-line ${x.code ? 'mono' : ''}">${line}</div>
        <div class="bank">${x.tokens.map((tk) => {
          const used = x.slots.includes(tk.id);
          return `<button class="tile ${used ? 'used' : ''}" data-a="tile" data-i="${tk.id}" ${used || L.state !== 'idle' ? 'disabled' : ''}>${x.code ? esc(tk.text) : mathHTML(tk.text)}</button>`;
        }).join('')}</div>`;
    } else if (x.t === 'match') {
      const col = (side, arr) => arr.map((it) => {
        const flashOk = (x.ok || []).includes(it.i);
        const done = x.done.includes(it.i) && !flashOk;
        const sel = (side === 'L' ? x.selL : x.selR) === it.i;
        const bad = x.bad && x.bad[side] === it.i;
        return `<button class="mtile ${done ? 'done' : ''} ${flashOk ? 'good' : ''} ${sel ? 'sel' : ''} ${bad ? 'bad' : ''}" data-a="m${side}" data-i="${it.i}" ${done || flashOk ? 'disabled' : ''}>${mathHTML(it.text)}</button>`;
      }).join('');
      body = `<div class="match"><div class="mcol">${col('L', x.left)}</div><div class="mcol">${col('R', x.right)}</div></div>`;
    }

    let foot;
    if (x.t === 'card') {
      foot = `<div class="l-foot"><div class="foot-in end"><button class="btn green" data-a="cardOk" id="contBtn">Fortsett</button></div></div>`;
    } else if (L.state === 'idle') {
      foot = `<div class="l-foot"><div class="foot-in">
        <button class="btn ghost" data-a="skip">Hopp over</button>
        ${x.t === 'match' ? '' : `<button class="btn green" id="checkBtn" data-a="check" ${canCheck(x) ? '' : 'disabled'}>Sjekk</button>`}
      </div></div>`;
    } else {
      const ok = L.state === 'right';
      foot = `<div class="l-foot ${ok ? 'ok' : 'no'}"><div class="foot-in">
        <div class="fb">
          <div class="fb-title">${ok ? esc(L.praise || 'Riktig!') : 'Riktig svar:'}</div>
          ${ok ? '' : `<div class="fb-ans">${x.t === 'bank' && x.code ? nl(correctText(x)) : mathHTML(correctText(x))}</div>`}
          ${x.e ? `<div class="fb-exp">${gloss(x.e)}</div>` : ''}
        </div>
        <button class="btn ${ok ? 'green' : 'red'}" data-a="cont" id="contBtn">Fortsett</button>
      </div></div>`;
    }

    app.innerHTML = `<div class="lesson">
      <div class="l-top"><button class="icon-btn" data-a="quit" aria-label="Avslutt">${I.x()}</button>
        <div class="bar"><div class="fill" style="width:${pct}%"></div>${L.flash ? `<span class="combo">${esc(L.flash)}</span>` : ''}</div>${top}</div>
      <div class="l-body"><div class="l-inner">
        ${x.t === 'card' ? `<div class="intro-card"><div class="ic-badge">${esc(x.kind)}</div>
          <div class="ic-term ${x.term.length > 18 ? 'long' : ''}">${mathHTML(x.term)}</div>
          <div class="ic-name">${mathHTML(x.name)}</div>
          <p class="ic-d">${gloss(x.d)}</p></div>` : `
        <div class="l-type">${x.t === 'bank' && x.order ? TYPE_LABEL.order : TYPE_LABEL[x.t]}${x.src ? ` · ${/^\d/.test(x.src) ? 'Oppgave ' : ''}${esc(x.src)}` : ''}${x.noCalc ? ' <span class="nocalc">Uten hjelpemidler</span>' : ''}</div>
        <h2 class="l-q">${gloss(x.q)}</h2>
        ${body}`}
      </div></div>
      ${foot}
      ${UI.modal === 'quit' ? quitModal() : ''}
    </div>`;

    const inp = document.getElementById('numIn');
    if (inp) {
      inp.addEventListener('input', () => { x.input = inp.value; const b = document.getElementById('checkBtn'); if (b) b.disabled = !canCheck(x); });
      if (L.state === 'idle' && !UI.modal && !L.calc.open) setTimeout(() => inp.focus(), 30);
    }
    const cb = document.getElementById('contBtn');
    if (cb) cb.focus({ preventScroll: true });
  }

  function quitModal() {
    return `<div class="modal-bg" data-a="closeModal"><div class="modal" data-stop>
      ${mascot('sad')}
      <h3>Vent, ikke gå!</h3><p>Du mister fremgangen i denne leksjonen hvis du avslutter nå.</p>
      <button class="btn blue wide" data-a="closeModal">Fortsett å lære</button>
      <button class="btn link wide red-t" data-a="quitYes">Avslutt økten</button>
    </div></div>`;
  }

  function renderLessonScreen() {
    const L = LESSON;
    let html = '';
    if (L.screen === 'done') {
      const r = L.result;
      const mm = Math.floor(r.secs / 60), ss = r.secs % 60;
      html = `<div class="center-screen">
        ${mascot('happy')}
        <h1 class="gold-t">${L.mistakes === 0 ? 'Perfekt leksjon!' : 'Leksjon fullført!'}</h1>
        ${L.kind === 'jump' ? '<p>Du hoppet videre! Alle tidligere enheter er låst opp.</p>' : ''}
        ${L.kind === 'exam' ? `<p>Prøven er bestått med ${L.mistakes} ${L.mistakes === 1 ? 'feil' : 'feil'}!</p>` : ''}
        ${L.heartGained ? `<p>Du tjente ett hjerte ${I.heart()}</p>` : ''}${L.kind === 'practice' ? '<p class="muted">De svake emnene dine er styrket.</p>' : ''}
        <div class="stat-cards">
          <div class="sc gold"><div class="sc-h">Total XP</div><div class="sc-b">${I.bolt()} ${r.xp}</div></div>
          <div class="sc green"><div class="sc-h">${r.acc === 100 ? 'Perfekt' : 'Riktig'}</div><div class="sc-b">${I.aim()} ${r.acc} %</div></div>
          <div class="sc blue"><div class="sc-h">${r.secs < 90 ? 'Lynrask' : 'Tid'}</div><div class="sc-b">${I.clock()} ${mm}:${pad(ss)}</div></div>
        </div>
        ${boostActive() ? '<p class="boost-t">Dobbel XP er aktiv!</p>' : ''}
      </div>`;
    } else if (L.screen === 'streak') {
      const n = streakNow();
      const days = ['Ma', 'Ti', 'On', 'To', 'Fr', 'Lø', 'Sø'];
      const ws = weekStart();
      html = `<div class="center-screen">
        <div class="big-flame">${I.flame()}<span>${n}</span></div>
        <h1 class="orange-t">dagers rekke!</h1>
        <div class="week-row">${days.map((d, i) => { const k = addDays(ws, i); const on = (S.xpDays[k] || 0) > 0; return `<div class="wd ${on ? 'on' : ''} ${k === dayKey() ? 'today' : ''}"><span>${d}</span><i>${on ? '✓' : ''}</i></div>`; }).join('')}</div>
        <p>Øv hver dag for å holde rekka i live!</p>
      </div>`;
    } else if (L.screen === 'goal') {
      html = `<div class="center-screen">${mascot('happy')}<h1 class="green-t">Dagens mål er nådd!</h1><p>Du har tjent ${xpToday()} av ${S.goal} XP i dag. Godt jobbet!</p></div>`;
    } else if (L.screen === 'noHearts') {
      html = `<div class="center-screen">
        <div class="big-heart">${I.heart(false)}</div>
        <h1>Du er tom for hjerter</h1>
        <p>Neste hjerte kommer om ${nextHeartText()}. Du kan også tjene hjerter ved å øve på det du allerede har lært.</p>
        <button class="btn blue wide" data-a="practice">Øv for å tjene hjerter</button>
        <button class="btn link wide" data-a="exit">Avslutt</button>
      </div>`;
      return (app.innerHTML = `<div class="lesson screen">${html}</div>`);
    } else if (L.screen === 'examFail') {
      html = `<div class="center-screen">${mascot('sad')}<h1>Ikke bestått</h1><p>Du gjorde for mange feil på prøven. Repeter oppgavene og veiledningen, og prøv igjen. Prøven må bestås før du kommer videre.</p></div>`;
      return (app.innerHTML = `<div class="lesson screen">${html}<div class="l-foot"><div class="foot-in end"><button class="btn green" data-a="exit" id="contBtn">Fortsett</button></div></div></div>`);
    } else if (L.screen === 'jumpFail') {
      html = `<div class="center-screen">${mascot('sad')}<h1>Ikke helt ennå!</h1><p>Du brukte opp alle forsøkene. Øv litt mer og prøv igjen senere.</p></div>`;
      return (app.innerHTML = `<div class="lesson screen">${html}<div class="l-foot"><div class="foot-in end"><button class="btn green" data-a="exit" id="contBtn">Fortsett</button></div></div></div>`);
    }
    app.innerHTML = `<div class="lesson screen">${html}<div class="l-foot"><div class="foot-in end"><button class="btn green" data-a="afterDone" id="contBtn">Fortsett</button></div></div></div>`;
    const cb = document.getElementById('contBtn');
    if (cb) cb.focus({ preventScroll: true });
  }

  // ------------------------------------------------------------------
  // Visning: hovedskjerm
  // ------------------------------------------------------------------
  const OFFSETS = [0, 44, 70, 44, 0, -44, -70, -44];

  function renderPath() {
    const cur = currentIndex();
    return COURSE.units.map((u) => {
      const nodes = NODES.filter((n) => n.unit === u);
      const banner = `<div class="unit-banner" style="--c:${u.color};--cd:${u.dark}">
          <div><div class="u-sub">ENHET ${u.index + 1} · ${progressPct(nodes)} %</div><div class="u-title">${esc(u.title)}</div></div>
          <div class="u-actions">
            <button class="u-btn" data-a="guide" data-u="${u.index}" aria-label="Veiledning">${I.book()}<span class="hide-s">Veiledning</span></button>
          </div>
        </div>`;
      const path = nodes.map((n, k) => {
        const done = nodeDone(n), isCur = n.i === cur;
        const state = done ? 'done' : isCur ? 'cur' : n.i < cur ? 'open' : 'locked';
        const weak = n.type === 'skill' && isWeak(n.id);
        let icon;
        if (n.type === 'chest') icon = I.chest(done);
        else if (n.type === 'review') icon = I.trophy();
        else if (n.type === 'exam') icon = I.exam();
        else icon = done ? I.check() : I.star();
        const lv = S.prog[n.id] || 0;
        const ring = n.type === 'skill' && isCur
          ? `<svg class="ring" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" class="ring-bg"/><circle cx="50" cy="50" r="46" class="ring-fg" style="stroke-dasharray:${(289 * lv) / LEVELS} 289"/></svg>` : '';
        const pop = UI.open === n.i ? popover(n, state) : '';
        return `<div class="node-wrap ${UI.open === n.i ? 'open' : ''} ${isCur && UI.open !== n.i ? 'has-bubble' : ''}" style="--x:${OFFSETS[(k + u.index * 3) % OFFSETS.length]}px">
          ${isCur && UI.open !== n.i ? `<div class="start-bubble">${n.type === 'chest' ? 'ÅPNE' : 'START'}</div>` : ''}
          <button class="node ${state} ${n.type} ${weak ? 'weak' : ''} ${n.optional ? 'optional' : ''}" data-a="node" data-n="${n.i}" ${isCur ? 'id="curNode"' : ''} aria-label="${esc(n.title)}">${ring}<span class="node-face">${icon}</span>${weak ? I.crack() : ''}</button>
          ${pop}
        </div>`;
      }).join('');
      return `<section class="unit" style="--c:${u.color};--cd:${u.dark}">${banner}<div class="path">${path}</div></section>`;
    }).join('') + (cur >= NODES.length ? `<div class="course-done">${mascot('happy')}<h2>Du har fullført hele ${esc(COURSE.title)}!</h2><p>Fortsett å øve for å holde kunnskapen ved like.</p><button class="btn green" data-a="practice">Øv</button></div>` : '');
  }

  function popover(n, state) {
    let inner;
    const hand = COURSE.handDone && n.type === 'skill' && !n.skill.concepts.length && state !== 'done'
      ? `<button class="btn link hand-b" data-a="handDone" data-n="${n.i}">Gjort for hånd – hopp over</button>` : '';
    if (n.type === 'exam') {
      inner = `<h4>${esc(n.title)}</h4><p>${n.unit.exam.items.length} oppgaver. Du har ${n.unit.exam.lives} liv, og prøven må bestås for å komme videre.</p><button class="btn white" data-a="go" data-n="${n.i}">${state === 'done' ? 'Ta prøven igjen +30 XP' : 'Start prøven +30 XP'}</button>`;
      return `<div class="popover ${state === 'done' ? 'done' : 'cur'}" data-stop>${inner}</div>`;
    }
    if (n.type === 'skill' && n.optional && state !== 'done') {
      const lv = S.prog[n.id] || 0;
      inner = `<h4>${esc(n.title)}</h4><p>Valgfrie ekstraoppgaver. Leksjon ${lv + 1} av ${LEVELS}</p><button class="btn white" data-a="go" data-n="${n.i}">Start +10 XP</button>${hand}`;
      return `<div class="popover cur" data-stop>${inner}</div>`;
    }
    if (n.type === 'skill') {
      const lv = S.prog[n.id] || 0;
      if (state === 'done' && isWeak(n.id)) inner = `<h4>${esc(n.title)}</h4><p>Det er en stund siden du øvde på dette. Styrk kunnskapen før den blekner!</p><button class="btn white" data-a="go" data-n="${n.i}">Styrk +5 XP</button>`;
      else if (state === 'done') inner = `<h4>${esc(n.title)}</h4><p>Fullført! Styrke: ${Math.round(100 * strength(n.id))} %. Repeter for å holde kunnskapen ved like.</p><button class="btn white" data-a="go" data-n="${n.i}">Øv +5 XP</button>`;
      else if (state === 'cur') inner = `<h4>${esc(n.title)}</h4><p>Leksjon ${lv + 1} av ${LEVELS}${lv === 0 && n.skill.concepts.length ? ` · ${n.skill.concepts.length} ${n.skill.concepts.length === 1 ? 'nytt begrep' : 'nye begreper'}` : ''}</p><button class="btn white" data-a="go" data-n="${n.i}">Start +10 XP</button>${hand}`;
      else inner = `<h4>${esc(n.title)}</h4><p>${lv ? `Leksjon ${lv + 1} av ${LEVELS}` : 'Ikke startet ennå'}${lv === 0 && n.skill.concepts.length ? ` · ${n.skill.concepts.length} ${n.skill.concepts.length === 1 ? 'nytt begrep' : 'nye begreper'}` : ''}. Du kan starte her uten å ta temaene før.</p><button class="btn white" data-a="go" data-n="${n.i}">Start +10 XP</button>${hand}`;
    } else if (n.type === 'review') {
      inner = `<h4>Enhetsrepetisjon</h4><p>Repeter hele enhet ${n.unit.index + 1}: ${esc(n.unit.title)}</p><button class="btn white" data-a="go" data-n="${n.i}">${state === 'done' ? 'Øv +5 XP' : 'Start +15 XP'}</button>`;
    } else {
      inner = state === 'done' ? `<h4>Skattekiste</h4><p>Du har allerede åpnet denne.</p>` : `<h4>Skattekiste</h4><p>Fullfør nivåene over for å åpne kista.</p><button class="btn locked-b" disabled>Låst</button>`;
    }
    return `<div class="popover ${state === 'locked' && n.type !== 'chest' ? 'cur' : state}" data-stop>${inner}</div>`;
  }

  function sidebarStats() {
    const st = streakNow();
    return `<div class="stats-row">
      <button class="chip course-chip" data-a="courses" title="Bytt kurs">${I[COURSE.icon]()}<span>${esc(COURSE.short || COURSE.title)}</span><i class="caret">▾</i></button>
      <button class="chip" data-a="streakInfo" title="Dagsrekke">${I.flame(st > 0 && S.streak.last === dayKey())}<b class="${st > 0 ? 'orange-t' : 'grey-t'}">${st}</b></button>
      <button class="chip" data-a="tab" data-t="profile" title="Total XP">${I.bolt()}<b class="gold-t">${S.xp}</b></button>
      <button class="chip" data-a="heartsInfo" title="Hjerter">${I.heart(hearts() > 0)}<b class="red">${hearts()}</b></button>
    </div>`;
  }

  const PERIODS = [['week', 'Ukentlig', 'denne uka'], ['month', 'Månedlig', 'denne måneden'], ['year', 'Årlig', 'i år']];
  function leagueCard(full) {
    const kind = UI.board || 'week';
    const rows = dayBoard(kind);
    const me = rows.find((r) => r.today);
    const [, , when] = PERIODS.find((p) => p[0] === kind);
    if (!full) {
      const wk = dayBoard('week').find((r) => r.today);
      return `<div class="card"><div class="card-h"><h3>Liga</h3><button class="link-b" data-a="tab" data-t="league">Vis toppliste</button></div>
        <div class="league-mini"><div class="shield" style="color:#ffc800">${I.shield()}</div><div>I dag: <b>${wk.xp} XP</b><br><span class="muted">Nr. ${wk.rank} av dagene denne uka</span></div></div></div>`;
    }
    const pos = rows.filter((r) => r.xp > 0);
    const zeros = rows.filter((r) => r.xp === 0 && !r.today);
    const zeroRank = pos.length + 1;
    const row = (r) => `<li class="row ${r.today ? 'me' : ''}"><span class="rk ${r.rank <= 3 && r.xp > 0 ? 'top' + r.rank : ''}">${r.rank}</span><span class="nm">${r.today ? `<b>I dag</b> · ${esc(dayLabel(r.day, kind).toLowerCase())}` : esc(dayLabel(r.day, kind))}</span><span class="xp">${r.xp} XP</span></li>`;
    const zeroRow = zeros.length ? `<li class="row zero"><span class="rk">${zeroRank}</span><span class="nm">${zeros.length === 1 ? '1 dag' : zeros.length + ' dager'} uten XP</span><span class="xp">0 XP</span></li>` : '';
    const showAll = kind === 'week' || UI.boardAll;
    let list;
    if (showAll) list = pos.concat(me.xp === 0 ? [me] : []).map(row).join('') + zeroRow;
    else {
      const top = pos.slice(0, 10);
      list = top.map(row).join('');
      if (!top.includes(me)) list += (me.xp > 0 || pos.length > 10 ? '<li class="gap">…</li>' : '') + row(me);
      if (pos.length <= 10) list += zeroRow;
    }
    const total = rows.reduce((a, r) => a + r.xp, 0);
    const more = kind !== 'week' && pos.length > 10;
    return `<div class="league-full">
      <div class="seg">${PERIODS.map(([k, label]) => `<button class="seg-b ${k === kind ? 'on' : ''}" data-a="board" data-v="${k}">${label}</button>`).join('')}</div>
      <h2>Dine beste dager ${when}</h2>
      <p class="muted">I dag har du <b>${me.xp} XP</b> og er nr. <b>${me.rank}</b> av ${rows.length} ${rows.length === 1 ? 'dag' : 'dager'}. Totalt ${total} XP ${when}.</p>
      <ol class="board days">${list}</ol>
      ${more ? `<button class="btn wide ${UI.boardAll ? 'ghost' : 'green'}" data-a="boardAll">${UI.boardAll ? 'Vis bare topp 10' : `Vis alle (${pos.length} dager med XP)`}</button>` : ''}
    </div>`;
  }

  function questsCard(full) {
    today();
    const all = S.quests.every((q) => q.claimed);
    const list = S.quests.map((q, i) => {
      const v = questVal(q), done = v >= q.n;
      return `<div class="quest"><div class="q-ic">${q.s === 'xp' ? I.bolt() : q.s === 'combo' ? I.aim() : q.s === 'minutes' ? I.clock() : I.target()}</div>
        <div class="q-main"><div class="q-t">${esc(questText(q))}</div>
        <div class="q-bar"><div class="q-fill" style="width:${(100 * v) / q.n}%"></div><span>${v} / ${q.n}</span></div></div>
        <div class="q-chest">${q.claimed ? I.chest(true) : done ? `<button class="claim" data-a="claim" data-i="${i}">${I.chest(false)}<span>Åpne</span></button>` : `<span class="dim">${I.chest(false)}</span>`}</div></div>`;
    }).join('');
    const h = new Date(); const left = 24 - h.getHours();
    return `<div class="card ${full ? 'flat' : ''}"><div class="card-h"><h3>Daglige oppdrag</h3>${full ? `<span class="muted">${left} t igjen</span>` : '<button class="link-b" data-a="tab" data-t="quests">Vis alle</button>'}</div>
      ${list}
      ${full ? `<p class="muted small">Hver kiste gir 10 XP. Fullfør alle tre oppdragene for å få dobbel XP i 15 minutter.</p>` : ''}
      ${all && boostActive() ? `<div class="notice">Dobbel XP er aktiv i ${Math.ceil((S.boost - Date.now()) / 60000)} min til!</div>` : ''}
    </div>`;
  }

  function practiceCard(compact) {
    const list = weakest(3);
    if (!list.length) return '';
    const n = weakCount();
    if (compact) {
      return `<div class="card practice"><div class="pr-row"><div class="pr-ic">${I.dumbbell()}</div><div class="pr-main"><b>Styrk svake emner</b><span class="muted">${n === 1 ? '1 emne' : n + ' emner'} trenger repetisjon</span></div>
        <button class="btn green" data-a="practice">Øv +10 XP</button></div></div>`;
    }
    return `<div class="card practice"><div class="card-h"><h3>Styrk svake emner</h3></div>
      ${list.map((sk) => { const st = strength(sk.id); return `<div class="pr-skill"><span>${esc(sk.title)}</span><div class="q-bar"><div class="q-fill ${st < 0.5 ? 'red-f' : st < 0.75 ? 'gold' : 'green-f'}" style="width:${Math.max(4, Math.round(100 * st))}%"></div></div></div>`; }).join('')}
      <p class="muted small">Styrken synker over tid. Oppgaver du har svart feil på kommer oftere.</p>
      <button class="btn green wide" data-a="practice">Øv +10 XP</button></div>`;
  }

  // ------------------------------------------------------------------
  // Repetisjon: blandet øving, men gruppert etter tema så det henger sammen
  // ------------------------------------------------------------------
  const repSkills = () => NODES.filter((n) => n.type === 'skill' && !n.optional && practiced(n.id));
  // Velger 2–3 temaer som hører sammen: en svak enhet og enheten før den.
  function repPlan(fresh) {
    if (!fresh && UI.repPlan && UI.repPlan.course === COURSE.id) {
      const ok = UI.repPlan.ids.map((id) => NODES.find((n) => n.id === id)).filter(Boolean);
      if (ok.length) return ok;
    }
    const nodes = repSkills();
    if (!nodes.length) return [];
    const units = [...new Set(nodes.map((n) => n.unit))];
    const avg = (u) => { const ns = nodes.filter((n) => n.unit === u); return ns.reduce((a, n) => a + strength(n.id), 0) / ns.length; };
    const anchor = units.map((u) => ({ u, w: avg(u) + Math.random() * 0.35 })).sort((x, y) => x.w - y.w)[0].u;
    const near = units.filter((u) => u === anchor || u.index === anchor.index - 1);
    const pool = nodes.filter((n) => near.includes(n.unit));
    const pick = pool.map((n) => ({ n, w: strength(n.id) + Math.random() * 0.5 })).sort((x, y) => x.w - y.w).slice(0, 3).map(({ n }) => n).sort((x, y) => x.i - y.i);
    UI.repPlan = { course: COURSE.id, ids: pick.map((n) => n.id) };
    return pick;
  }
  // Ett tema om gangen: først formlene, så oppgaver, og til slutt litt blanding på tvers.
  function repItems(nodes, per = 3) {
    const blocks = nodes.map((n) => {
      const sk = n.skill;
      const items = sk.items.filter((it) => it.t !== 'match').map((it) => ({ it, w: (S.wrong[it.id] || 0) * 2 + Math.random() * 1.5 })).sort((x, y) => y.w - x.w).map(({ it }) => it);
      const own = items.slice(0, per);
      const d = drillsFor(sk.concepts.length ? sk.concepts : sk.active, sk.concepts.length ? 2 : 1);
      return { d, own, rest: items.slice(per) };
    });
    const out = blocks.flatMap((b) => b.d.slice(0, 1).concat(b.own, b.d.slice(1)));
    const tail = shuffle(blocks.flatMap((b) => b.rest.slice(0, 1))).slice(0, 2);
    return out.concat(tail);
  }
  function conceptReview(unit) {
    const nodes = repSkills().filter((n) => !unit || n.unit === unit);
    const cs = nodes.flatMap((n) => n.skill.concepts);
    const chosen = cs.map((c) => ({ c, w: ['f', 'n', 't'].reduce((a, k) => a + (S.wrong[c.id + k] || 0), 0) * 2 + (1 - strength(c.skill)) + Math.random() })).sort((x, y) => y.w - x.w).slice(0, 10).map(({ c }) => c);
    chosen.sort((x, y) => COURSE.concepts.indexOf(x) - COURSE.concepts.indexOf(y));
    return chosen.map((c) => makeDrill(c)).filter(Boolean);
  }
  function wrongList() {
    return NODES.filter((n) => n.type === 'skill').flatMap((n) => n.skill.items.filter((it) => S.wrong[it.id])).slice(0, 12);
  }
  function startRep(kind, arg) {
    let items = [], title = 'Repetisjon';
    if (kind === 'mix') { items = repItems(repPlan()); title = 'Blandet repetisjon'; UI.repPlan = null; }
    else if (kind === 'concepts') { items = conceptReview(arg != null ? COURSE.units[arg] : null); title = 'Formler og begreper'; }
    else if (kind === 'wrong') { items = wrongList(); title = 'Oppgaver du har bommet på'; }
    else if (kind === 'unit') { const u = COURSE.units[arg]; items = repItems(repSkills().filter((n) => n.unit === u), 2).slice(0, 14); title = `Repeter: ${u.title}`; }
    if (!items.length) { toast('Du har ikke noe å repetere her ennå.'); return; }
    startLesson('practice', null, { items, title });
  }
  function renderRep() {
    const nodes = repSkills();
    if (!nodes.length) {
      return `<div class="page"><div class="hero-band"><div><h2>Repetisjon</h2><p>Her kan du repetere alt du har lært, blandet sammen tema for tema.</p></div>${mascot('happy')}</div>
        <div class="card"><p>Fullfør den første leksjonen i ${esc(COURSE.title)}, så dukker repetisjonen opp her.</p></div></div>`;
    }
    const plan = repPlan();
    const conceptsN = nodes.reduce((a, n) => a + n.skill.concepts.length, 0);
    const wrongN = wrongList().length;
    const units = COURSE.units.filter((u) => nodes.some((n) => n.unit === u));
    const bar = (st) => `<div class="q-bar"><div class="q-fill ${st < 0.5 ? 'red-f' : st < 0.75 ? 'gold' : 'green-f'}" style="width:${Math.max(4, Math.round(100 * st))}%"></div></div>`;
    return `<div class="page rep">
      <div class="hero-band"><div><h2>Repetisjon</h2><p>Blandet øving på det du allerede har lært. Temaene velges slik at de henger sammen.</p></div>${mascot('happy')}</div>
      <div class="card rep-main">
        <div class="card-h"><h3>Blandet repetisjon</h3><button class="link-b" data-a="repNew">Bytt temaer</button></div>
        <p class="muted">Denne runden: ${plan.map((n) => `<b>${esc(n.title)}</b>`).join(', ')}</p>
        <button class="btn green wide" data-a="rep" data-k="mix">Start +10 XP</button>
      </div>
      <div class="grid2 rep-grid">
        <div class="card"><h3>Formler og begreper</h3><p class="muted">${conceptsN} ${conceptsN === 1 ? 'begrep' : 'begreper'} du har lært. De du bommer på kommer oftere.</p>
          <button class="btn ghost wide" data-a="rep" data-k="concepts" ${conceptsN ? '' : 'disabled'}>Øv formler</button></div>
        <div class="card"><h3>Oppgaver du har bommet på</h3><p class="muted">${wrongN ? `${wrongN} ${wrongN === 1 ? 'oppgave' : 'oppgaver'} å ta igjen.` : 'Ingen akkurat nå. Bra jobba!'}</p>
          <button class="btn ghost wide" data-a="rep" data-k="wrong" ${wrongN ? '' : 'disabled'}>Ta dem igjen</button></div>
      </div>
      <h3 class="sec">Velg et tema</h3>
      <div class="card rep-units">${units.map((u) => {
        const ns = nodes.filter((n) => n.unit === u);
        const st = ns.reduce((a, n) => a + strength(n.id), 0) / ns.length;
        return `<div class="rep-u"><div class="rep-u-h"><span class="dot" style="background:${u.color}"></span><b>${esc(u.title)}</b></div>${bar(st)}
          <div class="rep-u-b"><button class="btn ghost small" data-a="rep" data-k="unit" data-u="${u.index}">Repeter</button>${ns.some((n) => n.skill.concepts.length) ? `<button class="btn ghost small" data-a="rep" data-k="concepts" data-u="${u.index}">Formler</button>` : ''}</div></div>`;
      }).join('')}</div>
    </div>`;
  }

  function goalCard() {
    const x = xpToday();
    return `<div class="card"><div class="card-h"><h3>Dagens mål</h3><button class="link-b" data-a="tab" data-t="profile">Endre</button></div>
      <div class="q-bar big"><div class="q-fill" style="width:${Math.min(100, (100 * x) / S.goal)}%"></div><span>${Math.min(x, S.goal)} / ${S.goal} XP</span></div></div>`;
  }

  function renderQuests() {
    return `<div class="page"><div class="hero-band"><div><h2>Daglige oppdrag</h2><p>Fullfør oppdrag for å tjene XP og dobbel-XP-boost.</p></div>${mascot('happy')}</div>${questsCard(true)}${goalCard()}</div>`;
  }

  function calendar() {
    const now = new Date();
    const y = now.getFullYear(), m = now.getMonth();
    const first = new Date(y, m, 1), daysIn = new Date(y, m + 1, 0).getDate();
    const lead = (first.getDay() + 6) % 7;
    const cells = [];
    for (let i = 0; i < lead; i++) cells.push('<span></span>');
    for (let d = 1; d <= daysIn; d++) {
      const k = `${y}-${pad(m + 1)}-${pad(d)}`;
      const on = (S.xpDays[k] || 0) > 0;
      cells.push(`<span class="cd ${on ? 'on' : ''} ${k === dayKey() ? 'today' : ''}">${d}</span>`);
    }
    const mname = now.toLocaleDateString('nb-NO', { month: 'long', year: 'numeric' });
    return `<div class="card"><div class="card-h"><h3>Dagsrekke</h3><span class="muted">${esc(mname)}</span></div>
      <div class="cal"><b>Ma</b><b>Ti</b><b>On</b><b>To</b><b>Fr</b><b>Lø</b><b>Sø</b>${cells.join('')}</div>
      <p class="muted small">Lengste rekke: ${S.streak.best} dager</p></div>`;
  }

  function renderProfile() {
    const joined = new Date(S.created).toLocaleDateString('nb-NO', { month: 'long', year: 'numeric' });
    const units = Object.keys(S.reviews).length;
    const acc = S.stats.answered ? Math.round((100 * S.stats.correct) / S.stats.answered) : 0;
    return `<div class="page">
      <div class="profile-head"><div class="avatar">${esc((S.name || 'D')[0].toUpperCase())}</div>
        <div><h2>${esc(S.name || 'Deg')}</h2><p class="muted">Ble med i ${esc(joined)}</p>
        <button class="link-b" data-a="rename">Endre navn</button></div></div>
      <h3 class="sec">Statistikk</h3>
      <div class="grid2">
        <div class="stat">${I.flame(streakNow() > 0)}<div><b>${streakNow()}</b><span>Dagsrekke</span></div></div>
        <div class="stat">${I.bolt()}<div><b>${S.xp}</b><span>Total XP</span></div></div>
        <div class="stat"><span style="color:#ffc800">${I.shield()}</span><div><b>${bestDay()} XP</b><span>Beste dag</span></div></div>
        <div class="stat">${I.aim()}<div><b>${acc} %</b><span>Riktige svar</span></div></div>
        <div class="stat">${I.trophy()}<div><b>${units} / ${COURSE.units.length}</b><span>Enheter fullført</span></div></div>
        <div class="stat">${I.clock()}<div><b>${Math.round(S.stats.seconds / 60)} min</b><span>Tid brukt</span></div></div>
      </div>
      ${calendar()}
      <h3 class="sec">Prestasjoner</h3>
      <div class="card ach-list">${ACH.map((a) => {
        const l = achLevel(a), max = l >= a.t.length, target = a.t[Math.min(l, a.t.length - 1)], v = a.val();
        return `<div class="ach"><div class="ach-ic ${l ? 'on' : ''}"><span>${a.icon}</span><small>NIVÅ ${l}</small></div>
          <div class="ach-main"><div class="ach-t"><b>${esc(a.name)}</b><span class="muted">${max ? 'Maks' : `${Math.min(v, target)}/${target}`}</span></div>
          <div class="q-bar"><div class="q-fill gold" style="width:${max ? 100 : Math.min(100, (100 * v) / target)}%"></div></div>
          <div class="muted small">${esc(a.desc(target))}</div></div></div>`;
      }).join('')}</div>
      <h3 class="sec">Innstillinger</h3>
      <div class="card settings">
        <div class="set"><span>Dagens mål</span><div class="seg">${[[10, 'Lett'], [20, 'Normal'], [30, 'Seriøs'], [50, 'Intens']].map(([v, n]) => `<button class="${S.goal === v ? 'on' : ''}" data-a="goal" data-v="${v}">${n}<small>${v} XP</small></button>`).join('')}</div></div>
        <div class="set"><span>Lydeffekter</span><button class="toggle ${S.sound ? 'on' : ''}" data-a="sound" aria-label="Lyd"><i></i></button></div>
        <div class="set"><span>Utseende</span><div class="seg">${[['auto', 'Auto'], ['light', 'Lyst'], ['dark', 'Mørkt']].map(([v, n]) => `<button class="${S.theme === v ? 'on' : ''}" data-a="theme" data-v="${v}">${n}</button>`).join('')}</div></div>
        <div class="set col"><span>Flytt fremgang mellom enheter</span>
          <p class="muted small">Fremgangen lagres på hver enhet. Kopier koden her og lim den inn på den andre enheten (iPhone eller PC) for å overføre den.</p>
          <div class="btn-row"><button class="btn blue" data-a="export">Kopier kode</button><button class="btn white-b" data-a="import">Lim inn kode</button></div></div>
        <div class="set col"><span>Tilbakestill</span><button class="btn link red-t" data-a="reset">Slett all fremgang</button></div>
      </div>
    </div>`;
  }

  function renderModal() {
    if (!UI.modal) return '';
    const m = UI.modal;
    if (m.type === 'guide') {
      const u = COURSE.units[m.u];
      return `<div class="modal-bg" data-a="closeModal"><div class="modal guide" data-stop style="--c:${u.color};--cd:${u.dark}">
        <div class="guide-head"><div><div class="u-sub">ENHET ${u.index + 1} · VEILEDNING</div><h3>${esc(u.title)}</h3></div><button class="icon-btn" data-a="closeModal">${I.x()}</button></div>
        <div class="guide-body"><div class="kmal"><b>${esc(u.course.goalLabel || 'Kompetansemål')}</b><p>${gloss(u.goal, u.course)}</p></div>
        ${u.guide.map(([hd, body]) => `<div class="g-sec"><h4>${esc(hd)}</h4><p>${gloss(body, u.course)}</p></div>`).join('')}
        <p class="muted small">Tips: Trykk på understrekede ord og symboler for en kort forklaring.</p></div>
      </div></div>`;
    }
    if (m.type === 'hearts') {
      const n = hearts();
      return `<div class="modal-bg" data-a="closeModal"><div class="modal" data-stop>
        <h3>Hjerter</h3><div class="hearts-row">${[0, 1, 2, 3, 4].map((i) => I.heart(i < n)).join('')}</div>
        <p>${n >= MAX_HEARTS ? 'Du har fulle hjerter. Fortsett å lære!' : `Du får et nytt hjerte om ${nextHeartText()}. Du mister et hjerte for hver feil i en leksjon.`}</p>
        <button class="btn blue wide" data-a="practice">Øv for å tjene hjerter</button>
        <button class="btn link wide" data-a="closeModal">Lukk</button></div></div>`;
    }
    if (m.type === 'streak') {
      const n = streakNow();
      return `<div class="modal-bg" data-a="closeModal"><div class="modal" data-stop>
        <div class="big-flame small">${I.flame(n > 0)}<span>${n}</span></div>
        <h3>${n > 0 ? `${n} dagers rekke` : 'Ingen rekke ennå'}</h3>
        <p>${S.streak.last === dayKey() ? 'Du har øvd i dag. Kom tilbake i morgen for å forlenge rekka!' : 'Fullfør en leksjon i dag for å ' + (n > 0 ? 'forlenge' : 'starte') + ' rekka.'}</p>
        <button class="btn blue wide" data-a="closeModal">OK</button></div></div>`;
    }
    if (m.type === 'chest') {
      return `<div class="modal-bg" data-a="closeModal"><div class="modal" data-stop>
        <div class="chest-big">${I.chest(true)}</div><h3>${esc(m.title || 'Belønning!')}</h3><p class="gold-t big-xp">+${m.xp} XP</p>${m.extra ? `<p>${esc(m.extra)}</p>` : ''}
        <button class="btn green wide" data-a="closeModal">Fortsett</button></div></div>`;
    }
    if (m.type === 'jump') {
      const u = COURSE.units[m.u];
      return `<div class="modal-bg" data-a="closeModal"><div class="modal" data-stop>
        <h3>Hopp til enhet ${u.index + 1}?</h3><p>Ta en test med ${JUMP_LEN} oppgaver fra de tidligere enhetene. Du kan gjøre høyst ${JUMP_LIVES - 1} feil. Består du, låses alt fram til «${esc(u.title)}» opp.</p>
        <button class="btn blue wide" data-a="jumpGo" data-u="${u.index}">Start testen</button>
        <button class="btn link wide" data-a="closeModal">Kanskje senere</button></div></div>`;
    }
    if (m.type === 'courses') {
      return `<div class="modal-bg top" data-a="closeModal"><div class="course-menu" data-stop>
        <div class="cm-h">Mine kurs</div>
        ${COURSES.map((c) => {
          const units = c.units.filter((u) => S.reviews[u.id]).length;
          const pct = progressPct(c.nodes);
          return `<button class="cm-row ${c.id === COURSE.id ? 'on' : ''}" data-a="setCourse" data-c="${c.id}">
            <span class="cm-ic">${I[c.icon]()}</span><span class="cm-main"><b>${esc(c.title)}</b><small>${units} av ${c.units.length} enheter · ${pct} % av stien</small></span>${c.id === COURSE.id ? '<span class="cm-check">✓</span>' : ''}</button>`;
        }).join('')}
      </div></div>`;
    }
    if (m.type === 'text') {
      return `<div class="modal-bg" data-a="closeModal"><div class="modal" data-stop><h3>${esc(m.title)}</h3>${m.html}</div></div>`;
    }
    return '';
  }

  function renderMain() {
    today();
    hearts();
    const tabs = [['learn', 'Lær', I.home()], ['rep', 'Repetisjon', I.repeat()], ['league', 'Liga', I.shield()], ['quests', 'Oppdrag', I.target()], ['profile', 'Profil', I.user()]];
    const nav = (cls) => `<nav class="${cls}">${cls === 'side' ? `<div class="logo">${I.atom()}<span>HugoLingo</span></div>` : ''}${tabs.map(([id, label, ic]) => `<button class="nav-i ${UI.tab === id ? 'on' : ''}" data-a="tab" data-t="${id}">${ic}<span>${label}</span></button>`).join('')}</nav>`;
    let content;
    if (UI.tab === 'learn') content = `<div class="learn">${boostActive() ? `<div class="boost-banner">${I.bolt()} Dobbel XP aktiv i ${Math.ceil((S.boost - Date.now()) / 60000)} min</div>` : ''}${weakCount() ? `<div class="practice-top">${practiceCard(true)}</div>` : ''}${renderPath()}</div>`;
    else if (UI.tab === 'rep') content = renderRep();
    else if (UI.tab === 'league') content = `<div class="page">${leagueCard(true)}</div>`;
    else if (UI.tab === 'quests') content = renderQuests();
    else content = renderProfile();

    app.innerHTML = `<div class="shell">
      ${nav('side')}
      <main class="main"><header class="topbar">${sidebarStats()}</header>${content}</main>
      <aside class="right">${sidebarStats()}${practiceCard(false)}${leagueCard(false)}${questsCard(false)}${goalCard()}</aside>
      ${nav('bottom')}
      ${renderModal()}
    </div>`;

    if (UI.tab === 'learn' && UI.scrollToCurrent) {
      UI.scrollToCurrent = false;
      const el = document.getElementById('curNode');
      if (el) setTimeout(() => { const y = el.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2; window.scrollTo(0, Math.max(0, y)); }, 20);
    }
  }

  function applyTheme() {
    document.documentElement.dataset.theme = S.theme === 'auto' ? '' : S.theme;
    if (S.theme === 'auto') delete document.documentElement.dataset.theme;
  }

  function render() {
    closeTip();
    applyTheme();
    if (LESSON) renderLesson();
    else renderMain();
    applyGloss(app);
  }

  function toast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('show'), 10);
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 2600);
  }

  // ------------------------------------------------------------------
  // Hendelser
  // ------------------------------------------------------------------
  function exportCode() {
    return btoa(unescape(encodeURIComponent(JSON.stringify(S))));
  }
  function importCode(code) {
    const s = JSON.parse(decodeURIComponent(escape(atob(code.trim()))));
    if (!s || s.v !== 1) throw new Error('ugyldig');
    const base = fresh();
    S = Object.assign(base, s, { stats: Object.assign(base.stats, s.stats) });
    setCourse(S.course);
    save();
  }

  function onNode(i) {
    const n = NODES[i];
    const cur = currentIndex();
    if (n.type === 'chest' && i === cur) {
      S.chests[n.id] = true;
      const xp = addXp(15);
      save();
      sfx.done();
      UI.modal = { type: 'chest', xp, title: 'Skattekiste!' };
      UI.open = -1;
      return render();
    }
    UI.open = UI.open === i ? -1 : i;
    sfx.tap();
    render();
  }
  function goNode(i) {
    const n = NODES[i];
    const done = nodeDone(n);
    if (n.type === 'exam') return startLesson('exam', n);
    if ((n.type === 'skill' || n.type === 'review') && hearts() <= 0) { UI.modal = { type: 'hearts' }; UI.open = -1; return render(); }
    if (n.type === 'skill') startLesson(done ? 'redo' : 'skill', n);
    else if (n.type === 'review') startLesson(done ? 'redo' : 'review', done ? { ...n, skill: { items: allItems(n.unit.skills.filter((sk) => !sk.optional)), title: n.unit.title, concepts: n.unit.skills.flatMap((sk) => sk.concepts), active: [] } } : n);
  }

  document.addEventListener('click', (ev) => {
    const el = ev.target.closest('[data-a]');
    if (!(el && el.dataset.a === 'term') && !ev.target.closest('.tip')) closeTip();
    const stop = ev.target.closest('[data-stop]');
    if (!el) {
      if (!stop && UI.open >= 0 && !LESSON) { UI.open = -1; render(); }
      return;
    }
    const a = el.dataset.a;
    const L = LESSON;
    switch (a) {
      case 'term': ev.stopPropagation(); showTip(el); break;
      case 'tab': UI.tab = el.dataset.t; UI.open = -1; UI.modal = null; if (UI.tab === 'learn') UI.scrollToCurrent = true; window.scrollTo(0, 0); render(); break;
      case 'node': ev.stopPropagation(); onNode(+el.dataset.n); break;
      case 'go': goNode(+el.dataset.n); break;
      case 'handDone': {
        const n = NODES[+el.dataset.n];
        if (!n || n.type !== 'skill') break;
        S.prog[n.id] = LEVELS;
        S.mem[n.id] = { t: Date.now(), h: 2 };
        save(); UI.open = -1; UI.scrollToCurrent = true;
        toast('Markert som gjort for hånd. Oppgavene dukker opp igjen i repetisjonen.');
        render(); break;
      }
      case 'guide': UI.modal = { type: 'guide', u: +el.dataset.u }; render(); break;
      case 'jump': UI.modal = { type: 'jump', u: +el.dataset.u }; render(); break;
      case 'jumpGo': startLesson('jump', null, { unit: COURSE.units[+el.dataset.u] }); break;
      case 'courses': UI.modal = { type: 'courses' }; UI.open = -1; render(); break;
      case 'setCourse': setCourse(el.dataset.c); save(); UI.modal = null; UI.tab = 'learn'; UI.open = -1; UI.scrollToCurrent = true; window.scrollTo(0, 0); render(); break;
      case 'heartsInfo': UI.modal = { type: 'hearts' }; render(); break;
      case 'streakInfo': UI.modal = { type: 'streak' }; render(); break;
      case 'closeModal':
        if (el.classList.contains('modal-bg') && ev.target !== el) return;
        UI.modal = null; render(); break;
      case 'practice': LESSON = null; startLesson('practice', null); break;
      case 'claim': {
        const q = S.quests[+el.dataset.i];
        if (!q || q.claimed || questVal(q) < q.n) return;
        q.claimed = true;
        const xp = addXp(10);
        let extra = '';
        if (S.quests.every((qq) => qq.claimed)) { S.boost = Date.now() + BOOST_MS; extra = 'Alle oppdrag fullført! Du får dobbel XP de neste 15 minuttene.'; }
        save(); sfx.done();
        UI.modal = { type: 'chest', xp, title: 'Oppdrag fullført!', extra };
        render(); break;
      }
      case 'rep': LESSON = null; startRep(el.dataset.k, el.dataset.u != null ? +el.dataset.u : null); break;
      case 'repNew': repPlan(true); render(); break;
      case 'board': UI.board = el.dataset.v; UI.boardAll = false; render(); break;
      case 'boardAll': UI.boardAll = !UI.boardAll; render(); break;
      case 'goal': S.goal = +el.dataset.v; save(); render(); break;
      case 'sound': S.sound = !S.sound; save(); render(); break;
      case 'theme': S.theme = el.dataset.v; save(); render(); break;
      case 'rename': { const nm = prompt('Hva vil du kalle deg?', S.name || ''); if (nm !== null) { S.name = nm.trim().slice(0, 20); save(); render(); } break; }
      case 'export': {
        const code = exportCode();
        const done = () => toast('Koden er kopiert. Lim den inn på den andre enheten.');
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(code).then(done, () => prompt('Kopier denne koden:', code));
        else prompt('Kopier denne koden:', code);
        break;
      }
      case 'import': {
        const code = prompt('Lim inn koden fra den andre enheten. Fremgangen her blir erstattet.');
        if (!code) return;
        try { importCode(code); toast('Fremgangen er importert!'); UI.scrollToCurrent = true; render(); } catch (err) { toast('Koden var ugyldig.'); }
        break;
      }
      case 'reset': if (confirm('Er du sikker? All fremgang blir slettet.')) { S = fresh(); setCourse(S.course); save(); UI.tab = 'learn'; render(); } break;
      // leksjon
      case 'sel': if (L && L.state === 'idle') { L.cur.sel = +el.dataset.i; sfx.tap(); render(); } break;
      case 'tile': if (L && L.state === 'idle') { const x = L.cur; const k = x.slots.indexOf(null); if (k >= 0) { x.slots[k] = +el.dataset.i; sfx.tap(); render(); } } break;
      case 'unslot': if (L && L.state === 'idle') { L.cur.slots[+el.dataset.i] = null; render(); } break;
      case 'mL': case 'mR': if (L && L.state === 'idle') matchTap(a === 'mL' ? 'L' : 'R', +el.dataset.i); break;
      case 'check': check(); break;
      case 'cardOk': cardOk(); break;
      case 'calc': if (L && L.state === 'idle') { L.calc.open = !L.calc.open; render(); } break;
      case 'ck': if (L && L.state === 'idle') calcKey(el.dataset.k); break;
      case 'calcUse': if (L && L.state === 'idle' && L.calc.last !== undefined) {
        L.cur.input = calcFmt(L.calc.last);
        const inp = document.getElementById('numIn'); if (inp) inp.value = L.cur.input;
        const b = document.getElementById('checkBtn'); if (b) b.disabled = !canCheck(L.cur);
        sfx.tap();
      } break;
      case 'cont': cont(); break;
      case 'skip': if (L && L.state === 'idle') { if (L.cur.t === 'match') { L.cur.done = L.cur.left.map((it) => it.i); L.state = 'right'; L.ok = true; L.correct++; render(); } else { forceWrong(); } } break;
      case 'quit': UI.modal = 'quit'; render(); break;
      case 'quitYes': UI.modal = null; exitLesson(); break;
      case 'afterDone': afterDone(); break;
      case 'exit': exitLesson(); break;
      default: break;
    }
  });

  function cardOk() {
    const L = LESSON;
    if (!L || L.cur.t !== 'card' || L.state !== 'idle') return;
    L.correct++; L.ok = true; L.state = 'right';
    sfx.tap();
    cont();
  }

  function forceWrong() {
    const L = LESSON;
    L.ok = false; L.state = 'wrong'; L.mistakes++; L.combo = 0;
    recordAnswer(L.cur, false);
    if (usesHearts(L)) loseHeart();
    if (L.kind === 'jump' || L.kind === 'exam') L.lives--;
    S.stats.answered++;
    sfx.wrong(); save(); render();
  }

  function matchTap(side, i) {
    const L = LESSON, x = L.cur;
    if (x.bad) { x.bad = null; clearTimeout(x.badT); }
    if (side === 'L') x.selL = x.selL === i ? null : i; else x.selR = x.selR === i ? null : i;
    if (x.selL !== null && x.selR !== null) {
      if (x.selL === x.selR) {
        // riktig par: blinker grønt, og låses deretter
        const k = x.selL;
        x.done.push(k); x.ok = x.ok || [];
        x.ok.push(k);
        x.selL = x.selR = null;
        sfx.tap();
        setTimeout(() => {
          if (!LESSON || LESSON.cur !== x) return;
          x.ok = x.ok.filter((v) => v !== k);
          if (x.done.length === x.left.length && L.state === 'idle') {
            L.state = 'right'; L.ok = true; L.correct++; L.combo++;
            L.maxCombo = Math.max(L.maxCombo, L.combo);
            S.stats.maxCombo = Math.max(S.stats.maxCombo, L.combo);
            S.stats.answered++; S.stats.correct++;
            recordAnswer(x, true);
            today().combo = Math.max(today().combo, L.combo);
            L.praise = pickR(['Flott!', 'Alle par riktig!', 'Strålende!']);
            sfx.right(); save();
          }
          render();
        }, 550);
      } else {
        // feil par: blinker rødt, men kan velges igjen
        x.bad = { L: x.selL, R: x.selR };
        x.selL = x.selR = null;
        x.misses = (x.misses || 0) + 1;
        sfx.wrong();
        x.badT = setTimeout(() => { if (LESSON && LESSON.cur === x) { x.bad = null; render(); } }, 650);
      }
    } else sfx.tap();
    render();
  }

  document.addEventListener('keydown', (ev) => {
    if (!LESSON || UI.modal) return;
    const L = LESSON;
    if (ev.key === 'Enter') {
      ev.preventDefault();
      if (L.screen) { const b = document.getElementById('contBtn'); if (b) b.click(); return; }
      if (L.cur.t === 'card') { cardOk(); return; }
      if (L.state === 'idle') check(); else cont();
      return;
    }
    if (L.screen || L.state !== 'idle') return;
    const x = L.cur;
    if (x.t === 'mc' && /^[1-9]$/.test(ev.key) && +ev.key <= x.opts.length) { x.sel = +ev.key - 1; sfx.tap(); render(); }
  });

  // Oppdater visning (hjertetimer, liga) hvert minutt når appen er åpen.
  setInterval(() => { if (!LESSON && !UI.modal) { const y = window.scrollY; render(); window.scrollTo(0, y); } }, 60000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden && !LESSON) render(); });

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }

  // Til testing
  window.__fysikkling = { get state() { return S; }, get lesson() { return LESSON; }, get NODES() { return NODES; }, get COURSES() { return COURSES; }, skillLesson: (i, first) => skillLesson(NODES[i], first), setCourse: (id) => setCourse(id), repItems, repPlan, conceptReview, makeDrill };

  render();
})();
