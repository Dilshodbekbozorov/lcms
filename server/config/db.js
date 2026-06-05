const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    if (process.env.NODE_ENV === 'development') {
      console.log(`MongoDB ulandi: ${conn.connection.host}`);
    }
  } catch (error) {
    console.error(`MongoDB ulanish xatosi: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
