const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const pharmacyMedicineSchema = new Schema(
    {
        pharmacyId: {
            type: Schema.Types.ObjectId,
            ref: 'Pharmacy'
        },
        medicineId: {
            type: Schema.Types.ObjectId,
            ref: 'Medicine'
        },
        medicineQuantity: Number,
        price: Number
    },
    { timestamps: true }
);

module.exports = mongoose.model("PharmacyMedicine", pharmacyMedicineSchema);
