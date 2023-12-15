const { check } = require('express-validator');
const db = require("@models/index");


const mobileNumberExists = async (value) => {
    const existinguser = await db.users.findOne({
        where: {
            mobile_number: value,
        },
    });
    if (!existinguser) {
        throw new Error("Mobile number not found in records.");
    }
};

const MobileNumberRules = [
    check("mobile_number")
        .notEmpty()
        .withMessage("Mobile number field is required")
        .isLength({ min: 10, max: 10 })
        .withMessage("Mobile number must be at least 10 characters")
        .custom(mobileNumberExists )
];



module.exports = MobileNumberRules;