import { SketchbookPage } from './types';

export const DEFAULT_BOTANICAL_PAGES: SketchbookPage[] = [
  {
    id: 'marina-bay-sands',
    title: 'Marina Bay Sands',
    place: 'Bayfront',
    url: '/landing-pages/meng-to-sketchbook/marina-bay-sands.png',
    alt: 'Watercolor sketch of Marina Bay Sands hotel towers in Singapore',
    description: 'Iconic three-tower resort crowned with the cantilevered SkyPark observatory deck.',
    year: '2010',
    plateNumber: 'PLATE 01',
  },
  {
    id: 'gardens-by-the-bay',
    title: 'Gardens by the Bay',
    place: 'Supertree Grove',
    url: '/landing-pages/meng-to-sketchbook/gardens-by-the-bay.png',
    alt: 'Watercolor illustration of the futuristic Supertree Grove vertical gardens',
    description: 'Towering vertical gardens covered in rare orchids, bromeliads, and tropical climbing ferns.',
    year: '2012',
    plateNumber: 'PLATE 02',
  },
  {
    id: 'merlion',
    title: 'The Merlion',
    place: 'Merlion Park',
    url: '/landing-pages/meng-to-sketchbook/merlion.png',
    alt: 'Ink sketch of the mythical Merlion fountain overlooking Marina Bay',
    description: 'The mythical half-lion, half-fish emblem representing Singapore’s maritime roots as Temasek.',
    year: '1972',
    plateNumber: 'PLATE 03',
  },
  {
    id: 'buddha-tooth',
    title: 'Buddha Tooth Relic Temple',
    place: 'Chinatown',
    url: '/landing-pages/meng-to-sketchbook/buddha-tooth.png',
    alt: 'Architectural sketch of the Tang-dynasty style Buddha Tooth Relic Temple',
    description: 'Four-storey Buddhist temple and museum based on Tang-dynasty architectural style and mandala geometry.',
    year: '2007',
    plateNumber: 'PLATE 04',
  },
  {
    id: 'joo-chiat',
    title: 'Joo Chiat Shophouses',
    place: 'Katong',
    url: '/landing-pages/meng-to-sketchbook/joo-chiat.png',
    alt: 'Pastel watercolor of decorative Peranakan shophouse facades along Koon Seng Road',
    description: 'Pastel-hued two-storey residential shophouses adorned with ceramic floral tiles and intricate plaster bas-reliefs.',
    year: '1920',
    plateNumber: 'PLATE 05',
  },
  {
    id: 'lau-pa-sat',
    title: 'Lau Pa Sat',
    place: 'Raffles Quay',
    url: '/landing-pages/meng-to-sketchbook/lau-pa-sat.png',
    alt: 'Architectural sketch of the octagonal cast-iron Victorian market Telok Ayer',
    description: 'Historic octagonal Victorian market featuring ornate Scottish cast-iron filigree and towering clock tower.',
    year: '1894',
    plateNumber: 'PLATE 06',
  },
  {
    id: 'marina-bay-skyline',
    title: 'Marina Bay Skyline',
    place: 'The Bay',
    url: '/landing-pages/meng-to-sketchbook/marina-bay-skyline.png',
    alt: 'Sweeping panoramic sketch of modern architectural skyline across Marina Bay',
    description: 'Dynamic convergence of civic architecture, glass skyscrapers, and calm inner harbor waters.',
    year: '2020',
    plateNumber: 'PLATE 07',
  },
  {
    id: 'singapore-river',
    title: 'Singapore River',
    place: 'Boat Quay',
    url: '/landing-pages/meng-to-sketchbook/singapore-river.png',
    alt: 'Ink wash of historical bumboats along the historic quays of Singapore River',
    description: 'The lifeline of historic trade where bumboats ferried spices and rubber beneath colonial bridges.',
    year: '1983',
    plateNumber: 'PLATE 08',
  },
  {
    id: 'botanic-gardens',
    title: 'Botanic Gardens',
    place: 'Tanglin',
    url: '/landing-pages/meng-to-sketchbook/botanic-gardens.png',
    alt: 'Botanical field study of tropical palm flora and Bandstand gazebo',
    description: 'UNESCO World Heritage tropical garden founded in 1859, home to the historic octagonal Bandstand.',
    year: '1859',
    plateNumber: 'PLATE 09',
  },
];

