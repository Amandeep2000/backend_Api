const { Sequelize, Op, DataTypes } = require("sequelize");




// const Sequelize = require('sequelize');
// const { Sequelize, Op, DataTypes } = require("sequelize");

const db = require("@models/index");

const { successResponse, errorResponse } = require("@helper/helper");

const { check, validationResult } = require("express-validator");


class ExpertiseController{

    static async expertiseList(req, res) {
        try {
          const { page, limit, search, order_field, order_sorting } = req.query;
    
          const offset = (page - 1) * limit;
    
          let orderClause = [];
          if (order_field && order_sorting) {
            orderClause.push([order_field, order_sorting]);
          } else {
            orderClause.push(['id', 'DESC']);
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
          const allRecords = await db.expertise_lists.findAll({
            where: whereClause,
            order: orderClause,
            });
    
    
    
            return res.render('pages/Expertiselist', {layout:`layout`,records:allRecords, });
        } catch (e) {
          res.status(400).json(errorResponse({ message: e.message }));
        }
    
      }
    

}


module.exports =ExpertiseController;