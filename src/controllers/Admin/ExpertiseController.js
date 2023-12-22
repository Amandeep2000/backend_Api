const { Sequelize, Op, DataTypes } = require("sequelize");

// const Sequelize = require('sequelize');
// const { Sequelize, Op, DataTypes } = require("sequelize");

const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("@models/index");

const { successResponse, errorResponse } = require("@helper/helper");

const { check, validationResult } = require("express-validator");

class ExpertiseController {
  static async list(req, res) {
    try {
      const { page, limit, search, order_field, order_sorting } = req.query;

      const offset = (page - 1) * limit;

      let orderClause = [];
      if (order_field && order_sorting) {
        orderClause.push([order_field, order_sorting]);
      } else {
        orderClause.push(["id", "DESC"]);
      }

      let whereClause = {};
      if (search) {
        whereClause = {
          [Op.or]: [
            { title: { [Op.like]: `%${search}%` } },
            { image: { [Op.like]: `%${search}%` } },
            // Add other fields here if you want to search in multiple columns
          ],
        };
      }

      // Use the where clause in your findAll query
      const allRecords = await db.expertise.findAll({
        where: whereClause,
        order: orderClause,
      });

      return res.render("admin/expertise/list", {
        layout: `layout`,
        expertise: allRecords,
      });
    } catch (e) {
      res.status(400).json(errorResponse({ message: e.message }));
    }
  }

  static async create(req, res) {
    res.render("admin/expertise/create", { layout: `layout` });
  }

  static async createpost(req, res) {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        let type = "expertise"; // The folder name for storing expertise images
        const dir = path.join(__dirname, "../../../uploads", type);

        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        cb(null, dir);
      },
      filename: function (req, file, cb) {
        let newFilename =
          file.fieldname + "-" + Date.now() + path.extname(file.originalname);
        cb(null, newFilename);
      },
    });

    const upload = multer({ storage: storage }).single("image");

    upload(req, res, async function (error) {
      try {
        if (error) {
          return res
            .status(404)
            .json({ success: false, message: error.message });
        }
        if (!req.file) {
          return res
            .status(404)
            .json({ success: false, message: "No file provided" });
        }

        // Here we're creating a record in the database with the title and image path
        const expertise = await db.expertise.create({
          title: req.body.title,
          image: `/uploads/expertise/${req.file.filename}`, // Adjust the path as needed
        });
        res.render("admin/expertise/create", { layout: `layout` });
        // res.json({ success: true, expertise: expertise });
      } catch (e) {
        res.status(404).json({ success: false, message: e.message });
      }
    });
  }




  static async updateget(req, res) {
    try {
      const { id } = req.params;
      const expertise = await db.expertise.findByPk(id);
      if (expertise) {
        return res.render("admin/expertise/update", {
          expertise:expertise,
          layout: "layout", // Assuming 'layout' is a template you want to use
        });
      } else {
        return res.status(404).send("Language not found");
      }
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  }
  
  static async updatepost(req, res) {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        let type = "expertise"; // The folder name for storing expertise images
        const dir = path.join(__dirname, "../../../uploads", type);
  
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
  
        cb(null, dir);
      },
      filename: function (req, file, cb) {
        let newFilename =
          file.fieldname + "-" + Date.now() + path.extname(file.originalname);
        cb(null, newFilename);
      },
    });
  
    const upload = multer({ storage: storage }).single("image");
  
    upload(req, res, async function (error) {
      try {
        const { id } = req.params; // Assuming you're passing the ID as a URL parameter
  
        if (error) {
          return res
            .status(500)
            .json({ success: false, message: error.message });
        }
  
        const updateValues = { title: req.body.title };
  
        if (req.file) {
          updateValues.image = `/uploads/expertise/${req.file.filename}`; // Adjust the path as needed
        }
  
        // Here we're updating a record in the database with the new title and image path
    const expertise=    await db.expertise.update(updateValues, {
          where: { id: id },
        });
  
        // Redirect to the list view, or send back a success response
        res.render("admin/expertise/update", {expertise: expertise, layout: `layout` });
      } catch (e) {
        res.status(500).json({ success: false, message: e.message });
      }
    });
  }
  


  
  static async  delete_expertis(req, res) {
    try {
      const { id } = req.params;
      await db.expertise.destroy({ where: { id } });
      res.json({ success: true, message: "Language deleted successfully" });
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  }
  
}

module.exports = ExpertiseController;
