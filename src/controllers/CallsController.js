const { Sequelize, Op, DataTypes } = require("sequelize");

const db = require("@models/index");

const { successResponse, errorResponse } = require("@helper/helper");
const { check, validationResult } = require("express-validator");

const { validateRating } = require('@CallsValidation/uer_review_validation')

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

class CallsController {
  static async schedule_call(req, res) {
    try {
      const userId = req.user.user_id;
      const { astrologerid, id } = req.body; // Assuming you are passing the astrologer's ID in the request body

      if (!id) {
        return res.status(404).json({ message: "id not found" });
      }
      // Fetch availability data for the given astrologerId
      const getData = await db.Astrologer_Availability.findOne({
        where: { id: id },
      });
      // If no data is found for the given astrologerId, return an error response
      if (!getData) {
        return res
          .status(404)
          .json({ message: "Astrologer availability not found" });
      }
      // Create a new call schedule
      const data = await db.call_schedule1.create({
        // Uncomment and use the following line if user_id is required
        user_id: astrologerid,
        datetime: getData.id,
        booked_by: userId,
        status: "requested",
      });
      return res
        .status(200)
        .json({ message: "Call Schedule Work successfully", data: data });
    } catch (e) {
      res.status(500).json(errorResponse({ message: e.message }));
    }
  }

  static async schedule_call_list(req, res) {
    try {
      const { page, limit, order_field, order_sorting } = req.query;
      const offset = parseInt(page - 1) * parseInt(limit);
      const orderClause = [];

      // Define the order clause based on provided parameters
      if (order_field && order_sorting) {
        orderClause.push([order_field, order_sorting]);
      } else {
        orderClause.push(["id", "DESC"]); // Default ordering
      }

      // Fetch all records with the specified pagination and ordering
      const allRecords = await db.call_schedule1.findAll({
        order: orderClause,
        include: [
          {
            model: db.User,
            as: "booker",
          },
        ],
        offset: offset,
        limit: parseInt(limit),
      });

      // Return the response
      return res.status(200).json({
        message: "Success",
        data: allRecords,
      });
    } catch (e) {
      res.status(500).json(errorResponse({ message: e.message }));
    }
  }

  static async call_history(req, res) {
    try {
      const { to, from } = req.body;

      const call = await client.calls.create({
        url: "http://demo.twilio.com/docs/voice.xml",
        to: to,
        from: from,
      });

      const callHistoryEntry = await db.call_history.create({
        to: call.to,
        from: call.from,
        url: call.url,
      });

      res.status(200).json({
        success: true,
        message: "Call initiated and logged successfully",
        data: callHistoryEntry,
      });
    } catch (e) {
      res.status(500).json(errorResponse({ message: e.message }));
    }
  }

  static async user_review(req, res) {
    try {
      const {id} = req.params;
      const { call_rating, call_comments } = req.body;

 // Use the validation function
 const { isValid, message } = validateRating(call_rating);
 if (!isValid) {
   return res.status(400).send({ message });
 }

  // Use findByPk instead of findOne
 const call = await db.call_schedule1.findByPk(id);
  if (!call || call.status !== "completed") {
   return res
  .status(400)
  .send({ message: "Call not completed or not found" });
      }

      await call.update({
        call_rating: call_rating,
        call_comments: call_comments,
    });

    return res.status(200).send(call);
    } catch (e) {
      res.status(500).json(errorResponse({ message: e.message }));
    }
  }
}

module.exports = CallsController;
