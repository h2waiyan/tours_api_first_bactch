const express = require("express");
const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");
const tourRouter = express.Router();

tourRouter
  .route("/")
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.addNewTour);

tourRouter
  .route("/top-5-cheap")
  .get(tourController.aliasTopTour, tourController.getAllTours);

tourRouter
  .route("/:id")
  .get(tourController.getOneTour)
  .patch(tourController.updateOneTour)
  .delete(tourController.deleteOneTour);

// tourRouter.param("id", (req, res, next, val) => {
//   console.log(`Tour id is ${val}`);
//   next();
// });

// tourRouter.param("id", tourController.checkId);

module.exports = tourRouter;
