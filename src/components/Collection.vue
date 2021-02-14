<template>
  <a-card style="text-align: left">
    <template #title>
      Price Verb:
      <a href="javascript:;" style="font-size: 14px; font-weight: 400">{{
        current ? current.name : ""
      }}</a>
    </template>
    <div ref="container" id="container"></div>
  </a-card>
  <a-card title="My collections" style="text-align: left">
    <a-table
      :columns="columns"
      :data-source="data"
      :scroll="{ y: 300 }"
      :pagination="false"
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
          <a-button size="small" type="link">cancel</a-button>
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
    };
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
      api.collectionDetail().then((res) => {
        this.data = res.data;
        if (this.data) {
          this.current = this.data[0];
        }
        this.refresh();
      });
    },
    cancelCollect(image) {
      api.nftWorkCancelCollect(image.name + "TT" + image.token_id).then((res) => {
        if (res.data.code === 1) {
          this.detail();
        } else {
          message.error(res.data.description);
        }
      });
    },
  },
  mounted() {
    let containerRef = this.$refs["container"];
    let scrollWidth = containerRef.scrollWidth;
    this.chart = new Chart({
      container: "container",
      autoFit: true,
      width: scrollWidth,
      height: 200,
      padding: [40, 40, 20, 40],
    });
    this.chart.line().position("date*price").tooltip({
      showMarkers: false,
    });
    this.detail();
  },
};
</script>
