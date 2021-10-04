const User = require("../models/user.model");
const response = require("../common/response.common");
const core = require("../common/core.common");

// Retrieve and return all users from the database.
exports.findAll = async (req, res) => {
    // Get request query parameters.
    try {
        let users = {};
        if (Object.keys(req.query).length === 0) users = await User.find();
        else {
            let params = {};
            req.query = core.objectValuesToLowerCase(req.query);
            if (!core.isEmptyOrNull(core.getQueryParameter(req.query, "firstname"))) {
                params["firstname"] = core.getQueryParameter(req.query, "firstname");
            }
            if (
                !core.isEmptyOrNull(core.getQueryParameter(req.query, "othernames"))
            ) {
                params["othernames"] = core.getQueryParameter(req.query, "othernames");
            }
            if (!core.isEmptyOrNull(core.getQueryParameter(req.query, "sex"))) {
                params["sex"] = core.getQueryParameter(req.query, "sex");
            }
            if (!core.isEmptyOrNull(core.getQueryParameter(req.query, "dob"))) {
                params["dob"] = core.getQueryParameter(req.query, "dob");
            }
            if (!core.isEmptyOrNull(core.getQueryParameter(req.query, "address"))) {
                params["address"] = core.getQueryParameter(req.query, "address");
            }
            if (!core.isEmptyOrNull(core.getQueryParameter(req.query, "country"))) {
                params["country"] = core.getQueryParameter(req.query, "country");
            }
            if (!core.isEmptyOrNull(core.getQueryParameter(req.query, "city"))) {
                params["city"] = core.getQueryParameter(req.query, "city");
            }
            users = await User.find(params);
        }
        response.successResponse(res, 200, [
            {users, count: Object.keys(users).length},
        ]);
    } catch (error) {
        response.errorResponse(res, 500, error.message, error.code);
    }
};

// Get details of the logged in user
exports.findOne = async (req, res) => {
    let user = req.user;
    if (Object.keys(req.query).length === 0)
        response.successResponse(res, 200, [{user}]);
    else {
        // Get user by ID
        const query = new Object(req.query);
        if (query.hasOwnProperty("id") && !core.isEmptyOrNull(query.id)) {
            try {
                const foundUser = await User.findById(query.id);
                if (core.isEmptyOrNull(foundUser))
                    response.errorResponse(res, 404, "User not found", 40004);
                else response.successResponse(res, 200, [{user: foundUser}]);
            } catch (error) {
                response.errorResponse(res, 500, error.message, error.code);
            }
        } else {
            response.errorResponse(res, 400, "Poorly formatted query", 40000, {
                query,
            });
        }
    }
};

// Update a user identified by the userId in the request
exports.update = (req, res) => {
    // Validate Request
    if (
        core.isEmptyOrNull(req.body.othernames) &&
        core.isEmptyOrNull(req.body.sex) &&
        core.isEmptyOrNull(req.body.dob) &&
        core.isEmptyOrNull(req.body.address) &&
        core.isEmptyOrNull(req.body.country) &&
        core.isEmptyOrNull(req.body.city)
    ) {
        return response.errorResponse(res, 400, "No record was modified", 40000);
    }

    // Get only entries which were modified
    let params = {};
    if (!core.isEmptyOrNull(req.body.othernames)) {
        params["othernames"] = req.body.othernames;
    }
    if (!core.isEmptyOrNull(req.body.sex)) {
        params["sex"] = req.body.sex;
    }
    if (!core.isEmptyOrNull(req.body.dob)) {
        params["dob"] = req.body.dob;
    }
    if (!core.isEmptyOrNull(req.body.address)) {
        params["address"] = req.body.address;
    }
    if (!core.isEmptyOrNull(req.body.country)) {
        params["country"] = req.body.country;
    }
    if (!core.isEmptyOrNull(req.body.city)) {
        params["city"] = req.body.city;
    }

    // Find user and update it with the request body
    User.findOneAndUpdate({_id: req.user._id}, params, {
        new: true,
        useFindAndModify: false,
    })
        .then((updatedUser) => {
            if (!updatedUser) {
                return response.errorResponse(
                    res,
                    404,
                    `User not found with id: ${req.user._id}`,
                    40004
                );
            }
            response.successResponse(res, 200, [{user: updatedUser}]);
        })
        .catch((error) => {
            if (error.kind === "ObjectId") {
                return response.errorResponse(
                    res,
                    404,
                    `User not found with id: ${req.user._id}`,
                    error.code,
                    error.message
                );
            }
            return response.errorResponse(res, 500, error.message, error.code);
        });
};

// Delete a user with the specified userId in the request
exports.delete = (req, res) => {
    User.findOneAndDelete({_id: req.user._id})
        .then((user) => {
            if (!user) {
                return response.errorResponse(
                    res,
                    404,
                    `User not found with id: ${req.user._id}`,
                    40004
                );
            }
            response.successResponse(res, 200, ["User deleted successfully!"]);
        })
        .catch((error) => {
            if (error.kind === "ObjectId" || error.name === "NotFound") {
                return response.errorResponse(
                    res,
                    404,
                    `User not found with id: ${req.user._id} ::: ${error.message}`,
                    error.code
                );
            }
            return response.errorResponse(res, 500, error.message, error.code);
        });
};
