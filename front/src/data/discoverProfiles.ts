// data/discoverProfiles.ts
export type DiscoverUser = {
  id: string;
  profileImage: string;
  name: string;
  age: number;
  isVerified: boolean;
  aboutMe: string;
  specs: string[];
  lookingFor: string[];
  interests: string[];
  favoriteThing: string;
  causes: string[];
  boundary: string;
  location: string;
  distance: string;
};

const discoverProfiles: DiscoverUser[] = [
  {
    id: "1",
    profileImage: "/image/user1.jpg",
    name: "Leila",
    age: 24,
    isVerified: true,
    aboutMe: "I'm a dreamer who loves late-night talks and good music.",
    specs: ["155 cm", "in a grad school", "drinks", "don’t smoke", "woman", "Libra"],
    lookingFor: ["confidence", "kindness", "loyalty"],
    interests: ["sense of humor", "travel", "reading"],
    favoriteThing: "Sleep",
    causes: ["human rights", "Disability rights"],
    boundary: "Respect",
    location: "Beni-Mellal, Khenifra",
    distance: "77 Km",
  },
  {
    id: "2",
    profileImage: "/image/user2.jpg",
    name: "Sara",
    age: 27,
    isVerified: false,
    aboutMe: "Artist and nature lover. Always curious about the world.",
    specs: ["160 cm", "working full-time", "drinks socially", "doesn't smoke", "woman", "Pisces"],
    lookingFor: ["creativity", "depth", "empathy"],
    interests: ["painting", "hiking", "photography"],
    favoriteThing: "Painting outdoors",
    causes: ["environment", "animal welfare"],
    boundary: "Honesty",
    location: "Casablanca, Morocco",
    distance: "200 Km",
  },
  {
    id: "3",
    profileImage: "/image/user3.jpg",
    name: "Yasmine",
    age: 22,
    isVerified: true,
    aboutMe: "Student of life and laughter. Let’s talk books and dreams.",
    specs: ["168 cm", "student", "doesn’t drink", "doesn’t smoke", "woman", "Leo"],
    lookingFor: ["intelligence", "humor", "honesty"],
    interests: ["reading", "poetry", "movies"],
    favoriteThing: "Watching old films",
    causes: ["education", "youth empowerment"],
    boundary: "Mutual respect",
    location: "Rabat, Morocco",
    distance: "120 Km",
  },
  {
    id: "4",
    profileImage: "/image/user4.jpg",
    name: "Nada",
    age: 26,
    isVerified: false,
    aboutMe: "I love adventures and cooking Moroccan food.",
    specs: ["162 cm", "freelancer", "drinks", "smokes occasionally", "woman", "Sagittarius"],
    lookingFor: ["adventure", "trust", "loyalty"],
    interests: ["cooking", "travel", "languages"],
    favoriteThing: "Trying new recipes",
    causes: ["food security", "women’s rights"],
    boundary: "Space and freedom",
    location: "Marrakech, Morocco",
    distance: "300 Km",
  },
  {
    id: "5",
    profileImage: "/image/user5.jpg",
    name: "Salma",
    age: 25,
    isVerified: true,
    aboutMe: "Quiet thinker with a loud heart. Let's explore life’s meaning together.",
    specs: ["158 cm", "masters student", "doesn’t drink", "doesn’t smoke", "woman", "Virgo"],
    lookingFor: ["depth", "compassion", "stability"],
    interests: ["yoga", "journaling", "tea"],
    favoriteThing: "Morning meditation",
    causes: ["mental health", "spiritual awareness"],
    boundary: "Emotional availability",
    location: "Fes, Morocco",
    distance: "180 Km",
  },
];

export default discoverProfiles;
