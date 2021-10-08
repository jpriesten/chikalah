const mongoose = require('mongoose');
const DB_CONNECT = "mongodb+srv://priesten:priesten0!@bholo-cluster.0wgwu.mongodb.net/bholo?retryWrites=true&w=majority";
// Configuring the database
mongoose.Promise = global.Promise;

module.exports = {
    openConnection: () => {
        return new Promise((resolve, reject) => {
            mongoose
                .connect(DB_CONNECT, {
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
