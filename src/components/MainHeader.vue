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
      ><a-col :span="10"
        ><a-menu
          mode="horizontal"
          @click="handleSelect"
          :style="{
            fontWeight: 'bold',
            height: '48px',
            borderBottom: 'unset',
            background: '#f5f5f5',
          }"
          ><a-menu-item key="/#/"> {{ $t("nft-work") }} </a-menu-item
          ><a-menu-item key="/#/market-place"> {{ $t("market-place") }} </a-menu-item
          ><a-menu-item key="/#/blog"> {{ $t("paper") }} </a-menu-item></a-menu
        ></a-col
      >
      <a-col :span="6" style="text-align: right">
        <a-input-search
          v-model:value="keyword"
          :placeholder="$t('search-item')"
          style="width: 250px; border-radius: 16px"
          @pressEnter="onSearch()"
          @search="onSearch()"
      /></a-col>
      <a-col :span="1" style="text-align: right">
        <WeiboCircleOutlined
          class="header-icon active-header-icon"
          style="color: #737373"
          @click="goWeibo()"
        />
      </a-col>
      <a-col :span="1" style="text-align: center">
        <a-popover>
          <template #title
            ><div style="text-align: center">
              <span>{{ $t("wx-mp") }}</span>
            </div></template
          >
          <template #content>
            <div>
              <a-image
                src="/ginkgo-mp.jpg"
                :preview="false"
                width="150px"
                height="150px"
              /></div
          ></template>
          <WechatOutlined class="header-icon" style="color: #737373" />
        </a-popover>
      </a-col>
      <a-col :span="1" style="text-align: left">
        <TranslationOutlined
          class="header-icon active-header-icon"
          style="color: #737373"
          @click="translation()"
        />
      </a-col>
      <a-col :span="2" style="text-align: center; padding-right: 25px">
        <a-dropdown v-if="getCurrentUser()">
          <span>
            <a-avatar
              v-if="getCurrentUser().head_avatar"
              :src="'/app/file/get/' + getCurrentUser().head_avatar"
              :size="32"
            /><a-avatar v-else :size="32"
              ><template #icon><UserOutlined /></template
            ></a-avatar>
            <CaretDownOutlined :style="{ fontSize: '12px', marginLeft: '4px' }" />
          </span>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <span> {{ getCurrentUser().nickname || getCurrentUser().username }}</span>
              </a-menu-item>
              <a-menu-item>
                <WalletOutlined />
                <span @click="collcetion()"> {{ $t("collection") }} </span>
              </a-menu-item>
              <a-menu-item>
                <UserOutlined />
                <span @click="userSetting()"> {{ $t("setting") }} </span>
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item>
                <LogoutOutlined />
                <span @click="logout()"> {{ $t("logout") }} </span>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <a
          v-else
          class="hearder-text"
          style="font-size: 14px; color: #3291e6"
          href="javascript:void(0)"
          @click="goLogin"
          >{{ $t("login-signup") }}</a
        >
      </a-col></a-row
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
  WalletOutlined,
  WechatOutlined,
  CaretDownOutlined,
  WeiboCircleOutlined,
  TranslationOutlined,
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
    WalletOutlined,
    WechatOutlined,
    CaretDownOutlined,
    WeiboCircleOutlined,
    TranslationOutlined,
  },
  data() {
    return {
      keyword: "",
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
    onSearch() {
      location.href = "/#/market-place?keyword=" + this.keyword;
    },
    translation() {
      if (this.$root.$i18n.locale === "en") {
        this.$root.$i18n.locale = "zh-CN";
      } else {
        this.$root.$i18n.locale = "en";
      }
    },
    goWeibo() {
      window.open("https://weibo.com/");
    },
    collcetion() {
      location.href = "/#/collection";
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
  created() {
    let key = this.$route.query.keyword;
    if (key && this.keyword != key) {
      this.keyword = key;
    }
  },
};
</script>
