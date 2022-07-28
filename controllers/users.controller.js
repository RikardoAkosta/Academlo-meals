const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Models
const { User } = require("../models/user.model");
const { Order } = require("../models/order.model");

// Utils
const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util");
const { Restaurant } = require("../models/restaurant.model");

dotenv.config({ path: "./config.env" });

const getAllUsersOrders = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const orders = await User.findOne({
    where: { id: sessionUser.id, status: "active" },
    attributes: { exclude: ["password"] },
    include: { model: Order },
  });

  res.status(200).json({
    status: "success",
    orders,
  });
});

const getUsersOrderById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const order = await User.findAll({
    where: {
      id,
      status: "active",
      include: { model: order },
      include: { model: Restaurant },
    },
  });

  res.status(200).json({
    status: "success",
    order,
  });
});

const createUser = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Hash password
  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    name,
    email,
    password: hashPassword,
  });

  // Remove password from response
  newUser.password = undefined;

  res.status(201).json({
    status: "success",
    newUser,
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { name, email } = req.body;

  await user.update({ name, email });

  res.status(204).json({ status: "success" });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: "deleted" });

  res.status(204).json({ status: "success" });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate credentials (email)
  const user = await User.findOne({
    where: {
      email,
      status: "active",
    },
  });

  if (!user) {
    return next(new AppError("Credentials invalid", 400));
  }

  // Validate password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return next(new AppError("Credentials invalid", 400));
  }

  // Generate JWT (JsonWebToken) ->
  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  console.log(token);

  // Send response
  res.status(200).json({
    status: "success",
    token,
  });
});

module.exports = {
  getAllUsersOrders,
  getUsersOrderById,
  createUser,
  updateUser,
  deleteUser,
  login,
};
