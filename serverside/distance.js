const {keys} = require('./src/keys.js')
const axios = require('axios')

const drivingDistance = async (event) => {
 
  const {pathParameters} = event


const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${pathParameters.origin}&destinations=${pathParameters.destination}&key=${process.env.DISTANCE_API_KEY}`


const {data} = await axios.get(url)
console.log('response data', data)

return JSON.stringify(data)


}

//nola geocode: lat 30 , long -90

const pointsOfInterest = async (event) => {
  try {

    const {pathParameters} = event;

    const {radius, city, state, kind} = pathParameters
    
    //find lat/lon of city, state via giacode: 
    const geocodes = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${city},+${state}&key=${process.env.GEOCODE_API_KEY}`);
    let {lat, lng} = geocodes.data.results[0].geometry.location;
    lat = lat.toFixed(1)
    lng = lng.toFixed(1) //for some reason this api does not like more than 1 decimal place
  

    const url = `https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${lng}&lat=${lat}&kinds=${kind}&limit=10&apikey=${process.env.OPEN_TRIP_MAP_KEY}`
  
 

    const {data} = await axios.get(url)

    return JSON.stringify(data)


  } catch (err) {
    console.log('err', err)
  }
}


module.exports = {drivingDistance, pointsOfInterest}

