import { MongoClient } from "mongodb"
import { Configs } from "./config"

const dbUrl = Configs.databaseURL

export const connect = (callback) => {

    MongoClient.connect(dbUrl, (err, db) => {

            return callback(err,db)

    })

} 