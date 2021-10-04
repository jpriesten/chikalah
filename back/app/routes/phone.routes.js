module.exports = (app) => {
    const phone = require("../controllers/phone.controller");
    const authenticate = require("../middlewares/authenticator.middleware");

    // Add a phone number
    app.post("/api/v1/tel/add", authenticate, phone.add);

    // Retrieve all phone numbers
    app.get("/api/v1/tels", authenticate, phone.findAll);

    // Retrieve the details of a phone number
    app.get("/api/v1/tel", authenticate, phone.findOne);

    // Update a phone number with phoneId
    app.put("/api/v1/tel/update", authenticate, phone.update);

    // Remove a phone number with phoneId
    app.delete("/api/v1/tel/delete", authenticate, phone.delete);
};
