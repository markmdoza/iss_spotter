const request = require('request')

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

// const fetchMyIP = function (callback) {
//   // use request to fetch IP address from JSON API
//   const apiURL = 'https://api.ipify.org?format=json'
//   request(`${apiURL}`, (error, response, body) => {
//     if (error) {
//       callback(error, null)
//       return
//     }
//     if (Response.statusCode !== 200) {
//       const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`
//       callback(Error(msg), null)
//       return
//     }
//     const ip = JSON.parse(body).ip
//     callback(null, ip)
//   })
// }

module.exports = { fetchCoordsByIP }
