<template>
  <a-card
    :title="(current ? current.symbol : '') + ' price volatility'"
    :tab-list="tabs"
    @tabChange="(key) => changeTab(key)"
    style="text-align: left"
  >
    <div ref="container" id="container"></div>
  </a-card>
  <a-card title="my collections" style="text-align: left;">
    <a-table
      :columns="columns"
      :data-source="data"
      :scroll="{ y: 300 }"
      :pagination="false"
      size="middle"
    >
      <template #symbol="{ record }">
        <a
          href="javascript:;"
          @click="
            current = record;
            refresh();
          "
          >{{ record.symbol }}</a
        >
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
    title: "token_id",
    dataIndex: "token_id",
  },
  {
    title: "price",
    dataIndex: "price",
  },
  {
    title: "name",
    dataIndex: "name",
  },
];
export default {
  data() {
    return {
      data: [],
      current: null,
      choice: "7",
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
      this.choice = name;
      this.refresh();
    },
    refresh() {
      let that = this;
      api
        .list(this.choice, this.current ? this.current.symbol : null)
        .then((res) => {
          that.chart.source(res.data);
          that.chart.render();
        });
    },
    detail() {
      api.detail().then((res) => {
        this.data = res.data;
        if (this.data) {
          this.current = this.data[0];
        }
        this.refresh();
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
      height: 200,
      padding: [40, 40, 20, 40],
    });
    this.chart
      .line()
      .position("date*price")
      .tooltip({
        showMarkers: false,
      });
    this.detail();
  },
};
</script>
