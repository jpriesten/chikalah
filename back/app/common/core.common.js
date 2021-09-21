const crypto = require("crypto-js");
const jwt = require("jsonwebtoken");

const salt = () => {
  return crypto.enc.Hex.parse(process.env.ENCRYPTION_SALT);
};
const iv = () => {
  return crypto.enc.Hex.parse(process.env.ENCRYPTION_IV);
};

module.exports = {
  /**
   * Test if a string value is null, undefined or empty
   * @param value Input to test for availability,
   */
  isEmptyOrNull: function (value) {
    if (
      value == "" ||
      value == null ||
      value == undefined ||
      value == "undefined"
    ) {
      return true;
    }
    return false;
  },

  /**
   * Validates a query string and returns the value if found and null otherwise
   * @param query Query object from the request,
   * @param id Key of the query to validate,
   */
  getQueryParameter: function (query, key) {
    const queryObject = new Object(query);
    if (
      queryObject.hasOwnProperty(key) &&
      !this.isEmptyOrNull(queryObject[key])
    )
      return queryObject[key];
    else return null;
  },

  /**
   * Convert values in an object to lowercase
   * @param input Object to convert,
   */
  objectValuesToLowerCase: function (input) {
    if (input && typeof input == "object") {
      let inputObject = Object.keys(input);
      inputObject.map((key) => {
        if (typeof input[key] == "string") {
          input[key] = input[key].toLowerCase();
        }
      });
    }
    return input;
  },

  /**
   * Encrypt data
   * @param data Value to be encrypted,
   */
  encryptData: (data) => {
    try {
      let key128Bits100Iterations = crypto.PBKDF2(
        process.env.ENCRYPTION_SECRET,
        salt(),
        {
          keySize: 128 / 32,
          iterations: 100,
        }
      );

      let encryptOutput = crypto.AES.encrypt(data, key128Bits100Iterations, {
        iv: iv(),
        mode: crypto.mode.CBC,
        padding: crypto.pad.Pkcs7,
      }).toString();

      return encryptOutput;
    } catch (error) {
      throw new Error(error);
    }
  },

  /**
   * Decrypt data
   * @param data Value to be decrypted,
   */
  decryptData: (data) => {
    try {
      let key128Bits100Iterations = crypto.PBKDF2(
        process.env.ENCRYPTION_SECRET,
        salt(),
        {
          keySize: 128 / 32,
          iterations: 100,
        }
      );
      let decryptOutput = crypto.AES.decrypt(data, key128Bits100Iterations, {
        iv: iv(),
        mode: crypto.mode.CBC,
        padding: crypto.pad.Pkcs7,
      }).toString(crypto.enc.Utf8);

      return decryptOutput;
    } catch (error) {
      throw new Error(error);
    }
  },

  /**
   * Verify email verification token
   * @param data Value to be verified,
   */
  verifyEmailVerificationToken: (data) => {
    try {
      const encryptionCypher = jwt.verify(data, process.env.JWT_KEY);
      return encryptionCypher;
    } catch (error) {
      throw new Error(error);
    }
  },
};
