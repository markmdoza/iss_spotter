const request = require('request')

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
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

module.exports = { fetchMyIP }
