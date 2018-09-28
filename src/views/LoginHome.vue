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
                        v-if="mandalName === aliasName"
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
                        v-if="mandalName !== aliasName"
                        label="village"></v-select>
                    <v-text-field label="Village"
                        type="text"
                        class="full-width"
                        v-if="mandalName === aliasName || villageName === aliasName"
                        v-model="villageAlliasName"
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
import { mapGetters, mapActions, mapMutations } from "vuex";
import config from "@/config/firebase.json";
import _values from "lodash/values";
import _keys from "lodash/keys";
import router from "@/router.js";
import { db } from "@/fire.js";
import util from "@/util/util.js";

export default {
  data() {
    return {
      mandalList: [],
      villageList: [],
      mandalName: "",
      mandalAlliasName: "",
      villageName: "",
      villageAlliasName: "",
      config
    };
  },
  methods: {
    ...mapActions(["updateMandalName", "updateVillageName"]),
    getMandalList(constituency) {
      db.collection("MandalList")
        .where("cName", "==", constituency)
        .get()
        .then(result => {
          this.mandalList = util.firebaseGetValidator(result).mName.sort();
          this.mandalName = this.getMandalName;
          this.mandalAlliasName = this.getMandalAliasName;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getVillageList(mandalName) {
      db.collection("VillageList")
        .where("mName", "==", mandalName)
        .get()
        .then(result => {
          this.villageList = util.firebaseGetValidator(result).vName.sort();
          this.villageName = this.getVillageName;
          this.$store.dispatch("updateMandalAliasName", "");
        })
        .catch(err => {
          console.log(err);
        });
    },
    setManDalAndVillageName() {
      this.$store.dispatch("updateMandalName", this.mandalName);
      this.$store.dispatch("updateMandalAliasName", this.mandalAlliasName);
      this.$store.dispatch("updateVillageName", (this.mandalName === this.aliasName) ? this.aliasName :this.villageName);
      this.$store.dispatch("updateVillageAliasName", this.villageAlliasName);
      router.push("/survey");
    }
  },
  computed: {
    ...mapGetters([
      "getAuthData",
      "getMandalName",
      "getVillageName",
      "getMandalAliasName",
      "getVillageAliasName"
    ]),
    aliasName() {
      return config.mandalVillageAliasName;
    }
  },
  created() {
    const authData = this.getAuthData;
    if (authData && !authData.admin) {
      this.getMandalList(authData.constituency);
    }
  },
  watch: {
    mandalName(newValue, oldValue) {
      this.getVillageList(newValue);
    }
  }
};
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

