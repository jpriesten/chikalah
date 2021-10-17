const axios = require('axios');
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// Set config defaults when creating the instance
const instance = axios.create({
    baseURL: 'https://api.monetbil.com/payment/v1/'
});

module.exports = {
    makePayment: function (payload) {
        return new Promise(async (resolve, reject) => {
            try {
                let found = await instance.get('/');
                console.log("Response: ", found);
                resolve(found);
            } catch (error) {
                console.error("Error from monetbil: ", error);
                reject(error);
            }
        });
    },
}
