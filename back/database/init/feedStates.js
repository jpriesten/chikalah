const express = require('express');
const app = express();
const database = require('../../app/services/database.service');
const stateModel = require("../../app/models/state.model");
const fs = require('fs');

database.openConnection().then(
    function () {
        insertStates(function () {
            database.closeConnection();
        });
    }
);

const insertStates = function (callback) {
    fs.readFile("./assets/js/countries+states+cities.json", (err, data) => {
        if (err) {
            console.error("Error reading file: ", err);
            return callback();
        }
        let dataJson = [...JSON.parse(data)];
        let stateDocument = [];
        dataJson.forEach(data => {
            if (data.states && data.states.length !== 0) {
                data.states.forEach(state => {
                    let entity = {};
                    entity.stateID = state.id;
                    entity.name = state.name;
                    entity.state_code = state.state_code;
                    entity.country_code = data.id;
                    entity.country_iso2 = data.iso2;
                    entity.latitude = state.latitude;
                    entity.longitude = state.longitude;
                    entity.type = state.type;
                    stateDocument.push(entity);
                });
            }
        })
        stateModel.insertMany(stateDocument).then(res => {
            console.info("Success loading state");
            callback();
        }).catch(error => {
            console.error("Error loading states: ", error.message);
            callback();
        });
    });
};

module.exports = app;
