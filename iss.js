const request = require('request')

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *  - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = function (callback) {
  // 1. Fetch user's IP
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null)
    }

    // 2. Fetch the coordinates based on the user IP
    fetchCoordsByIP(ip, (error, coordinates) => {
      if (error) {
        return callback(error, null)
      }

      // 3. Fetch the ISS pass times based on coordinates.
      fetchISSFlyOverTimes(coordinates, (error, passTimes) => {
        if (error) {
          return callback(error, null)
        }
        callback(null, passTimes)
      })
    })
  })
}

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */

const fetchISSFlyOverTimes = function (coords, callback) {
  const apiURL = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`

  request(apiURL, (error, response, body) => {
    if (error) {
      callback(error, null)
      return
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null)
      return
    }

    const passes = JSON.parse(body).response
    callback(null, passes)
  })
}

module.exports = { fetchISSFlyOverTimes }

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

const fetchCoordsByIP = function (ip, callback) {
  const apiURL = `https://ipwho.is/${ip}`

  request(apiURL, (error, response, body) => {
    if (error) {
      callback(error, null)
      return
    }

    const parseBody = JSON.parse(body)

    if (!parseBody.success) {
      const message = `Success status was ${parseBody.success}. Server message says: ${parseBody.message} when fetching for IP ${parseBody.ip}`
      callback(Error(message), null)
      return
    }
    const { latitude, longitude } = parseBody

    callback(null, { latitude, longitude })
  })
}

const fetchMyIP = function (callback) {
  // use request to fetch IP address from JSON API
  const apiURL = 'https://api.ipify.org?format=json'
  request(`${apiURL}`, (error, response, body) => {
    if (error) {
      callback(error, null)
      return
    }
    if (Response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`
      callback(Error(msg), null)
      return
    }
    const ip = JSON.parse(body).ip
    callback(null, ip)
  })
}

module.exports = { nextISSTimesForMyLocation }
