const { check } = require('express-validator');
const db = require("@models/index");


const mobileNumberExists = async (value) => {
    const existinguser = await db.User.findOne({
        where: {
            mobile_number: value,
        },
    });
    if (!existinguser) {
        throw new Error("Mobile Number not found in our records");
    }
};

const MobileNumberRules = [
    check("mobile_number")
        .notEmpty()
        .withMessage("Mobile number field is required")
        .isLength({ max: 10 })
        .withMessage("Mobile number must be at least 10 characters")
        .custom(mobileNumberExists )
];



module.exports = MobileNumberRules;