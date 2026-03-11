import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Restaurant from '../models/restaurant.model';
import config from '../config';

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
      coordinates: [75.3622, 19.8733], // Longitude, Latitude
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
  {
    name: 'Bhoj Thali Restaurant',
    establishmentType: 'Restaurant',
    cuisine: 'North Indian / Thali',
    facilities: ['Parking', 'Veg', 'Fast Service'],
    priceRange: '$$',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97eb4',
    gallery: [],
    description:
      'One of the oldest and most popular thali restaurants in the city known for its consistency.',
    location: {
      type: 'Point',
      coordinates: [75.3211, 19.871],
    },
    verified: true,
    ihmRecommended: false,
    area: 'CBS Area',
  },
  {
    name: 'Hotel Bagga International',
    establishmentType: 'Premium Hotel',
    cuisine: 'Continental / Indian',
    facilities: ['Rooftop Restaurant', 'Bar', 'Meeting Rooms'],
    priceRange: '$$$',
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c',
    gallery: [],
    description:
      'Strategically located premium hotel suitable for both business and leisure travelers.',
    location: {
      type: 'Point',
      coordinates: [75.3122, 19.8655],
    },
    verified: true,
    ihmRecommended: false,
    area: 'Railway Station Road',
  },
];

async function seedData() {
  try {
    console.log('Connecting to MongoDB for data seeding...');
    await mongoose.connect(config.mongodbUri);
    console.log('Connected.');

    console.log('Clearing existing restaurant data...');
    await Restaurant.deleteMany({});
    console.log('Cleared.');

    console.log(`Seeding ${sampleHotels.length} restaurants...`);
    await Restaurant.insertMany(sampleHotels);

    console.log('Seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedData();
