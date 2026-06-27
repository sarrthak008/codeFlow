import express from "express";
import {config} from "dotenv"
config()
const app = express();
const PORT = 3000 || process.env.PORT;
import cors from "cors"
// import "./config/job.js"

// db connetion 
 import connectdb from "./config/connectdb.js";

//middlewares
app.use(cors({
    origin: ["http://localhost:5173" , "https://codeefloww.vercel.app"],
    credentials: true,
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import _rateLimitor from "./middlewares/limitor.js";
import { protectRoute } from "./middlewares/protectRoute.js";

// controllers
import { executeJs } from "./controllers/js.controllers.js"
import {addManyUsers, login} from  "./controllers/auth/auth.controller.js"
import { genarateQuestions, submitAnswer ,getLeaderBoard } from "./controllers/code/code.js";
import verifyAdmin from "./middlewares/verifyadmins.js";

app.post("/code/run", _rateLimitor, executeJs);
app.post("/auth/login" ,login);
app.post("/auth/adduser" ,verifyAdmin, addManyUsers);
app.get("/codeflow/genarate",protectRoute,genarateQuestions);
app.post("/codeflow/submit",protectRoute,submitAnswer);
app.get("/code/rank",getLeaderBoard);


app.get("/health", (req, res) => {
    return res.json({ message: `server is running healthy...` })
})

app.listen(PORT, () => {
    console.log(`server listen on PORT ${PORT}`)
    connectdb()
})