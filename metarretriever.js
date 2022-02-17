const needle = require('needle')
const { DateTime } = require('luxon')

function retrieveMETARs(url, callback, refreshInterval) {
  needle.get(url, (err, resp, body) => {
    if(err) {
      console.error(err)
      setTimeout(() => {
        retrieveMETARs(url, callback, refreshInterval)
      }, refreshInterval)
    }
    else {
      let metarList = body.children.find(c => c.name === 'data')
      let processedMetars = {}
  
      for (let metarIdx = 0; metarIdx < metarList.children.length; metarIdx++) {
        let metar = metarList.children[metarIdx].children;
        let raw = metar.find(m => m.name === 'raw_text').value
        let icao = metar.find(m => m.name === 'station_id').value
        let observationTime = DateTime.fromISO(metar.find(m => m.name === 'observation_time').value)
        let flightCategory = metar.find(m => m.name === 'flight_category').value
  
        processedMetars[icao] = {
          raw : raw,
          icao : icao,
          observationTime : observationTime,
          flightCategory : flightCategory
        }
      }
  
      callback(processedMetars)
  
      setTimeout(() => {
        retrieveMETARs(url, callback, refreshInterval)
      }, refreshInterval)
    }
  })
}

module.exports = (icaolist, datasourceURL, refreshInterval, updateCallback) => {
  icaolist = icaolist.join(",")
  let queryString = datasourceURL.replace('{ICAOLIST}',icaolist)
  console.debug(`Modified Datasource URL: ${queryString}`)
  retrieveMETARs(queryString, updateCallback, refreshInterval)
}