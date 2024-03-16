const { body } = require("express-validator");

module.exports = {
    // Validation middleware for New Pharmacy
    validateCreatePharmacy: [
        body('username')
            .notEmpty().withMessage('Username is required')
            .isString().withMessage('Username must be a string')
            .trim().withMessage('Username cannot have leading or trailing whitespace')
            .isLength({ min: 4 }).withMessage('Username must be at least 4 characters long'),

        body('password')
            .notEmpty().withMessage('Password is required')
            .isString().withMessage('Password must be a string')
            .trim().withMessage('Password cannot have leading or trailing whitespace')
            .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

        body('branchName')
            .notEmpty().withMessage('Branch name is required')
            .isString().withMessage('Branch name must be a string'),

        body('location.type')
            .notEmpty().withMessage('Location type is required')
            .isString().withMessage('Location type must be a string'),

        body('location.coordinates')
            .notEmpty().withMessage('Location coordinates are required')
            .isArray().withMessage('Location coordinates must be an array'),

        body('rating')
            .optional()
            .isNumeric().withMessage('Rating must be a number'),

        body('daysOpen')
            .optional()
            .isArray().withMessage('Days open must be an array'),

        body('openTime')
            .optional()
            .isString().withMessage('Open time must be a string'),

        body('services')
            .optional()
            .isObject().withMessage('Services must be an object'),

        body('areaId')
            .optional()
            .isMongoId().withMessage('Area ID must be a valid MongoDB ID'),

        body('mapUrl')
            .optional()
            .isString().withMessage('Map URL must be a string'),

        body('address')
            .optional()
            .isString().withMessage('Address must be a string')
    ],

    // Validation middleware for Update Pharmacy
    validateUpdatePharmacy: [
        body('branchName')
            .optional()
            .isString().withMessage('Branch name must be a string'),

        body('location.type')
            .optional()
            .isString().withMessage('Location type must be a string'),

        body('location.coordinates')
            .optional()
            .isArray().withMessage('Location coordinates must be an array'),

        body('rating')
            .optional()
            .isNumeric().withMessage('Rating must be a number'),

        body('daysOpen')
            .optional()
            .isArray().withMessage('Days open must be an array'),

        body('openTime')
            .optional()
            .isString().withMessage('Open time must be a string'),

        body('services')
            .optional()
            .isObject().withMessage('Services must be an object'),

        body('areaId')
            .optional()
            .isMongoId().withMessage('Area ID must be a valid MongoDB ID'),

        body('mapUrl')
            .optional()
            .isString().withMessage('Map URL must be a string'),

        body('address')
            .optional()
            .isString().withMessage('Address must be a string')
    ],
};
