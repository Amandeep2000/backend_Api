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

const BannerController = require("@controllers/Admin/BannerController");

const app = Router();
app.use(express.static(staticpath));
app.group((router) => {
  router.get("/", AuthControllertemp.login);
  router.post("/", AuthControllertemp.loginPost);

  //creat expertise

  router.group((afterAuthRouter) => {
    afterAuthRouter.use(ejsLayouts);
    
    afterAuthRouter.get(
      "/admin/Astrologerlist/list",
      AstrologerControllertemp.Astrologer_list
    );

    afterAuthRouter.post(
      "/admin/Astrologerlist/list",
      AstrologerControllertemp.toggle_astrologer_blocking
    );

    //Astrologer crud
    //create
    afterAuthRouter.get(
      "/admin/Astrologerlist/create",
      AstrologerControllertemp.get_create_astrologer
    );

    afterAuthRouter.post(
      "/admin/Astrologerlist/create",
      AstrologerControllertemp.post_create_astrologer
    );

    //update
    afterAuthRouter.get(
      "/admin/Astrologerlist/update/:id",
      AstrologerControllertemp.updateget
    );
    afterAuthRouter.post(
      "/admin/Astrologerlist/update/:id",
      AstrologerControllertemp.updatePost
    );

    afterAuthRouter.delete(
      "/admin/Astrologerlist/update/:id",
      AstrologerControllertemp.delete
    );

    //user crud
    afterAuthRouter.get("/admin/user/list", UserControllertemp.User_list);
    afterAuthRouter.get(
      "/admin/user/create",
      UserControllertemp.get_create_user
    );
    afterAuthRouter.post(
      "/admin/user/create",
      UserControllertemp.post_create_user
    );

    afterAuthRouter.get("/admin/user/update/:id", UserControllertemp.updateget);
    afterAuthRouter.post(
      "/admin/user/update/:id",
      UserControllertemp.updatePost
    );

    afterAuthRouter.delete("/admin/user/update/:id", UserControllertemp.delete);
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

    //crud banner

    afterAuthRouter.get("/admin/banners/create", BannerController.create);
    afterAuthRouter.post("/admin/banners/create", BannerController.createpost);
    afterAuthRouter.get("/admin/banners/list", BannerController.list);

    afterAuthRouter.get(
      "/admin/banners/update/:id",
      BannerController.updateget
    );

    afterAuthRouter.post("/admin/banners/update/:id", BannerController.update);

    afterAuthRouter.delete(
      "/admin/banners/update/:id",
      BannerController.delete_banner
    );
    // delete_banner

    //astrologer profile
    afterAuthRouter.get(
      "/adimn/profile/:id",
      AstrologerControllertemp.getprofile
    );
  });
});

module.exports = app;
