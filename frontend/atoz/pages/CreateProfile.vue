<template>
  <v-app>create profile
     <NuxtLink to='/MakeTrip'>makeTrip</NuxtLink>
    <div>{{userInfo.username}}</div>
    <v-text-field solo placeholder="username" v-model="userInfo.username" />
    <v-text-field solo v-model="userInfo.city" />
    <v-text-field  solo placeholder="LA" v-model="userInfo.state" />
    
    <form > I want to see: 
      <input type="checkbox" id="entertainment"  value="theatres_and_entertainments" v-model="userInfo.interests" >
        <label for="entertainment">Theaters and shows</label><br>
      <input type="checkbox" id="historicalPlaces" value="historical_places" v-model="userInfo.interests" >
        <label for="historicalPlaces">historic sites</label><br>
      <input type="checkbox" id="monumentsAndMemorials" value="monuments_and_memorials" v-model="userInfo.interests" >
        <label for="monumentsAndMemorials">monuments and memorials</label><br><br>
    </form>



 

    <button @click="submitInfo">submit info</button>
    <button @click="updateInfo">update info </button>

    <button @click="testQuery">test query</button>
    
  </v-app>
</template>

<script>
  import axios from 'axios';
  import {GraphQLClient, gql} from 'graphql-request';

  const baseUri = 'http://localhost:3000/dev'

  const gqClient  = new GraphQLClient( `${baseUri}/graphql`) //chnage for deployemnet
  

  export default{
    name: "AboutMe",
    components: {

    },
    data() {
      return {
        
        userInfo: {
          id: '1',  //this needs to be updated--> hardcoded until authentication put in
          username: 'enter username',
          city: 'New Orleans', 
          state: 'LA',
          interests: [],
          
        }

      }
    },
    methods: {
      async submitInfo() {
        const mutation = gql`
          mutation Login($id: ID!, $username: String!, $city: String, $state: String, $interests: [String] ) {
            createUser(id: $id, username: $username, city: $city, state: $state, interests: $interests) {
              username
          }
        }
        `
        console.log(this.userInfo)
        const data = await gqClient.request(mutation, this.userInfo)
        console.log('data', data)
      },


      updateInfo() {
        
        axios.post(`http://localhost:3000/dev/getAll`, this.userInfo)
      },
      async testQuery () {
       
        const query = gql`
          query {
            getUsers {
              username
              city
            }
          }
        `
        const data = await gqClient.request(query)
        console.log('data', data)
      }
    }

  }
</script>
