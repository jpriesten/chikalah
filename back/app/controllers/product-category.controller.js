const ProductCategory = require("../models/product-category.model");
const response = require("../common/response.common");
const core = require("../common/core.common");

// Add a new ProductCategory
exports.add = async (req, res) => {
    // Get user information from request
    if (Object.keys(req.body).length === 0) {
        return response.errorResponse(res, 404, "No data sent", 40004);
    }
    const productCategory = new ProductCategory(core.objectValuesToLowerCase(req.body));
    if (!productCategory.get("name"))
        return response.errorResponse(res, 404, "Missing required field 'name'", 40004);
    else if (!productCategory.get("description"))
        return response.errorResponse(res, 404, "Missing required field 'description'", 40004);

    try {
        await productCategory.save();
        response.successResponse(res, 201, [{'message': 'Okay'}]);
    } catch (error) {
        console.error("Error adding product category: ", error);
        if (error?.code === 11000)
            response.errorResponse(res, 500, "Product category already exists", error.code);
        response.errorResponse(res, 500, error.message, error.code);
    }
};

// Retrieve and return all users from the database.
exports.findAll = async (req, res) => {
    // Get request query parameters.
    try {
        let categories = await ProductCategory.find();

        response.successResponse(res, 200, [
            {categories, count: Object.keys(categories).length},
        ]);
    } catch (error) {
        response.errorResponse(res, 500, error.message, error.code);
    }
};

// Get details of a product category
exports.findOne = async (req, res) => {
    // Get user by ID
    const query = new Object(req.query);
    if (query.hasOwnProperty("id") && !core.isEmptyOrNull(query.id)) {
        try {
            const foundCategory = await ProductCategory.findById(query.id);
            if (core.isEmptyOrNull(foundCategory))
                response.errorResponse(res, 404, "Product category not found", 40004);
            else response.successResponse(res, 200, [{category: foundCategory, query}]);
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
    if (core.isEmptyOrNull(req.body.name) &&
        core.isEmptyOrNull(req.body.description)
    ) {
        return response.errorResponse(res, 400, "No record was modified", 40000);
    }

    // Get only entries which were modified
    let params = {};
    if (!core.isEmptyOrNull(req.body.id)) {
        params["id"] = req.body.id;
    }
    if (!core.isEmptyOrNull(req.body.name)) {
        params["name"] = req.body.name;
    }
    if (!core.isEmptyOrNull(req.body.description)) {
        params["description"] = req.body.description;
    }

    // Find user and update it with the request body
    ProductCategory.findOneAndUpdate({_id: params["id"]}, params, {
        new: true,
        useFindAndModify: false,
    })
        .then((updatedCategory) => {
            if (!updatedCategory) {
                return response.errorResponse(
                    res,
                    404,
                    `Product category not found with id: ${params["id"]}`,
                    40004
                );
            }
            response.successResponse(res, 200, [{category: updatedCategory}]);
        })
        .catch((error) => {
            if (error.kind === "ObjectId") {
                return response.errorResponse(
                    res,
                    404,
                    `Product category not found with id: ${params["id"]}`,
                    error.code,
                    error.message
                );
            }
            if (error?.code === 11000)
                response.errorResponse(res, 500, "Product category already exists", error.code);
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

    ProductCategory.findOneAndDelete({_id: params["id"]})
        .then((user) => {
            if (!user) {
                return response.errorResponse(
                    res,
                    404,
                    `Product category not found with id: ${params["id"]}`,
                    40004
                );
            }
            response.successResponse(res, 200, ["Product category deleted successfully!"]);
        })
        .catch((error) => {
            if (error.kind === "ObjectId" || error.name === "NotFound") {
                return response.errorResponse(
                    res,
                    404,
                    `Product category not found with id: ${params["id"]} ::: ${error.message}`,
                    error.code
                );
            }
            return response.errorResponse(res, 500, error.message, error.code);
        });
};
