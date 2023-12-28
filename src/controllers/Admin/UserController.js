const { Sequelize, Op, DataTypes } = require("sequelize");

const db = require("@models/index");

const { successResponse, errorResponse } = require("@helper/helper");
const { check, validationResult } = require("express-validator");

class UserController {
  static async User_list(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        order_field,
        order_sorting,
      } = req.query;

      const offset = (page - 1) * limit;
      const orderClause =
        order_field && order_sorting
          ? [[order_field, order_sorting]]
          : [["id", "DESC"]];

      let whereClause = {};
      if (search) {
        whereClause = {
          [Op.or]: [
            { email: { [Op.like]: `%${search}%` } },
            { FullName: { [Op.like]: `%${search}%` } },
            { mobile_number: { [Op.like]: `%${search}%` } },
          ],
        };
      }
      const user_type = { user_type: "user" };

      const allRecords = await db.users.findAll({
        where: { [Sequelize.Op.and]: [whereClause, user_type] },
        order: orderClause,
      });

      const records = allRecords.slice(offset, parseInt(limit, 10) || 10);

      return res.render("pages/Userlist", {
        layout: `layout`,
        records: records,
      });
    } catch (e) {
      return res.status(400).json(errorResponse({ message: e.message }));
    }
  }

 
}

module.exports = UserController;
