<template>
  <a-modal
    :width="500"
    centered
    v-model:visible="showDetail"
    :footer="null"
    style="font-size: 10px"
    wrapClassName="information"
  >
    <template #title>
      Information
      <a-button
        size="small"
        shape="round"
        v-if="detail"
        @click="star()"
        style="margin-left: 5px"
      >
        <template #icon>
          <StarFilled v-if="detail.stared" />
          <StarOutlined v-else
        /></template>
        {{ detail.stared ? "Unstar" : "Star" }}
      </a-button>
    </template>
    <div class="nft-image-detail" v-if="detail">
      <a-image :width="450" :src="'/app/file/get/' + detail.id + '.png'" />
      <div class="detail-item">
        <span class="title">name: </span>
        {{ detail.name }}
      </div>
      <div class="detail-item">
        <a-tooltip>
          <template #title>
            {{ detail.description }}
          </template>
          <div class="line-clamp">
            <span class="title">description: </span>
            {{ detail.description }}
          </div>
        </a-tooltip>
      </div>
      <div class="detail-item">
        <span class="title">token_id: </span>
        {{ detail.token_id }}
      </div>
      <div class="detail-item">
        <span class="title">transaction_time: </span>
        {{ detail.transaction_time }}
      </div>
      <div class="detail-item">
        <a-tooltip>
          <template #title>
            {{ detail.transaction_hash }}
          </template>
          <div class="line-clamp">
            <span class="title">transaction_hash: </span>
            {{ detail.transaction_hash }}
          </div>
        </a-tooltip>
      </div>
      <div class="detail-item">
        <a-tooltip>
          <template #title>
            {{ detail.external_link }}
          </template>
          <div class="line-clamp">
            <span class="title">external_link: </span>
            <a target="_blank" :href="detail.external_link">{{ detail.external_link }}</a>
          </div>
        </a-tooltip>
      </div>
    </div>
  </a-modal>
</template>
<script>
import { StarOutlined, StarFilled } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { mapGetters } from "vuex";
import api from "@/api/module";
export default {
  components: {
    StarOutlined,
    StarFilled,
  },
  data() {
    return {
      showDetail: false,
      detail: null,
    };
  },
  computed: {
    ...mapGetters(["getCurrentUser"]),
  },
  methods: {
    star() {
      if (!this.getCurrentUser()) {
        message.warn("Please login...");
        return;
      }
      if (this.detail.stared) {
        api.nftWorkCancelCollect(this.detail.id).then((res) => {
          if (res.data.code === 1) {
            this.detail.stared = false;
          } else {
            message.error(res.data.description);
          }
        });
      } else {
        api.nftWorkCollect(this.detail.id).then((res) => {
          if (res.data.code === 1) {
            this.detail.stared = true;
          } else {
            message.error(res.data.description);
          }
        });
      }
    },
  },
};
</script>
<style lang="less">
.nft-image-detail {
  .detail-item {
    margin-top: 10px;
    .title {
      font-weight: bold;
      font-size: 16px;
    }
    .line-clamp {
      -webkit-line-clamp: 1;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
      word-break: break-all;
      overflow: hidden;
    }
  }
}
</style>
