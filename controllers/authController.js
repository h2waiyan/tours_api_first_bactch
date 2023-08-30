const catchAsync = require("../apifeatures/catchAsync");
const AppError = require("../apifeatures/appError");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");

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

  console.log(decodedToken);

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
  if (currentUser.changedPasswordAfter(decodedToken.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }
  // 5. Grant Access
  next();
});
