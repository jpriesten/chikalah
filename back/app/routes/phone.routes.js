module.exports = (app) => {
    const phone = require("../controllers/phone.controller");
    const {auth} = require("../middlewares/authenticator.middleware");

    // Add a phone number
    app.post("/api/v1/tel/add", auth, phone.add);

    // Retrieve all phone numbers
    app.get("/api/v1/tels", auth, phone.findAll);

    // Retrieve the details of a phone number
    app.get("/api/v1/tel", auth, phone.findOne);

    // Update a phone number with phoneId
    app.put("/api/v1/tel/update", auth, phone.update);

    // Remove a phone number with phoneId
    app.delete("/api/v1/tel/delete", auth, phone.delete);
};
