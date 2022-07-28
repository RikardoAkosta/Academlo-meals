const express = require("express");

// Controllers
const {
  getAllMeals,
  getMealById,
  createMeal,
  updateMeal,
  deleteMeal,
} = require("../controllers/meals.controller");

// Middlewares
const {
  createUserValidators,
} = require("../middlewares/validators.middleware");
const { mealExists } = require("../middlewares/meals.middleware");
const { restaurantExists } = require("../middlewares/restaurants.middleware");

const {
  protectSession,
  protectUserAccount,
} = require("../middlewares/auth.middleware");

const mealsRouter = express.Router();

mealsRouter.get("/", getAllMeals);

mealsRouter.get("/:id", getMealById);

mealsRouter.use(protectSession);

mealsRouter.post("/:id", restaurantExists, createMeal);

mealsRouter
  .use("/:id", mealExists)
  .route("/:id")
  .patch(updateMeal)
  .delete(deleteMeal);

module.exports = { mealsRouter };
