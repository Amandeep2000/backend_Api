const { Router } = require("express");

require("express-group-routes");
// const { authenticateToken } = require("@middleware/UserAuth");
const express = require("express");
const AuthController = require("@controllers/AuthController");
const AstrologerController = require("@controllers/AstrologerController");
const CallsController = require("@controllers/CallsController");

const path = require("path");
const { authenticateToken } = require("@middleware/UserAuth");
const staticpath = path.join("public");
const ejsLayouts = require("express-ejs-layouts");
const AstrologerControllertemp = require("@controllers/Admin/AstrologerController");
const UserControllertemp = require("@controllers/Admin/UserController");
const AuthControllertemp = require("@controllers/Admin/AuthController");
const ExpertiseController = require("@controllers/Admin/ExpertiseController");

const app = Router();
app.use(express.static(staticpath));
app.group((router) => {
  router.get("/", AuthControllertemp.login);
  router.post("/", AuthControllertemp.loginPost);

  //creat expertise
  

  router.group((afterAuthRouter) => {
    afterAuthRouter.use(ejsLayouts);
    afterAuthRouter.get("/list", AstrologerControllertemp.Astrologer_list);
    afterAuthRouter.get("/userlist", UserControllertemp.User_list);
    afterAuthRouter.get("/expertiselist", ExpertiseController.List);
    
    afterAuthRouter.get("/admin/expertise/create", ExpertiseController.create);

    afterAuthRouter.post("/admin/expertise/create", ExpertiseController.createpost);
   
  });
});

module.exports = app;
