<template>
  <a-layout id="admin-layout">
    <a-layout-sider
      breakpoint="lg"
      collapsed-width="0"
      :style="{ 'text-align': 'left' }"
    >
      <div class="logo">
        <a>
          <img src="/bithot.jpeg" alt="logo" />
          <h1>BitHot</h1>
        </a>
      </div>
      <a-menu theme="dark" mode="inline" @click="handleSelect">
        <a-menu-item v-for="menu in menus" :key="menu.name">
          <component :is="menu.icon"></component>
          <span class="nav-text">{{ menu.title }}</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <!-- <a-layout-header :style="{ background: '#fff', padding: 0 }" /> -->
      <a-layout-content>
        <workbench v-if="current === 'workbench'"></workbench>
      </a-layout-content>
      <a-layout-footer :style="{ 'text-align': 'center', padding: '10px 50px' }"
        >BitHot ©2020 Created by potaxie</a-layout-footer
      >
    </a-layout>
  </a-layout>
</template>
<script>
import { UserOutlined, MenuOutlined } from "@ant-design/icons-vue";
import Workbench from "@/components/Workbench";

export default {
  components: {
    UserOutlined,
    MenuOutlined,
    Workbench,
  },
  data() {
    return {
      current: "workbench",
      menus: [
        {
          name: "workbench",
          title: "工作台",
          icon: "UserOutlined",
        },
      ],
    };
  },
  methods: {
    handleSelect(item) {
      this.current = item.key;
    },
  },
  mounted() {},
};
</script>
<style lang="less">
#admin-layout {
  min-height: 100%;
  .logo {
    position: relative;
    display: flex;
    align-items: center;
    padding: 16px;
    line-height: 32px;
    cursor: pointer;
    img {
      display: inline-block;
      height: 32px;
      vertical-align: middle;
    }
    h1 {
      display: inline-block;
      height: 32px;
      margin: 0 0 0 12px;
      color: #fff;
      font-weight: 600;
      font-size: 18px;
      line-height: 32px;
      vertical-align: middle;
    }
  }
  .logo > a {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 32px;
  }
}
</style>
