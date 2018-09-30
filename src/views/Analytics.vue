<template>
    <div>
        <v-subheader class="pa-1">Analytics</v-subheader>
        <v-form class="pa-2">
            <v-container>
                <v-layout row
                          wrap>
                    <v-select :items="constituenciesList"
                              v-model="constituency"
                              class="full-width"
                              label="constituencies"></v-select>
                        <v-layout row
                            wrap
                            align-center>
                        <v-expansion-panel v-if="constituency">
                          <v-expansion-panel-content>
                            <div slot="header">Filters</div>
                            <v-card class="pl-4 pr-4 pb-2">
                              <v-radio-group v-model="genderVal"
                                            row
                                            class="full-width">
                                  <v-radio v-for="n in gender"
                                          :key="n"
                                          :column="false"
                                          :label="`${n}`"
                                          :value="n"></v-radio>
                              </v-radio-group>
                              <v-flex>
                                <v-select :items="ageList"
                                          v-model="age"
                                          label="Age"></v-select>
                              </v-flex>
                              <v-flex>
                                  <v-select :items="occupationList"
                                            v-model="occupationVal"
                                            label="occupation"></v-select>
                              </v-flex>
                              <v-btn color="error"
                                    @click="clearFilter"
                                    dark>Reset
                              </v-btn>
                              <v-btn color="success"
                                    @click="makeFilter"
                                    dark>Submit
                              </v-btn>
                            </v-card>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                        <v-divider></v-divider>
                        <div v-if="constituency">
                          <Chart :data="chartData" queId="Rvdglq55qaFYphTZQjia6Etv"></Chart>
                          <v-divider dark inset></v-divider>
                          <!-- <Chart :data="getChartData('Rvdglq55qaFYphTZQjia6Etv')" title="Parties status based on constituency"></Chart> -->
                        </div>
                        <v-card v-if="!constituency">
                          <p >Before see Analytics, Select constituency from the dropdown</p>
                        </v-card>
                        </v-layout>
                </v-layout>
            </v-container>
        </v-form>
    </div>
</template>

<script>
import { db } from "@/fire.js";
import util from "@/util/util.js";
import _filter from "lodash/filter";
import Chart from "./Chart.vue";
import router from "@/router.js";

export default {
  data() {
    return {
      constituenciesList: [],
      constituency: "",
      resultSet: [],
      chartData:[],
      gender: ["Male", "Female"],
      genderVal: "",
      ageList: [],
      age: "",
      occupationList: [],
      occupationVal: "",
      filterObj: {}
    };
  },
  components: {
    Chart
  },
  methods: {
    getConstituenciesList() {
      db.collection("ConstituencyList")
        .get()
        .then(result => {
          this.constituenciesList = util
            .firebaseGetValidator(result)
            .data.sort();
        })
        .catch(err => {
          console.log(err);
        });
    },
    getAgeList() {
      db.collection("AgeList")
        .get()
        .then(result => {
          this.ageList = util.firebaseGetValidator(result).data;
        })
        .catch(err => {
          this.errorCallback(err);
        });
    },
    getOccupationList() {
      db.collection("OccupationList")
        .get()
        .then(result => {
          this.occupationList = util.firebaseGetValidator(result).data;
        })
        .catch(err => {
          this.errorCallback(err);
        });
    },
    clearFilter() {
      this.age = '';
      this.occupationVal = '';
      this.genderVal = '';
      this.makeFilter();
    },
    makeFilter() {
      let obj = {};
      if(this.age) {
        obj.age = this.age;
      }
      if(this.occupationVal) {
        obj.occupation = this.occupationVal;
      }
      if(this.genderVal) {
        obj.gender = this.genderVal;
      }
      this.filterObj = obj;
    },
    calciculateChartData() {
      this.chartData = _filter(this.resultSet, this.filterObj)
    }
  },
  created() {
    if (this.$store.state.authUser.email) {
      if (this.$store.state.authUser.admin) {
        this.getConstituenciesList();
        this.getAgeList();
        this.getOccupationList();
      } else {
        router.push("/");  
      }
    } else {
      router.push("/signin");
    }
  },
  watch: {
    constituency(newValue) {
      db.collection("Feedback")
        .where("constituency", "==", newValue)
        .get()
        .then(result => {
          this.resultSet = result.docs.map(doc => {
            return doc.data();
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    filterObj(newValue) {
      this.calciculateChartData();
    },
    resultSet(newList) {
      this.calciculateChartData();
    }
  }
};
</script>

