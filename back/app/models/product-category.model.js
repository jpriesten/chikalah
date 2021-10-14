const mongoose = require("mongoose");

const ProductCategorySchema = mongoose.Schema(
    {
        name: {
            required: [true, "Missing required field 'name'"],
            type: String,
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Missing required field 'description'"],
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const ProductCategory = mongoose.model("Product-Category", ProductCategorySchema);
module.exports = ProductCategory;
