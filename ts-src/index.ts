// @ts-check
import * as http from 'http';
import * as express from 'express';
import * as cors from 'cors';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as multer from "multer";
import * as path from "path"



import { connect } from "./database";
import AppRouter from "./router";

import { Request } from "express"
const PORT = 3000;
const app = express();
app.server = http.createServer(app);


// Setting up for multer
const uploadDir = path.join(__dirname, "..", "uploads")
const storageConfigs = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        let filename = Date.now() + "_" + file.originalname
        cb(null, filename)
    }
})
const upload = multer({ storage: storageConfigs })

app.use(morgan('dev'));


app.use(cors({
    exposedHeaders: "*"
}));

app.use(bodyParser.json({
    limit: '50mb'
}));
app.set('root', __dirname);
app.set("uploadDir", uploadDir)
app.set("upload", upload)

// Connect to the Database
connect((err, db) => {

    if (err) {
        console.log("There is an mongodb error")
        throw err
    }

    app.set('db', db)

    // Init router
    new AppRouter(app)



    app.server.listen(process.env.PORT || PORT, () => {
        console.log(`App is running on port ${app.server.address().port}`);
    });


})


export default app;