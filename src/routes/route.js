const { Router } = require("express");

require("express-group-routes");

const AuthController = require("@controllers/AuthController");

const AstrologerController = require("@controllers/AstrologerController");

const { authenticateToken } = require("@middleware/UserAuth");



const app = Router();

app.group("/api",(router) => {

  router.post("/register/Astrologer", AuthController.AstrologerRegister);
  router.post("/register/user", AuthController.UserRegister);
  router.post("/astrologer/astrologerMeta",  AuthController.astrologerMeta);
  router.post("/mobile", AuthController.getUserByPhoneNumber);
  router.post("/login",  AuthController.login);

  router.group((afterAuthRouter) => {

    afterAuthRouter.use(authenticateToken);
    afterAuthRouter.post("/logout", AuthController.logout);

    afterAuthRouter.post("/astrologer", AstrologerController.Astrologer);
    afterAuthRouter.get("/astrologer/list", AstrologerController.list);
    afterAuthRouter.get("/astrologer/show/:id", AstrologerController.show);
    afterAuthRouter.post(
      "/astrologer/follow/:id",
      AstrologerController.ToggelFolllow
    );
  });
});




//template engine route

app.get("/",(req,res)=>
{
 return res.render("login")
})

module.exports = app;
