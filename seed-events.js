const BASE_URL = 'http://localhost:4000';

const seedEvents = [
  // ─── TECHNOLOGY ───────────────────────────────────────────────────────────
  {
    title: 'Lagos AI & Machine Learning Summit 2026',
    summary: "Nigeria's premier gathering for AI researchers, engineers, and builders shaping the future of intelligent systems in Africa.",
    description: 'Join 800+ professionals for two days of deep technical talks, hands-on workshops, and live demos showcasing the latest in LLMs, computer vision, autonomous systems, and responsible AI. Speakers fly in from Google DeepMind, Hugging Face, and leading African startups. Networking dinner on Day 1 included.',
    organizer: 'AI Nigeria Foundation',
    eventType: 'Conference',
    category: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
    date: '2026-05-15T09:00:00Z',
    endDate: '2026-05-16T18:00:00Z',
    venueAddress: 'Eko Convention Centre, Victoria Island, Lagos',
    locationType: 'venue',
    latitude: 6.4281,
    longitude: 3.4219,
    capacity: 800,
    agenda: [
      { title: 'Registration & Networking Breakfast', startTime: '08:00 AM', endTime: '09:00 AM', host: 'Event Team', description: 'Check in, grab coffee, meet fellow attendees' },
      { title: 'Opening Keynote: The State of AI in Africa', startTime: '09:00 AM', endTime: '10:30 AM', host: 'Dr. Amina Suleiman', description: 'A sweeping overview of where African AI stands globally' },
      { title: 'Panel: Building Responsible AI for Emerging Markets', startTime: '11:00 AM', endTime: '12:30 PM', host: 'Multiple Speakers', description: 'Ethics, bias, and what responsible AI looks like on the ground' },
      { title: 'Workshop: Fine-Tuning LLMs on Low-Resource Languages', startTime: '02:00 PM', endTime: '04:00 PM', host: 'Emeka Okafor, Hugging Face', description: 'Hands-on session — bring your laptop' },
    ],
    tickets: [
      { name: 'Early Bird', price: '15000', quantity: '200', isFree: false },
      { name: 'Standard', price: '25000', quantity: '400', isFree: false },
      { name: 'VIP (includes dinner)', price: '50000', quantity: '100', isFree: false },
    ],
  },

  {
    title: 'Web3 Builders Weekend — Abuja',
    summary: 'A 48-hour hackathon for developers building on-chain applications on Ethereum, Solana, and Starknet.',
    description: 'Come with your ideas, leave with a deployed dApp. Solo hackers and teams of up to 4 welcome. Mentors available throughout. ₦5M in prizes across 5 tracks: DeFi, NFTs, Gaming, Public Goods, and Open Innovation. Meals and accommodation provided.',
    organizer: 'Decentralize Africa',
    eventType: 'Hackathon',
    category: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=800&q=80',
    date: '2026-04-25T18:00:00Z',
    endDate: '2026-04-27T14:00:00Z',
    venueAddress: 'Transcorp Hilton, Maitama, Abuja',
    locationType: 'venue',
    latitude: 9.0765,
    longitude: 7.3986,
    capacity: 300,
    agenda: [
      { title: 'Check-in & Team Formation', startTime: '06:00 PM', endTime: '08:00 PM', host: 'Organizers', description: 'Meet other hackers, form teams if needed' },
      { title: 'Hackathon Kickoff', startTime: '08:00 PM', endTime: '09:00 PM', host: 'Chisom Eze', description: 'Rules, tracks, and prizes explained' },
      { title: 'Demo Day & Judging', startTime: '12:00 PM', endTime: '02:00 PM', host: 'Judges Panel', description: '5 minutes per team, Q&A included' },
    ],
    tickets: [
      { name: 'Hacker Pass', price: '5000', quantity: '300', isFree: false },
    ],
  },

  {
    title: 'Product Design Bootcamp — UX for African Users',
    summary: 'A 3-day intensive workshop on designing products that resonate with Nigerian and pan-African users.',
    description: 'Stop copying Silicon Valley patterns blindly. This bootcamp teaches you to research, wireframe, prototype, and test with real users from Lagos to Nairobi. Taught by senior designers from Flutterwave, Paystack, and Andela. Certificate provided on completion. Limited to 40 participants.',
    organizer: 'Design School NG',
    eventType: 'Workshop',
    category: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&q=80',
    date: '2026-06-02T09:00:00Z',
    endDate: '2026-06-04T17:00:00Z',
    venueAddress: 'Co-Creation Hub, Yaba, Lagos',
    locationType: 'venue',
    latitude: 6.5028,
    longitude: 3.3714,
    capacity: 40,
    agenda: [
      { title: 'Day 1: Research Methods for African Contexts', startTime: '09:00 AM', endTime: '05:00 PM', host: 'Fatima Yusuf', description: 'Interviews, guerrilla testing, cultural nuance' },
      { title: 'Day 2: Prototyping & Systems', startTime: '09:00 AM', endTime: '05:00 PM', host: 'David Osei', description: 'Figma deep dive, design systems, component libraries' },
      { title: 'Day 3: User Testing & Portfolio Review', startTime: '09:00 AM', endTime: '05:00 PM', host: 'Both instructors', description: 'Live testing sessions and individual portfolio critique' },
    ],
    tickets: [
      { name: 'Bootcamp Seat', price: '75000', quantity: '40', isFree: false },
    ],
  },

  {
    title: 'Open Source Saturday — Build Together',
    summary: 'Monthly casual meetup for developers who want to contribute to open source projects together. Laptops required. Coffee provided.',
    description: 'Every first Saturday of the month, developers gather to make open source contributions together. Whether you are a first-time contributor or a seasoned maintainer, this is a low-pressure environment to learn, collaborate, and ship.',
    organizer: 'OpenSource Nigeria',
    eventType: 'Meetup',
    category: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80',
    date: '2026-05-02T10:00:00Z',
    endDate: '2026-05-02T16:00:00Z',
    venueAddress: 'Andela Lagos, Ikeja GRA',
    locationType: 'venue',
    latitude: 6.5833,
    longitude: 3.3500,
    capacity: 80,
    agenda: [
      { title: 'Welcome & Project Intros', startTime: '10:00 AM', endTime: '10:30 AM', host: 'Hosts', description: 'Project maintainers pitch what they are working on' },
      { title: 'Contribution Sprint', startTime: '10:30 AM', endTime: '02:00 PM', host: 'Everyone', description: 'Pick a project and build' },
      { title: 'Show & Tell', startTime: '02:00 PM', endTime: '03:00 PM', host: 'All', description: 'Show what you contributed today' },
    ],
    tickets: [
      { name: 'Free Entry', price: '0', quantity: '80', isFree: true },
    ],
  },

  {
    title: 'Next.js 15 Deep Dive — Live Coding Session',
    summary: 'A 3-hour live stream building a full-stack app from scratch with Next.js 15, React Server Components, and Prisma.',
    description: 'Join senior engineer Kayode Adebayo as he builds a production-grade multi-tenant SaaS in 3 hours live. All code on GitHub. Recording available for 30 days.',
    organizer: 'DevPulse Africa',
    eventType: 'Webinar',
    category: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80',
    date: '2026-05-12T19:00:00Z',
    endDate: '2026-05-12T22:00:00Z',
    locationType: 'online',
    meetingLink: 'https://youtube.com/live/devpulse-nextjs',
    capacity: 5000,
    agenda: [
      { title: 'Project Setup & Architecture', startTime: '07:00 PM', endTime: '07:45 PM', host: 'Kayode Adebayo', description: '' },
      { title: 'Server Components & Data Fetching', startTime: '07:45 PM', endTime: '08:45 PM', host: 'Kayode Adebayo', description: '' },
      { title: 'Auth, Billing & Deployment', startTime: '08:45 PM', endTime: '10:00 PM', host: 'Kayode Adebayo', description: 'With live Q&A throughout' },
    ],
    tickets: [
      { name: 'Free Entry', price: '0', quantity: '5000', isFree: true },
    ],
  },

  // ─── MUSIC ────────────────────────────────────────────────────────────────
  {
    title: 'Afrobeats Unplugged — An Intimate Evening',
    summary: 'An acoustic reimagining of Afrobeats classics in a 150-person seated venue. No standing, just vibes.',
    description: 'Picture string arrangements, talking drums, and your favourite Afrobeats melodies stripped back to their beautiful core. Featuring five artists performing sets you have never heard before. Full bar and small chops available.',
    organizer: 'Sound & Soul Events',
    eventType: 'Concert',
    category: 'Music',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
    date: '2026-04-19T20:00:00Z',
    endDate: '2026-04-19T23:30:00Z',
    venueAddress: 'Terra Kulture, Victoria Island, Lagos',
    locationType: 'venue',
    latitude: 6.4286,
    longitude: 3.4093,
    capacity: 150,
    agenda: [
      { title: 'Doors Open & Drinks', startTime: '07:30 PM', endTime: '08:00 PM', host: 'Bar Staff', description: 'Settle in, grab a drink' },
      { title: 'Opening Set', startTime: '08:00 PM', endTime: '08:45 PM', host: 'Timi Adewale', description: 'Acoustic guitar and original compositions' },
      { title: 'Headline Performance', startTime: '09:15 PM', endTime: '11:00 PM', host: 'Adanna & The Collective', description: 'Reimagined Afrobeats with live band' },
    ],
    tickets: [
      { name: 'General Seated', price: '20000', quantity: '100', isFree: false },
      { name: 'Front Row', price: '40000', quantity: '30', isFree: false },
      { name: 'VIP Table (4 seats)', price: '120000', quantity: '5', isFree: false },
    ],
  },

  {
    title: 'Drum Circle & Percussion Masterclass',
    summary: 'Learn the language of West African percussion from master drummers. Open to all skill levels.',
    description: 'Three hours of hands-on drumming led by master percussionists from the Yoruba, Igbo, and Hausa traditions. Drums provided. Limited to 30 participants.',
    organizer: 'Rhythms of Nigeria',
    eventType: 'Workshop',
    category: 'Music',
    imageUrl: 'https://images.unsplash.com/photo-1524650359799-842906ca1c06?w=800&q=80',
    date: '2026-05-03T14:00:00Z',
    endDate: '2026-05-03T17:00:00Z',
    venueAddress: 'National Theatre, Iganmu, Lagos',
    locationType: 'venue',
    latitude: 6.4667,
    longitude: 3.3667,
    capacity: 30,
    agenda: [
      { title: 'Welcome & Instrument Intro', startTime: '02:00 PM', endTime: '02:30 PM', host: 'Chief Balogun', description: 'History and cultural context of each drum type' },
      { title: 'Foundation Rhythms', startTime: '02:30 PM', endTime: '03:30 PM', host: 'All instructors', description: 'Core patterns from three traditions' },
      { title: 'Open Circle Jam', startTime: '04:30 PM', endTime: '05:00 PM', host: 'Everyone', description: 'Free-play session' },
    ],
    tickets: [
      { name: 'Participant', price: '12000', quantity: '30', isFree: false },
    ],
  },

  // ─── BUSINESS ─────────────────────────────────────────────────────────────
  {
    title: 'Raise Your First ₦10M — Startup Fundraising Masterclass',
    summary: 'Real talk from founders who have raised pre-seed rounds in Nigeria. No fluff, no theory — just what actually works.',
    description: 'Six founders share exactly how they closed their first checks. Plus a live Q&A and optional pitch clinic in the afternoon session.',
    organizer: 'Ventures Platform',
    eventType: 'Masterclass',
    category: 'Business',
    imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80',
    date: '2026-05-08T10:00:00Z',
    endDate: '2026-05-08T16:00:00Z',
    venueAddress: 'Ventures Platform HQ, Plot 14 Kaf-elewa Road, Abuja',
    locationType: 'venue',
    latitude: 9.0579,
    longitude: 7.4951,
    capacity: 120,
    agenda: [
      { title: 'Panel 1: From Idea to First Check', startTime: '10:00 AM', endTime: '11:30 AM', host: '3 Founders', description: 'How they validated and got in the room' },
      { title: 'Panel 2: The Pitch & The Term Sheet', startTime: '12:00 PM', endTime: '01:30 PM', host: '3 More Founders', description: 'Actual pitch breakdowns' },
      { title: 'Pitch Clinic (Optional)', startTime: '02:30 PM', endTime: '04:00 PM', host: 'All Speakers', description: 'Submit your deck — 10 founders get live feedback' },
    ],
    tickets: [
      { name: 'General', price: '18000', quantity: '100', isFree: false },
      { name: 'Pitch Clinic Slot', price: '35000', quantity: '10', isFree: false },
    ],
  },

  {
    title: 'Women in Finance Summit — Port Harcourt',
    summary: "A full-day conference celebrating and empowering women building careers in Nigeria's financial sector.",
    description: 'Keynotes, panel discussions, and mentorship sessions featuring top women in banking, fintech, investment, and insurance.',
    organizer: 'WiF Nigeria',
    eventType: 'Conference',
    category: 'Business',
    imageUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80',
    date: '2026-06-20T08:30:00Z',
    endDate: '2026-06-20T17:00:00Z',
    venueAddress: 'Marriott Hotel, GRA Phase 2, Port Harcourt',
    locationType: 'venue',
    latitude: 4.8156,
    longitude: 7.0498,
    capacity: 350,
    agenda: [
      { title: 'Registration & Breakfast', startTime: '08:30 AM', endTime: '09:15 AM', host: 'Event Team', description: '' },
      { title: 'Opening Keynote', startTime: '09:15 AM', endTime: '10:15 AM', host: 'Zainab Shamsuna Ahmed', description: 'Redefining what leadership looks like in Nigerian finance' },
      { title: 'Mentorship Roundtables', startTime: '02:00 PM', endTime: '04:00 PM', host: 'Various mentors', description: 'Small-group sessions' },
    ],
    tickets: [
      { name: 'Standard', price: '22000', quantity: '300', isFree: false },
      { name: 'Table of 10', price: '180000', quantity: '5', isFree: false },
    ],
  },

  // ─── ARTS & CULTURE ───────────────────────────────────────────────────────
  {
    title: 'Contemporary Nigerian Art Fair',
    summary: 'Three days of Nigerian contemporary art: exhibitions, artist talks, live painting, and over 60 galleries.',
    description: 'The largest gathering of Nigerian visual art in the country. Browse and buy work across painting, sculpture, photography, textile art, and digital art.',
    organizer: 'LagosArtScene',
    eventType: 'Exhibition',
    category: 'Arts & Culture',
    imageUrl: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&q=80',
    date: '2026-07-10T10:00:00Z',
    endDate: '2026-07-12T19:00:00Z',
    venueAddress: 'Lekki Conservation Centre, Lagos',
    locationType: 'venue',
    latitude: 6.4389,
    longitude: 3.5672,
    capacity: 2000,
    agenda: [
      { title: 'Opening Ceremony & Curator Walk', startTime: '10:00 AM', endTime: '12:00 PM', host: 'Chief Curator', description: 'Day 1 only — guided walk through the main exhibition' },
      { title: 'Live Painting Session', startTime: '04:00 PM', endTime: '06:00 PM', host: '10 Artists', description: 'Watch artists create on the main floor in real time' },
    ],
    tickets: [
      { name: 'Day Pass', price: '5000', quantity: '600', isFree: false },
      { name: 'Weekend Pass', price: '12000', quantity: '500', isFree: false },
      { name: 'Collector Pass', price: '50000', quantity: '50', isFree: false },
    ],
  },

  {
    title: 'Creative Writing Circle — Experimental Fiction',
    summary: 'A fortnightly gathering for writers of experimental and speculative fiction. Share your work. Receive honest feedback.',
    description: 'This is a peer critique circle — not a lecture. Genre fiction, literary fiction, Afrofuturism all welcome.',
    organizer: 'Writerspace Lagos',
    eventType: 'Meetup',
    category: 'Arts & Culture',
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80',
    date: '2026-05-06T18:00:00Z',
    endDate: '2026-05-06T20:30:00Z',
    venueAddress: 'Quintessence, Ikoyi, Lagos',
    locationType: 'venue',
    latitude: 6.4474,
    longitude: 3.4219,
    capacity: 20,
    agenda: [
      { title: 'Critique Sessions', startTime: '06:15 PM', endTime: '08:15 PM', host: 'Rotating facilitator', description: 'Each piece gets 20 minutes: 5 silence, 15 feedback' },
    ],
    tickets: [
      { name: 'Observer (First Timers)', price: '0', quantity: '5', isFree: true },
      { name: 'Member Session', price: '0', quantity: '15', isFree: true },
    ],
  },

  // ─── FOOD & DRINK ─────────────────────────────────────────────────────────
  {
    title: 'Jollof Wars — The Grand Annual Cook-Off',
    summary: 'Ghana vs Nigeria vs Senegal vs Sierra Leone. 12 chefs. One pot. One winner. You decide.',
    description: 'Twelve professional chefs representing four West African nations compete in a live cook-off judged by industry experts and public taste-testers. Entry includes unlimited tastings and live entertainment.',
    organizer: 'West African Food Collective',
    eventType: 'Food Festival',
    category: 'Food & Drink',
    imageUrl: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&q=80',
    date: '2026-05-30T12:00:00Z',
    endDate: '2026-05-30T20:00:00Z',
    venueAddress: 'Federal Palace Hotel Beach, Victoria Island, Lagos',
    locationType: 'venue',
    latitude: 6.4333,
    longitude: 3.4167,
    capacity: 500,
    agenda: [
      { title: 'Doors Open & Welcome Drinks', startTime: '12:00 PM', endTime: '01:00 PM', host: 'Event Team', description: '' },
      { title: 'Round 1: Base Jollof', startTime: '01:00 PM', endTime: '03:00 PM', host: '12 Chefs', description: 'Nations present their classics' },
      { title: 'Public Voting & Awards', startTime: '07:00 PM', endTime: '08:00 PM', host: 'Host', description: 'Vote via app. Prizes announced live.' },
    ],
    tickets: [
      { name: 'General Entry (includes tastings)', price: '10000', quantity: '400', isFree: false },
      { name: 'VIP Lounge', price: '25000', quantity: '100', isFree: false },
    ],
  },

  {
    title: 'Coffee Origins Workshop — Ethiopian & Kenyan Beans',
    summary: 'An intimate guided cupping session exploring single-origin African coffees with a specialty roaster.',
    description: 'Over two hours, you will taste 8 distinct African coffees and leave with your own 200g bag. Led by Q-grader certified baristas. Maximum 20 people.',
    organizer: 'Roast Republic Lagos',
    eventType: 'Tasting Event',
    category: 'Food & Drink',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
    date: '2026-04-27T11:00:00Z',
    endDate: '2026-04-27T13:00:00Z',
    venueAddress: 'Roast Republic, Oniru Estate, Lagos',
    locationType: 'venue',
    latitude: 6.4355,
    longitude: 3.4521,
    capacity: 20,
    agenda: [
      { title: 'Cupping Round 1: Ethiopian Naturals', startTime: '11:30 AM', endTime: '12:00 PM', host: 'Guided', description: 'Yirgacheffe, Guji, Sidama' },
      { title: 'Cupping Round 2: East African Washed', startTime: '12:00 PM', endTime: '12:30 PM', host: 'Guided', description: 'Kenyan AA, Rwandan, Burundian' },
    ],
    tickets: [
      { name: 'Cupping Session', price: '15000', quantity: '20', isFree: false },
    ],
  },

  // ─── SPORTS & FITNESS ─────────────────────────────────────────────────────
  {
    title: 'Lagos Marathon Community Run — 5K & 10K',
    summary: 'No qualifying times, no elite pressure. Just you, the city, and thousands of runners on a beautiful early-morning route.',
    description: 'Route winds through Ikoyi, along the Lagos Lagoon, and finishes at Tafawa Balewa Square. Chip-timed. All finishers get a medal.',
    organizer: 'Lagos Road Runners Club',
    eventType: 'Sports Event',
    category: 'Sports & Fitness',
    imageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80',
    date: '2026-05-10T06:00:00Z',
    endDate: '2026-05-10T12:00:00Z',
    venueAddress: 'Tafawa Balewa Square, Lagos Island',
    locationType: 'venue',
    latitude: 6.4541,
    longitude: 3.3947,
    capacity: 3000,
    agenda: [
      { title: '5K Race Start', startTime: '06:00 AM', endTime: '08:00 AM', host: 'Race Officials', description: '' },
      { title: '10K Race Start', startTime: '06:30 AM', endTime: '09:30 AM', host: 'Race Officials', description: '' },
      { title: 'Finish Festival & Awards', startTime: '09:00 AM', endTime: '12:00 PM', host: 'MC', description: 'Food, music, podium ceremony' },
    ],
    tickets: [
      { name: '5K Entry', price: '8000', quantity: '1500', isFree: false },
      { name: '10K Entry', price: '12000', quantity: '1500', isFree: false },
    ],
  },
];

