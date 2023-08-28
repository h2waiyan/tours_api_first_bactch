const Tour = require("../models/tourModel");
const APIFeatures = require("../apifeatures/api_features");
const AppError = require("../apifeatures/appError");
const catchAsync = require("../apifeatures/catchAsync");

exports.getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limit()
    .paginate();

  const tours = await features.query; // Execute the Query

  res.status(200).json({
    status: "success",
    requstedAt: req.reqTime,
    data: {
      tours,
    },
  });
});

exports.addNewTour = catchAsync(async (req, res) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: "success",
    data: newTour,
  });
});

exports.getOneTour = async (req, res) => {
  console.log(req.body.name);
  try {
    const tour = await Tour.findById(req.params.id);

    // const tour = await Tour.findOne({ name: req.body.name }); // []

    if (!tour) {
      return next(new AppError("No tour found", 404));
    }

    res.status(200).json({
      status: "success",
      data: tour, // []
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateOneTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!tour) {
      return new AppError("No Tour Found", 404);
    }

    res.status(200).json({
      message: "success",
      data: {
        tour: tour, // Return the Updated Tour
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteOneTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "success",
      data: null,
    });
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.checkId = (req, res, next, val) => {
  console.log(">>>>>>>>>>>>>>>>>");
  console.log(`Tour id is ${val}`);
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: "fail",
      message: "Insufficient Parameter",
    });
  }
  next();
};

exports.aliasTopTour = async (req, res, next) => {
  console.log(">>>>>>>");
  req.query.limit = "5";
  req.query.sort = "price";
  req.query.fields = "name, price, duration, summary";
  next();
};
