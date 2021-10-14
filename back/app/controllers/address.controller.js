const Address = require("../models/address.model");
const response = require("../common/response.common");
const core = require("../common/core.common");

const {UserType} = require("../common/enum.common");

// Add a new address
exports.add = async (req, res) => {
    // Get user information from request
    if (Object.keys(req.body).length === 0) {
        return response.errorResponse(res, 400, "No data sent", 40000);
    }
    req.body.userID = req.user._id;
    const address = new Address(core.objectValuesToLowerCase(req.body));
    try {
        await core.verifyRequestData(address);
        await address.save();
        response.successResponse(res, 201, [{'message': 'Okay'}]);
    } catch (error) {
        response.errorResponse(res, error.statusCode || 500, error.value.message, error.value.code);
    }
};

// Retrieve and return all addresses from the database.
exports.findAll = async (req, res) => {
    // Get user object
    let user = req.user;
    try {
        let addresses;
        if (Object.keys(req.query).length === 0) {
            if (user.userType === UserType.Admin)
                addresses = await Address.find();
            else addresses = await Address.find({userID: user._id});
        } else {
            let params = {};
            req.query = core.objectValuesToLowerCase(req.query);
            if (!core.isEmptyOrNull(core.getQueryParameter(req.query, "userID"))) {
                params["userID"] = core.getQueryParameter(req.query, "userID");
            }
            if (!core.isEmptyOrNull(core.getQueryParameter(req.query, "isActive"))) {
                params["isActive"] = core.getQueryParameter(req.query, "isActive");
            }
            addresses = await Address.find(params);
        }
        response.successResponse(res, 200, [
            {count: Object.keys(addresses).length, addresses},
        ]);
    } catch (error) {
        response.errorResponse(res, 500, error.message, error.code);
    }
};

// Get details of an address
exports.findOne = async (req, res) => {
    const query = new Object(req.query);
    if (query.hasOwnProperty("id") && !core.isEmptyOrNull(query.id)) {
        try {
            const found = await Address.findById(query.id);
            if (core.isEmptyOrNull(found))
                response.errorResponse(res, 404, "Address not found", 40004);
            else response.successResponse(res, 200, [{address: found}]);
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
    if (core.isEmptyOrNull(req.body.country_code) && core.isEmptyOrNull(req.body.state_code) &&
        core.isEmptyOrNull(req.body.city_code) && core.isEmptyOrNull(req.body.addressLine_1) &&
        core.isEmptyOrNull(req.body.addressLine_2) && core.isEmptyOrNull(req.body.isActive) &&
        core.isEmptyOrNull(req.body.isPreferred)
    ) {
        return response.errorResponse(res, 400, "No record was modified", 40000);
    }

    // Get only entries which were modified
    let params = {};
    if (!core.isEmptyOrNull(req.body.id)) {
        params["id"] = req.body.id;
    }
    if (!core.isEmptyOrNull(req.body.countryID)) {
        params["countryID"] = req.body.countryID;
    }
    if (!core.isEmptyOrNull(req.body.stateID)) {
        params["stateID"] = req.body.stateID;
    }
    if (!core.isEmptyOrNull(req.body.cityID)) {
        params["cityID"] = req.body.cityID;
    }
    if (!core.isEmptyOrNull(req.body.addressLine_1)) {
        params["addressLine_1"] = req.body.addressLine_1;
    }
    if (!core.isEmptyOrNull(req.body.addressLine_2)) {
        params["addressLine_2"] = req.body.addressLine_2;
    }
    if (!core.isEmptyOrNull(req.body.isActive)) {
        params["isActive"] = req.body.isActive;
    }
    if (!core.isEmptyOrNull(req.body.isPreferred)) {
        params["isPreferred"] = req.body.isPreferred;
        if (params["isPreferred"]) {
            try {
                let user = req.user;
                await Address.updateMany({userID: user.id, isPreferred: true},
                    {isPreferred: false});
            } catch (error) {
                return response.errorResponse(res, 500, error.message, error.code);
            }
        }
    }

    try {
        // Find user and update it with the request body
        let updatedItem = await Address.findOneAndUpdate({_id: params["id"]}, params, {
            new: true,
            useFindAndModify: false,
        })
        if (!updatedItem) {
            return response.errorResponse(
                res,
                404,
                `Address not found with id: ${params["id"]}`,
                40004
            );
        }
        response.successResponse(res, 200, [{address: updatedItem}]);
    } catch (error) {
        if (error.kind === "ObjectId") {
            return response.errorResponse(
                res,
                404,
                `Address not found with id: ${params["id"]}`,
                error.code,
                error.message
            );
        }
        response.errorResponse(res, 500, error.message, error.code);
    }
};

// Delete an address with the specified item Id
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

    Address.findOneAndDelete({_id: params["id"]})
        .then((item) => {
            if (!item) {
                return response.errorResponse(
                    res,
                    404,
                    `Address not found with id: ${params["id"]}`,
                    40004
                );
            }
            response.successResponse(res, 200, ["Address deleted successfully!"]);
        })
        .catch((error) => {
            if (error.kind === "ObjectId" || error.name === "NotFound") {
                return response.errorResponse(
                    res,
                    404,
                    `Address not found with id: ${params["id"]} ::: ${error.message}`,
                    error.code
                );
            }
            return response.errorResponse(res, 500, error.message, error.code);
        });
};
