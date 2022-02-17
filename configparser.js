const yaml = require('yaml')
const timespan = require('timespan-parser')
const path = require('path')
const fs = require('fs')

const configLocation = path.join(__dirname, 'config.yaml')
console.log(`Attempting to load configuration file from ${configLocation}`)
if(!fs.existsSync(configLocation)) {
  throw `${configLocation} does not exist!`
}

let configFileContents = yaml.parse(fs.readFileSync(configLocation, 'ascii'))

let airports = []
for (let airportIdx = 0; airportIdx < configFileContents.airports.length; airportIdx++) {
  const airport = configFileContents.airports[airportIdx];
  airports.push(airport.icao)
}

let refreshInterval = timespan.parse(configFileContents.refreshinterval, 'ms')

console.log('Config file successfully loaded and parsed!')
console.log(`The following airports will be scraped: ${airports}`)
console.log(`METARs will be refreshed every ${refreshInterval} milliseconds`)

module.exports.airports = airports
module.exports.refreshInterval = refreshInterval
module.exports.metarsource = configFileContents.metarsource
