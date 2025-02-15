const express = require("express");
const { signup, login, deposit, invest, getUserInvestments } = require("./AuthController");
const User = require("./model");  // ✅ Import User model

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
// 📌 Deposit Money
router.post("/deposit", deposit)
// 📌 Invest in a Product
router.post("/invest", invest)

router.get("/investments/:userId", getUserInvestments);
module.exports = router;
