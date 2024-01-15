const { check } = require('express-validator');
const db = require("@models/index");

// astrologerMetaValidator.js


const { Op } = require('sequelize');

async function validateAstrologerMeta({ user_id, email, mobile_number }) {
  // Fetch the user by primary key
  const user = await db.users.findByPk(user_id);
  if (!user) {
    throw new Error('User not found.');
  }

  // Validate email uniqueness
  if (email && email !== user.email) {
    const emailExists = await db.users.findOne({
      where: {
        email,
        id: { [Op.ne]: user_id }
      }
    });

    if (emailExists) {
      throw new Error('Email is already in use by another user.');
    }
  }

  // Validate mobile number uniqueness
  if (mobile_number && mobile_number !== user.mobile_number) {
    const mobileExists = await db.users.findOne({
      where: {
        mobile_number,
        id: { [Op.ne]: user_id }
      }
    });

    if (mobileExists) {
      throw new Error('Mobile number is already in use by another user.');
    }
  }
}

module.exports = {
  validateAstrologerMeta
};


