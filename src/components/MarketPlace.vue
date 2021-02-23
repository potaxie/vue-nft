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
  >
    <template #title>
      Sale History
      <a-input-search
        v-model:value="keyword"
        placeholder="Input keyword"
        enter-button
        style="width: 250px; float: right"
        @search="refreshSaleHistory"
      />
    </template>
    <a-table
      :columns="columns"
      :data-source="data"
      :pagination="pagination"
      rowKey="token_id"
      size="middle"
    >
      <template #image="{ record }">
        <a-avatar
          class="hover-img"
          :size="50"
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
import { Chart } from "@antv/g2";
import api from "@/api/module";
const columns = [
  {
    title: "Name",
    dataIndex: "name",
    width: 250,
    ellipsis: true,
  },
  {
    title: "Image",
    dataIndex: "image",
    slots: { customRender: "image" },
    width: 120,
  },
  {
    title: "Symbol",
    dataIndex: "symbol",
  },
  {
    title: "Token_id",
    dataIndex: "token_id",
    width: 100,
    ellipsis: true,
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
      keyword: "",
      data: [],
      columns: columns,
      pagination: {
        onChange: (page) => {
          this.pagination.current = page;
          this.refreshSaleHistory();
        },
        total: 0,
        current: 1,
        pageSize: 7,
      },
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
      this.refreshVolumeHistory();
    },
    changeSymbolTab(name) {
      this.symbol = name;
      this.refreshSaleHistory();
    },
    refreshSaleHistory() {
      api
        .marketPlaceList(
          this.choice,
          this.symbol,
          this.keyword,
          this.pagination.current,
          this.pagination.pageSize
        )
        .then((res) => {
          this.pagination.total = res.data.total;
          this.data = res.data.result_list;
        });
    },
    refreshVolumeHistory() {
      api.marketPlaceAnalysis(this.choice).then((res) => {
        this.chart.data(res.data);
        this.chart.render();
      });
    },
  },
  mounted() {
    let containerRef = this.$refs["container"];
    let scrollWidth = containerRef.scrollWidth;
    this.chart = new Chart({
      container: "container",
      width: scrollWidth,
      height: 200,
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
    this.chart
      .point()
      .position("day*volume")
      .color("contract_name")
      .shape("smooth");
    this.chart
      .line()
      .position("day*volume")
      .color("contract_name")
      .shape("smooth");
    this.refreshSaleHistory();
    this.refreshVolumeHistory();
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
