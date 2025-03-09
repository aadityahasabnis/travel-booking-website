const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing')
const path = require('path');
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js')
const ExpressError = require('./utils/ExpressError.js')


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, '/public')))



// Logger
// Middleware
app.use((req, res, next) => {
    req.time = new Date(Date.now());
    console.log(req.method);
    console.log(req.hostname, req.time);
    next();
})


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
    res.send("Hello")
})


// * Listings Route
app.get('/listings', wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}))

// * New Listing Page
app.get("/listings/new", (req, res) => {
    res.render('listings/new.ejs');
})

// * Post new listing
app.post('/listings', wrapAsync(async (req, res, next) => {
    if(!req.body) throw new ExpressError(400, "Invalid Data");
    let { title, description, image: imageUrl, price, country, location } = req.body;
    await Listing.insertOne({
        title: title, description: description, image: { url: imageUrl }, price, country, location
    })
    res.redirect('/listings');
}))

//  * Each Listing
//  Show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    if(!req.params) throw new ExpressError(400, "Invalid ID");
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
}))


//  * Edit Each Listing in show
//  Show Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}))

// * Update listing
app.put("/listings/:id", wrapAsync(async (req, res) => {
    if (!req.body) throw new ExpressError(400, "Invalid Data");
    let { id } = req.params;
    let { title, description, image: imageUrl, price, country, location } = req.body;
    await Listing.findByIdAndUpdate(id, {
        title: title, description: description, image: { url: imageUrl }, price, country, location
    }, { new: true })
    res.redirect('/listings');
}))


// * Delete Listing
app.delete("/listings/:id/delete",wrapAsync( async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
}))

// * Just for checking
// app.get('/testListing', async (req, res) => {
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

app.all('*', (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
})

app.use((err, req, res, next) => {
    let {statusCode=500, message="Something went wrong."} = err;
    res.status(statusCode).render("Error.ejs", {message});
})

app.listen(3000, () => {
    console.log("Server is listening to port 3000");
})