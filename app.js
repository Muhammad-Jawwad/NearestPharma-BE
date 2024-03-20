require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const areaRoutes = require("./api/routes/area");
const pharmacyRoutes = require("./api/routes/pharmacy");
const medicineRoutes = require("./api/routes/medicine");
const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// To protect from CORS
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

