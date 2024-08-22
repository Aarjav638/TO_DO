const express = require("express");
const {
  registerController,
  loginController,
  updateUserController,
} = require("../../controllers/userController");
const { requireLogin } = require("../../middleware");

//router

const router = express.Router();

//routes

router.post("/register", registerController);

router.post("/login", loginController);

router.put("/update-profile", requireLogin, updateUserController);

module.exports = router;
