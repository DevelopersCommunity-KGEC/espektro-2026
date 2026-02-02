/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventProps, EventDayProps, EventSectionProps, EventData } from './types';

// Helper function to add id to events
const processEvents = (events: any[]): EventData[] => {
  return events.map((event, index) => ({
    ...event,
    id: index + 1, // Add numeric id
  }));
};

// Apply to your event data - demoEventData will now have IDs added
const rawEventData = [
  {
    _id: "evt024",
    title: "Math-o-Meme",
    description: "A robotic soccer competition where teams design manual robots to compete in an arena designed for robotic soccer matches.",
    rules: "Each team must bring one robot. Only one participant controls the robot during a match. Robots cannot grab or withhold the ball. Judges' decisions are final.",
    prizes: "Total Prize Pool: ₹20,000 (subject to change based on participation).",
    tagLine: "Build. Compete. Dominate.",
    startTime: "2025-03-13T20:00:00Z",
    endTime: "2025-03-23T23:59:00Z",
    eventVenue: "Online",
    eventImages: [
        {
            url: "https://res.cloudinary.com/di4qqgdw2/image/upload/v1741881673/MEME-O-Math_ihdzfl.png",
            _id: "img003"
        }
    ],
    eventType: "Technical",
    eventMinParticipants: 1,
    eventMaxParticipants: 1,
    eventPrice: 0,
    eventPriceForKGEC: 0,
    eventOrganiserClub: {
          name: "Infinitio",
      image: "https://res.cloudinary.com/di4qqgdw2/image/upload/v1741881893/Infinitio_logo_c2sdys.png"
    },
    eventCoordinators: [
        {
            name: "Sayan Das",
            phone: "+91-8584954747",
            _id: "coord003"
        },
    ],
    createdBy: "admin124",
    sponsors: [
        {
            name: "BotTech Innovations",
            type: "Gold",
            _id: "spons003",
            image: "https://example.com/images/bottech-innovations-logo.jpg"
        }
    ],
    eventWinList: [],
    createdAt: "2025-02-10T12:30:00Z",
    updatedAt: "2025-03-01T15:45:00Z",
    __v: 0,
    otherPlatformUrl: "https://techtix2025.robosoccer.com",
    eventPrize: 500,
    brochureLink : "https://res.cloudinary.com/di4qqgdw2/image/upload/v1741881657/Math_o_meme_lfc9ss.pdf",
    registrationLink:"https://www.facebook.com/100063718663992/posts/pfbid02yY87czS3q9WdH57AgHC3cb5TBDrMM4ci3oiQEipKkzmaHGUcQSKEVQpFTo4kLMxcl/?app=fbl"
  },
  {
    _id: "evt001",
    title: "CAD Competition",
    description: "A robotic soccer competition where teams design manual robots to compete in an arena designed for robotic soccer matches.",
    rules: "Each team must bring one robot. Only one participant controls the robot during a match. Robots cannot grab or withhold the ball. Judges' decisions are final.",
    prizes: "Total Prize Pool: ₹20,000 (subject to change based on participation).",
    tagLine: "Build. Compete. Dominate.",
    startTime: "2025-03-21T18:00:00Z",
    endTime: "2025-03-21T22:00:00Z",
    eventVenue: "Online",
    eventImages: [
        {
            url: "https://res.cloudinary.com/dlxpcyiin/image/upload/v1742491479/img_file_bbtmam.jpg",
            _id: "img003"
        }
    ],
    eventType: "Technical",
    eventMinParticipants: 1,
    eventMaxParticipants: 1,
    eventPrice: 37,
    eventPriceForKGEC: 125,
    eventOrganiserClub: {
        name: "SAC KGEC",
        image: "https://res.cloudinary.com/dlxpcyiin/image/upload/v1741858988/sac_xmcqss.png"
    },
    eventCoordinators: [
        {
            name: "Atanu Pal",
            phone: "+91-9907850449",
            _id: "coord003"
        },
        {
          name: "Koushik Karmarkar",
          phone: "9932054738",
          _id: "coord004"
      }
    ],
    createdBy: "admin124",
    sponsors: [
        {
            name: "BotTech Innovations",
            type: "Gold",
            _id: "spons003",
            image: "https://example.com/images/bottech-innovations-logo.jpg"
        }
    ],
    eventWinList: [],
    createdAt: "2025-02-10T12:30:00Z",
    updatedAt: "2025-03-01T15:45:00Z",
    __v: 0,
    otherPlatformUrl: "https://techtix2025.robosoccer.com",
    eventPrize: 1000,
    brochureLink : "https://res.cloudinary.com/di4qqgdw2/image/upload/v1741878910/final_copy_RULE_BOOK_FOR_CAD_1_1_or7pgu.pdf",
    registrationLink:"https://unstop.com/p/cad-competition-x-espektro-25-techtix-kgec-kalyani-government-engineering-college-kgec-west-bengal-1428349"
  },
  {
    _id: "evt005",
    title: "Code Dictator",
    description: "A robotic soccer competition where teams design manual robots to compete in an arena designed for robotic soccer matches.",
    rules: "Each team must bring one robot. Only one participant controls the robot during a match. Robots cannot grab or withhold the ball. Judges' decisions are final.",
    prizes: "Total Prize Pool: ₹20,000 (subject to change based on participation).",
    tagLine: "Build. Compete. Dominate.",
    startTime: "2025-04-03T12:00:00Z",
    endTime: "2025-04-03T14:00:00Z",
    eventVenue: "MSB-109",
    eventImages: [
        {
            url: "https://res.cloudinary.com/dm1uflelj/image/upload/v1741809393/Code_Dictator_dap2y8.png",
            _id: "img003"
        }
    ],
    eventType: "Technical",
    eventMinParticipants: 1,
    eventMaxParticipants: 1,
    eventPrice: 0,
    eventPriceForKGEC: 125,
    eventOrganiserClub: {
        name: "KeyGEnCoders",
        image: "https://res.cloudinary.com/dm1uflelj/image/upload/v1741811698/kgen_coder_azan26.png"
    },
    eventCoordinators: [
        {
            name: "Ushasi Das",
            phone: "+91-9477724291",
            _id: "coord003"
        }
    ],
    createdBy: "admin124",
    sponsors: [
        {
            name: "BotTech Innovations",
            type: "Gold",
            _id: "spons003",
            image: "https://example.com/images/bottech-innovations-logo.jpg"
        }
    ],
    eventWinList: [],
    createdAt: "2025-02-10T12:30:00Z",
    updatedAt: "2025-03-01T15:45:00Z",
    __v: 0,
    otherPlatformUrl: "https://techtix2025.robosoccer.com",
    eventPrize: 5000,
    brochureLink : "https://res.cloudinary.com/di4qqgdw2/image/upload/v1741893923/Code_Dictator_1_sgh9x5.pdf",
    registrationLink:"https://practice.geeksforgeeks.org/contest/code-dictator"
  },
  {
    _id: "evt015",
    title: "Popsicle Bridge",
    description: "A robotic soccer competition where teams design manual robots to compete in an arena designed for robotic soccer matches.",
    rules: "Each team must bring one robot. Only one participant controls the robot during a match. Robots cannot grab or withhold the ball. Judges' decisions are final.",
    prizes: "Total Prize Pool: ₹20,000 (subject to change based on participation).",
    tagLine: "Build. Compete. Dominate.",
    startTime: "2025-03-24T10:00:00Z",
    endTime: "2025-03-24T12:00:00Z",
    eventVenue: "Admin Building",
    eventImages: [
        {
            url: "https://res.cloudinary.com/dlxpcyiin/image/upload/v1742333680/POPESTICAL_BRIGE_1_nhmqkf.png",
            _id: "img003"
        }
    ],
    eventType: "Technical",
    eventMinParticipants: 1,
    eventMaxParticipants: 1,
    eventPrice: 29,
    eventPriceForKGEC: 29,
    eventOrganiserClub: {
        name: "SAC KGEC",
      image: "https://res.cloudinary.com/dlxpcyiin/image/upload/v1741858988/sac_xmcqss.png"
    },
    eventCoordinators: [
        {
            name: "Surya Chatterjee",
            phone: "+91-6296262016",
            _id: "coord003"
        }
    ],
    createdBy: "admin124",
    sponsors: [
        {
            name: "BotTech Innovations",
            type: "Gold",
            _id: "spons003",
            image: "https://example.com/images/bottech-innovations-logo.jpg"
        }
    ],
    eventWinList: [],
    createdAt: "2025-02-10T12:30:00Z",
    updatedAt: "2025-03-01T15:45:00Z",
    __v: 0,
    otherPlatformUrl: "https://techtix2025.robosoccer.com",
    eventPrize: 2500,
    brochureLink : "https://res.cloudinary.com/di4qqgdw2/image/upload/v1741878434/FINAL_COPY_OF_POPSICLE_tsu1oa.pdf",
    registrationLink:"https://unstop.com/p/popsicle-bridge-techtix-kgec-kalyani-government-engineering-college-kgec-west-bengal-1429723"
  },
  {
    _id: "evt016",
    title: "The Glider Game",
    description: "A robotic soccer competition where teams design manual robots to compete in an arena designed for robotic soccer matches.",
    rules: "Each team must bring one robot. Only one participant controls the robot during a match. Robots cannot grab or withhold the ball. Judges' decisions are final.",
    prizes: "Total Prize Pool: ₹20,000 (subject to change based on participation).",
    tagLine: "Build. Compete. Dominate.",
    startTime: "2025-03-24T11:00:00Z",
    endTime: "2025-03-24T13:00:00Z",
    eventVenue: "Admin Building",
    eventImages: [
        {
            url: "https://res.cloudinary.com/di4qqgdw2/image/upload/v1741878654/glider_aeroplane_final_xlbx2t.png",
            _id: "img003"
        }
    ],
    eventType: "Technical",
    eventMinParticipants: 1,
    eventMaxParticipants: 1,
    eventPrice: 29,
    eventPriceForKGEC: 29,
    eventOrganiserClub: {
        name: "SAC KGEC",
      image: "https://res.cloudinary.com/dlxpcyiin/image/upload/v1741858988/sac_xmcqss.png"
    },
    eventCoordinators: [
        {
            name: "Udipta Maiti",
            phone: "+91-7908371070",
            _id: "coord003"
        }
    ],
    createdBy: "admin124",
    sponsors: [
        {
            name: "BotTech Innovations",
            type: "Gold",
            _id: "spons003",
            image: "https://example.com/images/bottech-innovations-logo.jpg"
        }
    ],
    eventWinList: [],
    createdAt: "2025-02-10T12:30:00Z",
    updatedAt: "2025-03-01T15:45:00Z",
    __v: 0,
    otherPlatformUrl: "https://techtix2025.robosoccer.com",
    eventPrize: 2500,
    brochureLink : "https://res.cloudinary.com/di4qqgdw2/image/upload/v1741882622/The_Glider_game_vmeph5.pdf",
    registrationLink:"https://unstop.com/p/the-glider-game-techtix-kgec-kalyani-government-engineering-college-kgec-west-bengal-1429146"
  },
  {
    _id: "evt020",
    title: "Speed-O-Cube",
    description: "A robotic soccer competition where teams design manual robots to compete in an arena designed for robotic soccer matches.",
    rules: "Each team must bring one robot. Only one participant controls the robot during a match. Robots cannot grab or withhold the ball. Judges' decisions are final.",
    prizes: "Total Prize Pool: ₹20,000 (subject to change based on participation).",
    tagLine: "Build. Compete. Dominate.",
    startTime: "2025-03-24T10:00:00Z",
    endTime: "2025-03-24T17:00:00Z",
    eventVenue: "Admin Building",
    eventImages: [
        {
            url: "https://res.cloudinary.com/di4qqgdw2/image/upload/v1741881665/Speedo_Cube_yvdza0.png",
            _id: "img003"
        }
    ],
    eventType: "Technical",
    eventMinParticipants: 1,
    eventMaxParticipants: 1,
    eventPrice: 0,
    eventPriceForKGEC: 0,
    eventOrganiserClub: {
        name: "Infinitio",
      image: "https://res.cloudinary.com/di4qqgdw2/image/upload/v1741881893/Infinitio_logo_c2sdys.png"
    },
    eventCoordinators: [
        {
            name: "Roudrajit Saha",
            phone: "+91-9874316701",
            _id: "coord003"
        }
    ],
    createdBy: "admin124",
    sponsors: [
        {
            name: "BotTech Innovations",
            type: "Gold",
            _id: "spons003",
            image: "https://example.com/images/bottech-innovations-logo.jpg"
        }
    ],
    eventWinList: [],
    createdAt: "2025-02-10T12:30:00Z",
    updatedAt: "2025-03-01T15:45:00Z",
    __v: 0,
    otherPlatformUrl: "https://techtix2025.robosoccer.com",
    eventPrize: 1500,
    brochureLink : "https://res.cloudinary.com/di4qqgdw2/image/upload/v1741881661/Speed-o-Cube_pyyfmi.pdf",
    registrationLink:"https://unstop.com/events/speed-o-cube-techtix-kgec-kalyani-government-engineering-college-kgec-west-bengal-1428580"
  },
  {
    _id: "evt002",
    title: "Robo Soccer ",
    description: "A robotic soccer competition where teams design manual robots to compete in an arena designed for robotic soccer matches.",
    rules: "Each team must bring one robot. Only one participant controls the robot during a match. Robots cannot grab or withhold the ball. Judges' decisions are final.",
    prizes: "Total Prize Pool: ₹20,000 (subject to change based on participation).",
    tagLine: "Build. Compete. Dominate.",
    startTime: "2025-03-25T10:00:00Z",
    endTime: "2025-03-25T14:00:00Z",
    eventVenue: "Admin Building",
    eventImages: [
        {
            url: "https://res.cloudinary.com/dm1uflelj/image/upload/v1741803077/robo_soccer_website_otvpdj.png",
            _id: "img003"
        }
    ],
    eventType: "Technical",
    eventMinParticipants: 1,
    eventMaxParticipants: 1,
    eventPrice: 250,
    eventPriceForKGEC: 125,
    eventOrganiserClub: {
       name: "Robotics Society KGEC",
      image: "https://res.cloudinary.com/dm1uflelj/image/upload/v1741806201/robotics_society_dipkma.png"
    },
    eventCoordinators: [
        {
            name: "Tanmay Debnath",
            phone: "+91-8207028444",
            _id: "coord003"
        },
        {
            name: "Susanta Singh",
            phone: "+91-7679792899",
            _id: "coord004"
        }
    ],
    createdBy: "admin124",
    sponsors: [
        {
            name: "BotTech Innovations",
            type: "Gold",
            _id: "spons003",
            image: "https://example.com/images/bottech-innovations-logo.jpg"
        }
    ],
    eventWinList: [],
    createdAt: "2025-02-10T12:30:00Z",
    updatedAt: "2025-03-01T15:45:00Z",
    __v: 0,
    otherPlatformUrl: "https://techtix2025.robosoccer.com",
    eventPrize: 20000,
    brochureLink : "https://res.cloudinary.com/dm1uflelj/image/upload/v1741802819/ROBO_SOCCER_TECHTIX1-1_yfag2v.pdf",
    registrationLink:"https://unstop.com/p/robo-soccer-techtix-kgec-kalyani-government-engineering-college-kgec-west-bengal-1428038"
},
{
  _id: "evt003",
  title: "Turbulence",
  description: "A bot race through a 20-meter maze filled with various obstacles like sand, water, wood, stone, and inclinations. The fastest and most efficient bot wins!",
  rules: "The bot can be wired or wireless and must not exceed 4 kg. Dimensions must be within 12 inches x 12 inches. Voltage between any two points must not exceed 24V. Ready-made logo kits are not allowed. Teams can have 1 to 5 members. Track has multiple checkpoints; completing each awards points. Negative points for hand touches and skips. Every bot topple incurs a penalty. Teams can repair bots during the competition. Judges' decisions are final.",
  prizes: "Total Prize Pool: ₹10,000 (subject to change based on participation).",
  tagLine: "Navigate. Conquer. Win.",
  startTime: "2025-03-25T10:00:00Z",
  endTime: "2025-03-25T16:00:00Z",
  eventVenue: "Admin Building",
  eventImages: [
      {
          url: "https://res.cloudinary.com/dm1uflelj/image/upload/v1741807860/tarbulance_website_gtf1fi.png",
          _id: "img004"
      }
  ],
  eventType: "Technical",
  eventMinParticipants: 1,
  eventMaxParticipants: 5,
  eventPrice: 150,
  eventPriceForKGEC: 75,
  eventOrganiserClub: {
      name: "Robotics Society KGEC",
      image: "https://res.cloudinary.com/dm1uflelj/image/upload/v1741806201/robotics_society_dipkma.png"
  },
  eventCoordinators: [
      {
          name: "Deep Rudra",
          phone: "+91-7063740034",
          _id: "coord004"
      },
      {
        name: "Anirban Roy",
        phone: "+91-6361286329",
        _id: "coord004"
    }
  ],
  createdBy: "admin125",
  sponsors: [
      {
          name: "InnovateBots",
          type: "Gold",
          _id: "spons004",
          image: "https://example.com/images/innovatebots-logo.jpg"
      }
  ],
  eventWinList: [],
  createdAt: "2025-02-15T12:30:00Z",
  updatedAt: "2025-03-05T15:45:00Z",
  __v: 0,
  otherPlatformUrl: "https://techtix2025.turbulence.com",
  eventPrize: 10000,
  brochureLink: "https://res.cloudinary.com/dm1uflelj/image/upload/v1741802818/TURBULENCE_TECHTIX1-1_hrcwog.pdf",
  registrationLink:"https://unstop.com/p/turbulence-techtix-kgec-kalyani-government-engineering-college-kgec-west-bengal-1428212"
},
{
  _id: "evt004",
  title: "WrestleMania",
  description: "A robotic combat competition where participants design and build bots to battle in a dynamic arena. The objective is to outmaneuver, topple, or disable the opponent’s bot using strategic moves and built-in mechanisms.",
  rules: "The bot can be wired or wireless and must not exceed 8 kg. Dimensions must be within 30cm x 40cm x 30cm (5% tolerance). Voltage between any two points must not exceed 24V. Ready-made logo kits are not allowed. IC engines are not permitted. Teams must use their own power supply. Bots may have weapons or moving parts, but must stay within the size limit. The arena consists of starting points, pits, and throw-away zones. If a bot fails to move, the opponent wins. Points are awarded for successful attacks. The team with the highest points at the end wins. Judges' decisions are final.",
  prizes: "Total Prize Pool: ₹35,000 (subject to change based on participation).",
  tagLine: "Battle. Dominate. Conquer.",
  startTime: "2025-04-03T10:00:00Z",
  endTime: "2025-04-03T14:00:00Z",
  eventVenue: "Admin Building",
  eventImages: [
      {
          url: "https://res.cloudinary.com/dm1uflelj/image/upload/v1741808162/WrestleMania_website_fjrjyu.png",
          _id: "img005"
      }
  ],
  eventType: "Technical",
  eventMinParticipants: 1,
  eventMaxParticipants: 5,
  eventPrice: 500,
  eventPriceForKGEC: 250,
  eventOrganiserClub: {
      name: "Robotics Society KGEC",
      image: "https://res.cloudinary.com/dm1uflelj/image/upload/v1741806201/robotics_society_dipkma.png"
  },
  eventCoordinators: [
      {
          name: "Anirban Mukherjee",
          phone: "+91-6291830010",
          _id: "coord005"
      },
      {
        name: "Debargya Panda",
        phone: "+91-9339387149",
        _id: "coord004"
    }
  ],
  createdBy: "admin126",
  sponsors: [
      {
          name: "BattleBots Inc.",
          type: "Platinum",
          _id: "spons005",
          image: "https://example.com/images/battlebots-logo.jpg"
      }
  ],
  eventWinList: [],
  createdAt: "2025-02-20T12:30:00Z",
  updatedAt: "2025-03-10T15:45:00Z",
  __v: 0,
  otherPlatformUrl: "https://techtix2025.wrestlemania.com",
  eventPrize: 35000,
  brochureLink: "https://res.cloudinary.com/dm1uflelj/image/upload/v1741802818/WRESTLEMANIA_TECHTIX-1_b64hh8.pdf",
  registrationLink:"https://unstop.com/p/wrestlemania-techtix-kgec-kalyani-government-engineering-college-kgec-west-bengal-1428238"
},
{ _id: "evt040",
    title: "Puzzlify",
    description: "A robotic combat competition where participants design and build bots to battle in a dynamic arena. The objective is to outmaneuver, topple, or disable the opponent’s bot using strategic moves and built-in mechanisms.",
    rules: "The bot can be wired or wireless and must not exceed 8 kg. Dimensions must be within 30cm x 40cm x 30cm (5% tolerance). Voltage between any two points must not exceed 24V. Ready-made logo kits are not allowed. IC engines are not permitted. Teams must use their own power supply. Bots may have weapons or moving parts, but must stay within the size limit. The arena consists of starting points, pits, and throw-away zones. If a bot fails to move, the opponent wins. Points are awarded for successful attacks. The team with the highest points at the end wins. Judges' decisions are final.",
    prizes: "Total Prize Pool: ₹35,000 (subject to change based on participation).",
    tagLine: "Battle. Dominate. Conquer.",
    startTime: "2025-03-25T13:00:00Z",
    endTime: "2025-03-25T16:00:00Z",
    eventVenue: "MSB Lab",
  eventImages: [
      {
          url: "https://res.cloudinary.com/dm1uflelj/image/upload/v1741809393/PUZZLIFY_WEB_dn0eat.png",
          _id: "img003"
      }
  ],
  eventType: "Technical",
  eventMinParticipants: 1,
  eventMaxParticipants: 1,
  eventPrice: 0,
  eventPriceForKGEC: 125,
  eventOrganiserClub: {
      name: "KeyGEnCoders",
      image: "https://res.cloudinary.com/dm1uflelj/image/upload/v1741811698/kgen_coder_azan26.png"
  },
  eventCoordinators: [
      {
          name: "Abhibrata Nandy",
          phone: "+91-6297900464",
          _id: "coord003"
      }
  ],
  createdBy: "admin124",
  sponsors: [
      {
          name: "BotTech Innovations",
          type: "Gold",
          _id: "spons003",
          image: "https://example.com/images/bottech-innovations-logo.jpg"
      }
  ],
  eventWinList: [],
  createdAt: "2025-02-10T12:30:00Z",
  updatedAt: "2025-03-01T15:45:00Z",
  __v: 0,
  otherPlatformUrl: "https://techtix2025.robosoccer.com",
  eventPrize: 6000,
  brochureLink : "https://res.cloudinary.com/di4qqgdw2/image/upload/v1741895189/Puzzlify.docx_sidmuv.pdf",
  registrationLink:"https://unstop.com/quiz/puzzlify-x-espektro25-kgec-techtix-kgec-kalyani-government-engineering-college-kgec-west-bengal-1428383"
},
{
  _id: "evt021",
  title: "Gridlock",
  description: "A robotic soccer competition where teams design manual robots to compete in an arena designed for robotic soccer matches.",
  rules: "Each team must bring one robot. Only one participant controls the robot during a match. Robots cannot grab or withhold the ball. Judges' decisions are final.",
  prizes: "Total Prize Pool: ₹20,000 (subject to change based on participation).",
  tagLine: "Build. Compete. Dominate.",
  startTime: "2025-03-25T12:00:00Z",
  endTime: "2025-03-25T13:00:00Z",
  eventVenue: "Admin Building",
  eventImages: [
      {
          url: "https://res.cloudinary.com/di4qqgdw2/image/upload/v1741881659/Grid_Lock_icf7tl.png",
          _id: "img003"
      }
  ],
  eventType: "Technical",
  eventMinParticipants: 1,
  eventMaxParticipants: 1,
  eventPrice: 0,
  eventPriceForKGEC: 0,
  eventOrganiserClub: {
      name: "Infinitio",
      image: "https://res.cloudinary.com/di4qqgdw2/image/upload/v1741881893/Infinitio_logo_c2sdys.png"
  },
  eventCoordinators: [
      {
          name: "Md Sajid Ansari",
          phone: "+91-8777328668",
          _id: "coord003"
      }
  ],
  createdBy: "admin124",
  sponsors: [
      {
          name: "BotTech Innovations",
          type: "Gold",
          _id: "spons003",
          image: "https://example.com/images/bottech-innovations-logo.jpg"
      }
  ],
  eventWinList: [],
  createdAt: "2025-02-10T12:30:00Z",
  updatedAt: "2025-03-01T15:45:00Z",
  __v: 0,
  otherPlatformUrl: "https://techtix2025.robosoccer.com",
  eventPrize: 1500,
  brochureLink : "https://res.cloudinary.com/di4qqgdw2/image/upload/v1741881657/gridlock_oiudcq.pdf",
  registrationLink:"https://unstop.com/competitions/gridlock-techtix-kgec-kalyani-government-engineering-college-kgec-west-bengal-1428560"
},
{
  _id: "evt022",
  title: "Two Shades of Gray",
  description: "A robotic soccer competition where teams design manual robots to compete in an arena designed for robotic soccer matches.",
  rules: "Each team must bring one robot. Only one participant controls the robot during a match. Robots cannot grab or withhold the ball. Judges' decisions are final.",
  prizes: "Total Prize Pool: ₹20,000 (subject to change based on participation).",
  tagLine: "Build. Compete. Dominate.",
  startTime: "2025-03-25T10:00:00Z",
  endTime: "2025-03-25T12:00:00Z",
  eventVenue: "Admin Building",
  eventImages: [
      {
          url: "https://res.cloudinary.com/di4qqgdw2/image/upload/v1741881662/2_shades_of_gray_x9hzeg.png",
          _id: "img003"
      }
  ],
  eventType: "Technical",
  eventMinParticipants: 1,
  eventMaxParticipants: 1,
  eventPrice: 0,
  eventPriceForKGEC: 0,
  eventOrganiserClub: {
      name: "Infinitio",
      image: "https://res.cloudinary.com/di4qqgdw2/image/upload/v1741881893/Infinitio_logo_c2sdys.png"
  },
  eventCoordinators: [
      {
          name: "Arpan Pal",
          phone: "+91-9679716852",
          _id: "coord003"
      }
  ],
  createdBy: "admin124",
  sponsors: [
      {
          name: "BotTech Innovations",
          type: "Gold",
          _id: "spons003",
          image: "https://example.com/images/bottech-innovations-logo.jpg"
      }
  ],
  eventWinList: [],
  createdAt: "2025-02-10T12:30:00Z",
  updatedAt: "2025-03-01T15:45:00Z",
  __v: 0,
  otherPlatformUrl: "https://techtix2025.robosoccer.com",
  eventPrize: 1500,
  brochureLink : "https://res.cloudinary.com/di4qqgdw2/image/upload/v1741881662/Two_Shades_of_Gray_d7ygjf.pdf",
  registrationLink:"https://unstop.com/competitions/two-shades-of-gray-x-espektro25-techtix-kgec-kalyani-government-engineering-college-kgec-west-bengal-1428395"
},
{
  _id: "evt008",
  title: "Code The Canvas",
  description: "A robotic soccer competition where teams design manual robots to compete in an arena designed for robotic soccer matches.",
  rules: "Each team must bring one robot. Only one participant controls the robot during a match. Robots cannot grab or withhold the ball. Judges' decisions are final.",
  prizes: "Total Prize Pool: ₹20,000 (subject to change based on participation).",
  tagLine: "Build. Compete. Dominate.",
  startTime: "2025-04-04T11:00:00Z",
  endTime: "2025-04-04T13:00:00Z",
  eventVenue: "MSB-109",
  eventImages: [
      {
          url: "https://res.cloudinary.com/dm1uflelj/image/upload/v1741809393/code_the_canvas_vy0rxt.png",
          _id: "img003"
      }
  ],
  eventType: "Technical",
  eventMinParticipants: 1,
  eventMaxParticipants: 1,
  eventPrice: 0,
  eventPriceForKGEC: 125,
  eventOrganiserClub: {
      name: "KeyGEnCoders",
      image: "https://res.cloudinary.com/dm1uflelj/image/upload/v1741811698/kgen_coder_azan26.png"
  },
  eventCoordinators: [
      {
          name: "Sk Md Tousif",
          phone: "+91-7908319931",
          _id: "coord003"
      }
  ],
  createdBy: "admin124",
  sponsors: [
      {
          name: "BotTech Innovations",
          type: "Gold",
          _id: "spons003",
          image: "https://example.com/images/bottech-innovations-logo.jpg"
      }
  ],
  eventWinList: [],
  createdAt: "2025-02-10T12:30:00Z",
  updatedAt: "2025-03-01T15:45:00Z",
  __v: 0,
  otherPlatformUrl: "https://techtix2025.robosoccer.com",
  eventPrize: 6000,
  brochureLink : "https://res.cloudinary.com/di4qqgdw2/image/upload/v1741884047/Code_The_Canvas_iba1ql.pdf",
  registrationLink:"https://practice.geeksforgeeks.org/contest/code-the-canvas"
},
{
  _id: "evt005",
  title: "Code Buzz",
  description: "A robotic soccer competition where teams design manual robots to compete in an arena designed for robotic soccer matches.",
  rules: "Each team must bring one robot. Only one participant controls the robot during a match. Robots cannot grab or withhold the ball. Judges' decisions are final.",
  prizes: "Total Prize Pool: ₹20,000 (subject to change based on participation).",
  tagLine: "Build. Compete. Dominate.",
  startTime: "2025-03-24T11:00:00Z",
  endTime: "2025-03-24T12:00:00Z",
  eventVenue: "MSB-109",
  eventImages: [
      {
          url: "https://res.cloudinary.com/dm1uflelj/image/upload/v1741809393/Code_Buzz_b0wqgq.png",
          _id: "img003"
      }
  ],
  eventType: "Technical",
  eventMinParticipants: 1,
  eventMaxParticipants: 1,
  eventPrice: 0,
  eventPriceForKGEC: 125,
  eventOrganiserClub: {
      name: "KeyGEnCoders",
      image: "https://res.cloudinary.com/dm1uflelj/image/upload/v1741811698/kgen_coder_azan26.png"
  },
  eventCoordinators: [
      {
          name: "Arpan Pal",
          phone: "+91-9679716852",
          _id: "coord003"
      }
  ],
  createdBy: "admin124",
  sponsors: [
      {
          name: "BotTech Innovations",
          type: "Gold",
          _id: "spons003",
          image: "https://example.com/images/bottech-innovations-logo.jpg"
      }
  ],
  eventWinList: [],
  createdAt: "2025-02-10T12:30:00Z",
  updatedAt: "2025-03-01T15:45:00Z",
  __v: 0,
  otherPlatformUrl: "https://techtix2025.robosoccer.com",
  eventPrize: 5000,
  brochureLink : "https://res.cloudinary.com/di4qqgdw2/image/upload/v1741884046/Code-buzz_Rule-book_b8spjy.pdf",
  registrationLink:"https://unstop.com/p/code-buzz-x-espektro25-kgec-techtix-kgec-kalyani-government-engineering-college-kgec-west-bengal-1428469"
},
{
  _id: "evt010",
  title: "Water Rocket ",
  description: "A robotic soccer competition where teams design manual robots to compete in an arena designed for robotic soccer matches.",
  rules: "Each team must bring one robot. Only one participant controls the robot during a match. Robots cannot grab or withhold the ball. Judges' decisions are final.",
  prizes: "Total Prize Pool: ₹20,000 (subject to change based on participation).",
  tagLine: "Build. Compete. Dominate.",
  startTime: "2025-03-26T10:00:00Z",
  endTime: "2025-03-26T12:00:00Z",
  eventVenue: "Admin Building",
  eventImages: [
      {
          url: "https://res.cloudinary.com/di4qqgdw2/image/upload/v1741878654/Water_Rocket_chao3m.png",
          _id: "img003"
      }
  ],
  eventType: "Technical",
  eventMinParticipants: 1,
  eventMaxParticipants: 1,
  eventPrice: 39,
  eventPriceForKGEC: 39,
  eventOrganiserClub: {
      name: "SAC KGEC",
      image: "https://res.cloudinary.com/dlxpcyiin/image/upload/v1741858988/sac_xmcqss.png"
  },
  eventCoordinators: [
      {
          name: "Manisha Gupta",
          phone: "+91-9679050270",
          _id: "coord003"
      }
  ],
  createdBy: "admin124",
  sponsors: [
      {
          name: "BotTech Innovations",
          type: "Gold",
          _id: "spons003",
          image: "https://example.com/images/bottech-innovations-logo.jpg"
      }
  ],
  eventWinList: [],
  createdAt: "2025-02-10T12:30:00Z",
  updatedAt: "2025-03-01T15:45:00Z",
  __v: 0,
  otherPlatformUrl: "https://techtix2025.robosoccer.com",
  eventPrize: 1500,
  brochureLink : "https://res.cloudinary.com/di4qqgdw2/image/upload/v1741878545/FINAL_COPY_Rule_Book_for_Water_Rocket_2025_c5mcbk.pdf",
  registrationLink:"https://unstop.com/p/water-rocket-techtix-kgec-kalyani-government-engineering-college-kgec-west-bengal-1429684"
},
{
  _id: "evt020",
  title: "Goblet of Spark",
  description: "A robotic soccer competition where teams design manual robots to compete in an arena designed for robotic soccer matches.",
  rules: "Each team must bring one robot. Only one participant controls the robot during a match. Robots cannot grab or withhold the ball. Judges' decisions are final.",
  prizes: "Total Prize Pool: ₹20,000 (subject to change based on participation).",
  tagLine: "Build. Compete. Dominate.",
  startTime: "2025-03-26T10:00:00Z",
  endTime: "2025-03-26T16:00:00Z",
  eventVenue: "JCB",
  eventImages: [
      {
          url: "https://res.cloudinary.com/dezguraul/image/upload/v1741930368/welding_workshop_e6xguy.png",
          _id: "img003"
      }
  ],
  eventType: "Technical",
  eventMinParticipants: 1,
  eventMaxParticipants: 1,
  eventPrice: 49,
  eventPriceForKGEC: 49,
  eventOrganiserClub: {
      name: "SAC KGEC",
      image: "https://res.cloudinary.com/dlxpcyiin/image/upload/v1741858988/sac_xmcqss.png"
  },
  eventCoordinators: [
      {
          name: "Iman Naskar",
          phone: "+91-8100133752",
          _id: "coord003"
      }
  ],
  createdBy: "admin124",
  sponsors: [
      {
          name: "BotTech Innovations",
          type: "Gold",
          _id: "spons003",
          image: "https://example.com/images/bottech-innovations-logo.jpg"
      }
  ],
  eventWinList: [],
  createdAt: "2025-02-10T12:30:00Z",
  updatedAt: "2025-03-01T15:45:00Z",
  __v: 0,
  otherPlatformUrl: "https://techtix2025.robosoccer.com",
  eventPrize: 3000,
  brochureLink : "https://res.cloudinary.com/di4qqgdw2/image/upload/v1741878549/FINAL_COPY_Rule_Book_for_SMAW_Welding_Competetion_a2e7s9.pdf",
  registrationLink:"https://unstop.com/p/goblet-of-sparks-techtix-kgec-kalyani-government-engineering-college-kgec-west-bengal-1429747"
},
{
  _id: "evt023",
  title: "Mathematicos",
  description: "A robotic soccer competition where teams design manual robots to compete in an arena designed for robotic soccer matches.",
  rules: "Each team must bring one robot. Only one participant controls the robot during a match. Robots cannot grab or withhold the ball. Judges' decisions are final.",
  prizes: "Total Prize Pool: ₹20,000 (subject to change based on participation).",
  tagLine: "Build. Compete. Dominate.",
  startTime: "2025-03-26T13:00:00Z",
  endTime: "2025-03-26T16:00:00Z",
  eventVenue: "Admin Building",
  eventImages: [
      {
          url: "https://res.cloudinary.com/di4qqgdw2/image/upload/v1741895127/MATHEMATICOS_to08yh.png",
          _id: "img003"
      }
  ],
  eventType: "Technical",
  eventMinParticipants: 1,
  eventMaxParticipants: 1,
  eventPrice: 0,
  eventPriceForKGEC: 0,
  eventOrganiserClub: {
      name: "Infinitio",
      image: "https://res.cloudinary.com/di4qqgdw2/image/upload/v1741881893/Infinitio_logo_c2sdys.png"
  },
  eventCoordinators: [
      {
          name: "Waki Hasmi",
          phone: "+91-7811014696",
          _id: "coord003"
      }
  ],
  createdBy: "admin124",
  sponsors: [
      {
          name: "BotTech Innovations",
          type: "Gold",
          _id: "spons003",
          image: "https://example.com/images/bottech-innovations-logo.jpg"
      }
  ],
  eventWinList: [],
  createdAt: "2025-02-10T12:30:00Z",
  updatedAt: "2025-03-01T15:45:00Z",
  __v: 0,
  otherPlatformUrl: "https://techtix2025.robosoccer.com",
  eventPrize: 1500,
  brochureLink : "https://res.cloudinary.com/di4qqgdw2/image/upload/v1741881662/Mathematicos_a8ukpr.pdf",
  registrationLink:"https://unstop.com/quiz/mathematicos-x-espektro25-kgec-techtix-kgec-kalyani-government-engineering-college-kgec-west-bengal-1428361"
},
{
    _id: "evt029",
    title: "U-25 General Quiz Competition",
    description: "A robotic soccer competition where teams design manual robots to compete in an arena designed for robotic soccer matches.",
    rules: "Each team must bring one robot. Only one participant controls the robot during a match. Robots cannot grab or withhold the ball. Judges' decisions are final.",
    prizes: "Total Prize Pool: ₹20,000 (subject to change based on participation).",
    tagLine: "Build. Compete. Dominate.",
    startTime: "2025-03-24T14:00:00Z",
    endTime: "2025-03-24T16:00:00Z",
    eventVenue: "MSB Seminar Hall",
    eventImages: [
        {
            url: "https://res.cloudinary.com/dlxpcyiin/image/upload/v1742398397/WhatsApp_Image_2025-03-19_at_16.42.59_7b07b960_rblthe.jpg",
            _id: "img003"
        }
    ],
    eventType: "Technical",
    eventMinParticipants: 1,
    eventMaxParticipants: 1,
    eventPrice: 0,
    eventPriceForKGEC: 0,
    eventOrganiserClub: {
        name: "Les Quizerables",
        image: "https://res.cloudinary.com/dlxpcyiin/image/upload/v1742398486/less_qizarable_gpy4u0.png"
    },
    eventCoordinators: [
        {
            name: "Swayamprabha Banerjee",
            phone: "8370861237",
            _id: "coord003"
        },
        {
            name: "Souhardya Patra",
            phone: "7439621501",
            _id: "coord003"
        }
    ],
    createdBy: "admin124",
    sponsors: [
        {
            name: "BotTech Innovations",
            type: "Gold",
            _id: "spons003",
            image: "https://example.com/images/bottech-innovations-logo.jpg"
        }
    ],
    eventWinList: [],
    createdAt: "2025-02-10T12:30:00Z",
    updatedAt: "2025-03-01T15:45:00Z",
    __v: 0,
    otherPlatformUrl: "https://techtix2025.robosoccer.com",
    eventPrize: 6000,
    brochureLink : "https://res.cloudinary.com/dlxpcyiin/image/upload/v1742404915/INQUIZZMANIA_nvlp0t.pdf",
    registrationLink:"https://docs.google.com/forms/d/e/1FAIpQLSfzeItAZA2FI8BsXbSQ8cGEuaIVH5i3XtSnTyreZ_CQZ7rDHg/viewform?usp=header"
  },
];

