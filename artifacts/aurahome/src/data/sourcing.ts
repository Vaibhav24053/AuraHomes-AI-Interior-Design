export type SourcingTier = 'branded' | 'local' | 'artisan';
export type RoomSize = 'small' | 'medium' | 'large';

export interface SourcingOption {
  supplier: string;
  detail: string;
  link?: string;
  basePrice: number;
}

export interface SourcingItem {
  id: string;
  name: string;
  quantities: Record<RoomSize, number>;
  tiers: Record<SourcingTier, SourcingOption>;
}

export interface SizedSourcingItem extends SourcingItem {
  quantity: number;
}

const cityMarkets: Record<string, string> = {
  Delhi: 'Kirti Nagar Furniture Market, Delhi',
  Mumbai: 'Chor Bazaar Wood Works, Mumbai',
  Bengaluru: 'Shivajinagar Furniture Market, Bengaluru',
  Chennai: 'Parrys Corner Furnishings Market, Chennai',
  Kolkata: 'New Market Home Furnishings, Kolkata',
  Hyderabad: 'Nampally Furniture Market, Hyderabad',
  Kochi: 'Broadway Timber & Furnishings Market, Kochi',
  Pune: 'Bhawani Peth Furniture Market, Pune',
};

const marketFor = (city: string) =>
  cityMarkets[city] ?? `${city} Wholesale Furniture Market`;

