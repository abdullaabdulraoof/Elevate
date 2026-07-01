const mongoose = require('mongoose');
const logger = require('../logger');
require('dotenv').config();

const connectDB = async () => {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!uri) {
        logger.error('MongoDB connection URI is not defined. Set MONGO_URI or MONGODB_URI in .env.');
        process.exit(1);
    }

    try {
        await mongoose.connect(uri, { family: 4 });
        logger.info("MongoDB Connected Successfully");
    } catch (err) {
        logger.error(`MongoDB Connection Failed: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;