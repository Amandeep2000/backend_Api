const { Sequelize, Op, DataTypes } = require("sequelize");
const { URLSearchParams } = require("url");
const fetch = require("node-fetch");
const db = require("@models/index");
const crypto = require("crypto");
const { successResponse, errorResponse } = require("@helper/helper");

class PaymentController {


//wallet function
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







  static async getpaymentgetway(req, res) {
    const { token, uniqueTime, amount } = req.query;
    const userId = req.user.user_id;

    const key = "gtKFFx";
    const salt = "4R38IvwiV57FwVpsgOvTXBdLE4tHUXFW";
    const productinfo = "iPhone";
    const firstname = "Ashish";
    const email = "test@gmail.com";
    const txnid = uniqueTime;

    const udf1 = "",
      udf2 = "",
      udf3 = "",
      udf4 = "",
      udf5 = "";
      
const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;
 
const hash = crypto.createHash("sha512").update(hashString).digest("hex");

 return res.render("paymentgateway", { token, txnid, amount, hash: hash });
  }

 

  static async verify_payment(req, res) {
        try {
      const encodedParams = new URLSearchParams();

      encodedParams.set("key", merchantKey);
      encodedParams.set("command", "verify_payment");

      const apiUrl = "https://test.payu.in/merchant/postservice?form=2";
      const options = {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: encodedParams,
      };

      fetch(apiUrl, options)
        .then((res) => res.json())
        .then((json) => {
          console.log("PayU Verify Payment Response:", json);

          if (json.status === "success") {
            res.redirect("/payment-success");
          } else {
            res.send("Payment verification failed.");
          }
        })
        .catch((err) => {
          console.error("Error:", err);
          res.send("An error occurred during payment verification.");
        });
    } catch (e) {
      res.status(500).json(errorResponse({ message: e.message }));
    }
  }

  static async verify_paymentpost(req, res) {
    try {
      const user_id = req.user.user_id;
      const paymentObject = req.body;
      const status = req.body.status;
      const txnid = req.body.txnid;
      const amount = parseInt(parseFloat(req.body.amount));
      // return res.send({amount})
      const orderId = `order_${new Date().getTime()}`;
      const transaction = await db.transactions.create({
        payment_object: paymentObject,
        order_id: orderId,
        payment_status: status,
        unique_id: txnid,
        amount,
        user_id: user_id,
        type: 'credit'
      });

      return res.status(201).json({
        message: "Payment verified and stored successfully.",
        transactionId: transaction,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error verifying paymentpost.",
        error: error.message,
      });
    }
  }




  static async verify_payment_user_side(req, res) {
    try {
      const { unique_id } = req.query;    
      const userId = req.user.user_id; 
    
      const   wallet = await PaymentController.userWallet(userId);      
      if (!unique_id) {
        return res.status(400).json({ status: false, message: "unique id is required." });
      }
         
      const transaction = await db.transactions.findOne({
        where: { unique_id: unique_id }
      });
    
      if (transaction) {
        // Check if the transaction is successful
        if (transaction.payment_status === 'success') {
          return res.json({
            status: true,
             wallet:wallet, 
            payment_status: transaction.payment_status
          });
        }
      } else {
        return res.json({ status: false, message: "transaction is in process." });
      }
    } catch (e) {
      res.status(500).json({
        message: "Error verifying payment on user side.",
        error: e.message,
      });
    }
  }
  
}

module.exports = PaymentController;
