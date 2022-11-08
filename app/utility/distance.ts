export default function getDistanceFromLatLonInKm(
  currLat: number,
  currLong: number,
  goalLat: number,
  goalLong: number
) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(goalLat - currLat); // deg2rad below
  var dLon = deg2rad(goalLong - currLong);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(currLat)) *
      Math.cos(deg2rad(goalLat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d.toFixed(2);
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}
