const { validationResult } = require("express-validator");
const Area = require("../models/area");

module.exports = {
    createArea: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: 400,
                    message: "Validation error",
                    errors: errors.array()
                });
            }

            //creating a new area
            const newArea = new Area({
                ...req.body
            });
            const AreaDetails = await newArea.save();

            // Returning success message
            res.status(201).json({
                status: 201, 
                message: "New Area created successfully",
                data: AreaDetails,
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
    getArea: async (req, res) => {
        try {
            const areaList = await Area.find().sort({ _id: -1 });
            if (areaList.length === 0) {
                return res.status(404).json({
                    code: 404,
                    message: "No areas found"
                });
            }
            res.json({
                code: 200,
                message: "Areas retrieved successfully",
                data: areaList
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
    getAreaById: async (req, res) => {
        try {
            const id = req.params.id; //To seprate the id from the parameter

            const foundArea = await Area.findById(id);
            if (!foundArea) {
                return res.status(404).json({
                    code: 404,
                    message: "Area not found",
                });
            }
            res.json({
                code: 200,
                message: "Area retrieved successfully",
                data: foundArea
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                error: error.name,
                message: error.message,
            });
        }
    },
    updateArea: async (req, res) => {
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
            const fieldsToUpdate = ['areaName', 'area', 'city', 'country'];
            fieldsToUpdate.forEach(field => {
                if (req.body[field]) {
                    updateFields[field] = req.body[field];
                }
            });

            const updatedArea = await Area.findByIdAndUpdate(id, updateFields, { new: true });

            if (!updatedArea) {
                return res.status(404).json({
                    code:404,
                    message: "Area not found",
                });
            }

            // Return the updated Area
            res.status(200).json({
                code:200,
                message: "Area updated successfully",
                data: updatedArea,
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
    deleteArea: async (req, res) => {
        try {
            const id = req.params.id;

            const deletedArea = await Area.findByIdAndDelete(id);
            if (!deletedArea) {
                return res.status(404).json({
                    code:404,
                    message: "Area not found",
                });
            }

            res.status(200).json({
                code: 200,
                message: "Area deleted successfully"
            });
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