const bedroomCatalog: SourcingItem[] = [
  {
    id: 'bed',
    name: 'Queen Teak Platform Bed',
    quantities: { small: 1, medium: 1, large: 1 },
    tiers: {
      branded: { supplier: 'Urban Ladder', detail: 'Malabar Queen Bed in solid wood', link: 'https://www.urbanladder.com/products/malabar-teak-queen-bed-UL48291', basePrice: 58900 },
      local: { supplier: '', detail: 'Kiln-dried teak platform bed, made to measure', basePrice: 32500 },
      artisan: { supplier: 'Ravi Woodcraft, Kochi', detail: 'Hand-finished reclaimed teak with softly rounded joinery.', basePrice: 46500 },
    },
  },
  {
    id: 'mattress',
    name: 'Orthopaedic Queen Mattress',
    quantities: { small: 1, medium: 1, large: 1 },
    tiers: {
      branded: { supplier: 'SleepyCat at Pepperfry', detail: 'Ultima 8-inch Queen Mattress', link: 'https://www.pepperfry.com/product/sleepycat-ultima-queen-mattress-885421.html', basePrice: 24900 },
      local: { supplier: '', detail: 'High-density foam mattress with cotton cover', basePrice: 12500 },
      artisan: { supplier: 'Sundaram Bedding Studio, Chennai', detail: 'Layered natural latex and hand-tufted cotton ticking.', basePrice: 21800 },
    },
  },
  {
    id: 'wardrobe',
    name: 'Sliding-door Wardrobe',
    quantities: { small: 0, medium: 1, large: 1 },
    tiers: {
      branded: { supplier: 'Home Centre', detail: 'Keller 3-door engineered-wood wardrobe', link: 'https://www.homecentre.in/in/en/Furniture/Bedroom-Furniture/Wardrobes/Keller-sliding-wardrobe-HC947216.html', basePrice: 42990 },
      local: { supplier: '', detail: 'Laminate shutter wardrobe with loft storage', basePrice: 24500 },
      artisan: { supplier: 'Ananya Joinery Collective, Bengaluru', detail: 'Cane-inset shutters on a responsibly sourced wood frame.', basePrice: 38500 },
    },
  },
  {
    id: 'bedside-tables',
    name: 'Bedside Tables',
    quantities: { small: 1, medium: 2, large: 2 },
    tiers: {
      branded: { supplier: 'IKEA India', detail: 'NORDKISA bamboo bedside table', link: 'https://www.ikea.com/in/en/p/nordkisa-bamboo-bedside-table-80439450/', basePrice: 8990 },
      local: { supplier: '', detail: 'Compact solid-wood bedside cabinet', basePrice: 3800 },
      artisan: { supplier: 'Meenakshi Wood Studio, Chennai', detail: 'Hand-turned teak legs and a woven-cane shelf.', basePrice: 6900 },
    },
  },
  {
    id: 'rug',
    name: 'Handwoven Wool Rug',
    quantities: { small: 1, medium: 1, large: 1 },
    tiers: {
      branded: { supplier: 'Pepperfry', detail: 'Dune hand-tufted wool rug, 5 × 7 ft', link: 'https://www.pepperfry.com/product/dune-hand-tufted-wool-rug-5x7-682104.html', basePrice: 16999 },
      local: { supplier: '', detail: 'Flatweave wool-blend rug, 5 × 7 ft', basePrice: 6800 },
      artisan: { supplier: 'Kutch Looms Cooperative, Bhuj', detail: 'Handwoven wool dhurrie with a restrained geometric border.', basePrice: 12800 },
    },
  },
  {
    id: 'curtains',
    name: 'Linen Curtains (Pair)',
    quantities: { small: 1, medium: 1, large: 2 },
    tiers: {
      branded: { supplier: 'IKEA India', detail: 'DYTÅG linen curtain pair', link: 'https://www.ikea.com/in/en/p/dytag-curtains-with-tie-backs-dark-beige-60519125/', basePrice: 6990 },
      local: { supplier: '', detail: 'Tailored linen-blend curtains with blackout lining', basePrice: 3200 },
      artisan: { supplier: 'Sita Blockprint Atelier, Jaipur', detail: 'Hand-block printed linen with a quiet indigo edge.', basePrice: 6400 },
    },
  },
  {
    id: 'floor-lamp',
    name: 'Reading Floor Lamp',
    quantities: { small: 0, medium: 1, large: 1 },
    tiers: {
      branded: { supplier: 'Nilkamal', detail: 'Arc metal floor lamp in antique brass', link: 'https://www.nilkamalfurniture.com/products/arc-brass-floor-lamp-NL74520', basePrice: 7990 },
      local: { supplier: '', detail: 'Powder-coated metal reading lamp with fabric shade', basePrice: 2900 },
      artisan: { supplier: 'Nila Brass Works, Moradabad', detail: 'Spun-brass stem paired with a hand-pleated cotton shade.', basePrice: 5900 },
    },
  },
  {
    id: 'art',
    name: 'Framed Wall Art',
    quantities: { small: 1, medium: 2, large: 3 },
    tiers: {
      branded: { supplier: 'Home Centre', detail: 'Earth Tones abstract framed print', link: 'https://www.homecentre.in/in/en/Decor/Wall-Decor/Wall-Art/Earth-tones-framed-print-HC918274.html', basePrice: 3490 },
      local: { supplier: '', detail: 'Archival print and slim teak-look frame', basePrice: 1200 },
      artisan: { supplier: 'Madhubani Studio, Patna', detail: 'Original natural-pigment artwork on handmade paper.', basePrice: 4500 },
    },
  },
  {
    id: 'desk',
    name: 'Compact Writing Desk & Chair',
    quantities: { small: 0, medium: 1, large: 1 },
    tiers: {
      branded: { supplier: 'Urban Ladder', detail: 'Mika study desk with upholstered chair', link: 'https://www.urbanladder.com/products/mika-study-desk-chair-set-UL36584', basePrice: 22900 },
      local: { supplier: '', detail: 'Sheesham desk and cane-back chair set', basePrice: 11800 },
      artisan: { supplier: 'Deodar Workshop, Srinagar', detail: 'Walnut writing desk with hand-woven willow chair seat.', basePrice: 19800 },
    },
  },
];

const quantities = (small: number, medium: number, large: number) => ({ small, medium, large });

const item = (
  id: string,
  name: string,
  quantity: Record<RoomSize, number>,
  branded: SourcingOption,
  localDetail: string,
  localPrice: number,
  artisan: SourcingOption,
): SourcingItem => ({
  id,
  name,
  quantities: quantity,
  tiers: {
    branded,
    local: { supplier: '', detail: localDetail, basePrice: localPrice },
    artisan,
  },
});

