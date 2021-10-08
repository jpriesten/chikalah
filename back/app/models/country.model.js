const mongoose = require("mongoose");

const CountrySchema = mongoose.Schema(
    {
        countryID: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
            default: "",
            trim: true,
        },
        iso3: {
            type: String,
            default: "",
            trim: true,
        },
        iso2: {
            type: String,
            required: true,
            trim: true,
        },
        numeric_code: {
            type: String,
            default: "",
            trim: true,
        },
        phone_code: {
            type: String,
            default: "",
            trim: true,
        },
        capital: {
            type: String,
            default: "",
            trim: true,
        },
        currency: {
            type: String,
            required: true,
            default: "",
            trim: true,
        },
        currency_symbol: {
            type: String,
            default: "",
            trim: true,
        },
        tld: {
            type: String,
            default: "",
            trim: true,
        },
        native: {
            type: String,
            default: "",
            trim: true,
        },
        region: {
            type: String,
            default: "",
            trim: true,
        },
        subregion: {
            type: String,
            default: "",
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
        emoji: {
            type: String,
            default: "",
            trim: true,
        },
        emojiU: {
            type: String,
            default: "",
            trim: true,
        },
        timezones: [
            {
                zoneName: String,
                gmtOffset: Number,
                gmtOffsetName: String,
                abbreviation: String,
                tzName: String
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Country = mongoose.model("Country", CountrySchema);
module.exports = Country;
