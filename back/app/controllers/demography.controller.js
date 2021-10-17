const Country = require("../models/country.model");
const City = require("../models/city.model");
const State = require("../models/state.model");
const response = require("../common/response.common");
const core = require("../common/core.common");

// Retrieve and return all countries from the database.
exports.findCountries = async (req, res) => {
    // Get request query parameters.
    try {
        let countries;
        if (Object.keys(req.query).length === 0) countries = await Country.find();
        else {
            let params = {};
            req.query = core.objectValuesToLowerCase(req.query);
            if (!core.isEmptyOrNull(core.getQueryParameter(req.query, "region"))) {
                params["region"] = {$regex: core.getQueryParameter(req.query, "region"), $options: 'i'};
            }
            countries = await Country.find(params);
        }
        response.successResponse(res, 200, [
            {count: Object.keys(countries).length, countries},
        ]);
    } catch (error) {
        response.errorResponse(res, 500, error.message, error.code);
    }
};

// Get details of a country
exports.findCountry = async (req, res) => {
    // Get user by ID
    const query = new Object(req.query);
    if (query.hasOwnProperty("id") && !core.isEmptyOrNull(query.id)) {
        try {
            const found = await Country.findById(query.id);
            if (core.isEmptyOrNull(found))
                response.errorResponse(res, 404, "Country not found", 40004);
            else response.successResponse(res, 200, [{country: found}]);
        } catch (error) {
            response.errorResponse(res, 500, error.message, error.code);
        }
        //    Find country by iso2 = alias
    } else if (query.hasOwnProperty("alias") && !core.isEmptyOrNull(query.alias)) {
        try {
            const found = await Country.findOne({iso2: {$regex: query.alias, $options: 'i'}});
            if (core.isEmptyOrNull(found))
                response.errorResponse(res, 404, "Country not found", 40004);
            else response.successResponse(res, 200, [{country: found}]);
        } catch (error) {
            response.errorResponse(res, 500, error.message, error.code);
        }
    } else {
        response.errorResponse(res, 400, "Poorly formatted query", 40000, {
            query,
        });
    }

};

// Retrieve and return all cities in a country.
exports.findCities = async (req, res) => {
    // Validate Request
    if (core.isEmptyOrNull(core.getQueryParameter(req.query, "state_alias")) &&
        core.isEmptyOrNull(core.getQueryParameter(req.query, "country_iso2")) &&
        core.isEmptyOrNull(core.getQueryParameter(req.query, "name"))
    ) {
        return response.errorResponse(res, 400,
            "Missing required field 'state_alias' or 'country_iso2' or 'name'", 40000);
    }
    // Get request query parameters.
    try {
        let cities;
        if (Object.keys(req.query).length === 0) cities = await City.find();
        else {
            let params = {};
            req.query = core.objectValuesToLowerCase(req.query);
            if (!core.isEmptyOrNull(core.getQueryParameter(req.query, "state_alias"))) {
                params["state_alias"] = {$regex: core.getQueryParameter(req.query, "state_alias"), $options: 'i'};
            }
            if (!core.isEmptyOrNull(core.getQueryParameter(req.query, "country_iso2"))) {
                params["country_iso2"] = {$regex: core.getQueryParameter(req.query, "country_iso2"), $options: 'i'};
            }
            if (!core.isEmptyOrNull(core.getQueryParameter(req.query, "name"))) {
                params["name"] = {$regex: core.getQueryParameter(req.query, "name"), $options: 'i'};
            }
            cities = await City.find(params);
        }
        response.successResponse(res, 200, [
            {count: Object.keys(cities).length, cities},
        ]);
    } catch (error) {
        response.errorResponse(res, 500, error.message, error.code);
    }
};

// Get details of a city
exports.findCity = async (req, res) => {
    // Get user by ID
    const query = new Object(req.query);
    if (query.hasOwnProperty("id") && !core.isEmptyOrNull(query.id)) {
        try {
            const found = await City.findById(query.id);
            if (core.isEmptyOrNull(found))
                response.errorResponse(res, 404, "City not found", 40004);
            else response.successResponse(res, 200, [{city: found}]);
        } catch (error) {
            response.errorResponse(res, 500, error.message, error.code);
        }
    } else {
        response.errorResponse(res, 400, "Poorly formatted query", 40000, {
            query,
        });
    }

};

// Retrieve and return all states in country.
exports.findStates = async (req, res) => {
    // Validate Request
    if (core.isEmptyOrNull(core.getQueryParameter(req.query, "country_code")) &&
        core.isEmptyOrNull(core.getQueryParameter(req.query, "country_iso2"))
    ) {
        return response.errorResponse(res, 400,
            "Missing required field 'country_code' or 'country_iso2'", 40000);
    }
    // Get request query parameters.
    try {
        let params = {};
        req.query = core.objectValuesToLowerCase(req.query);
        if (!core.isEmptyOrNull(core.getQueryParameter(req.query, "country_code"))) {
            params["country_code"] = core.getQueryParameter(req.query, "country_code");
        } else if (!core.isEmptyOrNull(core.getQueryParameter(req.query, "country_iso2"))) {
            params["country_iso2"] = {$regex: core.getQueryParameter(req.query, "country_iso2"), $options: 'i'};
        }
        let states = await State.find(params);

        response.successResponse(res, 200, [
            {count: Object.keys(states).length, states},
        ]);
    } catch (error) {
        response.errorResponse(res, 500, error.message, error.code);
    }
};

// Get details of a state
exports.findState = async (req, res) => {
    // Get user by ID
    const query = new Object(req.query);
    if (query.hasOwnProperty("id") && !core.isEmptyOrNull(query.id)) {
        try {
            const found = await State.findById(query.id);
            if (core.isEmptyOrNull(found))
                response.errorResponse(res, 404, "state not found", 40004);
            else response.successResponse(res, 200, [{state: found}]);
        } catch (error) {
            response.errorResponse(res, 500, error.message, error.code);
        }
    } else {
        response.errorResponse(res, 400, "Poorly formatted query", 40000, {
            query,
        });
    }

};
