require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!uri) {
	console.error('MongoDB URI is not set. Configure MONGO_URI or MONGODB_URI in .env');
	process.exit(1);
}

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@elevate.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

async function seedAdmin() {
	try {
		await mongoose.connect(uri);
		console.log('Connected to MongoDB for seeding');

		// Check if an admin already exists
		const existing = await User.findOne({ role: 'admin' });
		if (existing) {
			console.log('Admin user already exists:', existing.email);
			await mongoose.disconnect();
			process.exit(0);
		}

		const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);

		const admin = new User({
			username: ADMIN_USERNAME,
			email: ADMIN_EMAIL,
			password: hashed,
			role: 'admin'
		});

		await admin.save();
		console.log('Admin user created:', ADMIN_EMAIL);

		await mongoose.disconnect();
		process.exit(0);
	} catch (err) {
		console.error('Error seeding admin user:', err);
		try { await mongoose.disconnect(); } catch(e) {}
		process.exit(1);
	}
}

seedAdmin();

