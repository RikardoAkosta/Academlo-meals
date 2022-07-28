const { app } = require("./app");

// Models
const { User } = require("./models/user.model");
const { Review } = require("./models/review.model");
const { Order } = require("./models/order.model");
const { Meal } = require("./models/meal.model");
const { Restaurant } = require("./models/restaurant.model");

// Utils
const { db } = require("./utils/database.util");

db.authenticate()
  .then(() => console.log("Db authenticated"))
  .catch(err => console.log(err));

Meal.hasOne(Order, { foreignKey: "mealId" });
Order.belongsTo(Meal);

User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User);

User.hasMany(Review, { foreignKey: "userId" });
Review.belongsTo(User);

Restaurant.hasMany(Review, { foreignKey: "restaurantId" });
Review.belongsTo(Restaurant);

Restaurant.hasMany(Meal, { foreignKey: "restaurantId" });
Meal.belongsTo(Restaurant);

db.sync({
  force: true,
})
  .then(() => console.log("Db synced"))
  .catch(err => console.log(err));

app.listen(5000, () => {
  console.log("Express app running!!");
});
