export interface DestinationWeather {
  summer: string;
  monsoon: string;
  winter: string;
}

export interface Destination {
  name: string;
  type: string;
  state: string;
  bestSeason: string;
  weather: DestinationWeather;
  highlights: string[];
  tip: string;
  emoji: string;
}

export const DESTINATIONS: Destination[] = [
  {
    name: "Goa",
    type: "beach",
    state: "Goa",
    bestSeason: "October to March",
    weather: {
      summer: "Hot & humid (30-35°C)",
      monsoon: "Heavy rainfall, scenic but wet",
      winter: "Pleasant (20-28°C), peak season",
    },
    highlights: [
      "Beaches",
      "Nightlife",
      "Portuguese Architecture",
      "Water Sports",
    ],
    tip: "Avoid monsoon if beach activities are a priority.",
    emoji: "🏖️",
  },
  {
    name: "Jaipur",
    type: "historical",
    state: "Rajasthan",
    bestSeason: "October to March",
    weather: {
      summer: "Very hot (35-45°C)",
      monsoon: "Moderate rainfall, pleasant",
      winter: "Cool & pleasant (10-22°C), ideal",
    },
    highlights: ["Amber Fort", "Hawa Mahal", "City Palace", "Jantar Mantar"],
    tip: "Visit early morning to avoid crowds at forts.",
    emoji: "🏯",
  },
  {
    name: "Kerala (Munnar & Backwaters)",
    type: "cultural",
    state: "Kerala",
    bestSeason: "September to March",
    weather: {
      summer: "Warm & humid (28-35°C)",
      monsoon: "Heavy rainfall, lush greenery",
      winter: "Cool & pleasant (15-25°C)",
    },
    highlights: [
      "Backwater Cruises",
      "Tea Gardens",
      "Ayurveda",
      "Wildlife Sanctuaries",
    ],
    tip: "Houseboat experience is a must-do.",
    emoji: "🌴",
  },
  {
    name: "Manali",
    type: "hill_station",
    state: "Himachal Pradesh",
    bestSeason: "March to June & October to November",
    weather: {
      summer: "Cool & pleasant (10-25°C), ideal",
      monsoon: "Moderate rain, road risks",
      winter: "Very cold, snowfall (-5 to 10°C)",
    },
    highlights: [
      "Rohtang Pass",
      "Solang Valley",
      "Hadimba Temple",
      "River Rafting",
    ],
    tip: "Book accommodations early during peak summer.",
    emoji: "🏔️",
  },
  {
    name: "Agra",
    type: "historical",
    state: "Uttar Pradesh",
    bestSeason: "October to March",
    weather: {
      summer: "Very hot (35-45°C)",
      monsoon: "Humid with moderate rain",
      winter: "Cool (5-20°C), best for sightseeing",
    },
    highlights: ["Taj Mahal", "Agra Fort", "Fatehpur Sikri", "Mehtab Bagh"],
    tip: "Visit Taj Mahal at sunrise for the best experience.",
    emoji: "🕌",
  },
  {
    name: "Mumbai",
    type: "cultural",
    state: "Maharashtra",
    bestSeason: "November to February",
    weather: {
      summer: "Hot & humid (30-35°C)",
      monsoon: "Heavy rainfall, city floods possible",
      winter: "Pleasant (18-30°C)",
    },
    highlights: [
      "Gateway of India",
      "Marine Drive",
      "Elephanta Caves",
      "Street Food",
    ],
    tip: "Use local trains for budget-friendly travel.",
    emoji: "🌆",
  },
  {
    name: "Delhi",
    type: "historical",
    state: "Delhi",
    bestSeason: "October to March",
    weather: {
      summer: "Extremely hot (40-45°C)",
      monsoon: "Moderate rain, humid",
      winter: "Cold (5-20°C), foggy mornings",
    },
    highlights: ["Red Fort", "Qutub Minar", "India Gate", "Chandni Chowk"],
    tip: "Use Delhi Metro to avoid traffic.",
    emoji: "🏛️",
  },
  {
    name: "Varanasi",
    type: "spiritual",
    state: "Uttar Pradesh",
    bestSeason: "October to March",
    weather: {
      summer: "Very hot (38-45°C)",
      monsoon: "Humid, Ganga rises",
      winter: "Cool (8-20°C), misty mornings",
    },
    highlights: ["Ganga Aarti", "Ghats", "Kashi Vishwanath Temple", "Sarnath"],
    tip: "Early morning boat ride on Ganga is unmissable.",
    emoji: "🪔",
  },
  {
    name: "Rishikesh",
    type: "adventure",
    state: "Uttarakhand",
    bestSeason: "February to May & September to November",
    weather: {
      summer: "Warm (20-35°C), good for rafting",
      monsoon: "Heavy rain, rafting suspended",
      winter: "Cold (5-15°C), peaceful",
    },
    highlights: [
      "White Water Rafting",
      "Yoga Ashrams",
      "Laxman Jhula",
      "Bungee Jumping",
    ],
    tip: "Best time for rafting is February to May.",
    emoji: "🌊",
  },
  {
    name: "Darjeeling",
    type: "hill_station",
    state: "West Bengal",
    bestSeason: "March to May & September to November",
    weather: {
      summer: "Pleasant (10-20°C)",
      monsoon: "Heavy rain, limited visibility",
      winter: "Very cold (0-8°C), snow possible",
    },
    highlights: [
      "Tiger Hill Sunrise",
      "Tea Gardens",
      "Toy Train",
      "Himalayan Views",
    ],
    tip: "Book Toy Train tickets well in advance.",
    emoji: "🍵",
  },
  {
    name: "Udaipur",
    type: "historical",
    state: "Rajasthan",
    bestSeason: "September to March",
    weather: {
      summer: "Very hot (35-42°C)",
      monsoon: "Moderate rain, lakes fill up",
      winter: "Pleasant (10-25°C), ideal",
    },
    highlights: [
      "City Palace",
      "Lake Pichola",
      "Jag Mandir",
      "Saheliyon ki Bari",
    ],
    tip: "Evening boat ride on Lake Pichola is magical.",
    emoji: "🏰",
  },
  {
    name: "Ooty",
    type: "hill_station",
    state: "Tamil Nadu",
    bestSeason: "October to June",
    weather: {
      summer: "Cool & pleasant (15-25°C)",
      monsoon: "Heavy rain, leeches common",
      winter: "Cold (5-15°C), frost possible",
    },
    highlights: [
      "Botanical Gardens",
      "Ooty Lake",
      "Nilgiri Mountain Railway",
      "Tea Estates",
    ],
    tip: "Nilgiri Mountain Railway ride is a UNESCO heritage experience.",
    emoji: "🌿",
  },
  {
    name: "Coorg",
    type: "hill_station",
    state: "Karnataka",
    bestSeason: "October to May",
    weather: {
      summer: "Mild (18-28°C), pleasant",
      monsoon: "Very heavy rain, lush but difficult travel",
      winter: "Cool (12-20°C)",
    },
    highlights: [
      "Coffee Plantations",
      "Abbey Falls",
      "Raja's Seat",
      "Dubare Elephant Camp",
    ],
    tip: "Coffee harvest season (November-February) is the best time.",
    emoji: "☕",
  },
  {
    name: "Leh-Ladakh",
    type: "adventure",
    state: "Jammu & Kashmir",
    bestSeason: "May to September",
    weather: {
      summer: "Cool (10-25°C), ideal for travel",
      monsoon: "Dry (rain shadow area)",
      winter: "Extremely cold (-15 to 5°C), roads closed",
    },
    highlights: [
      "Pangong Lake",
      "Nubra Valley",
      "Monasteries",
      "Khardung La Pass",
    ],
    tip: "Acclimatize for 2 days before any high-altitude activity.",
    emoji: "🏔️",
  },
  {
    name: "Andaman Islands",
    type: "beach",
    state: "Andaman & Nicobar",
    bestSeason: "November to May",
    weather: {
      summer: "Hot & humid (27-35°C)",
      monsoon: "Very heavy rain, ferries cancelled",
      winter: "Pleasant (22-30°C), peak season",
    },
    highlights: [
      "Radhanagar Beach",
      "Scuba Diving",
      "Cellular Jail",
      "Snorkeling",
    ],
    tip: "Book inter-island ferries in advance during peak season.",
    emoji: "🤿",
  },
  {
    name: "Hampi",
    type: "historical",
    state: "Karnataka",
    bestSeason: "October to February",
    weather: {
      summer: "Very hot (35-40°C)",
      monsoon: "Moderate rain, ruins scenic",
      winter: "Pleasant (15-28°C), ideal",
    },
    highlights: [
      "Virupaksha Temple",
      "Stone Chariot",
      "Lotus Mahal",
      "Boulder Landscape",
    ],
    tip: "Rent a bicycle to explore the vast ruins.",
    emoji: "🗿",
  },
  {
    name: "Mysore",
    type: "cultural",
    state: "Karnataka",
    bestSeason: "October to February",
    weather: {
      summer: "Warm (25-35°C)",
      monsoon: "Moderate rain",
      winter: "Cool & pleasant (15-25°C)",
    },
    highlights: [
      "Mysore Palace",
      "Chamundeshwari Temple",
      "Brindavan Gardens",
      "Mysore Zoo",
    ],
    tip: "Visit during Dasara festival for the famous palace illumination.",
    emoji: "👑",
  },
  {
    name: "Amritsar",
    type: "spiritual",
    state: "Punjab",
    bestSeason: "October to March",
    weather: {
      summer: "Very hot (35-42°C)",
      monsoon: "Humid with moderate rain",
      winter: "Cold (5-18°C), foggy",
    },
    highlights: [
      "Golden Temple",
      "Wagah Border Ceremony",
      "Jallianwala Bagh",
      "Punjabi Food",
    ],
    tip: "Early morning visit to Golden Temple is spiritually the best.",
    emoji: "⭐",
  },
  {
    name: "Kolkata",
    type: "cultural",
    state: "West Bengal",
    bestSeason: "October to February",
    weather: {
      summer: "Hot & humid (30-40°C)",
      monsoon: "Heavy rain, flooding possible",
      winter: "Pleasant (12-25°C), Durga Puja season",
    },
    highlights: [
      "Victoria Memorial",
      "Howrah Bridge",
      "Park Street",
      "Street Food",
    ],
    tip: "Visit during Durga Puja (October) for an unforgettable cultural experience.",
    emoji: "🎭",
  },
  {
    name: "Chennai",
    type: "cultural",
    state: "Tamil Nadu",
    bestSeason: "December to February",
    weather: {
      summer: "Very hot & humid (35-42°C)",
      monsoon: "Northeast monsoon (Oct-Dec), heavy rain",
      winter: "Warm & pleasant (22-30°C)",
    },
    highlights: [
      "Marina Beach",
      "Kapaleeshwarar Temple",
      "Fort St. George",
      "Filter Coffee",
    ],
    tip: "Mornings at Marina Beach are perfect for a peaceful walk.",
    emoji: "🌊",
  },
];

export const DESTINATION_NAMES = DESTINATIONS.map((d) => d.name);

export function getDestination(name: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.name === name);
}

export const TYPE_COLORS: Record<string, string> = {
  beach: "bg-blue-100 text-blue-800",
  historical: "bg-amber-100 text-amber-800",
  cultural: "bg-purple-100 text-purple-800",
  hill_station: "bg-green-100 text-green-800",
  adventure: "bg-orange-100 text-orange-800",
  spiritual: "bg-yellow-100 text-yellow-800",
};

export const TYPE_LABELS: Record<string, string> = {
  beach: "Beach",
  historical: "Historical",
  cultural: "Cultural",
  hill_station: "Hill Station",
  adventure: "Adventure",
  spiritual: "Spiritual",
};

export const getCurrentSeason = (): "summer" | "monsoon" | "winter" => {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return "summer";
  if (month >= 6 && month <= 9) return "monsoon";
  return "winter";
};
