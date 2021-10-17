module.exports = (app) => {
    const users = require("../controllers/user.controller.js");
    const {auth} = require("../middlewares/authenticator.middleware");

    // Retrieve all Users
    app.get("/api/v1/users", auth, users.findAll);

    // Retrieve the details of a user or Retrieve a single User with userId
    app.get("/api/v1/user", auth, users.findOne);

    // Update a User with userId
    app.put("/api/v1/user", auth, users.update);

    // Delete a User with userId
    app.delete("/api/v1/user", auth, users.delete);
};
