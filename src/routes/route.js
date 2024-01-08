const { Router } = require("express");
const cors = require("cors");
require("express-group-routes");
const express = require("express");
const AuthController = require("@controllers/AuthController");
const AstrologerController = require("@controllers/AstrologerController");

const CallsController = require("@controllers/CallsController");

const Usercontroller = require("@controllers/Usercontroller");
const PaymentController = require("@controllers/payment/PaymentController");

const { authenticateToken } = require("@middleware/UserAuth");

const app = Router();
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

    // afterAuthRouter.get(
    //   "/astrologer/history",
    //   AstrologerController.astrologerHistory
    // );
  


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
  });


});

module.exports = app;
