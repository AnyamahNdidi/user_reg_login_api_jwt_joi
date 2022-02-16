require("./config/db.js")
const express = require("express")
const app = express()
const cors = require("cors")
const myRouter = require("./Router/router")
const port = process.env.PORT || 2022

app.get("/", (req, res)=>{
   res.send("port is running well")
})

app.use(express.json())
app.use(cors())
app.use("/api", myRouter)
app.listen(port, ()=>{
  console.log( `port is running on ${port}`);
})