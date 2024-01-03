const { Sequelize, Op, DataTypes } = require("sequelize");

const db = require("@models/index");

const { successResponse, errorResponse } = require("@helper/helper");


class PaymentController {
  static async getpayment(req, res) {
    const { token, amount } = req.query;
    const userId = req.user.user_id;

    const orderId = `order_${new Date().getTime()}`;

    res.render("payment", { amount, token, orderId });
  }

  static async postpayment(req, res) {
    try {
      const { token, amount } = req.query;

      const user_id = req.user.user_id;
      console.log(user_id);
      const user = await db.users.findByPk(user_id);
      const orderId = `order_${new Date().getTime()}`;

      const payment = await db.transactions.create({
        user_id: user.id,
        order_id: orderId,
        type: "credit",
        amount: amount,
        payment_status: "sucess",
        payment_object: "data",
      });

      res.json({
        success: "sucess",
        order_id: orderId,
      });
    } catch (e) {
      res.status(500).json(errorResponse({ message: e.message }));
    }
  }
}

module.exports = PaymentController;
