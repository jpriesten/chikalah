const mongoose = require("mongoose");
const {ProductStatus, Currencies} = require("../common/enum.common");

const ProductSchema = mongoose.Schema(
    {
        categoryID: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Product-Category",
        },
        name: {
            required: true,
            type: String,
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        isActive: {
            type: Boolean,
            required: true,
            default: true,
            trim: true,
        },
        currency: {
            type: String,
            required: true,
            default: Currencies.Cameroon,
            trim: true,
        },
        price: {
            required: true,
            type: Number,
            min: 0.00,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
