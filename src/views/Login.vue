<template>
  <a-card
    :title="action === 'login' ? 'Sign in' : 'Create your account'"
    style="margin:10% 35%;"
  >
    <a-form
      :model="form"
      :label-col="{ span: 0 }"
      :wrapper-col="{ span: 24 }"
      @submit="handleSubmit"
      @submit.prevent
    >
      <a-form-item>
        <a-input v-model:value="form.username" placeholder="Username">
          <template #prefix
            ><UserOutlined style="color: rgba(0, 0, 0, 0.25)"
          /></template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          v-model:value="form.password"
          type="password"
          placeholder="Password"
        >
          <template #prefix
            ><LockOutlined style="color: rgba(0, 0, 0, 0.25)"
          /></template>
        </a-input>
      </a-form-item>
      <a-form-item v-if="action === 'signup'">
        <a-input
          v-model:value="form.confirmPassword"
          type="password"
          placeholder="Confirm Password"
        >
          <template #prefix
            ><LockOutlined style="color: rgba(0, 0, 0, 0.25)"
          /></template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-space v-if="action === 'login'">
          <a-button
            type="primary"
            html-type="submit"
            :disabled="form.user === '' || form.password === ''"
          >
            Sign in
          </a-button>
          <a-button @click="action = 'signup'"> Sign up </a-button>
        </a-space>
        <a-space v-else>
          <a-button
            type="primary"
            html-type="submit"
            :disabled="
              form.user === '' ||
                form.password === '' ||
                form.confirmPassword === ''
            "
          >
            Create account
          </a-button>
          <a-button @click="action = 'login'"> Back </a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </a-card>
</template>
<script>
import api from "@/api/user";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { mapActions } from "vuex";
export default {
  components: {
    UserOutlined,
    LockOutlined,
  },
  data() {
    return {
      action: "login",
      form: {
        username: "",
        password: "",
        confirmPassword: "",
      },
    };
  },
  methods: {
    ...mapActions(["setCurrentUser"]),
    handleSubmit() {
      if (this.action === "login") {
        api.login(this.form.username, this.form.password).then((res) => {
          if (res.data.code === 1) {
            this.setCurrentUser(res.data.user);
            location.href = "/#/";
          } else {
            message.error(res.data.description);
          }
        });
      } else if (this.form.password !== this.form.confirmPassword) {
        message.error("Please confirm password!");
      } else {
        api.signup(this.form.username, this.form.password).then((res) => {
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
