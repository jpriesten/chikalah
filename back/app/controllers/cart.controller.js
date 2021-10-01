const Cart = require("../models/cart.model");
const response = require("../common/response.common");
const core = require("../common/core.common");

// Add a new item to cart
exports.add = async (req, res) => {
    // Get user information from request
    if (Object.keys(req.body).length === 0) {
        return response.errorResponse(res, 404, "No data sent", 40004);
    }
    const cart = new Cart(core.objectValuesToLowerCase(req.body));
    if (!cart.get("userID"))
        return response.errorResponse(res, 404, "Missing required field 'userID'", 40004);
    else if (!cart.get("productID"))
        return response.errorResponse(res, 404, "Missing required field 'productID'", 40004);
    else if (!cart.get("productName"))
        return response.errorResponse(res, 404, "Missing required field 'productName'", 40004);
    else if (!cart.get("currency"))
        return response.errorResponse(res, 404, "Missing required field 'currency'", 40004);
    else if (!cart.get("unitPrice"))
        return response.errorResponse(res, 404, "Missing required field 'unitPrice'", 40004);
    else if (!cart.get("quantity"))
        return response.errorResponse(res, 404, "Missing required field 'quantity'", 40004);

    try {
        cart.set({'totalCost': getTotalCost(cart.get("unitPrice"), cart.get("quantity"))});
        let savedItem = await cart.save();
        response.successResponse(res, 201, [{item: savedItem}]);
    } catch (error) {
        console.error("Error adding cart: ", error);
        if (error?.code === 11000)
            response.errorResponse(res, 500, "Item already exists", error.code);
        response.errorResponse(res, 500, error.message, error.code);
    }
};

// Retrieve and return all cart items from the database.
exports.findAll = async (req, res) => {
    // Get request query parameters.
    try {
        let items = await Cart.find();
        response.successResponse(res, 200, [
            {items, count: Object.keys(items).length},
        ]);
    } catch (error) {
        response.errorResponse(res, 500, error.message, error.code);
    }
};

// Get details of a cart item
exports.findOne = async (req, res) => {
    // Get user by ID
    const query = new Object(req.query);
    if (query.hasOwnProperty("id") && !core.isEmptyOrNull(query.id)) {
        try {
            const foundItem = await Cart.findById(query.id);
            if (core.isEmptyOrNull(foundItem))
                response.errorResponse(res, 404, "Cart item not found", 40004);
            else response.successResponse(res, 200, [{item: foundItem, query}]);
        } catch (error) {
            response.errorResponse(res, 500, error.message, error.code);
        }
    } else {
        response.errorResponse(res, 400, "Poorly formatted query", 40000, {
            query,
        });
    }

};

// Update a cart item identified by the itemId in the request
exports.update = async (req, res) => {
    // Validate Request
    if (core.isEmptyOrNull(req.body.id)
    ) {
        return response.errorResponse(res, 400, "Missing required field 'id'", 40000);
    }
    if (core.isEmptyOrNull(req.body.quantity)
    ) {
        return response.errorResponse(res, 400, "No record was modified", 40000);
    }

    // Get only entries which were modified
    let params = {};
    if (!core.isEmptyOrNull(req.body.id)) {
        params["id"] = req.body.id;
    }
    if (!core.isEmptyOrNull(req.body.quantity)) {
        params["quantity"] = req.body.quantity;
    }

    try {
        const foundItem = await Cart.findById(params["id"]);
        if (core.isEmptyOrNull(foundItem))
            response.errorResponse(res, 404, "Cart item not found", 40004);

        params["totalCost"] = getTotalCost(foundItem.unitPrice, params["quantity"]);

        // Find user and update it with the request body
        let updatedItem = await Cart.findOneAndUpdate({_id: params["id"]}, params, {
            new: true,
            useFindAndModify: false,
        })
        if (!updatedItem) {
            return response.errorResponse(
                res,
                404,
                `Cart not found with id: ${params["id"]}`,
                40004
            );
        }
        response.successResponse(res, 200, [{item: updatedItem}]);
    } catch (error) {
        if (error.kind === "ObjectId") {
            return response.errorResponse(
                res,
                404,
                `Cart not found with id: ${params["id"]}`,
                error.code,
                error.message
            );
        }
        response.errorResponse(res, 500, error.message, error.code);
    }

    // Cart.findOneAndUpdate({_id: params["id"]}, params, {
    //     new: true,
    //     useFindAndModify: false,
    // })
    //     .then((updatedItem) => {
    //         if (!updatedItem) {
    //             return response.errorResponse(
    //                 res,
    //                 404,
    //                 `Cart not found with id: ${params["id"]}`,
    //                 40004
    //             );
    //         }
    //         response.successResponse(res, 200, [{item: updatedItem}]);
    //     })
    //     .catch((error) => {
    //         if (error.kind === "ObjectId") {
    //             return response.errorResponse(
    //                 res,
    //                 404,
    //                 `Cart not found with id: ${params["id"]}`,
    //                 error.code,
    //                 error.message
    //             );
    //         }
    //         return response.errorResponse(res, 500, error.message, error.code);
    //     });
};

// Delete a cart item category with the specified item Id
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

    Cart.findOneAndDelete({_id: params["id"]})
        .then((item) => {
            if (!item) {
                return response.errorResponse(
                    res,
                    404,
                    `Cart item not found with id: ${params["id"]}`,
                    40004
                );
            }
            response.successResponse(res, 200, ["Item removed successfully!"]);
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

function getTotalCost(unitPrice, quantity) {
    return Number(unitPrice) * Number(quantity);
}
;
