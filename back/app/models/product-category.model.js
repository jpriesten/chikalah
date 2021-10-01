const mongoose = require("mongoose");

const ProductCategorySchema = mongoose.Schema(
    {
        name: {
            required: true,
            type: String,
            unique: [true, "Category already exists"],
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const ProductCategory = mongoose.model("Product-Category", ProductCategorySchema);
module.exports = ProductCategory;
