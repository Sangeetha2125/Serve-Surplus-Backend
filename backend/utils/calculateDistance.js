const geo = require("node-geo-distance");

const getDistance = (donorLatitude, donorLongitude, receiverLatitude, receiverLongitude) => {
    var coord1 = {
      latitude: donorLatitude,
      longitude: donorLongitude
    };

    var coord2 = {
      latitude: receiverLatitude,
      longitude: receiverLongitude
    };

    var haversineDist = geo.haversineSync(coord1, coord2);
    return haversineDist;
};

module.exports = getDistance