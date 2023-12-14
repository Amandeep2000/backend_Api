const { check } = require('express-validator');
const db = require("@models/index");

const emailExists = async (value) => {
    const existinguser = await db.users.findOne({
        where: {
            email: value,
        },
    });
    if (existinguser) {
        throw new Error("Email is already in use");
    }
};

const mobileNumberExists = async (value) => {
    const existinguser = await db.users.findOne({
        where: {
            mobile_number: value,
        },
    });
    if (existinguser) {
        throw new Error("Mobile Number is already in use");
    }
};

const UserRegisterRules = [
    check("FullName")
        .notEmpty()
        .withMessage("Fullname field is required"),
    check("email")
        .notEmpty()
        .withMessage("Email field is required")
        .bail()
        .isEmail()
        .withMessage("Invalid email address")
        .custom(emailExists),
    check("mobile_number")
        .notEmpty()
        .withMessage("Mobile numberfield is required")
        .isLength({ min: 10, max: 10 })
        .withMessage("Mobile number must be at least 10 characters")
        .custom(mobileNumberExists),
];

module.exports = UserRegisterRules;