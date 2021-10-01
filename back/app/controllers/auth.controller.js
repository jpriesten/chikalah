const User = require("../models/user.model");
const response = require("../common/response.common");
const core = require("../common/core.common");

// Create and Save a new User
exports.register = (req, res) => {
    // Get user information from request
    if (Object.keys(req.body).length === 0) {
        return response.errorResponse(res, 404, "No data sent", 40004);
    }
    const user = new User(core.objectValuesToLowerCase(req.body));
    if (!user.get("firstname"))
        return response.errorResponse(res, 404, "Missing required field 'firstname", 40004);
    else if (!user.get("email"))
        return response.errorResponse(res, 404, "Missing required field 'email", 40004);
    else if (!user.get("password"))
        return response.errorResponse(res, 404, "Missing required field 'password", 40004);
    User.init()
        .then(async () => {
            try {
                // Save the user to db, generate a token and send it back as response
                const token = await user.newAuthToken();
                if (token.error === true) {
                    response.errorResponse(
                        res,
                        500,
                        token.detail.message,
                        token.detail.code,
                        token.detail.extra
                    );
                } else if (token.error === false) {
                    response.successResponse(res, 201, [
                        {message: 'User created'},
                    ]);
                }
            } catch (error) {
                response.errorResponse(res, 500, error.message, error.code);
            }
        })
        .catch((error) => {
            response.errorResponse(res, 500, error.message, error.code);
        });
};

exports.confirmEmail = async (req, res) => {
    try {
        if (Object.keys(req.query).length === 0) {
            response.errorResponse(res, 404, "Missing confirmation token", 40004);
        } else {
            let params = {};
            if (!core.isEmptyOrNull(core.getQueryParameter(req.query, "token"))) {
                params["token"] = core.getQueryParameter(req.query, "token");
                const encryptionCypher = core.verifyEmailVerificationToken(
                    params["token"]
                );
                let decodedUserId = core.decryptData(encryptionCypher._id);
                // Find user and update its email active status
                let updateParam = {emailActive: true};
                User.findOneAndUpdate({_id: decodedUserId}, updateParam, {
                    new: true,
                    useFindAndModify: false,
                })
                    .then((updatedUser) => {
                        if (!updatedUser) {
                            return response.errorResponse(
                                res,
                                404,
                                `User not found with id: ${decodedUserId}`,
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
                                `User not found with id: ${decodedUserId}`,
                                error.code,
                                error.message
                            );
                        }
                        return response.errorResponse(res, 500, error.message, error.code);
                    });
            } else {
                response.errorResponse(res, 404, "Missing confirmation token", 40004);
            }
        }
    } catch (error) {
        response.errorResponse(res, 500, error.message, error.code);
    }
};

// Login a user
exports.login = async (req, res) => {
    // Get user information from request
    if (Object.keys(req.body).length === 0) {
        return response.errorResponse(res, 404, "No data sent", 40004);
    }
    const user = new User(core.objectValuesToLowerCase(req.body));
    if (!user.get("email"))
        return response.errorResponse(res, 404, "Missing required field 'email", 40004);
    else if (!user.get("password"))
        return response.errorResponse(res, 404, "Missing required field 'password", 40004);

    const requestUser = new User(req.body);
    try {
        let user = await requestUser.checkValidCredentials(
            req.body.email,
            req.body.password
        );
        if (user.error === true) {
            response.errorResponse(res, 404, user.detail.message, user.detail.code);
        } else if (user.error === false) {
            const token = await user.user.newAuthToken();
            console.log("Auth Token: ", token);
            if (token.error === true) {
                response.errorResponse(
                    res,
                    500,
                    token.detail.message,
                    token.detail.code
                );
            } else if (token.error === false) {
                response.successResponse(res, 200, [
                    {token: token.token, user: user.user},
                ]);
            }
        }
    } catch (error) {
        response.errorResponse(res, 500, error.message, error.code);
    }
};

// Log user out
exports.logout = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });

        await req.user.save();
        response.successResponse(res, 200, ["LOGGED OUT!"]);
    } catch (error) {
        response.errorResponse(res, 500, error.message, error.code);
    }
};
