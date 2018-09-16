<template>
    <div>
        <v-subheader class="pa-1">Signin</v-subheader>
        <v-form class="pa-2">
            <v-container>
                <v-layout row
                          wrap>
                    <v-text-field label="Email"
                                  type="text"
                                  v-model="email"
                                  :rules="[rules.required, rules.email]"
                                  :clearable="true"></v-text-field>
                    <v-text-field label="Password"
                                  type="password"
                                  class="full-width"
                                  v-model="password"
                                  hint="At least 8 characters"
                                  :rules="[rules.required, rules.min]"
                                  :clearable="true"></v-text-field>
                    <v-btn @click="signin"
                           color="success">Signin</v-btn>
                </v-layout>
            </v-container>
        </v-form>
    </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
    data() {
        return {
            email: '',
            password: '',
            rules: {
                required: true,
                min: value => {
                    if(value) {
                        return value.length >= 8 || 'Min 8 characters';
                    } else {
                        return '';
                    }
                },
                email: value => {
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    return pattern.test(value) || 'Invalid e-mail.'
                }
            }
        }
    },
    methods: {
        signin() {
            if (this.email && this.password) {
                firebase.auth().signInWithEmailAndPassword(this.email, this.password)
                .then((result) => {
                    this.$store.dispatch('updateAuthData');
                    this.$store.dispatch('manipulateSnackData', {
                        txt: 'Successfully loggedin as '+ this.email,
                        color:'info',
                        active: true
                    });
                }).catch((err) => {
                    this.$store.dispatch('manipulateSnackData', {
                        txt: err.message,
                        color:'error',
                        active: true
                    });
                });
            } else {
                this.$store.dispatch('manipulateSnackData', {
                        txt: 'Both email and password mandatory to login',
                        color:'error',
                        active: true
                    });
            }
        }
    },
}
</script>

