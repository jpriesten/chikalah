const mongoose = require("mongoose");

const StateSchema = mongoose.Schema(
    {
        stateID: {
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
        type: {
            type: String,
            default: "",
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const State = mongoose.model("State", StateSchema);
module.exports = State;
