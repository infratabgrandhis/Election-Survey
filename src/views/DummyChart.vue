<template>
    <FusionCharts
        :type="type"
        :dataFormat="dataFormat"
        :dataSource="dataSource">
    </FusionCharts>
</template>

<script>
import FusionCharts from 'fusioncharts';

export default {
    data() {
        return {
            type: "pie2d",
            dataFormat: 'Json',
            dataSource: {
                "chart":{        
                    "caption":"How Parties playing",
                    "showValues":"1",
                    "showPercentInTooltip" : "0",
                    "numberPrefix" : "$",
                    "enableMultiSlicing":"1",
                    "theme": "fusion"
                },
                "data": [{
                    "label": "Bullion",
                    "value": "180000"
                }, {
                    "label": "Real-estate",
                    "value": "270000"
                }, {
                    "label": "Insurance",
                    "value": "20000"
                }]
            }
        }
    },
    components:{
        FusionCharts,
    }
}
</script>

