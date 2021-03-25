<template>
  <a-layout class="layout admin-layout">
    <main-header />
    <a-layout-content>
      <a-card class="history-volume">
        <template #title>
          <div style="margin-bottom: 10px">{{ $t("volume-history") }}</div>
          <div style="margin-left: 2px">
            <a-select v-model:value="choice" style="font-size: 14px" @change="changeTab">
              <a-select-option value="7">Last 1 Week</a-select-option>
              <a-select-option value="14">Last 2 Weeks</a-select-option>
              <a-select-option value="30">Last 1 Month</a-select-option>
              <a-select-option value="60">Last 2 Months</a-select-option>
            </a-select>
            <a-space style="margin-left: 30px; font-size: 14px">
              <span
                v-for="item in titleVolumes"
                :key="item.contract_name"
                style="margin-left: 10px"
              >
                {{ item.contract_name }} &nbsp;<span style="color: #3291e6"
                  >Ξ{{ item.volume }}</span
                >
              </span>
            </a-space>
            <a-select
              v-model:value="selectSymbol"
              style="font-size: 14px; float: right; width: 140px"
              @change="refreshVolumeHistory"
            >
              <a-select-option v-for="item in titleVolumes" :key="item.contract_name">
                {{ item.contract_name }}
              </a-select-option>
            </a-select>
          </div>
        </template>
        <div ref="container" id="container"></div>
      </a-card>
      <a-card
        class="sale-history"
        :title="$t('sale-history')"
        :tab-list="symbolTabs"
        :activeKey="activeKey"
        @tabChange="(key) => changeSymbolTab(key)"
      >
        <a-table
          :columns="columns"
          :data-source="data"
          :pagination="pagination"
          rowKey="token_id"
          size="middle"
          @change="onTableChange"
        >
          <template #image="{ record }">
            <a-avatar
              class="hover-img"
              :size="60"
              shape="square"
              :src="'/app/file/get/tumbnail/' + record.image + '.png'"
              @click="onImageDetail(record)"
            />
          </template>
        </a-table>
      </a-card>
      <image-detail ref="image-detail" />
    </a-layout-content>
    <main-footer />
  </a-layout>
</template>
<script>
import ImageDetail from "@/components/ImageDetail";
import MainHeader from "@/components/MainHeader";
import MainFooter from "@/components/MainFooter";
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
    width: 220,
  },
  {
    title: "Symbol",
    dataIndex: "symbol",
  },
  {
    title: "Token_id",
    dataIndex: "token_id",
    width: 200,
    ellipsis: true,
  },
  {
    title: "Price",
    dataIndex: "price",
    sorter: true,
  },
  {
    title: "Time",
    dataIndex: "time",
    sorter: true,
  },
];
export default {
  components: {
    ImageDetail,
    MainHeader,
    MainFooter,
  },
  data() {
    return {
      chart: undefined,
      titleVolumes: [],
      data: [],
      selectSymbol: "",
      sort: null,
      columns: columns,
      activeKey: "All",
      pagination: {
        onChange: (page) => {
          this.pagination.current = page;
          this.refreshSaleHistory();
        },
        total: 0,
        current: 1,
        pageSize: 6,
      },
      choice: "7",
      symbolTabs: [
        {
          key: "All",
          tab: "All",
        },
        {
          key: "CryptoPunks",
          tab: "CryptoPunks",
        },
        {
          key: "SuperRare",
          tab: "SuperRare",
        },
        {
          key: "Axie Infinity",
          tab: "Axie Infinity",
        },
      ],
      tabs: [
        {
          key: "7",
          tab: "Last 1 week",
        },
        {
          key: "14",
          tab: "Last 2 week",
        },
      ],
    };
  },
  computed: {
    keyword() {
      return this.$route.query.keyword;
    },
    symbol() {
      return this.$route.query.symbol || "All";
    },
  },
  watch: {
    keyword() {
      this.keywordSearch();
    },
    symbol(val) {
      this.activeKey = val;
      console.log(val);
      this.keywordSearch();
    },
  },
  methods: {
    onTableChange(pagination, filters, sorter) {
      var changed = false;
      if (sorter && sorter.columnKey) {
        let sortBy = sorter.columnKey;
        if (!sorter.order && this.sort) {
          this.sort = null;
          changed = true;
        } else {
          let asc = sorter.order === "ascend";
          changed = !this.sort || this.sort.sortBy !== sortBy || this.sort.asc !== asc;
          this.sort = { sortBy: sortBy, asc: asc };
        }
      }
      if (changed) {
        this.refreshSaleHistory();
      }
    },
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
      this.pagination.current = 1;
      location.href = "/#/market-place?symbol=" + name;
    },
    keywordSearch() {
      this.pagination.current = 1;
      this.refreshSaleHistory();
    },
    refreshSaleHistory() {
      api
        .marketPlaceList(
          this.choice,
          this.symbol,
          this.keyword,
          this.pagination.current,
          this.pagination.pageSize,
          this.sort
        )
        .then((res) => {
          this.pagination.total = res.data.total;
          this.data = res.data.result_list;
        });
    },
    refreshVolumeHistory() {
      api.marketPlaceAnalysis(this.choice, this.selectSymbol).then((res) => {
        this.titleVolumes = res.data.title_volume;
        if (!this.selectSymbol && this.titleVolumes) {
          this.selectSymbol = this.titleVolumes[0].contract_name;
        }
        this.chart.data(res.data.volume);
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
        formatter: (val) => `Ξ${val}`,
      },
    });
    this.chart.tooltip({
      showCrosshairs: true,
      shared: true,
    });
    this.chart.line().position("day*volume");
    this.chart.point().position("day*volume");
    this.chart.theme({
      styleSheet: {
        brandColor: "#5B8FF9",
      },
    });

    this.refreshSaleHistory();
    this.refreshVolumeHistory();
  },
};
</script>
<style lang="less">
.history-volume {
  text-align: left;
  .ant-card-head-title {
    padding: 16px 0 4px 0;
  }
  .ant-select-selector {
    border-radius: 16px !important;
  }
}
.sale-history {
  text-align: left;
  .ant-tabs-tab {
    font-size: 14px;
  }
  .ant-table.ant-table-middle
    > .ant-table-content
    > .ant-table-body
    > table
    > .ant-table-tbody
    > tr
    > td {
    padding: 5px 8px !important;
  }
}
</style>
