export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Schedule", href: "#schedule" },
  { label: "Artists", href: "#artists" },
  { label: "Gallery", href: "#gallery" },
  { label: "Sponsors", href: "#sponsors" },
  { label: "Contact", href: "#contact" },
];

export const eras = [
  {
    era: "Ancient Bengal",
    period: "300 BCE - 1200 CE",
    title: "Terracotta Roots",
    body: "The foundation of our architectural identity. From the baked earth temples of Bishnupur to the intricate plaques of Buddhist viharas, this era gave Bengal its characteristic earthy aesthetic and resilience.",
  },
  {
    era: "Bengal Sultanate",
    period: "1352 - 1576",
    title: "The Golden Web",
    body: "A period of immense prosperity and synthesis. The weaving of muslin, the fusion of Indo-Saracenic art, and the flowering of Bengali literature under royal patronage shaped a distinct cultural confidence.",
  },
  {
    era: "Colonial Era",
    period: "1757 - 1947",
    title: "Renaissance & Resistance",
    body: "The birth of modern Indian thought. Raja Ram Mohan Roy, Rabindranath Tagore, and Netaji Subhash Chandra Bose redefined our intellectual landscape, blending Western modernity with Eastern spirituality.",
  },
  {
    era: "Modern Era",
    period: "1947 - Present",
    title: "Digital Horizon",
    body: "Today, Bengal stands at the crossroads of heritage and innovation. We carry the songs of the Bauls on our lips while writing code that shapes the future. Espektro 2026 celebrates this seamless continuum.",
  },
];

export const stats = [
  { value: "4", label: "Days" },
  { value: "50+", label: "Events" },
  { value: "15k+", label: "Footfall" },
  { value: "5L+", label: "Prizes" },
];

export const heritage = [
  {
    title: "Alpona",
    subtitle: "Sacred Art",
    description:
      "The ancient Bengali art of floor painting with rice paste. More than decoration, it is a prayer drawn by hand - inviting prosperity and marking every auspicious beginning.",
    image: "/images/alpona.jpeg",
  },
  {
    title: "Chhau",
    subtitle: "Masked Dance",
    description:
      "A martial dance form from Purulia that blends athleticism with storytelling. The vibrant, oversized masks represent mythological characters and the triumph of good over evil.",
    image: "/images/chhau.jpeg",
  },
  {
    title: "Baul",
    subtitle: "Mystic Songs",
    description:
      "The soul music of Bengal. Wandering minstrels who sing of love, humanity, and the divine, transcending rigorous religious boundaries with their Ektaras.",
    image: "/images/baul.jpeg",
  },
];

export const clubs = [
  "Riyaz",
  "Chitrak",
  "Elysians",
  "Litmus",
  "NoobCode",
  "Gdsc",
  "Ieee",
  "Les Quiz",
  "E-Cell",
  "Shutterbug",
  "Voyager",
  "Sports",
];

export type GanttEvent = {
  name: string;
  category: "tech" | "cultural" | "food" | "gaming" | "ceremony";
  startHour: number;
  duration: number;
  prize?: string;
};

export type DaySchedule = {
  day: string;
  date: string;
  label: string;
  events: GanttEvent[];
};

