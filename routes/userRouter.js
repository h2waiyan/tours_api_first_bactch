const express = require("express");
const userController = require("../controllers/userController");

const userRouter = express.Router();

userRouter.route("/signup").post(userController.signUp);
userRouter.route("/signin").post(userController.signIn);
userRouter.route("/getall").post(userController.getAllUsers);

// userRouter
//   .route("/:id")
//   .get(getOneTour)
//   .patch(updateOneTour)
//   .delete(deleteOneTour);

module.exports = userRouter;
