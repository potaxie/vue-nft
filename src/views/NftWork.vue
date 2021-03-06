<template>
  <a-layout class="layout admin-layout">
    <main-header />
    <a-layout-content>
      <div class="nft-title">Welcome to the NFT valley!</div>
      <div style="margin: 10px 12%">
        <div v-for="group in groups" :key="group.name">
          <a-row type="flex" justify="space-between" style="margin: 0 25px 10px 20px">
            <a-col class="group-title">{{ group.name }}</a-col>
            <a-col class="group-chat" @click="goForum(group.name)"
              >贴吧<DoubleRightOutlined
            /></a-col>
          </a-row>
          <a-carousel arrows :speed="1600">
            <template #prevArrow>
              <div class="custom-slick-arrow" style="left: -25px">
                <LeftOutlined />
              </div>
            </template>
            <template #nextArrow>
              <div class="custom-slick-arrow" style="right: -25px">
                <RightOutlined />
              </div>
            </template>
            <a-row
              class="carousel-img"
              :gutter="40"
              type="flex"
              justify="space-around"
              v-for="i in Math.ceil(group.images.length / 4)"
              :key="i"
            >
              <a-col
                :span="6"
                v-for="image in group.images.slice((i - 1) * 4, i * 4)"
                :key="image.id"
              >
                <a-card>
                  <template #cover>
                    <img
                      :src="'/app/file/get/' + image.id + '?flag=tumbnail'"
                      height="280"
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
          </a-carousel>
        </div>
      </div>
      <image-detail ref="image-detail" />
    </a-layout-content>
    <main-footer />
  </a-layout>
</template>

<script>
import ImageDetail from "@/components/ImageDetail";
import MainHeader from "@/components/MainHeader";
import MainFooter from "@/components/MainFooter";
import { DoubleRightOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons-vue";
import { mapGetters } from "vuex";
import api from "@/api/module";
import moment from "moment";
export default {
  components: {
    ImageDetail,
    MainHeader,
    MainFooter,
    DoubleRightOutlined,
    LeftOutlined,
    RightOutlined,
  },
  data() {
    return {
      groups: [],
      currentGroup: "",
      moment,
    };
  },
  computed: {
    ...mapGetters(["getCurrentUser"]),
  },
  methods: {
    handleImage(image) {
      api.imageDetail(image.id).then((res) => {
        let imageDetail = this.$refs["image-detail"];
        imageDetail.detail = res.data;
        imageDetail.showDetail = true;
      });
    },
    goForum(name) {
      location.href = "/#/forum?label=" + name;
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
  margin-top: 10px;
  margin-bottom: 10px;
}
.group-title {
  font-size: 32px;
  font-family: Roboto, -apple-system, BlinkMacSystemFont, Arial, sans-serif;
  font-weight: bold;
  color: #3291e6;
  margin-top: 20px;
}
.group-chat {
  font-size: 16px;
  top: 20px;
  font-weight: bold;
  margin-top: 20px;
}
.group-chat:hover {
  font-size: 16px;
  top: 20px;
  font-weight: bold;
  color: #3291e6;
  cursor: pointer;
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
  border: 3px solid #17a2b8;
}
.carousel-img {
  display: flex !important;
  margin-left: 0 !important;
}
.custom-slick-arrow {
  font-size: 30px !important;
  color: #afafca !important;
}
.ant-carousel .slick-prev::before {
  content: "" !important;
}
.ant-carousel .slick-next::before {
  content: "" !important;
}
</style>
