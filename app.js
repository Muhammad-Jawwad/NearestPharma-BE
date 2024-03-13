require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
// const morgan = require('morgan')
// const path = require("path");
// const userRoutes = require("./api/routes/user");
// const notificationRoutes = require("./api/routes/notification");
// const achievementRoutes = require("./api/routes/achievement");
// const eventRoutes = require("./api/routes/event");
const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(morgan('dev'))
// app.use('/images', express.static(path.join(__dirname, 'images')));
// console.log(path.join(__dirname, 'images'));

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
// app.use(userRoutes);
// app.use(notificationRoutes);
// app.use(achievementRoutes);
// app.use(eventRoutes);

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

