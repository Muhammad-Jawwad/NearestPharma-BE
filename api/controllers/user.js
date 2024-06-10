const { validationResult } = require("express-validator");
const Medicine = require("../models/medicine");
const PharmacyMedicine = require("../models/pharmacyMedicine");
const Pharmacy = require("../models/pharmacy");

// Function to calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180); // Convert degrees to radians
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
}

// Function to normalize a value between 0 and 1
function normalize(value, min, max) {
    return (value - min) / (max - min);
}

// Function to filter unique medicines
function filterUniqueMedicines(medicines) {
    const uniqueMap = new Map();
    for (const medicine of medicines) {
        const key = JSON.stringify({
            pharmacyId: medicine.pharmacyId._id,
            medicineId: medicine.medicineId._id,
            // medicineQuantity: medicine.medicineQuantity,
            // price: medicine.price
            // Add other fields you want to compare here
        });
        if (!uniqueMap.has(key)) {
            uniqueMap.set(key, medicine);
        }
    }
    return Array.from(uniqueMap.values());
}

// Function to predict nearest pharmacies using KNN
async function predictPharmacy(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 400,
                message: "Validation error",
                errors: errors.array()
            });
        }

        const { medicineId, medicineQuantity, latitude, longitude } = req.body;

        const isMedicineAvailable = await PharmacyMedicine.find({
            medicineId: medicineId,
            price: { $gt: 0 },
            medicineQuantity: { $gt: medicineQuantity }
        }).populate('pharmacyId')
        .populate('medicineId');

        // Filter out documents with identical attributes except for _id
        const uniqueMedicines = filterUniqueMedicines(isMedicineAvailable);

        console.log("uniqueMedicines", uniqueMedicines)

        if (uniqueMedicines.length === 0) {
            return res.status(404).json({
                code: 404,
                message: "This medicine is not available in desired quantity",
            });
        }

        const minPrice = 0;
        var maxPrice = 0;

        const maxPriceDoc = await PharmacyMedicine.find({ medicineId: medicineId })
            .sort({ price: -1 })
            .limit(1);

        if (maxPriceDoc.length > 0) {
            maxPrice = maxPriceDoc[0].price;
            console.log("Maximum Price:", maxPrice);
            // Now you can use maxPrice for normalization
        } else {
            console.log("No data found for the specified medicine.");
        }

        // Normalize and calculate weighted distances
        const weightedDistances = uniqueMedicines.map(object => {
            const rating = object.pharmacyId.rating;
            const pharmacyLongitude = object.pharmacyId.longitude;
            const pharmacyLatitude = object.pharmacyId.latitude;
            const price = object.price;

            const distance = calculateDistance(latitude, longitude, pharmacyLatitude, pharmacyLongitude);
            const normalizedPrice = normalize(price, minPrice, maxPrice); // You need to define minPrice and maxPrice
            const normalizedRating = rating / 5; // Assuming rating is between 0 and 5

            // Apply weights
            const weightedDistance = 0.4 * distance + 0.5 * normalizedPrice + 0.1 * normalizedRating;

            return {
                pharmacyId: object.pharmacyId,
                distance: weightedDistance,
                medicineQuantity: object.medicineQuantity,
                price: price,
            };
        });

        // Sort by weighted distance
        weightedDistances.sort((a, b) => a.distance - b.distance);

        // Return top 5 pharmacies
        // const topPharmacies = weightedDistances.slice(0, 5).map(item => item.pharmacyId);
        const topPharmacies = weightedDistances.slice(0, 5).map(item => ({
            pharmacyId: item.pharmacyId,
            medicineQuantity: item.medicineQuantity,
            price: item.price,
        }));


        // Returning success message
        res.status(200).json({
            status: 200,
            message: "Top 5 Pharmacies using KNN are fetched successfully",
            // data: weightedDistances,
            data: topPharmacies,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            code: 500,
            error: error.name,
            message: error.message,
        });
    }
}

module.exports = {
    predictPharmacy,
};