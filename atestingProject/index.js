const express = require("express");
const app = express();


app.get("/new",(req,res)=>{
    res.send("new route");
})

app.get("/owner",(req,res)=>{
    res.send("owner route");
})

app.listen(3000,()=>{
    console.log("listing on 3000");
})
