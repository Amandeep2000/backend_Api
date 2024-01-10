const { Sequelize, Op, DataTypes } = require("sequelize");
const { URLSearchParams } = require('url');
const fetch = require('node-fetch');
const db = require("@models/index");
const crypto = require('crypto');
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


 static async getpaymentgetway(req, res) {
    const { token } = req.query;
    const userId = req.user.user_id;

    // const orderId = `order_${new Date().getTime()}`;
    const key = 'gtKFFx';
    const salt = 'YOUR_SALT';
    const txnid = 'txnid' + new Date().getTime();
    const amount = '10';
    const productinfo = 'iPhone';
    const firstname = 'Ashish';
    const email = 'test@gmail.com';
    
    const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${salt}`;
    
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');
    
    res.render("paymentgateway",{token,txnid,key,hash});
  }


//   static async postpaymentgetway(req, res) {
//     try{


//     const txnid = 'txnid' + new Date().getTime();

    
//     const key = 'gtKFFx';
//     const salt = 'YOUR_SALT';

    
//     const amount = '10';
//     const productinfo = 'iPhone';
//     const firstname = 'Ashish';
//     const email = 'test@gmail.com';

   
//     const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${salt}`;
//     const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    
//    res.render('paymentgateway',{ key:key, txnid:txnid,amount:amount,productinfo:productinfo,firstname:firstname,email:email, hash:hash });
//   }catch (e) {
//     res.status(500).json(errorResponse({ message: e.message }));
//   }
// }


static async verify_payment(req,res)
{
  return res.send(req.body)

try
{
  const encodedParams = new URLSearchParams();

  encodedParams.set('key', merchantKey);
  encodedParams.set('command', 'verify_payment');

  const apiUrl = 'https://test.payu.in/merchant/postservice?form=2';
  const options = {
      method: 'POST',
      headers: {
          accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: encodedParams
  };

  fetch(apiUrl, options)
      .then((res) => res.json())
      .then((json) => {
          console.log('PayU Verify Payment Response:', json);

         
          if (json.status === 'success') {
              
              res.redirect('/payment-success');
          } else {
        
              res.send('Payment verification failed.');
          }
      })
      .catch((err) => {
          console.error('Error:', err);
          res.send('An error occurred during payment verification.');
      });


}catch(e){
  res.status(500).json(errorResponse({ message: e.message }));
}


}


static async verify_paymentpost(req,res){
  try {
    const paymentObject = req.body;
    const orderId = `order_${new Date().getTime()}`;
    const transaction = await  db.transactions.create({
      payment_object: paymentObject,
      order_id:orderId

    });

  return  res.status(201).json({
      message: 'Payment verified and stored successfully.',
      transactionId:  transaction 
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error verifying paymentpost.',
      error: error.message
    });
  }
}

}

module.exports = PaymentController;
