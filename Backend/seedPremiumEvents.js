const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('./models/event');
const User = require('./models/user');

dotenv.config();


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).
then(() => console.log('MongoDB Connected for Seeding')).
catch((err) => {
  console.error('Connection error', err);
  process.exit(1);
});

const seedEvents = async () => {
  try {

    await Event.deleteMany();
    console.log('Cleared existing events...');


    const admin = await User.findOne({ role: 'admin' });
    const creatorId = admin ? admin._id : null;

    const events = [
    {
      title: "Kerala Literature Festival 2026",
      description: "The grandest celebration of words, ideas, and culture in South India. Join renowned authors, thinkers, and artists for four days of enriching discussions, workshops, and performances right on the shores of the Arabian Sea.\n\nExperience a diverse range of topics covering literature, politics, science, and the arts, with a special focus on regional languages and global perspectives.",
      startDate: new Date("2026-03-15T10:00:00Z"),
      endDate: new Date("2026-03-18T20:00:00Z"),
      location: "Kozhikode Beach, Calicut",
      city: "Kozhikode",
      category: "Literature",
      image: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=1974&auto=format&fit=crop",
      pricePerTicket: 1500,
      totalTickets: 5000,
      availableTickets: 3450,
      createdBy: creatorId,
      subEvents: [
      {
        title: "DC Books Exhibition & Sale",
        time: "09:00 AM - 08:00 PM",
        speaker: "",
        description: "Explore the largest collection of Malayalam and English literature. Featuring exclusive book launches, author signing sessions, and massive discounts on bestsellers. Find rare regional titles and global classics all under one massive pavilion.",
        location: "Pavilion A, Beach Road",
        image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2190&auto=format&fit=crop"
      },
      {
        title: "Inaugural Address",
        time: "10:00 AM",
        speaker: "Shashi Tharoor",
        description: "Opening keynote on the evolution of Indian literature on the global stage, followed by an interactive Q&A session.",
        location: "Main Stage"
      },
      {
        title: "The Future of Fiction",
        time: "02:00 PM",
        speaker: "Arundhati Roy",
        description: "A deep dive into political fiction, storytelling formats, and the responsibilities of modern authors.",
        location: "Hall B"
      },
      {
        title: "Poetry by the Sea",
        time: "06:00 PM",
        speaker: "Various Artists",
        location: "Sunset Point"
      }]

    },
    {
      title: "Sunburn Arena ft. Martin Garrix",
      description: "Get ready for the biggest EDM night of the year! Sunburn brings globally acclaimed DJ Martin Garrix to Kochi for an electrifying arena experience. Expect mind-blowing visuals, state-of-the-art sound systems, and an unforgettable night of dancing.\n\nOpening acts will feature top local DJs and emerging international talents. Early bird tickets are highly limited.",
      startDate: new Date("2026-04-10T17:00:00Z"),
      endDate: new Date("2026-04-10T23:30:00Z"),
      location: "Bolgatty Palace Grounds, Kochi",
      city: "Kochi",
      category: "Music",
      image: "https://images.unsplash.com/photo-1470229722913-7c090bf8bc36?q=80&w=2070&auto=format&fit=crop",
      pricePerTicket: 3500,
      totalTickets: 8000,
      availableTickets: 120,
      createdBy: creatorId,
      subEvents: [
      { title: "Gates Open & Warm-up set", time: "05:00 PM", speaker: "DJ Rinks" },
      { title: "Main Supporting Act", time: "07:30 PM", speaker: "Lost Frequencies" },
      { title: "Martin Garrix Live", time: "09:00 PM", speaker: "Martin Garrix" }]

    },
    {
      title: "Kochi Biennale - Contemporary Art",
      description: "Asia's largest contemporary art exhibition returns. The Kochi-Muziris Biennale brings together visionary artists from across the globe to transform the heritage spaces of Fort Kochi and Mattancherry into expansive canvases of modern thought.\n\nThis year's curation focuses on themes of climate change, migration, and post-colonial identity, featuring massive installations, interactive media, and performance art.",
      startDate: new Date("2026-02-01T09:00:00Z"),
      endDate: new Date("2026-04-15T18:00:00Z"),
      location: "Aspinwall House, Fort Kochi",
      city: "Kochi",
      category: "Art",
      image: "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?q=80&w=2010&auto=format&fit=crop",
      pricePerTicket: 500,
      totalTickets: 20000,
      availableTickets: 15400,
      createdBy: creatorId,
      subEvents: [
      { title: "Guided Curatorial Tour", time: "11:00 AM", speaker: "Bose Krishnamachari" },
      { title: "Artist Talk: Finding Mediums", time: "03:00 PM", speaker: "Subodh Gupta" }]

    },
    {
      title: "Trivandrum Tech & Startup Expo",
      description: "The premier gathering for innovators, entrepreneurs, and tech enthusiasts in Kerala. Discover cutting-edge startups, attend masterclasses by industry leaders, and network with venture capitalists from across the country.\n\nHighlights include a 24-hour hackathon, AI robotics demonstrations, and an exclusive investor pitching session.",
      startDate: new Date("2026-05-20T08:30:00Z"),
      endDate: new Date("2026-05-22T17:00:00Z"),
      location: "Technopark Phase III, Trivandrum",
      city: "Trivandrum",
      category: "Exhibition",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
      pricePerTicket: 1200,
      totalTickets: 3000,
      availableTickets: 800,
      createdBy: creatorId,
      subEvents: [
      { title: "Keynote: AI in 2026", time: "09:30 AM", speaker: "Tech Visionary" },
      { title: "Startup Pitch Deck", time: "02:00 PM", speaker: "Panel of VCs" }]

    },
    {
      title: "Onam Grand Feast & Cultural Fest",
      description: "Celebrate Kerala's most vibrant festival with an authentic, massive Sadhya (feast) preparing over 30 traditional dishes. The day is packed with cultural showcases including Kathakali, Thiruvathira, and the thrilling Pulikali (tiger dance).\n\nPerfect for families and tourists wanting to experience the true essence of Kerala culture in a joyous, communal setting.",
      startDate: new Date("2026-08-25T10:00:00Z"),
      endDate: new Date("2026-08-25T18:00:00Z"),
      location: "Durbar Hall Ground, Ernakulam",
      city: "Kochi",
      category: "Festival",
      image: "https://images.unsplash.com/photo-1604931668626-ab48cb91900f?q=80&w=2070&auto=format&fit=crop",
      pricePerTicket: 850,
      totalTickets: 2000,
      availableTickets: 0,
      createdBy: creatorId,
      subEvents: [
      { title: "Pookkalam Competition", time: "10:00 AM", speaker: "Cultural Committee" },
      { title: "Grand Sadhya (Feast)", time: "12:30 PM", speaker: "" },
      { title: "Kathakali Performance", time: "04:00 PM", speaker: "Kerala Kalamandalam Troupe" }]

    },
    {
      title: "Waynad Indie Music Retreat",
      description: "Set amidst the misty hills and lush tea gardens of Wayanad, this intimate 2-day retreat features the best independent singer-songwriters from across India. \n\nCamp under the stars, enjoy acoustic sets by the bonfire, and participate in songwriting workshops. Ticket includes tent accommodation and all meals.",
      startDate: new Date("2026-11-14T14:00:00Z"),
      endDate: new Date("2026-11-16T12:00:00Z"),
      location: "Banasura Hill Resort, Wayanad",
      city: "Wayanad",
      category: "Music",
      image: "https://images.unsplash.com/photo-1533174000255-1ceebae2f8a8?q=80&w=2070&auto=format&fit=crop",
      pricePerTicket: 4500,
      totalTickets: 300,
      availableTickets: 45,
      createdBy: creatorId,
      subEvents: [
      { title: "Acoustic Sunset", time: "05:30 PM", speaker: "Prateek Kuhad" },
      { title: "Midnight Bonfire Jam", time: "11:00 PM", speaker: "When Chai Met Toast" }]

    }];


    await Event.insertMany(events);
    console.log(`Successfully seeded ${events.length} premium events!`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedEvents();