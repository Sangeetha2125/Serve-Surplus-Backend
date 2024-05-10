const geo = require("node-geo-distance");
const getDistance = (donorLatitude,donorLongitude,receiverLatitude,receiverLongitude)=>{
 
  const coord1 = {
    latitude: donorLatitude,
    longitude: donorLongitude
  }
   
  let coord2 = {
    latitude: receiverLatitude,
    longitude: receiverLongitude
  }
   
  geo.haversine(coord1, coord2, function(distance) {
    return distance;
  });
}

module.exports = getDistance