export const schedule: DaySchedule[] = [
  {
    day: "Day 1",
    date: "Mar 14",
    label: "Genesis",
    events: [
      { name: "Inauguration", category: "ceremony", startHour: 9, duration: 1 },
      {
        name: "Code Warriors",
        category: "tech",
        startHour: 10,
        duration: 6,
        prize: "50K",
      },
      {
        name: "AI / ML Workshop",
        category: "tech",
        startHour: 10,
        duration: 3,
      },
      {
        name: "RoboRace",
        category: "tech",
        startHour: 14,
        duration: 3,
        prize: "40K",
      },
      {
        name: "Spikr",
        category: "cultural",
        startHour: 15,
        duration: 2,
        prize: "15K",
      },
      {
        name: "Cultural Night",
        category: "cultural",
        startHour: 19,
        duration: 3,
      },
    ],
  },
  {
    day: "Day 2",
    date: "Mar 15",
    label: "Evolution",
    events: [
      {
        name: "Hackathon",
        category: "tech",
        startHour: 9,
        duration: 14,
        prize: "1L",
      },
      {
        name: "MasterChef KGEC",
        category: "food",
        startHour: 11,
        duration: 3,
        prize: "20K",
      },
      {
        name: "BGMI Showdown",
        category: "gaming",
        startHour: 14,
        duration: 4,
        prize: "25K",
      },
      {
        name: "Nukkad Natak",
        category: "cultural",
        startHour: 16,
        duration: 2,
        prize: "25K",
      },
      {
        name: "Nrityanjali",
        category: "cultural",
        startHour: 18,
        duration: 2,
        prize: "30K",
      },
      { name: "DJ Night", category: "cultural", startHour: 21, duration: 2 },
    ],
  },
  {
    day: "Day 3",
    date: "Mar 16",
    label: "Revolution",
    events: [
      {
        name: "Valorant Finals",
        category: "gaming",
        startHour: 10,
        duration: 4,
        prize: "35K",
      },
      {
        name: "Food Truck Rally",
        category: "food",
        startHour: 11,
        duration: 6,
      },
      {
        name: "Band-E-Arena",
        category: "cultural",
        startHour: 14,
        duration: 4,
        prize: "60K",
      },
      {
        name: "Prize Ceremony",
        category: "ceremony",
        startHour: 18,
        duration: 2,
      },
      {
        name: "Celebrity Night",
        category: "cultural",
        startHour: 20,
        duration: 3,
      },
    ],
  },
  {
    day: "Day 4",
    date: "Mar 17",
    label: "Celebration",
    events: [
      {
        name: "Sports Finals",
        category: "ceremony",
        startHour: 10,
        duration: 4,
      },
      { name: "Alumni Meet", category: "ceremony", startHour: 14, duration: 2 },
      {
        name: "Closing Ceremony",
        category: "ceremony",
        startHour: 16,
        duration: 2,
      },
      {
        name: "Grand Finale",
        category: "cultural",
        startHour: 19,
        duration: 3,
      },
    ],
  },
];

export const artists = [
  {
    name: "Arijit Singh",
    genre: "Playback Singer",
    description:
      "India's most celebrated playback singer with a voice that transcends generations. Grammy-nominated artist with multiple Filmfare awards and countless chart-topping hits.",
    date: "March 16, 2026",
    time: "8:00 PM",
    venue: "Main Stage",
    image: "/images/artist-1.jpg",
    social: { instagram: "@arijitsingh", twitter: "@arijitsingh" },
  },
  {
    name: "Raftaar",
    genre: "Hip-Hop Artist & Rapper",
    description:
      "Pioneer of Indian hip-hop culture with groundbreaking tracks. Known for high-energy performances and revolutionary collaborations that shaped the urban music scene.",
    date: "March 15, 2026",
    time: "9:30 PM",
    venue: "Arena Stage",
    image: "/images/artist-2.jpg",
    social: { instagram: "@raftaarmusic", twitter: "@raftaarmusic" },
  },
  {
    name: "Nucleya",
    genre: "Electronic / Bass Music",
    description:
      "India\u0027s bass music pioneer blending traditional Indian sounds with cutting-edge electronic beats. Multiple album awards and international acclaim for innovative soundscapes.",
    date: "March 14, 2026",
    time: "10:00 PM",
    venue: "EDM Arena",
    image: "/images/artist-3.jpg",
    social: { instagram: "@nucleya", twitter: "@nucleya" },
  },
  {
    name: "The Local Train",
    genre: "Indie Rock Band",
    description:
      "Hindi rock band known for their poetic lyrics and powerful live performances. Youth anthem creators with a massive following across India's indie music scene.",
    date: "March 17, 2026",
    time: "7:00 PM",
    venue: "Indie Stage",
    image: "/images/artist-4.jpg",
    social: { instagram: "@thelocaltrain", twitter: "@thelocaltrain" },
  },
];

