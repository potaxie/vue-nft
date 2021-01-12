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
      size="middle"
    >
      <template #Token="{ text }">
        <a>{{ text }}</a>
      </template>
      <template #Image="{ record }">
        <a-avatar
          size="large"
          shape="square"
          :src="'data:image/png;base64,' + record.Image"
          @click="imageDetail(record)"
        />
      </template>
    </a-table>
  </a-card>
  <a-modal v-model:visible="showImageDetail" :footer="null">
    <p>
      <span style="font-weight: bold">名称</span><br />
      {{ detail.name }}
    </p>
    <p>
      <a target="_blank" :href="detail.href">{{ detail.href }}</a>
    </p>
  </a-modal>
</template>
<script>
import api from "@/api/module";
export default {
  data() {
    return {
      showImageDetail: false,
      chart: undefined,
      detail: {},
      data: [],
      columns: [
        {
          title: "Token",
          dataIndex: "Token",
          slots: { customRender: "Token" },
        },
        {
          title: "AssetId",
          dataIndex: "AssetId",
        },
        {
          title: "Image",
          dataIndex: "Image",
          slots: { customRender: "Image" },
        },
        {
          title: "Price",
          dataIndex: "Price",
        },
        {
          title: "SaleDate",
          dataIndex: "SaleDate",
        },
      ],
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
    imageDetail(record) {
      api.marketPlaceDetail(record.Token).then((res) => {
        this.detail = res.data;
        this.showImageDetail = true;
      });
    },
    changeTab(name) {
      this.refresh(name);
    },
    refresh(choice) {
      let that = this;
      api.marketPlaceAnalysis(choice).then((res) => {
        that.chart.source(res.data);
        that.chart.render();
      });
    },
  },
  mounted() {
    api.marketPlaceList().then((res) => {
      this.data = res.data;
    });
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
    this.chart
      .line()
      .position("month*temperature")
      .color("city")
      .shape("smooth");
    this.chart
      .point()
      .position("month*temperature")
      .color("city")
      .shape("circle");
    this.refresh(7);
  },
};
</script>
