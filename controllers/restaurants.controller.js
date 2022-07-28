const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Models
const { Restaurant } = require("../models/restaurant.model");
const { Review } = require("../models/review.model");

// Utils
const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util");

dotenv.config({ path: "./config.env" });

const getAllRestaurants = catchAsync(async (req, res, next) => {
  const restaurants = await Restaurant.findAll({
    where: { status: "active" },
    include: {
      model: Review,
      required: false, //, where:{ status: 'active'}//
    },
  });

  res.status(200).json({
    status: "success",
    restaurants,
  });
});

const getRestaurantById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const restaurant = await Restaurant.findOne({
    where: { id, status: "active" },
  });

  res.status(200).json({
    status: "success",
    restaurant,
  });
});

const createRestaurant = catchAsync(async (req, res, next) => {
  const { name, address, rating } = req.body;

  const newRestaurant = await Restaurant.create({
    name,
    address,
    rating,
  });

  res.status(201).json({
    status: "success",
    newRestaurant,
  });
});

const updateRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant } = req;
  const { name, address } = req.body;

  await restaurant.update({ name, address });

  res.status(204).json({ status: "success" });
});

const deleteRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant } = req;

  await restaurant.update({ status: "deleted" });

  res.status(204).json({ status: "success" });
});

const createRestaurantsReview = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { comment, rating } = req.body;
  const { sessionUser } = req;

  const newReview = await Review.create({
    userId: sessionUser.id,
    comment,
    restaurantId: id,
    rating,
  });

  // const restaurant = await Restaurant.findOne({where:{id}, include:[newReview]})

  res.status(201).json({
    status: "success",
    newReview,
  });
});

const updateRestaurantsReview = catchAsync(async (req, res, next) => {
  const { review } = req;
  const { comment, rating } = req.body;

  await review.update({ comment, rating });

  res.status(204).json({ status: "success" });
});

const deleteRestaurantsReview = catchAsync(async (req, res, next) => {
  const { review } = req;

  await review.update({ status: "deleted" });

  res.status(204).json({ status: "success" });
});

// // Generate JWT (JsonWebToken) ->
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
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  createRestaurantsReview,
  updateRestaurantsReview,
  deleteRestaurantsReview,

  // login,
};
