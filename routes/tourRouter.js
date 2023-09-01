const express = require("express");
const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");
const tourRouter = express.Router();

tourRouter
  .route("/")
  .get(authController.protect, tourController.getAllTours)
  .post(authController.protect, tourController.addNewTour);

tourRouter
  .route("/top-5-cheap")
  .get(tourController.aliasTopTour, tourController.getAllTours);

tourRouter
  .route("/:id")
  .get(tourController.getOneTour)
  .patch(authController.protect, tourController.updateOneTour)
  .delete(
    authController.protect, // check token - authentication -> id -> user
    authController.restrictTo("user", "guide"), // authorization ->
    tourController.deleteOneTour
  );

// tourRouter.param("id", (req, res, next, val) => {
//   console.log(`Tour id is ${val}`);
//   next();
// });

// tourRouter.param("id", tourController.checkId);

module.exports = tourRouter;
