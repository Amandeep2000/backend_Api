const { Sequelize, Op, DataTypes } = require("sequelize");

const db = require("@models/index");

const { successResponse, errorResponse } = require("@helper/helper");
const { check, validationResult } = require("express-validator");
const { cache } = require("ejs");

class AstrologerController {
  
  static async Astrologer_list(req, res) {
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
      const user_type = { user_type: "astrologer" };

      const allRecords = await db.users.findAll({
        where: { [Sequelize.Op.and]: [whereClause, user_type] },
        order: orderClause,
        include: [
          { model: db.astrologer_meta, as: "AstrologerMeta" },
          { model: db.expertise, as: "astrologerexpertise" },
        ],
      });

      const records = allRecords.slice(offset, parseInt(limit, 10) || 10);
      return res.render("admin/Astrologerlist/list", {
        layout: `layout`,
        records: records,
      });
    } catch (e) {
      console.error(e); // Log the full error stack for debugging
      return res.status(400).render("error", { message: e.message });
    }
  }

  static async toggle_astrologer_blocking(req, res) {
    try {
      const { id } = req.body; // Make sure to name your input field 'astrologerId'
      // const user_Id = req.user.user_id;
      const astrologer = await db.users.findOne({
        where: { id: id },
      });

      if (astrologer && astrologer.user_type === "astrologer") {
        astrologer.status =
          astrologer.status === "active" ? "inactive" : "active";
        await astrologer.save();
        res.redirect("/admin/Astrologerlist/list");
      } else {
        res.status(404).send("Astrologer not found");
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
  
  static async getprofile(req, res) {
    try {
      const { id } = req.params;
      // Fetch data from database
      const RecordById = await db.users.findOne({
        where: { id, user_type: "astrologer" },
        include: [
          { model: db.astrologer_meta, as: "AstrologerMeta" },
          { model: db.expertise, as: "astrologerexpertise" },
        ],
      });

      // Check if the record exists
      if (
        !RecordById ||
        !RecordById.AstrologerMeta ||
        !RecordById.astrologerexpertise
      ) {
        return res.status(404).render("error", { message: "User Not Found" });
      }

      // Render the profile page
      res.render("admin/profile", { layout: `layout`, astrologer: RecordById });
    } catch (error) {
      res.status(500).render("error", { message: "Internal Server Error" });
    }
  }

  static async get_create_astrologer(req, res) {
    res.render("admin/Astrologerlist/create", { layout: `layout` });
  }

  static async post_create_astrologer(req, res) {
    try {
      const data = await db.users.create({
        FullName: req.body.FullName,
        email: req.body.email,
        mobile_number: req.body.mobile_number,
        status: req.body.status,
      });

      return res.render("admin/Astrologerlist/create", { layout: `layout` });
    } catch (e) {
      return res
        .status(500)
        .render("error", { message: "Internal Server Error" });
    }
  }

  static async updateget(req, res) {
    try {
      const { id } = req.params;
      const user = await db.users.findByPk(id);
      if (user) {
        return res.render("admin/Astrologerlist/update", {
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

      return res.render("admin/Astrologerlist/update", {
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
        message: "Astrologer deleted successfully",
      });
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  }
}

module.exports = AstrologerController;
