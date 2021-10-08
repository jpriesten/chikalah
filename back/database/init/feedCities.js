const express = require('express');
const app = express();
const database = require('../../app/services/database.service');
const cityModel = require("../../app/models/city.model");
const fs = require('fs');

database.openConnection().then(
    function () {
        insertCities(function () {
            database.closeConnection();
        });
    }
);

const insertCities = function (callback) {
    fs.readFile("./assets/js/countries+states+cities.json", (err, data) => {
        if (err) {
            console.error("Error reading file: ", err);
            return callback();
        }
        let dataJson = [...JSON.parse(data)];
        let cityDocument = [];
        dataJson.forEach(data => {
            if (data.states && data.states.length !== 0) {
                data.states.forEach(state => {
                    if (state.cities && state.cities.length !== 0) {
                        state.cities.forEach(city => {
                            let entity = {};
                            entity.cityID = city.id;
                            entity.name = city.name;
                            entity.state_code = state.state_code;
                            entity.country_code = data.id;
                            entity.country_iso2 = data.iso2;
                            entity.latitude = city.latitude;
                            entity.longitude = city.longitude;
                            cityDocument.push(entity);
                        });
                    }
                });
            }
        })
        // console.info("cities data: ", cityDocument);
        cityModel.insertMany(cityDocument).then(res => {
            console.info("Success loading cities: ", res);
            callback();
        }).catch(error => {
            console.error("Error loading cities: ", error.message);
            callback();
        });
    });
};

module.exports = app;
