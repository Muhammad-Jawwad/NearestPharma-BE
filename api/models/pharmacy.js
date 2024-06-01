const { ServerDescriptionChangedEvent } = require("mongodb");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const pharmacySchema = new Schema(
    {
        branchName: {
            type: String,
            required: true
        },
        latitude:{
            type: Number,
            required: true
        },
        longitude:{
            type: Number,
            required: true
        },
        city: {
            type: String,
            default:'Karachi'
        },
        country: {
            type: String,
            default:'Pk'
        },
        rating: Number,
        areaName: {
            type: String,
            required: true
        },
        mapUrl: String,
        address: String
    },
    { timestamps: true }
);

module.exports = mongoose.model("Pharmacy", pharmacySchema);



// const mongoose = require("mongoose");

// const Schema = mongoose.Schema;

// const pharmacySchema = new Schema(
//     {
//         branchName: {
//             type: String,
//             required: true
//         },
//         location: {
//             type: {
//                 type: String,
//                 enum: ['Point'],
//                 default: 'Point'
//             },
//             coordinates: {
//                 type: [Number],
//                 required: true
//             } 
//         },
//         rating: Number,
//         daysOpen: [String],
//         openTime: String,
//         services: {
//             inStorePicking: Boolean,
//             inStoreShopping: Boolean,
//             inStoreDelivery: Boolean,
//             paymentCash: Boolean
//         },
//         areaId: {
//             type: Schema.Types.ObjectId,
//             ref: 'Area'
//         },
//         mapUrl: String,
//         address: String
//     },
//     { timestamps: true }
// );

// module.exports = mongoose.model("Pharmacy", pharmacySchema);
