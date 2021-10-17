const mongoose = require('mongoose');

// Configuring the database
mongoose.Promise = global.Promise;

module.exports = {
    openConnection: () => {
        return new Promise((resolve, reject) => {
            mongoose
                .connect(process.env.DB_CONNECT, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true, useCreateIndex: true
                })
                .then((db) => {
                    resolve(db);
                })
                .catch((error) => {
                    reject(error);
                });
        });

    },

    closeConnection: () => {
        return new Promise((resolve, reject) => {
            mongoose.connection.close().then(closed => resolve(closed)
            ).catch(error => reject(error));
        });
    },
}
