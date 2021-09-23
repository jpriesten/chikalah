const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const emailService = require("../services/email.service");

const salt = bcrypt.genSaltSync(10);

const UserType = Object.freeze({
    Admin: "admin",
    User: "user",
});

const GenderType = Object.freeze({
    Male: "m",
    Female: "f",
});

const UserSchema = mongoose.Schema(
    {
        firstname: {
            type: String,
            required: [true, "Please add a first name"],
            trim: true,
        },
        othernames: {
            type: String,
            // required: true,
            trim: true,
        },
        phone: {
            type: String,
            // required: [true, "Please add a phone number"],
            unique: true,
            match: [/^\+(?:[0-9] ?){6,14}[0-9]$/, "Please add a valid phone number"],
            trim: true,
        },
        userType: {
            type: UserType,
            // required: true,
            defaults: "user",
            trim: true,
        },
        sex: {
            type: GenderType,
            // required: true,
            trim: true,
            minlength: 1,
        },
        dob: {
            type: Date,
            // required: true,
            trim: true,
        },
        address: {
            type: String,
            trim: true,
            // required: true,
        },
        country: {
            type: String,
            // required: true,
            trim: true,
        },
        city: {
            type: String,
            // required: true,
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Please add an email address"],
            unique: true,
            trim: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("Email is invalid!");
                }
            },
        },
        password: {
            type: String,
            required: [true, "Please add a password"],
            trim: true,
            minlength: [8, "Password minimum allowed length (8)"],
            validate(value) {
                if (validator.isEmpty(value)) {
                    throw new Error("Please enter your password!");
                } else if (validator.equals(value.toLowerCase(), "password")) {
                    throw new Error('Password should not be "password"!');
                } else if (validator.contains(value.toLowerCase(), "password")) {
                    throw new Error('Password should not contain "password"!');
                }
            },
        },
        emailActive: {
            type: Boolean,
            defaults: false,
        },
        phoneActive: {
            type: Boolean,
            defaults: false,
        },
        tokens: [
            {
                token: {
                    type: String,
                    required: true,
                },
            },
        ],
        createdAt: {
            type: Date,
            defaults: new Date(Date.now() + 60 * 60 * 1000),
        },
    },
    {
        timestamps: true,
    }
);

// Salt and hash passwords before saving to db
UserSchema.pre("save", function (next) {
    let user = this;
    if (user.password !== undefined) {
        if (user.isModified("password") || user.isNew) {
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) {
                    next(err);
                }
                user.password = hash;
                next();
            });
        } else {
            return next();
        }
    } else {
        console.error(user.password + "" + UserSchema.password);
    }
});

UserSchema.pre("remove", async function (next) {
    const user = this;
    // await Post.deleteMany({author: user._id})
    next();
});

UserSchema.methods.checkValidCredentials = async (email, password) => {
    try {
        const user = await User.findOne({
            email,
        });
        if (!user) {
            throw new Error("User " + email + " not found");
        }

        let isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new Error("Wrong email or password");
        }
        return {error: false, user};
    } catch (error) {
        return {
            error: true,
            detail: {message: error.message, code: error.code},
        };
    }
};

// Create an authentication token for a user then saving the user
UserSchema.methods.newAuthToken = async function () {
    try {
        const user = this;
        let token = jwt.sign({_id: user.id.toString()}, process.env.JWT_KEY, {
            expiresIn: "24h",
        });
        user.tokens = user.tokens.concat({token});

        // Save user if email verification code sent
        await user.save();
        const emailSent = await emailService.sendConfirmationEmail(user);
        if (emailSent.error === true) {
            return {
                error: true,
                detail: {
                    message: emailSent.detail.message,
                    code: emailSent.detail.code,
                    extra: "Verification email not sent",
                },
            };
        } else {
            return {error: false, token, user};
        }
    } catch (error) {
        if (error.errors && Object.keys(error.errors).length !== 0) {
            const values = Object.values(error.errors)
            return {
                error: true,
                detail: {message: values[0].message, code: error.code},
            };

        } else return {
            error: true,
            detail: {message: error.message, code: error.code},
        };
    }
};

UserSchema.methods.toJSON = function () {
    const user = this;
    const userObj = user.toObject();

    delete userObj.password;
    delete userObj.tokens;

    return userObj;
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
