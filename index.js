const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes"); // Import authentication routes
const { route } = require("./routes");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/agro_invest";

// Connect to MongoDB
mongoose.connect(MONGO_URI, {  useNewUrlParser: true,
    useUnifiedTopology: true,}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("MongoDB connection error:", err);
});

// Routes
app.use("/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Connected to port ${PORT}`);
});
