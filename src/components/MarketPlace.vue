<template>
  <a-card
    title="HISTORY CHART"
    :tab-list="tabs"
    @tabChange="(key) => changeTab(key)"
    style="text-align: left; margin-bottom: 20px"
  >
    <div ref="container" id="container"></div>
  </a-card>
  <a-card title="SALES HISTORY" style="text-align: left">
    <a-table
      :columns="columns"
      :data-source="data"
      :pagination="false"
      :scroll="{ y: 300 }"
      rowKey="token_id"
      size="middle"
    >
      <template #image="{ record }">
        <a-avatar
          size="large"
          shape="square"
          :src="'/app/file/get/' + record.image"
          @click="onImageDetail(record)"
        />
      </template>
    </a-table>
  </a-card>
  <image-detail ref="image-detail" />
</template>
<script>
import ImageDetail from "@/components/ImageDetail";
import api from "@/api/module";
const columns = [
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Image",
    dataIndex: "image",
    slots: { customRender: "image" },
  },
  {
    title: "Symbol",
    dataIndex: "symbol",
  },
  {
    title: "Token_id",
    dataIndex: "token_id",
  },
  {
    title: "price",
    dataIndex: "price",
  },
  {
    title: "Time",
    dataIndex: "time",
  },
];
export default {
  components: {
    ImageDetail,
  },
  data() {
    return {
      chart: undefined,
      data: [],
      columns: columns,
      choice: "7",
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
    onImageDetail(record) {
      api.marketPlaceDetail(record.image).then((res) => {
        let imageDetail = this.$refs["image-detail"];
        imageDetail.detail = res.data;
        imageDetail.showDetail = true;
      });
    },
    changeTab(name) {
      this.choice = name;
      this.refresh();
    },
    refresh() {
      let that = this;
      api.marketPlaceAnalysis(this.choice).then((res) => {
        that.chart.source(res.data);
        that.chart.render();
      });
      api.marketPlaceList(this.choice).then((res) => {
        this.data = res.data;
      });
    },
  },
  mounted() {
    let containerRef = this.$refs["container"];
    let scrollWidth = containerRef.scrollWidth;
    this.chart = new this.G2.Chart({
      container: "container",
      autoFit: true,
      width: scrollWidth,
      height: 250,
      padding: [30, 40, 20, 30],
    });
    this.chart.scale({
      month: {
        range: [0, 1],
      },
      temperature: {
        nice: true,
      },
    });
    this.chart.tooltip({
      showCrosshairs: true,
      shared: true,
    });
    this.chart.line().position("month*temperature").color("city").shape("smooth");
    this.chart.point().position("month*temperature").color("city").shape("circle");
    this.refresh();
  },
};
</script>
