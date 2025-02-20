const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
    await mongoose.connect(MONGO_URL);
}
main()
    .then(() => {
        console.log("MongoDB connected!");
    })
    .catch(() => {
        console.log("Not connected!");
    })

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data Inserted");

}
initDB();