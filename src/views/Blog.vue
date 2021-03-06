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
        <div
          class="write-blog"
          v-if="getCurrentUser() && getCurrentUser().username === 'potaxie'"
        >
          <a-button size="large" type="link" @click="writeBlog">
            <template #icon><EditOutlined /></template>
            发布
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
                <span>
                  阅读
                  {{ item.readNumber }}
                </span>
                <span>
                  评论
                  {{ item.commentNumber }}
                </span>
                <span>
                  点赞
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
              <div class="blog-title" @click="goBlogContent(item.id)">
                {{ item.title }}
              </div>
            </a-list-item>
          </template>
        </a-list>
      </div>
    </a-layout-content>
    <main-footer />
  </a-layout>
</template>
<script>
import {
  UserOutlined,
  PlusOutlined,
  LoadingOutlined,
  EditOutlined,
} from "@ant-design/icons-vue";
import MainHeader from "@/components/MainHeader";
import MainFooter from "@/components/MainFooter";
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
    MainFooter,
    UserOutlined,
    PlusOutlined,
    LoadingOutlined,
    EditOutlined,
  },
  data() {
    return {
      showWrite: false,
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
    goBlogContent(id) {
      location.href = "/#/blog-content?id=" + id;
    },
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
    color: #0767c8;
    text-decoration: underline;
  }
}
.ant-form-item {
  margin-bottom: 0 !important;
}
</style>
