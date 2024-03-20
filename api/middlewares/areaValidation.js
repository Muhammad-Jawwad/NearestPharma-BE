const { body } = require("express-validator");

module.exports = {
    validateCreateArea: [
        body('areaName')
            .notEmpty().withMessage('Area name is required')
            .isString().withMessage('Area name must be a string'),

        body('area')
            .notEmpty().withMessage('Area is required')
            .isString().withMessage('Area must be a string'),

        body('city')
            .notEmpty().withMessage('City is required')
            .isString().withMessage('City must be a string'),

        body('country')
            .notEmpty().withMessage('Country is required')
            .isString().withMessage('Country must be a string')
            .custom((value) => {
                if (value.toUpperCase() !== 'PK') {
                    throw new Error('Country must be "PK"');
                }
                return true;
            }),
    ],

    validateUpdateArea: [
        body('areaName')
            .optional()
            .isString().withMessage('Area name must be a string'),

        body('area')
            .optional()
            .isString().withMessage('Area must be a string'),

        body('city')
            .optional()
            .isString().withMessage('City must be a string'),

        body('country')
            .optional()
            .isString().withMessage('Country must be a string')
            .custom((value) => {
                if (value.toUpperCase() !== 'PK') {
                    throw new Error('Country must be "PK"');
                }
                return true;
            }),
    ],
};
