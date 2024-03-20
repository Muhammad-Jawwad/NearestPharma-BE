const { body } = require("express-validator");

module.exports = {
    validateCreatePharmacyMedicine: [
        body('pharmacyId')
            .notEmpty().withMessage('pharmacyId is required')
            .isMongoId().withMessage('Pharmacy ID must be a valid MongoDB ID'),

        body('medicineId')
            .notEmpty().withMessage('medicineId is required')
            .isMongoId().withMessage('Medicine ID must be a valid MongoDB ID'),

        body('medicineQuantity')
            .notEmpty().withMessage('medicineQuantity is required')
            .isNumeric().withMessage('medicineQuantity must be a number'),
    ],

    validateUpdatePharmacyMedicine: [
        body('pharmacyId')
            .notEmpty().withMessage('pharmacyId is required')
            .isMongoId().withMessage('Pharmacy ID must be a valid MongoDB ID'),

        body('medicineId')
            .notEmpty().withMessage('medicineId is required')
            .isMongoId().withMessage('Medicine ID must be a valid MongoDB ID'),

        body('medicineQuantity')
            .notEmpty().withMessage('medicineQuantity is required')
            .isNumeric().withMessage('medicineQuantity must be a number'),
    ],
};
