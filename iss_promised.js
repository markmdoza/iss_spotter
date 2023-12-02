const request = require("request-promise-native");

const fetchMyIp = function () {
  return request("https://api.ipify.org?format=json");
};

const fetchCoordsByIP = function (body) {
  const ip = JSON.parse(body).ip;
  return request(`http://ipwho.is/${ip}`);
};

const fetchISSFlyOverTimes = function (body) {
  const { latitude, longitude } = JSON.parse(body);
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${latitude}$lon=${longitude}`;
  return request(url);
};

 const {
  fetchMyIp,
  fetchCoordsByIP,
  fetchISSFlyOverTimes,
} = require("./iss_promised");

const nextISSTimesForMyLocation = function() {
return fetchMyIp()
  .then(fetchCoordsByIP)
  .then(fetchISSFlyOverTimes)
  .then((data) => {
    const { response } = JSON.parse(data);
    return response
    });

};

module.exports = { nextISSTimesForMyLocation  };

