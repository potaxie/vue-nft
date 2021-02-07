<template>
  <a-card
    :title="'Price Verb: ' + (current ? current.name : '')"
    :tab-list="tabs"
    @tabChange="(key) => changeTab(key)"
    style="text-align: left"
  >
    <div ref="container" id="container"></div>
  </a-card>
  <a-card title="My collections" style="text-align: left; font-weight: bold">
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
        .collectionList(
          this.choice,
          this.current ? this.current.token_id : null
        )
        .then((res) => {
          that.chart.source(res.data);
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
