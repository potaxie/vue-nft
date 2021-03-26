<template>
  <a-layout-footer>
    <a-row style="text-align: center; font-weight: bolder">
      <a-col :span="2"
        ><a href="/#/about-us?active=about">{{ $t("about-us") }}</a></a-col
      >
      <a-col :span="2"
        ><a href="/#/about-us?active=link">{{ $t("link-us") }}</a></a-col
      >
      <a-col :span="2"
        ><a href="/#/about-us?active=join">{{ $t("join-us") }}</a></a-col
      >
      <a-col :span="2">
        <a-popover v-model:visible="showFeedback" trigger="click">
          <template #content>
            <a-textarea
              style="width: 350px"
              v-model:value="feedback"
              :auto-size="{ minRows: 2, maxRows: 5 }"
            />
            <a-row type="flex" justify="end">
              <a-col>
                <a-button type="link" style="padding: 7px 0 0 0" @click="submit"
                  >Submit</a-button
                >
              </a-col>
            </a-row>
          </template>
          <a href="javascript:;;"> {{ $t("feedback") }} </a>
        </a-popover>
      </a-col>
      <a-col :span="10">ginkgonft.com ©2021 Created by ginkgo </a-col>
      <a-col :span="2"
        ><a href="/#/about-us?active=legal">{{ $t("legal") }}</a></a-col
      >
      <a-col :span="2"
        ><a href="/#/about-us?active=copyright">{{ $t("copyright") }}</a></a-col
      >
      <a-col :span="2"
        ><a href="/#/about-us?active=privacy">{{ $t("privacy") }}</a></a-col
      >
    </a-row>
  </a-layout-footer>
</template>
<script>
import { mapGetters } from "vuex";
import api from "@/api/user";
import { message } from "ant-design-vue";
export default {
  data() {
    return {
      showFeedback: false,
      feedback: "",
    };
  },
  computed: {
    ...mapGetters(["getCurrentUser"]),
  },
  methods: {
    submit() {
      api.submitFeedback({ feedback: this.feedback }).then((res) => {
        if (res.data.code === 1) {
          this.feedback = "";
          this.showFeedback = false;
          message.success("submit success");
        } else {
          message.error(res.data.description);
        }
      });
    },
  },
};
</script>
