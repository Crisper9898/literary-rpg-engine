import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// Authored vector plates for the deck encounter. Deterministic marks make the
// committed SVGs editable/reproducible without any runtime art dependency.
const out = join(dirname(fileURLToPath(import.meta.url)), "../public/assets/art/journey-deck");
mkdirSync(out, { recursive: true });
const C = { ink: "#101d1c", nearInk: "#172c29", swamp: "#29433b",
  moss: "#41584b", silt: "#647261", paper: "#cabf9d", pale: "#e0d3af",
  fog: "#819184", ochre: "#9a7850", brass: "#b39b6b", ember: "#c17d48",
  deck: "#544d3d", darkDeck: "#383a31" };
const wrap = (w, h, body, defs = "", x = 0, y = 0) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${x} ${y} ${w} ${h}"><defs>${defs}</defs>${body}</svg>\n`
    .replace(/[ \t]+(?=\n)/g, "");
const save = (name, value) => writeFileSync(join(out, `${name}.svg`), value, "utf8");
let seed = 22096;
const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const noise = (count, x0, x1, y0, y1, color, opacity = 0.15, len = 24) => {
  let body = `<g fill="none" stroke="${color}" stroke-opacity="${opacity}" stroke-linecap="round">`;
  for (let i = 0; i < count; i++) {
    const x = Math.round(x0 + random() * (x1 - x0));
    const y = Math.round(y0 + random() * (y1 - y0));
    const d = Math.round(4 + random() * len);
    body += `<path d="M${x} ${y}l${d} ${Math.round(random() * 5 - 3)}" stroke-width="${(0.6 + random() * 1.5).toFixed(1)}"/>`;
  }
  return body + "</g>";
};
const bankMass = (base, rise, points, color, lower) => {
  let d = `M0 ${base}`;
  for (let i = 0; i < points; i++) {
    const x = Math.round(i * 1920 / points);
    const y = Math.round(base - rise * (0.28 + 0.72 * random()));
    d += ` L${x} ${y}`;
  }
  return `<path d="${d}L1920 ${base}V${lower}H0Z" fill="${color}"/>`;
};

function skyWater() {
  const defs = `<linearGradient id="sky" x2="0" y2="1"><stop stop-color="#697563"/><stop offset=".48" stop-color="#455d53"/><stop offset="1" stop-color="#233f3b"/></linearGradient>
    <radialGradient id="burn" cx=".77" cy=".15" r=".38"><stop stop-color="#bea574" stop-opacity=".35"/><stop offset="1" stop-color="#9a7850" stop-opacity="0"/></radialGradient>
    <linearGradient id="water" x2="0" y2="1"><stop stop-color="#35544b"/><stop offset=".42" stop-color="#1d3935"/><stop offset="1" stop-color="#102a29"/></linearGradient>`;
  let body = `<rect width="1920" height="1080" fill="${C.ink}"/><path d="M0 0H1920V425H0Z" fill="url(#sky)"/><path d="M0 0H1920V425H0Z" fill="url(#burn)"/>`;
  body += `<path d="M0 85C260 53 334 100 565 68S907 100 1122 68 1537 105 1920 31V177C1610 165 1398 204 1080 168S527 211 0 179Z" fill="#bdc1a1" opacity=".11"/>
    <path d="M0 194C275 171 390 214 632 188S1070 201 1290 174 1670 218 1920 191V268H0Z" fill="#172f2e" opacity=".16"/>
    <path d="M0 411Q320 396 580 414T1110 407T1590 416T1920 405V1080H0Z" fill="url(#water)"/>
    <path d="M0 432Q360 418 710 438T1450 430T1920 444" fill="none" stroke="#8b9a85" stroke-opacity=".19" stroke-width="12"/>
    <path d="M0 512Q220 490 450 514T940 499T1390 517T1920 497" fill="none" stroke="#899c87" stroke-opacity=".08" stroke-width="20"/>`;
  for (let row = 0; row < 9; row++) {
    const y = 478 + row * 66;
    for (let i = 0; i < 7; i++) {
      const x = Math.round(i * 285 + (row % 3) * 31 + random() * 78);
      const length = 70 + Math.round(random() * 135);
      body += `<path d="M${x} ${y}q${Math.round(length * .4)} -6 ${length} -2m-${Math.round(length * .7)} 13q22 -3 43 -1" fill="none" stroke="${row < 3 ? C.fog : C.moss}" stroke-opacity="${(0.055 + random() * .08).toFixed(2)}" stroke-width="${row < 5 ? 3 : 2}"/>`;
    }
  }
  body += noise(210, 0, 1920, 20, 390, C.paper, .045, 36);
  body += noise(200, 0, 1920, 475, 1070, C.paper, .055, 45);
  save("journey-sky-water", wrap(1920, 1080, body, defs));
}

