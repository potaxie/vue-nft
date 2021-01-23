<template>
  <h1 style="font-weight: bold; font-size: 50px; margin-bottom: 50px">
    🌟 Welcome NFT Social! 🌟
  </h1>

  <div v-for="group in groups" :key="group.name" style="margin-bottom: 30px">
    <a-row
      style="text-align: left; font-size: 32px; font-family: Roboto,-apple-system,BlinkMacSystemFont,Arial,sans-serif;sans-serif;font-weight: bold; margin-bottom: 10px;color: #3291E6"
    >
      {{ group.name }}</a-row
    >
    <a-row :gutter="20" type="flex" justify="start">
      <a-col :span="4" v-for="image in group.images" :key="image.id">
        <a-card>
          <template #cover>
            <img
              :src="'data:image/png;base64,' + image.src"
              height="280"
              @click="handleImage(image)"
            />
          </template>
          <a-card-meta :title="image.name">
            <template #description>
              <a-tooltip>
                <template #title>
                  {{ image.description }}
                </template>
                <div
                  style="
                    font-size: 16px;
                    -webkit-line-clamp: 2;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    text-overflow: ellipsis;
                    word-break: break-all;
                    overflow: hidden;
                  "
                >
                  {{ image.description }}
                </div>
              </a-tooltip>

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
  <a-modal
    title="Information"
    :width="410"
    v-model:visible="showDetail"
    :footer="null"
    style="font-size: 10px"
    wrapClassName="information"
  >
    <p>
      <span style="font-weight: bold; font-size: 16px">name: </span>
      {{ detail.name }}
    </p>
    <p>
      <span style="font-weight: bold; font-size: 16px">token_id: </span>
      {{ detail.token_id }}
    </p>
    <p>
      <span style="font-weight: bold; font-size: 16px">transaction_time: </span>
      {{ detail.transaction_time }}
    </p>
    <p>
      <span style="font-weight: bold; font-size: 16px">transaction_hash: </span>
      {{ detail.transaction_hash }}
    </p>
    <p>
      <span style="font-weight: bold; font-size: 16px">from_account_address: </span>
      <span>{{ detail.from_account_address }}</span>
    </p>

    <p>
      <span style="font-weight: bold; font-size: 16px">to_account_address: </span>
      {{ detail.to_account_address }}
    </p>
    <p>
      <span style="font-weight: bold; font-size: 16px">external_link: </span
      ><a target="_blank" :href="detail.href">{{ detail.external_link }}</a>
    </p>
  </a-modal>
</template>
<script>
import { StarOutlined, StarFilled } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import api from "@/api/module";
export default {
  components: {
    StarOutlined,
    StarFilled,
  },
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
    star(image) {
      if (image.stared) {
        api.cancelCollect(image.id).then((res) => {
          if (res.data.code === 1) {
            image.stared = false;
          } else {
            message.error(res.data.description);
          }
        });
      } else {
        api.collect(image.id).then((res) => {
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
