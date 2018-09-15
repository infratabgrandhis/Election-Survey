<template>
    <v-navigation-drawer :value="getBurgerBarStatus"
                         :touchless="true"
                         :disable-route-watcher="true"
                         fixed
                         :width="200"
                         app>
        <v-list dense>
            <v-list-tile @click.native="toggleBurgerBarAndRouteChange('/')">
                <v-list-tile-action>
                    <v-icon>home</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title>Home</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
            <v-list-tile @click.native="toggleBurgerBarAndRouteChange('/survey')"
                         v-if="getAuthData && getAuthData.email && !getAuthData.admin">
                <v-list-tile-action>
                    <v-icon>question_answer</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title>Survey</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
            <v-list-tile @click.native="toggleBurgerBarAndRouteChange('/addUser')"
                         v-if="getAuthData && getAuthData.admin">
                <v-list-tile-action>
                    <v-icon>add_circle</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title>Add User</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
            <v-list-tile @click.native="toggleBurgerBarAndRouteChange('/signin')"
                         v-if="getAuthData && !getAuthData.email">
                <v-list-tile-action>
                    <v-icon>lock_open</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title>Signin</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
            <v-list-tile @click.native="signout"
                         v-if="getAuthData && getAuthData.email">
                <v-list-tile-action>
                    <v-icon>lock</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title>Signout</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
            <v-list-tile @click.native="toggleBurgerbar">
                <v-list-tile-action>
                    <v-icon>cancel</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title>Close</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import router from '../router.js'

export default {
    computed: {
        ...mapGetters(['getBurgerBarStatus', 'getAuthData']),
    },
    methods: {
        ...mapActions(['toggleBurgerbar']),
        signout() {
            firebase.auth().signOut().then((result) => {
                this.$store.dispatch('updateAuthData');    
                this.$store.dispatch('toggleBurgerbar');
                this.$store.dispatch('manipulateSnackData', {
                        txt: 'Successfully loggedout',
                        color:'info',
                        active: true
                    });
            }).catch((err) => {
                console.log(err);
                this.$store.dispatch('manipulateSnackData', {
                        txt: err.message,
                        color:'error',
                        active: true
                    });
            });
        },
        toggleBurgerBarAndRouteChange(path) {
            router.push(path);
            this.$store.dispatch('toggleBurgerbar');
        }
    },
}
</script>