function distantRidge() {
  let body = `<path d="M0 414C138 400 211 386 321 396 439 368 497 346 607 361 720 348 817 381 945 371 1070 353 1150 357 1293 388 1415 372 1500 348 1615 363 1740 352 1821 394 1920 414V485H0Z" fill="#344e4b"/>
    <path d="M0 427C167 400 266 420 399 393 519 375 595 393 695 386 864 391 982 413 1116 393 1298 376 1390 423 1559 401 1750 393 1836 424 1920 427V489H0Z" fill="#263e3c"/>
    <path d="M0 439Q309 420 580 433T1060 439T1560 427T1920 440V465H0Z" fill="#182f30" opacity=".5"/>`;
  body += noise(140, 0, 1920, 385, 460, C.paper, .07, 31);
  save("journey-distant-ridge", wrap(1920, 150, body, "", 0, 340));
}

function farVegetation() {
  let body = `<path d="M0 446Q210 433 350 447T747 440T1190 448T1570 439T1920 446V496H0Z" fill="#213a35"/>`;
  for (let i = 0; i < 54; i++) {
    const x = Math.round(i * 36 + (i % 7) * 4);
    const h = 24 + Math.round(random() * 61);
    const y = 454 - h;
    const w = 13 + Math.round(random() * 24);
    body += `<path d="M${x - w} 460q${Math.round(w * .4)} -${Math.round(h * .6)} ${w} -${h}q${Math.round(w * .7)} ${Math.round(h * .2)} ${w} ${h}l${w} ${Math.round(h * .6)}Z" fill="${i % 4 === 0 ? '#2c4b3e' : '#233e38'}"/>
      <path d="M${x} ${y + 8}l-2 ${h + 8}" stroke="#132e2d" stroke-width="${i % 3 + 1}" opacity=".55"/>`;
  }
  body += `<path d="M0 472Q360 462 720 471T1440 468T1920 472V508H0Z" fill="#1c3531"/>`;
  body += noise(100, 0, 1920, 410, 478, C.fog, .05, 22);
  save("journey-far-vegetation", wrap(1920, 155, body, "", 0, 355));
}

function nearBank() {
  let body = `<path d="M0 481Q178 459 324 477T612 471T936 484T1252 469T1590 478T1920 480V516H0Z" fill="#142d2a"/>`;
  for (let i = 0; i < 25; i++) {
    const x = Math.round(45 + i * 77 + random() * 24);
    const w = 37 + Math.round(random() * 41);
    const h = 11 + Math.round(random() * 22);
    body += `<path d="M${x - w} 487Q${x - w * .4} ${470 - h} ${x} ${476 - h}Q${x + w * .3} ${464 - h} ${x + w} 485Z" fill="${i % 3 ? '#18352e' : '#244037'}"/>`;
    for (let j = 0; j < 4; j++) {
      const rx = x - w + j * w * .55;
      body += `<path d="M${rx} 490q-7 -${h + 6} -3 -${h + 19}m3 ${h + 19}q12 -${h + 3} 15 -${h + 11}" fill="none" stroke="#112b29" stroke-width="2"/>`;
    }
    body += `<path d="M${x - w} 516q${w} 4 ${w * 2} -1" fill="none" stroke="#99a38d" stroke-opacity=".12" stroke-width="2"/>`;
  }
  body += noise(85, 0, 1920, 471, 520, C.paper, .04, 17);
  save("journey-near-bank", wrap(1920, 105, body, "", 0, 425));
}

