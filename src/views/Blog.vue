<template>
  <a-layout class="layout admin-layout">
    <main-header />
    <a-layout-content>
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
            :model="form"
            :rules="rules"
            :label-col="{ span: 0 }"
            :wrapper-col="{ span: 24 }"
          >
            <a-form-item name="title">
              <a-input v-model:value="form.title" placeholder="Title" />
            </a-form-item>
            <a-form-item name="cover"
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
          :title="article ? article.title : ''"
          width="calc(80vw)"
          :footer="null"
          centered
          v-model:visible="showViewModal"
        >
          <v-md-editor
            v-if="article"
            v-model="article.content"
            mode="preview"
          ></v-md-editor>
        </a-modal>

        <div class="write-blog">
          <a-button size="large" type="link" @click="writeBlog">
            Write your paper...
          </a-button>
        </div>

        <a-list
          item-layout="vertical"
          size="large"
          :pagination="pagination"
          :data-source="data"
        >
          <template #renderItem="{ item }">
            <a-list-item key="item.title">
              <template #actions>
                <span @click="openComments(item)">
                  <message-outlined :style="{ fontSize: '20px' }" key="comments" />
                  {{ item.commentNumber }}
                </span>
                <span @click="like(item)">
                  <like-filled
                    v-if="item.liked"
                    :style="{ fontSize: '20px', color: '#52c41a' }"
                  />
                  <like-outlined v-else :style="{ fontSize: '20px' }" />
                  {{ item.likeNumber }}
                </span>
              </template>
              <template #extra>
                <img
                  width="280"
                  height="155"
                  alt="cover"
                  :src="'/app/file/get/' + item.cover + '?flag=tumbnail'"
                />
              </template>
              <a-list-item-meta
                :description="moment(item.time, 'YYYY-MM-DD hh:mm:ss').fromNow()"
              >
                <template #title>
                  {{ item.username }}
                </template>
                <template #avatar>
                  <a-avatar
                    v-if="item.head_avatar"
                    :src="'/app/file/get/' + item.head_avatar"
                  />
                  <a-avatar v-else>
                    <template #icon><UserOutlined /></template>
                  </a-avatar>
                </template>
              </a-list-item-meta>
              <div
                class="blog-title"
                @click="
                  article = item;
                  showViewModal = true;
                "
              >
                {{ item.title }}
              </div>
            </a-list-item>
          </template>
        </a-list>

        <a-modal
          title="comments"
          width="calc(50vw)"
          :footer="null"
          centered
          v-model:visible="showComments"
        >
          <div v-if="article">
            <a-row style="margin-top: 5px">
              <a-input
                :placeholder="getCurrentUser() ? '...' : 'Please login first'"
                :disabled="!getCurrentUser()"
                v-model:value="article.myComment"
                @pressEnter="submitComment(article)"
              >
                <template #addonAfter>
                  <a href="javascript:;" @click="submitComment(article)"
                    ><SendOutlined
                  /></a>
                </template>
              </a-input>
            </a-row>
            <a-list class="comment-list" item-layout="horizontal" :data-source="comments">
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
          </div>
        </a-modal>
      </div>
    </a-layout-content>
    <a-layout-footer>Ginkgo Nft ©2020 Created by ginkgo </a-layout-footer>
  </a-layout>
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
import MainHeader from "@/components/MainHeader";
import { message } from "ant-design-vue";
import api from "@/api/module";
import { mapGetters } from "vuex";
import moment from "moment";
import axios from "axios";
import { image } from "@kangc/v-md-editor/lib/utils/constants/command";
import { filesFilter } from "@kangc/v-md-editor/lib/utils/file";

export default {
  components: {
    MainHeader,
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
      showComments: false,
      data: [],
      pagination: {
        onChange: (page) => {
          this.pagination.current = page;
          this.list();
        },
        total: 0,
        current: 1,
        pageSize: 5,
      },
      article: null,
      moment,
      comments: [],
      rules: {
        title: [{ required: true, message: "Title is empty", trigger: "blur" }],
        cover: [{ required: true, message: "Cover is empty" }],
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
      api.list(this.pagination.current, this.pagination.pageSize).then((res) => {
        this.pagination.total = res.data.total;
        this.data = res.data.blog_list;
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
      this.article = item;
      api.comments(item.id).then((res) => {
        item.myComment = "";
        this.comments = res.data;
        item.commentNumber = res.data.length;
        this.showComments = true;
      });
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
            this.comments = res1.data;
            item.commentNumber = res1.data.length;
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
  text-align: left;
  .write-blog {
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
  .ant-list-vertical .ant-list-item-extra {
    margin-left: 10px;
  }
  .ant-list-item-meta-title {
    font-size: 20px !important;
  }
  .ant-list-item-meta-description {
    font-size: 16px !important;
  }
  .blog-title {
    -webkit-line-clamp: 1;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    word-break: break-all;
    overflow: hidden;
    font-size: 18px;
    cursor: pointer;
  }
  .blog-title:hover {
    -webkit-line-clamp: 1;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    word-break: break-all;
    overflow: hidden;
    font-size: 18px;
    cursor: pointer;
    color: #0767c8;
    text-decoration: underline;
  }
}
.ant-form-item {
  margin-bottom: 0 !important;
}
.ant-modal-body {
  max-height: calc(80vh);
  overflow: scroll;
}
.ant-comment-inner {
  padding: 0 !important;
}
</style>
