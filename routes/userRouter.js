const express = require("express");

const userRouter = express.Router();

// app.use("/api/v1/tours", tourRouter);

tourRouter.route("/").get(getAllTours).post(addNewTour);

tourRouter
  .route("/:id")
  .get(getOneTour)
  .patch(updateOneTour)
  .delete(deleteOneTour);

module.exports = userRouter;
