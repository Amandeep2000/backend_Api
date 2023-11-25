const { check } = require('express-validator');

const  loginvalidetionRules = [
    
    check("mobile_number")
        .notEmpty()
        .withMessage("Mobile Number field is required")
        .isLength({ max: 10 })
        .withMessage("Mobile Number Must Be at Least 10 Characters"),
        check('otp')
        .notEmpty()
        .withMessage('OTP is required')
        .bail()
        .isLength({ min:6,max:6 })
        .withMessage('OTP must be 6 digits long')
        .bail()
        .isNumeric()
        .withMessage('OTP must contain only numbers')
];

module.exports = {
    loginvalidetionRules,
};