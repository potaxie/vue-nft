<template>
  <a-layout class="layout admin-layout">
    <main-header />
    <a-layout-content>
      <div class="forum">
        <div style="font-size: 16px; margin-bottom: 10px">
          <a href="javascript:void(0)" @click="writeForum"><EditOutlined /> 发布</a>
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
    title="Submit Forum"
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

const columns = [
  {
    title: "阅读",
    dataIndex: "read",
    width: 100,
  },
  {
    title: "评论",
    dataIndex: "comment",
    width: 100,
  },
  {
    title: "标题",
    dataIndex: "title",
    ellipsis: true,
    slots: {
      customRender: "Title",
    },
  },
  {
    title: "作者",
    dataIndex: "author",
    width: 100,
  },
  {
    title: "时间",
    dataIndex: "lastModify",
    width: 200,
  },
];
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
      columns,
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
    labelName() {
      return this.$route.query.label;
    },
  },
  watch: {
    labelName() {
      this.search();
    },
  },
  methods: {
    search() {
      api
        .searchForum(this.labelName, this.pagination.current, this.pagination.pageSize)
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
      api.submitForum({ ...this.form }).then((res) => {
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
      this.search();
    }
  },
};
</script>
<style lang="less">
.forum {
  padding: 0 20%;
  text-align: left;
}
</style>
