const mongoose = require("mongoose");

const PhoneSchema = mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        phone: {
            type: String,
            required: [true, "Please add a phone number"],
            unique: true,
            match: [/^\+(?:[0-9] ?){6,14}[0-9]$/, "Please add a valid phone number"],
            trim: true,
        },
        description: {
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

const Phone = mongoose.model("Phone", PhoneSchema);
module.exports = Phone;
