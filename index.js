const express = require('express')
const config = require('./configparser')
const metarretriever = require('./metarretriever')

let retrievedData = {}

metarretriever(config.airports, config.metarsource, config.refreshInterval, (update) => {
  for (const [key, val] of Object.entries(update)) {
    retrievedData[key] = val
  }
})

function processRetrievedData() {
  let modifiedRetrievedData = {}
  for (let airportIdx = 0; airportIdx < config.airports.length; airportIdx++) {
    const airportICAO = config.airports[airportIdx];
    modifiedRetrievedData[airportICAO] = {}
  }
  for(const [key, val] of Object.entries(retrievedData)) {
    modifiedRetrievedData[key] = {
      raw : val.raw,
      observationTime : val.observationTime,
      age : Math.round(val.observationTime.diffNow('minutes').values.minutes * -1),
      flightCategory : val.flightCategory
    }
  }
  return modifiedRetrievedData
}

let app = express()
app.set('view engine', 'pug')
app.get('/', (req, res) => {
  
  res.render('index', {
    retrievedData: processRetrievedData()
  })
})

app.get('/json', (req, res) => {
  res.json(processRetrievedData())
})

app.listen(8080, () => {
  console.log("Listening on port 8080")
})