require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/spraysystem';

    console.log('Connecting to database...');
    await mongoose.connect(mongoUri);
    console.log('Connected to database.');

    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@spraysystem.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminRole = 'super';

    // Check if admin user already exists
    const existingUser = await User.findOne({
      $or: [{ email: adminEmail }, { username: adminUsername }],
    });

    if (existingUser) {
      console.log(`Admin user already exists (${existingUser.email}).`);
      process.exit(0);
    }

    // Hash the password directly with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const newAdmin = new User({
      username: adminUsername,
      email: adminEmail,
      password: hashedPassword,
      role: adminRole,
    });

    await newAdmin.save();

    console.log('--------------------------------------------');
    console.log(' Admin user migration successfully completed!');
    console.log(` Username: ${adminUsername}`);
    console.log(` Email   : ${adminEmail}`);
    console.log(` Password: ${adminPassword}`);
    console.log(` Role    : ${adminRole}`);
    console.log('--------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
};

seedAdmin();
