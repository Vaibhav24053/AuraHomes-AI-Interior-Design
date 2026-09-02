export type Direction = 'North' | 'South' | 'East' | 'West' | 'Deccan' | 'Coastal' | 'Himalayan' | 'Modern';

export interface StyleEntry {
  id: string;
  name: string;
  region: string;
  direction: Direction;
  imageSearchTerm: string;
  caption: string;
  isRegional: boolean;
  imageUrl: string;
}

const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=82`;

export const regionalStyles: StyleEntry[] = [
  {
    id: 'nalukettu',
    name: 'Nalukettu',
    region: 'Kerala',
    direction: 'South',
    imageSearchTerm: 'Kerala traditional courtyard home wood interior',
    caption: 'Dark teak, courtyards, and brass — a direction rooted in Kerala\'s monsoon-tested architecture.',
    isRegional: true,
    imageUrl: unsplash('photo-1600607687920-4e2a09cf159d'),
  },
  {
    id: 'chettinad',
    name: 'Chettinad',
    region: 'Tamil Nadu',
    direction: 'South',
    imageSearchTerm: 'Chettinad mansion interior Athangudi tiles',
    caption: 'Teak pillars and Athangudi tiles — the grandeur of Chettiar merchant houses.',
    isRegional: true,
    imageUrl: unsplash('photo-1600210492486-724fe5c67fb0'),
  },
  {
    id: 'rajasthani-haveli',
    name: 'Rajasthani Haveli',
    region: 'Rajasthan',
    direction: 'West',
    imageSearchTerm: 'Rajasthani haveli interior jharokha mirror work',
    caption: 'Arched jharokhas and mirror work — desert grandeur reimagined.',
    isRegional: true,
    imageUrl: unsplash('photo-1618221195710-dd6b41faaea6'),
  },
  {
    id: 'pol-house',
    name: 'Pol House',
    region: 'Gujarat',
    direction: 'West',
    imageSearchTerm: 'Ahmedabad pol house interior carved wood',
    caption: 'Carved wood and close-knit warmth — Ahmedabad\'s old city character.',
    isRegional: true,
    imageUrl: unsplash('photo-1600566753190-17f0baa2a6c3'),
  },
  {
    id: 'bonedi-bari',
    name: 'Bonedi Bari',
    region: 'Bengal',
    direction: 'East',
    imageSearchTerm: 'old Kolkata heritage home interior terracotta',
    caption: 'High ceilings and terracotta — the quiet grandeur of old Kolkata homes.',
    isRegional: true,
    imageUrl: unsplash('photo-1615874959474-d609969a20ed'),
  },
  {
    id: 'assam-type',
    name: 'Assam-Type',
    region: 'Northeast',
    direction: 'East',
    imageSearchTerm: 'Assam type house bamboo wood raised',
    caption: 'Wood, bamboo, and practical elegance — built for the Northeast\'s climate.',
    isRegional: true,
    imageUrl: unsplash('photo-1615529328331-f8917597711f'),
  },
  {
    id: 'punjabi-haveli',
    name: 'Punjabi Haveli',
    region: 'Punjab',
    direction: 'North',
    imageSearchTerm: 'Punjab haveli courtyard phulkari textile',
    caption: 'Bold color and generous courtyards — Punjab\'s open-hearted hospitality.',
    isRegional: true,
    imageUrl: unsplash('photo-1616047006789-b7af5afb8c20'),
  },
  {
    id: 'awadhi',
    name: 'Awadhi',
    region: 'Uttar Pradesh',
    direction: 'North',
    imageSearchTerm: 'Lucknow haveli interior chikankari arches',
    caption: 'Delicate arches and Nawabi refinement — Lucknow\'s understated elegance.',
    isRegional: true,
    imageUrl: unsplash('photo-1600121848594-d8644e57abab'),
  },
  {
    id: 'wada-style',
    name: 'Wada Style',
    region: 'Maharashtra',
    direction: 'West',
    imageSearchTerm: 'Peshwa era wada courtyard home interior',
    caption: 'Courtyards and carved wood columns — Maharashtra\'s Peshwa-era homes.',
    isRegional: true,
    imageUrl: unsplash('photo-1600566753051-f0b89df2dd90'),
  },
  {
    id: 'nizami-style',
    name: 'Nizami Style',
    region: 'Hyderabad/Deccan',
    direction: 'Deccan',
    imageSearchTerm: 'Hyderabad Nizam palace interior arches',
    caption: 'Grand arches and Deccan stonework — Nizami-era refinement.',
    isRegional: true,
    imageUrl: unsplash('photo-1600585154340-be6161a56a0c'),
  },
  {
    id: 'indo-portuguese',
    name: 'Indo-Portuguese',
    region: 'Goa',
    direction: 'Coastal',
    imageSearchTerm: 'Goan Portuguese home interior oyster shell window',
    caption: 'Oyster-shell windows and coastal color — Goa\'s Indo-Portuguese blend.',
    isRegional: true,
    imageUrl: unsplash('photo-1600573472550-8090b5e0745e'),
  },
  {
    id: 'kashmiri-wood',
    name: 'Kashmiri Wood Style',
    region: 'Kashmir',
    direction: 'Himalayan',
    imageSearchTerm: 'Kashmiri khatamband ceiling wood interior',
    caption: 'Khatamband ceilings and walnut wood — Kashmir\'s intricate craft tradition.',
    isRegional: true,
    imageUrl: unsplash('photo-1618219908412-a29a1bb7b86e'),
  },
  {
    id: 'gen-z-minimal',
    name: 'Gen-Z Minimal',
    region: '',
    direction: 'Modern',
    imageSearchTerm: 'minimal modern Indian apartment interior',
    caption: 'Clean lines and quiet color — for those who want simple and current.',
    isRegional: false,
    imageUrl: unsplash('photo-1600566753086-00f18fb6b3ea'),
  },
  {
    id: 'vastu-modern',
    name: 'Vastu-Modern',
    region: '',
    direction: 'Modern',
    imageSearchTerm: 'vastu modern Indian home interior terracotta brass',
    caption: 'Ancient placement wisdom, contemporary execution.',
    isRegional: false,
    imageUrl: unsplash('photo-1600585154526-990dced4db0d'),
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
    imageUrl: unsplash('photo-1616486338812-3dadae4b4ace'),
  },
  {
    id: 'bohemian',
    name: 'Bohemian',
    region: 'Global',
    direction: 'Modern',
    imageSearchTerm: 'Bohemian interior design eclectic textured',
    caption: 'Free-spirited, layered, and relaxed.',
    isRegional: false,
    imageUrl: unsplash('photo-1618220179428-22790b461013'),
  },
  {
    id: 'industrial-loft',
    name: 'Industrial Loft',
    region: 'Global',
    direction: 'Modern',
    imageSearchTerm: 'Industrial loft interior exposed brick metal',
    caption: 'Raw materials, exposed structures, open space.',
    isRegional: false,
    imageUrl: unsplash('photo-1600573472591-ee6b68d14c68'),
  },
  {
    id: 'coastal-modern',
    name: 'Coastal Modern',
    region: 'Global',
    direction: 'Modern',
    imageSearchTerm: 'Coastal modern interior bright airy linen',
    caption: 'Light, breezy, and inspired by the ocean.',
    isRegional: false,
    imageUrl: unsplash('photo-1600210491892-03d54c0aaf87'),
  }
];

const imageBySearchTerm = new Map(regionalStyles.map(style => [style.imageSearchTerm, style.imageUrl]));

export const getImageUrl = (searchTerm: string) =>
  imageBySearchTerm.get(searchTerm) ?? regionalStyles[0].imageUrl;

