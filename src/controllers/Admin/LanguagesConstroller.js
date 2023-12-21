const { Sequelize, Op, DataTypes } = require("sequelize");

// const Sequelize = require('sequelize');
// const { Sequelize, Op, DataTypes } = require("sequelize");

const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("@models/index");

const { successResponse, errorResponse } = require("@helper/helper");

const { check, validationResult } = require("express-validator");
const { render } = require("ejs");


class languagesController
{
    static async   List(req,res)
    {  
      try {
        const { page = 1, limit = 10, search, order_field, order_sorting } = req.query;

        const offset = (page - 1) * limit;
    
        let orderClause = order_field && order_sorting ? [[order_field, order_sorting]] : [['id', 'DESC']];
    
        let whereClause = {};
        if (search) {
          whereClause = {
            [Op.or]: [
              { title: { [Op.like]: `%${search}%` } },
              // Add other searchable fields here
            ],
          };
        }
    
        const allRecords = await db.languages.findAll({
          where: whereClause,
          order: orderClause,
          offset,
          limit: parseInt(limit),
        });
    
        // Render the EJS template with the data
     return   res.render('admin/languages/list', { layout: `layout`, records: allRecords });
        

      } catch (e) {
        res.status(400).json(errorResponse({ message: e.message }));
      }
    
    }


    static async create(req, res) {
        res.render("admin/languages/create",{layout:`layout`});
      }


      static async createpost(req, res) {
       
          try {   
      
            // Here we're creating a record in the database with the title and image path
            const expertise = await db.languages.create({
              title: req.body.title,
            });
            return  res.render("admin/languages/create",{layout:`layout`});
            // res.json({ success: true, expertise: expertise });
          } catch (dbError) {
            res.status(500).json({ success: false, message: dbError.message });
          }
        
      }

}


module.exports=languagesController;