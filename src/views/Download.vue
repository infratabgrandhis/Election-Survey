<template>
    <div>
        <v-subheader class="pa-1">Download</v-subheader>
        <v-form class="pa-2">
            <v-container>
                <v-layout row
                          wrap>
                    <v-select :items="constituenciesList"
                              v-model="constituency"
                              class="full-width"
                              label="constituencies"></v-select>
                    <v-btn color="success"
                        @click="downloadData"
                        dark>Download
                    </v-btn>
                </v-layout>
            </v-container>
        </v-form>
    </div>
</template>

<script>
import router from "@/router.js";
import { db } from "@/fire.js";
import util from "@/util/util.js";
import saveAs from "file-saver";

export default {
  data() {
    return {
      constituenciesList: [],
      constituency: ""
    };
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
    downloadData() {
      db.collection("Feedback")
        .where("constituency", "==", this.constituency)
        .get()
        .then(result => {
          this.resultSet = result.docs.map(doc => {
            return doc.data();
          });
          if (this.resultSet.length > 0) {
            const data = {
              data: this.resultSet
            };
            const fileName = this.constituency + ".json";
            var fileToSave = new Blob([JSON.stringify(data)], {
              type: "application/json",
              name: fileName
            });
            saveAs(fileToSave, fileName);
          } else {
            this.$store.dispatch("manipulateSnackData", {
              txt: "There is no data to download",
              color: "error",
              active: true
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    if (this.$store.state.authUser.email) {
      if (this.$store.state.authUser.admin) {
        this.getConstituenciesList();
      } else {
        router.push("/");
      }
    } else {
      router.push("/signin");
    }
  }
};
</script>

<style scoped>
</style>