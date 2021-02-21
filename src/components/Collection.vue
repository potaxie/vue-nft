<template>
  <a-card style="text-align: left">
    <template #title>
      Price Verb:
      <a href="javascript:;" style="font-size: 14px; font-weight: 400">{{
        current ? current.name : ""
      }}</a>
    </template>
    <div id="container"></div>
  </a-card>
  <a-card title="My collections" style="text-align: left">
    <a-table
      :columns="columns"
      :data-source="data"
      :pagination="pagination"
      rowKey="token_id"
      size="middle"
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
          size="large"
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
  <image-detail ref="image-detail" />
</template>
<script>
import ImageDetail from "@/components/ImageDetail";
import { Chart } from "@antv/g2";
import { message } from "ant-design-vue";
import { mapGetters } from "vuex";
import api from "@/api/module";
const columns = [
  {
    title: "Name",
    dataIndex: "name",
    slots: { customRender: "name" },
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
  {
    title: "Action",
    key: "action",
    slots: { customRender: "action" },
  },
];
export default {
  components: {
    ImageDetail,
  },
  data() {
    return {
      data: [],
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
        pageSize: 10,
      },
    };
  },
  computed: {
    ...mapGetters(["getCurrentUser"]),
  },
  methods: {
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
        .collectionDetail(this.pagination.current, this.pagination.pageSize)
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
    this.chart = new Chart({
      container: "container",
      autoFit: true,
      height: 200,
    });
    this.chart.line().position("date*price").tooltip({
      showMarkers: false,
    });
    this.detail();
  },
};
</script>
