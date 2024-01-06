const { Sequelize, Op, DataTypes, where } = require("sequelize");

const db = require("@models/index");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { successResponse, errorResponse } = require("@helper/helper");
const { check, validationResult } = require("express-validator");

const { validateRating } = require("@CallsValidation/uer_review_validation");

class Usercontroller {
  static async userWallet(userId) {
    try {
      const result = await db.transactions.findOne({
        attributes: [
          [Sequelize.fn("SUM", Sequelize.col("amount")), "totalAmount"],
        ],
        where: {
          user_id: userId,
        },
      });

      const totalAmount = result.getDataValue("totalAmount");
      return totalAmount;
    } catch (e) {
      res.status(500).json(errorResponse({ message: e.message }));
    }
  }

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
          astrologer_id: astrologer_id,
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
            data: existingRoom,
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
      );
    } catch (e) {
      res.status(500).json(errorResponse({ message: e.message }));
    }
  }

  //  banners list
  static async list(req, res) {
    try {
      const banner = await db.banners.findAll();

      return res.status(200).json(
        successResponse({
          message: "banners list ",
          data: banner,
        })
      );
    } catch (e) {
      res.status(500).json(errorResponse({ message: e.message }));
    }
  }

  static async totalamount(req, res) {
    try {
      const sumamount = await db.transactions.sum("amount");

      return res.status(200).json(
        successResponse({
          message: "Total Balance",
          data: sumamount,
        })
      );
    } catch (e) {
      res.status(500).json(errorResponse({ message: e.message }));
    }
  }

  // function

  static async wallet(req, res) {
    try {
      const userId = req.user.user_id;
      const totalAmount = await Usercontroller.userWallet(userId);
      console.log(totalAmount);
      return res.json({ userId: userId, wallet: totalAmount });
    } catch (e) {
      res.status(500).json(errorResponse({ message: e.message }));
    }
  }

  static async deduct_balance(req, res) {
    try {
      const userId = req.user.user_id;
      const totalAmount = await Usercontroller.userWallet(userId);

      const orderId = `order_${new Date().getTime()}`;
      const { amount } = req.body;
      const user = await db.users.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error("user not found");
      }

      if (totalAmount < amount) {
        throw new Error("Insufficient funds");
      }

      const data = await db.transactions.create({
        user_id: userId,
        order_id: orderId,
        amount: -amount,
        type: "debit",
        payment_status: "sucess",
      });
      return res.status(200).json(
        successResponse({
          message: "Amount deducted and transaction recorded successfully",
          data: data,
        })
      );
    } catch (e) {
      res.status(500).json(errorResponse({ message: e.message }));
    }
  }
}

module.exports = Usercontroller;