export const pastArtists = [
  { id: 'image1', url: 'https://res.cloudinary.com/dgc9mpvvw/image/upload/v1705065230/espektro/2023/artists/qaliiaklogrnboxyqhrv.webp' },
  { id: 'image2', url: 'https://res.cloudinary.com/drwrctrgz/image/upload/v1704967349/Espetro/iamge6_mevsj3.jpg' },
  { id: 'image3', url: 'https://res.cloudinary.com/drwrctrgz/image/upload/v1704967367/Espetro/image12_mqrroi.jpg' },
  { id: 'image4', url: 'https://res.cloudinary.com/dgc9mpvvw/image/upload/v1705065229/espektro/2023/artists/avjraekupwtyo9nk79ka.webp' },
  { id: 'image5', url: 'https://res.cloudinary.com/drwrctrgz/image/upload/v1704968351/Espetro/image17_ecygre.jpg' },
  { id: 'image6', url: 'https://res.cloudinary.com/dgc9mpvvw/image/upload/v1705066152/espektro/2023/artists/tjxdvk9ugsac2rtnwbmj.webp' },
  { id: 'image7', url: 'https://res.cloudinary.com/dgc9mpvvw/image/upload/v1705066153/espektro/2023/artists/vzmd6ndj32qcipyvflqz.webp' },
  { id: 'image8', url: 'https://res.cloudinary.com/dgc9mpvvw/image/upload/v1705065238/espektro/2023/artists/dvhfnwlmw2ncqbsqz9ct.webp' },
  { id: 'image9', url: 'https://res.cloudinary.com/drwrctrgz/image/upload/v1704968351/Espetro/image19_zblvml.jpg' },
  { id: 'image10', url: 'https://res.cloudinary.com/drwrctrgz/image/upload/v1704968351/Espetro/image18_xtzgmg.jpg' },
  { id: 'image11', url: 'https://res.cloudinary.com/drwrctrgz/image/upload/v1704967351/Espetro/image2_o7wden.jpg' },
  { id: 'image12', url: 'https://res.cloudinary.com/drwrctrgz/image/upload/v1704967350/Espetro/image1_y20rbn.jpg' },
  { id: 'image13', url: 'https://res.cloudinary.com/drwrctrgz/image/upload/v1704967359/Espetro/image8_slwhke.jpg' },
  { id: 'image14', url: 'https://res.cloudinary.com/drwrctrgz/image/upload/v1704967354/Espetro/image4_wqvp6h.jpg' },
  { id: 'image15', url: 'https://res.cloudinary.com/drwrctrgz/image/upload/c_pad,b_auto:predominant,fl_preserve_transparency/v1704967356/Espetro/image5_eagfgb.jpg?_s=public-apps' },
  { id: 'image16', url: 'https://res.cloudinary.com/drwrctrgz/image/upload/v1704967352/Espetro/image3_lzksiv.jpg' },
];

export const galleryImages = [
  {
    src: "/images/india-culture.jpeg",
    alt: "Cultural performance at Espektro",
    span: "col-span-2 row-span-2",
  },
  {
    src: "/images/bengali-culture.jpeg",
    alt: "Durga Puja celebration",
    span: "",
  },
  {
    src: "/images/kolkata-city.jpeg",
    alt: "Kolkata cityscape",
    span: "",
  },
  {
    src: "/images/kolkata-monochrome.jpeg",
    alt: "Heritage of Kolkata",
    span: "col-span-1 row-span-2",
  },
  {
    src: "/images/india-culture.jpeg",
    alt: "Technical event at Espektro",
    span: "",
  },
  {
    src: "/images/bengali-culture.jpeg",
    alt: "Pronite performance",
    span: "col-span-2",
  },
];

export const contacts = [
  {
    name: "Arka Kundu",
    role: "General Secretary",
    phone: "+91 74398 17750",
  },
  {
    name: "Puspendu Bar",
    role: "Cultural Secretary",
    phone: "+91 80167 38193",
  },
  {
    name: "Lalit Kumar Mahato",
    role: "Technical Secretary",
    phone: "+91 89540 05339",
  },
];

export const sponsors = [
  {
    label: "Title Sponsor",
    size: "text-3xl lg:text-4xl",
    items: ["TCS"],
  },
  {
    label: "Platinum",
    size: "text-xl lg:text-2xl",
    items: ["Red Bull", "Senco Gold"],
  },
  {
    label: "Gold",
    size: "text-base lg:text-lg",
    items: ["Decathlon", "Zebronics", "Domino's", "Coca-Cola"],
  },
  {
    label: "Partners",
    size: "text-sm",
    items: [
      "KGEC Alumni",
      "Startup Bengal",
      "IEEE",
      "ACM",
      "Google DSC",
      "MLH",
    ],
  },
];

const sponsorBaseUrl = `https://res.cloudinary.com/dgc9mpvvw/image/upload/v1704024441/espektro/2023/sponsors/`;

