const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { AppError } = require("../utils/appError.util");

// Models
const { Order } = require("../models/order.model");
const { User } = require("../models/user.model");
const { Meal } = require("../models/meal.model");
const { Restaurant } = require("../models/restaurant.model");

// Utils
const { catchAsync } = require("../utils/catchAsync.util");

dotenv.config({ path: "./config.env" });

const getAllUsersOrders = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({
    where: { id, status: "active" },
    include: {
      model: Order,
      include: { model: Meal, include: { model: Restaurant } },
    },
  });

  res.status(200).json({
    status: "success",
    user,
  });
});

const createOrder = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const { mealId } = req.body;
  const { quantity } = req.body;

  const meal = await Meal.findOne({ where: { id: mealId } });
  if (!meal) {
    return new AppError("Meal not found", 404);
  }

  const newOrder = await Order.create({
    mealId,
    userId: sessionUser.id,
    totalPrice: meal.price * quantity,
    quantity,
  });

  res.status(201).json({
    status: "success",
    newOrder,
  });
});

const updateOrder = catchAsync(async (req, res, next) => {
  const { order } = req;

  await order.update({ status: "completed" });

  res.status(204).json({ status: "success" });
});

const deleteOrder = catchAsync(async (req, res, next) => {
  const { order } = req;

  await order.update({ status: "cancelled" });

  res.status(204).json({ status: "success" });
});

// Generate JWT (JsonWebToken) ->
// const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
// 	expiresIn: '30d',
// });
// console.log(token)

// // Send response
// res.status(200).json({
// 	status: 'success',
// 	token,
// });

module.exports = {
  getAllUsersOrders,
  createOrder,
  updateOrder,
  deleteOrder,
};
