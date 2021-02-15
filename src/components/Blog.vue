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
      <a-form
        ref="form"
        :model="form"
        :rules="rules"
        :label-col="{ span: 2 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-form-item label="Title" name="title">
          <a-input v-model:value="form.title" />
        </a-form-item>
        <a-form-item label="Cover"
          ><a-upload
            v-model:fileList="fileList"
            name="file"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            action="/app/file/upload"
            @change="handleCoverChange"
            ><a-avatar
              v-if="form.cover"
              :src="'/app/file/get/' + form.cover"
              shape="square"
              :size="100"
            />
            <div v-else>
              <loading-outlined v-if="loading" /><plus-outlined v-else />
              <div class="ant-upload-text">Upload</div>
            </div></a-upload
          ></a-form-item
        >
      </a-form>
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
    <a-modal
      :title="viewArticle ? viewArticle.title : ''"
      width="calc(80vw)"
      :footer="null"
      centered
      v-model:visible="showViewModal"
    >
      <v-md-editor
        v-if="viewArticle"
        v-model="viewArticle.content"
        mode="preview"
      ></v-md-editor>
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
      <!-- <v-md-editor v-model="article.content" mode="preview"></v-md-editor> -->
      <div
        @click="
          viewArticle = article;
          showViewModal = true;
        "
        style="cursor: pointer"
      >
        <div class="article-title">{{ article.title }}</div>
        <div class="article-cover">
          <a-image
            :width="'70%'"
            :src="'/app/file/get/' + article.cover"
            :preview="false"
            v-if="article.cover"
          />
        </div>
      </div>
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
  PlusOutlined,
  LoadingOutlined,
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
    PlusOutlined,
    LoadingOutlined,
  },
  data() {
    return {
      showWrite: false,
      showViewModal: false,
      data: [],
      moment,
      comments: [],
      rules: {
        title: [{ required: true, message: "Title not empty", trigger: "blur" }],
      },
      fileList: [],
      loading: false,
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
    handleCoverChange(info) {
      if (info.file.status === "uploading") {
        this.loading = true;
        return;
      }

      if (info.file.status === "done") {
        this.form.cover = info.file.response;
        this.loading = false;
      }
    },
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
  .article-title {
    font-size: 24px;
    color: black;
    margin-bottom: 5px;
  }
  .article-cover {
    margin-bottom: 10px;
  }
  .v-md-editor-preview {
    padding: 0;
  }
  .ant-comment-inner {
    padding: 0;
  }
}
.ant-form-item {
  margin-bottom: 0 !important;
}
.ant-modal-body {
  max-height: calc(80vh);
  overflow: scroll;
}
</style>
