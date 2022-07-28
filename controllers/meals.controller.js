const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Models
const { Restaurant } = require("../models/restaurant.model");
const { Meal } = require("../models/meal.model");

// Utils
const { catchAsync } = require("../utils/catchAsync.util");

dotenv.config({ path: "./config.env" });

const getAllMeals = catchAsync(async (req, res, next) => {
  const meals = await Meal.findAll({ where: { status: "active" } });

  res.status(200).json({
    status: "success",
    meals,
  });
});

const getMealById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const meal = await Meal.findAll({ where: { id, status: "active" } });

  res.status(200).json({
    status: "success",
    meal,
  });
});

const createMeal = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, price } = req.body;

  const newMeal = await Meal.create({
    name,
    price,
    restaurantId: id,
  });

  //const restaurant = await Restaurant.findOne({where: {id}, include: [newMeal]})

  res.status(201).json({
    status: "success",
    newMeal,
  });
});

const updateMeal = catchAsync(async (req, res, next) => {
  const { meal } = req;
  const { name, price } = req.body;

  await meal.update({ name, price });

  res.status(204).json({ status: "success" });
});

const deleteMeal = catchAsync(async (req, res, next) => {
  const { meal } = req;

  await meal.update({ status: "deleted" });

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
  getAllMeals,
  getMealById,
  createMeal,
  updateMeal,
  deleteMeal,
  //login,
};
