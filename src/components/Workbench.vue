<template>
  <a-card
    title="统计"
    :tab-list="tabs"
    @tabChange="(key) => changeTab(key)"
    style="text-align: left;"
  >
    <div ref="container" id="container"></div>
  </a-card>
  <a-card
    title="明细"
    style="text-align: left;margin-bottom: 20px"
    class="detail-table"
  >
    <a-date-picker
      v-model:value="date"
      @change="onChange"
      size="large"
      style="margin-bottom: 10px;"
    />
    <a-table
      :columns="columns"
      :data-source="data"
      :pagination="false"
      size="middle"
    >
      <template #symbol="{ text }">
        <a>{{ text }}</a>
      </template>
    </a-table>
  </a-card>
</template>
<script>
import api from "@/api/module";
const columns = [
  {
    title: "symbol",
    dataIndex: "symbol",
    slots: { customRender: "symbol" },
  },
  {
    title: "WeekAvg",
    dataIndex: "WeekAvg",
  },
  {
    title: "lastPrice",
    dataIndex: "lastPrice",
  },
  {
    title: "ratio",
    dataIndex: "ratio",
  },
];
const now = new Date();
export default {
  data() {
    return {
      data: [],
      date: "" + now.getFullYear() + now.getMonth() + now.getDate(),
      columns: columns,
      chart: undefined,
      tabs: [
        {
          key: "7",
          tab: "近一周",
        },
        {
          key: "14",
          tab: "近两周",
        },
      ],
    };
  },
  methods: {
    changeTab(name) {
      this.refresh(name);
    },
    refresh(choice) {
      let that = this;
      api.list(choice).then((res) => {
        that.chart.source(res.data);
        that.chart.render();
      });
    },
    detail(date) {
      api.detail(date).then((res) => {
        this.data = res.data;
      });
    },
    onChange(value, dateString) {
      if (dateString) {
        this.detail(dateString);
      }
    },
  },
  mounted() {
    let containerRef = this.$refs["container"];
    let scrollWidth = containerRef.scrollWidth;
    this.chart = new this.G2.Chart({
      container: "container",
      autoFit: true,
      width: scrollWidth,
      height: 350,
      padding: [30, 40, 20, 30],
    });
    this.chart
      .interval()
      .position("date*sum")
      .tooltip({
        showMarkers: false,
      });
    this.refresh(7);
    this.detail("2020-12-17");
  },
};
</script>
<style>
.ant-card-head-title {
  font-size: 25px !important;
}
.detail-table .ant-card-body {
  padding-left: 37px;
}
</style>
