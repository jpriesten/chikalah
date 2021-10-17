module.exports = (app) => {
    const cart = require("../controllers/cart.controller");
    const {auth} = require("../middlewares/authenticator.middleware");

    // Add a item to cart
    app.post("/api/v1/cart/add", auth, cart.add);

    // Retrieve all cart items
    app.get("/api/v1/cart-items", auth, cart.findAll);

    // Retrieve the details of an Item with itemId
    app.get("/api/v1/cart-item", auth, cart.findOne);

    // Update an Item in Cart with itemId
    app.put("/api/v1/item/update", auth, cart.update);

    // Remove an Item from Cart with itemId
    app.delete("/api/v1/item/delete", auth, cart.delete);
};
