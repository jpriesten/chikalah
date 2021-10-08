const demography = require("../controllers/demography.controller");
module.exports = (app) => {
    const demography = require("../controllers/demography.controller");

    /**
     * Retrieve all countries optionally by query param
     * @param region Continent name
     */
    app.get("/api/v1/countries", demography.findCountries);

    /**
     * Retrieve the details of a country by query params
     * @param id Country ID
     * @param alias Country iso2 code
     */
    app.get("/api/v1/country", demography.findCountry);

    /**
     * Retrieve all cities optionally by query params
     * @param country_code Country iso2 code
     * @param state_code State Id
     */
    app.get("/api/v1/cities", demography.findCities);

    /**
     * Retrieve the details of a city by query param
     * @param id City ID
     */
    app.get("/api/v1/city", demography.findCity);

    /**
     * Retrieve all states optionally by query param
     * @param country_code Country id
     * @param country_iso2 Country iso2 code
     */
    app.get("/api/v1/states", demography.findStates);

    /**
     * Retrieve the details of a country by query params
     * @param id State ID
     */
    app.get("/api/v1/state", demography.findState);
};
