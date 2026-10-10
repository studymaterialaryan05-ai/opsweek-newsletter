const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
const colors = { ink:"#14251f", paper:"#fbfaf5", lime:"#d8f36b", green:"#55765a", orange:"#ef8b55", blue:"#b9dbe0", muted:"#66756d", line:"#dce3da" };

export function heroIllustration(title = "Operations in motion") {
  return `<svg class="hero-illustration" viewBox="0 0 720 210" role="img" aria-label="${esc(title)}" xmlns="http://www.w3.org/2000/svg">
    <rect width="720" height="210" rx="16" fill="${colors.ink}"/>
    <circle cx="620" cy="28" r="92" fill="${colors.green}" opacity=".55"/>
    <circle cx="664" cy="184" r="68" fill="${colors.orange}" opacity=".85"/>
    <path d="M38 157 H682" stroke="#ffffff" stroke-opacity=".25" stroke-width="2" stroke-dasharray="5 7"/>
    <g transform="translate(45 46)">
      <rect x="0" y="42" width="120" height="70" rx="8" fill="${colors.lime}"/>
      <rect x="14" y="55" width="25" height="44" rx="3" fill="${colors.ink}" opacity=".82"/>
      <rect x="47" y="55" width="25" height="44" rx="3" fill="${colors.ink}" opacity=".62"/>
      <rect x="80" y="55" width="25" height="44" rx="3" fill="${colors.ink}" opacity=".42"/>
      <path d="M130 76 H175" stroke="${colors.paper}" stroke-width="4" stroke-linecap="round"/><path d="M166 66 L178 76 L166 86" fill="none" stroke="${colors.paper}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="190" y="22" width="122" height="90" rx="8" fill="${colors.blue}"/>
      <path d="M210 45 H292 M210 63 H280 M210 81 H290" stroke="${colors.ink}" stroke-width="5" stroke-linecap="round" opacity=".7"/>
      <path d="M322 76 H365" stroke="${colors.paper}" stroke-width="4" stroke-linecap="round"/><path d="M356 66 L368 76 L356 86" fill="none" stroke="${colors.paper}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="382" y="42" width="120" height="70" rx="8" fill="${colors.orange}"/>
      <circle cx="412" cy="77" r="13" fill="${colors.ink}"/><circle cx="452" cy="77" r="13" fill="${colors.ink}"/><path d="M405 100 H460" stroke="${colors.ink}" stroke-width="5" stroke-linecap="round"/>
    </g>
    <text x="42" y="25" fill="${colors.lime}" font-family="Arial,sans-serif" font-size="11" font-weight="700" letter-spacing="2">THE OPERATING SYSTEM</text>
    <text x="42" y="190" fill="${colors.paper}" font-family="Arial,sans-serif" font-size="11" letter-spacing="1.5">SUPPLY</text><text x="248" y="190" fill="${colors.paper}" font-family="Arial,sans-serif" font-size="11" letter-spacing="1.5">PROCESS</text><text x="452" y="190" fill="${colors.paper}" font-family="Arial,sans-serif" font-size="11" letter-spacing="1.5">CUSTOMER</text>
  </svg>`;
}

export function decisionFlowIllustration() {
  return `<svg class="decision-flow" viewBox="0 0 680 120" role="img" aria-label="Operational decision flow" xmlns="http://www.w3.org/2000/svg">
    <rect width="680" height="120" rx="12" fill="#edf3df"/>
    <g font-family="Arial,sans-serif" text-anchor="middle">
      <rect x="16" y="28" width="142" height="62" rx="8" fill="${colors.ink}"/><text x="87" y="53" fill="${colors.lime}" font-size="10" font-weight="700">01 / OBSERVE</text><text x="87" y="70" fill="#fff" font-size="12">Read the signal</text>
      <path d="M164 59 H190" stroke="${colors.green}" stroke-width="3"/><path d="M183 52 L191 59 L183 66" fill="none" stroke="${colors.green}" stroke-width="3"/>
      <rect x="198" y="28" width="142" height="62" rx="8" fill="${colors.blue}"/><text x="269" y="53" fill="${colors.ink}" font-size="10" font-weight="700">02 / DIAGNOSE</text><text x="269" y="70" fill="${colors.ink}" font-size="12">Find the constraint</text>
      <path d="M346 59 H372" stroke="${colors.green}" stroke-width="3"/><path d="M365 52 L373 59 L365 66" fill="none" stroke="${colors.green}" stroke-width="3"/>
      <rect x="380" y="28" width="142" height="62" rx="8" fill="${colors.orange}"/><text x="451" y="53" fill="${colors.ink}" font-size="10" font-weight="700">03 / ACT</text><text x="451" y="70" fill="${colors.ink}" font-size="12">Test a response</text>
      <path d="M528 59 H554" stroke="${colors.green}" stroke-width="3"/><path d="M547 52 L555 59 L547 66" fill="none" stroke="${colors.green}" stroke-width="3"/>
      <rect x="562" y="28" width="102" height="62" rx="8" fill="${colors.lime}"/><text x="613" y="53" fill="${colors.ink}" font-size="10" font-weight="700">04 / LEARN</text><text x="613" y="70" fill="${colors.ink}" font-size="12">Measure</text>
    </g>
  </svg>`;
}

