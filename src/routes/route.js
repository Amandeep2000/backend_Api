const { Router } = require("express");
const cors = require("cors");
require("express-group-routes");
const express = require("express");
const AuthController = require("@controllers/AuthController");
const AstrologerController = require("@controllers/AstrologerController");

const CallsController = require("@controllers/CallsController");

const Usercontroller = require("@controllers/Usercontroller");
const PaymentController = require("@controllers/payment/PaymentController");

const appController = require("@controllers/appController");

const { authenticateToken } = require("@middleware/UserAuth");

const app = Router();

app.post(
  "/payment/success",
  authenticateToken,
  PaymentController.verify_paymentpost
);

app.group("/api", (router) => {
  router.post("/upload", CallsController.imageuploding);
  router.post("/register/Astrologer", AuthController.AstrologerRegister);
  router.post("/register/user", AuthController.UserRegister);
  router.post("/astrologer/astrologerMeta", AuthController.astrologerMeta);
  router.get("/get-login-otp", AuthController.getotp);
  router.post("/login", AuthController.login);
  router.post("/astrologer/call_histroy", CallsController.call_history);
  router.group((afterAuthRouter) => {
    afterAuthRouter.use(authenticateToken);

    //paymentgateway
    afterAuthRouter.get("/payment", PaymentController.getpayment);
    afterAuthRouter.post("/payment", PaymentController.postpayment);

    //othergateway
    afterAuthRouter.get("/pay", PaymentController.getpaymentgetway);
    afterAuthRouter.get(
      "/verify-payment-on-app",
      PaymentController.verify_payment_user_side
    );

    // app.get(
    //   "/payment/success",
    //   PaymentController.verify_payment
    // );

    // afterAuthRouter.post("/pay",PaymentController. postpaymentgetway);

    afterAuthRouter.post("/logout", AuthController.logout);

    afterAuthRouter.post("/astrologer", AstrologerController.Astrologer);

    afterAuthRouter.get("/astrologer/list", AstrologerController.list);

    afterAuthRouter.get(
      "/astrologer/show/:id",
      AstrologerController.Astrologer_profile
    );

    afterAuthRouter.get(
      "/astrologer/ExpertiseList",
      AstrologerController.ExpertiseList
    );
    afterAuthRouter.get(
      "/astrologer/languageslist",
      AstrologerController.languages_list
    );
    afterAuthRouter.post(
      "/astrologer/follow/:id",
      AstrologerController.ToggelFolllow
    );

    afterAuthRouter.post(
      "/astrologer/status/:id",
      AstrologerController.ToggleStatus
    );

    afterAuthRouter.post(
      "/astrologer/astrologerAvailability",
      AstrologerController.astrologerAvailability
    );

    // afterAuthRouter.post("/astrologer/SetAvailability",AstrologerController.SetAvailability);
    afterAuthRouter.get(
      "/astrologer/getAvailability/:id",
      AstrologerController.getAvailability
    );

    afterAuthRouter.post(
      "/astrologer/requested_aproved/:id",
      AstrologerController.Astrologer_aproved_request
    );

    afterAuthRouter.post(
      "/astrologer/customer_support",
      AstrologerController.customer_support
    );

    afterAuthRouter.get(
      "/astrologer/history",
      AstrologerController.astrologerHistory
    );

    afterAuthRouter.get(
      "/reviews/astrologer/:user_id",
      AstrologerController.user_review_astrologer
    );

    //walletbalance_asrologer
    afterAuthRouter.get("/astrologer/wallet",AstrologerController.wallet);
    afterAuthRouter.get("/astrologer/wallet/histroy",AstrologerController.wallet_histroy)

    afterAuthRouter.post(
      "/astrologer/schedule_call",
      CallsController.schedule_call
    );

    afterAuthRouter.get(
      "/astrologer/schedule_call_list",
      CallsController.schedule_call_list
    );

    afterAuthRouter.get(
      "/astrologer/user_review/:id",
      CallsController.user_review
    );

    afterAuthRouter.get("/user/history", Usercontroller.history);
    afterAuthRouter.post("/user/chatroom", Usercontroller.chat_rooms);
    afterAuthRouter.get("/user/chatroom/list", Usercontroller.chat_room_list);

    //banner crud
    afterAuthRouter.get("/user/banner/list", Usercontroller.list);

    afterAuthRouter.get("/user/wallet", Usercontroller.wallet);

    afterAuthRouter.post(
      "/user/wallet/deduct-balance",
      Usercontroller.deduct_balance
    );

    afterAuthRouter.post(
      "/user/endchat/:id",
      Usercontroller.chatend_astrologer
    );

    afterAuthRouter.get("/user/wallet/histroy",Usercontroller.wallet_histroy);

    afterAuthRouter.post("/app/feedback", appController.app_feedback);

    afterAuthRouter.get("/user/totalamount", Usercontroller.totalamount);
  });
});

app.get("/payment/failure", (req, res) => {
  return res.render("payment-failure");
});

app.post("/payment/failure", (req, res) => {
  return res.render("payment-failure");
});

// app.get("/verify-payment",PaymentController.verify_payment);

module.exports = app;
