<template>
  <h1 style="font-weight: bold; font-size: 50px; margin-bottom: 50px">
    🌟 Welcome Art Social! 🌟
  </h1>

  <div v-for="group in groups" :key="group.name" style="margin-bottom: 30px">
    <a-row
      style="text-align: left; font-size: 32px; font-weight: bold; margin-bottom: 10px"
    >
      {{ group.name }}</a-row
    >
    <a-row type="flex" justify="space-around">
      <a-col :span="5" v-for="image in group.images" :key="image.id">
        <a-card>
          <template #cover>
            <img
              :src="'data:image/png;base64,' + image.src"
              height="260"
              @click="handleImage(image)"
            />
          </template>
          <a-card-meta :title="image.name">
            <template #description>
              <span style="font-size: 16px">{{ image.description }}</span
              ><br />
              <span style="color: green; font-size: 16px; font-weight: bold">
                ${{ image.price }}</span
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
  <a-modal v-model:visible="showDetail" :footer="null" style="font-size: 10px">
    <p>
      <span style="font-weight: bold;font-size: 16px">name: </span>
      {{ detail.name }}
    </p>
    <p>
      <span style="font-weight: bold;font-size: 16px">token_id: </span>
      {{ detail.token_id }}
    </p>
    <p>
      <span style="font-weight: bold;font-size: 16px"
        >from_account_address:
      </span>
      {{ detail.from_account_address }}
    </p>

    <p>
      <span style="font-weight: bold;font-size: 16px"
        >to_account_address:
      </span>
      {{ detail.to_account_address }}
    </p>

    <p>
      <span style="font-weight: bold;font-size: 16px">external_link: </span
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
<style>
.ant-card-meta-detail > div:not(:last-child) {
  font-size: 24px;
  font-weight: bolder;
}
</style>