function riverCurrent() {
  let body = "";
  for (let row = 0; row < 12; row++) {
    const y = 518 + row * 48;
    for (let i = 0; i < 11; i++) {
      const x = Math.round(i * 176 + random() * 75);
      const len = 38 + Math.round(random() * 128);
      body += `<path d="M${x} ${y}q${Math.round(len * .3)} -4 ${len} -1m-${Math.round(len * .65)} 8q17 -2 31 0" fill="none" stroke="${i % 3 ? C.paper : C.silt}" stroke-opacity="${(0.07 + random() * .09).toFixed(2)}" stroke-width="${row % 3 ? 2 : 3}" stroke-linecap="round"/>`;
    }
  }
  save("journey-river-current", wrap(1920, 565, body, "", 0, 510));
}

function foregroundReeds() {
  let body = "";
  for (const [cx, cy, scale] of [[120, 1036, 1.2], [565, 1047, .62], [1330, 1030, 1], [1840, 1045, .9]]) {
    body += `<g transform="translate(${cx} ${cy}) scale(${scale})"><path d="M-80 9Q-13 -14 83 7L57 15H-68Z" fill="#102724" opacity=".85"/>`;
    for (let j = 0; j < 13; j++) {
      const x = -62 + j * 10;
      const h = 49 + (j * 17) % 65;
      body += `<path d="M${x} 4q${j % 2 ? 13 : -10} -${h * .55} ${j % 2 ? 3 : -16} -${h}q${j % 3 ? 10 : -9} ${Math.round(h * .28)} ${j % 2 ? 14 : 7} ${h - 4}Z" fill="${j % 4 ? '#102a27' : '#213c33'}" stroke="#0b211f" stroke-width="1.5"/>`;
    }
    body += `</g>`;
  }
  body += `<path d="M744 960q45 -13 91 -3 35 -21 74 -9m-123 18q71 11 143 4" fill="none" stroke="#6d7258" stroke-opacity=".52" stroke-width="4"/>`;
  save("journey-foreground-reeds", wrap(1920, 190, body, "", 0, 890));
}

