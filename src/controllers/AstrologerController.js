const { Sequelize, Op, DataTypes } = require("sequelize");

const db = require("@models/index");

const { successResponse, errorResponse } = require("@helper/helper");
const { check, validationResult } = require("express-validator");

class Astrologer_meta {
  //astrologer Wallet
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

      const adduser = await db.users.create({
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

      return res
        .status(200)
        .json(successResponse({ message: "Success", adduser }));
    } catch (e) {
      return res.status(400).json(errorResponse({ message: e.message }));
    }
  }

  static async list(req, res) {
    try {
      const { page, limit, search, order_field, order_sorting } = req.query;

      const offset = parseInt(page - 1) * parseInt(limit);
      const orderClause = [];

      if (order_field && order_sorting) {
        orderClause.push([order_field, order_sorting]);
      } else {
        orderClause.push(["id", "DESC"]);
      }

      let whereClause = {
        user_type: "astrologer", // Assuming 'user_type' is a column in your User model
      };

      if (search) {
        whereClause[Op.or] = [
          { email: { [Op.like]: `%${search}%` } },
          { FullName: { [Op.like]: `%${search}%` } },
        ];
      }

      const allRecords = await db.users.findAll({
        where: whereClause,
        order: orderClause,
        include: [
          {
            model: db.astrologer_meta,
            as: "AstrologerMeta",
          },
          {
            model: db.expertise,
            as: "astrologerexpertise",
          },
        ],
        offset: offset,
        limit: parseInt(limit),
      });

      return res.status(200).json({
        message: "Success",
        data: allRecords,
      });
    } catch (e) {
      return res.status(400).json(errorResponse({ message: e.message }));
    }
  }

  static async Astrologer_profile(req, res) {
    try {
      //pending
      const { id } = req.params;

      const RecordById = await db.users.findOne({
        where: { id, user_type: "astrologer" },
        include: [
          {
            model: db.astrologer_meta,
            as: "AstrologerMeta",
          },
          {
            model: db.expertise,
            as: "astrologerexpertise",
          },
        ],
      });
      // expertise

      if (!RecordById.AstrologerMeta || !RecordById.astrologerexpertise) {
        return res.status(400).json(errorResponse({ message: "Invalid Data" }));
      }

      if (!RecordById) {
        return res.status(400).json(errorResponse({ message: "Invalid User" }));
      }

      return res
        .status(200)
        .json(successResponse({ message: "Profile Show", data: RecordById }));
    } catch (e) {
      res.status(400).json(errorResponse({ message: e.message }));
    }
  }

