<template>
  <h1 style="font-weight: bold;font-size:50px; margin-bottom:50px">
    🌟 Welcome Art Social! 🌟
  </h1>

  <div v-for="group in groups" :key="group.name" style="margin-bottom:30px">
    <a-row
      style="text-align: left;
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 10px;"
    >
      {{ group.name }}</a-row
    >
    <a-row type="flex" justify="space-around">
      <a-col :span="4" v-for="image in group.images" :key="image.id">
        <a-card hoverable @click="handleImage(image)">
          <template #cover>
            <img :src="'data:image/png;base64,' + image.src" height="260" />
          </template>
          <a-card-meta :title="image.name">
            <template #description>
              <span style="font-size: 18px">{{ image.description }}</span
              ><br />
              <span style="color: green; font-size: 20px">
                ${{ image.price }}</span
              >
            </template>
          </a-card-meta>
        </a-card>
      </a-col>
    </a-row>
  </div>
  <a-modal v-model:visible="showDetail" :footer="null">
    <p><span style="font-weight: bold;">名称: </span> {{ detail.name }}</p>
    <p>
      <span style="font-weight: bold;">链接: </span
      ><a target="_blank" :href="detail.href">{{ detail.href }}</a>
    </p>
  </a-modal>
</template>
<script>
import api from "@/api/module";
export default {
  data() {
    return {
      showDetail: false,
      detail: {},
      groups: [],
    };
  },
  methods: {
    handleImage(image) {
      api.marketPlaceDetail(image.id).then((res) => {
        this.detail = res.data;
        this.showDetail = true;
      });
    },
  },
  mounted() {
    api.imageGroups().then((res) => {
      this.groups = res.data;
    });
  },
};
</script>
<style>
.ant-card-meta-detail > div:not(:last-child) {
  font-size: 24px;
  font-weight: bolder;
}
</style>
