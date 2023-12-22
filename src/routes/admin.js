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
const LanguagesController = require("@controllers/Admin/LanguagesConstroller");

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

    //expertiseList

    afterAuthRouter.get("/admin/expertise/list", ExpertiseController.list);

    afterAuthRouter.get("/admin/expertise/create", ExpertiseController.create);

    afterAuthRouter.post(
      "/admin/expertise/create",
      ExpertiseController.createpost
    );

    afterAuthRouter.get(
      "/admin/expertise/update/:id",
      ExpertiseController.updateget
    );

    afterAuthRouter.post(
      "/admin/expertise/update/:id",
      ExpertiseController.updatepost
    );

    // afterAuthRouter.delete("/admin/expertise/update/:id",ExpertiseController.delete_expertis);
    afterAuthRouter.delete(
      "/admin/expertise/update/:id",
      ExpertiseController.delete_expertis
    );

    //languages crud

    afterAuthRouter.get("/admin/languages/list", LanguagesController.List);

    afterAuthRouter.get("/admin/languages/create", LanguagesController.create);

    afterAuthRouter.post(
      "/admin/languages/create",
      LanguagesController.createpost
    );

    afterAuthRouter.get(
      "/admin/languages/update/:id",
      LanguagesController.updateget
    );

    afterAuthRouter.post(
      "/admin/languages/update/:id",
      LanguagesController.updatePost
    );

    afterAuthRouter.delete(
      "/admin/languages/update/:id",
      LanguagesController.deleteLanguage
    );
  });
});

module.exports = app;
