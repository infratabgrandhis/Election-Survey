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
                        <v-card v-if="!constituency">
                          <p >Before see Analytics, Select constituency from the dropdown</p>
                        </v-card>
                        <div v-else>
                          <Chart :data="getChartData('Rvdglq55qaFYphTZQjia6Etv')" title="Parties status based on constituency"></Chart>
                          <v-divider dark inset></v-divider>
                          <!-- <Chart :data="getChartData('Rvdglq55qaFYphTZQjia6Etv')" title="Parties status based on constituency"></Chart> -->
                        </div>
                        </v-layout>
                </v-layout>
            </v-container>
        </v-form>
    </div>
</template>

<script>
import { db } from "@/fire.js";
import util from "@/util/util.js";
import _groupBy from "lodash/groupBy";
import _map from "lodash/map";
import Chart from "./DummyChart.vue";

export default {
  data() {
    return {
      constituenciesList: [],
      constituency: "",
      resultSet: []
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
    getChartData(queId) {
      let data = _groupBy(this.resultSet, item => {
        return item[queId];
      });
      data = _map(data, (value, key) => {
        return {
            name: key,
            y: value.length
        }
      })
      console.log(data);
      return data;
    }
  },
  created() {
    this.getConstituenciesList();
  },
  watch: {
    constituency(newValue, oldValue) {
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
    }
  }
};
</script>

