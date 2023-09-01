const catchAsync = require("../apifeatures/catchAsync");
const AppError = require("../apifeatures/appError");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  //1. Header Token - Get token - check token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Please login to continue", 401));
  }
  // 2. Verify token
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );

  // Optional = check token's userid == req.body.userid

  // 3. userid -> still exists in db
  const currentUser = await User.findById(decodedToken.id);

  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }
  // 4. user changed password after the token was issued
  // if (currentUser.changedPassAfter(decodedToken.iat)) {
  //   return next(
  //     new AppError("User recently changed password! Please log in again.", 401)
  //   );
  // }
  // 5. Grant Access
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log(roles); // [ 'user', 'guide' ]
    console.log("----->");
    console.log(req.user.role);
    if (roles.includes(req.user.role)) {
      console.log("HERE>>>>>");
      return next(
        new AppError("You do not have permission to perform this action.", 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1. Get user based on user's email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return new AppError("There is no user registered with this email", 404);
  }
  // 2. Generate random access token
  const resetToken = user.createPasswordResetToken();
  console.log(resetToken);

  // 3. Send it to user's email
  res.status(200).json({
    message: "ok",
  });
});

exports.resetPassword = (req, res, next) => {};
