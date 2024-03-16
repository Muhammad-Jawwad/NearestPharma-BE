const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const areaSchema = new Schema(
    {
        areaName: String,
        area: String,
        city: String,
        country: String
    },
    { timestamps: true }
);

module.exports = mongoose.model("Area", areaSchema);
