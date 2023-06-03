const express = require('express')
//const mongoose=require('mongoose')
const app = express()
const bodyParser = require("body-parser");
const port = 8080
const {refreshAll}=require('./createDatabase')
// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const { tallyModel } = require('./connector')
refreshAll()

app.use(require('./routes'))


app.listen(port, () => console.log(`App listening on port ${port}!`))

