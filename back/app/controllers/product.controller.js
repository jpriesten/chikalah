const Product = require("../models/product.model");
const response = require("../common/response.common");
const core = require("../common/core.common");

// Add a new ProductCategory
exports.add = async (req, res) => {
    // Get user information from request
    if (Object.keys(req.body).length === 0) {
        return response.errorResponse(res, 400, "No data sent", 40000);
    }
    const product = new Product(core.objectValuesToLowerCase(req.body));
    if (!product.get("name"))
        return response.errorResponse(res, 404, "Missing required field 'name'", 40004);
    else if (!product.get("description"))
        return response.errorResponse(res, 404, "Missing required field 'description'", 40004);
    else if (!product.get("currency"))
        return response.errorResponse(res, 404, "Missing required field 'currency'", 40004);
    else if (!product.get("price"))
        return response.errorResponse(res, 404, "Missing required field 'price'", 40004);
    else if (!product.get("categoryID"))
        return response.errorResponse(res, 404, "Missing required field 'categoryID'", 40004);

    try {
        await product.save();
        response.successResponse(res, 201, [{'message': 'Okay'}]);
    } catch (error) {
        console.error("Error adding product: ", error);
        if (error?.code === 11000)
            response.errorResponse(res, 409, "Product already exists", error.code);
        response.errorResponse(res, 500, error.message, error.code);
    }
};

// Retrieve and return all products from the database.
exports.findAll = async (req, res) => {
    // Get request query parameters.
    try {
        let products = {};
        if (Object.keys(req.query).length === 0) products = await Product.find();
        else {
            let params = {};
            req.query = core.objectValuesToLowerCase(req.query);
            if (!core.isEmptyOrNull(core.getQueryParameter(req.query, "categoryID"))) {
                params["categoryID"] = core.getQueryParameter(req.query, "categoryID");
            }
            if (!core.isEmptyOrNull(core.getQueryParameter(req.query, "isActive"))) {
                params["isActive"] = core.getQueryParameter(req.query, "isActive");
            }
            if (!core.isEmptyOrNull(core.getQueryParameter(req.query, "price"))) {
                params["price"] = core.getQueryParameter(req.query, "price");
            }
            products = await Product.find(params);
        }
        response.successResponse(res, 200, [
            {products, count: Object.keys(products).length},
        ]);
    } catch (error) {
        response.errorResponse(res, 500, error.message, error.code);
    }
};

// Get details of a product
exports.findOne = async (req, res) => {
    // Get user by ID
    const query = new Object(req.query);
    if (query.hasOwnProperty("id") && !core.isEmptyOrNull(query.id)) {
        try {
            const foundProduct = await Product.findById(query.id);
            if (core.isEmptyOrNull(foundProduct))
                response.errorResponse(res, 404, "Product not found", 40004);
            else response.successResponse(res, 200, [{product: foundProduct}]);
        } catch (error) {
            response.errorResponse(res, 500, error.message, error.code);
        }
    } else {
        response.errorResponse(res, 400, "Poorly formatted query", 40000, {
            query,
        });
    }

};

// Update a product category identified by the userId in the request
exports.update = (req, res) => {
    // Validate Request
    if (core.isEmptyOrNull(req.body.id)
    ) {
        return response.errorResponse(res, 400, "Missing required field 'id'", 40000);
    }
    if (core.isEmptyOrNull(req.body.categoryID) &&
        core.isEmptyOrNull(req.body.description) &&
        core.isEmptyOrNull(req.body.status) &&
        core.isEmptyOrNull(req.body.currency) &&
        core.isEmptyOrNull(req.body.price)
    ) {
        return response.errorResponse(res, 400, "No record was modified", 40000);
    }

    // Get only entries which were modified
    let params = {};
    if (!core.isEmptyOrNull(req.body.id)) {
        params["id"] = req.body.id;
    }
    if (!core.isEmptyOrNull(req.body.categoryID)) {
        params["categoryID"] = req.body.categoryID;
    }
    if (!core.isEmptyOrNull(req.body.description)) {
        params["description"] = req.body.description;
    }
    if (!core.isEmptyOrNull(req.body.status)) {
        params["status"] = req.body.status;
    }
    if (!core.isEmptyOrNull(req.body.currency)) {
        params["currency"] = req.body.currency;
    }
    if (!core.isEmptyOrNull(req.body.price)) {
        params["price"] = req.body.price;
    }

    // Find user and update it with the request body
    Product.findOneAndUpdate({_id: params["id"]}, params, {
        new: true,
        useFindAndModify: false,
    })
        .then((updatedProduct) => {
            if (!updatedProduct) {
                return response.errorResponse(
                    res,
                    404,
                    `Product not found with id: ${params["id"]}`,
                    40004
                );
            }
            response.successResponse(res, 200, [{product: updatedProduct}]);
        })
        .catch((error) => {
            if (error.kind === "ObjectId") {
                return response.errorResponse(
                    res,
                    404,
                    `Product not found with id: ${params["id"]}`,
                    error.code,
                    error.message
                );
            }
            if (error?.code === 11000)
                response.errorResponse(res, 500, "Product already exists", error.code);
            return response.errorResponse(res, 500, error.message, error.code);
        });
};

// Delete a product category with the specified category Id
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

    Product.findOneAndDelete({_id: params["id"]})
        .then((user) => {
            if (!user) {
                return response.errorResponse(
                    res,
                    404,
                    `Product not found with id: ${params["id"]}`,
                    40004
                );
            }
            response.successResponse(res, 200, ["Product deleted successfully!"]);
        })
        .catch((error) => {
            if (error.kind === "ObjectId" || error.name === "NotFound") {
                return response.errorResponse(
                    res,
                    404,
                    `Product not found with id: ${params["id"]} ::: ${error.message}`,
                    error.code
                );
            }
            return response.errorResponse(res, 500, error.message, error.code);
        });
};
