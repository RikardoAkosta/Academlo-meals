const express = require("express");

// Controllers
const {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  createRestaurantsReview,
  updateRestaurantsReview,
  deleteRestaurantsReview,
} = require("../controllers/restaurants.controller");

// Middlewares
const {
  createUserValidators,
} = require("../middlewares/validators.middleware");
const {
  restaurantExists,
  userAdmin,
} = require("../middlewares/restaurants.middleware");

const { reviewExists } = require("../middlewares/reviews.middleware");

const {
  protectSession,
  protectUserAccount,
} = require("../middlewares/auth.middleware");

const restaurantsRouter = express.Router();

restaurantsRouter.get("/", getAllRestaurants);

restaurantsRouter.get("/:id", getRestaurantById);

restaurantsRouter.use(protectSession);

restaurantsRouter.post("/", createRestaurant);

restaurantsRouter.post(
  "/:id/review",
  restaurantExists,
  createRestaurantsReview
);

restaurantsRouter.patch(
  "/review/:id",
  userAdmin,
  reviewExists,
  updateRestaurantsReview
);

restaurantsRouter.delete(
  "/review/:id",
  userAdmin,
  reviewExists,
  deleteRestaurantsReview
);

restaurantsRouter
  .use("/:id", restaurantExists)
  .route("/:id")
  .patch(updateRestaurant)
  .delete(deleteRestaurant);

module.exports = { restaurantsRouter };
