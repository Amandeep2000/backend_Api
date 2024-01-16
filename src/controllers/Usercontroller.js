const { Sequelize, Op, DataTypes, where } = require("sequelize");

const db = require("@models/index");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { successResponse, errorResponse } = require("@helper/helper");
const { check, validationResult } = require("express-validator");
const Expo = require("expo-server-sdk");
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
      const astrologer_id = req.user.user_id;
      const { user_id } = req.body;

      const existingRoom = await db.chat_rooms.findOne({
        where: {
          user_id: user_id,
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
        user_id: user_id,
        astrologer_id: astrologer_id,
        status: "active",
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
      const userId = req.user.user_id;

      const data = await db.chat_rooms.findAll({
        where: { user_id: userId },
        include: [
          {
            model: db.users,
            as: "astrologer",
            attributes: ["FullName"],
            include: [
              {
                model: db.astrologer_meta,
                as: "AstrologerMeta",
                attributes: ["profile_pic", "Charges", "charge_type"],
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
      const { amount, astrologerId } = req.body;
      const user = await db.users.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error("user not found");
      }
      if (totalAmount <= 0) {
        throw new Error("Balance not available");
      }

      if (totalAmount < amount) {
        throw new Error("Insufficient funds");
      }

      const userdata = await db.transactions.create({
        user_id: userId,
        order_id: orderId,
        amount: -amount,
        type: "debit",
        payment_status: "payment send sucess",
      });

      const astrologer = await db.transactions.create({
        user_id: astrologerId,
        order_id: orderId,
        amount: amount,
        type: "credit",
        payment_status: "Payment received",
      });

      return res.status(200).json(
        successResponse({
          message: "Amount transferred successfully",
        })
      );
    } catch (e) {
      res.status(500).json(errorResponse({ message: e.message }));
    }
  }

  static async chatend_astrologer(req, res) {
    try {
      const { id } = req.params;
      const user_Id = req.user.user_id;
      console.log(user_Id);
      const chatRoom = await db.chat_rooms.findOne({
        where: {
          id: id,
          user_id: user_Id,
        },
      });

      if (!chatRoom) {
        return res.status(404).json(
          errorResponse({
            message: "Chat room not found or not associated with this user.",
          })
        );
      }

      chatRoom.status = "end";
      await chatRoom.save();
      return res.status(200).json(
        successResponse({
          message: "Chat session ended successfully",
          data: chatRoom,
        })
      );
    } catch (e) {
      return res.status(500).json(errorResponse({ message: e.message }));
    }
  }

  static async wallet_histroy(req, res) {
    try {
      const userId = req.user.user_id; // Get user ID from authenticated user

      const totalAmount = await Usercontroller.userWallet(userId);

      const transactions = await db.transactions.findAll({
        where: { user_id: userId },
        order: [["createdAt", "DESC"]],
      });

      const formattedTransactions = transactions.map((t) => ({
        date: t.createdAt,
        description: t.description,
        amount: parseFloat(t.amount).toFixed(2), // Format amount as a fixed decimal
        type: t.type,
      }));

      const data = {
        totalAmount: parseFloat(totalAmount).toFixed(2),
        data: formattedTransactions,
      };

      return res.status(200).json(
        successResponse({
          message: "user wallet-historey sucessfully",
          data: data,
        })
      );
    } catch (error) {
      res.json(errorResponse(res, error.message));
    }
  }

  // static async notification(req, res) {
  //   try {
  //     let messages = [];
  //     //const pushTokens = await PushToken.findAll();
  //     const somePushTokens = abcdefghijklmnopqrstuvwxyz123456;
  //     for (let pushToken of somePushTokens) {
  //       if (!Expo.isExpoPushToken(pushToken)) {
  //         console.error(
  //           `Push token ${pushToken} is not a valid Expo push token`
  //         );
  //         continue;
  //       }

  //       messages.push({
  //         to: pushToken,
  //         sound: "default",
  //         body: "This is a test notification",
  //         data: { withSome: "data" },
  //       });
  //     }

  //     let chunks = expo.chunkPushNotifications(messages);
  //     let tickets = [];
  //     for (let chunk of chunks) {
  //       try {
  //         let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
  //         tickets.push(...ticketChunk);
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     }

  //     res.json({ tickets });
  //   } catch (e) {
  //     res.json(errorResponse(res, e.message));
  //   }
  // }

 


static async Refer_and_earn(req, res) {
  try {
    const { referralCode} = req.body;

    const userId = req.user.user_id; 

    const referredByUser = await db.users.findOne({
      where: { referral_code: referralCode },
    });

    if (!referredByUser) {
      return res.status(404).json({
        success: false,
        message: 'Invalid referral code. Referrer not found.',
      });
    }
  
    await db.users.update(
      { referred_by: referredByUser.id },
      { where: { id: userId } }
    );

 const data={
  id: userId,
  referred_by: referralCode
 }
    return res.status(200).json(
      successResponse({
        message: "User updated successfully with referral code",
        data: data,
      })
    );
  } catch (e) {
   return res.json(errorResponse(res, e.message));
  }
}


}

module.exports = Usercontroller;
