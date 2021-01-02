<template>
  <a-layout id="admin-layout" class="layout">
    <a-layout-header style="text-align: left;">
      <div class="logo">
        <img src="/favicon.ico" alt="logo" />
      </div>
      <a-menu
        theme="dark"
        mode="horizontal"
        @click="handleSelect"
        :style="{ lineHeight: '64px' }"
      >
        <a-menu-item key="artwork">
          Home
        </a-menu-item>
        <a-menu-item key="market-place">
          MarketPlace
        </a-menu-item>
        <a-menu-item key="workbench">
          DataAnalysis
        </a-menu-item>
        <a-menu-item key="artrcle">
          Artrcle
        </a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout-content style="padding: 0 50px">
      <div :style="{ background: '#fff', padding: '24px', minHeight: '280px' }">
        <artwork v-if="current === 'artwork'" />
        <workbench v-if="current === 'workbench'" />
        <market-place v-if="current === 'market-place'" />
        <artrcle v-if="current === 'artrcle'" />
      </div>
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      Simple Web ©2020 Created by novicezk
    </a-layout-footer>
  </a-layout>
</template>
<script>
import Artwork from "@/components/Artwork";
import Workbench from "@/components/Workbench";
import MarketPlace from "@/components/MarketPlace";
import Artrcle from "@/components/Artrcle";

export default {
  components: {
    Artwork,
    Workbench,
    MarketPlace,
    Artrcle,
  },
  data() {
    return {
      current: "artrcle",
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
    float: left;
    height: 64px;
    img {
      vertical-align: unset;
      width: 64px;
    }
  }
}
</style>
