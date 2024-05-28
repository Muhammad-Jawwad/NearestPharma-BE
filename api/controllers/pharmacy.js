const { validationResult } = require("express-validator");
const Pharmacy = require("../models/pharmacy");
const Area = require("../models/area");
const Medicine = require("../models/medicine");
const PharmacyMedicine = require("../models/pharmacyMedicine");
const PharmacyUser = require("../models/pharmacyUser");
const jwt = require("jsonwebtoken");

const registerPharmacyUser = async (pharmacyId, username, password) => {
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
}

module.exports = {

//#region : PHARMACY AUTH

    loginPharmacy: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: 400,
                    message: "Validation error",
                    errors: errors.array()
                });
            }

            // Check if the username exists
            const isExistUsername = await PharmacyUser.findOne({ username: req.body.username });
            if (!isExistUsername) {
                return res.status(404).json({
                    code: 404,
                    message: "Invalid Username",
                });
            }

            const password = req.body.password;
            if (password !== isExistUsername.password) {
                return res.status(401).json({
                    code: 401,
                    message: "Invalid password",
                });
            }

            const token = jwt.sign(
                {
                    pharmacyId: isExistUsername.pharmacyId.toString(),
                    username: isExistUsername.username,
                    expiration: Date.now() + 3600000,
                },
                process.env.JWT_SecretKey,
                { expiresIn: "1h" }
            );

            const pharmacyData = await Pharmacy.findById(isExistUsername.pharmacyId);

            res.status(201).json({
                status: 201,
                message: "Login successfully",
                token: token,
                data: pharmacyData
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

//#endregion

//#region : PHARMACY CRUD

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
            
            // const areaId = req.body.areaId;
            // const foundArea = await Area.findById(areaId);
            // if (!foundArea) {
            //     return res.status(404).json({
            //         code: 404,
            //         message: "Area not found",
            //     });
            // }

            const { username, password, ...pharmacyData } = req.body;

            //creating a new pharmacy
            const newPharmacy = new Pharmacy(pharmacyData);
            const PharmacyDetails = await newPharmacy.save();

            const registeredPharmacyData = await registerPharmacyUser(PharmacyDetails._id, username, password)

            // Returning success message
            res.status(201).json({
                status: 201,
                message: "New Pharmacy created successfully",
                data: PharmacyDetails,
                credentials: registeredPharmacyData
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

            // const areaId = req.body.areaId;
            // const foundArea = await Area.findById(areaId);
            // if (!foundArea) {
            //     return res.status(404).json({
            //         code: 404,
            //         message: "Area not found",
            //     });
            // }

            const updateFields = {};
            const fieldsToUpdate = ['branchName', 'latitude', 'longitude', 'rating', 'city', 'country', 'areaName', 'mapUrl', 'address'];
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

//#endregion

//#region : PHARMACY-MEDICINE

    createPharmacyMedicine: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: 400,
                    message: "Validation error",
                    errors: errors.array()
                });
            }


            const medicineId = req.body.medicineId;
            const isExistMedicine = await Medicine.findById(medicineId);
            if (!isExistMedicine) {
                return res.status(404).json({
                    code: 404,
                    message: "Medicine not found",
                });
            }

            const pharmacyId = req.body.pharmacyId;
            const isExistPharmacy = await Pharmacy.findById(pharmacyId);
            if (!isExistPharmacy) {
                return res.status(404).json({
                    code: 404,
                    message: "Pharmacy not found",
                });
            }

            const isExistPharmacyMedicine = await PharmacyMedicine.findOne({
                pharmacyId,
                medicineId
            });
            if (isExistPharmacyMedicine) {
                return res.status(404).json({
                    code: 404,
                    message: "Pharmacy Medicine already exist",
                });
            }


            //creating a new pharmacy
            const newPharmacyMedicine = new PharmacyMedicine({
                pharmacyId: req.body.pharmacyId,
                medicineId: req.body.medicineId,
                medicineQuantity: req.body.medicineQuantity,
                price: req.body.price,
            });
            const PharmacyMedicineDetails = await newPharmacyMedicine.save();

            // Returning success message
            res.status(201).json({
                status: 201,
                message: "New Pharmacy-Medicine created successfully",
                data: PharmacyMedicineDetails
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

    getPharmacyMedicine: async (req, res) => {
        try{
            const pharmacyMedicineList = await PharmacyMedicine.find().sort({ _id: -1 });
            if (pharmacyMedicineList.length === 0) {
                return res.status(404).json({
                    code: 404,
                    message: "No Pharmacy-Medicine found"
                });
            }
            res.json({
                code: 200,
                message: "Pharmacies retrieved successfully",
                data: pharmacyMedicineList
            });
        } catch (error){
            console.log(error);
            res.status(500).json({
                code: 500,
                error: error.name,
                message: error.message,
            });
        }
    },

    // getMedicineByPharmacy: async (req, res) => {
    //     try {
    //         const id = req.params.pharmacyId; // To separate the id from the parameter

    //         const foundPharmacy = await Pharmacy.findById(id);
    //         if (!foundPharmacy) {
    //             return res.status(404).json({
    //                 code: 404,
    //                 message: "Pharmacy not found",
    //             });
    //         }

    //         // Get page and limit from query parameters
    //         const page = parseInt(req.query.page) || 1;
    //         const limit = parseInt(req.query.limit) || 10;
    //         const skip = (page - 1) * limit;

    //         const pharmacyMedicineList = await PharmacyMedicine.find({ pharmacyId: foundPharmacy._id })
    //             .sort({ _id: -1 })
    //             .skip(skip)
    //             .limit(limit)
    //             .populate('pharmacyId')
    //             .populate('medicineId');

    //         // Optional: Count total documents for pagination metadata
    //         const totalDocuments = await PharmacyMedicine.countDocuments({ pharmacyId: foundPharmacy._id });

    //         console.log("pharmacyMedicineList", pharmacyMedicineList);
    //         if (pharmacyMedicineList.length === 0) {
    //             return res.status(404).json({
    //                 code: 404,
    //                 message: "This pharmacy Medicine not found",
    //             });
    //         }

    //         res.json({
    //             code: 200,
    //             message: "Medicines by Pharmacies retrieved successfully",
    //             data: pharmacyMedicineList,
    //             pagination: {
    //                 currentPage: page,
    //                 totalPages: Math.ceil(totalDocuments / limit),
    //                 totalItems: totalDocuments,
    //                 pageSize: limit,
    //             },
    //         });
    //     } catch (error) {
    //         console.log(error);
    //         res.status(500).json({
    //             code: 500,
    //             error: error.name,
    //             message: error.message,
    //         });
    //     }
    // },

    getMedicineByPharmacy: async (req, res) => {
        try {
            const id = req.params.pharmacyId; //To seprate the id from the parameter

            const foundPharmacy = await Pharmacy.findById(id);
            if (!foundPharmacy) {
                return res.status(404).json({
                    code: 404,
                    message: "Pharmacy not found",
                });
            }
            
            const pharmacyMedicineList = await PharmacyMedicine.find({ pharmacyId: foundPharmacy._id }).sort({ _id: -1 })
            .populate('pharmacyId').populate('medicineId')

            console.log("pharmacyMedicineList", pharmacyMedicineList)
            if (pharmacyMedicineList.length === 0) {
                return res.status(404).json({
                    code: 404,
                    message: "This pharmacy Medicine not found"
                });
            }
            res.json({
                code: 200,
                message: "Medicines by Pharmacies retrieved successfully",
                data: pharmacyMedicineList
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

    updatePharmacyMedicine: async (req, res) => {
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
                    message: "id is required in params",
                });
            }

            const medicineId = req.body.medicineId;
            const isExistMedicine = await Medicine.findById(medicineId);
            if (!isExistMedicine) {
                return res.status(404).json({
                    code: 404,
                    message: "Medicine not found",
                });
            }

            const pharmacyId = req.body.pharmacyId;
            const isExistPharmacy = await Pharmacy.findById(pharmacyId);
            if (!isExistPharmacy) {
                return res.status(404).json({
                    code: 404,
                    message: "Pharmacy not found",
                });
            }

            if (req.body.medicineName) {
                isExistMedicine.medicineName = req.body.medicineName;
                await isExistMedicine.save(); // Save the updated medicine
            }
            const updateFields = {};
            const fieldsToUpdate = ['pharmacyId', 'medicineId', 'medicineQuantity', 'price'];
            fieldsToUpdate.forEach(field => {
                if (req.body[field] !== undefined) {
                    updateFields[field] = req.body[field];
                }
            });

            const updatedPharmacyMedicine = await PharmacyMedicine.findByIdAndUpdate(id, updateFields, { new: true });

            if (!updatedPharmacyMedicine) {
                return res.status(404).json({
                    code: 404,
                    message: "Pharmacy-Medicine not found",
                });
            }
            // Returning success message
            res.status(201).json({
                status: 201,
                message: "New Pharmacy-Medicine updated successfully",
                data: updatedPharmacyMedicine
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

    deletePharmacyMedicine: async (req, res) => {
        try {
           
            const id = req.params.id; //To seprate the id from the parameter
            if (!id) {
                return res.status(400).json({
                    message: "pahrmacy medicine id is required in params",
                });
            }

            const deletedPharmacyMedicine = await PharmacyMedicine.findByIdAndDelete(id);

            if (!deletedPharmacyMedicine) {
                return res.status(404).json({
                    code: 404,
                    message: "Pharmacy-Medicine not found",
                });
            }
            // Returning success message
            res.status(200).json({
                status: 200,
                message: "New Pharmacy-Medicine deleted successfully"
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

//#endregion

};
