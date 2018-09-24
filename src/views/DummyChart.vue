<template>
    <highcharts :key="constituencyName" :options="chartOptions"></highcharts>
</template>

<script>
import {Chart} from 'highcharts-vue'
export default {
    props:{
        constituencyName:''
    },
    data() {
        return {
            chartBasicOptions: {
                chart: {
                    type: 'pie',
                    width: 300,
                    height: 300,
                },
                title: {
                    text: 'Parties status based on constituency'
                },
                plotOptions:{
                    pie:{
                        dataLabels: {
                            enabled: false,
                        },
                        showInLegend: true
                    }
                },
                series: [{
                    name: 'Party'
                }],
            },
            dataList: [
                [{
                    name: 'TRS',
                    y: 51.41,
                },{
                    name: 'Congress/TDP/CPI(M)',
                    y: 30.84
                }, {
                    name: 'BJP',
                    y: 10.85
                }, {
                    name: 'Independent',
                    y: 5
                }, {
                    name: 'NOTA',
                    y: 1.9
                }],
                [{
                    name: 'TRS',
                    y: 61.41,
                },{
                    name: 'Congress/TDP/CPI(M)',
                    y: 28.84
                }, {
                    name: 'BJP',
                    y: 5.85
                }, {
                    name: 'Independent',
                    y: 3
                }, {
                    name: 'NOTA',
                    y: 0.9
                }],
                [{
                    name: 'TRS',
                    y: 41.41,
                },{
                    name: 'Congress/TDP/CPI(M)',
                    y: 35.84
                }, {
                    name: 'BJP',
                    y: 15.85
                }, {
                    name: 'Independent',
                    y: 5
                }, {
                    name: 'NOTA',
                    y: 1.9
                }]
            ],
            chartOptions: {}
        }
    },
    mounted() {
        this.chartBasicOptions.series[0].data = this.dataList[0];
        this.chartOptions = this.chartBasicOptions;
    },
    components: {
        highcharts: Chart 
    },
    watch: {
        constituencyName(newValue, oldValue) {
            let tempVal = Math.floor(Math.random() * 3) + 1;
            this.chartBasicOptions.series[0].data = this.dataList[tempVal-1];
            this.chartOptions = this.chartBasicOptions;
        },
    },
}
</script>

