const express = require('express')
const needle = require('needle')
const config = require('./configparser')


let app = express()

app.listen(8080, () => {
  console.log("Listening on port 8080")
})