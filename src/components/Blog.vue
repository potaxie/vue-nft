<template>
  <div style="padding-left: 25%; padding-right: 25%">
    <a-card
      class="edit-article-card"
      title="Startpagina"
      style="text-align: left; margin-bottom: 20px"
      v-if="getCurrentUser()"
    >
      <a-form
        ref="form"
        :model="form"
        :rules="rules"
        :label-col="{ span: 0 }"
        :wrapper-col="{ span: 24 }"
      >
        <a-form-item name="content">
          <a-textarea
            v-model:value="form.content"
            placeholder="..."
            :rows="4"
          />
        </a-form-item>
        <a-form-item>
          <a-upload
            list-type="picture"
            v-model:fileList="fileList"
            :customRequest="customUpload"
            class="upload-list-inline"
          >
            <a-button shape="circle"> <FileImageOutlined /> </a-button>
          </a-upload>
          <div style="text-align: right">
            <a-button type="primary" @click="onSubmit"> Submit </a-button>
          </div>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card
      v-for="article in data"
      :key="article.id"
      style="text-align: left; margin-bottom: 10px"
    >
      <p style="font-weight: 900; font-size: 22px">
        <a-avatar
          v-if="article.head_avatar"
          :src="'/app/file/get/' + article.head_avatar"
          :size="45"
        />
        <a-avatar v-else :size="45">
          <template #icon><UserOutlined /></template>
        </a-avatar>
        {{ article.username }}
      </p>
      <p>{{ article.time }}</p>
      <p style="font-size: 15px; color: black">{{ article.content }}</p>
      <a-row type="flex" justify="space-between">
        <a-col :span="24" v-for="image in article.picture" :key="image">
          <a-image
            :width="'100%'"
            :height="350"
            :src="'/app/file/get/' + image"
          />
        </a-col>
      </a-row>
      <a-row :gutter="16" style="margin-top: 5px; margin-left: 5px">
        <a-col :span="3">
          <a href="javascript:;" @click="openComments(article)"
            ><MessageOutlined :style="{ fontSize: '20px' }"
          /></a>
          {{ article.commentNumber }}
        </a-col>
        <a-col :span="3">
          <a href="javascript:;" @click="like(article)">
            <LikeFilled
              v-if="article.liked"
              :style="{ fontSize: '20px', color: '#52c41a' }"
            />
            <LikeOutlined v-else :style="{ fontSize: '20px' }" />
          </a>
          {{ article.likeNumber }}
        </a-col>
      </a-row>
      <div v-if="article.opened">
        <a-row style="margin-top: 5px; margin-left: 5px">
          <a-input
            :placeholder="getCurrentUser() ? '...' : '登陆后评论'"
            :disabled="!getCurrentUser()"
            v-model:value="article.myComment"
          >
            <template #addonAfter>
              <a href="javascript:;" @click="submitComment(article)"
                ><SendOutlined
              /></a>
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
                      moment(item.time, "yyyy-MM-dd HH:mm:ss").fromNow()
                    }}</span>
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
  FileImageOutlined,
  UserOutlined,
  LikeOutlined,
  MessageOutlined,
  SendOutlined,
  LikeFilled,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import api from "@/api/article";
import { mapGetters } from "vuex";
import moment from "moment";

export default {
  components: {
    FileImageOutlined,
    UserOutlined,
    LikeOutlined,
    MessageOutlined,
    SendOutlined,
    LikeFilled,
  },
  data() {
    return {
      data: [],
      moment,
      comments: [],
      form: {},
      fileList: [],
      rules: {
        content: [
          { required: true, message: "Content is Empty.", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["getCurrentUser"]),
  },
  methods: {
    customUpload(e) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(e.file);
      fileReader.onload = () => {
        e.onProgress({ percent: 100 });
        e.onSuccess(fileReader.result, e.file);
      };
    },
    onSubmit() {
      this.$refs.form.validate().then(() => {
        const files = this.fileList.map((f) => f.response);
        this.form.files = files;
        api.submit({ ...this.form }).then((res) => {
          if (res.data.code === 1) {
            this.form = {};
            this.fileList = [];
            message.success("发布成功");
            this.list();
          } else {
            message.error(res.data.description);
          }
        });
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
.upload-list-inline ::v-deep(.ant-upload-list-item) {
  float: left;
  width: 200px;
  margin-right: 8px;
}
.upload-list-inline ::v-deep(.ant-upload-animate-enter) {
  animation-name: uploadAnimateInlineIn;
}
.upload-list-inline ::v-deep(.ant-upload-animate-leave) {
  animation-name: uploadAnimateInlineOut;
}
.edit-article-card {
  text-align: left;
  margin-bottom: 20px;
  .ant-card-body {
    padding: 12px 24px;
  }
  .ant-card-head {
    min-height: 30px;
    font-size: 13px;
  }
}
.ant-image-img {
  height: 100% !important;
}
.ant-form-item {
  margin-bottom: 0 !important;
}
.ant-list-item {
  padding: 0 !important;
}
.ant-comment-content-detail {
  p {
    margin-bottom: 0 !important;
  }
}
</style>
