<script>
import { Line } from "vue-chartjs";
import { Bar } from "vue-chartjs";
export default {
  name: "line-chart",
  extends: Line,
  props: {
    data: {
      type: Object,
      default: {},
    },
    options: {
      fill: false,
      interaction: {
        intersect: false,
      },
    
    },
  },
  data: () => ({
    dataLabels: [],
    dataChart: [],
    responsive: true,
    maintainAspectRatio: false,
    titleDisplay: true,
    titleDisplayName: "",
    yAxes: [],
    xAxes: [],
    labelsFunc: {},
  }),
  watch: {
    data: {
      // Will fire as soon as the component is created
      immediate: false,
      handler(value) {
        this.dataLabels = value.labels;
        this.dataChart = value.datasets;
        this.yAxes = value.yAxes ? value.yAxes : [];
        this.xAxes = value.xAxes ? value.xAxes : [];
        this.titleDisplayName = value.title ? value.title : "";
        this.labelsFunc = value.labelsFunc ? value.labelsFunc : {};
        this.renderChart(
          {
            labels: value.labels,
            datasets: value.datasets,
          },
          {
            responsive: this.responsive,
            maintainAspectRatio: this.maintainAspectRatio,

            onClick: this.ClickHandler,
            title: {
              display: this.titleDisplay,
              text: value.title,
            },

            scales: {
              xAxes: value.xAxes ? value.xAxes : [],
              yAxes: value.yAxes ? value.yAxes : [],
            },
            tooltips: {
              mode: "index",
              callbacks: value.labelsFunc ? value.labelsFunc : {},
            },
          },
          {
            // This chart will not respond to mousemove, etc
            events: ["click"],
          }
        );
      },
    },
  },
  computed() {
    this.renderChart(
      {
        labels: this.dataLabels,
        datasets: this.dataChart,
      },
      {
        responsive: this.responsive,
        maintainAspectRatio: this.maintainAspectRatio,

        onClick: this.ClickHandler,
        title: {
          display: this.titleDisplay,
          text: this.titleDisplayName,
        },

        scales: {
          xAxes: this.xAxes,
          yAxes: this.yAxes,
        },
        tooltips: {
          mode: "index",
          callbacks: this.labelsFunc,
        },
      },
      {
        // This chart will not respond to mousemove, etc
        events: ["click"],
      }
    );
  },
  mounted() {
    this.renderChart(
      {
        labels: this.dataLabels,
        datasets: this.dataChart,
      },
      {
        responsive: this.responsive,
        maintainAspectRatio: this.maintainAspectRatio,
        onClick: this.ClickHandler,
        title: {
          display: this.titleDisplay,
          text: this.titleDisplayName,
        },

        scales: {
          xAxes: this.xAxes,
          yAxes: this.yAxes,
        },
        tooltips: {
          mode: "index",
          callbacks: this.labelsFunc,
        },
      },
      {
        // This chart will not respond to mousemove, etc
        events: ["click"],
      }
    );
  },
  methods: {
    // handle (point, event) {
    // const item = event[0]
    // this.$emit('on-receive', {
    // 	index: item._index,
    //   backgroundColor: item._view.backgroundColor,
    //   value: this.values[item._index]
    // })
    ClickHandler: function (event, points) {
      // Here is how to access the chart
      const c = this._data._chart;
      const datapoint = c.getElementAtEvent(event)[0];
      const indexBar = datapoint._index;
      const indexSegment = datapoint._datasetIndex;
      var chartLength = c.chart.data.datasets.length;
      // let tempArr=[];

      //chỗ này thay vì push các object vào 1 mảng thì
      // gọp 2 object đó thành 1 rồi gửi cả object qua bên parent component

      let pointObj = {};

      for (let i = 0; i < chartLength; i++) {
        pointObj["date_input"] = this.dataLabels[indexBar];
        pointObj[this.dataChart[i].label] = this.dataChart[i].data[indexBar];

        //tempArr.push(pointObj)
      }

      // if (array.length != 0) {
      //       var position = array[0]._index;
      //       var activeElement = this.tooltip._data.datasets[0].data[position]
      //       console.log(activeElement);
      //   } else {
      //       console.log("You selected the background!");
      //   }
      // console.log(indexBar);
      //         console.log(indexSegment);
      //console.log(this.dataLabels[indexBar]);

      //console.log(this.dataChart[0].data[indexBar]);
      //console.log(this.dataChart[0].label);
      //console.log(this.dataLabels[indexBar]);

      this.$emit("chartPointClick", pointObj);
      // Do whatever with this.my_data, indexBar, and indexSegment
      // }
    },
  },
};
</script>