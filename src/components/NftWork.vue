<template>
  <div class="nft-title">Welcome Ginkgo</div>
  <div v-for="group in groups" :key="group.name" style="margin-bottom: 20px">
    <a-row
      style="text-align: left; font-size: 32px; font-family: Roboto,-apple-system,BlinkMacSystemFont,Arial,sans-serif;sans-serif;font-weight: bold; margin-bottom: 10px;color: #3291E6"
    >
      {{ group.name }}
    </a-row>
    <a-row :gutter="50" type="flex" justify="start">
      <a-col :span="4" v-for="image in group.images" :key="image.id">
        <a-card>
          <template #cover>
            <img
              :src="'/app/file/get/' + image.id + '?flag=tumbnail'"
              height="300"
              @click="handleImage(image)"
            />
          </template>
          <a-card-meta :title="image.name">
            <template #description>
              <div style="font-size: 16px; font-weight: bold">
                <span style="color: green"
                  >${{ image.price }}({{ image.numbers }}ETH)</span
                >
                <br />
                <span>{{ image.time }}</span>
              </div>
            </template>
          </a-card-meta>
        </a-card>
      </a-col>
    </a-row>
  </div>
  <image-detail ref="image-detail" />
</template>

<script>
import ImageDetail from "@/components/ImageDetail";
import api from "@/api/module";
export default {
  components: {
    ImageDetail,
  },
  data() {
    return {
      groups: [],
    };
  },
  methods: {
    handleImage(image) {
      api.imageDetail(image.id).then((res) => {
        let imageDetail = this.$refs["image-detail"];
        imageDetail.detail = res.data;
        imageDetail.showDetail = true;
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
<style lang="less">
.nft-title {
  font-size: 55px;
  color: #076b41;
  font-weight: bold;
  margin-bottom: 20px;
}
.ant-card-meta-detail > div:not(:last-child) {
  font-size: 24px;
  font-weight: bolder;
}
.information {
  .ant-modal-title {
    font-size: 21px;
  }
}
.ant-card-cover img {
  cursor: pointer;
}
.ant-card-cover img:hover {
  border: 4px solid #17a2b8;
}
</style>
