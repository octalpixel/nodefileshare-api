"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const package_json_1 = require("../package.json");
const path = require("path");
const file_1 = require("./models/file");
const _ = require("lodash");
class AppRouter {
    constructor(app) {
        this.app = app;
        this.setupRouter();
    }
    setupRouter() {
        let app = this.app;
        const uploadDir = app.get("uploadDir");
        const upload = app.get("upload");
        const fileModel = new file_1.default(app);
        console.log("Router Init");
        app.get("/", (req, res, next) => {
            return res.status(200).json({
                version: package_json_1.version
            });
        });
        app.post('/api/upload', upload.array("files"), (req, res, next) => {
            let uploadFiles = _.get(req, "files", []);
            let filesToUpload = [];
            _.each(uploadFiles, uploadFile => {
                // console.log(uploadFile)
                let item = fileModel.getFileData(uploadFile);
                // console.log("++++++++++++++++++++++++++++++++++++++++++++++")
                // console.log("returning stuff" ,  item)
                // console.log("++++++++++++++++++++++++++++++++++++++++++++++")
                filesToUpload.push(item);
                console.log(filesToUpload);
            });
            //    / console.log("Thiss a res stuff ti upload " , filesToUpload)
            if (filesToUpload.length) {
                fileModel.save(filesToUpload, (err, results, mongoResults) => {
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
                        });
                    }
                    else {
                        return res.json({
                            status: true,
                            message: "Upload successful",
                            data: {
                                returnResults: results
                            }
                        });
                    }
                });
            }
            else {
                return res.json({
                    status: false,
                    message: "Select files"
                });
            }
        });
        app.get("/api/download/:id", (req, res, next) => {
            let fileId = req.params.id;
            console.log(fileId.length);
            if (fileId.length != 24) {
                return res.status(503).json({
                    status: false,
                    message: "Invalid ID"
                });
            }
            fileModel.getFile(fileId, (err, result) => {
                // console.log((_.get(result, "name")))
                console.log(err);
                console.log(result);
                if (err || !(_.get(result, "name"))) {
                    return res.status(404).json({
                        status: false,
                        error: {
                            message: "File Not Found"
                        }
                    });
                }
                else {
                    let file = path.join(uploadDir, result.name);
                    let filename = result.originalName;
                    res.download(file, filename, (err) => {
                        if (err) {
                            return res.status(404).json({
                                status: false,
                                error: {
                                    message: "File not found!!",
                                    real: err.message
                                }
                            });
                        }
                        else {
                            console.log("File has been downloaded");
                            // res.status(200).json({
                            //     status: true,
                            //     message: "File has be downloaded"
                            // })
                        }
                    });
                }
            });
        });
    }
}
exports.default = AppRouter;
