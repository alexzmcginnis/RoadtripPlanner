<template>
  <v-app>
     <NuxtLink to='/MakeTrip'>makeTrip</NuxtLink>

     <v-card>Profile</v-card>

   
    <div>
      <div>username: {{userInfo.username}} </div>
      <div>city: {{userInfo.city}}</div>
      <div>state: {{userInfo.state}}</div>
      <div>interests:
        <div v-for="interest in userInfo.interests"
        :key="interest"
        > {{interestPhrases[interest]}} </div>
         </div>
    </div>



 
    <button @click="getUser">get user</button>
    <button @click="submitInfo">submit info</button>
    <button @click="toggleEditMode">edit profile</button>

    <update-user-info v-if="editMode" :username="userInfo.username"></update-user-info>
   

 
    
  </v-app>
</template>

<script>
  import axios from 'axios';
  import {GraphQLClient, gql} from 'graphql-request';
  
  import UpdateUserInfo from '../components/UpdateUserInfo.vue'

  const baseUri = 'http://localhost:3000/dev'

  const gqClient  = new GraphQLClient( `${baseUri}/graphql`) //chnage for deployemnet
  

  export default{
    name: "AboutMe",
    components: {
      UpdateUserInfo
    },
    data() {
      return {
        
        userInfo: {
          id: 'dc040efa-d229-4699-bc73-9267a3e053ad',  //this needs to be updated--> hardcoded until authentication put in
          username: 'enter username',
          city: 'New Orleans', 
          state: 'LA',
          interests: [],
          
        },
        interestPhrases: {
          theatres_and_entertainments: 'theatres and shows',
          monuments_and_memorials: 'monuments and memorials',
          historical_places: 'historical places'

        },
        editMode: false,
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

      async getUser() {
        const {data} = await axios.get(`${baseUri}/getUser/1`) //for now hardcoded 1 in, this needs to be different after handle authentication. 
        console.log(data)


      },

      updateInfo() {
        axios.post(`http://localhost:3000/dev/getAll`, this.userInfo)
      },
      toggleEditMode() {
        this.editMode = !this.editMode
       //this.editMode = true
      }

    }, 
    async mounted() {
        const {data} = await axios.get(`${baseUri}/getUser/dc040efa-d229-4699-bc73-9267a3e053ad`) //for now hardcoded 1 in, this needs to be different after handle authentication. 
        console.log(data)
        const parsedData = JSON.parse(data) //when deployed this may not be necessary?  Lambda proxy v integration?
        this.userInfo = parsedData
        
    }

  }
</script>
