const express = require('express')
const config = require('./configparser')
const metarretriever = require('./metarretriever')

let retrievedData = {}

metarretriever(config.airports, config.metarsource, config.refreshInterval, (update) => {
  for (const [key, val] of Object.entries(update)) {
    retrievedData[key] = val
  }
})

let app = express()
app.set('view engine', 'pug')
app.get('/', (req, res) => {
  let modifiedRetrievedData = {}
  for(const [key, val] of Object.entries(retrievedData)) {
    modifiedRetrievedData[key] = {
      raw : val.raw,
      observationTime : val.observationTime,
      age : Math.round(val.observationTime.diffNow('minutes').values.minutes * -1),
      flightCategory : val.flightCategory
    }
  }
  res.render('index', {
    retrievedData: modifiedRetrievedData,
    airportList : config.airports
  })
})

app.listen(8080, () => {
  console.log("Listening on port 8080")
})