async function seedDatabase() {
  console.log('🚀 Starting seed...');
  console.log(`📡 Connecting to ${BASE_URL}`);

  // ── 1. Auth ───────────────────────────────────────────────────────────────
  let token;

  try {
    const signupRes = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'seed@eventful.dev',
        password: 'seedpassword123',
      }),
    });

    const signupData = await signupRes.json();

    if (signupRes.ok) {
      token = signupData.access_token;
      console.log('✅ Signed up seed user');
    } else if (signupData.statusCode === 409 || signupData.message?.includes('already')) {
      // Email exists — log in
      const loginRes = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'seed@eventful.dev',
          password: 'seedpassword123',
        }),
      });
      const loginData = await loginRes.json();
      token = loginData.access_token;
      console.log('✅ Logged in as seed user');
    } else {
      console.error('❌ Auth failed:', signupData);
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Could not connect to backend. Is it running on port 4000?');
    console.error(err.message);
    process.exit(1);
  }

  // ── 2. Create events ──────────────────────────────────────────────────────
  let successCount = 0;
  let failCount = 0;

  for (const event of seedEvents) {
    try {
      const res = await fetch(`${BASE_URL}/events/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(event),
      });

      const data = await res.json();

      if (res.ok) {
        // Backend returns { event, token } — grab updated token if present (role promotion)
        if (data.token) token = data.token;
        successCount++;
        console.log(`✅ Created: ${event.title}`);
      } else {
        failCount++;
        console.error(`❌ Failed: ${event.title}`);
        console.error('   →', JSON.stringify(data));
      }
    } catch (err) {
      failCount++;
      console.error(`❌ Error on: ${event.title} — ${err.message}`);
    }
  }

  console.log(`\n🎉 Done! ${successCount} events created, ${failCount} failed.`);
}

seedDatabase();