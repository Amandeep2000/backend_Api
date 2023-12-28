const { Sequelize, Op, DataTypes } = require("sequelize");

const db = require("@models/index");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

class BannerController {
 
 
    static async create(req, res) {
    res.render("admin/banners/create", { layout: `layout` });
  }

  static async createpost(req, res) {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        let type = "banners"; // The folder name for storing expertise images
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

    const upload = multer({ storage: storage }).single("banner");

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
        const banners = await db.banners.create({
          banner: `/uploads/banners/${req.file.filename}`, // Adjust the path as needed
        });
        res.render("admin/banners/create", { layout: `layout` });
        // res.json({ success: true, expertise: expertise });
      } catch (e) {
        res.status(404).json({ success: false, message: e.message });
      }
    });
  }

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
      const allRecords = await db.banners.findAll({
        where: whereClause,
        order: orderClause,
      });

      return res.render("admin/banners/list", {
        layout: `layout`,
        banners: allRecords,
      });
    } catch (e) {
      res.status(400).json(errorResponse({ message: e.message }));
    }
  }

  static async updateget(req, res) {
    try {
      const { id } = req.params;
      const banner = await db.banners.findByPk(id);
      if (banner) {
        return res.render("admin/banners/update", {
          banners: banner,
          layout: "layout", // Assuming 'layout' is a template you want to use
        });
      } else {
        return res.status(404).send("Language not found");
      }
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  }

  static async update(req, res) {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        const dir = path.join(__dirname, "../../../uploads/banners");

        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        cb(null, dir);
      },
      filename: function (req, file, cb) {
        const newFilename = `banner-${Date.now()}${path.extname(
          file.originalname
        )}`;
        cb(null, newFilename);
      },
    });

    const upload = multer({ storage: storage }).single("banner");

    upload(req, res, async function (error) {
      try {
        const { id } = req.params; // Assuming you're passing the ID as a URL parameter

        if (error) {
          return res
            .status(500)
            .json({ success: false, message: error.message });
        }

        if (!req.file) {
          return res
            .status(400)
            .json({ success: false, message: "No banner image provided." });
        }

        const updateValues = {
          banner: `/uploads/banners/${req.file.filename}`, // Use the path relative to your public directory
        };

        const benners = await db.banners.update(updateValues, {
          where: { id: id },
        });

        // Redirect to the list view, or send back a success response
        res.redirect("/admin/banners/list"); // Adjust the redirect to your banners list page
      } catch (e) {
        res.status(500).json({ success: false, message: e.message });
      }
    });
  }

  static async delete_banner(req, res) {
    try {
      const { id } = req.params;
      await db.banners.destroy({ where: { id } });
      res.json({ success: true, message: "Language deleted successfully" });
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  }
}

module.exports = BannerController;
