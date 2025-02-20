const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing')


// * MongoDB Connect Locally
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





    
// * Home Route
app.get('/', (req, res) => {
    res.send("Hello");
})


// * Just for checking
// app.get('/testlisting', async (req, res) => {
//     let sampleListing = new Listing({
//         title: "Cozy Beachfront Bungalow",
//         description: "A beautiful beachfront bungalow with stunning ocean views. Perfect for a relaxing getaway.",
//         image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
//         price: 1500,
//         location: "Goa",
//         country: "India"
//     });

//     await sampleListing.save();
//     console.log("Sample saved");
//     res.send("Successful")
// })

app.listen(3000, () => {
    console.log("Server is listening to port 3000");
})