const livingRoomCatalog: SourcingItem[] = [
  item('sofa', 'Three-seater Sofa', quantities(1, 1, 1), { supplier: 'Urban Ladder', detail: 'Milo 3-seater fabric sofa', link: 'https://www.urbanladder.com/products/milo-three-seater-sofa-UL59382', basePrice: 52900 }, 'Kiln-dried wood sofa with performance fabric', 28500, { supplier: 'Kaveri Upholstery House, Mysuru', detail: 'Hand-upholstered teak frame with tailored cotton-linen cushions.', basePrice: 44500 }),
  item('coffee-table', 'Solid Wood Coffee Table', quantities(1, 1, 1), { supplier: 'Pepperfry', detail: 'Larkin solid wood coffee table', link: 'https://www.pepperfry.com/product/larkin-solid-wood-coffee-table-749210.html', basePrice: 12999 }, 'Sheesham coffee table with lower shelf', 6200, { supplier: 'Ravi Woodcraft, Kochi', detail: 'Rounded reclaimed-teak table, finished by hand.', basePrice: 10500 }),
  item('accent-chair', 'Accent Lounge Chair', quantities(0, 1, 2), { supplier: 'IKEA India', detail: 'STRANDMON wing chair', link: 'https://www.ikea.com/in/en/p/strandmon-wing-chair-nordvalla-dark-grey-30359826/', basePrice: 18990 }, 'Cane-back lounge chair with seat cushion', 7600, { supplier: 'Cane & Co., Kolkata', detail: 'Steam-bent cane and hand-woven rattan lounge chair.', basePrice: 12400 }),
  item('media-console', 'Low Media Console', quantities(1, 1, 1), { supplier: 'Home Centre', detail: 'Oslo wooden TV unit', link: 'https://www.homecentre.in/in/en/Furniture/Living-Room-Furniture/TV-Units/Oslo-TV-unit-HC825614.html', basePrice: 22990 }, 'Laminate media unit with cable management', 9800, { supplier: 'Deodar Workshop, Srinagar', detail: 'Walnut-front console with carefully fitted drawers.', basePrice: 19500 }),
  item('living-rug', 'Living Room Rug', quantities(1, 1, 1), { supplier: 'Pepperfry', detail: 'Mira hand-tufted wool rug, 6 × 9 ft', link: 'https://www.pepperfry.com/product/mira-wool-rug-6x9-671905.html', basePrice: 21999 }, 'Wool-blend flatweave rug, 6 × 9 ft', 8600, { supplier: 'Kutch Looms Cooperative, Bhuj', detail: 'Handwoven wool dhurrie in an oversized living-room scale.', basePrice: 16800 }),
  item('floor-light', 'Floor Lamp', quantities(0, 1, 1), { supplier: 'Nilkamal', detail: 'Halo tripod floor lamp', link: 'https://www.nilkamalfurniture.com/products/halo-tripod-floor-lamp-NL64102', basePrice: 7490 }, 'Metal tripod lamp with cotton shade', 2800, { supplier: 'Nila Brass Works, Moradabad', detail: 'Spun-brass lamp base with a hand-pleated shade.', basePrice: 5700 }),
  item('side-tables', 'Nesting Side Tables', quantities(0, 1, 2), { supplier: 'Home Centre', detail: 'Milo nesting table set', link: 'https://www.homecentre.in/in/en/Furniture/Living-Room-Furniture/Side-Tables/Milo-nesting-tables-HC672341.html', basePrice: 8990 }, 'Sheesham nesting table pair', 4200, { supplier: 'Ananya Joinery Collective, Bengaluru', detail: 'Cane-inset nesting tables with softly eased edges.', basePrice: 7600 }),
];