function deckBase() {
  const defs = `<linearGradient id="planks" x2="0" y2="1"><stop stop-color="#746a4e"/><stop offset=".28" stop-color="#625945"/><stop offset="1" stop-color="#3e4136"/></linearGradient>
    <linearGradient id="cabin" x2="1" y2=".4"><stop stop-color="#495348"/><stop offset=".48" stop-color="#35443b"/><stop offset="1" stop-color="#1b302d"/></linearGradient>
    <linearGradient id="lamp" x2="0" y2="1"><stop stop-color="#ddb377" stop-opacity=".9"/><stop offset="1" stop-color="#986944" stop-opacity=".52"/></linearGradient>
    <pattern id="cross" width="14" height="14" patternUnits="userSpaceOnUse"><path d="M-2 14L14 -2M8 18L18 8" stroke="#e0d3af" stroke-opacity=".09" stroke-width="1"/></pattern>`;
  let body = `<path d="M264 617L1614 616 1740 754 1614 938 300 938 219 851Z" fill="#121f1e" stroke="#0e1d1d" stroke-width="16" stroke-linejoin="round"/>
    <path d="M276 622L1605 622 1713 754 1598 914 311 916 239 848Z" fill="url(#planks)" stroke="#b29a6c" stroke-width="8" stroke-linejoin="round"/>
    <path d="M281 624H1600l30 34H270Z" fill="#b9a376" opacity=".16"/>
    <path d="M311 916H1598L1713 754l-121 143H314Z" fill="#122420" opacity=".31"/>
    <path d="M243 849l70 67 1284 -1 116 -161" fill="none" stroke="#ceb486" stroke-opacity=".35" stroke-width="3"/>`;
  for (let i = 0; i < 8; i++) {
    const y = 653 + i * 36;
    const left = Math.round(271 + (y - 620) * .16);
    const right = Math.round(1620 + (y - 620) * .33);
    body += `<path d="M${left} ${y}Q930 ${y + (i % 3) * 2 - 3} ${right} ${y - 2}" fill="none" stroke="#172723" stroke-opacity=".62" stroke-width="${i % 2 ? 5 : 4}"/>
      <path d="M${left + 7} ${y + 5}Q950 ${y + 3} ${right - 20} ${y + 5}" fill="none" stroke="#d6c49a" stroke-opacity=".13" stroke-width="2"/>`;
  }
  for (let x = 380; x < 1610; x += 183) {
    body += `<path d="M${x} 626l${Math.round((x - 950) * .085)} 285" stroke="#1a2925" stroke-opacity=".4" stroke-width="3"/>
      <path d="M${x + 13} 645q-22 57 3 112m-9 13q-17 44 1 105" fill="none" stroke="#d9c7a0" stroke-opacity=".08" stroke-width="2"/>`;
  }
  body += noise(250, 310, 1590, 640, 910, C.paper, .115, 29);
  // Cabin and its raking shadow are painted on the same plane as the planks.
  body += `<path d="M354 631l250 16 109 197-332 -37Z" fill="#182723" opacity=".24"/>
    <path d="M346 493l220 -2 1 147-220 1Z" fill="url(#cabin)" stroke="#10211f" stroke-width="7"/>
    <path d="M329 481l242 -2-15 22-207 2Z" fill="#172825" stroke="#0c1b1a" stroke-width="5"/>
    <path d="M336 482l217 0-12 6-191 0Z" fill="#b1986d" opacity=".55"/>
    <path d="M346 499l16 0 0 136-16 3m205 -139l14 0 0 140-14 0" fill="#162b27" opacity=".65"/>
    <path d="M370 510H541V627H370Z" fill="url(#cross)" opacity=".52"/>
    <path d="M375 519h69v53h-69Zm91 0h69v53h-69Z" fill="#132521" stroke="#0e1c1c" stroke-width="5"/>
    <path d="M381 526h57v40h-57Zm91 0h57v40h-57Z" fill="url(#lamp)"/>
    <path d="M411 522v46m-33 -22h63m61 -24v46m-32 -22h62" fill="none" stroke="#192623" stroke-width="5"/>
    <path d="M380 570q39 5 60 0m31 0q42 5 60 0" fill="none" stroke="#d5bc86" stroke-opacity=".23" stroke-width="2"/>
    <path d="M351 602q45 9 88 -3 73 14 120 0" fill="none" stroke="#c2ae88" stroke-opacity=".18" stroke-width="2"/>
    <path d="M375 577l65 0 74 132-196 0Z" fill="#c17d48" opacity=".045"/>
    <path d="M471 577l61 0 95 124-118 0Z" fill="#c17d48" opacity=".035"/>`;
  body += noise(95, 352, 557, 500, 632, C.paper, .075, 16);
  save("journey-deck-base", wrap(1550, 480, body, defs, 205, 470));
}

function deckFittings() {
  let body = `<g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M572 557H1602" stroke="#132522" stroke-width="12"/>
    <path d="M572 551Q1110 547 1602 551" stroke="#b9a075" stroke-width="6"/>
    <path d="M572 558H1602" stroke="#e1cea1" stroke-opacity=".26" stroke-width="2"/>`;
  for (let x = 595; x < 1600; x += 95) {
    body += `<path d="M${x} 558v65" stroke="#172823" stroke-width="9"/>
      <path d="M${x - 2} 559v64" stroke="#b7a074" stroke-width="4"/>
      <path d="M${x - 5} 625h12" stroke="#e2c697" stroke-opacity=".55" stroke-width="2"/>`;
  }
  body += `<path d="M328 908Q964 911 1619 907" stroke="#0c1d1d" stroke-width="14"/>
    <path d="M326 904Q938 906 1619 902" stroke="#c1a879" stroke-width="4"/>`;
  for (let x = 341; x < 1600; x += 94) {
    body += `<path d="M${x} 873v50" stroke="#0e211f" stroke-width="11"/>
      <path d="M${x - 3} 876v43" stroke="#958060" stroke-opacity=".38" stroke-width="2"/>`;
  }
  body += `<path d="M266 840q35 64 85 90H1634" stroke="#0b1d1d" stroke-width="15"/>
    <path d="M270 837q35 65 82 85H1634" stroke="#c2a878" stroke-width="3" stroke-opacity=".7"/>
    <path d="M1520 556C1591 639 1484 765 1571 904" stroke="#152420" stroke-width="10"/>
    <path d="M1522 555C1593 645 1487 761 1572 902" stroke="#a38a62" stroke-width="3" stroke-opacity=".65"/>
    <path d="M1518 555q7 -20 21 -4" stroke="#d0b98b" stroke-width="4"/>`;
  body += `</g>`;
  save("journey-deck-fittings", wrap(1400, 410, body, "", 255, 540));
}

