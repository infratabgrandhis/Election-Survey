<template>
    <v-card>
      <highcharts :key="data" :options="chartOptions"></highcharts>
    </v-card>
</template>

<script>
import { Chart } from "highcharts-vue";
export default {
  props: {
    data: {
      type: Array,
      default: []
    },
    title: ""
  },
  data() {
    return {
      chartBasicOptions: {
        chart: {
          type: "pie",
          width: 300,
          height: 300
        },
        title: {},
        plotOptions: {
          pie: {
            dataLabels: {
              enabled: false
            },
            showInLegend: true
          }
        },
        series: [
          {
            name: "Party"
          }
        ]
      },
      chartOptions: {}
    };
  },
  mounted() {
    this.chartBasicOptions.title.text = this.title;
    this.chartBasicOptions.series[0].data = this.data;
    this.chartOptions = this.chartBasicOptions;
  },
  components: {
    highcharts: Chart
  },
  watch: {
    data(newValue, oldValue) {
      this.chartBasicOptions.title.text = this.title;
      this.chartBasicOptions.series[0].data = this.data;
      this.chartOptions = this.chartBasicOptions;
    }
  }
};
</script>

