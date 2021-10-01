const authenticate = require("../middlewares/authenticator.middleware");
module.exports = (app) => {
    const product = require("../controllers/product.controller");
    const authenticate = require("../middlewares/authenticator.middleware");

    // Create a new product
    app.post("/api/v1/product/add", authenticate, product.add);

    // Retrieve all products
    app.get("/api/v1/products", product.findAll);

    // Retrieve the details of a product with productId
    app.get("/api/v1/product", product.findOne);

    // Update a product with productId
    app.put("/api/v1/product/update", authenticate, product.update);

    // Delete a product with productId
    app.delete("/api/v1/product/delete", authenticate, product.delete);
};
