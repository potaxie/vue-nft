<template>
  <a-modal
    title="Information"
    :width="500"
    centered
    v-model:visible="showDetail"
    :footer="null"
    style="font-size: 10px"
    wrapClassName="information"
  >
    <div class="nft-image-detail" v-if="detail">
      <a-image :width="450" :src="'/app/file/get/' + detail.id" />
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
            <a target="_blank" :href="detail.external_link">{{
              detail.external_link
            }}</a>
          </div>
        </a-tooltip>
      </div>
    </div>
  </a-modal>
</template>
<script>
export default {
  data() {
    return {
      showDetail: false,
      detail: null,
    };
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