function cargo() {
  let body = `<ellipse cx="1453" cy="681" rx="109" ry="21" fill="#14231f" opacity=".52"/>
    <path d="M1383 579l63 -31 74 27-59 32Z" fill="#8c7855" stroke="#1a2823" stroke-width="7" stroke-linejoin="round"/>
    <path d="M1383 579l78 28v71l-78 -28Z" fill="#4c4736" stroke="#1a2823" stroke-width="7" stroke-linejoin="round"/>
    <path d="M1461 607l59 -32v67l-59 36Z" fill="#252f29" stroke="#14231f" stroke-width="7" stroke-linejoin="round"/>
    <path d="M1398 581l75 -26m-53 36 74 -28m-68 50 0 50m21 -44v52m42 -63v56" stroke="#d5c098" stroke-opacity=".26" stroke-width="3"/>
    <path d="M1392 600l61 23m-61 10 61 21m19 -51 39 -23m-39 52 39 -23" stroke="#111f1d" stroke-opacity=".6" stroke-width="3"/>
    <path d="M1400 569q55 41 113 26m-69 -39q31 50 21 113" fill="none" stroke="#c4a97b" stroke-width="5" stroke-opacity=".78"/>
    <path d="M1404 566q57 37 110 23" fill="none" stroke="#2b3028" stroke-width="2" stroke-opacity=".75"/>
    <path d="M1460 674q-20 13 -52 7" fill="none" stroke="#d5b682" stroke-opacity=".2" stroke-width="3"/>
    <path d="M423 570h65v58h-65Z" fill="#5b503b" stroke="#c1a777" stroke-width="3"/>
    <path d="M428 575h55v48h-55Z" fill="none" stroke="#182622" stroke-opacity=".65" stroke-width="2"/>`;
  body += noise(35, 1390, 1515, 570, 670, C.paper, .12, 18);
  save("journey-cargo", wrap(1110, 170, body, "", 420, 540));
}

const castDefs = `<linearGradient id="coat" x2="1" y2=".75"><stop stop-color="#596058"/><stop offset=".45" stop-color="#343e39"/><stop offset="1" stop-color="#182926"/></linearGradient>
  <linearGradient id="linen" x2="1" y2="1"><stop stop-color="#a5aa90"/><stop offset=".45" stop-color="#68796a"/><stop offset="1" stop-color="#34483f"/></linearGradient>
  <linearGradient id="skin" x2="1" y2=".5"><stop stop-color="#b49d78"/><stop offset=".6" stop-color="#947f62"/><stop offset="1" stop-color="#5c614f"/></linearGradient>`;

