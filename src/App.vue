<template>
  <v-app id="inspire">
    <Burgerbar></Burgerbar>
    <Header></Header>
    <v-content>
      <v-container fluid
                   fill-height>
        <v-layout>
          <v-flex text-xs-center>
            <router-view/>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <MessageCenter></MessageCenter>
  </v-app>
</template>

<script>
import Header from './components/Header';
import Burgerbar from './components/Burgerbar';
import MessageCenter from './components/messageCenter'


  export default {
    components: {
      Header,
      Burgerbar,
      MessageCenter
    },
  }
</script>

<style>
</style>
