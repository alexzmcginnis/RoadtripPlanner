<template>
  <div> 

<NuxtLink to='/AboutMe'>Profile</NuxtLink>
<h3>Make a Trip </h3>
    <input type="text" placeholder="origin city" v-model="route.origin.city" />
    <input type="text" placeholder="origin state" v-model="route.origin.state" />
    <input type="text" placeholder="destination city" v-model="route.destination.city"/>
    <input type="text" placeholder="destination state" v-model="route.destination.state"/>
    <button @click="getRouteDetails">get route deetz</button>

    <button @click="getDestinationPoi">destination points of interest</button>
    <button @click="saveTrip">save my trip</button>

    

    <div>
      <div>{{tripInfo.distance.text}}</div>
      <div>{{tripInfo.duration.text}}</div>
    </div>
    <div>destination points of interest
      <ul id="pois">
        <li v-for="poi in pointsOfInterest" 
          :key="poi.xid" 
          v-bind:style= "[poi.liked ? {backgroundColor: 'pink'} : {backgroundColor: 'blue'}]"
          @click="() => togglePoi(poi)">
            name: {{poi.name}} rating: {{poi.rating}}

        </li>
      </ul>
    </div>
   

  </div>
</template>

<script>
import axios from 'axios'
 import {GraphQLClient, gql} from 'graphql-request';
const baseUri = 'http://localhost:3000/dev'
 const gqClient  = new GraphQLClient( `${baseUri}/graphql`) //chnage for deployemnet

export default{
  name: "MakeTrip",
  components: {

  },
  data() {
    return {
      route: {
        origin:{
          city: '',
          state: ''
        },
        destination:{
          city: '',
          state: ''
        }
      },
      tripInfo: {
        distance: {
          text: '',
          value: 0
        },
        duration: {
          text: '',
          value: 0
        }
      },
      radius: 5000,
      kind: "theatres_and_entertainments",
      pointsOfInterest: [],
      likedPois: []

    }
  },

  methods: {
    async getRouteDetails() {
      const origin = `${this.route.origin.city}, ${this.route.origin.state}`
      const destination = `${this.route.destination.city}, ${this.route.destination.state}`
      const {data }=  await axios.get(`${baseUri}/drivingDistance/${origin}/${destination}`)
      const parsedData = JSON.parse(data) //ternary for if deployed parsedData = data?
      

      const tripInfoData = parsedData.rows[0].elements[0]

      this.tripInfo.distance = tripInfoData.distance
      this.tripInfo.duration = tripInfoData.duration
    
     
    },
    async getDestinationPoi() {

      const destinationPOI = await axios.get(`${baseUri}/pointsOfInterest/${this.route.destination.city}/${this.route.destination.state}/${this.radius}/${this.kind}`)


     const parsedPOI = JSON.parse(destinationPOI.data) //the same if deployed??
     console.log(parsedPOI.features)

      const pOIs= parsedPOI.features.map(feature => {
       return {
         name: feature.properties.name,
         rating: feature.properties.rate,
         kinds: feature.properties.kinds,
         xid: feature.properties.xid, 
         liked: false

       }
     })

    console.log('pois', pOIs)
    this.pointsOfInterest = pOIs


    },
    async saveTrip() {
      console.log('click')
      const mutation = gql`
        mutation createTrip($input: TripInput ) {
          createTrip(input: $input) {
          id,
          origin,
          destination
         }
        }
      `
      const originString = `${this.route.origin.city}, ${this.route.origin.state}`
      const destinationString = `${this.route.destination.city}, ${this.route.destination.state}`
      const likedPoiList = this.likedPois.map(poi => poi.name)
      const tripInfoObject = {
        origin: originString,
        destination: destinationString,
        distance: this.tripInfo.distance.value,
        duration: this.tripInfo.duration.value,
        destinationPois: likedPoiList,
      }
      console.log('tio', tripInfoObject)
      const data = await gqClient.request(mutation, {input: tripInfoObject})
      console.log('t.i. data', data)

    },
    togglePoi(item) {
      item.liked = !item.liked
      const i = this.likedPois.indexOf(item)
      i === - 1 ? this.likedPois.push(item) : this.likedPois.splice(i, 1)
 
    },

    

   
    
  }

}


</script>

