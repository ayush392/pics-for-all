const mongoose = require("mongoose");
require("dotenv").config();

let connection = null;

const dbConnect = async () => {
    try {
        if (connection) return;

        connection = await mongoose.connect(process.env.DB_URL, {});

        console.log(`Connected to MongoDB Atlas!`);
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

module.exports = dbConnect;
