import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from '../models/user.model';
import config from '../config';

async function seed() {
  try {
    console.log('Connecting to MongoDB for seeding...');
    await mongoose.connect(config.mongodbUri);
    console.log('Connected.');

    // 1. Seed Admin User
    const adminEmail = 'admin@aurangabadflavours.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      console.log('Creating default admin user...');
      const admin = new User({
        name: 'Super Admin',
        email: adminEmail,
        password: 'adminPassword123!', // User should change this
        userType: 'admin',
      });
      await admin.save();
      console.log('Admin user created successfully.');
    } else {
      console.log('Admin user already exists.');
    }

    // You can add more seeding here (e.g., Dish categories, static pages etc.)
    console.log('Seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
