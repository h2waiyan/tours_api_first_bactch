const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const userRouter = express.Router();

userRouter.route("/signup").post(userController.signUp);
userRouter.route("/signin").post(userController.signIn);
userRouter.route("/getall").post(userController.getAllUsers);

userRouter.post("/forgotpassword", authController.forgotPassword);
userRouter.post("/resetpassword/:token", authController.resetPassword);

// userRouter
//   .route("/:id")
//   .get(getOneTour)
//   .patch(updateOneTour)
//   .delete(deleteOneTour);

module.exports = userRouter;
