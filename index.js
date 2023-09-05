const { fetchCoordsByIP } = require('./iss')

fetchCoordsByIP('99.246.181.44', (error, coordinates) => {
  if (error) {
    console.log("It didn't work!", error)
    return
  }
  console.log('It worked! Returned coordinates:', coordinates)
})
