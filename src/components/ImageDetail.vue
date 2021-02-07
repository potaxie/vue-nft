<template>
  <a-modal
    title="Information"
    :width="410"
    v-model:visible="showDetail"
    :footer="null"
    style="font-size: 10px"
    wrapClassName="information"
  >
    <div v-if="detail">
      <p>
        <span style="font-weight: bold; font-size: 16px">name: </span>
        {{ detail.name }}
      </p>
      <p>
        <span style="font-weight: bold; font-size: 16px">token_id: </span>
        {{ detail.token_id }}
      </p>
      <p>
        <span style="font-weight: bold; font-size: 16px"
          >transaction_time:
        </span>
        {{ detail.transaction_time }}
      </p>
      <p>
        <span style="font-weight: bold; font-size: 16px"
          >transaction_hash:
        </span>
        {{ detail.transaction_hash }}
      </p>
      <p>
        <span style="font-weight: bold; font-size: 16px"
          >from_account_address:
        </span>
        <span>{{ detail.from_account_address }}</span>
      </p>

      <p>
        <span style="font-weight: bold; font-size: 16px"
          >to_account_address:
        </span>
        {{ detail.to_account_address }}
      </p>
      <p>
        <span style="font-weight: bold; font-size: 16px">external_link: </span>
        <a target="_blank" :href="detail.external_link">{{
          detail.external_link
        }}</a>
      </p>
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
