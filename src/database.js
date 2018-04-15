"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const config_1 = require("./config");
const dbUrl = config_1.Configs.databaseURL;
exports.connect = (callback) => {
    mongodb_1.MongoClient.connect(dbUrl, (err, db) => {
        return callback(err, db);
    });
};
