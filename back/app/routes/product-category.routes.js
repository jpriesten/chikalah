module.exports = (app) => {
    const productCategory = require("../controllers/product-category.controller");
    const authenticate = require("../middlewares/authenticator.middleware");

    // Create a new product category
    app.post("/api/v1/product-category/add", productCategory.add);

    // Retrieve all product category
    app.get("/api/v1/product-categories", authenticate, productCategory.findAll);

    // Retrieve the details of a product category with userId
    app.get("/api/v1/product-category", authenticate, productCategory.findOne);

    // Update a product category with categoryId
    app.put("/api/v1/product-category/update", authenticate, productCategory.update);

    // Delete a product category with categoryId
    app.delete("/api/v1/product-category/delete", authenticate, productCategory.delete);
};
