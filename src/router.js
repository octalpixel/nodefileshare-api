import {version} from "../package.json" 
class AppRouter {

    constructor(app) {
        this.app = app
        this.setupRouter()
    }

    setupRouter() {
        console.log("Router Init")
        this.app.get("/", (req, res, next) => {

            return res.status(200).json({
                version: version
            })

        })


        this.app.post('/api/upload',(req,res,next)=>{
            return res.json({
                upload:"works"
            })
        })

    }

}
export default AppRouter