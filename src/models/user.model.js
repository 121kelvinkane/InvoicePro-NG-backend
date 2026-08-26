const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userIdGen = require("../middlewares/userId.js");

const userSchema = new mongoose.Schema(
    {
        userId: { type: String, default: userIdGen, unique: true, index: true, },

        fullName: { type: String, required: true, trim: true, },

        email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"], },

        password: { type: String, required: true, minlength: 8, },

        role: { type: String, enum: ["user", "admin", "superAdmin"], default: "user", },

        isVerified: { type: Boolean, default: false, },

        resetPasswordToken: { type: String, default: null, },

        resetPasswordExpires: { type: Date, default: null, },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model("User", userSchema);

module.exports = User;