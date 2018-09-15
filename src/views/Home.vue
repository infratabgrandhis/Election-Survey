<template>
  <div class="home">
    <v-subheader class="pa-1">Welcome {{getAuthData.name}}</v-subheader>
    <div v-if="getAuthData.uid"
         class="pa-2">
      <LoginHome></LoginHome>
    </div>
    <div v-else
         class="pa-3">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum maiores modi quidem veniam, expedita quis laboriosam, ullam facere adipisci, iusto, voluptate sapiente corrupti asperiores rem nemo numquam fuga ab at.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum maiores modi quidem veniam, expedita quis laboriosam, ullam facere adipisci, iusto, voluptate sapiente corrupti asperiores rem nemo numquam fuga ab at.
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import LoginHome from './LoginHome'

export default {
  computed: {
        ...mapGetters(['getAuthData']),
    },
  components:{
    LoginHome
  }
}
</script>



