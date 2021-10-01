const authenticate = require("../middlewares/authenticator.middleware");
module.exports = (app) => {
    const cart = require("../controllers/cart.controller");
    const authenticate = require("../middlewares/authenticator.middleware");

    // Add a item to cart
    app.post("/api/v1/cart/add", authenticate, cart.add);

    // Retrieve all cart items
    app.get("/api/v1/cart-items", cart.findAll);

    // Retrieve the details of an Item with itemId
    app.get("/api/v1/cart-item", cart.findOne);

    // Update an Item in Cart with itemId
    app.put("/api/v1/item/update", authenticate, cart.update);

    // Remove an Item from Cart with itemId
    app.delete("/api/v1/item/delete", authenticate, cart.delete);
};
