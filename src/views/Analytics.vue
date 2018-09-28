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
                    <v-card>
                        <v-layout row
                            wrap
                            align-center>
                        <p v-if="!constituency">Before see Analytics, Select constituency from the dropdown</p>
                        <DummyChart :constituencyName="constituency" v-else></DummyChart>
                        </v-layout>
                    </v-card>
                </v-layout>
            </v-container>
        </v-form>
    </div>
</template>

<script>
import { db } from "@/fire.js";
import util from "@/util/util.js";
import _values from "lodash/values";
import DummyChart from "./DummyChart.vue";

export default {
  data() {
    return {
      constituenciesList: [],
      constituency: ""
    };
  },
  components: {
    DummyChart
  },
  methods: {
    getConstituenciesList() {
      db.collection("ConstituencyList")
        .get()
        .then(result => {
          this.constituenciesList = util.firebaseGetValidator(result).data.sort();
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    this.getConstituenciesList();
  }
};
</script>

