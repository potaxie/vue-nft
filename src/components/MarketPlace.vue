<template>
  <a-card
    title="Volume History"
    :tab-list="tabs"
    @tabChange="(key) => changeTab(key)"
    class="history-volume"
  >
    <div ref="container" id="container"></div>
  </a-card>
  <a-card
    class="sale-history"
    :tab-list="symbolTabs"
    @tabChange="(key) => changeSymbolTab(key)"
    title="Sale History"
  >
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
          :src="'/app/file/get/' + record.image + '?flag=tumbnail'"
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
      symbol: "All",
      symbolTabs: [
        {
          key: "All",
          tab: "All",
        },
        {
          key: "Hashmasks",
          tab: "Hashmasks",
        },
        {
          key: "CryptoKitties",
          tab: "CryptoKitties",
        },
        {
          key: "CryptoPunks",
          tab: "CryptoPunks",
        },
      ],
      tabs: [
        {
          key: "7",
          tab: "Last week",
        },
        {
          key: "14",
          tab: "Last two week",
        },
      ],
    };
  },
  methods: {
    onImageDetail(record) {
      api.imageDetail(record.image).then((res) => {
        let imageDetail = this.$refs["image-detail"];
        imageDetail.detail = res.data;
        imageDetail.showDetail = true;
      });
    },
    changeTab(name) {
      this.choice = name;
      this.refresh();
    },
    changeSymbolTab(name) {
      this.symbol = name;
      api.marketPlaceList(this.choice, this.symbol).then((res) => {
        this.data = res.data;
      });
    },
    refresh() {
      let that = this;
      api.marketPlaceAnalysis(this.choice).then((res) => {
        that.chart.source(res.data);
        that.chart.render();
      });
      api.marketPlaceList(this.choice, this.symbol).then((res) => {
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
      padding: [30, 40, 60, 30],
    });
    this.chart.scale({
      day: {
        range: [0, 1],
      },
      volume: {
        nice: true,
      },
    });
    this.chart.tooltip({
      showCrosshairs: true,
      shared: true,
    });
    this.chart.point().position("day*volume").color("contract_name").shape("smooth");
    this.chart.line().position("day*volume").color("contract_name").shape("smooth");
    this.refresh();
  },
};
</script>
<style lang="less">
.history-volume {
  text-align: left;
  margin-bottom: 20px;
  .ant-tabs-tab {
    font-size: 14px;
  }
  .ant-card-body {
    padding: 24px 24px 10px 25px;
  }
}
.sale-history {
  text-align: left;
  .ant-tabs-tab {
    font-size: 14px;
  }
}
</style>
