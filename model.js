const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 0 },  // Main balance (wallet)
    investmentBalance: { type: Number, default: 0 },  // Funds locked in investments
    investments: [{
        productName: { type: String, required: true },
        amount: { type: Number, required: true },
        roi: { type: Number, required: true },  // Expected return percentage
        duration: { type: String, required: true },  // Duration (e.g., "6 months")
        status: { type: String, enum: ["active", "completed"], default: "active" },
        createdAt: { type: Date, default: Date.now }
    }],
    transactions: [{
        type: { type: String, enum: ["deposit", "withdrawal", "investment", "profit"], required: true },
        amount: { type: Number, required: true },
        status: { type: String, enum: ["pending", "approved", "rejected"], default: "approved" },
        createdAt: { type: Date, default: Date.now }
    }]
    
}, { timestamps: true });




const AdminSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" },
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
const Admin = mongoose.model("Admin", AdminSchema);

module.exports = { User, Admin };