export function conceptMapIllustration(concept = {}) {
  const nodes = [
    {x:30, y:20, w:184, h:95, color:colors.orange, title:"CAUSES", items:concept.causes},
    {x:248, y:20, w:184, h:95, color:colors.blue, title:"CONSEQUENCES", items:concept.consequences},
    {x:466, y:20, w:184, h:95, color:colors.lime, title:"INTERVENTIONS", items:concept.interventions}
  ];
  const cards = nodes.map(n => {
    const items = (Array.isArray(n.items) ? n.items : []).slice(0,3);
    return `<rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="9" fill="#fff" stroke="${colors.line}"/><rect x="${n.x}" y="${n.y}" width="${n.w}" height="7" rx="3" fill="${n.color}"/><text x="${n.x+12}" y="${n.y+25}" font-family="Arial,sans-serif" font-size="10" font-weight="700" fill="${colors.ink}" letter-spacing="1">${n.title}</text>${items.map((item,i)=>`<circle cx="${n.x+15}" cy="${n.y+43+i*17}" r="2.5" fill="${colors.green}"/><text x="${n.x+23}" y="${n.y+47+i*17}" font-family="Arial,sans-serif" font-size="8.2" fill="${colors.muted}">${esc(String(item).slice(0,29))}`).join("")}`;
  }).join("");
  const name = esc(concept.name || "Operational Resilience").slice(0,36);
  return `<svg class="concept-map-visual" viewBox="0 0 680 170" role="img" aria-label="Concept map: ${name}" xmlns="http://www.w3.org/2000/svg">
    <path d="M340 4 V14 M122 14 H558 M122 14 V19 M340 14 V19 M558 14 V19" fill="none" stroke="${colors.green}" stroke-width="2"/>
    ${cards}
    <rect x="212" y="130" width="256" height="30" rx="15" fill="${colors.ink}"/><text x="340" y="149" text-anchor="middle" font-family="Georgia,serif" font-size="13" fill="${colors.lime}">${name}</text>
  </svg>`;
}

export function cartoonIllustration(kind = "forecasting") {
  const scenes = {
    forecasting: {label:"FORECASTING", speech:"The forecast is confident. The demand is imaginary.", object:"boxes"},
    bottleneck: {label:"BOTTLENECKS", speech:"Every team hit target. The order still waits here.", object:"queue"},
    procurement: {label:"TOTAL COST", speech:"We saved on price. Then paid for rush freight.", object:"truck"}
  };
  const s = scenes[kind] || scenes.forecasting;
  const drawing = s.object === "truck"
    ? `<rect x="30" y="83" width="104" height="42" rx="5" fill="${colors.orange}"/><rect x="134" y="96" width="44" height="29" rx="4" fill="${colors.blue}"/><circle cx="67" cy="132" r="11" fill="${colors.ink}"/><circle cx="150" cy="132" r="11" fill="${colors.ink}"/><path d="M143 96 L159 96 L178 113 L143 113Z" fill="${colors.blue}"/>`
    : s.object === "queue"
    ? `<rect x="28" y="95" width="165" height="7" rx="3" fill="${colors.ink}"/><circle cx="48" cy="77" r="10" fill="${colors.orange}"/><circle cx="89" cy="77" r="10" fill="${colors.blue}"/><circle cx="130" cy="77" r="10" fill="${colors.lime}"/><circle cx="171" cy="77" r="10" fill="${colors.orange}"/><path d="M48 87 V95 M89 87 V95 M130 87 V95 M171 87 V95" stroke="${colors.ink}" stroke-width="3"/>`
    : `<rect x="28" y="92" width="42" height="38" fill="${colors.orange}"/><rect x="74" y="74" width="42" height="56" fill="${colors.blue}"/><rect x="120" y="52" width="42" height="78" fill="${colors.lime}"/><path d="M20 137 H174" stroke="${colors.ink}" stroke-width="4"/>`;
  return `<svg class="cartoon-art" viewBox="0 0 220 154" role="img" aria-label="${s.label}: editorial operations cartoon" xmlns="http://www.w3.org/2000/svg">
    <rect width="220" height="154" rx="10" fill="#edf3df"/><circle cx="188" cy="25" r="26" fill="${colors.lime}"/>
    <path d="M13 31 H207" stroke="${colors.line}" stroke-width="1"/>
    <rect x="12" y="10" width="112" height="24" rx="12" fill="${colors.ink}"/><text x="68" y="26" text-anchor="middle" font-family="Arial,sans-serif" font-size="8" font-weight="700" letter-spacing="1" fill="${colors.lime}">${s.label}</text>
    <path d="M24 48 Q24 39 34 39 H188 Q198 39 198 49 V66 Q198 76 188 76 H72 L58 87 L60 76 H34 Q24 76 24 66Z" fill="#fff" stroke="${colors.green}" stroke-width="1.2"/>
    <text x="111" y="54" text-anchor="middle" font-family="Arial,sans-serif" font-size="8.5" fill="${colors.ink}">${esc(s.speech.slice(0,29))}</text><text x="111" y="65" text-anchor="middle" font-family="Arial,sans-serif" font-size="8.5" fill="${colors.ink}">${esc(s.speech.slice(29,58))}</text>
    ${drawing}
  </svg>`;
}
