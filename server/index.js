import express from "express";
const app = express();
const PORT = 3000 || env.PORT;




//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
import  _rateLimitor  from "./middlewares/limitor.js";

// controllers
import {executeJs} from "./controllers/js.controllers.js"

app.post("/code/run",_rateLimitor,executeJs);

app.get("/health",(req,res)=>{
    return  res.json({message: `server is running healthy...`})
})

app.listen(PORT,()=>{
    console.log(`server listen on PORT ${PORT}`)
})