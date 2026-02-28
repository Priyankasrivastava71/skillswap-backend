require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const requestRoutes = require("./routes/requestRoutes")
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const errorHandler = require("./middleware/errorMiddleware");
const notificationRoutes = require("./routes/notificationRoutes");
const { errorResponse } = require("./utils/responseHandler");
const feedbackRoutes= require("./routes/feedbackRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/requests",requestRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/resources", resourceRoutes);
app.use(errorHandler);
app.use("/api/notifications", notificationRoutes);
app.use("/api/feedback",feedbackRoutes);
app.use((err, req, res, next)=>{
  console.error(err.stack);
  return errorResponse(res,500,"Internal Server Error");
});

// Test Route
app.get("/", (req, res) => {
  res.send("SkillSwap API is running ");
});

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

