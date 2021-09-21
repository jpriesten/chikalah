const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const logger = require("./app/logging/logs");
const response = require("./app/common/response.common");
const dotenv = require("dotenv");
const cors = require("cors");

// create express app
const app = express();
dotenv.config();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// Configuring the database
mongoose.Promise = global.Promise;

// Connecting to the database
mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((error) => {
    console.log("Could not connect to the database. Exiting now...", error);
    // process.exit();
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
  res.json({ message: "Welcome to bholo server application." });
});

// API documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// User routes
require("./app/routes/user.routes")(app);
// post routes
require("./app/routes/post.routes")(app);

app.use(logger.errorLogger);
// listen for requests
app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log("CORS-enabled Server is listening on port", process.env.PORT);
});
