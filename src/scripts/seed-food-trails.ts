import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import FoodTrail from '../models/foodTrail.model';
import Restaurant from '../models/restaurant.model';
import config from '../config';

const sampleTrails = [
  {
    name: 'The Royal Mughlai Trail',
    description:
      'Follow the footsteps of emperors and taste the finest Mughlai delicacies in the old city.',
    icon: 'crown',
    color: '#D4AF37',
    estimatedTime: '4 Hours',
    highlights: ['Historical Gate visits', 'Authentic Naan Qalia', 'Zarda Dessert'],
    searchTerms: ['Rama International', 'Naivedya Thali'], // Used to find restaurant IDs
  },
  {
    name: 'Vegetarian Delight Trail',
    description: 'Experience the best of Maharashtrian and Rajasthani vegetarian cuisine.',
    icon: 'leaf',
    color: '#2E7D32',
    estimatedTime: '3 Hours',
    highlights: ['Unlimited Thali', 'Local Spices Market', 'Traditional Sweets'],
    searchTerms: ['Naivedya Thali', 'Bhoj Thali Restaurant'],
  },
];

async function seedFoodTrails() {
  try {
    console.log('Connecting to MongoDB for food trail seeding...');
    await mongoose.connect(config.mongodbUri);
    console.log('Connected.');

    console.log('Clearing existing food trails...');
    await FoodTrail.deleteMany({});

    console.log(`Seeding ${sampleTrails.length} food trails...`);

    const trailsWithIds = await Promise.all(
      sampleTrails.map(async (trail) => {
        const restaurants = await Restaurant.find({ name: { $in: trail.searchTerms } });
        const { searchTerms, ...trailData } = trail;
        return {
          ...trailData,
          restaurantsId: restaurants.map((r) => r._id.toString()),
        };
      })
    );

    await FoodTrail.insertMany(trailsWithIds);

    console.log('Food trail seeding completed successfully.');
    if (require.main === module) process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    if (require.main === module) process.exit(1);
  }
}

if (require.main === module) {
  seedFoodTrails();
}

export default seedFoodTrails;
