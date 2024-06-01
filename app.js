require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");
const areaRoutes = require("./api/routes/area");
const pharmacyRoutes = require("./api/routes/pharmacy");
const medicineRoutes = require("./api/routes/medicine");
const userRoutes = require("./api/routes/user");
const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Apply rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later"
});

app.use(limiter);

// To protect from CORS
// app.use(cors());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// Routes
app.use("/area", areaRoutes);
app.use("/pharmacy",pharmacyRoutes);
app.use("/medicine",medicineRoutes);
app.use("/user",userRoutes);

// setting mongoose connection and starting server
mongoose.set("strictQuery", false);
mongoose
    .connect(process.env.MongoDB_URI)
    .then(() => {
        app.listen(process.env.APP_PORT || 3000, () => {
            console.log("Server up and running on PORT:", process.env.APP_PORT || 3000);
        });
    })
    .catch((err) => {
        console.error("Mongoose connection error:", err);
    });

