module.exports = (app) => {
    const users = require("../controllers/auth.controller");
    const {auth} = require("../middlewares/authenticator.middleware");

    // Create a new User
    app.post("/api/v1/auth/register", users.register);

    // Verify new user email address
    app.get("/api/v1/auth/register/confirmEmail", users.confirmEmail);

    // Login a user
    app.post("/api/v1/auth/login", users.login);

    // Log a user out
    app.post("/api/v1/auth/logout", auth, users.logout);
};
