const express = require("express");

// Controllers
const {
  getAllUsersOrders,
  getUsersOrderById,
  createUser,
  updateUser,
  deleteUser,
  login,
} = require("../controllers/users.controller");

// Middlewares
const {
  createUserValidators,
} = require("../middlewares/validators.middleware.js");
const { userExists } = require("../middlewares/users.middleware");
const { orderExists } = require("../middlewares/orders.middleware");

const {
  protectSession,
  protectUserAccount,
} = require("../middlewares/auth.middleware");

const usersRouter = express.Router();

usersRouter.post("/signup", createUserValidators, createUser);

usersRouter.post("/login", login);

usersRouter.use(protectSession);

usersRouter.get("/orders", getAllUsersOrders);

usersRouter.get("/:id/order", orderExists, getUsersOrderById);

usersRouter
  .use("/:id", userExists)
  .route("/:id")
  .patch(protectUserAccount, updateUser)
  .delete(protectUserAccount, deleteUser);

module.exports = { usersRouter };
