import { version } from "../package.json"
import * as path from "path"
import * as fs from "fs"
import { Request, Response, NextFunction } from "express";
import FileModel from "./models/file"
import * as _ from "lodash"
import * as mongoDB from "mongodb"
class AppRouter {

    constructor(app) {
        this.app = app
        this.setupRouter()
    }

    setupRouter() {
        let app = this.app

        const uploadDir = app.get("uploadDir")
        const upload = app.get("upload")
        const fileModel = new FileModel(app)

        console.log("Router Init")
        app.get("/", (req: Request, res: Response, next: NextFunction) => {

            return res.status(200).json({
                version: version
            })

        })


        app.post('/api/upload', upload.array("files"), (req: Request, res: Response, next: NextFunction) => {


            let uploadFiles = _.get(req, "files", [])

            let filesToUpload = []

            _.each(uploadFiles, uploadFile => {
                // console.log(uploadFile)
                let item = fileModel.getFileData(uploadFile)
                // console.log("++++++++++++++++++++++++++++++++++++++++++++++")
                // console.log("returning stuff" ,  item)
                // console.log("++++++++++++++++++++++++++++++++++++++++++++++")
                filesToUpload.push(item)
                console.log(filesToUpload)

            })

            //    / console.log("Thiss a res stuff ti upload " , filesToUpload)
            if (filesToUpload.length) {
                fileModel.save(filesToUpload, (err: NodeJS.ErrnoException, results, mongoResults) => {
                    // throw err
                    if (err) {
                        // throw err
                        return res.status(503).json({
                            status: false,
                            fileModel: filesToUpload,
                            error: {
                                message: "File not uploaded",
                                realError: err.message
                            }
                        })
                    } else {
                        return res.json({
                            status: true,
                            message: "Upload successful",
                            data: {
                                returnResults: results
                            }
                        })
                    }
                })
            } else {
                return res.json({
                    status: false,
                    message: "Select files"
                })
            }

        })

        app.get("/api/download/:id", (req: Request, res: Response, next: NextFunction) => {

            let fileId = req.params.id;
            console.log(fileId.length)
            if (fileId.length != 24) {
                return res.status(503).json({
                    status: false,
                    message: "Invalid ID"
                })
            }



            fileModel.getFile(fileId, (err, result) => {
                // console.log((_.get(result, "name")))
                console.log(err)
                console.log(result)
                if (err || !(_.get(result, "name"))) {
                    return res.status(404).json({
                        status: false,
                        error: {
                            message: "File Not Found"
                        }
                    })
                } else {

                    let file = path.join(uploadDir, result.name)
                    let filename = result.originalName
                    res.download(file, filename, (err) => {

                        if (err) {
                            return res.status(404).json({
                                status: false,
                                error: {
                                    message: "File not found!!",
                                    real:err.message
                                }
                            })
                        } else {
                            console.log("File has been downloaded")
                            // res.status(200).json({
                            //     status: true,
                            //     message: "File has be downloaded"
                            // })
                        }

                    })
                }
            })




        })

    }

}
export default AppRouter