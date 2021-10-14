const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const logger = require("./app/logging/logs");
const database = require("./app/services/database.service");
const dotenv = require("dotenv");
const cors = require("cors");

// create express app
const app = express();
dotenv.config();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// Connecting to the database
database.openConnection()
    .then(() => {
        console.log("Successfully connected to the database");
    })
    .catch((error) => {
        console.log("Could not connect to the database. Exiting now...", error);
    });

app.use(logger.requestLogger);

// Enable CORS globally
const corsOptions = {
    origin: "*",
    allowedHeaders:
        "Content-Type,X-Amz-Date,Authorization,X-Api-Key,Origin,Accept,Access-Control-Allow-Headers,Access-Control-Allow-Methods,Access-Control-Allow-Origin",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};
app.use(cors(corsOptions));

// define a simple route
app.get("/", (req, res) => {
    res.json({message: "Welcome to chikalah server application."});
});

// API documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Auth routes
require("./app/routes/auth.routes")(app);
// User routes
require("./app/routes/user.routes")(app);
// Product routes
require("./app/routes/product.routes")(app);
// Product category routes
require("./app/routes/product-category.routes")(app);
// Cart routes
require("./app/routes/cart.routes")(app);
// Phone number management routes
require("./app/routes/phone.routes")(app);
// Address management routes
require("./app/routes/address.routes")(app);
// Demographic data routes
require("./app/routes/demography.routes")(app);

app.use(logger.errorLogger);
// listen for requests
app.listen(process.env.PORT, '0.0.0.0', () => {
    console.log("CORS-enabled Server is listening on port", process.env.PORT);
});
