const mongoose = require("mongoose");

const AddressSchema = mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Missing required field 'userID'"],
            ref: "User",
        },
        country_code: {
            type: Number,
            required: [true, "Missing required field 'country_code'"]
        },
        state_code: {
            type: Number,
            required: [true, "Missing required field 'state_code'"],
        },
        city_code: {
            type: Number,
            required: [true, "Missing required field 'city_code'"],
        },
        addressLine_1: {
            type: String,
            required: [true, "Missing required field 'addressLine_1'"],
            trim: true,
        },
        addressLine_2: {
            type: String,
            default: "",
            trim: true,
        },
        isActive: {
            type: Boolean,
            required: true,
            default: true,
            trim: true,
        },
        isPreferred: {
            type: Boolean,
            required: true,
            default: false,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Address = mongoose.model("Address", AddressSchema);
module.exports = Address;