const diningRoomCatalog: SourcingItem[] = [
  item('dining-table', 'Six-seater Dining Table', quantities(1, 1, 1), { supplier: 'Urban Ladder', detail: 'Malabar six-seater dining table', link: 'https://www.urbanladder.com/products/malabar-six-seater-dining-table-UL83915', basePrice: 45900 }, 'Solid wood six-seater table with matte finish', 24500, { supplier: 'Ravi Woodcraft, Kochi', detail: 'Mortise-and-tenon teak dining table, hand burnished.', basePrice: 39700 }),
  item('dining-chairs', 'Dining Chairs', quantities(2, 4, 6), { supplier: 'IKEA India', detail: 'LISABO ash-veneer dining chair', link: 'https://www.ikea.com/in/en/p/lisabo-chair-ash-veneer-60457231/', basePrice: 6990 }, 'Cane-back solid-wood dining chair', 2800, { supplier: 'Cane & Co., Kolkata', detail: 'Hand-woven cane seats on a seasoned wood frame.', basePrice: 5200 }),
  item('sideboard', 'Dining Sideboard', quantities(0, 1, 1), { supplier: 'Home Centre', detail: 'Dawson 3-door sideboard', link: 'https://www.homecentre.in/in/en/Furniture/Dining-Room-Furniture/Sideboards/Dawson-sideboard-HC527830.html', basePrice: 26990 }, 'Three-door crockery cabinet', 12500, { supplier: 'Ananya Joinery Collective, Bengaluru', detail: 'Carved wood doors and adjustable storage shelves.', basePrice: 22600 }),
  item('pendant', 'Dining Pendant Light', quantities(1, 1, 1), { supplier: 'Pepperfry', detail: 'Aster three-light pendant', link: 'https://www.pepperfry.com/product/aster-three-light-pendant-550923.html', basePrice: 8999 }, 'Three-light metal pendant with warm bulbs', 3500, { supplier: 'Nila Brass Works, Moradabad', detail: 'Hand-spun brass shades on a tailored canopy.', basePrice: 7200 }),
  item('table-linen', 'Table Linen Set', quantities(1, 1, 2), { supplier: 'IKEA India', detail: 'VARDAGEN tablecloth and napkin set', link: 'https://www.ikea.com/in/en/p/vardagen-tablecloth-off-white-30525305/', basePrice: 2490 }, 'Cotton tablecloth and six napkins', 900, { supplier: 'Sita Blockprint Atelier, Jaipur', detail: 'Hand-block printed cotton table linen and napkins.', basePrice: 2100 }),
  item('dining-rug', 'Under-table Rug', quantities(0, 1, 1), { supplier: 'Pepperfry', detail: 'Dune woven rug, 6 × 9 ft', link: 'https://www.pepperfry.com/product/dune-woven-rug-6x9-761208.html', basePrice: 18999 }, 'Easy-clean flatweave dining rug', 6800, { supplier: 'Kutch Looms Cooperative, Bhuj', detail: 'Durable handwoven dhurrie in natural wool.', basePrice: 13200 }),
];

const kitchenCatalog: SourcingItem[] = [
  item('kitchen-cabinets', 'Modular Base & Wall Cabinets', quantities(1, 1, 1), { supplier: 'IKEA India', detail: 'METOD modular kitchen cabinet combination', link: 'https://www.ikea.com/in/en/cat/metod-kitchen-cabinets-24254/', basePrice: 68900 }, 'BWR plywood cabinets with laminate shutters', 38500, { supplier: 'Shakti Joinery Studio, Pune', detail: 'Made-to-measure teak-front cabinetry with hand-fitted hardware.', basePrice: 58200 }),
  item('countertop', 'Quartz Countertop', quantities(1, 1, 1), { supplier: 'Home Centre', detail: 'Calacatta-look engineered quartz counter', link: 'https://www.homecentre.in/in/en/Kitchen/Countertops/Calacatta-quartz-counter-HC842910.html', basePrice: 32900 }, 'Indian quartz slab, measured and installed', 18500, { supplier: 'Deccan Stone Atelier, Hyderabad', detail: 'Honed local stone counter with hand-finished edge profile.', basePrice: 28900 }),
  item('bar-stools', 'Counter Stools', quantities(0, 2, 3), { supplier: 'Urban Ladder', detail: 'Aston upholstered bar stool', link: 'https://www.urbanladder.com/products/aston-upholstered-bar-stool-UL74821', basePrice: 8990 }, 'Metal-and-wood counter stool', 3200, { supplier: 'Cane & Co., Kolkata', detail: 'Hand-woven cane counter stool with a solid teak base.', basePrice: 6100 }),
  item('task-light', 'Under-cabinet Task Lights', quantities(1, 1, 2), { supplier: 'Nilkamal', detail: 'LED task light strip set', link: 'https://www.nilkamalfurniture.com/products/led-kitchen-task-light-set-NL39281', basePrice: 3490 }, 'Warm LED strip with aluminium channel', 1450, { supplier: 'Nila Brass Works, Moradabad', detail: 'Small hand-finished brass task sconces for the prep wall.', basePrice: 2900 }),
  item('open-shelves', 'Open Display Shelves', quantities(1, 1, 2), { supplier: 'Pepperfry', detail: 'Alder wall-mounted kitchen shelf', link: 'https://www.pepperfry.com/product/alder-wall-mounted-kitchen-shelf-908741.html', basePrice: 4999 }, 'Powder-coated metal and wood shelf', 1800, { supplier: 'Ravi Woodcraft, Kochi', detail: 'Slim reclaimed-teak shelves with concealed brackets.', basePrice: 3900 }),
  item('runner', 'Washable Kitchen Runner', quantities(1, 1, 2), { supplier: 'IKEA India', detail: 'TIPHEDE flatwoven runner', link: 'https://www.ikea.com/in/en/p/tiphede-rug-flatwoven-natural-black-40456757/', basePrice: 1490 }, 'Cotton anti-slip kitchen runner', 550, { supplier: 'Kutch Looms Cooperative, Bhuj', detail: 'Tightly woven cotton runner for high-traffic use.', basePrice: 1300 }),
];

