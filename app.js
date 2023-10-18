const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")
require("dotenv").config()
require("./database/connect")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())

const EventRouter = require("./controllers/EventController")
app.use(EventRouter)

app.listen(8080, ()=>{
    console.log("Servidor rodando na porta 8080!")
})