const { validationResult } = require("express-validator");
const Pharmacy = require("../models/pharmacy");
const Area = require("../models/area");
const PharmacyUser = require("../models/pharmacyUser");

module.exports = {
    createPharmacy: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: 400,
                    message: "Validation error",
                    errors: errors.array()
                });
            }

            const foundUsername = await PharmacyUser.find({ username: req.body.username });
            if (foundUsername.length !== 0) {
                return res.status(404).json({
                    code: 404,
                    message: "This username already exist",
                });
            }
            
            const areaId = req.body.areaId;
            const foundArea = await Area.findById(areaId);
            if (!foundArea) {
                return res.status(404).json({
                    code: 404,
                    message: "Area not found",
                });
            }

            const { username, password, ...pharmacyData } = req.body;

            //creating a new pharmacy
            const newPharmacy = new Pharmacy(pharmacyData);
            const PharmacyDetails = await newPharmacy.save();

            const registeredPharmacyData = this.registerPharmacyUser(PharmacyDetails._id, username, password)

            // Returning success message
            res.status(201).json({
                status: 201,
                message: "New Pharmacy created successfully",
                data: PharmacyDetails,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                code: 500,
                error: error.name,
                message: error.message,
            });
        }
    },
    getPharmacy: async (req, res) => {
        try {
            const pharmacyList = await Pharmacy.find().sort({ _id: -1 });
            if (pharmacyList.length === 0) {
                return res.status(404).json({
                    code: 404,
                    message: "No Pharmacy found"
                });
            }
            res.json({
                code: 200,
                message: "Pharmacies retrieved successfully",
                data: pharmacyList
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                code: 500,
                error: error.name,
                message: error.message,
            });
        }
    },
    getPharmacyById: async (req, res) => {
        try {
            const id = req.params.id; //To seprate the id from the parameter

            const foundPharmacy = await Pharmacy.findById(id);
            if (!foundPharmacy) {
                return res.status(404).json({
                    code: 404,
                    message: "Pharmacy not found",
                });
            }
            res.json({
                code: 200,
                message: "Pharmacy retrieved successfully",
                data: foundPharmacy
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                error: error.name,
                message: error.message,
            });
        }
    },
    updatePharmacy: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: 400,
                    message: "Validation error",
                    errors: errors.array()
                });
            }

            const id = req.params.id; //To seprate the id from the parameter
            if (!id) {
                return res.status(400).json({
                    message: "id is required",
                });
            }

            const areaId = req.body.areaId;
            const foundArea = await Area.findById(areaId);
            if (!foundArea) {
                return res.status(404).json({
                    code: 404,
                    message: "Area not found",
                });
            }

            const updateFields = {};
            const fieldsToUpdate = ['branchName', 'location', 'rating', 'daysOpen', 'openTime', 'services', 'areaId', 'mapUrl', 'address'];
            fieldsToUpdate.forEach(field => {
                if (req.body[field] !== undefined) {
                    updateFields[field] = req.body[field];
                }
            });

            const updatedPharmacy = await Pharmacy.findByIdAndUpdate(id, updateFields, { new: true });

            if (!updatedPharmacy) {
                return res.status(404).json({
                    code: 404,
                    message: "Pharmacy not found",
                });
            }

            // Return the updated Pharmacy
            res.status(200).json({
                code: 200,
                message: "Pharmacy updated successfully",
                data: updatedPharmacy,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                code: 500,
                error: error.name,
                message: error.message,
            });
        }
    },
    registerPharmacyUser: async(pharmacyId, username, password) => {
    try {
        const id = pharmacyId;
        //creating a new pharmacy
        const newPharmacy = new PharmacyUser({
            pharmacyId: id,
            username,
            password
        });
        const PharmacyDetails = await newPharmacy.save();
        return PharmacyDetails

    } catch (error) {
        console.error(error);
        res.status(500).json({
            code: 500,
            error: error.name,
            message: error.message,
        });
    }
    },
}