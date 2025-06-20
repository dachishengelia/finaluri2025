const mongoose = require("mongoose");
require('dotenv').config();

const connectToDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);  
        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.error('Couldnt connect to mongoDB');
        console.error(error.message); 
        process.exit(1); 
    }
};

module.exports = connectToDb;
