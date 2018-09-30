<template>
    <v-card>
      <highcharts :key="data" :options="chartOptions"></highcharts>
    </v-card>
</template>

<script>
import { Chart } from "highcharts-vue";
import _groupBy from "lodash/groupBy";
import _find from "lodash/find";
import _map from "lodash/map";

export default {
  props: {
    data: {
      type: Array,
      default: []
    },
    queId: ""
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
      chartOptions: {},
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
  methods: {
    getChartData() {
      let data = _groupBy(this.data, item => {
        return item[this.queId];
      });
      data = _map(data, (value, key) => {
        let obj = {
          name: key,
          y: value.length
        };
        switch(key) {
          case 'TRS':
            obj.color = '#E60386';
            break;
          case 'Congress/TDP/CPI(M)': 
            obj.color = 'green';
            break;
          case 'BJP': 
            obj.color = '#F07B21';
            break;
        }
        return obj;
      });
      return data;
    },
  },
  watch: {
    data(newValue, oldValue) {
      const list = this.getChartData();
      if (list.length > 0) {
        this.chartBasicOptions.title.text = _find(this.data[0]['questionAndAnswers'], {'questionId': this.queId}).question;
      } else {
        this.chartBasicOptions.title.text = 'There is no data to render.';
      }
      this.chartBasicOptions.series[0].data = list;
      this.chartOptions = this.chartBasicOptions;
    }
  }
};
</script>

