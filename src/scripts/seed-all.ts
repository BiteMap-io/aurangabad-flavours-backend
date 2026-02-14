import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import config from '../config';

// Import individual seeders
// Note: We'll modify the individual seeders to NOT exit if imported
import seedArticles from './seed-articles';
import seedEvents from './seed-events';
import seedFoodTrails from './seed-food-trails';
import Restaurant from '../models/restaurant.model';

const sampleHotels = [
  {
    name: 'Rama International',
    establishmentType: 'Luxury Hotel',
    cuisine: 'Multi-cuisine',
    facilities: ['Pool', 'Gym', 'Spa', 'Free WiFi', 'Parking'],
    priceRange: '$$$$',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
    gallery: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
    ],
    description:
      'Experience luxury at its best with world-class amenities and exceptional service in the heart of Aurangabad.',
    location: {
      type: 'Point',
      coordinates: [75.3622, 19.8733],
    },
    verified: true,
    ihmRecommended: true,
    area: 'Chikalthana',
  },
  {
    name: 'Vivanta Aurangabad',
    establishmentType: 'Resort',
    cuisine: 'Luxury Dining',
    facilities: ['Outdoor Pool', 'Garden', 'Business Center', 'Fitness Center'],
    priceRange: '$$$$',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa',
    gallery: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4'],
    description: 'A palace-like resort with lush green gardens and traditional Taj hospitality.',
    location: {
      type: 'Point',
      coordinates: [75.3524, 19.8893],
    },
    verified: true,
    ihmRecommended: true,
    area: 'CIDCO',
  },
  {
    name: 'Naivedya Thali',
    establishmentType: 'Restaurant',
    cuisine: 'Maharashtrian',
    facilities: ['Air Conditioning', 'Traditional Seating', 'Pure Veg'],
    priceRange: '$$',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af',
    gallery: [],
    description: 'Famous for its authentic Maharashtrian and Rajasthani Thali experience.',
    location: {
      type: 'Point',
      coordinates: [75.3256, 19.8721],
    },
    verified: true,
    ihmRecommended: true,
    area: 'Cannought Place',
  },
];

async function seedAll() {
  try {
    console.log('--- STARTING COMPREHENSIVE SEEDING ---');
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB.');

    // 1. Seed Restaurants (Hotels)
    console.log('\nSeeding Restaurants...');
    await Restaurant.deleteMany({});
    await Restaurant.insertMany(sampleHotels);
    console.log('Restaurants seeded.');

    // 2. Seed Articles
    console.log('\nSeeding Articles...');
    await seedArticles();

    // 3. Seed Events
    console.log('\nSeeding Events...');
    await seedEvents();

    // 4. Seed Food Trails (Depends on Restaurants)
    console.log('\nSeeding Food Trails...');
    await seedFoodTrails();

    console.log('\n--- ALL SEEDING COMPLETED SUCCESSFULLY ---');
    process.exit(0);
  } catch (error) {
    console.error('\n--- SEEDING FAILED ---');
    console.error(error);
    process.exit(1);
  }
}

seedAll();
