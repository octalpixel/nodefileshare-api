// @ts-check
import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';


import { connect } from "./database";
import AppRouter from "./router";

const PORT = 3000;
const app = express();
app.server = http.createServer(app);


app.use(morgan('dev'));


app.use(cors({
    exposedHeaders: "*"
}));

app.use(bodyParser.json({
    limit: '50mb'
}));
app.set('root', __dirname);

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