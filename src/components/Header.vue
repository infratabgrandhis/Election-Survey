<template>
    <v-toolbar color="indigo"
               dark
               fixed
               app>
        <v-toolbar-side-icon @click.stop="toggleBurgerbar"></v-toolbar-side-icon>
        <v-toolbar-title class="text-xs-center">1
            <sub>STOP SERVICES</sub>
        </v-toolbar-title>
    </v-toolbar>
</template>

<script>
import { mapActions } from 'vuex'

export default {
    methods: {
        ...mapActions(['toggleBurgerbar'])
    },
}
console.log(this);
</script>

