<template>
  <a-layout id="admin-layout" class="layout"
    ><a-layout-header
      style="text-align: left; line-height: 50px; height: 50px; padding: 0 0 0 50px"
      ><a-row
        ><a-col :span="1"><a-avatar src="/favicon.ico" :size="40" /></a-col
        ><a-col :span="16"
          ><a-menu
            theme="dark"
            mode="horizontal"
            @click="handleSelect"
            :style="{ lineHeight: '50px', fontWeight: 'bold' }"
            ><a-menu-item key="NftWork">NftWork </a-menu-item
            ><a-menu-item key="MarketPlace">MarketPlace </a-menu-item
            ><a-menu-item key="Collection">Collection </a-menu-item
            ><a-menu-item key="Blog">Blog </a-menu-item></a-menu
          ></a-col
        ><a-col :span="6" style="text-align: right">
          <a-dropdown v-if="getCurrentUser()">
            <a-space>
              <a-avatar
                v-if="getCurrentUser().head_avatar"
                :src="'/app/file/get/' + getCurrentUser().head_avatar"
                :size="28"
              /><a-avatar v-else :size="28"
                ><template #icon><UserOutlined /></template
              ></a-avatar>
              <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
                {{ getCurrentUser().nickname || getCurrentUser().username }}
              </a>
            </a-space>
            <template #overlay
              ><a-menu
                ><a-menu-item
                  ><a href="javascript:;" @click="userSetting">Setting</a></a-menu-item
                ><a-menu-item
                  ><a href="javascript:;" @click="logout">Sign out</a></a-menu-item
                ></a-menu
              ></template
            >
          </a-dropdown>
          <a-button v-else type="link" @click="goLogin">Sign in</a-button></a-col
        ></a-row
      ></a-layout-header
    ><a-layout-content
      ><div :style="{ background: '#fff', padding: '24px', minHeight: '280px' }">
        <NftWork v-if="current === 'NftWork'" /><Collection
          v-if="current === 'Collection'"
        /><MarketPlace v-if="current === 'MarketPlace'" /><Blog
          v-if="current === 'Blog'"
        /></div></a-layout-content
    ><a-layout-footer style="text-align: center"
      >Simple Web ©2020 Created by novicezk
    </a-layout-footer></a-layout
  ><a-modal
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
import NftWork from "@/components/NftWork";
import Collection from "@/components/Collection";
import MarketPlace from "@/components/MarketPlace";
import Blog from "@/components/Blog";

import { UserOutlined, PlusOutlined, LoadingOutlined } from "@ant-design/icons-vue";

import { mapGetters, mapActions } from "vuex";

import { message } from "ant-design-vue";
import api from "@/api/user";

export default {
  components: {
    NftWork,
    Collection,
    MarketPlace,
    Blog,
    UserOutlined,
    PlusOutlined,
    LoadingOutlined,
  },

  data() {
    return {
      current: "NftWork",
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
      this.current = item.key;
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

  mounted() {},
};
</script>
<style lang="less">
#admin-layout {
  min-height: 100%;
  .logo {
    float: left;
    line-height: 50px;
    img {
      vertical-align: middle;
      width: 45px;
    }
  }
}
</style>
