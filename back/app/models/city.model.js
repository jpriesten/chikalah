const mongoose = require("mongoose");

const CitySchema = mongoose.Schema(
    {
        cityID: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        state_code: {
            type: String,
            required: true,
            ref: "State",
            trim: true,
        },
        country_code: {
            type: String,
            ref: "Country",
            required: true,
            trim: true,
        },
        country_iso2: {
            type: String,
            ref: "Country",
            required: true,
            trim: true,
        },
        latitude: {
            type: String,
            default: "",
            trim: true,
        },
        longitude: {
            type: String,
            default: "",
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const City = mongoose.model("City", CitySchema);
module.exports = City;
