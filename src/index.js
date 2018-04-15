"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-check
const http = require("http");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const database_1 = require("./database");
const router_1 = require("./router");
const PORT = 3000;
const app = express();
app.server = http.createServer(app);
// Setting up for multer
const uploadDir = path.join(__dirname, "..", "uploads");
const storageConfigs = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        let filename = Date.now() + "_" + file.originalname;
        cb(null, filename);
    }
});
const upload = multer({ storage: storageConfigs });
app.use(morgan('dev'));
app.use(cors({
    exposedHeaders: "*"
}));
app.use(bodyParser.json({
    limit: '50mb'
}));
app.set('root', __dirname);
app.set("uploadDir", uploadDir);
app.set("upload", upload);
// Connect to the Database
database_1.connect((err, db) => {
    if (err) {
        console.log("There is an mongodb error");
        throw err;
    }
    app.set('db', db);
    // Init router
    new router_1.default(app);
    app.server.listen(process.env.PORT || PORT, () => {
        console.log(`App is running on port ${app.server.address().port}`);
    });
});
exports.default = app;
