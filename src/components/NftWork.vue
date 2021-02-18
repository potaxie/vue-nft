<template>
  <h1 style="font-weight: bold; font-size: 50px; margin-bottom: 50px">
    🌟 Welcome NFT Social! 🌟
  </h1>

  <div v-for="group in groups" :key="group.name" style="margin-bottom: 30px">
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
              <span style="color: green; font-size: 16px; font-weight: bold">
                {{ image.price }} ETH</span
              >
              <br />
              <a href="javascript:;" @click="star(image)">
                <StarFilled
                  v-if="image.stared"
                  :style="{ fontSize: '20px', color: '#52c41a' }"
                />
                <StarOutlined v-else :style="{ fontSize: '20px' }" />
              </a>
            </template>
          </a-card-meta>
        </a-card>
      </a-col>
    </a-row>
  </div>
  <image-detail ref="image-detail" />
</template>

<script>
import { StarOutlined, StarFilled } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { mapGetters } from "vuex";
import ImageDetail from "@/components/ImageDetail";
import api from "@/api/module";
export default {
  components: {
    StarOutlined,
    StarFilled,
    ImageDetail,
  },
  computed: {
    ...mapGetters(["getCurrentUser"]),
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
    star(image) {
      if (!this.getCurrentUser()) {
        message.warn("Please login...");
        return;
      }
      if (image.stared) {
        api.nftWorkCancelCollect(image.id).then((res) => {
          if (res.data.code === 1) {
            image.stared = false;
          } else {
            message.error(res.data.description);
          }
        });
      } else {
        api.nftWorkCollect(image.id).then((res) => {
          if (res.data.code === 1) {
            image.stared = true;
          } else {
            message.error(res.data.description);
          }
        });
      }
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
.ant-card-meta-detail > div:not(:last-child) {
  font-size: 24px;
  font-weight: bolder;
}
.information {
  .ant-modal-title {
    font-size: 21px;
  }
}
</style>
