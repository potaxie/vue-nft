<template>
  <a-layout class="layout admin-layout">
    <main-header />
    <a-layout-content>
      <div class="forum-content" v-if="detail">
        <a-row style="margin-bottom: 20px">
          <a-col>
            <a-avatar
              v-if="detail.authorAvatar"
              :src="`/app/file/get/tumbnail/${detail.authorAvatar}.png`"
              :size="50"
            /><a-avatar v-else :size="50"
              ><template #icon><UserOutlined /></template
            ></a-avatar>
          </a-col>
          <a-col class="avatar-title">
            <span class="forum-author">{{ detail.author }}</span
            ><br />
            <span class="forum-time">{{ $t("submit-at") }} {{ detail.submitTime }}</span>
          </a-col>
        </a-row>
        <a-card :bodyStyle="{ padding: '0' }">
          <v-md-editor
            v-if="detail"
            v-model="detail.content"
            mode="preview"
          ></v-md-editor>
        </a-card>
        <div style="text-align: center; font-size: 30px">
          <a href="javascript:;;" @click="like()">
            <like-filled v-if="detail.liked" /> <like-outlined v-else />
            <span style="font-size: 20px; margin-left: 10px"
              >{{ detail.like }}
            </span>
          </a>
        </div>
        <a-list class="comment-list" item-layout="horizontal" :data-source="comments">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-comment
                :author="item.author"
                :avatar="'/app/file/get/tumbnail/' + item.avatar + '.png'"
              >
                <template #content>
                  <p>
                    {{ item.content }}
                  </p>
                </template>
                <template #datetime>
                  <a-tooltip :title="item.time">
                    <span>{{ moment(item.time, "YYYY-MM-DD hh:mm:ss").fromNow() }}</span>
                  </a-tooltip>
                </template>
              </a-comment>
            </a-list-item>
          </template>
        </a-list>
        <a-input
          :placeholder="getCurrentUser() ? $t('submit-comment') : $t('first-login')"
          :disabled="!getCurrentUser()"
          v-model:value="myComment"
          @pressEnter="submitComment"
        >
          <template #addonAfter>
            <a href="javascript:;" @click="submitComment"><SendOutlined /></a>
          </template>
        </a-input>
      </div>
    </a-layout-content>
    <main-footer />
  </a-layout>
</template>
<script>
import {
  UserOutlined,
  SendOutlined,
  LikeOutlined,
  LikeFilled,
} from "@ant-design/icons-vue";
import MainHeader from "@/components/MainHeader";
import MainFooter from "@/components/MainFooter";
import { message } from "ant-design-vue";
import moment from "moment";
import { mapGetters } from "vuex";
import api from "@/api/module";

export default {
  components: {
    UserOutlined,
    SendOutlined,
    LikeOutlined,
    LikeFilled,
    MainHeader,
    MainFooter,
  },
  data() {
    return {
      detail: null,
      comments: [],
      myComment: "",
      moment,
    };
  },
  computed: {
    ...mapGetters(["getCurrentUser"]),
    forumId() {
      return this.$route.query.id;
    },
  },
  watch: {
    forumId() {
      this.getDetail();
    },
  },
  methods: {
    getDetail() {
      api.getForumDetail(this.forumId).then((res) => {
        this.detail = res.data;
      });
    },
    getComments() {
      api.getForumComments(this.forumId).then((res) => {
        this.comments = res.data;
      });
    },
    submitComment() {
      if (!this.myComment) {
        return;
      }
      api.submitForumComment(this.forumId, this.myComment).then((res) => {
        if (res.data.code === 1) {
          message.success("submit success");
          this.myComment = "";
          this.getComments();
        } else {
          message.error(res.data.description);
        }
      });
    },
    like() {
      if (!this.detail.liked) {
        api.starForum(this.forumId).then((res) => {
          if (res.data.code === 1) {
            this.detail.like += 1;
            this.detail.liked = true;
          } else {
            message.error(res.data.description);
          }
        });
      }
    },
  },
  created() {
    if (this.forumId) {
      this.getDetail();
      this.getComments();
    }
  },
};
</script>
<style lang="less">
.forum-content {
  padding: 20px 20%;
  text-align: left;
  .avatar-title {
    margin-left: 10px;
    line-height: 25px;
    font-family: \\5fae\8f6f\96c5\9ed1;
    .forum-author {
      color: #039;
      cursor: pointer;
      font-weight: bold;
      font-size: 20px;
    }
    .forum-time {
      color: #979797;
      font-size: 14px;
    }
  }
  .title {
    font-size: 24px;
    font-weight: 700;
    padding: 10px;
  }
}
</style>
