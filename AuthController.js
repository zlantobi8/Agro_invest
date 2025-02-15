const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("./model"); // Import User model

const signup = async (req, res) => {
    try {
        const { fullName, phone, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already registered" });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({ fullName, phone, email, password: hashedPassword, balance: 0, investmentBalance: 0, transactions: [], investments: [] });
        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// 📌 Deposit Money
const deposit = async (req, res) => {
    try {
        const { userId, amount } = req.body;

        if (!userId || !amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid deposit amount" });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Update balance & transactions
        user.balance += amount;
        user.transactions.push({ type: "deposit", amount, status: "approved" });
        await user.save();

        res.json({ message: "Deposit successful", balance: user.balance });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// 📌 Invest in a Product
const invest = async (req, res) => {
    try {
        const { userId, productName, amount, roi, duration } = req.body;

        if (!userId || !productName || !amount || amount <= 0 || !roi || !duration) {
            return res.status(400).json({ message: "Invalid investment data" });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.balance < amount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        // Deduct from balance & add to investment balance
        user.balance -= amount;
        user.investmentBalance = (user.investmentBalance || 0) + amount; // Ensure field exists
        user.investments = user.investments || []; // Ensure array exists
        user.investments.push({ productName, amount, roi, duration, status: "active" });
        user.transactions.push({ type: "investment", amount, status: "approved" });

        await user.save();
        res.json({ message: "Investment successful", investmentBalance: user.investmentBalance });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


const getUserInvestments = async (req, res) => {
    try {
        const { userId } = req.params; // Fetch userId from URL params

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ investments: user.investments || [] });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};





module.exports = { signup, login, deposit, invest,getUserInvestments };