function marlowFrame(pose) {
  const step = pose === "walkA" ? 8 : pose === "walkB" ? -8 : 0;
  const arm = pose === "walkA" ? 6 : pose === "walkB" ? -6 : 0;
  return `<g stroke-linejoin="round" stroke-linecap="round">
    <path d="M57 77Q50 93 55 111l-7 18q14 8 23 -3l12 -15 17 18q12 3 19 -7l-16 -34-2 -17Z" fill="#1d302b" stroke="#0d1c1b" stroke-width="4"/>
    <path d="M66 112l${step - 6} 24 14 2 6 -25m16 -3l${-step + 4} 26 13 2 -2 -28" fill="#3b4238" stroke="#12211f" stroke-width="4"/>
    <path d="M${60 + step} 134q-11 1 -13 8h25v-8m${48 - step} -1q7 1 11 9h-25v-8" fill="#172522" stroke="#0b1b1b" stroke-width="3"/>
    <path d="M53 72q-7 14 -6 35l-7 20 15 -3 12 -19 13 8 12 -6 14 19 14 1 -8 -25q3 -19 -9 -31l-26 -10Z" fill="url(#coat)" stroke="#10211e" stroke-width="5"/>
    <path d="M54 73q-7 7 -8 21l-7 22 13 4 15 -28-3 -20Z" fill="#48534a" stroke="#142622" stroke-width="3"/>
    <path d="M103 73q10 8 11 27l10 17-14 7-18 -28 1 -26Z" fill="#273a33" stroke="#142622" stroke-width="3"/>
    <path d="M49 85q-4 22 -3 32l-8 ${7 + arm} 9 5 14 -20m53 -5q7 11 7 26l10 ${-7 - arm} 9 -5 -15 -27" fill="none" stroke="#142420" stroke-width="11"/>
    <path d="M39 ${123 + arm}q1 -7 8 -8 7 1 7 8 -6 8 -15 0m78 ${-arm}q2 -8 8 -8 6 0 8 7 -2 8 -16 1" fill="url(#skin)" stroke="#1d2923" stroke-width="2"/>
    <path d="M69 68l11 15 15 -15-8 34-9 8-8 -20Z" fill="#d1c9aa" stroke="#12211e" stroke-width="3"/>
    <path d="M76 82l7 4-1 21-6 6-3 -7Z" fill="#142622"/>
    <path d="M55 73l19 25-12 -3 7 15-17 13m51 -50L89 97l11 -4-8 16 18 15" fill="none" stroke="#b7b7a1" stroke-opacity=".42" stroke-width="2"/>
    <path d="M56 73q4 26 -6 47m56 -44q-5 34 8 49" fill="none" stroke="#d6b989" stroke-opacity=".2" stroke-width="3"/>
    <path d="M62 44q2 -17 20 -17 19 2 18 21l-4 18q-11 17 -25 4l-9 -13Z" fill="url(#skin)" stroke="#172420" stroke-width="4"/>
    <path d="M64 44q-5 21 9 25l4 6q-15 -1 -19 -16l2 -15Z" fill="#3e4e42" opacity=".7"/>
    <path d="M61 43q-3 -22 17 -23 21 -2 25 13l-6 14-8 -8-26 5Z" fill="#182723" stroke="#0b1a19" stroke-width="3"/>
    <path d="M52 38q25 -9 54 -3l4 8q-31 7 -59 1Z" fill="#172523" stroke="#0e1b1b" stroke-width="3"/>
    <path d="M76 52q5 -3 9 0m9 -1 5 0m-10 5-2 7 5 2m-12 4q7 4 13 -1" fill="none" stroke="#182722" stroke-width="2"/>
    <path d="M67 37q21 -8 35 -3m-47 50 12 16m-1 15 8 5m31 -42-4 22" fill="none" stroke="#d5c59d" stroke-opacity=".23" stroke-width="1.5"/>
    <path d="M66 117l-10 12m43 -10 11 14" stroke="#0e1f1d" stroke-opacity=".53" stroke-width="2"/>
  </g>`;
}

