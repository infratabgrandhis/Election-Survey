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
                        <DummyChart v-else></DummyChart>
                        </v-layout>
                    </v-card>
                </v-layout>
            </v-container>
        </v-form>
    </div>
</template>

<script>
import config from '../config/firebase.json'
import axios from 'axios'
import _values from 'lodash/values'
import DummyChart from './DummyChart.vue'

export default {
    data() {
        return {
            constituenciesList:[],
            constituency:'',
        }
    },
    components:{
        DummyChart,
    },
    methods:{
        getConstituenciesList() {
            axios.get(config.urls.getConstituenciesList).then((result) => {
                this.constituenciesList = _values(result.data)[0].data || [];
            }).catch((err) => {
                console.log(err);
            })
        },
    },
    created() {
        this.getConstituenciesList();
    }
}
</script>

