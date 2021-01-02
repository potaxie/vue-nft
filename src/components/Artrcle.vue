<template>
  <a-card title="Startpagina" style="text-align: left;margin-bottom: 20px">
    <a-form
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="{ span: 0 }"
      :wrapper-col="{ span: 24 }"
    >
      <a-form-item>
        <a-textarea
          v-model:value="form.content"
          placeholder="有什么新鲜事想告诉大家?"
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
          <a-button> <upload-outlined /> upload </a-button>
        </a-upload>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="onSubmit">
          Submit
        </a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>
<script>
import { UploadOutlined } from "@ant-design/icons-vue";
import api from "@/api/artrcle";

export default {
  components: {
    UploadOutlined,
  },
  data() {
    return {
      form: {},
      fileList: [],
    };
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
      const files = this.fileList.map((f) => f.response);
      this.form.files = files;
      api.submit({ ...this.form }).then((res) => {
        console.log(res);
      });
    },
  },
  mounted() {},
};
</script>
<style scoped>
/* tile uploaded pictures */
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
</style>
