const geo = require("node-geo-distance");

const getDistance = (donorLatitude, donorLongitude, receiverLatitude, receiverLongitude) => {
  return new Promise((resolve, reject) => {
    const coord1 = {
      latitude: donorLatitude,
      longitude: donorLongitude
    };

    const coord2 = {
      latitude: receiverLatitude,
      longitude: receiverLongitude
    };

    geo.haversine(coord1, coord2, function(distance) {
      resolve(distance);
    });
  });
};

module.exports = getDistance