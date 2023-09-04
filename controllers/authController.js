const catchAsync = require("../apifeatures/catchAsync");
const AppError = require("../apifeatures/appError");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const sendEmail = require("../apifeatures/nodemailer");
const crypto = require("crypto");

const signToken = (id) => {
  return jwt.sign(
    {
      id: id,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

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

  await user.save({ validateBeforeSave: false });

  // 3. Send it to user's email
  const resetLink = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `You have request to reset your password. Submit a Post request to the following link./n ${resetLink}. /n If you didn't request this, please ignore this email`;

  await sendEmail({
    email: user.email,
    subject: "Your Password Reset Token(valid for 10 mins)",
    message: message,
  });

  res.status(200).json({
    status: "success",
    message: "Password reset link is sent to the user's email",
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //  1) Check the token and get user
  const pwtoken = req.params.token;

  const hashedToken = crypto.createHash("sha256").update(pwtoken).digest("hex");

  //  2) If the token is expired and there is a user, set the new password
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError("Token expired or invalid", 400));
  }
  //  3) Update changePasswordAt property for the user
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordChangeAt = Date.now();

  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();
  //  4) Log the user in and send JWT
  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
  });
});
