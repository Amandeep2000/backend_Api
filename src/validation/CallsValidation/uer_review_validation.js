const { check } = require('express-validator');

// ratingValidation.js
function validateRating(rating) {
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return { isValid: false, message: "Invalid rating" };
    }
    return { isValid: true };
  }
  
  module.exports = {
    validateRating
  };
  