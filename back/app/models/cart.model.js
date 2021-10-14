const mongoose = require("mongoose");
const {ProductStatus, Currencies} = require("../common/enum.common");

const CartSchema = mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Missing required field 'userID'"],
            ref: "User",
        },
        productID: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Missing required field 'productID'"],
            unique: true,
            ref: "Product",
        },
        productName: {
            required: [true, "Missing required field 'productName'"],
            type: String,
            unique: true,
            trim: true,
        },
        currency: {
            type: String,
            required: [true, "Missing required field 'currency'"],
            default: Currencies.Cameroon,
            enum: Currencies,
            trim: true,
        },
        unitPrice: {
            required: [true, "Missing required field 'unitPrice'"],
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
