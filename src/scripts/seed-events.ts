import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Event from '../models/event.model';
import config from '../config';

const sampleEvents = [
  {
    name: 'Aurangabad Food Festival 2026',
    description: 'A week-long celebration of local and international cuisines at Prozone Mall.',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    location: 'Prozone Mall Parking Lot',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
    organizer: 'Aurangabad Municipal Corporation',
    price: 'Free Entry',
    capacity: 5000,
    status: 'upcoming',
    featured: true,
  },
  {
    name: 'Hyderabadi Biryani Workshop',
    description: 'Learn to cook the authentic Hyderabadi Biryani from master chefs.',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    location: 'Hotel Rama International',
    image: 'https://images.unsplash.com/photo-1563379091339-0ef57cb31533',
    organizer: 'Chef Sadiqq & Co',
    price: '₹1500 per person',
    capacity: 50,
    status: 'upcoming',
    featured: false,
  },
  {
    name: 'Traditional Music & Food Night',
    description: 'Enjoy Sufi music accompanied by a traditional 7-course meal.',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    location: 'Vivanta Aurangabad Lobby',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745',
    organizer: 'Vivanta Events',
    price: '₹3000 per couple',
    capacity: 100,
    status: 'upcoming',
    featured: true,
  },
];

async function seedEvents() {
  try {
    console.log('Connecting to MongoDB for event seeding...');
    await mongoose.connect(config.mongodbUri);
    console.log('Connected.');

    console.log('Clearing existing events...');
    await Event.deleteMany({});

    console.log(`Seeding ${sampleEvents.length} events...`);
    await Event.insertMany(sampleEvents);

    console.log('Event seeding completed successfully.');
    if (require.main === module) process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    if (require.main === module) process.exit(1);
  }
}

if (require.main === module) {
  seedEvents();
}

export default seedEvents;
