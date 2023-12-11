const { Router } = require("express");

require("express-group-routes");
const express = require("express");
const AuthController = require("@controllers/AuthController");
const AstrologerController = require("@controllers/AstrologerController");
const CallsController = require("@controllers/CallsController");

const { authenticateToken } = require("@middleware/UserAuth");
const ejsLayouts = require("express-ejs-layouts");
const AstrologerControllertemp = require("@controllers/Admin/AstrologerController")
const UserControllertemp = require("@controllers/Admin/UserController")
const AuthControllertemp = require("@controllers/Admin/AuthController")
const ExpertiseController = require("@controllers/Admin/ExpertiseController")




const app = Router();
app.group("/api", (router) => {
  router.post("/register/Astrologer", AuthController.AstrologerRegister);
  router.post("/register/user", AuthController.UserRegister);
  router.post("/astrologer/astrologerMeta", AuthController.astrologerMeta);
  router.get("/mobile", AuthController.getUserByPhoneNumber);
  router.post("/login", AuthController.login);

  router.group((afterAuthRouter) => {

    afterAuthRouter.use(authenticateToken);

    afterAuthRouter.post("/logout", AuthController.logout);

    afterAuthRouter.post("/astrologer", AstrologerController.Astrologer);

    afterAuthRouter.get("/astrologer/list", AstrologerController.list);

    afterAuthRouter.get("/astrologer/show/:id", AstrologerController.show);

    afterAuthRouter.get("/astrologer/ExpertiseList", AstrologerController.ExpertiseList);

    afterAuthRouter.post("/astrologer/follow/:id", AstrologerController.ToggelFolllow);

    afterAuthRouter.post("/astrologer/status/:id", AstrologerController.ToggleStatus);

    afterAuthRouter.post("/astrologer/astrologerAvailability", AstrologerController.astrologerAvailability);

    // afterAuthRouter.post("/astrologer/SetAvailability",AstrologerController.SetAvailability);
    afterAuthRouter.get("/astrologer/getAvailability/:id", AstrologerController.getAvailability);
    afterAuthRouter.post("/astrologer/schedule_call", CallsController.schedule_call);
    afterAuthRouter.get("/astrologer/schedule_call_list", CallsController.schedule_call_list);
  })
});


//template engine route
app.group((router) => {
  router.get('/', AuthControllertemp.login);
  router.post('/', AuthControllertemp.loginPost);
  router.group((afterAuthRouter) => {
    afterAuthRouter.use(ejsLayouts);
    afterAuthRouter.get("/list", AstrologerControllertemp.Astrolistlist);
    afterAuthRouter.get("/userlist", UserControllertemp.User_list);
    afterAuthRouter.get("/expertiselist", ExpertiseController.ExpertiseList);
  })
})



module.exports = app;
// module.exports = app1;
