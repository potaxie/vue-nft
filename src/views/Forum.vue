<template>
  <a-layout class="layout admin-layout">
    <main-header />
    <a-layout-content>
      <div class="forum">
        <div v-if="labelDetail" class="forum-cover">
          <a-image
            :height="150"
            width="780px"
            :preview="false"
            :src="`/app/file/get/${labelDetail.logo}`"
          />
          <div style="margin-top: 15px">
            <span style="font-size: 35px; font-weight: bolder">{{
              labelDetail.title
            }}</span>
            <span style="margin-left: 25px; color: grey"
              >{{ $t("tiezi") }}：{{ labelDetail.forum_num }}</span
            >
          </div>
          <span style="color: grey">{{ labelDetail.description }}</span>
        </div>
        <div style="font-size: 16px; font-weight: bolder;margin-bottom: 10px">
          <a href="javascript:void(0)" @click="writeForum"
            ><EditOutlined /> {{ $t("submit") }}</a
          >
        </div>
        <a-table
          :columns="columns"
          :data-source="data"
          :pagination="pagination"
          class="ant-table-striped"
          rowKey="id"
          size="middle"
        >
          <template #Title="{ record }">
            <a :href="`/#/forum-content?id=${record.id}`">{{ record.title }}</a>
          </template>
        </a-table>
      </div>
    </a-layout-content>
    <main-footer />
  </a-layout>
  <a-modal
    :title="$t('submit-forum')"
    okText="Submit"
    width="calc(80vw)"
    centered
    v-model:visible="showWrite"
    @ok="submitForum"
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
      <v-md-editor
        v-model="form.content"
        height="500px"
        left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table horizontal | link customImage code"
        right-toolbar="preview toc fullscreen"
        :toolbar="toolbar"
        :disabled-menus="[]"
        @upload-image="handleUploadImage"
      />
    </a-form>
  </a-modal>
</template>
<script>
import { EditOutlined } from "@ant-design/icons-vue";
import MainHeader from "@/components/MainHeader";
import MainFooter from "@/components/MainFooter";
import { image } from "@kangc/v-md-editor/lib/utils/constants/command";
import { filesFilter } from "@kangc/v-md-editor/lib/utils/file";
import { message } from "ant-design-vue";
import { mapGetters } from "vuex";
import api from "@/api/module";
import axios from "axios";

export default {
  components: {
    MainHeader,
    MainFooter,
    EditOutlined,
  },
  data() {
    return {
      activeKey: "all",
      data: [],
      labelDetail: null,
      columns: [
        {
          title: "Read",
          dataIndex: "read",
          width: 100,
        },
        {
          title: "Comment",
          dataIndex: "comment",
          width: 100,
        },
        {
          title: "Title",
          dataIndex: "title",
          ellipsis: true,
          slots: {
            customRender: "Title",
          },
        },
        {
          title: "Author",
          dataIndex: "author",
          width: 100,
        },
        {
          title: "Time",
          dataIndex: "lastModify",
          width: 200,
        },
      ],
      pagination: {
        onChange: (page) => {
          this.pagination.current = page;
          this.search();
        },
        total: 0,
        current: 1,
        pageSize: 10,
      },
      showWrite: false,
      form: {},
      toolbar: {
        customImage: {
          title: "Insert Image",
          icon: "v-md-icon-img",
          action(editor) {
            editor.$nextTick(async () => {
              const event = await editor.$refs.uploadFile.upload();
              const files = filesFilter(
                event.target.files,
                editor.uploadImgConfig
              );
              if (editor.hasUploadImage && files.length) {
                event.preventDefault();
                editor.$emit(
                  "upload-image",
                  event,
                  function(imageRef) {
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
    labelName() {
      return this.$route.query.label;
    },
  },
  watch: {
    labelName() {
      this.getForumTitle();
      this.search();
    },
  },
  methods: {
    getForumTitle() {
      api.getForumTitle(this.labelName).then((res) => {
        this.labelDetail = res.data;
      });
    },
    search() {
      api
        .searchForum(
          this.labelName,
          this.pagination.current,
          this.pagination.pageSize
        )
        .then((res) => {
          this.pagination.total = res.data.total;
          this.data = res.data.result_list;
        });
    },
    writeForum() {
      if (!this.getCurrentUser()) {
        message.warn("请先登录...");
      } else {
        this.showWrite = true;
      }
    },
    submitForum() {
      let data = { ...this.form };
      data.label = this.labelName;
      api.submitForum(data).then((res) => {
        if (res.data.code === 1) {
          this.form = {};
          message.success("发布成功");
          this.showWrite = false;
          this.search();
        } else {
          message.error(res.data.description);
        }
      });
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
  },
  created() {
    if (this.labelName) {
      this.getForumTitle();
      this.search();
    }
  },
};
</script>
<style lang="less">
.forum {
  width: 780px;
  margin: 0 auto;
  text-align: left;
  .forum-cover {
    margin-bottom: 20px;
    .ant-image-img {
      height: 100%;
    }
  }
}
</style>
