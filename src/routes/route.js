const { Router } = require("express");

require("express-group-routes");
const express = require("express");
const AuthController = require("@controllers/AuthController");
const AstrologerController = require("@controllers/AstrologerController");
const CallsController = require("@controllers/CallsController");

const { authenticateToken } = require("@middleware/UserAuth");

const app = Router();
app.group("/api", (router) => {
  router.post("/register/Astrologer", AuthController.AstrologerRegister);
  router.post("/register/user", AuthController.UserRegister);
  router.post("/astrologer/astrologerMeta", AuthController.astrologerMeta);
  router.get("/get-login-otp", AuthController.getotp);
  router.post("/login", AuthController.login);
  router.post("/astrologer/call_histroy", CallsController.call_history);
  router.group((afterAuthRouter) => {
    afterAuthRouter.use(authenticateToken);

    afterAuthRouter.post("/logout", AuthController.logout);

    afterAuthRouter.post("/astrologer", AstrologerController.Astrologer);

    afterAuthRouter.get("/astrologer/list", AstrologerController.list);

    afterAuthRouter.get("/astrologer/show/:id",AstrologerController.Astrologer_profile);

    afterAuthRouter.get("/astrologer/ExpertiseList",AstrologerController.ExpertiseList);

    afterAuthRouter.post("/astrologer/follow/:id",AstrologerController.ToggelFolllow);

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

    afterAuthRouter.get(
      "/astrologer/requested_aproved/:id",
      AstrologerController.Astrologer_aproved_request
    );

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
  });
});

module.exports = app;
