const mongoose = require("mongoose");
const {ProductStatus, Currencies} = require("../common/enum.common");

const CartSchema = mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        productID: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            unique: true,
            ref: "Product",
        },
        productName: {
            required: true,
            type: String,
            unique: true,
            trim: true,
        },
        currency: {
            type: String,
            required: true,
            default: Currencies.Cameroon,
            enum: Currencies,
            trim: true,
        },
        unitPrice: {
            required: true,
            type: Number,
            min: 0.00,
            trim: true,
        },
        quantity: {
            required: true,
            default: 1,
            min: 1,
            type: Number,
            trim: true,
        },
        totalCost: {
            type: Number,
            default: 0.00,
            min: 0,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;
