const { Sequelize, Op, DataTypes } = require("sequelize");

const db = require("@models/index");

const { successResponse, errorResponse } = require("@helper/helper");
const { check, validationResult } = require("express-validator");

class appController {
  static async app_feedback(req, res) {
    const { title, description } = req.body;
    const user_id = req.user.user_id;

    const data = await db.app_feedback.create({
      user_id: user_id,
      title: title,
      description: description,
    });

    return res.status(200).json(
      successResponse({
        message: "success",                        
        data: data,
      })
    );
  }
}


module.exports = appController;
