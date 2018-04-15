import * as  express from "express"
import fileModel from "./schemas/fileSchema"
import * as _ from "lodash"
import * as mongoDB from "mongodb"
class FileModel {

    app: express.Application
    // modelObject: Object = {}
    db: mongoDB.Db
    collection: string

    constructor(app: express.Application) {
        this.app = app
        // this.modelObject = {
        //     name: null,
        //     originalName: null,
        //     size: null,
        //     createdAt: null,
        //     mimeType: null
        // }
        this.db = this.app.get("db").db()
        this.collection = "files"
    }

    getFileData(object: Object) {
        // console.log("---------------------------------------------------")
        // console.log("Object passed", object)
        // console.log("---------------------------------------------------")

        // this.modelObject.name = _.get(object, "filename")
        // this.modelObject.originalName = _.get(object, "originalname")
        // this.modelObject.size = _.get(object, "size")
        // this.modelObject.mimeType = _.get(object, "mimetype")
        // this.modelObject.createdAt = Date.now()

        let modelObject = {
            name: _.get(object, "filename"),
            originalName: _.get(object, "originalname"),
            size: _.get(object, "size"),
            createdAt: _.get(object, "mimetype"),
            mimeType: Date.now()
        }

        return modelObject
    }
    // toJSON() {

    //     return this.modelObject
    // }

    save(arrayItems: Array<any>, callback: any) {
        // console.log("this is the stuff", this.modelObject)
        this.db.collection(this.collection).insertMany(arrayItems, (err: any, mongoResults) => {
            callback(err, arrayItems, mongoResults)
        })
    }

    getFile(id, callback) {
        // console.log(id)
        this.db.collection(this.collection).findOne({ _id: new mongoDB.ObjectId(id) }, (err, result) => {
            callback(err, result)
        })

    }



}

export default FileModel