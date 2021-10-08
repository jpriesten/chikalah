const express = require('express');
const app = express();
const database = require('../../app/services/database.service');
const countryModel = require("../../app/models/country.model");
const fs = require('fs');

database.openConnection().then(
    function () {
        insertCountries(function () {
            database.closeConnection();
        });
    }
);

const insertCountries = function (callback) {
    fs.readFile("./assets/js/countries+states+cities.json", (err, data) => {
        if (err) {
            console.error("Error reading file: ", err);
            return callback();
        }
        let dataJson = [...JSON.parse(data)];
        let countryDocument = [];
        dataJson.forEach(data => {
            let entity = {};
            entity.countryID = data.id;
            entity.name = data.name;
            entity.iso3 = data.iso3;
            entity.iso2 = data.iso2;
            entity.numeric_code = data.numeric_code;
            entity.phone_code = data.phone_code;
            entity.capital = data.capital;
            entity.currency = data.currency;
            entity.currency_symbol = data.currency_symbol;
            entity.tld = data.tld;
            entity.native = data.native;
            entity.region = data.region;
            entity.subregion = data.subregion;
            entity.latitude = data.latitude;
            entity.longitude = data.longitude;
            entity.emoji = data.emoji;
            entity.emojiU = data.emojiU;
            entity.timezones = data.timezones;
            countryDocument.push(entity);
        })
        countryModel.insertMany(countryDocument).then(res => {
            console.info("Success loading countries: ", res);
            callback();
        }).catch(error => {
            console.error("Error loading countries: ", error.message);
            callback();
        });
    });
};

module.exports = app;
