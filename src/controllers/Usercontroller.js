const { Sequelize, Op, DataTypes, where } = require("sequelize");

const db = require("@models/index");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { successResponse, errorResponse } = require("@helper/helper");
const { check, validationResult } = require("express-validator");

const { validateRating } = require("@CallsValidation/uer_review_validation");

class Usercontroller {
  static async history(req, res) {
    try {
      const userId = req.user.user_id;
      // console.log(userId);
      const history = await db.call_schedule.findAll({
        where: {
          booked_by: userId,
          status: "completed",
        },
        include: [
          {
            model: db.users,
            as: "astrologer",
            attributes: ["FullName"],
            include: [
              {
                model: db.astrologer_meta,
                as: "AstrologerMeta",
                attributes: ["profile_pic"],
              },
            ],
          },
          {
            model: db.astrologer_availabilities,
            as: "astrologer_availabilities",
            attributes: ["date", "time"],
          },
        ],

        order: [["datetime", "DESC"]],
      });

      return res.status(200).json(
        successResponse({
          message: "Work successfully",
          data: history,
        })
      );
    } catch (e) {
      res.status(500).json(errorResponse({ message: e.message }));
    }
  }

  static async chat_rooms(req, res) {
    try {
      const userId = req.user.user_id;
      const { astrologer_id } = req.body;

      const existingRoom = await db.chat_rooms.findOne({
        where: {
          user_id: userId,
          astrologer_id: astrologer_id
        },
        include: [
            {
              model: db.users,
              as: "astrologer",
              attributes: ["FullName"],
              include: [
                {
                  model: db.astrologer_meta,
                  as: "AstrologerMeta",
                  attributes: ["profile_pic"],
                },
              ],
            },
          ],
      });
  
      
      if (existingRoom) {
        return res.status(200).json(
          successResponse({
            message: "Room already exists",
            data: existingRoom
          })
        );
      }

      const newroom = await db.chat_rooms.create({
        user_id: userId,
        astrologer_id: astrologer_id,
      });
      return res.status(200).json(
        successResponse({
          message: "room create successfully",
          data: newroom,
        })
      );
    } catch (e) {
      res.status(500).json(errorResponse({ message: e.message }));
    }
  }

  static async chat_room_list(req, res) {
    try {
      const data = await db.chat_rooms.findAll({
        include: [
          {
            model: db.users,
            as: "astrologer",
            attributes: ["FullName"],
            include: [
              {
                model: db.astrologer_meta,
                as: "AstrologerMeta",
                attributes: ["profile_pic"],
              },
            ],
          },
        ],
      });


      

      return res.status(200).json(
        successResponse({
          message: "Success",
          data: data,
        })  
      )
      
    } catch (e) {
      res.status(500).json(errorResponse({ message: e.message }));
    }
  }


 //  banners list 
 static async list(req, res)
 {
  try 
  {

  

    const  banner = await db.banners.findAll();

    return res.status(200).json(
      successResponse({
        message: "banners list ",
        data:  banner,
      })  
    )
  
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message
    });
  }
}






}

module.exports = Usercontroller;
