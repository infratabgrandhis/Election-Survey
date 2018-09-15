<template>
    <v-snackbar v-model="getSnackObj.active"
                :multi-line="true"
                :timeout="3000"
                :top="true"
                :color="getSnackObj.color"
                :vertical="false">
        {{getSnackObj.txt}}
        <v-btn color="red"
               @click="closeSnack"
               flat>
            Close
        </v-btn>
    </v-snackbar>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
    computed: {
        ...mapGetters({
            getSnackObj: 'getSnackData'
        })
    },
    methods: {
        closeSnack() {
            this.$store.dispatch('manipulateSnackData', {
                        txt: '',
                        active: false
                    });
        }
    }
}
</script>

