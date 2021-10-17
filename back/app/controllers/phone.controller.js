const Phone = require("../models/phone.model");
const response = require("../common/response.common");
const core = require("../common/core.common");
const {UserType} = require("../common/enum.common");

// Add a new phone number
exports.add = async (req, res) => {
    // Get user information from request
    if (Object.keys(req.body).length === 0) {
        return response.errorResponse(res, 400, "No data sent", 40000);
    }
    req.body.userID = req.user._id;
    const phone = new Phone(core.objectValuesToLowerCase(req.body));
    try {
        await core.verifyRequestData(phone);
        await phone.save();
        response.successResponse(res, 201, [{'message': 'Okay'}]);
    } catch (error) {
        if (error?.code === 11000)
            return response.errorResponse(res, 409, "Phone number already exists", error.code);
        response.errorResponse(res, error.statusCode || 500, error.value.message, error.value.code);
    }
};

// Retrieve and return all phone numbers from the database.
exports.findAll = async (req, res) => {
    // Get user object
    let user = req.user;
    try {
        let tels;
        if (Object.keys(req.query).length === 0) {
            if (user.userType === UserType.Admin)
                tels = await Phone.find();
            else tels = await Phone.find({userID: user._id});
        } else {
            let params = {};
            req.query = core.objectValuesToLowerCase(req.query);
            if (!core.isEmptyOrNull(core.getQueryParameter(req.query, "userID"))) {
                params["userID"] = core.getQueryParameter(req.query, "userID");
            }
            if (!core.isEmptyOrNull(core.getQueryParameter(req.query, "isActive"))) {
                params["isActive"] = core.getQueryParameter(req.query, "isActive");
            }
            tels = await Phone.find(params);
        }
        response.successResponse(res, 200, [
            {count: Object.keys(tels).length, tels},
        ]);
    } catch (error) {
        response.errorResponse(res, 500, error.message, error.code);
    }
};

// Get details of a phone number
exports.findOne = async (req, res) => {
    // Get user by ID
    const query = new Object(req.query);
    if (query.hasOwnProperty("id") && !core.isEmptyOrNull(query.id)) {
        try {
            const found = await Phone.findById(query.id);
            if (core.isEmptyOrNull(found))
                response.errorResponse(res, 404, "Phone number not found", 40004);
            else response.successResponse(res, 200, [{tel: found}]);
        } catch (error) {
            response.errorResponse(res, 500, error.message, error.code);
        }
    } else {
        response.errorResponse(res, 400, "Poorly formatted query", 40000, {
            query,
        });
    }

};

// Update a phone item identified by the itemId in the request
exports.update = async (req, res) => {
    // Validate Request
    if (core.isEmptyOrNull(req.body.id)
    ) {
        return response.errorResponse(res, 400, "Missing required field 'id'", 40000);
    }
    if (core.isEmptyOrNull(req.body.phone) &&
        core.isEmptyOrNull(req.body.description) &&
        core.isEmptyOrNull(req.body.isActive) &&
        core.isEmptyOrNull(req.body.isPreferred)
    ) {
        return response.errorResponse(res, 400, "No record was modified", 40000);
    }

    // Get only entries which were modified
    let params = {};
    if (!core.isEmptyOrNull(req.body.id)) {
        params["id"] = req.body.id;
    }
    if (!core.isEmptyOrNull(req.body.phone)) {
        params["phone"] = req.body.phone;
    }
    if (!core.isEmptyOrNull(req.body.description)) {
        params["description"] = req.body.description;
    }
    if (!core.isEmptyOrNull(req.body.isActive)) {
        params["isActive"] = req.body.isActive;
    }
    if (!core.isEmptyOrNull(req.body.isPreferred)) {
        params["isPreferred"] = req.body.isPreferred;
        if (params["isPreferred"]) {
            try {
                let user = req.user;
                await Phone.updateMany({userID: user.id, isPreferred: true},
                    {isPreferred: false});
            } catch (error) {
                return response.errorResponse(res, 500, error.message, error.code);
            }
        }
    }

    try {
        // Find user and update it with the request body
        let updatedItem = await Phone.findOneAndUpdate({_id: params["id"]}, params, {
            new: true,
            useFindAndModify: false,
        })
        if (!updatedItem) {
            return response.errorResponse(
                res,
                404,
                `Phone not found with id: ${params["id"]}`,
                40004
            );
        }
        response.successResponse(res, 200, [{tel: updatedItem}]);
    } catch (error) {
        if (error.kind === "ObjectId") {
            return response.errorResponse(
                res,
                404,
                `Phone not found with id: ${params["id"]}`,
                error.code,
                error.message
            );
        }
        response.errorResponse(res, 500, error.message, error.code);
    }
};

// Delete a phone item category with the specified item Id
exports.delete = (req, res) => {
    // Validate Request
    if (
        core.isEmptyOrNull(req.body.id)
    ) {
        return response.errorResponse(res, 400, "Missing required field 'id'", 40000);
    }

    // Get only entries which were modified
    let params = {};
    if (!core.isEmptyOrNull(req.body.id)) {
        params["id"] = req.body.id;
    }

    Phone.findOneAndDelete({_id: params["id"]})
        .then((item) => {
            if (!item) {
                return response.errorResponse(
                    res,
                    404,
                    `Phone not found with id: ${params["id"]}`,
                    40004
                );
            }
            response.successResponse(res, 200, ["Phone number deleted successfully!"]);
        })
        .catch((error) => {
            if (error.kind === "ObjectId" || error.name === "NotFound") {
                return response.errorResponse(
                    res,
                    404,
                    `Item not found with id: ${params["id"]} ::: ${error.message}`,
                    error.code
                );
            }
            return response.errorResponse(res, 500, error.message, error.code);
        });
};
