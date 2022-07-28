const jwt = require("jsonwebtoken");

// Models
const { Restaurant } = require("../models/restaurant.model");
const { User } = require("../models/user.model");

// Utils
const { AppError } = require("../utils/appError.util");
const { catchAsync } = require("../utils/catchAsync.util");

const restaurantExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const restaurant = await Restaurant.findOne({ where: { id } });

  if (!restaurant) {
    return next(new AppError("Restaurant not found", 404));
  }

  req.restaurant = restaurant;
  next();
});

const userAdmin = catchAsync(async (req, res, next) => {
  let token;

  // Extract the token from headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Invalid session", 403));
  }

  // Ask JWT (library), if the token is still valid
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);
  // { id, ... }
  console.log(decoded);
  // Check in db that user still exists
  const user = await User.findOne({
    where: { id: decoded.id, status: "active", role: "admin" },
  });

  if (user?.role !== "admin" || user === undefined) {
    return next(
      new AppError(
        "The owner of this token doesnt exist anymore or is not an admin user",
        403
      )
    );
  }

  // Grant access
  req.sessionUser = user;
  next();
});

module.exports = { restaurantExists, userAdmin };
