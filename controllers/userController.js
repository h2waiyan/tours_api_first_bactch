const User = require("../models/userModel");
const catchAsync = require("../apifeatures/catchAsync");
const AppError = require("../apifeatures/appError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signUp = catchAsync(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = jwt.sign(
    {
      id: newUser._id,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.signIn = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  console.log(user);

  if (!user) {
    return new AppError("User not found", 404);
  }

  var passwordMatch = await bcrypt.compare(req.body.password, user.password);

  console.log(passwordMatch);
  if (!passwordMatch) {
    return next(new AppError("Wrong Password", 400));
  }

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: user,
    },
  });
});

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
