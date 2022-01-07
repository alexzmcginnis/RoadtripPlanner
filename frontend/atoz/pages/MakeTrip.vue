<template>
  <v-app> 

<h3>Make a Trip </h3>
  <v-container>
    <v-row>
      <v-col cols="12" md="3">
        <v-text-field solo placeholder="origin city" v-model="route.origin.city" />
      </v-col>
       <v-col cols="12" md="3">
        <v-text-field solo placeholder="origin state" v-model="route.origin.state" />
      </v-col>
    </v-row>
    <v-row>
    <v-col cols="12" md="3">
       <v-text-field solo placeholder="destination city" v-model="route.destination.city"/>
    </v-col>
      <v-col cols="12" md="3">
      <v-text-field solo placeholder="destination state" v-model="route.destination.state"/>
    </v-col>
  </v-row>
    
  </v-container>
    
   
   <v-container>
     <v-row>
        
        <v-col cols="12" md="2">
          <v-btn  @click="getRouteDetails">get route deetz</v-btn>
        </v-col>
        <v-col cols="12" md="2">
          <v-btn @click="saveTrip">save my trip</v-btn>
        </v-col>
        <v-col cols="12" md="2">
        
        </v-col>

     </v-row>
   </v-container>

    <v-container>
    <v-row><h4>Fuel details (gal)</h4></v-row>
    <v-row>
    <v-col cols="12" md=5>
      <div id='chart'></div>
    </v-col>
    <v-col cols="12" md="7">
   <v-card elevation="2">
      <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">
              car type
            </th>
            <th class="text-left">
              Fuel (gal)
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>          
            <td>Small Car</td>
            <td>{{smallCar }}</td>
          </tr>
           <tr>          
            <td>Pickup Truck</td>
            <td>{{bigCar }}</td>
          </tr>
           <tr>          
            <td>Uhaul</td>
            <td>{{uhaul }}</td>
          </tr>
           <tr>          
            <td>STesla</td>
            <td>{{tesla }}</td>
          </tr>
        </tbody>
        </template>
      </v-simple-table>
    </v-card>
    </v-col>
    </v-row>
    </v-container>


   <h3>Destination Points of Interest: </h3>

    <v-simple-table>
    <template v-slot:default>
      <thead>
       
        <tr>
          <th class="text-left">
            Name
          </th>
          <th class="text-left">
            Rating
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="poi in pointsOfInterest"
          :key="poi.xid"
          v-bind:style= "[poi.liked ? {backgroundColor: 'lavender'} : {backgroundColor: 'aliceblue'}]"
          @click="() => togglePoi(poi)">
         
        
          <td>{{ poi.name}}</td>
          <td>{{poi.rating }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>

   <my-trips ></my-trips>

  </v-app>
</template>

<script>
import * as d3 from 'd3'; 
 import axios from 'axios'
 import {GraphQLClient, gql} from 'graphql-request';
 import MyTrips from '../components/MyTrips.vue';
import CreateAboutMe from '../components/CreateAboutMe.vue';
 const baseUri = 'http://localhost:3000/dev'
 const gqClient  = new GraphQLClient( `${baseUri}/graphql`) //chnage for deployemnet

export default{
  name: "MakeTrip",
  components: {
    MyTrips,
    CreateAboutMe
  },
  data() {
    return {
      width: 400,
      height: 400,
      margin: {
        top: 20,
        right: 20,
        left: 20,
        right: 20
      },
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
          value: 0,
     
          milesValue: 0,
        },
        duration: {
          text: '',
          value: 0
        }
      },
      vehicle: {
        small: 33.5, //2021 toyota camry avg(hwy, city)
        big: 21, //2021 honda ridgeline pickup truck avg(hwy, city)
        uhaul: 10,
        tesla: 113 //2021 Tesla model 3 performance awd avg(hwy, city)
      },
      radius: 5000,
      kind: "theatres_and_entertainments",
      pointsOfInterest: [],
      likedPois: [],
      allTrips: []

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
      this.tripInfo.distance.milesValue = tripInfoData.distance.value / 1609.34

      this.createChart()

      this.getDestinationPoi()
      
    
     
    },
    async getDestinationPoi() {

      const destinationPOI = await axios.get(`${baseUri}/pointsOfInterest/${this.route.destination.city}/${this.route.destination.state}/${this.radius}/${this.kind}`)


     const parsedPOI = JSON.parse(destinationPOI.data) //the same if deployed??
     

      const pOIs= parsedPOI.features.map(feature => {
       return {
         name: feature.properties.name,
         rating: feature.properties.rate,
         kinds: feature.properties.kinds,
         xid: feature.properties.xid, 
         liked: false

       }
     })

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
     
      const data = await gqClient.request(mutation, {input: tripInfoObject})
    },
    togglePoi(item) {
      item.liked = !item.liked
      const i = this.likedPois.indexOf(item)
      i === - 1 ? this.likedPois.push(item) : this.likedPois.splice(i, 1)
 
    },
    createChart() {

      const height = 200
      const width = 400
      const vehicles = ['car', 'truck', 'uhaul', 'tesla']
      
      const dataset = [
        this.tripInfo.distance.milesValue / this.vehicle.small,
        this.tripInfo.distance.milesValue  / this.vehicle.big,
        this.tripInfo.distance.milesValue  / this.vehicle.uhaul,
        this.tripInfo.distance.milesValue  / this.vehicle.tesla

      ]
      const xScale = d3.scaleBand()
        .domain(vehicles.map((d) => d))
        .rangeRound([0, 150], .2);

      const scale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, width - 50])

      const xAxis = d3.axisBottom()
        .scale(xScale)

        xAxis.ticks(4)
        
        xAxis.tickValues(vehicles)

       const yScale = d3.scaleLinear()
          .domain([0, d3.max(dataset)])
          .range([0, height - 45])

     

      d3.select("svg").remove()
      const svg = d3
        .select("#chart")
        .append("svg")
         .attr("width", width)
         .attr("height", height)
      


      const barChart = svg.selectAll('rect')
      .data(dataset)
      .enter()
      .append("rect")
        .attr("y", (d) => height - yScale(d))
        .attr("height", (d) => yScale(d))
        .attr("width", 30)
        .attr("fill", "teal")
        .attr("transform", function (d, i) {
          const translation = [40 * i, -30]; 
          return `translate(${translation[0]}, ${translation[1]})`;
        });

        

      const labels = svg.selectAll('text')
        .data(dataset)
        .enter()
        .append("text")
          .text((d) => Math.floor(d))
          .attr("y", (d) => height - yScale(d) - 30)
          .attr("x", (d, i) => 40 * i)

        const g = svg.append("g")
        .attr("transform", `translate(0, ${height - 30})`)
        .call(xAxis)

    }
  },
  computed: {
    smallCar: function() {
      console.log(this.tripInfo.distance.milesValue)
        return Math.floor(this.tripInfo.distance.milesValue / this.vehicle.small)
    },
    bigCar: function() {
        return Math.floor(this.tripInfo.distance.milesValue  / this.vehicle.big)
    },
    uhaul:  function() {
        return Math.floor(this.tripInfo.distance.milesValue  / this.vehicle.uhaul)
    },
    tesla:  function() {
        return Math.floor(this.tripInfo.distance.milesValue  / this.vehicle.tesla)
    },
  

  },

    
  

}


</script>

