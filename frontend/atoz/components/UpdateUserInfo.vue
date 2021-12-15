<template>
  <div>update info
  
 
    <input type="text" placeholder="username" v-model="userInfo.username" />
    <input type="text" v-model="userInfo.city" />
    <input type="text" placeholder="LA" v-model="userInfo.state" />
    
    <form > I want to see: 
      <input type="checkbox" id="entertainment"  value="theatres_and_entertainments" v-model="userInfo.interests" >
        <label for="entertainment">Theaters and shows</label><br>
      <input type="checkbox" id="historicalPlaces" value="historical_places" v-model="userInfo.interests" >
        <label for="historicalPlaces">historic sites</label><br>
      <input type="checkbox" id="monumentsAndMemorials" value="monuments_and_memorials" v-model="userInfo.interests" >
        <label for="monumentsAndMemorials">monuments and memorials</label><br><br>
    </form>



 


    <button @click="updateInfo">update info </button>


    
  </div>
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
    props: ['username'],
    data() {
      return {
        
        userInfo: {
          id: '1',  //this needs to be updated--> hardcoded until authentication put in
          username: this.username || 'anon',
          city: 'New Orleans', 
          state: 'LA',
          interests: [],
          
        }

      }
    },
    methods: {

      updateInfo() {
        
        axios.put(`http://localhost:3000/dev/updateInfo/1/${this.userInfo.username}`, this.userInfo) //id is hardcoded for now, fix this after deal w/ authentication
      },
    }

  }
</script>