  static async ExpertiseList(req, res) {
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
            // Add other fields here if you want to search in multiple columns
          ],
        };
      }

      // Use the where clause in your findAll query
      const allRecords = await db.expertise.findAll({
        where: whereClause,
        order: orderClause,
        offset: offset,
        limit: parseInt(limit), // Ensure that limit is a number
      });

      // Optionally, you can also add pagination and total record count
      const totalRecords = await db.expertise.count({ where: whereClause });

      return res.status(200).json(
        successResponse({
          message: "Success",
          data: allRecords,
        })
      );
    } catch (e) {
      res.status(400).json(errorResponse({ message: e.message }));
    }
  }

  static async languages_list(req, res) {
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
            // Add other fields here if you want to search in multiple columns
          ],
        };
      }

      // Use the where clause in your findAll query
      const allRecords = await db.languages.findAll({
        where: whereClause,
        order: orderClause,
        offset: offset,
        limit: parseInt(limit), // Ensure that limit is a number
      });

      return res.status(200).json(
        successResponse({
          message: "Success",
          data: allRecords,
        })
      );
    } catch (e) {
      res.status(400).json(errorResponse({ message: e.message }));
    }
  }

  static async ToggelFolllow(req, res) {
    const { id } = req.params;

    try {
      const user_Id = req.user.user_id;

      const astrologerdata = await db.users.findOne({
        where: { id },
      });

      if (!astrologerdata || astrologerdata.user_type !== "astrologer") {
        return res.status(400).json(
          errorResponse({
            message: "Only astrologers can perform this action",
          })
        );
      }
      const isFollowing = await db.followers.findOne({
        where: {
          user_id: id,
          followed_by: user_Id,
        },
      });

      if (isFollowing) {
        await isFollowing.destroy();

        return res
          .status(200)
          .json(successResponse({ message: "Successfully unfollowed" }));
      } else {
        const follow = await db.followers.create({
          user_id: id,
          followed_by: user_Id,
        });

        return res
          .status(200)
          .json(
            successResponse({ message: "Successfully followed", data: follow })
          );
      }
    } catch (e) {
      res.status(400).json(errorResponse({ message: e.message }));
    }
  }

  static async ToggleStatus(req, res) {
    try {
      const { id } = req.params;
      const user_Id = req.user.user_id;

      const astrologerdata = await db.users.findOne({
        where: { id },
      });

      if (!astrologerdata || astrologerdata.user_type !== "astrologer") {
        return res.status(400).json(
          errorResponse({
            message: "Only astrologers can perform this action",
          })
        );
      }

      astrologerdata.status =
        astrologerdata.status === "active" ? "inactive" : "active";
      await astrologerdata.save();

      return res
        .status(200)
        .json(successResponse({ message: " status updated successfully" }));
    } catch (e) {
      res.status(400).json(errorResponse({ message: e.message }));
    }
  }

  static async astrologerAvailability(req, res) {
    try {
      // const userId = req.user.user_id;
      const userId = req.user?.user_id; // This will set userId to undefined if req.user is not set
      if (!userId) {
        return res.status(401).json({ message: "User is not authenticated" });
      }
      const { date, times } = req.body;
      const createOperations = times.map((time) => {
        return db.astrologer_availabilities.create({
          date: date,
          time: time,
          userid: userId,
          is_block: false,
        });
      });
      // Await all the create operations
      const records = await Promise.all(createOperations);

      return res
        .status(200)
        .json(
          successResponse({ message: "updated successfully", data: records })
        );
    } catch (e) {
      res.status(400).json(errorResponse({ message: e.message }));
    }
  }

  // static async SetAvailability(req, res) {
  //   const userId = req.user.user_id;
  //   const { date, time } = req.body;
  //   try {
  //     const dateObject = new Date(date);
  //     const [numberOfAffectedRows]= await db.Astrologer_Availability.update(
  //       {is_block:true},
  //       {
  //         where: {
  //           date:dateObject,
  //           time: time,
  //           userid: userId
  //         }
  //       }
  //     );
  //     if (numberOfAffectedRows > 0) {
  //       return res.status(200).json({ message: "Availability updated" });
  //   } else {
  //       return res.status(404).json({ message: "Record not found" });
  //   }
  //   }
  //   catch (e) {
  //     res.status(400).json(errorResponse({ message: e.message }));
  //   }
  // }

  static async getAvailability(req, res) {
    try {
      const { id } = req.params;
      const getData = await db.astrologer_availabilities.findAll({
        where: { userid: id },
      });
      if (getData) {
        return res.status(200).json(
          successResponse({
            message: "Data retrieved successfully",
            data: getData,
          })
        );
      } else {
        return res
          .status(404)
          .json(errorResponse({ message: "Data not found" }));
      }
    } catch (e) {
      res.status(500).json(errorResponse({ message: e.message }));
    }
  }

  static async Astrologer_aproved_request(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).send({ message: "Status is required" });
      }

      const validStatuses = ["scheduled", "declined", "completed", "approved"];

      if (!validStatuses.includes(status)) {
        return res.status(400).send({ message: "Invalid status" });
      }

      const call = await db.call_schedule.findOne({ where: { id } });

      if (!call) {
        return res.status(404).send({ message: "Call not found" });
      }

      if (call.status === "requested" && validStatuses.includes(status)) {
        await call.update({ status });
        return res
          .status(200)
          .send({ message: `Call status updated to ${status}` });
      } else {
        return res.status(400).send({ message: "Invalid status update" });
      }
    } catch (e) {
      res.status(500).json(errorResponse({ message: e.message }));
    }
  }

  static async customer_support(req, res) {
    try {
      const { report_type, summary, description } = req.body;
      const ticket = await db.tickets.create({
        report_type: report_type,
        summary: summary,
        description: description,
      });
      return res.status(200).json(
        successResponse({
          message: "successfully",
          data: ticket,
        })
      );
    } catch (e) {
      res.status(500).json(errorResponse({ message: e.message }));
    }
  }

  static async astrologerHistory(req, res) {
    try {
      const astrologerId = req.user.user_id;

      const history = await db.call_schedule.findAll({
        where: {
          user_id: astrologerId,
          status: "completed",
        },
        include: [
          {
            model: db.users,
            as: "booker",
            attributes: ["FullName"],
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
          message: "History successfully",
          data: history,
        })
      );
    } catch (e) {
      return res.status(500).json(errorResponse({ message: e.message }));
    }
  }

  static async user_review_astrologer(req, res) {
    try {
      const { user_id } = req.params;

      const reviews = await db.call_schedule.findAll({
        where: { user_id: user_id, status: "completed" },
        attributes: ["call_rating"],
      });

      const totalRatings = reviews.length;
      const averageRating =
        totalRatings > 0
          ? reviews.reduce((acc, { call_rating }) => acc + call_rating, 0) /
            totalRatings
          : 0;

      const ratings = {
        excellent: 0,
        good: 0,
        average: 0,
        poor: 0,
      };

      reviews.forEach((review) => {
        if (review.call_rating === 5) ratings.excellent++;
        else if (review.call_rating === 4) ratings.good++;
        else if (review.call_rating === 3) ratings.average++;
        else if (review.call_rating <= 2) ratings.poor++;
      });

      const response = {
        averageRating:
          totalRatings > 0 ? averageRating.toFixed(1) : "No Ratings",
        ratings,
        totalRatings: totalRatings,
      };

      return res.status(200).json(
        successResponse({
          message: "user rating for astrologer",
          data: response,
        })
      );
    } catch (e) {
      return res.status(500).json(errorResponse({ message: e.message }));
    }
  }

  static async wallet(req, res) {
    try {
      const userId = req.user.user_id;
    

      const totalAmount = await Astrologer_meta.userWallet(userId);
      console.log(totalAmount);
      return res.json({ user_id: userId, wallet: totalAmount });
    } catch (e) {
      res.status(500).json(errorResponse({ message: e.message }));
    }
  }

  static async wallet_histroy(req, res) {
    try {
      const userId = req.user.user_id; 

      const totalAmount = await Astrologer_meta.userWallet(userId);

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

      res.json({
        totalAmount: parseFloat(totalAmount).toFixed(2), // Include the total wallet amount formatted as a fixed decimal
        transactions: formattedTransactions,
      });
    } catch (error) {
      res.json(errorResponse(res, error.message));
    }
  }
}

module.exports = Astrologer_meta;
