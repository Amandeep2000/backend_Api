const { Sequelize, Op, DataTypes } = require("sequelize");


const db = require("@models/index");
// const { apiresponse } = require("@helper/helper");
const { successResponse, errorResponse } = require("@helper/helper");
const { check, validationResult } = require("express-validator");
const user = require("../services/db/models/user");





class Astrologer_meta {
  //pending 
  static async Astrologer(req, res) {
    try {
      const {
        user_id,
        profile_pic,
        status,
        description,
        is_profile_verified,
        languages,
        experience,
        Charges,
        charge_type,
        referral_code,
        is_recommended,
      } = req.body;

      const adduser = await db.User.create({
        user_id: user_id,
        profile_pic: profile_pic,
        description: description,
        status: status,
        is_profile_verified: is_profile_verified,
        languages: languages,
        experience: experience,
        Charges: Charges,
        charge_type: charge_type,
        referral_code: referral_code,
        is_recommended: is_recommended,
      });


      return res.status(200).json(successResponse({ message: "Success", adduser }));
    } catch (e) {
      return res.status(400).json(errorResponse({ message: e.message }));
    }
  }

  static async list(req, res) {
    try {
      const { page,  limit, search, order_field, order_sorting } = req.query;

      // console.log( limit);
      const offset = (page - 1) *  limit;
     
      const orderClause = [];

      if (order_field && order_sorting) {
        orderClause.push([order_field, order_sorting]);
      } else {
        orderClause.push(["id", "DESC"]);
      }

      let whereClause = {};
      let title = "";
      if (search) {
        whereClause = {
          [Op.or]: [
            { email: { [Op.like]: `%${search}%` } },
            { FullName: { [Op.like]: `%${search}%` } },
          ],
        };
      }
      const user_type = { user_type: "astrologer" };


      const allRecords = await db.User.findAll({
        where: {
          [Sequelize.Op.and]: [whereClause, user_type],
        },
       
        order: orderClause,
          
        include: [
          {
            model: db.astrologer_meta,
            as: "AstrologerMeta",
          },
          {
            model: db.ExpertiseList,
            as: "astrologerexpertise",
          },
        ],
        //  offset: 5, limit: 5
       });

      const records = allRecords.slice(offset, offset + limit);
      return res.status(200).json(successResponse({ message: "Success", data: records }));

    } catch (e) {
      return res.status(400).json(errorResponse({ message: e.message }));
    }
  }

  static async show(req, res) {
    try {
//pending
      const { id } = req.params;

     
      const RecordById = await db.User.findOne({
        where: { id,user_type: 'astrologer' },
        include: [
          {
            model: db.astrologer_meta,
            as: "AstrologerMeta",
          },
          {
            model: db.ExpertiseList,
            as: "astrologerexpertise",
          },
        ],
      });

      if (!RecordById.AstrologerMeta || !RecordById.astrologerexpertise) {
        return res.status(400).json(errorResponse({ message: "Invalid Data" }));
      }         

      if (!RecordById) {
        return res.status(400).json(errorResponse({ message: "Invalid User" }));
      }


      return res.status(200).json(successResponse({ message: "Profile Show", data: RecordById }));
    } catch (e) {

      res.status(400).json(errorResponse({ message: e.message }));
    }
  }


  static async ToggelFolllow(req, res) {
    const { id } = req.params;

    try {
      const user_Id = req.user.user_id;



      const astrologerdata = await db.User.findOne({
        where: { id },
      });

      if (!astrologerdata || astrologerdata.user_type !== 'astrologer') {


        return res.status(400).json(errorResponse({ message: "Only astrologers can perform this action" }));


      }
      const isFollowing = await db.followers.findOne({
        where: {
          user_id: id,
          followed_by: user_Id,
        },
      });

      if (isFollowing) {
        await isFollowing.destroy();

        return res.status(200).json(successResponse({ message: "Successfully unfollowed" }));
      } else {
        const follow = await db.followers.create({
          user_id: id,
          followed_by: user_Id,
        });

        return res.status(200).json(successResponse({ message: "Successfully followed", data: follow }));
      }
    } catch (e) {
      res.status(400).json(errorResponse({ message: e.message }));
    }
  }
}

module.exports = Astrologer_meta;
