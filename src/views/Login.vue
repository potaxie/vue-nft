<template>
  <div class="login-container">
    <div class="top">
      <a-image src="/logo.svg" width="200px" :preview="false" />
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
          <a-input
            v-model:value="form.username"
            size="large"
            placeholder="Username"
          >
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
          <a-input
            v-model:value="form.code"
            size="large"
            placeholder="Email Code"
          >
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
        <a-form-item v-if="action === 'signup'">
          <a-input
            v-model:value="form.inviteCode"
            size="large"
            placeholder="Invite Code"
          >
            <template #prefix>
              <BulbOutlined style="color: rgba(0, 0, 0, 0.25)" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item style="text-align: left" v-if="action === 'login'">
          <a-checkbox v-model:checked="form['remember-me']"
            >Remember me</a-checkbox
          >
          <a
            style="float: right; line-height: 40px"
            href="javascript:;;"
            @click="action = 'signup'"
            >Sign up</a
          >
        </a-form-item>
        <a-form-item style="text-align: left" v-if="action === 'signup'">
          <a-checkbox
            v-model:checked="form.agree"
            @click="if (!form.agree) visibleRegistration = true;"
            >Registration Protocol</a-checkbox
          >
          <a
            style="float: right; line-height: 40px"
            href="javascript:;;"
            @click="action = 'login'"
            >Back Login</a
          >
        </a-form-item>
        <a-form-item>
          <a-button
            :disabled="loggingIn || (action === 'signup' && !form.agree)"
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
  <a-drawer
    placement="right"
    :width="600"
    v-model:visible="visibleRegistration"
  >
    <template #title>
      <h2>ginkgo使用协议</h2>
    </template>
    <a-typography>
      <a-typography-paragraph>
        本协议为ginkgo《使用协议》的修订版本，自2021年3月7日公布。
        请你务必审慎阅读、充分理解协议中相关条款内容，特别是粗体标注的内容。你一旦注册ginkgo，即视为你已了解并完全同意本协议各项内容，包括ginkgo对使用协议随时所做的任何修改。如你不同意本协议及/或随时对其的修改，请你立即停止注册及使用ginkgo所提供的全部服务。
      </a-typography-paragraph>
      <a-typography-title :level="4">1、接受条款</a-typography-title>
      <a-typography-paragraph
        >1.1
        ginkgo网的运营者及相关关联公司（以下简称“ginkgo”）根据本使用协议的条款及不时发布的规则为你提供基于ginkgo网（包括ginkgopc端、ginkgo及ginkgo相关客户端、移动网页端等）的互联网服务。本协议的条款可由ginkgo随时修改，修改后的使用协议在网站上一经公布即有效代替原来的使用协议。你一旦在ginkgo网注册，即成为ginkgo用户（以下简称“用户”或“你”），并受本协议的约束。
      </a-typography-paragraph>
      <a-typography-paragraph
        >1.2
        当你使用ginkgo网单项服务时，你和ginkgo应遵守ginkgo随时公布的与该服务相关的指引和规则。前述所有的指引和规则，均构成本使用协议的一部分。
      </a-typography-paragraph>
      <a-typography-paragraph>
        1.3
        你应遵守本协议的各项条款，合法合理使用ginkgo提供的服务，否则，ginkgo有权依据本协议中断或终止为你提供服务。同时，ginkgo保留在任何时候收回你所使用的账号的权利。
      </a-typography-paragraph>
      <a-typography-title :level="4">2、服务说明</a-typography-title>
      <a-typography-paragraph
        >2.1
        ginkgo向用户提供包括但不限于如下服务：发布并分享对图书、电影、音乐等的评论；收藏图书、电影、音乐；在ginkgo中发布话题、日记、上传图片、视频等；在同城中发布或参加各类活动；电子商务服务；付费内容服务等。除非本协议另有其它明示规定，ginkgo增加或强化目前本服务的任何新功能，包括所推出的新产品，均受本使用协议之规范。
      </a-typography-paragraph>
      <a-typography-paragraph
        >2.2
        用户了解并同意，ginkgo之服务、产品与资料仅依其当前所呈现的状况提供，而且ginkgo明确地表示拒绝对于“服务”、“资料”或“产品”等给予任何明示或暗示之担保或保证，包括但不限于，为商业使用、适合于特定目的或未侵害他人权利之担保或保证等。ginkgo对于因“服务”、
        “产品”或“资料”等所产生之任何直接、间接、附带的或因此而导致之衍生性损失概不负责。ginkgo对于任何用户信息或个性化设定之时效、删除、传递错误、未予储存或其它任何问题，均不承担任何责任。
      </a-typography-paragraph>
      <a-typography-paragraph
        >2.3
        你同意ginkgo有权制订关于使用本服务的一般措施及限制，包括但不限于本服务将保留所发布内容或其它发布内容之最长期间，以及一定期间内你使用本服务之次数上限（及/或每次使用时间之上限）。通过本服务发布或传送之任何信息、通讯资料和其它内容，如被删除或未予储存，你同意ginkgo无须承担任何责任。你也同意，ginkgo有权依其自行之考虑，不论通知与否，随时变更这些一般措施及限制。
      </a-typography-paragraph>
      <a-typography-title :level="4">3、你的注册义务</a-typography-title>
      <a-typography-paragraph
        >3.1
        为了能使用本服务，按照中国法律的要求，你同意以下事项：依本服务注册提示填写你正确的注册邮箱、密码、名号、手机号码等信息，并确保今后更新的登录邮箱、名号、头像及手机号码等资料的真实性、有效性和合法性。若你提供任何违法、不道德或ginkgo认为不适合在ginkgo网上展示的资料；或者ginkgo有理由怀疑你的行为属于程序或恶意操作，ginkgo有权无须事先通知即可暂停或终止你使用账号，并拒绝你于现在和未来使用本服务之全部或任何部分。
      </a-typography-paragraph>
      <a-typography-paragraph
        >3.2
        ginkgo无须对你（任何用户）的任何注册或登记资料承担任何责任，包括但不限于鉴别、核实任何注册或登记资料的真实性、正确性、完整性、适用性及/或是否为最新资料的责任。
      </a-typography-paragraph>
    </a-typography>
  </a-drawer>
</template>
<script>
import api from "@/api/user";
import {
  UserOutlined,
  LockOutlined,
  NotificationOutlined,
  SendOutlined,
  BulbOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { mapActions } from "vuex";
export default {
  components: {
    UserOutlined,
    LockOutlined,
    NotificationOutlined,
    SendOutlined,
    BulbOutlined,
  },
  data() {
    return {
      loggingIn: false,
      visibleRegistration: false,
      action: "login",
      registrationProtocol: "",
      form: {
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        code: "",
        inviteCode: "None",
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
        if (!this.form.username || !this.form.password) {
          message.warn("username password is required!");
          this.loggingIn = false;
          return;
        }
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
          .signup(
            this.form.username,
            this.form.password,
            this.form.email,
            this.form.code
          )
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
  background: #ffffff url(../assets/background.svg) no-repeat 50%;
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
    margin-left: 10px;
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
