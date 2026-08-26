const mongoose = require("mongoose");
import invoiceIdGen from "../middlewares/invoiceId";

const invoiceItemSchema = new mongoose.Schema(
    {
        description: { type: String, required: true, trim: true, },
        quantity: { type: Number, required: true, min: 0.01, },
        unitPrice: { type: Number, required: true, min: 0, },
        amount: { type: Number, required: true, min: 0, },
    },
    { _id: false }
);

const invoiceSchema = new mongoose.Schema(
    {
        invoiceNumber: { 
            type: String,  
            default: invoiceIdGen, 
            unique: true,  
            trim: true, 
            index: true, 
        },

        business: { 
            type: mongoose.Schema.Types.ObjectId, ref: "Business",
            required: true, index: true,
        },

        customer: {
            name: { type: String, required: true, trim: true, },

            email: { type: String, trim: true, lowercase: true, },

            phone: { type: String, trim: true,},

            location: {
                address: { type: String, trim: true,},

                city: { type: String, trim: true, },

                state: { type: String, trim: true,},

                country: { type: String, default: "Nigeria",  trim: true, },
            },
        },

        items: {
            type: [invoiceItemSchema], required: true,
            validate: {
                validator: (items) => items.length > 0,
                message: "An invoice must contain at least one item",
            },
        },

        subtotal: { type: Number, required: true, min: 0,},

        discount: { type: Number, default: 0, min: 0, },

        tax: { type: Number, default: 0, min: 0, },

        total: { type: Number,  required: true,  min: 0, },

        issueDate: { type: Date, required: true, default: Date.now, },

        dueDate: { type: Date, default: null, },

        status: {
            type: String,
            enum: ["draft", "sent", "viewed", "partially_paid", "paid", "overdue", "cancelled",],
            default: "draft",
            index: true,
        },

        notes: { type: String, trim: true, default: null, },

        terms: { type: String, trim: true, default: null,},

        currency: {
            type: String,
            default: "NGN",
            uppercase: true,
            trim: true,
        },

        paymentDetails: {
            bankName: { type: String, trim: true, default: null },

            accountName: { type: String,  trim: true, default: null, },

            accountNumber: { type: String, trim: true, default: null, },
        },
    },
    {
        timestamps: true,
    }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;