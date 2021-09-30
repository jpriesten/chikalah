const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const core = require("../common/core.common");

const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

module.exports = {
    sendConfirmationEmail: async (user) => {
        try {
            // Encrypt user Id before creating a token out of the encrypted Identity
            // Todo: decrypt JWT token and decrypt cryptojs cypher
            const token = jwt.sign(
                {_id: core.encryptData(user.id.toString())},
                process.env.JWT_KEY,
                {
                    expiresIn: "10m",
                }
            );
            const url = `http://localhost:3000/api/v1/user/register/confirmEmail/?token=${token}`;
            const res = await transport.sendMail({
                from: "priestenjezeh@chikalah.com",
                to: `${user.email}`,
                subject: "Confirmation Email from Chikalah",
                html: `Hi ${user.firstname}, Confirmation Link: <a href=${url}> here</a>`,
            });
            return {error: false, response: res};
        } catch (error) {
            return {
                error: true,
                detail: {message: error.message, code: error.code},
            };
        }
    },
};
