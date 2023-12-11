const { DataTypes } = require("sequelize");
const jwt = require("jsonwebtoken");
const db = require("@models/index");
const { successResponse, errorResponse } = require("@helper/helper"); 
const { validationResult } = require("express-validator");
const { addToInvalidatedTokens } = require("@helper/tokenmanager");
const { loginvalidetionRules } = require("@AuthValidation/loginvalidation");
const UserRegisterRules = require("@AuthValidation/UserRegister");
const AstrologerRegisterRules = require("@AuthValidation/AstrologerRegister");
const MobileNumberRules = require("@AuthValidation/MobileNumberValidation");

class controllers {

  static async UserRegister(req, res) {
    try {
      const {
        FullName,
        email,
        mobile_number,
        is_verified = 1,
        status = "active",
   
      } = req.body;

      await Promise.all(
        UserRegisterRules.map((validation) => validation.run(req))
      );
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const registerUser = await db.User.create({
        FullName: FullName,
        email: email,
        mobile_number: mobile_number,
        is_verified: is_verified,
        status: status,
        // social_identifier: social_identifier,
        user_type: 'user',
      });

      const userMobileNo = registerUser.mobile_number;

      const token = jwt.sign(
        { user_id: registerUser._id, userMobileNo },
        process.env.TOKENKEY
      );

      const data = {
        Acesstoken: token,
        userinfo: registerUser,
      };

    

      
      res.status(200).json(successResponse({message:"Registration Successfully",data:data}));

    } catch (e) {

      res.status(400).json(errorResponse({message:e.message}));
    }
  }


  // create regiser apis two table data add user and astologer data
  static async AstrologerRegister(req, res) {

    const transaction = await db.sequelize.transaction();

    try {

      await Promise.all(
        AstrologerRegisterRules.map((validation) => validation.run(req))
      );

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        FullName,
        email,
        mobile_number,
      } = req.body;

      const astrologerRegister = await db.User.create({
        FullName: FullName,
        email: email,
        mobile_number: mobile_number,
        user_type: 'astrologer',
        otp: "222333"
      });


      const userMobileNo = astrologerRegister.mobile_numberr;

      const token = jwt.sign(
        { user_id: astrologerRegister.id, userMobileNo },
        process.env.TOKENKEY
      );

      const data = {
        Acesstoken: token,
        userinfo: astrologerRegister,
      };

      await transaction.commit();

      res.status(200).json(successResponse({message: "Register  Successfully",data:data}));

    } catch (e) {
      await transaction.rollback();
      res.status(400).json(errorResponse({message:e.message}));
    }
  }


  static async astrologerMeta(req, res) {
    try {

      const {
        user_id,
        is_profile_verified,
        languages,
        experience,
        Charges,
        description,
        charge_type,
        referral_code,
        expertise,
        profile_pic } = req.body


      
      const [astrologerUser,created] = await db.astrologer_meta.findOrCreate({
        where: { user_id: user_id },
        defaults: {
          is_profile_verified,
          languages,
          experience,
          Charges,
          charge_type,
          referral_code,
          description,
          profile_pic
        }
      });

      if (!created) {
        // The record already exists, so we update it
        await astrologerUser.update({
          is_profile_verified,
          languages,
          experience,
          Charges,
          charge_type,
          referral_code,
          description,
          profile_pic
        });
      }

      

      const expertiesarray = [];
      const SelectedArray = expertise.split(",");
      const conditionSelected = SelectedArray.length > 0 ? SelectedArray : [];

      conditionSelected.forEach((expId) => {
        expertiesarray.push({ expertise_id: expId, user_id: user_id });
      });

      const expertiseInserted = await db.AstrologerExpertise.bulkCreate(
        expertiesarray
      );

      res.status(200).json(successResponse({message: "Profile updated !"}));
    }
    catch (e) {
      res.status(400).json(errorResponse({message:e.message}));
    }

  }



  static async getUserByPhoneNumber(req, res) {
    try {



      await Promise.all(MobileNumberRules.map(rule => rule.run(req)));

      // Check for validation errors 
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }


      const { mobile_number } = req.body;


      if (!mobile_number) {

        return res.status(400).send('Phone number is required');

      }

      const user = await db.User.findOne({
        where: { mobile_number: mobile_number },
      });


      if (!user) {
        return res.status(400).json(errorResponse({message:"Invalid Credentials",mobile_number}));
      }

      return res.status(200).json(successResponse({message: "OTP generated successfully"}));
    }
    catch (e) {
  
      res.status(400).json(errorResponse({message:e.message}));
    }
  }                                                                


  static async login(req, res) {
    
    try {
      //validation
      await Promise.all(
        loginvalidetionRules.map((validation) => validation.run(req))
      );

      // Check for validation errors

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {  mobile_number,otp } = req.body;

      const user = await db.User.findOne({
        where: { mobile_number: mobile_number },
      });

      if (!user) {
        return res.status(400).json(errorResponse({message:"Invalid Credentials"}));
      }

      if (user.otp !== otp) {
        return res.status(400).json(errorResponse({message:"Invalid OTP"}));
      }

      const token = jwt.sign(
        { user_id: user.id, mobile_number },
        process.env.TOKENKEY
      );

      const data = {
        Acesstoken: token,
        userinfo: user,
      };

      return res.status(200).json(successResponse({message:"Login Sucessfully" , data:data}));
    } catch (e) {
      res.status(400).json(errorResponse({message:e.message}));
      
    }
  }

  static logout(req, res) {
    const secretKey = process.env.TOKENKEY;
    const token = req.header("Authorization");

    if (!token) {
      // return apiresponse(res, 400, "NO token provide");
     return res.status(400).json(errorResponse({message:"NO token provided"}));
    }

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        // return apiresponse(res, 400, "Invalide token");
        return res.status(400).json(errorResponse({message:"Invalide token"}));
      }


      addToInvalidatedTokens(token);

      // apiresponse(res, 200, " Logout Sucessfully ! ");
      return res.status(200).json(successResponse({message:"Logout Sucessfully"}));
    });

  }





}

module.exports = controllers;
