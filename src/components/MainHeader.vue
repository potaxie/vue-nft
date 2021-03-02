<template>
  <a-layout-header style="text-align: left; line-height: 48px; height: 48px; padding: 0"
    ><a-row
      ><a-col :span="3"
        ><a-image
          src="/logo.svg"
          :preview="false"
          height="32px"
          weight="80px"
          style="margin-top: -5px" /></a-col
      ><a-col :span="15"
        ><a-menu
          mode="horizontal"
          @click="handleSelect"
          :style="{
            fontWeight: 'bold',
            height: '48px',
            borderBottom: 'unset',
            background: '#f5f5f5',
          }"
          ><a-menu-item key="/#/">NftWork </a-menu-item
          ><a-menu-item key="/#/market-place">MarketPlace </a-menu-item
          ><a-menu-item key="/#/collection">Collection </a-menu-item
          ><a-menu-item key="/#/blog"> Paper </a-menu-item></a-menu
        ></a-col
      ><a-col :span="6" style="text-align: right">
        <a-dropdown v-if="getCurrentUser()">
          <a-space>
            <a-avatar
              v-if="getCurrentUser().head_avatar"
              :src="'/app/file/get/' + getCurrentUser().head_avatar"
              :size="28"
            /><a-avatar v-else :size="28" style="font-size: 16px"
              ><template #icon><UserOutlined /></template
            ></a-avatar>
            <a
              class="ant-dropdown-link hearder-text"
              @click="(e) => e.preventDefault()"
              style="font-size: 16px; margin-right: 30px; color: #3291e6"
            >
              {{ getCurrentUser().nickname || getCurrentUser().username }}
            </a>
          </a-space>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <UserOutlined />
                <span @click="userSetting"> Setting</span>
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item>
                <LogoutOutlined />
                <span @click="logout"> Logout </span>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <a-button
          v-else
          type="link"
          class="hearder-text"
          @click="goLogin"
          style="font-size: 16px; margin-right: 30px; color: #3291e6"
          >Login</a-button
        ></a-col
      ></a-row
    ></a-layout-header
  >
  <a-modal
    :visible="showUserModal"
    title="User Setting"
    @ok="handleOk"
    @cancel="showUserModal = false"
    ><a-form ref="form" :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }"
      ><a-form-item label="Username" name="username"
        ><a-input v-model:value="form.username" disabled /></a-form-item
      ><a-form-item label="Nickname"
        ><a-input v-model:value="form.nickname" /></a-form-item
      ><a-form-item label="Avatar"
        ><a-upload
          v-model:fileList="fileList"
          name="file"
          list-type="picture-card"
          class="avatar-uploader"
          :show-upload-list="false"
          action="/app/file/upload"
          @change="handleAvatarChange"
          ><a-avatar
            v-if="form.head_avatar"
            :src="'/app/file/get/' + form.head_avatar"
            shape="square"
            :size="100"
          />
          <div v-else>
            <loading-outlined v-if="loading" /><plus-outlined v-else />
            <div class="ant-upload-text">Upload</div>
          </div></a-upload
        ></a-form-item
      ></a-form
    ></a-modal
  >
</template>

<script>
import {
  UserOutlined,
  PlusOutlined,
  LoadingOutlined,
  LogoutOutlined,
} from "@ant-design/icons-vue";
import { mapGetters, mapActions } from "vuex";
import { message } from "ant-design-vue";
import api from "@/api/user";

export default {
  components: {
    UserOutlined,
    PlusOutlined,
    LoadingOutlined,
    LogoutOutlined,
  },
  data() {
    return {
      form: {},
      showUserModal: false,
      fileList: [],
      loading: false,
    };
  },
  computed: {
    ...mapGetters(["getCurrentUser"]),
  },
  methods: {
    ...mapActions(["setCurrentUser"]),
    handleSelect(item) {
      location.href = item.key;
    },
    userSetting() {
      this.form = {
        ...this.getCurrentUser(),
      };
      this.showUserModal = true;
    },
    handleAvatarChange(info) {
      if (info.file.status === "uploading") {
        this.loading = true;
        return;
      }

      if (info.file.status === "done") {
        this.form.head_avatar = info.file.response;
        this.loading = false;
      }
    },
    handleOk() {
      let data = {
        ...this.form,
      };
      api.update(data).then((res) => {
        if (res.data.code === 1) {
          this.setCurrentUser(data);
          this.showUserModal = false;
        } else {
          message.error(res.data.description);
        }
      });
    },

    goLogin() {
      location.href = "/#/login";
    },

    logout() {
      api.logout().then((res) => {
        if (res.data.code === 1) {
          this.setCurrentUser(null);
        } else {
          message.error(res.data.description);
        }
      });
    },
  },
};
</script>
