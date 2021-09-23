module.exports = (app) => {
    const users = require("../controllers/user.controller.js");
    const authenticate = require("../middlewares/authenticator.middleware");

    // Create a new User
    app.post("/api/v1/user/register", users.register);

    // Verify new user email address
    app.get("/api/v1/user/register/confirmEmail", users.confirmEmail);

    // Login a user
    app.post("/api/v1/user/login", users.login);

    // Log a user out
    app.post("/api/v1/user/logout", authenticate, users.logout);

    // Retrieve all Users
    app.get("/api/v1/users", authenticate, users.findAll);

    // Retrieve the details of a user or Retrieve a single User with userId
    app.get("/api/v1/user", authenticate, users.findOne);

    // Update a User with userId
    app.put("/api/v1/user", authenticate, users.update);

    // Delete a User with userId
    app.delete("/api/v1/user", authenticate, users.delete);
};
