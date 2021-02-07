<template>
  <div class="blog">
    <a-modal
      title="Write blog"
      okText="Submit"
      width="calc(80vw)"
      centered
      v-model:visible="showWrite"
      @ok="submitBlog"
    >
      <v-md-editor
        v-model="form.content"
        height="500px"
        left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table horizontal | link customImage code"
        right-toolbar="preview toc fullscreen"
        :toolbar="toolbar"
        :disabled-menus="[]"
        @upload-image="handleUploadImage"
      />
    </a-modal>
    <div class="write-blog">
      <a-button size="large" type="link" @click="writeBlog">
        Write your blog...
      </a-button>
    </div>
    <a-card v-for="article in data" :key="article.id" style="text-align: left">
      <a-row type="flex" justify="space-between" align="bottom">
        <a-col>
          <a-space>
            <a-avatar
              v-if="article.head_avatar"
              :src="'/app/file/get/' + article.head_avatar"
              :size="30"
            />
            <a-avatar v-else :size="30">
              <template #icon><UserOutlined /></template>
            </a-avatar>
            <span style="font-weight: bold; font-size: 25px">{{ article.username }}</span>
          </a-space>
        </a-col>
        <a-col>{{ article.time }}</a-col>
      </a-row>
      <v-md-editor v-model="article.content" mode="preview"></v-md-editor>
      <a-row :gutter="16">
        <a-col :span="2">
          <a href="javascript:;" @click="openComments(article)"
            ><MessageOutlined :style="{ fontSize: '20px' }" />
            {{ article.commentNumber }}
          </a>
        </a-col>
        <a-col :span="2">
          <a href="javascript:;" @click="like(article)">
            <LikeFilled
              v-if="article.liked"
              :style="{ fontSize: '20px', color: '#52c41a' }"
            />
            <LikeOutlined v-else :style="{ fontSize: '20px' }" />
            {{ article.likeNumber }}
          </a>
        </a-col>
      </a-row>
      <div v-if="article.opened">
        <a-row style="margin-top: 5px">
          <a-input
            :placeholder="getCurrentUser() ? '...' : 'Please login first'"
            :disabled="!getCurrentUser()"
            v-model:value="article.myComment"
          >
            <template #addonAfter>
              <a href="javascript:;" @click="submitComment(article)"><SendOutlined /></a>
            </template>
          </a-input>
        </a-row>
        <a-list
          class="comment-list"
          item-layout="horizontal"
          :data-source="article.comments"
        >
          <template #renderItem="{ item }">
            <a-list-item>
              <a-comment :author="item.author" :avatar="'/app/file/get/' + item.avatar">
                <template #content>
                  <p>
                    {{ item.content }}
                  </p>
                </template>
                <template #datetime>
                  <a-tooltip :title="item.time">
                    <span>{{ moment(item.time, "yyyy-MM-dd HH:mm:ss").fromNow() }}</span>
                  </a-tooltip>
                </template>
              </a-comment>
            </a-list-item>
          </template>
        </a-list>
      </div>
    </a-card>
  </div>
</template>
<script>
import {
  UserOutlined,
  LikeOutlined,
  MessageOutlined,
  SendOutlined,
  LikeFilled,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import api from "@/api/module";
import { mapGetters } from "vuex";
import moment from "moment";
import axios from "axios";
import { image } from "@kangc/v-md-editor/lib/utils/constants/command";
import { filesFilter } from "@kangc/v-md-editor/lib/utils/file";

export default {
  components: {
    UserOutlined,
    LikeOutlined,
    MessageOutlined,
    SendOutlined,
    LikeFilled,
  },
  data() {
    return {
      showWrite: false,
      data: [],
      moment,
      comments: [],
      form: {},
      toolbar: {
        customImage: {
          title: "Insert Image",
          icon: "v-md-icon-img",
          action(editor) {
            editor.$nextTick(async () => {
              const event = await editor.$refs.uploadFile.upload();
              const files = filesFilter(event.target.files, editor.uploadImgConfig);
              if (editor.hasUploadImage && files.length) {
                event.preventDefault();
                editor.$emit(
                  "upload-image",
                  event,
                  function (imageRef) {
                    editor.execCommand(image, imageRef);
                  },
                  files
                );
              }
            });
          },
        },
      },
    };
  },
  computed: {
    ...mapGetters(["getCurrentUser"]),
  },
  methods: {
    writeBlog() {
      if (!this.getCurrentUser()) {
        message.warn("Please login...");
      } else {
        this.showWrite = true;
      }
    },
    handleUploadImage(event, insertImage, files) {
      let param = new FormData();
      param.append("file", files[0]);
      let config = {
        headers: { "Content-Type": "multipart/form-data" },
      };
      axios.post("/app/file/upload", param, config).then((response) => {
        insertImage({
          url: "/app/file/get/" + response.data,
          desc: "image",
          width: "500",
          height: "auto",
        });
      });
    },
    submitBlog() {
      api.submit({ ...this.form }).then((res) => {
        if (res.data.code === 1) {
          this.form = {};
          message.success("success");
          this.showWrite = false;
          this.list();
        } else {
          message.error(res.data.description);
        }
      });
    },
    list() {
      api.list().then((res) => {
        this.data = res.data;
      });
    },
    like(item) {
      if (item.liked) {
        api.unlike(item.id).then((res) => {
          if (res.data.code === 1) {
            item.likeNumber -= 1;
            item.liked = false;
          } else {
            message.error(res.data.description);
          }
        });
      } else {
        api.like(item.id).then((res) => {
          if (res.data.code === 1) {
            item.likeNumber += 1;
            item.liked = true;
          } else {
            message.error(res.data.description);
          }
        });
      }
    },
    openComments(item) {
      if (item.opened) {
        item.opened = false;
        item.comments = [];
      } else {
        api.comments(item.id).then((res) => {
          item.myComment = "";
          item.comments = res.data;
          item.opened = true;
        });
      }
    },
    submitComment(item) {
      if (!item.myComment) {
        return;
      }
      api.submitComment(item.id, item.myComment).then((res) => {
        if (res.data.code === 1) {
          message.success("submit success");
          item.myComment = "";
          api.comments(item.id).then((res1) => {
            item.comments = res1.data;
          });
        } else {
          message.error(res.data.description);
        }
      });
    },
  },
  mounted() {
    this.list();
  },
};
</script>
<style lang="less">
.blog {
  padding-left: 25%;
  padding-right: 25%;
  min-width: 500px;
  .write-blog {
    text-align: left;
    .ant-btn-lg {
      padding: 0 0 15px 0;
      font-weight: bolder;
    }
  }
  .v-md-editor-preview {
    padding: 0;
  }
  .ant-comment-inner {
    padding: 0;
  }
}
</style>
