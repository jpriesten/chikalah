module.exports = (app) => {
    const address = require("../controllers/address.controller");
    const {auth} = require("../middlewares/authenticator.middleware");

    // Add an address
    app.post("/api/v1/address/add", auth, address.add);

    // Retrieve all addresses
    app.get("/api/v1/addresses", auth, address.findAll);

    // Retrieve the details of an address
    app.get("/api/v1/address", auth, address.findOne);

    // Update an address with addressId
    app.put("/api/v1/address/update", auth, address.update);

    // Remove an address with addressId
    app.delete("/api/v1/address/delete", auth, address.delete);
};
