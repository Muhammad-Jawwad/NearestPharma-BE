const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const pharmacyUserSchema = new Schema(
    {
        pharmacyId: {
            type: Schema.Types.ObjectId,
            ref: 'Pharmacy'
        },
        username: String,
        password: String
    },
    { timestamps: true }
);

module.exports = mongoose.model("PharmacyUser", pharmacyUserSchema);