export const sponsorLogos = [
  { id: 2, sponsor: 'Official Food and Beverages Partner', url: `${sponsorBaseUrl}wow-momo.webp` },
  { id: 3, sponsor: 'Powered-by sponsor', url: `${sponsorBaseUrl}techno-exponent.webp` },
  { id: 4, sponsor: 'Audio Partner', url: `${sponsorBaseUrl}zebronics.webp` },
  { id: 8, sponsor: 'GDSC event sponsor', url: `${sponsorBaseUrl}unstop.webp` },
  { id: 10, sponsor: 'Official Grooming Partner', url: `${sponsorBaseUrl}breado.webp` },
  { id: 11, sponsor: 'Exclusive Radio Partner', url: `${sponsorBaseUrl}friends-fm.webp` },
  { id: 12, sponsor: 'Blogger Outreach Partner', url: `${sponsorBaseUrl}blogadda.webp` },
  { id: 13, sponsor: 'Official Sports Partner', url: `${sponsorBaseUrl}decathlon.webp` },
  { id: 14, sponsor: 'Title sponsor', url: `${sponsorBaseUrl}senco.webp` },
  { id: 15, sponsor: 'The Illustration Partner', url: `${sponsorBaseUrl}inked-voices.webp` },
  { id: 16, sponsor: 'Official Promotional Partner', url: `${sponsorBaseUrl}culcutta-canvas.webp` },
  { id: 17, sponsor: 'Official Gifts Partner', url: `${sponsorBaseUrl}chowman.webp` },
  { id: 18, sponsor: 'Official Food Partner', url: `${sponsorBaseUrl}dominos.webp` },
  { id: 19, sponsor: 'Official RACING Partner', url: `${sponsorBaseUrl}ktm.webp` },
  { id: 20, sponsor: 'advertising Partner', url: `${sponsorBaseUrl}oxedent.webp` },
  { id: 21, sponsor: 'Official Gift Partner', url: `${sponsorBaseUrl}presto.webp` },
];

const clubBaseUrl = 'https://res.cloudinary.com/dgc9mpvvw/image/upload/v1705041136/espektro/2023/clubs-logo/';

export const clubLogos = [
  { id: 1, name: 'RIYAZ', image: `${clubBaseUrl}riyaz-logo.webp`, social_link: 'https://www.facebook.com/riyazkgec' },
  { id: 2, name: 'ELYSIUM', image: `${clubBaseUrl}elysium-logo.webp`, social_link: 'https://www.facebook.com/ElysiumKGEC' },
  { id: 3, name: 'SHUTTERBUG', image: `${clubBaseUrl}shutterbug-logo.webp`, social_link: 'https://www.facebook.com/shutterbugkgec' },
  { id: 4, name: 'CHITRANK', image: `${clubBaseUrl}chitrank-logo.webp`, social_link: 'https://www.facebook.com/groups/1500050480144825/' },
  { id: 5, name: 'LITMUS', image: `${clubBaseUrl}litmus-logo.webp`, social_link: 'https://www.facebook.com/litmusKGEC' },
  { id: 6, name: 'GDSC KGEC', image: `${clubBaseUrl}gdsc-kgec.webp`, social_link: 'https://www.facebook.com/dsckgec' },
  { id: 7, name: 'ROBOTICS SOCIETY', image: `${clubBaseUrl}robotics-society-logo.webp`, social_link: 'https://www.facebook.com/kgecrs' },
  { id: 8, name: 'SAC KGEC', image: `${clubBaseUrl}sac-kgec-logo.webp`, social_link: 'https://www.facebook.com/kgecSAC' },
  { id: 9, name: 'LES QUIZERABLES', image: `${clubBaseUrl}les-quizerable-logo.webp`, social_link: 'https://www.facebook.com/LesQuizerablesKgec' },
  { id: 10, name: 'INFINITIO', image: `${clubBaseUrl}infinitio-logo.webp`, social_link: 'https://www.facebook.com/infinitio.kgec' },
  { id: 11, name: 'KEYGEN CODERS', image: `${clubBaseUrl}keygen-coders-logo.webp`, social_link: 'https://www.facebook.com/KeyGEnCoders' },
  { id: 12, name: 'NOSCOPE', image: `${clubBaseUrl}noscope-logo.webp`, social_link: 'https://www.facebook.com/profile.php?id=100090429646028' },
  { id: 13, name: 'IMPOSTER', image: `${clubBaseUrl}imposter-logo.webp`, social_link: 'https://www.facebook.com/profile.php?id=100093346495217' },
  { id: 14, name: 'NOVA', image: `${clubBaseUrl}nova-logo.webp`, social_link: 'https://www.facebook.com/kgec.nova' },
  { id: 15, name: 'SPORTIX', image: `${clubBaseUrl}sportix-logo.webp`, social_link: 'https://www.facebook.com/profile.php?id=61551065199815' },
];

