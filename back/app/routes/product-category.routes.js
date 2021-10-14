module.exports = (app) => {
    const productCategory = require("../controllers/product-category.controller");
    const {auth, isAdmin} = require("../middlewares/authenticator.middleware");

    // Create a new product category
    app.post("/api/v1/product-category/add", [auth, isAdmin], productCategory.add);

    // Retrieve all product category
    app.get("/api/v1/product-categories", auth, productCategory.findAll);

    // Retrieve the details of a product category with userId
    app.get("/api/v1/product-category", auth, productCategory.findOne);

    // Update a product category with categoryId
    app.put("/api/v1/product-category/update", [auth, isAdmin], productCategory.update);

    // Delete a product category with categoryId
    app.delete("/api/v1/product-category/delete", [auth, isAdmin], productCategory.delete);
};
