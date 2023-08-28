const User = require("../models/userModel");
const catchAsync = require("../apifeatures/catchAsync");
const AppError = require("../apifeatures/appError");
const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign(
    {
      id: id,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

exports.signUp = catchAsync(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.signIn = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email }).select(
    "+password"
  );
  console.log(user);

  var passwordMatch = await user.checkPassword(
    req.body.password,
    user.password
  );

  if (!user || !passwordMatch) {
    return next(new AppError("User does not exist or Wrong Password", 401));
  }

  token = signToken(user._id);

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
