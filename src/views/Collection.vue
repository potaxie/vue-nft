<template>
  <a-layout class="layout admin-layout">
    <main-header />
    <a-layout-content>
      <a-card
        title="My collections"
        style="text-align: left"
        :bodyStyle="{ padding: '0 24px' }"
      >
        <a-table
          :columns="columns"
          :data-source="data"
          :pagination="pagination"
          rowKey="token_id"
          size="middle"
          @change="onTableChange"
        >
          <template #name="{ record }">
            <a
              href="javascript:;"
              @click="
                current = record;
                refresh();
              "
              >{{ record.name }}</a
            >
          </template>
          <template #image="{ record }">
            <a-avatar
              class="hover-img"
              :size="40"
              shape="square"
              :src="'/app/file/get/' + record.image + '?flag=tumbnail'"
              @click="onImageDetail(record)"
            />
          </template>
          <template #action="{ record }">
            <a-popconfirm title="Confirm cancel?" @confirm="cancelCollect(record)">
              <a-button size="small" type="link">Unstar</a-button>
            </a-popconfirm>
          </template>
        </a-table>
      </a-card>
      <a-card style="text-align: left">
        <template #title>
          Price History:
          <a href="javascript:;" style="font-size: 14px; font-weight: 400">{{
            current ? current.name : ""
          }}</a>
        </template>
        <div ref="container" id="container"></div>
      </a-card>
      <image-detail ref="image-detail" />
    </a-layout-content>
    <a-layout-footer>Ginkgo Nft ©2020 Created by ginkgo </a-layout-footer>
  </a-layout>
</template>
<script>
import ImageDetail from "@/components/ImageDetail";
import MainHeader from "@/components/MainHeader";
import { Chart } from "@antv/g2";
import { message } from "ant-design-vue";
import { mapGetters } from "vuex";
import api from "@/api/module";
const columns = [
  {
    title: "Name",
    dataIndex: "name",
    slots: { customRender: "name" },
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
  {
    title: "Action",
    key: "action",
    slots: { customRender: "action" },
  },
];
export default {
  components: {
    ImageDetail,
    MainHeader,
  },
  data() {
    return {
      data: [],
      sort: null,
      current: null,
      choice: "7",
      columns: columns,
      chart: undefined,
      pagination: {
        onChange: (page) => {
          this.pagination.current = page;
          this.detail();
        },
        total: 0,
        current: 1,
        pageSize: 6,
      },
    };
  },
  computed: {
    ...mapGetters(["getCurrentUser"]),
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
        this.detail();
      }
    },
    refresh() {
      let that = this;
      api
        .collectionList(this.choice, this.current ? this.current.token_id : null)
        .then((res) => {
          that.chart.data(res.data);
          that.chart.render();
        });
    },
    onImageDetail(record) {
      api.imageDetail(record.image).then((res) => {
        let imageDetail = this.$refs["image-detail"];
        imageDetail.detail = res.data;
        imageDetail.showDetail = true;
      });
    },
    detail() {
      api
        .collectionDetail(this.pagination.current, this.pagination.pageSize, this.sort)
        .then((res) => {
          this.pagination.total = res.data.total;
          this.data = res.data.result_list;
          if (this.data) {
            this.current = this.data[0];
          }
          this.refresh();
        });
    },
    cancelCollect(item) {
      api.nftWorkCancelCollect(item.image).then((res) => {
        if (res.data.code === 1) {
          this.detail();
        } else {
          message.error(res.data.description);
        }
      });
    },
  },
  mounted() {
    if (!this.getCurrentUser()) {
      message.warn("Please login...");
    }
    let containerRef = this.$refs["container"];
    let scrollWidth = containerRef.scrollWidth;
    this.chart = new Chart({
      container: "container",
      width: scrollWidth,
      height: 200,
    });
    this.chart.scale({
      date: {
        range: [0, 1],
      },
      price: {
        min: 0,
        nice: true,
        formatter: (val) => `Ξ${val}`,
      },
    });
    this.chart.tooltip({
      showCrosshairs: true,
      shared: true,
    });
    this.chart.line().position("date*price");
    this.chart.point().position("date*price");
    this.detail();
  },
};
</script>
