const mongoose = require("mongoose");

const CitySchema = mongoose.Schema(
    {
        cityID: {
            type: Number,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        state_code: {
            type: Number,
            required: true,
            ref: "State",
            trim: true,
        },
        state_alias: {
            type: String,
            required: true,
            trim: true,
        },
        country_code: {
            type: Number,
            ref: "Country",
            required: true,
            trim: true,
        },
        country_iso2: {
            type: String,
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