function deckhandFrame(pose) {
  const walk = pose === "walkA" ? 8 : pose === "walkB" ? -8 : 0;
  const coil = pose === "coilA" || pose === "coilB";
  const cargo = pose === "cargo";
  const lookout = pose === "lookout";
  const lean = cargo ? 7 : lookout ? -3 : 0;
  const handY = coil ? (pose === "coilA" ? 104 : 109) : cargo ? 112 : lookout ? 54 : 106;
  const handX = lookout ? 111 : 108;
  return `<g stroke-linejoin="round" stroke-linecap="round" transform="translate(${lean} 0)">
    <path d="M57 77q-8 11 -8 36l10 10 18 -10 25 11 8 -11q-3 -25 -15 -37Z" fill="#1e312b" stroke="#10211e" stroke-width="4"/>
    <path d="M67 112l${walk - 5} 25 12 3 7 -27m16 0l${-walk + 3} 24 14 3 -1 -29" fill="#4c5145" stroke="#152521" stroke-width="4"/>
    <path d="M${61 + walk} 136q-9 -2 -14 7h28v-7m${47 - walk} 0q7 -3 13 7h-28v-7" fill="#14241f" stroke="#0d1d1b" stroke-width="3"/>
    <path d="M58 71q19 -8 42 1l11 43-11 10-41 -3-10 -17Z" fill="url(#linen)" stroke="#10211e" stroke-width="5"/>
    <path d="M64 74q-11 8 -15 22l-6 18 12 5 18 -24 2 -23Z" fill="#758674" stroke="#182b25" stroke-width="3"/>
    <path d="M94 73q12 7 15 26l8 16-11 6-20 -26Z" fill="#5b6d5d" stroke="#182b25" stroke-width="3"/>
    <path d="M68 75l12 23 14 -23-10 34-5 4-6 -8Z" fill="#e0d7b2" stroke="#22342b" stroke-width="2"/>
    <path d="M77 89h8l-2 20h-7Z" fill="#182d27"/>
    <path d="M58 98l-11 ${handY - 98} 13 3 14 -20m24 -1 18 ${handY - 99} 11 -4 -16 -27" fill="none" stroke="#20382e" stroke-width="11"/>
    <path d="M44 ${handY}q-3 -8 4 -10 10 -1 11 7 -2 10 -15 3m${handX - 8} ${handY - 2}q0 -8 9 -9 7 0 8 8 -2 8 -17 6" fill="url(#skin)" stroke="#202e25" stroke-width="2"/>
    <path d="M59 107h44l3 10H56Z" fill="#233a31" stroke="#172822" stroke-width="3"/>
    <path d="M64 106h31m-29 13h36" fill="none" stroke="#d6cba7" stroke-opacity=".22" stroke-width="2"/>
    <path d="M66 44q2 -17 18 -18 20 0 21 20l-5 18q-11 19 -25 5l-9 -13Z" fill="url(#skin)" stroke="#172521" stroke-width="4"/>
    <path d="M68 47q-1 18 9 25-13 -2 -16 -19l2 -9Z" fill="#485847" opacity=".6"/>
    <path d="M63 43q-4 -17 17 -22 18 -1 26 13l-4 13-11 -8-28 9Z" fill="#202f28" stroke="#0d1d1b" stroke-width="3"/>
    <path d="M57 39q24 -12 52 -4l-2 10q-19 3 -46 1Z" fill="#192c25" stroke="#0c1b19" stroke-width="3"/>
    <path d="M61 39q20 -9 46 -3" fill="none" stroke="#a69b77" stroke-opacity=".48" stroke-width="2"/>
    <path d="M78 51q4 -3 9 0m8 0 5 1m-10 4-2 8 5 1m-12 4q6 3 12 -2" fill="none" stroke="#1b2b23" stroke-width="2"/>
    <path d="M59 83q-3 20 4 27m44 -29q4 15 3 27m-47 -25 9 9m26 -11-8 13" fill="none" stroke="#d7d1b4" stroke-opacity=".25" stroke-width="2"/>
    ${coil ? `<path d="M48 ${handY}q-28 3 -23 22 3 20 31 15 23 -4 27 -22 5 -19 -10 -21m-17 9q-20 7 -14 19 6 12 26 5 14 -5 12 -18m-29 16q11 6 23 -3" fill="none" stroke="#bfa579" stroke-width="5" stroke-linecap="round"/>
      <path d="M49 ${handY + 2}q-25 6 -19 23 8 20 46 3" fill="none" stroke="#e2c99a" stroke-opacity=".42" stroke-width="1.5"/>` : ""}
    ${cargo ? `<path d="M101 103q13 -7 26 -4l17 -15" fill="none" stroke="#c8ae81" stroke-width="5"/><path d="M127 101q7 2 11 -3" fill="none" stroke="#1d2b24" stroke-width="3"/>` : ""}
    ${lookout ? `<path d="M93 54q10 -8 23 -4" fill="none" stroke="#d9ca9e" stroke-opacity=".55" stroke-width="3"/>` : ""}
  </g>`;
}

function actorSheets() {
  const marlow = ["idle", "walkA", "walkB"].map((pose, i) =>
    `<g transform="translate(${i * 160} 0)">${marlowFrame(pose)}</g>`).join("");
  const deckhand = ["idle", "walkA", "walkB", "coilA", "coilB", "cargo", "lookout"]
    .map((pose, i) => `<g transform="translate(${i * 160} 0)">${deckhandFrame(pose)}</g>`).join("");
  save("marlow-sheet", wrap(480, 160, marlow, castDefs));
  save("deckhand-sheet", wrap(1120, 160, deckhand, castDefs));
}

skyWater();
distantRidge();
farVegetation();
nearBank();
riverCurrent();
foregroundReeds();
deckBase();
deckFittings();
cargo();
actorSheets();
