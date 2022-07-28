const express = require("express");

// Controllers
const {
  getAllUsersOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  login,
} = require("../controllers/orders.controller");

// Middlewares
const {
  createUserValidators,
} = require("../middlewares/validators.middleware");
const { orderExists } = require("../middlewares/orders.middleware");
const { userExists } = require("../middlewares/users.middleware");

const {
  protectSession,
  protectUserAccount,
} = require("../middlewares/auth.middleware");
const { userAdmin } = require("../middlewares/restaurants.middleware");

const ordersRouter = express.Router();

ordersRouter.use(protectSession);
ordersRouter.post("/", createOrder);

ordersRouter.get("/:id", userExists, getAllUsersOrders);

ordersRouter.patch("/:id", orderExists, updateOrder);
ordersRouter.delete("/:id", orderExists, deleteOrder);

module.exports = { ordersRouter };
