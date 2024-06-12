const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database"); // Adjust the path as necessary
const usersRoutes = require("./routes/users");
const networkRoutes = require("./routes/network");
const questionsRoutes = require("./routes/questions");
const authRoutes = require("./routes/auth");

// Import the models to ensure they are registered with Sequelize
const User = require("./models/user");
const Profile = require("./models/profile");
const Connection = require("./models/connection");
const Question = require("./models/question");
const Answer = require("./models/answer");
const UserInteraction = require("./models/userInteraction");

const app = express();

app.use(cors());
app.use(express.json());

// Use the routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/network", networkRoutes);
app.use("/api/questions", questionsRoutes);

// Sync the models with the database
sequelize
  .sync({ alter: true }) // Alter will ensure the database schema matches the model definitions
  .then(() => {
    console.log("Database synced");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });

module.exports = app;
