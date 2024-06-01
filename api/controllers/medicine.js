const { validationResult } = require("express-validator");
const Medicine = require("../models/medicine");
const { findOne } = require("../models/area");

module.exports = {
    createMedicine: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: 400,
                    message: "Validation error",
                    errors: errors.array()
                });
            }

            const isExist = await Medicine.findOne({
                medicineName: req.body.medicineName
            })
            if (isExist){
                return res.status(404).json({
                    code: 404,
                    message: "This medicine already exist",
                });
            }

            //creating a new area
            const newMedicine = new Medicine({
                ...req.body
            });
            const MedicineDetails = await newMedicine.save();

            // Returning success message
            res.status(201).json({
                status: 201,
                message: "New Medicine created successfully",
                data: MedicineDetails,
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

    getMedicine: async (req, res) => {
        try {
            const medicineList = await Medicine.find().sort({ _id: 1 });
            if (medicineList.length === 0) {
                return res.status(404).json({
                    code: 404,
                    message: "No medicines found"
                });
            }
            res.json({
                code: 200,
                message: "Medicines retrieved successfully",
                data: medicineList
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

    getMedicineById: async (req, res) => {
        try {
            const id = req.params.id; //To seprate the id from the parameter

            const foundMedicine = await Medicine.findById(id);
            if (!foundMedicine) {
                return res.status(404).json({
                    code: 404,
                    message: "Medicine not found",
                });
            }
            res.json({
                code: 200,
                message: "Medicine retrieved successfully",
                data: foundMedicine
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                error: error.name,
                message: error.message,
            });
        }
    },
    
    updateMedicine: async (req, res) => {
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

            const updateFields = {};
            const fieldsToUpdate = ['medicineName'];
            fieldsToUpdate.forEach(field => {
                if (req.body[field]) {
                    updateFields[field] = req.body[field];
                }
            });

            const updatedMedicine = await Medicine.findByIdAndUpdate(id, updateFields, { new: true });

            if (!updatedMedicine) {
                return res.status(404).json({
                    code: 404,
                    message: "Medicine not found",
                });
            }

            // Return the updated Medicine
            res.status(200).json({
                code: 200,
                message: "Medicine updated successfully",
                data: updatedMedicine,
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

    searchMedicineByName: async (req, res) => {
        try {
            const { name } = req.query; // Get the medicine name from the query parameter
            if (!name) {
                return res.status(400).json({
                    code: 400,
                    message: "Medicine name is required"
                });
            }

            console.log("name", name)
            const medicines = await Medicine.find({
                medicineName: { $regex: name, $options: 'i' } // Case-insensitive search
            });

            if (medicines.length === 0) {
                return res.status(404).json({
                    code: 404,
                    message: "No medicines found"
                });
            }

            res.json({
                code: 200,
                message: "Medicines retrieved successfully",
                count: medicines.length,
                data: medicines,
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

}