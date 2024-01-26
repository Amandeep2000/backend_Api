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

      return res.render("admin/user/list", {
        layout: `layout`,
        records: records,
      });
    } catch (e) {
      return res.status(400).json(errorResponse({ message: e.message }));
    }
  }
  static async get_create_user(req, res) {
    res.render("admin/user/create", { layout: `layout` });
  }

  static async post_create_user(req, res) {
    try {
      const data = await db.users.create({
        FullName: req.body.FullName,
        email: req.body.email,
        mobile_number: req.body.mobile_number,
        status: req.body.status,
        user_type: "user",
      });

      return res.render("admin/user/create", { layout: `layout` });
    } catch (e) {
      return res
        .status(500)
        .render("error", { message: "Internal Server Error" });
    }
  }
  //update
  static async updateget(req, res) {
    try {
      const { id } = req.params;
      const user = await db.users.findByPk(id);
      if (user) {
        return res.render("admin/user/update", {
          user: user,
          layout: "layout", // Assuming 'layout' is a template you want to use
        });
      } else {
        return res.status(404).send("user not found");
      }
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  }



  static async updatePost(req, res) {
    try {
      const { id } = req.params;
   

      const user = await db.users.update(
        {
          FullName: req.body.FullName,
          email: req.body.email,
          mobile_number: req.body.mobile_number,
        },
        {
          where: { id: id }, // 'where' clause to identify the record to update
        }
      );

      return res.render("admin/user/update", {
        user: user,
        layout: "layout", // Assuming 'layout' is a template you want to use
      });
    } catch (e) {
      return res.status(500).json({ success: false, message: e.message });
    }
  }


  static async delete(req, res) {
    try {
      const { id } = req.params;

      await db.users.destroy({ where: { id } });
      return res.json({
        success: true,
        message: " user deleted successfully",
      });
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  }

}

module.exports = UserController;
