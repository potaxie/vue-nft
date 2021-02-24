<template>
  <div class="nft-title">Welcome Ginkgo</div>
  <div v-for="group in groups" :key="group.name" style="margin: 12px 12%">
    <a-row
      type="flex"
      justify="space-between"
      style="margin-bottom: 20px; margin-right: 60px"
    >
      <a-col class="group-title">{{ group.name }}</a-col>
      <a-col class="group-chat" @click="openComments(group.name)"
        >Chat<DoubleRightOutlined
      /></a-col>
    </a-row>
    <a-carousel autoplay :speed="16000" :autoplaySpeed="1000">
      <a-row
        class="carousel-img"
        :gutter="50"
        type="flex"
        justify="start"
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
  <image-detail ref="image-detail" />
  <a-modal
    :title="currentGroup + ' Comments'"
    width="calc(50vw)"
    :footer="null"
    centered
    v-model:visible="showComments"
  >
    <a-row style="margin-top: 5px">
      <a-input
        :placeholder="getCurrentUser() ? '...' : 'Please login first'"
        :disabled="!getCurrentUser()"
        v-model:value="myComment"
      >
        <template #addonAfter>
          <a href="javascript:;" @click="submitComment()"><SendOutlined /></a>
        </template>
      </a-input>
    </a-row>
    <a-list
      class="comment-list"
      item-layout="horizontal"
      :data-source="comments"
    >
      <template #renderItem="{ item }">
        <a-list-item>
          <a-comment
            :author="item.author"
            :avatar="'/app/file/get/' + item.avatar"
          >
            <template #content>
              <p>
                {{ item.content }}
              </p>
            </template>
            <template #datetime>
              <a-tooltip :title="item.time">
                <span>{{
                  moment(item.time, "YYYY-MM-DD hh:mm:ss").fromNow()
                }}</span>
              </a-tooltip>
            </template>
          </a-comment>
        </a-list-item>
      </template>
    </a-list>
  </a-modal>
</template>

<script>
import ImageDetail from "@/components/ImageDetail";
import { DoubleRightOutlined, SendOutlined } from "@ant-design/icons-vue";
import { mapGetters } from "vuex";
import { message } from "ant-design-vue";
import api from "@/api/module";
import moment from "moment";
export default {
  components: {
    ImageDetail,
    DoubleRightOutlined,
    SendOutlined,
  },
  data() {
    return {
      groups: [],
      currentGroup: "",
      showComments: false,
      comments: [],
      myComment: "",
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
    openComments(groupName) {
      this.currentGroup = groupName;
      // this.currentGroup 0012
      api.comments(this.currentGroup).then((res) => {
        this.myComment = "";
        this.comments = res.data;
        this.showComments = true;
      });
    },
    submitComment() {
      if (!this.myComment) {
        return;
      }
      // this.currentGroup
      api.submitComment(this.currentGroup, this.myComment).then((res) => {
        if (res.data.code === 1) {
          message.success("submit success");
          this.myComment = "";
          api.comments(this.currentGroup).then((res1) => {
            this.comments = res1.data;
          });
        } else {
          message.error(res.data.description);
        }
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
  margin-top: 10px;
  margin-bottom: 35px;
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
}
</style>
