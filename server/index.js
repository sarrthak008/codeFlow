import express from "express";
const app = express();
const PORT = 3000 || env.PORT;





app.get("/health",(req,res)=>{
    return `server is running healthy...`;
})

app.listen(PORT,()=>{
    console.log(`server listen on PORT ${PORT}`)
})