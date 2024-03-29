// const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const { render } = require("ejs");
const { Sequelize, Op, DataTypes } = require("sequelize");


const db = require("@models/index");
const { successResponse, errorResponse } = require("@helper/helper");
const { check, validationResult } = require("express-validator");

class AuthController {

  static async login(req, res) {
    
    res.render('admin/login');
  }

  static async loginPost(req,res) {
    const secretKey = process.env.TOKENKEY;
    const { email, password } = req.body;
 
    try {

        let user = await db.admins.findOne({ where: { email: email } });
        
        if (!user) {
            return errorResponse(res, 401, "Invalid Email Address!");
        }


        console.log(user)
        console.log(user.password)
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return errorResponse(res, 401, "Invalid Password!");
        }
        

        const accessToken = jwt.sign({ user },secretKey );

      

        const data = { accessToken: accessToken, userInfo: user };

        // return res
        // .status(200)
        // .json(successResponse({ message: "Login Sucessfully", data: data }));

        return res.redirect('admin/Astrologerlist/list'); 

    } catch (e) {
      console.error(e); // Log the error
      res.render('error', { message: 'An error occurred while trying to log in.' });
    }
  }
}

module.exports =AuthController;