// Process the raw data to add the required id field
export const demoEventData: EventData[] = processEvents(rawEventData);

export const demoEventProps: EventProps[] = [
  {
    poster: "https://example.com/images/hackathon2025-poster.jpg",
    title: "Hackathon 2025",
    description: "A 24-hour coding marathon where participants build innovative solutions to real-world problems.",
    organisingClub: "CodeCraft",
    rules: [
      "Teams of 3-5 members",
      "All code must be written during the event",
      "Use of open-source libraries is permitted"
    ],
    entryFee: "₹500 (₹250 for KGEC students)",
    coordinator: "Priya Sharma: +91-9876543210",
    venue: "Main Auditorium",
    // prize: "First Place: ₹50,000, Second Place: ₹25,000, Third Place: ₹10,000",
    date: new Date("2025-03-15"),
    time: new Date("2025-03-15T09:00:00Z")
  },
  {
    poster: "https://example.com/images/robotics-challenge-banner.jpg",
    title: "Robotics Challenge",
    description: "Design and build robots to navigate through challenging obstacles and complete specific tasks.",
    organisingClub: "RoboGeeks",
    rules: [
      "Each team must bring their own robot",
      "Remote controlled and autonomous robots allowed",
      "No dangerous materials"
    ],
    entryFee: "₹400 (₹200 for KGEC students)",
    coordinator: "Arjun Mehta: +91-7654321098",
    venue: "Robotics Lab",
    // prize: "First Place: ₹30,000, Second Place: ₹15,000",
    date: new Date("2025-03-16"),
    time: new Date("2025-03-16T10:00:00Z")
  },


  {
    poster: "https://example.com/images/cultural-night-banner.jpg",
    title: "Cultural Night",
    description: "A celebration of diverse cultural performances including dance, music, and theatrical presentations.",
    organisingClub: "ArtsUnited",
    rules: [
      "Each performance must be between 5-15 minutes",
      "Appropriate content only"
    ],
    entryFee: "₹200 (₹100 for KGEC students)",
    coordinator: "Neha Gupta: +91-8901234567",
    venue: "Open Air Theatre",
    // prize: "Best Performance: ₹20,000, People's Choice: ₹10,000",
    date: new Date("2025-03-15"),
    time: new Date("2025-03-15T18:00:00Z")
  },
  {
    poster: "https://example.com/images/robo-soccer-banner.jpg",
    title: "Robo Soccer",
    description: "A thrilling soccer match between robots designed and controlled by participants.",
    organisingClub: "KGEC Robotics Society",
    rules: [
      "Each team must bring their own robot",
      "No dangerous materials"
    ],
    entryFee: "₹250 (₹125 for KGEC students)",
    coordinator: "Tanmay Debnath: +91-8207028444",
    venue: "KGEC Robotics Lab",
    // prize: "First Place: ₹20,000",
    date: new Date("2025-03-25"),
    time: new Date("2025-03-25T10:00:00Z")
  },



  {
    poster: "https://example.com/images/turbulence-banner.jpg",
    title: "Turbulence",
    description: "A competition to design and fly the most efficient paper airplanes.",
    organisingClub: "Aerodynamics Club",
    rules: [
      "Each participant must bring their own paper",
      "No dangerous materials"
    ],
    entryFee: "₹150 (₹75 for KGEC students)",
    coordinator: "Deep Rudra: +91-7063740034",
    venue: "KGEC Open Ground",
    // prize: "First Place: ₹10,000",
    date: new Date("2025-03-25"),
    time: new Date("2025-03-25T14:00:00Z")
  },
  {
    poster: "https://example.com/images/wrestlemania-banner.jpg",
    title: "WrestleMania",
    description: "A wrestling competition to showcase strength and strategy.",
    organisingClub: "Sports Club",
    rules: [
      "Participants must follow standard wrestling rules",
      "No dangerous moves"
    ],
    entryFee: "₹500 (₹250 for KGEC students)",
    coordinator: "Anirban Mukherjee: +91-6291830010",
    venue: "KGEC Sports Complex",
    // prize: "First Place: ₹35,000",
    date: new Date("2025-03-26"),
    time: new Date("2025-03-26T10:00:00Z")
  }
];

export const demoEventDayProps: EventDayProps[] = [
  {
    day: 1,
    events: [demoEventData[0], demoEventData[2]]
  },
  {
    day: 2,
    events: [demoEventData[1]]
  }
];

export const demoEventSectionProps: EventSectionProps[] = [
  {
    label: "Technical Events",
    description: "Showcase your technical skills and innovation through these challenging competitions.",
    days: [
      {
        day: 1,
        events: [demoEventData[0]]
      },
      {
        day: 2,
        events: [demoEventData[1]]
      }
    ]
  },
  {
    label: "Cultural Events",
    description: "Express yourself through various art forms and celebrate diversity.",
    days: [
      {
        day: 1,
        events: [demoEventData[2]]
      }
    ]
  }
];