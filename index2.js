const {
  nextISSTimesForMyLocation
} = require("./iss_promised");

nextISSTimesForMyLocation()
  .then()(passTimes) => {
    printPassTimes(passTimes);
    })
    .catch((error) => {
    console.log('It didn't work:', error.message);
    });

module.exports = { nextISSTimesForMyLocation  };
