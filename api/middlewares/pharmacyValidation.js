const { body } = require("express-validator");

module.exports = {
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

        body('longitude')
            .notEmpty().withMessage('longitude is required')
            .isNumeric().withMessage('longitude must be a number'),

        body('latitude')
            .notEmpty().withMessage('latitude is required')
            .isNumeric().withMessage('latitude must be a number'),

        body('rating')
            .notEmpty().withMessage('rating is required')
            .isNumeric().withMessage('Rating must be a number'),

        body('city')
            .optional()
            .isArray().withMessage('city must be an array'),

        body('country')
            .optional()
            .isString().withMessage('country must be a string'),

        body('areaName')
            .notEmpty().withMessage('Area Name is required')
            .isString().withMessage('Area must  be a string'),

        body('mapUrl')
            .notEmpty().withMessage('Map URL is required')
            .isString().withMessage('Map URL must be a string'),

        body('address')
            .notEmpty().withMessage('address is required')
            .isString().withMessage('Address must be a string')
    ],

    validateUpdatePharmacy: [
        body('branchName')
            .optional()
            .isString().withMessage('Branch name must be a string'),

        body('longitude')
            .optional()
            .isNumeric().withMessage('longitude must be a number'),

        body('latitude')
            .optional()
            .isNumeric().withMessage('latitude must be a number'),

        body('rating')
            .optional()
            .isNumeric().withMessage('Rating must be a number'),

        body('city')
            .optional()
            .isArray().withMessage('city must be an array'),

        body('country')
            .optional()
            .isString().withMessage('country must be a string'),

        body('areaName')
            .optional()
            .isString().withMessage('Area must  be a string'),


        body('mapUrl')
            .optional()
            .isString().withMessage('Map URL must be a string'),

        body('address')
            .optional()
            .isString().withMessage('Address must be a string')
    ],

    validateLoginPharmacy: [
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
    ],
};
