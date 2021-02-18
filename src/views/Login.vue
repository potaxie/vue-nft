<template>
  <div class="login-container">
    <div class="top">
      <a-image src="/favicon1.ico" width="200px" />
    </div>
    <div class="desc">
      <span> </span>
    </div>
    <div class="main">
      <a-form
        :model="form"
        :label-col="{ span: 0 }"
        :wrapper-col="{ span: 24 }"
        @submit="handleSubmit"
        @submit.prevent
      >
        <a-form-item>
          <a-input v-model:value="form.username" size="large" placeholder="Username">
            <template #prefix>
              <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item v-if="action === 'signup'">
          <a-input-search
            v-model:value="form.email"
            placeholder="Email"
            size="large"
            @search="sendEmail"
          >
            <template #prefix>
              <SendOutlined style="color: rgba(0, 0, 0, 0.25)" />
            </template>
            <template #enterButton>
              <a-button>Send</a-button>
            </template>
          </a-input-search>
        </a-form-item>
        <a-form-item v-if="action === 'signup'">
          <a-input v-model:value="form.code" size="large" placeholder="Email Code">
            <template #prefix>
              <NotificationOutlined style="color: rgba(0, 0, 0, 0.25)" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input-password
            v-model:value="form.password"
            size="large"
            placeholder="Password"
          >
            <template #prefix>
              <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item v-if="action === 'signup'">
          <a-input-password
            v-model:value="form.confirmPassword"
            size="large"
            placeholder="Confirm Password"
          >
            <template #prefix>
              <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item style="text-align: left" v-if="action === 'login'">
          <a-checkbox v-model:checked="form['remember-me']">Remember me</a-checkbox>
          <a
            style="float: right; line-height: 40px"
            href="javascript:;;"
            @click="action = 'signup'"
            >Sign up</a
          >
        </a-form-item>
        <a-form-item style="text-align: left" v-if="action === 'signup'">
          <a
            style="float: right; line-height: 40px"
            href="javascript:;;"
            @click="action = 'login'"
            >Back Login</a
          >
        </a-form-item>
        <a-form-item>
          <a-button
            :disabled="loggingIn"
            class="login-button"
            type="primary"
            html-type="submit"
            size="large"
            >{{ action === "login" ? "Login" : "Create Account" }}</a-button
          >
        </a-form-item>
      </a-form>
    </div>
    <div class="copyright">Copyright © 2020 Ginkgo</div>
  </div>
</template>
<script>
import api from "@/api/user";
import {
  UserOutlined,
  LockOutlined,
  NotificationOutlined,
  SendOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { mapActions } from "vuex";
export default {
  components: {
    UserOutlined,
    LockOutlined,
    NotificationOutlined,
    SendOutlined,
  },
  data() {
    return {
      loggingIn: false,
      action: "login",
      form: {
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        code: "",
      },
    };
  },
  methods: {
    ...mapActions(["setCurrentUser"]),
    sendEmail() {
      if (this.form.email) {
        api.verifyEmail(this.form.email).then((res) => {
          console.log(res);
          if (res.data.code === 1) {
            message.success("Send email code success");
          } else {
            message.error(res.data.description);
          }
        });
      }
    },
    handleSubmit() {
      this.loggingIn = true;
      if (this.action === "login") {
        api.login(this.form.username, this.form.password).then((res) => {
          this.loggingIn = false;
          if (res.data.code === 1) {
            this.setCurrentUser(res.data.user);
            location.href = "/#/";
          } else {
            message.error(res.data.description);
          }
        });
      } else if (this.form.password !== this.form.confirmPassword) {
        this.loggingIn = false;
        message.error("Please confirm password!");
      } else if (
        !this.form.username ||
        !this.form.password ||
        !this.form.email ||
        !this.form.code
      ) {
        this.loggingIn = false;
        message.error("Please complate information!");
      } else {
        api
          .signup(this.form.username, this.form.password, this.form.email, this.form.code)
          .then((res) => {
            this.loggingIn = false;
            if (res.data.code === 1) {
              message.success("Create account success.");
              this.action = "login";
            } else {
              message.error(res.data.description);
            }
          });
      }
    },
  },
  mounted() {},
};
</script>
<style lang="less">
.login-container {
  .ant-form-item {
    margin-bottom: 15px !important;
  }
  width: 100%;
  min-height: 100%;
  background: #f0f2f5 url(../assets/background.svg) no-repeat 50%;
  background-size: 100%;
  position: relative;
  padding: 150px 0;
  .top {
    line-height: 50px;
    .title {
      font-size: 33px;
      color: rgba(0, 0, 0, 0.85);
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      font-weight: 600;
      position: relative;
      top: 8px;
      margin-left: 10px;
    }
  }
  .desc {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.45);
    margin-top: 12px;
    margin-bottom: 40px;
  }
  .main {
    min-width: 260px;
    width: 368px;
    margin: 0 auto;
    .login-button {
      width: 100%;
    }
  }
  .copyright {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
  }
}
</style>