const genericCatalog = livingRoomCatalog;

const catalogForRoom = (roomType?: string): SourcingItem[] => {
  const normalized = roomType?.toLowerCase() ?? '';
  if (normalized.includes('bed')) return bedroomCatalog;
  if (normalized.includes('dining')) return diningRoomCatalog;
  if (normalized.includes('kitchen')) return kitchenCatalog;
  if (normalized.includes('living') || normalized.includes('lounge')) return livingRoomCatalog;
  return genericCatalog;
};

const styleCraftNote = (styleName?: string) => {
  if (!styleName) return '';
  const styleDetails: Record<string, string> = {
    nalukettu: 'The finish is kept deep and warm to sit with Nalukettu teak and brass.',
    chettinad: 'The detailing draws on Chettinad timber, brass, and Athangudi-tile tones.',
    'rajasthani haveli': 'The finish is layered with the warm wood and subtle jharokha character of a Rajasthani haveli.',
    'pol house': 'The joinery and carved detail echo the woodwork of Ahmedabad pol houses.',
    'bonedi bari': 'The muted terracotta and aged-wood finish suits a Bonedi Bari setting.',
    'assam-type': 'The light natural material palette is chosen for an Assam-Type home.',
    'punjabi haveli': 'The craft is finished with the generous colour and textile warmth of a Punjabi haveli.',
    awadhi: 'The restrained detail is chosen to complement Awadhi arches and chikankari softness.',
    'wada style': 'The timber finish references the courtyard warmth of Maharashtra wada homes.',
    'nizami style': 'The brass and carved accents are selected for Nizami-era Deccan refinement.',
    'indo-portuguese': 'The finish is tuned to Indo-Portuguese coastal colour and crafted timber.',
    'kashmiri wood style': 'The woodwork complements Kashmiri walnut and khatamband-inspired detail.',
  };
  const detail = styleDetails[styleName.toLowerCase()];
  return detail
    ? ` ${detail}`
    : ` Crafted to complement the selected ${styleName} interior direction.`;
};

export const getSourcingCatalog = (
  roomSize: RoomSize,
  city = 'Delhi',
  roomType?: string,
  styleName?: string,
): SizedSourcingItem[] =>
  catalogForRoom(roomType)
    .map((item) => ({
      ...item,
      quantity: item.quantities[roomSize],
      tiers: {
        branded: item.tiers.branded,
        local: { ...item.tiers.local, supplier: marketFor(city) },
        artisan: {
          ...item.tiers.artisan,
          detail: `${item.tiers.artisan.detail}${styleCraftNote(styleName)}`,
        },
      },
    }))
    .filter((item) => item.quantity > 0);