// Helper to create high-resolution SVG spread data URIs (1760x1240)
function createChakraSvgSpread(options: {
  plateNo: string;
  sanskrit: string;
  title: string;
  subtitle: string;
  location: string;
  coords: string;
  era: string;
  body: string[];
  drawArt: string;
  isDark?: boolean;
}): string {
  const {
    plateNo,
    sanskrit,
    title,
    subtitle,
    location,
    coords,
    era,
    body,
    drawArt,
    isDark = false,
  } = options;

  // Theme palettes
  const bg = isDark ? '#080e1c' : '#FAF6EE';
  const paperLeft = isDark ? '#0b1426' : '#FDF9F2';
  const paperRight = isDark ? '#091122' : '#FBF7EE';
  const spineGutter = isDark ? 'rgba(0,0,0,0.5)' : 'rgba(58,40,20,0.18)';
  const borderCol = isDark ? 'rgba(212,160,23,0.35)' : 'rgba(180,130,50,0.32)';
  const goldPrimary = isDark ? '#F59E0B' : '#C28518';
  const goldLight = isDark ? '#FDE68A' : '#D4A017';
  const textDark = isDark ? '#F3F4F6' : '#1A0800';
  const textMuted = isDark ? '#9CA3AF' : '#6B4423';
  const textFaint = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(43,39,33,0.45)';
  const saffron = isDark ? '#FB923C' : '#E8550A';

  const xmlEscape = (str: string) =>
    str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const safeTitle = xmlEscape(title);
  const safeSubtitle = xmlEscape(subtitle);
  const safeLocation = xmlEscape(location);
  const safeEra = xmlEscape(era);
  const safeCoords = xmlEscape(coords);
  const safePlateNo = xmlEscape(plateNo);

  const bodyParagraphs = body
    .map(
      (p, i) =>
        `<text x="160" y="${630 + i * 42}" font-family="'Newsreader', Georgia, serif" font-size="21" fill="${textDark}" font-weight="300" letter-spacing="0.01em">${xmlEscape(p)}</text>`
    )
    .join('');

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1760 1240" width="1760" height="1240">
  <defs>
    <!-- Paper Shading Gradients -->
    <linearGradient id="gutter-left" x1="1" y1="0" x2="0" y2="0">
      <stop offset="0%" stop-color="${spineGutter}"/>
      <stop offset="100%" stop-color="transparent"/>
    </linearGradient>
    <linearGradient id="gutter-right" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${spineGutter}"/>
      <stop offset="100%" stop-color="transparent"/>
    </linearGradient>
    <linearGradient id="gold-foil" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${goldLight}"/>
      <stop offset="50%" stop-color="${goldPrimary}"/>
      <stop offset="100%" stop-color="${saffron}"/>
    </linearGradient>
    <filter id="soft-shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="${isDark ? '#000000' : 'rgba(70,40,15,0.18)'}"/>
    </filter>
  </defs>

  <!-- Left Page Canvas -->
  <rect x="70" y="55" width="790" height="1130" rx="14" fill="${paperLeft}" filter="url(#soft-shadow)"/>
  <!-- Right Page Canvas -->
  <rect x="900" y="55" width="790" height="1130" rx="14" fill="${paperRight}" filter="url(#soft-shadow)"/>

  <!-- Book Spine Gutter Depth Shading -->
  <rect x="760" y="55" width="100" height="1130" fill="url(#gutter-left)"/>
  <rect x="900" y="55" width="100" height="1130" fill="url(#gutter-right)"/>
  <!-- Center Gutter Stitch Marks -->
  <line x1="880" y1="90" x2="880" y2="1150" stroke="${borderCol}" stroke-dasharray="14 18" stroke-width="1.8"/>

  <!-- ==================== LEFT PAGE: EDITORIAL TEXT & ESSAY ==================== -->
  <!-- Outer Filigree Border -->
  <rect x="110" y="95" width="710" height="1050" fill="none" stroke="${borderCol}" stroke-width="1.2"/>
  <rect x="118" y="103" width="694" height="1034" fill="none" stroke="${borderCol}" stroke-width="0.6" stroke-dasharray="6 4"/>
  <!-- Corner Lotus Flourishes -->
  <g fill="${goldPrimary}" opacity="0.6">
    <circle cx="118" cy="103" r="3.5"/>
    <circle cx="812" cy="103" r="3.5"/>
    <circle cx="118" cy="1137" r="3.5"/>
    <circle cx="812" cy="1137" r="3.5"/>
  </g>

  <!-- Plate Header -->
  <text x="160" y="165" font-family="'Newsreader', Georgia, serif" font-size="14" fill="${saffron}" letter-spacing="0.28em" font-weight="600" text-transform="uppercase">${safePlateNo} · VEDIC HERITAGE MONOGRAPHS</text>
  <line x1="160" y1="185" x2="760" y2="185" stroke="${borderCol}" stroke-width="0.8"/>

  <!-- Sanskrit Inscription -->
  <text x="160" y="255" font-family="'Noto Serif Devanagari', 'Cinzel', serif" font-size="34" fill="${goldPrimary}" font-weight="600" letter-spacing="0.04em">${sanskrit}</text>

  <!-- Title & Subtitle -->
  <text x="160" y="325" font-family="'Instrument Serif', 'Cinzel', Georgia, serif" font-size="44" fill="${textDark}" font-weight="400" letter-spacing="0.02em">${safeTitle}</text>
  <text x="160" y="365" font-family="'Newsreader', Georgia, serif" font-size="22" font-style="italic" fill="${textMuted}">${safeSubtitle}</text>

  <!-- Metadata Metadata Pill Strip -->
  <g transform="translate(160, 405)">
    <rect x="0" y="0" width="580" height="52" rx="6" fill="${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(232,85,10,0.06)'}" stroke="${borderCol}" stroke-width="0.8"/>
    <text x="24" y="32" font-family="'Newsreader', Georgia, serif" font-size="15" fill="${textMuted}" letter-spacing="0.06em">LOC: <tspan fill="${textDark}" font-weight="600">${safeLocation}</tspan></text>
    <text x="250" y="32" font-family="'Newsreader', Georgia, serif" font-size="15" fill="${textMuted}" letter-spacing="0.06em">ERA: <tspan fill="${textDark}" font-weight="600">${safeEra}</tspan></text>
    <text x="420" y="32" font-family="'Newsreader', Georgia, serif" font-size="14" fill="${textMuted}" letter-spacing="0.04em">${safeCoords}</text>
  </g>

  <!-- Section Divider with Central Motif -->
  <g transform="translate(160, 520)">
    <line x1="0" y1="0" x2="250" y2="0" stroke="${borderCol}" stroke-width="0.9"/>
    <polygon points="290,-7 297,0 290,7 283,0" fill="${goldPrimary}"/>
    <line x1="330" y1="0" x2="580" y2="0" stroke="${borderCol}" stroke-width="0.9"/>
  </g>

  <!-- Editorial Field Study Essays -->
  <text x="160" y="580" font-family="'Newsreader', Georgia, serif" font-size="14" fill="${saffron}" letter-spacing="0.22em" font-weight="600">ARCHITECTURAL FIELD STUDY &amp; PROPORTIONS</text>
  ${bodyParagraphs}

  <!-- Archival Seal & Ashoka Seal Watermark -->
  <g transform="translate(160, 990)" opacity="0.85">
    <circle cx="45" cy="45" r="40" fill="none" stroke="${goldPrimary}" stroke-width="1.4"/>
    <circle cx="45" cy="45" r="32" fill="none" stroke="${goldPrimary}" stroke-width="0.8" stroke-dasharray="3 3"/>
    <circle cx="45" cy="45" r="8" fill="${goldPrimary}"/>
    <!-- 24 Spokes in miniature -->
    <path d="M45,13 L45,37 M45,53 L45,77 M13,45 L37,45 M53,45 L77,45 M22,22 L39,39 M51,51 L68,68 M22,68 L39,51 M51,39 L68,22" stroke="${goldPrimary}" stroke-width="1.2"/>
    <text x="105" y="38" font-family="'Instrument Serif', Georgia, serif" font-size="20" fill="${textDark}">Vedic Epigraphical Archives</text>
    <text x="105" y="62" font-family="'Newsreader', Georgia, serif" font-size="13" fill="${textFaint}" letter-spacing="0.1em">SURVEYED ON SITE · COPPERPLATE REGISTER</text>
  </g>


  <!-- ==================== RIGHT PAGE: SACRED ARTWORK & ELEVATION ==================== -->
  <!-- Outer Filigree Border -->
  <rect x="940" y="95" width="710" height="1050" fill="none" stroke="${borderCol}" stroke-width="1.2"/>
  <rect x="948" y="103" width="694" height="1034" fill="none" stroke="${borderCol}" stroke-width="0.6" stroke-dasharray="6 4"/>
  <!-- Corner Dots -->
  <g fill="${goldPrimary}" opacity="0.6">
    <circle cx="948" cy="103" r="3.5"/>
    <circle cx="1642" cy="103" r="3.5"/>
    <circle cx="948" cy="1137" r="3.5"/>
    <circle cx="1642" cy="1137" r="3.5"/>
  </g>

  <!-- Illustration Artwork Frame -->
  <g transform="translate(970, 140)">
    <!-- Architectural grid lines in background -->
    <g stroke="${borderCol}" stroke-width="0.5" opacity="0.35" stroke-dasharray="4 6">
      <line x1="0" y1="200" x2="650" y2="200"/>
      <line x1="0" y1="400" x2="650" y2="400"/>
      <line x1="0" y1="600" x2="650" y2="600"/>
      <line x1="0" y1="800" x2="650" y2="800"/>
      <line x1="325" y1="0" x2="325" y2="850"/>
      <circle cx="325" cy="425" r="280" fill="none"/>
    </g>

    <!-- Detailed Vector Artwork -->
    ${drawArt}
  </g>

  <!-- Bottom Archival Stamp -->
  <g transform="translate(980, 1070)">
    <text x="0" y="24" font-family="'Newsreader', Georgia, serif" font-size="13" fill="${textMuted}" letter-spacing="0.18em">FIGURE 1.0 — MONOLITHIC AXIAL ELEVATION &amp; GEOMETRIC HARMONY</text>
    <text x="590" y="24" font-family="'Instrument Serif', Georgia, serif" font-size="18" fill="${goldPrimary}" text-anchor="end">Scale 1:108</text>
  </g>
</svg>`;

  const base64 =
    typeof Buffer !== 'undefined'
      ? Buffer.from(svgContent, 'utf-8').toString('base64')
      : btoa(unescape(encodeURIComponent(svgContent)));
  return `data:image/svg+xml;base64,${base64}`;
}

// 9 Exquisite Vedic Architectural Plates
function generateVedicPlates(isDark: boolean): SketchbookPage[] {
  const c = isDark ? '#F59E0B' : '#C28518';
  const cLight = isDark ? '#FDE68A' : '#D4A017';
  const cSaf = isDark ? '#FB923C' : '#E8550A';
  const cInk = isDark ? '#E5E7EB' : '#1A0800';

  return [
    {
      id: 'ashoka-chakra-sarnath',
      title: 'Dharma Cakra & Sarnath',
      sanskritTitle: '॥ धर्मचक्र प्रवर्तनम् ॥',
      place: 'Sarnath, Varanasi',
      year: '250 BCE',
      plateNumber: 'PLATE 01',
      description: 'The monumental 24-spoke Ashoka Chakra and Lion Capital at the deer park of Sarnath.',
      url: createChakraSvgSpread({
        plateNo: 'PLATE 01',
        sanskrit: '॥ धर्मचक्र प्रवर्तनम् ॥',
        title: 'Dharma Cakra & Sarnath',
        subtitle: 'The 24-Spoke Wheel of Cosmic Law & Lion Capital',
        location: 'Sārnāth, Uttar Pradesh',
        coords: '25.3811° N, 83.0214° E',
        era: 'Maurya Dynasty (c. 250 BCE)',
        isDark,
        body: [
          'Erected by Emperor Ashoka the Great at the deer park where Bhagavan Buddha set the Wheel of Cosmic Dharma in motion.',
          'Carved from a single monolith of polished Chunar sandstone, the capital features four majestic Asiatic lions standing back to back.',
          'The abacus is ornamented with high-relief carvings of the 24-spoke Dharma Cakra, an elephant, a galloping horse, and a bull separated by twenty-four spoke wheels.',
          'Each spoke corresponds to the eternal virtues: love, courage, patience, peace, magnanimity, goodness, faithfulness, gentleness, self-control, and sacrifice.',
          'Now revered as the national emblem of sovereign India, its pristine luster and geometric precision remain untouched by millennia.',
        ],
        drawArt: `
          <!-- Sarnath Lion Capital & Sacred Cakra -->
          <g transform="translate(325, 420)">
            <!-- Outer Golden Aura -->
            <circle cx="0" cy="0" r="260" fill="none" stroke="${cLight}" stroke-width="1.2" opacity="0.4"/>
            <circle cx="0" cy="0" r="240" fill="none" stroke="${c}" stroke-width="2"/>
            <circle cx="0" cy="0" r="224" fill="none" stroke="${c}" stroke-width="0.8" stroke-dasharray="6 4"/>
            
            <!-- 24 Spokes of Dharma Cakra -->
            ${Array.from({ length: 24 })
              .map((_, i) => {
                const ang = (i * 15 * Math.PI) / 180;
                const x1 = 52 * Math.cos(ang);
                const y1 = 52 * Math.sin(ang);
                const x2 = 224 * Math.cos(ang);
                const y2 = 224 * Math.sin(ang);
                return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${c}" stroke-width="3" stroke-linecap="round"/>
                        <circle cx="${((x1 + x2) * 0.58).toFixed(1)}" cy="${((y1 + y2) * 0.58).toFixed(1)}" r="4" fill="${cSaf}"/>`;
              })
              .join('')}

            <!-- Center Hub -->
            <circle cx="0" cy="0" r="50" fill="${isDark ? '#0b1426' : '#FAF6EE'}" stroke="${c}" stroke-width="4"/>
            <circle cx="0" cy="0" r="30" fill="${cLight}" stroke="${c}" stroke-width="1.8"/>
            <circle cx="0" cy="0" r="14" fill="${cSaf}"/>

            <!-- Lotus Base and Lions Profile -->
            <g transform="translate(0, 240)">
              <!-- Inverted Bell Lotus -->
              <path d="M-120,40 C-80,10 80,10 120,40 L150,70 L-150,70 Z" fill="none" stroke="${c}" stroke-width="2.5"/>
              ${[-100, -60, -20, 20, 60, 100]
                .map(
                  (x) => `<path d="M${x},70 C${x * 0.8},35 ${x * 0.5},25 ${x * 0.3},20" stroke="${cLight}" stroke-width="1.6" fill="none"/>`
                )
                .join('')}
              <rect x="-160" y="70" width="320" height="24" rx="4" fill="${cLight}" opacity="0.3" stroke="${c}" stroke-width="1.6"/>
              <text x="0" y="87" font-family="'Newsreader', serif" font-size="14" fill="${cInk}" text-anchor="middle" letter-spacing="0.2em">SATYAMEVA JAYATE · TRUTH ALONE TRIUMPHS</text>
            </g>
          </g>
        `,
      }),
    },
    {
      id: 'brihadisvara-thanjavur',
      title: 'Brihadisvara Mahadeva Vimana',
      sanskritTitle: '॥ बृहदीश्वर महाप्रासादः ॥',
      place: 'Thanjavur, Tamil Nadu',
      year: '1010 CE',
      plateNumber: 'PLATE 02',
      description: 'The monumental granite Rajagopuram and 80-tonne monolithic Kumbham capstone of the Great Living Chola Temple.',
      url: createChakraSvgSpread({
        plateNo: 'PLATE 02',
        sanskrit: '॥ बृहदीश्वर महाप्रासादः ॥',
        title: 'Brihadisvara Mahadeva Vimana',
        subtitle: 'The 216-Foot Monolithic Granite Temple Tower',
        location: 'Thanjavur, Tamil Nadu',
        coords: '10.7828° N, 79.1318° E',
        era: 'Chola Empire — Raja Raja Chola I (1010 CE)',
        isDark,
        body: [
          'Consecrated in 1010 CE by Emperor Raja Raja Chola I, Brihadisvara stands as the paramount achievement of Dravidian temple architecture.',
          'Constructed entirely of interlocking granite without binding mortar, transport of over 130,000 tonnes of granite was achieved via inland waterways.',
          'The central Vimana rises 16 pyramidal stories to a height of 66 meters (216 feet), perfectly aligned along an unbroken cardinal axis.',
          'The apex is crowned by the monolithic Kumbham octagonal dome weighing an astonishing 81.3 tonnes, raised atop an inclined 6-kilometer ramp.',
          'Its geometric harmony casts no direct shadow outside the temple plinth at true solar noon, symbolizing the transcendence of the cosmic axis.',
        ],
        drawArt: `
          <!-- Brihadisvara Vimana Elevation Drawing -->
          <g transform="translate(325, 450)">
            <!-- Stepped Pyramidal Vimana 16 Tiers -->
            ${Array.from({ length: 14 })
              .map((_, i) => {
                const w = 420 - i * 26;
                const y = 200 - i * 36;
                return `
                  <rect x="${-w / 2}" y="${y}" width="${w}" height="32" fill="none" stroke="${c}" stroke-width="1.8"/>
                  <line x1="${-w / 2 + 10}" y1="${y + 16}" x2="${w / 2 - 10}" y2="${y + 16}" stroke="${cLight}" stroke-width="0.8" stroke-dasharray="3 3"/>
                  <!-- Mini shrines on tier (Kudu arches) -->
                  <circle cx="${-w / 4}" cy="${y + 16}" r="6" stroke="${cSaf}" fill="none"/>
                  <circle cx="${w / 4}" cy="${y + 16}" r="6" stroke="${cSaf}" fill="none"/>
                  <circle cx="0" cy="${y + 16}" r="7" stroke="${c}" fill="none"/>
                `;
              })
              .join('')}

            <!-- 80-tonne Kumbham Dome & Kalasam -->
            <g transform="translate(0, -320)">
              <ellipse cx="0" cy="10" rx="42" ry="24" fill="${cLight}" opacity="0.4" stroke="${c}" stroke-width="2"/>
              <path d="M-36,10 C-36,-25 36,-25 36,10 Z" fill="none" stroke="${c}" stroke-width="2.5"/>
              <!-- Golden Stupi Kalasam -->
              <path d="M0,-80 L10,-45 L0,-25 L-10,-45 Z" fill="${cSaf}" stroke="${c}" stroke-width="1.8"/>
              <circle cx="0" cy="-84" r="5" fill="${cLight}"/>
            </g>

            <!-- Plinth & Upapitha -->
            <rect x="-240" y="232" width="480" height="40" fill="none" stroke="${c}" stroke-width="2.5"/>
            <rect x="-260" y="272" width="520" height="25" fill="${cLight}" opacity="0.2" stroke="${c}" stroke-width="2"/>
            <text x="0" y="290" font-family="'Newsreader', serif" font-size="13" fill="${cInk}" text-anchor="middle" letter-spacing="0.25em">GRANITE ADHISTHANA · 1010 CE</text>
          </g>
        `,
      }),
    },
    {
      id: 'konark-sun-temple',
      title: 'Konark Surya Ratha Cakra',
      sanskritTitle: '॥ कोणादित्य रथचक्रम् ॥',
      place: 'Konark, Puri, Odisha',
      year: '1250 CE',
      plateNumber: 'PLATE 03',
      description: 'The celestial 24-spoke solar chariot wheel and astronomical sundial of the Black Pagoda at Konark.',
      url: createChakraSvgSpread({
        plateNo: 'PLATE 03',
        sanskrit: '॥ कोणादित्य रथचक्रम् ॥',
        title: 'Konark Surya Ratha Cakra',
        subtitle: 'The 24 Astronomical Chariot Wheels of the Sun God',
        location: 'Konārk, Bay of Bengal, Odisha',
        coords: '19.8876° N, 86.0945° E',
        era: 'Eastern Ganga Dynasty — King Narasimhadeva I (1250 CE)',
        isDark,
        body: [
          'Conceived on an epic cosmic scale as the monumental chariot of Surya, pulled across the heavens by seven spirited stone horses.',
          'Flanking the temple plinth are 24 intricately carved stone wheels, each measuring 9 feet 9 inches in diameter with 8 major spokes and 8 minor spokes.',
          'The 24 wheels symbolize the 24 fortnights (Pakshas) of the Hindu solar calendar year, while the seven horses embody the days of the week and spectrum of light.',
          'The wheel functions as an astoundingly precise horizontal sundial: shadow cast by the central axle across the inner medallion registers time to within 60 seconds.',
          'Every spoke bead depicts the eight praharas (3-hour divisions of the day) and motifs of daily life, celestial apsaras, and Vedic ritual.',
        ],
        drawArt: `
          <!-- Konark Sun Chariot Wheel Technical Blueprint -->
          <g transform="translate(325, 420)">
            <!-- Outer Rim with Floral Filigree -->
            <circle cx="0" cy="0" r="270" fill="none" stroke="${c}" stroke-width="3"/>
            <circle cx="0" cy="0" r="255" fill="none" stroke="${cLight}" stroke-width="1.2" stroke-dasharray="5 5"/>
            <circle cx="0" cy="0" r="235" fill="none" stroke="${c}" stroke-width="2"/>

            <!-- 60 Rim Medallions (Minutes/Ghatikas) -->
            ${Array.from({ length: 36 })
              .map((_, i) => {
                const a = (i * 10 * Math.PI) / 180;
                return `<circle cx="${(245 * Math.cos(a)).toFixed(1)}" cy="${(245 * Math.sin(a)).toFixed(1)}" r="4.5" fill="${cSaf}"/>`;
              })
              .join('')}

            <!-- 8 Broad Major Spokes with Medallions -->
            ${Array.from({ length: 8 })
              .map((_, i) => {
                const a = (i * 45 * Math.PI) / 180;
                const cos = Math.cos(a);
                const sin = Math.sin(a);
                return `
                  <line x1="${(55 * cos).toFixed(1)}" y1="${(55 * sin).toFixed(1)}" x2="${(235 * cos).toFixed(1)}" y2="${(235 * sin).toFixed(1)}" stroke="${c}" stroke-width="10" stroke-linecap="round"/>
                  <circle cx="${(145 * cos).toFixed(1)}" cy="${(145 * sin).toFixed(1)}" r="18" fill="${isDark ? '#0b1426' : '#FAF6EE'}" stroke="${cLight}" stroke-width="2.5"/>
                  <circle cx="${(145 * cos).toFixed(1)}" cy="${(145 * sin).toFixed(1)}" r="8" fill="${cSaf}"/>
                `;
              })
              .join('')}

            <!-- 8 Thin Minor Spokes -->
            ${Array.from({ length: 8 })
              .map((_, i) => {
                const a = ((i * 45 + 22.5) * Math.PI) / 180;
                const cos = Math.cos(a);
                const sin = Math.sin(a);
                return `
                  <line x1="${(55 * cos).toFixed(1)}" y1="${(55 * sin).toFixed(1)}" x2="${(235 * cos).toFixed(1)}" y2="${(235 * sin).toFixed(1)}" stroke="${cLight}" stroke-width="3"/>
                  <circle cx="${(145 * cos).toFixed(1)}" cy="${(145 * sin).toFixed(1)}" r="7" fill="${c}"/>
                `;
              })
              .join('')}

            <!-- Central Gnomon Axle Hub -->
            <circle cx="0" cy="0" r="54" fill="${isDark ? '#091122' : '#FBF7EE'}" stroke="${c}" stroke-width="4"/>
            <circle cx="0" cy="0" r="32" fill="${cLight}" stroke="${c}" stroke-width="2"/>
            <circle cx="0" cy="0" r="16" fill="${cSaf}"/>
            <circle cx="0" cy="0" r="5" fill="#FFFFFF"/>
          </g>
        `,
      }),
    },
    {
      id: 'padmanabhaswamy-thiruvananthapuram',
      title: 'Sri Padmanabhaswamy Gopuram',
      sanskritTitle: '॥ अनन्तपद्मनाभ स्वामी ॥',
      place: 'Thiruvananthapuram, Kerala',
      year: '1568 CE',
      plateNumber: 'PLATE 04',
      description: 'The monumental 7-tier Rajagopuram and eternal sanctum of Lord Vishnu reclining on Adishesha.',
      url: createChakraSvgSpread({
        plateNo: 'PLATE 04',
        sanskrit: '॥ अनन्तपद्मनाभ स्वामी ॥',
        title: 'Sri Padmanabhaswamy Gopuram',
        subtitle: 'The 7-Tiered Gateway of Eternal Dissolution & Serenity',
        location: 'Thiruvananthapuram, Kerala',
        coords: '8.4831° N, 76.9436° E',
        era: 'Travancore Dynasty — Anizham Thirunal Marthanda Varma',
        isDark,
        body: [
          'The spiritual heart of Travancore, enshrining Bhagavan Vishnu in the Anantha Sayana posture of cosmic slumber upon the thousand-headed serpent Adishesha.',
          'The towering 100-foot Rajagopuram features seven storeys executed in an exquisite fusion of indigenous Chera and Dravidian architectural idioms.',
          'Every equinox, the setting sun aligns with mathematical purity through each of the seven gopuram window portals in sequential progression.',
          'Within the inner corridor, the Kulasekhara Mandapam is supported by 365 granite pillars, each carved from a single rock representing the days of the solar year.',
          'The subterranean vaults, preserved for centuries beneath serpent seals, hold the most opulent devotional repository known to human civilization.',
        ],
        drawArt: `
          <!-- 7-Tier Gopuram Silhouette -->
          <g transform="translate(325, 440)">
            ${Array.from({ length: 7 })
              .map((_, i) => {
                const w = 460 - i * 44;
                const y = 180 - i * 58;
                return `
                  <rect x="${-w / 2}" y="${y}" width="${w}" height="48" fill="none" stroke="${c}" stroke-width="2"/>
                  <!-- Window Portals (Aligned for Equinox) -->
                  <rect x="-18" y="${y + 12}" width="36" height="26" rx="4" fill="${cSaf}" opacity="0.6"/>
                  <line x1="${-w / 2 + 15}" y1="${y + 24}" x2="${w / 2 - 15}" y2="${y + 24}" stroke="${cLight}" stroke-width="0.8"/>
                  <circle cx="${-w / 3}" cy="${y + 24}" r="5" fill="${c}"/>
                  <circle cx="${w / 3}" cy="${y + 24}" r="5" fill="${c}"/>
                `;
              })
              .join('')}

            <!-- Kalasams on Ridge (7 Golden Finials) -->
            <g transform="translate(0, -250)">
              <rect x="-100" y="0" width="200" height="24" rx="10" fill="none" stroke="${c}" stroke-width="2"/>
              ${[-60, -40, -20, 0, 20, 40, 60]
                .map(
                  (x) => `<path d="M${x},0 L${x},-34 L${x + 3},-38 L${x - 3},-38 Z" stroke="${cSaf}" stroke-width="2" fill="${cLight}"/>`
                )
                .join('')}
            </g>

            <!-- Base Gateway Doorway -->
            <rect x="-55" y="228" width="110" height="90" fill="none" stroke="${c}" stroke-width="2.5"/>
            <path d="M-55,228 C-55,185 55,185 55,228 Z" fill="none" stroke="${c}" stroke-width="2"/>
            <line x1="0" y1="185" x2="0" y2="318" stroke="${cLight}" stroke-width="1.4"/>
          </g>
        `,
      }),
    },
    {
      id: 'hampi-stone-chariot',
      title: 'Hampi Vitthala Stone Chariot',
      sanskritTitle: '॥ हम्पी गरुड रथः ॥',
      place: 'Hampi, Karnataka',
      year: '1513 CE',
      plateNumber: 'PLATE 05',
      description: 'The monumental monolithic granite chariot shrine of Garuda in the courtyards of Vijayanagara.',
      url: createChakraSvgSpread({
        plateNo: 'PLATE 05',
        sanskrit: '॥ हम्पी गरुड रथः ॥',
        title: 'Hampi Vitthala Stone Chariot',
        subtitle: 'The Monolithic Granite Shrine of Vijayanagara',
        location: 'Hampi, Tungabhadra River, Karnataka',
        coords: '15.3350° N, 76.4600° E',
        era: 'Vijayanagara Empire — Emperor Krishnadevaraya (c. 1513 CE)',
        isDark,
        body: [
          'Standing proudly within the courtyard of the 16th-century Vijaya Vitthala Temple complex along the rugged banks of the Tungabhadra river.',
          'Dedicated to Garuda, the divine mount of Bhagavan Vishnu, the shrine is constructed to simulate a celestial temple car ready for festive procession.',
          'Though sculpted to give the breathtaking illusion of a single monolithic rock, it is assembled from dressed granite blocks with joints of microscopic tolerances.',
          'The four colossal stone wheels are carved with concentric floral rings; historically, each stone wheel was fully rotatable on its granite axle.',
          'The chariot stands surrounded by the legendary 56 musical pillars (SaReGaMa pillars) of the Ranga Mandapa that resonate musical notes when gently tapped.',
        ],
        drawArt: `
          <!-- Hampi Stone Chariot Line Elevation -->
          <g transform="translate(325, 440)">
            <!-- Main Chariot Body -->
            <rect x="-180" y="-80" width="360" height="180" fill="none" stroke="${c}" stroke-width="2.5"/>
            <rect x="-160" y="-60" width="320" height="140" fill="${cLight}" opacity="0.15" stroke="${c}" stroke-width="1.2"/>
            
            <!-- Pillar Balustrades -->
            ${[-130, -70, 0, 70, 130]
              .map(
                (x) => `<line x1="${x}" y1="-60" x2="${x}" y2="80" stroke="${c}" stroke-width="3"/>
                        <circle cx="${x}" cy="10" r="5" fill="${cSaf}"/>`
              )
              .join('')}

            <!-- Vimana Shikhara Roof -->
            <path d="M-150,-80 L-100,-180 L100,-180 L150,-80 Z" fill="none" stroke="${c}" stroke-width="2.2"/>
            <path d="M-90,-180 L0,-240 L90,-180 Z" fill="none" stroke="${c}" stroke-width="2"/>
            <circle cx="0" cy="-248" r="8" fill="${cSaf}"/>

            <!-- Two Colossal Front Wheels -->
            <g transform="translate(-130, 140)">
              <circle cx="0" cy="0" r="68" fill="${isDark ? '#0b1426' : '#FAF6EE'}" stroke="${c}" stroke-width="3"/>
              <circle cx="0" cy="0" r="52" fill="none" stroke="${cLight}" stroke-width="1.4" stroke-dasharray="4 4"/>
              <circle cx="0" cy="0" r="20" fill="${cSaf}"/>
              ${[0, 45, 90, 135, 180, 225, 270, 315]
                .map((a) => {
                  const rad = (a * Math.PI) / 180;
                  return `<line x1="0" y1="0" x2="${(52 * Math.cos(rad)).toFixed(1)}" y2="${(52 * Math.sin(rad)).toFixed(1)}" stroke="${c}" stroke-width="2.2"/>`;
                })
                .join('')}
            </g>

            <g transform="translate(130, 140)">
              <circle cx="0" cy="0" r="68" fill="${isDark ? '#0b1426' : '#FAF6EE'}" stroke="${c}" stroke-width="3"/>
              <circle cx="0" cy="0" r="52" fill="none" stroke="${cLight}" stroke-width="1.4" stroke-dasharray="4 4"/>
              <circle cx="0" cy="0" r="20" fill="${cSaf}"/>
              ${[0, 45, 90, 135, 180, 225, 270, 315]
                .map((a) => {
                  const rad = (a * Math.PI) / 180;
                  return `<line x1="0" y1="0" x2="${(52 * Math.cos(rad)).toFixed(1)}" y2="${(52 * Math.sin(rad)).toFixed(1)}" stroke="${c}" stroke-width="2.2"/>`;
                })
                .join('')}
            </g>

            <!-- Elephant Draught Figurines -->
            <rect x="-220" y="80" width="40" height="90" rx="8" fill="none" stroke="${c}" stroke-width="1.8"/>
          </g>
        `,
      }),
    },
    {
      id: 'kailasa-ellora-cave-16',
      title: 'Kailasa Monolith Cave 16',
      sanskritTitle: '॥ कैलास महाशिला प्रासादः ॥',
      place: 'Ellora, Maharashtra',
      year: '756 CE',
      plateNumber: 'PLATE 06',
      description: 'The monumental rock-cut mountain temple carved vertically from top to bottom from a single basalt cliff.',
      url: createChakraSvgSpread({
        plateNo: 'PLATE 06',
        sanskrit: '॥ कैलास महाशिला प्रासादः ॥',
        title: 'Kailasa Monolith Cave 16',
        subtitle: 'The Single Basalt Mountain Carved from Crown to Base',
        location: 'Ellora Caves, Chhatrapati Sambhajinagar, Maharashtra',
        coords: '20.0240° N, 75.1790° E',
        era: 'Rashtrakuta Dynasty — King Krishna I (756–774 CE)',
        isDark,
        body: [
          'Regarded by engineering historians as the most audacious megalithic excavation ever attempted in human history.',
          'Over 200,000 tonnes of solid Deccan basalt were chiseled away vertically from the cliff face, working strictly from top to bottom without scaffolding.',
          'Designed to evoke Mount Kailasa, the Himalayan abode of Lord Shiva, the multi-storey complex includes shrines, courtyards, bridges, and colossal life-sized elephants.',
          'Unlike structural buildings where errors can be masked, a single miscalculated fracture in the monolithic basalt would have compromised the entire sanctuary.',
          'The central temple stands 32 meters high, adorned with dramatic bas-reliefs depicting Ravana shaking Mount Kailasa, Mahabharata, and Ramayana epics.',
        ],
        drawArt: `
          <!-- Kailasa Elevation Profile in Rock Trench -->
          <g transform="translate(325, 440)">
            <!-- Cliff Excavation Walls -->
            <path d="M-280,-300 L-240,240 L240,240 L280,-300" fill="none" stroke="${cLight}" stroke-width="1.4" stroke-dasharray="6 6"/>

            <!-- Main Vimana Tower -->
            <polygon points="0,-260 90,-60 -90,-60" fill="none" stroke="${c}" stroke-width="2.5"/>
            <circle cx="0" cy="-268" r="9" fill="${cSaf}"/>

            <!-- Intermediate Sanctuary Storeys -->
            <rect x="-140" y="-60" width="280" height="90" fill="${cLight}" opacity="0.15" stroke="${c}" stroke-width="2"/>
            <rect x="-180" y="30" width="360" height="90" fill="none" stroke="${c}" stroke-width="2"/>

            <!-- Colossal Monolithic Elephant Base -->
            <g transform="translate(0, 120)">
              <rect x="-220" y="0" width="440" height="100" fill="none" stroke="${c}" stroke-width="2.5"/>
              ${[-160, -80, 0, 80, 160]
                .map(
                  (x) => `<ellipse cx="${x}" cy="50" rx="28" ry="36" fill="none" stroke="${cSaf}" stroke-width="1.8"/>`
                )
                .join('')}
              <text x="0" y="118" font-family="'Newsreader', serif" font-size="12" fill="${cInk}" text-anchor="middle" letter-spacing="0.2em">PLINTH OF COLOSSAL CARVED ELEPHANTS</text>
            </g>

            <!-- Dhwaja Stambha Victory Pillar -->
            <g transform="translate(-180, 0)">
              <rect x="-12" y="-180" width="24" height="220" fill="none" stroke="${c}" stroke-width="2"/>
              <circle cx="0" cy="-195" r="12" fill="${cSaf}"/>
            </g>
          </g>
        `,
      }),
    },
    {
      id: 'varanasi-ghats-sunrise',
      title: 'Varanasi Ghats at Sunrise',
      sanskritTitle: '॥ काशी विश्वनाथ तीर्थम् ॥',
      place: 'Varanasi, Uttar Pradesh',
      year: 'Eternal',
      plateNumber: 'PLATE 07',
      description: 'The sacred 84 crescent riverfront ghats along the holy Ganga, bathed in the radiant golden aura of dawn.',
      url: createChakraSvgSpread({
        plateNo: 'PLATE 07',
        sanskrit: '॥ काशी विश्वनाथ तीर्थम् ॥',
        title: 'Varanasi Ghats at Sunrise',
        subtitle: 'The Eternal Crescent of Sacred Water, Stone & Light',
        location: 'Vārānasī (Kāshī), Uttar Pradesh',
        coords: '25.3176° N, 83.0062° E',
        era: 'Continuous Inhabitation since Vedic Era (c. 1200 BCE)',
        isDark,
        body: [
          'Mark Twain famously wrote that Varanasi is older than history, older than tradition, older even than legend, and looks twice as old as all of them put together.',
          'Stretching in a continuous two-mile crescent along the left bank of the holy Ganga where the river flows northward toward its Himalayan source.',
          'Eighty-four stone ghats descend into the water, constructed by Maratha, Rajput, and Scindia patrons as monumental steps connecting earthly life to moksha.',
          'At Dashashwamedh Ghat, priests perform the solemn evening Ganga Aarti with multi-tiered brass oil lamps, brass bells, conches, and fragrant incense.',
          'At sunrise (Subah-e-Banaras), the sandstone facades glow in luminous cadmium amber as thousands offer morning Surya Arghya oblations to the rising sun.',
        ],
        drawArt: `
          <!-- Varanasi Stepped Ghats & Floating Diyas -->
          <g transform="translate(325, 420)">
            <!-- Golden Rising Sun -->
            <circle cx="0" cy="-120" r="110" fill="${cSaf}" opacity="0.3" stroke="${cLight}" stroke-width="2"/>
            <circle cx="0" cy="-120" r="70" fill="${cLight}" opacity="0.6"/>

            <!-- Temple Silhouettes along Shoreline -->
            <polygon points="-220,-20 -180,-140 -140,-20" stroke="${c}" stroke-width="2" fill="none"/>
            <polygon points="-80,-20 -40,-180 0,-20" stroke="${c}" stroke-width="2.2" fill="none"/>
            <polygon points="60,-20 110,-120 160,-20" stroke="${c}" stroke-width="2" fill="none"/>

            <!-- Stepped Stone Ghat Terraces (10 Descending Tiers) -->
            ${Array.from({ length: 9 })
              .map((_, i) => {
                const y = -20 + i * 22;
                return `<rect x="-260" y="${y}" width="520" height="18" fill="none" stroke="${c}" stroke-width="1.6"/>
                        <line x1="-260" y1="${y + 9}" x2="260" y2="${y + 9}" stroke="${cLight}" stroke-width="0.7" stroke-dasharray="8 6"/>`;
              })
              .join('')}

            <!-- Sacred Ganga Water Ripples & Floating Diyas -->
            <g transform="translate(0, 190)">
              <rect x="-270" y="0" width="540" height="90" fill="${isDark ? '#0b1426' : '#FAF6EE'}" stroke="${c}" stroke-width="2"/>
              ${Array.from({ length: 6 })
                .map((_, i) => {
                  const y = 14 + i * 14;
                  return `<line x1="-250" y1="${y}" x2="250" y2="${y}" stroke="${cLight}" stroke-width="1.2" stroke-dasharray="14 10"/>`;
                })
                .join('')}
              <!-- Floating Diya Lamps with Saffron Flame -->
              ${[-160, -60, 40, 150]
                .map(
                  (x, i) => `<ellipse cx="${x}" cy="${30 + (i % 2) * 20}" rx="14" ry="6" fill="${c}"/>
                             <polygon points="${x - 4},${28 + (i % 2) * 20} ${x},${14 + (i % 2) * 20} ${x + 4},${28 + (i % 2) * 20}" fill="${cSaf}"/>`
                )
                .join('')}
            </g>
          </g>
        `,
      }),
    },
    {
      id: 'meenakshi-amman-madurai',
      title: 'Meenakshi Amman Sundareswarar',
      sanskritTitle: '॥ मीनाक्षी सुन्द्रेश्वर प्रासादः ॥',
      place: 'Madurai, Tamil Nadu',
      year: '1623 CE',
      plateNumber: 'PLATE 08',
      description: 'The colossal multi-tier sculptural Rajagopuram and Hall of Thousand Pillars on the Vaigai river.',
      url: createChakraSvgSpread({
        plateNo: 'PLATE 08',
        sanskrit: '॥ मीनाक्षी सुन्द्रेश्वर प्रासादः ॥',
        title: 'Meenakshi Amman Sundareswarar',
        subtitle: 'The Living Mandala City of Fourteen Soaring Towers',
        location: 'Madurai, Vaigai River, Tamil Nadu',
        coords: '9.9195° N, 78.1193° E',
        era: 'Madurai Nayak Dynasty — Thirumalai Nayak (1623–1659 CE)',
        isDark,
        body: [
          'The historic core of Madurai is laid out as a concentric lotus mandala (yantra) around the twin sanctuaries of Meenakshi and Lord Sundareswarar.',
          'Fourteen monumental gopurams punctuate the skyline, the tallest being the southern tower soaring 170 feet high with over 1,500 polychrome stucco sculptures.',
          'Each tiered facade depicts deities, celestial musicians, guardians, and scenes from Thiruvilaiyadal Puranam with unparalleled sculptural density.',
          'The Ayiram Kaal Mandapam (Hall of Thousand Pillars) contains 985 carved stone pillars, each aligned so that from any vantage point they form perfectly straight aisles.',
          'At the center lies the sacred Golden Lotus Pond (Porthamarai Kulam), where according to legend, literary manuscripts were placed to test their divine merit.',
        ],
        drawArt: `
          <!-- South Gopuram High-Density Sculptural Facade -->
          <g transform="translate(325, 430)">
            <!-- 9 Ascending Sculptural Registers -->
            ${Array.from({ length: 9 })
              .map((_, i) => {
                const w = 440 - i * 36;
                const y = 190 - i * 46;
                return `
                  <rect x="${-w / 2}" y="${y}" width="${w}" height="40" fill="none" stroke="${c}" stroke-width="2"/>
                  <!-- Dense Row of Deities & Statues -->
                  ${Array.from({ length: 12 - i })
                    .map((__, j) => {
                      const step = (w - 20) / (12 - i);
                      const x = -w / 2 + 10 + j * step + step / 2;
                      return `<circle cx="${x.toFixed(1)}" cy="${y + 16}" r="4" fill="${cSaf}"/>
                              <rect x="${(x - 2.5).toFixed(1)}" y="${y + 22}" width="5" height="12" fill="${cLight}"/>`;
                    })
                    .join('')}
                `;
              })
              .join('')}

            <!-- Barrel Vaulted Crown (Sala Shikhara) & Golden Finials -->
            <g transform="translate(0, -240)">
              <path d="M-80,10 C-80,-30 80,-30 80,10 Z" fill="none" stroke="${c}" stroke-width="2.5"/>
              ${[-50, -25, 0, 25, 50]
                .map((x) => `<path d="M${x},10 L${x},-38" stroke="${cSaf}" stroke-width="2.5"/>
                             <circle cx="${x}" cy="-42" r="4" fill="${cLight}"/>`)
                .join('')}
            </g>

            <!-- Base Gateway -->
            <rect x="-60" y="230" width="120" height="90" fill="none" stroke="${c}" stroke-width="3"/>
            <path d="M-60,230 C-60,190 60,190 60,230" stroke="${cLight}" stroke-width="2" fill="none"/>
          </g>
        `,
      }),
    },
    {
      id: 'sri-yantra-maha-meru',
      title: 'Sri Yantra & Sacred Mandala',
      sanskritTitle: '॥ महामेरु श्रीचक्रम् ॥',
      place: 'Cosmic / Mount Meru',
      year: 'Timeless',
      plateNumber: 'PLATE 09',
      description: 'The supreme royal diagram of sacred geometry: nine interlocking triangles forming forty-three subtle triangles and the Bindu.',
      url: createChakraSvgSpread({
        plateNo: 'PLATE 09',
        sanskrit: '॥ महामेरु श्रीचक्रम् ॥',
        title: 'Sri Yantra & Sacred Mandala',
        subtitle: 'The Supreme Geometry of Consciousness & Creation',
        location: 'Vedic Cosmology — Mount Meru',
        coords: 'Cosmic Center · Axis Mundi',
        era: 'Vedic Revelation — Rigveda & Saundarya Lahari',
        isDark,
        body: [
          'Revered as the Raja Yantra (King of all Geometrical Diagrams), the Sri Yantra is the visual manifestation of cosmic vibration (Nada-Brahma).',
          'Composed of nine interlocking isosceles triangles: five pointing downwards representing Shakti (feminine creative energy), and four pointing upwards representing Shiva.',
          'The intersection of these nine master triangles yields forty-three secondary triangles arranged in five concentric circuits, culminating in the Bindu.',
          'Constructing an exact Sri Yantra with mathematical perfection is an exceptionally demanding topological feat, requiring strict concurrence of triple intersections.',
          'Surrounded by two concentric lotus rings (eight and sixteen petals) and a triple-line bhupura (earth citadel) with four portals opening to the cardinal directions.',
        ],
        drawArt: `
          <!-- Sri Yantra Sacred Geometry Precision Blueprint -->
          <g transform="translate(325, 420)">
            <!-- Outer Bhupura (Citadel with 4 Gates) -->
            <path d="M-260,-260 L-80,-260 L-80,-280 L80,-280 L80,-260 L260,-260 
                     L260,-80 L280,-80 L280,80 L260,80 L260,260 
                     L80,260 L80,280 L-80,280 L-80,260 L-260,260 
                     L-260,80 L-280,80 L-280,-80 L-260,-80 Z" fill="none" stroke="${c}" stroke-width="2.5"/>

            <!-- Concentric Lotus Rings -->
            <circle cx="0" cy="0" r="230" fill="none" stroke="${cLight}" stroke-width="1.8"/>
            <circle cx="0" cy="0" r="195" fill="none" stroke="${c}" stroke-width="1.4"/>
            <!-- 16 Lotus Petals -->
            ${Array.from({ length: 16 })
              .map((_, i) => {
                const a = (i * 22.5 * Math.PI) / 180;
                return `<circle cx="${(212 * Math.cos(a)).toFixed(1)}" cy="${(212 * Math.sin(a)).toFixed(1)}" r="12" fill="none" stroke="${cSaf}" stroke-width="1.2"/>`;
              })
              .join('')}

            <!-- 8 Lotus Petals -->
            <circle cx="0" cy="0" r="165" fill="none" stroke="${cLight}" stroke-width="1.4"/>
            ${Array.from({ length: 8 })
              .map((_, i) => {
                const a = (i * 45 * Math.PI) / 180;
                return `<circle cx="${(180 * Math.cos(a)).toFixed(1)}" cy="${(180 * Math.sin(a)).toFixed(1)}" r="14" fill="none" stroke="${c}" stroke-width="1.4"/>`;
              })
              .join('')}

            <!-- Interlocking Triangles Core (Nine Master Triangles) -->
            <!-- 4 Shiva Triangles (Pointing UP) -->
            <polygon points="0,-145 -125,50 125,50" fill="none" stroke="${c}" stroke-width="2"/>
            <polygon points="0,-120 -105,75 105,75" fill="none" stroke="${c}" stroke-width="1.8"/>
            <polygon points="0,-95 -85,100 85,100" fill="none" stroke="${c}" stroke-width="1.8"/>
            <polygon points="0,-70 -65,120 65,120" fill="none" stroke="${c}" stroke-width="1.6"/>

            <!-- 5 Shakti Triangles (Pointing DOWN) -->
            <polygon points="0,145 -130,-50 130,-50" fill="none" stroke="${cSaf}" stroke-width="2"/>
            <polygon points="0,120 -115,-70 115,-70" fill="none" stroke="${cSaf}" stroke-width="1.8"/>
            <polygon points="0,95 -95,-90 95,-90" fill="none" stroke="${cSaf}" stroke-width="1.8"/>
            <polygon points="0,70 -75,-110 75,-110" fill="none" stroke="${cSaf}" stroke-width="1.6"/>
            <polygon points="0,48 -55,-130 55,-130" fill="none" stroke="${cSaf}" stroke-width="1.5"/>

            <!-- Central Bindu Point (Ultimate Singularity) -->
            <circle cx="0" cy="8" r="6" fill="${cSaf}" stroke="${cLight}" stroke-width="1.5"/>
            <circle cx="0" cy="8" r="1.5" fill="#FFFFFF"/>
          </g>
        `,
      }),
    },
  ];
}

export const CHAKRA_HERITAGE_PAGES: SketchbookPage[] = generateVedicPlates(false);
export const CHAKRA_DARK_PAGES: SketchbookPage[] = generateVedicPlates(true);
