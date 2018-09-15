<template>
    <div>
        <v-card>
            <table>
                <tr>
                    <td>Name</td>
                    <td>{{getAuthData.name}}</td>
                </tr>
                <tr>
                    <td>Phone</td>
                    <td>{{getAuthData.phone}}</td>
                </tr>
                <tr>
                    <td>Email</td>
                    <td>{{getAuthData.email}}</td>
                </tr>
                <tr v-if="getAuthData && !getAuthData.admin">
                    <td>Constituency</td>
                    <td>{{getAuthData.constituency}}</td>
                </tr>
            </table>
        </v-card>
        <v-subheader v-if="getAuthData && !getAuthData.admin"
                     style="">Where you are working today</v-subheader>
        <v-card v-if="getAuthData && !getAuthData.admin">
            <v-layout row
                      wrap
                      align-center>
                <v-flex xs4>
                    <v-subheader>Mandal</v-subheader>
                </v-flex>
                <v-flex xs8>
                    <v-select :items="mandalList"
                              v-model=mandalName
                              label="Mandal"></v-select>
                </v-flex>
            </v-layout>
            <v-layout row
                      wrap
                      align-center>
                <v-flex xs4>
                    <v-subheader>Village</v-subheader>
                </v-flex>
                <v-flex xs8>
                    <v-select :items="villageList"
                              v-model=villageName
                              label="village"></v-select>
                </v-flex>
            </v-layout>
            <v-layout>
                <v-btn @click="setManDalAndVillageName"
                       color="success">Start Suervey</v-btn>
            </v-layout>
        </v-card>
    </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import config from '../config/firebase.json'
import axios from 'axios'
import _values from 'lodash/values'
import _keys from 'lodash/keys'
import router from '../router.js'

export default {
    data() {
        return {
            mandalList: [],
            villageList: [],
            constituencyData: {},
            mandalName:'',
            villageName:''
        }
    },
    methods:{
        ...mapActions(['updateMandalName', 'updateVillageName']),
        getConstituencyData(constituency) {
            const url = config.urls.getMandalAndVillageList.replace('{constituency}', constituency);
            axios.get(url).then((result) => {
                this.constituencyData = _values(result.data)[0];
                this.getMandalList();
            }).catch((err) => {
                console.log(err);
            })
        },
        getMandalList() {
            this.mandalList = _keys(this.constituencyData);
            this.mandalName = this.getMandalName;
        },
        setManDalAndVillageName() {
            this.$store.dispatch('updateMandalName', this.mandalName);
            this.$store.dispatch('updateVillageName', this.villageName);
            router.push('/survey');
        }
    },
    computed: {
        ...mapGetters(['getAuthData', 'getMandalName', 'getVillageName']),
    },
    created() {
        const authData = this.getAuthData;
        if(authData && !authData.admin) {
            this.getConstituencyData(authData.constituency);
        }
    },
    watch: {
        mandalName(newValue, oldValue) {
          this.villageList = this.constituencyData[newValue];
          this.villageName = this.getVillageName;
        }
    },
}
</script>

<style>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td,
th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}
</style>

