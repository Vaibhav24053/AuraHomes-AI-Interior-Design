export type Direction = 'North' | 'South' | 'East' | 'West' | 'Deccan' | 'Coastal' | 'Himalayan' | 'Modern';

export interface StyleEntry {
  id: string;
  name: string;
  region: string;
  direction: Direction;
  imageSearchTerm: string;
  caption: string;
  isRegional: boolean;
}

export const regionalStyles: StyleEntry[] = [
  {
    id: 'nalukettu',
    name: 'Nalukettu',
    region: 'Kerala',
    direction: 'South',
    imageSearchTerm: 'Kerala traditional courtyard home wood interior',
    caption: 'Dark teak, courtyards, and brass — a direction rooted in Kerala\'s monsoon-tested architecture.',
    isRegional: true,
  },
  {
    id: 'chettinad',
    name: 'Chettinad',
    region: 'Tamil Nadu',
    direction: 'South',
    imageSearchTerm: 'Chettinad mansion interior Athangudi tiles',
    caption: 'Teak pillars and Athangudi tiles — the grandeur of Chettiar merchant houses.',
    isRegional: true,
  },
  {
    id: 'rajasthani-haveli',
    name: 'Rajasthani Haveli',
    region: 'Rajasthan',
    direction: 'West',
    imageSearchTerm: 'Rajasthani haveli interior jharokha mirror work',
    caption: 'Arched jharokhas and mirror work — desert grandeur reimagined.',
    isRegional: true,
  },
  {
    id: 'pol-house',
    name: 'Pol House',
    region: 'Gujarat',
    direction: 'West',
    imageSearchTerm: 'Ahmedabad pol house interior carved wood',
    caption: 'Carved wood and close-knit warmth — Ahmedabad\'s old city character.',
    isRegional: true,
  },
  {
    id: 'bonedi-bari',
    name: 'Bonedi Bari',
    region: 'Bengal',
    direction: 'East',
    imageSearchTerm: 'old Kolkata heritage home interior terracotta',
    caption: 'High ceilings and terracotta — the quiet grandeur of old Kolkata homes.',
    isRegional: true,
  },
  {
    id: 'assam-type',
    name: 'Assam-Type',
    region: 'Northeast',
    direction: 'East',
    imageSearchTerm: 'Assam type house bamboo wood raised',
    caption: 'Wood, bamboo, and practical elegance — built for the Northeast\'s climate.',
    isRegional: true,
  },
  {
    id: 'punjabi-haveli',
    name: 'Punjabi Haveli',
    region: 'Punjab',
    direction: 'North',
    imageSearchTerm: 'Punjab haveli courtyard phulkari textile',
    caption: 'Bold color and generous courtyards — Punjab\'s open-hearted hospitality.',
    isRegional: true,
  },
  {
    id: 'awadhi',
    name: 'Awadhi',
    region: 'Uttar Pradesh',
    direction: 'North',
    imageSearchTerm: 'Lucknow haveli interior chikankari arches',
    caption: 'Delicate arches and Nawabi refinement — Lucknow\'s understated elegance.',
    isRegional: true,
  },
  {
    id: 'wada-style',
    name: 'Wada Style',
    region: 'Maharashtra',
    direction: 'West',
    imageSearchTerm: 'Peshwa era wada courtyard home interior',
    caption: 'Courtyards and carved wood columns — Maharashtra\'s Peshwa-era homes.',
    isRegional: true,
  },
  {
    id: 'nizami-style',
    name: 'Nizami Style',
    region: 'Hyderabad/Deccan',
    direction: 'Deccan',
    imageSearchTerm: 'Hyderabad Nizam palace interior arches',
    caption: 'Grand arches and Deccan stonework — Nizami-era refinement.',
    isRegional: true,
  },
  {
    id: 'indo-portuguese',
    name: 'Indo-Portuguese',
    region: 'Goa',
    direction: 'Coastal',
    imageSearchTerm: 'Goan Portuguese home interior oyster shell window',
    caption: 'Oyster-shell windows and coastal color — Goa\'s Indo-Portuguese blend.',
    isRegional: true,
  },
  {
    id: 'kashmiri-wood',
    name: 'Kashmiri Wood Style',
    region: 'Kashmir',
    direction: 'Himalayan',
    imageSearchTerm: 'Kashmiri khatamband ceiling wood interior',
    caption: 'Khatamband ceilings and walnut wood — Kashmir\'s intricate craft tradition.',
    isRegional: true,
  },
  {
    id: 'gen-z-minimal',
    name: 'Gen-Z Minimal',
    region: '',
    direction: 'Modern',
    imageSearchTerm: 'minimal modern Indian apartment interior',
    caption: 'Clean lines and quiet color — for those who want simple and current.',
    isRegional: false,
  },
  {
    id: 'vastu-modern',
    name: 'Vastu-Modern',
    region: '',
    direction: 'Modern',
    imageSearchTerm: 'vastu modern Indian home interior terracotta brass',
    caption: 'Ancient placement wisdom, contemporary execution.',
    isRegional: false,
  },
  // Global / Non-Indian options
  {
    id: 'japandi',
    name: 'Japandi',
    region: 'Global',
    direction: 'Modern',
    imageSearchTerm: 'Japandi interior design warm wood wabi sabi',
    caption: 'A blend of Japanese and Scandinavian minimalism.',
    isRegional: false,
  },
  {
    id: 'bohemian',
    name: 'Bohemian',
    region: 'Global',
    direction: 'Modern',
    imageSearchTerm: 'Bohemian interior design eclectic textured',
    caption: 'Free-spirited, layered, and relaxed.',
    isRegional: false,
  },
  {
    id: 'industrial-loft',
    name: 'Industrial Loft',
    region: 'Global',
    direction: 'Modern',
    imageSearchTerm: 'Industrial loft interior exposed brick metal',
    caption: 'Raw materials, exposed structures, open space.',
    isRegional: false,
  },
  {
    id: 'coastal-modern',
    name: 'Coastal Modern',
    region: 'Global',
    direction: 'Modern',
    imageSearchTerm: 'Coastal modern interior bright airy linen',
    caption: 'Light, breezy, and inspired by the ocean.',
    isRegional: false,
  }
];

export const getImageUrl = (searchTerm: string) => {
  return `https://source.unsplash.com/1600x900/?${encodeURIComponent(searchTerm)}`;
  // Note: source.unsplash.com is used here as requested. If it breaks or returns unrelated 
  // results, we should switch to curated Unsplash image IDs.
};

