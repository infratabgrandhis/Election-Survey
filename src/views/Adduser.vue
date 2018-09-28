<template>
    <div>
        <v-subheader class="pa-1">Add User</v-subheader>
        <v-form class="pa-2">
            <v-container>
                <v-layout row
                          wrap>
                    <v-text-field label="Name"
                                  type="text"
                                  v-model="name"
                                  :clearable="true"></v-text-field>
                    <v-text-field mask="phone"
                                  v-model="phone"
                                  label="Phone Number"></v-text-field>
                    <v-text-field label="Email"
                                  type="text"
                                  v-model="email"
                                  :rules="[rules.required, rules.email]"
                                  :clearable="true"></v-text-field>
                    <v-text-field label="Password"
                                  type="password"
                                  v-model="password"
                                  hint="At least 8 characters"
                                  :rules="[rules.required, rules.min]"
                                  :clearable="true"></v-text-field>
                    <v-select :items="constituenciesList"
                              v-model="constituency"
                              label="constituencies"></v-select>
                    <v-switch :label="`Admin: ${admin.toString().toUpperCase()}`"
                                class="full-width"
                              v-model="admin"></v-switch>
                    <v-btn color="success"
                           @click="addUser">Add</v-btn>
                </v-layout>
            </v-container>
        </v-form>
    </div>
</template>

<script>
import _values from "lodash/values";
import router from "@/router.js";
import { db } from "@/fire.js";
import util from "@/util/util.js";

export default {
  data() {
    return {
      admin: false,
      name: "",
      phone: "",
      email: "",
      password: "",
      constituenciesList: [],
      constituency: "",
      rules: {
        required: true,
        min: value => {
          if (value) {
            return value.length >= 8 || "Min 8 characters";
          } else {
            return "";
          }
        },
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        }
      }
    };
  },
  methods: {
    getConstituenciesList() {
      db.collection("ConstituencyList")
        .get()
        .then(result => {
          this.constituenciesList = util.firebaseGetValidator(result).data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    addUser() {
      const data = {
        name: this.name,
        phone: this.phone,
        email: this.email,
        constituency: !this.admin ? this.constituency : "",
        admin: this.admin
      };
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(result => {
          data.uid = result.user.uid;
          db.collection("Employees")
            .add(data)
            .then(res => {
              this.$store.dispatch("updateAuthData");
              this.$store.dispatch("manipulateSnackData", {
                txt:
                  "Successfully added new user and loggedin with new user credentials",
                color: "success",
                active: true
              });
            })
            .catch(err => {
              this.$store.dispatch("manipulateSnackData", {
                txt: err.message,
                color: "error",
                active: true
              });
            });
        })
        .catch(err => {
          this.$store.dispatch("manipulateSnackData", {
            txt: err.message,
            color: "error",
            active: true
          });
        });
    }
  },
  created() {
    if (this.$store.state.authUser.email) {
      this.getConstituenciesList();
    } else {
      router.push("/signin");
    }
  }
};
</script>