const { body } = require("express-validator");

module.exports = {
    validateCreateMedicine: [
        body('medicineName')
            .notEmpty().withMessage('Medicine name is required')
            .isString().withMessage('Medicine name must be a string'),
    ],

    validateUpdateMedicine: [
        body('medicineName')
            .optional()
            .isString().withMessage('Medicine name must be a string'),
    ],
};
