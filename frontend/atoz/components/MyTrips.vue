<template>
  <div>
    <h4>My planned trips </h4>
    <div v-for="trip in allTrips"
      :key="trip.id"

    >{{trip.origin}} to {{trip.destination}}</div>
  </div>

</template>

<script>
import axios from 'axios';
 import {GraphQLClient, gql} from 'graphql-request';
const baseUri = 'http://localhost:3000/dev'
 const gqClient  = new GraphQLClient( `${baseUri}/graphql`) //chnage for deployemnet


export default {
  name: "allTrips",
  components: {

  },

  data() {
    return {
      allTrips : []
    }
  },
  methods: {

  },
  async mounted() {
    console.log('mounted')
      const query = gql`
        query {
          getTrips {
            id
            origin
            destination
            destinationPois
            duration
            distance
          }
        }
      `
      const {getTrips} = await gqClient.request(query)
      console.log(getTrips, Array.isArray(getTrips))
      const relevantTrips = getTrips.filter(trip => trip.origin)
      this.allTrips = relevantTrips
  }
 
}
</script>
