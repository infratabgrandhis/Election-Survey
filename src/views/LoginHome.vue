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
                    <v-text-field label="Mandal"
                        type="text"
                        class="full-width"
                        v-if="mandalName === config.aliasNames.mandalAliasName"
                        v-model="mandalAlliasName"
                        :clearable="true"></v-text-field>
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
                        v-if="mandalName !== config.aliasNames.mandalAliasName"
                        label="village"></v-select>
                    <v-text-field label="Village"
                        type="text"
                        class="full-width"
                        v-else
                        v-model="villageName"
                        :clearable="true"></v-text-field>
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
            mandalAlliasName:'',
            villageName:'',
            config,
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
            this.mandalList.push(config.aliasNames.mandalAliasName);
            this.mandalName = this.getMandalName;
            this.mandalAlliasName = this.getMandalAliasName;
        },
        setManDalAndVillageName() {
            this.$store.dispatch('updateMandalName', this.mandalName);
            this.$store.dispatch('updateMandalAliasName', this.mandalAlliasName);
            this.$store.dispatch('updateVillageName', this.villageName);
            router.push('/survey');
        }
    },
    computed: {
        ...mapGetters(['getAuthData', 'getMandalName', 'getVillageName','getMandalAliasName']),
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
          this.$store.dispatch('updateMandalAliasName', '');
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

