const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
    {
        businessId: { type: String, unique: true, index: true, },

        owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, },

        businessName: { type: String, required: true, trim: true, },

        businessLogo: { type: String, default: null, },

        email: { type: String, trim: true, lowercase: true, },

        phone: { type: String, trim: true, },

        location: {
            address: { type: String, trim: true, },
            city: { type: String, trim: true, },
            state: { type: String, trim: true, },
            country: { type: String, trim: true, default: "Nigeria", },
        },

        taxIdentificationNumber: { type: String, default: null, trim: true, },

        bankDetails: {
            bankName: { type: String, default: null, },
            accountName: { type: String, default: null, },
            accountNumber: { type: String, default: null, },
        },
    },
    {
        timestamps: true,
    }
);

const Business = mongoose.model("Business", businessSchema);

export default Business;