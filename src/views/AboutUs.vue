<template>
  <a-layout class="layout admin-layout">
    <main-header />
    <a-layout-content style="text-align: left; padding: 1% 2%">
      <v-md-editor
        v-if="active === 'about'"
        v-model="aboutUs"
        mode="preview"
      ></v-md-editor>
      <v-md-editor
        v-else-if="active === 'link'"
        v-model="linkUs"
        mode="preview"
      ></v-md-editor>
      <v-md-editor v-else v-model="joinUs" mode="preview"> </v-md-editor>
    </a-layout-content>
    <main-footer />
  </a-layout>
</template>
<script>
import MainHeader from "@/components/MainHeader";
import MainFooter from "@/components/MainFooter";
export default {
  components: {
    MainHeader,
    MainFooter,
  },
  data() {
    return {
      aboutUs:
        "# 关于我们 \n Ginkgo Valley 银杏谷，致力于价值信息的传播与交流，力图成为非同质化代币（NFT）领域的资源整合服务商领跑者。\n\n Ginkgo 于2021年初正式成立，创始团队拥有近十年的区块链行业经验，希望通过团队的经验和努力让更广泛的大众看到 、理解NFT的价值 , \n\n 鼓励和引导原创作者依托NFT特点，展现自身的创新活力，实现内容的创作与资产的生成，让大众拥有更多的价值投资（和文化转播）机会，促进信息社会到价值社会的转变。",
      linkUs:
        "# 联系方式 \n \n* 微信公众号：Ginkgo Lab \n* 新浪微博：GinkgoLab \n* 公司邮箱：hello@ginkgonft.com",
      joinUs:
        "# 区块链开发 \n \n* 具有传统互联⽹开发经验 \n* 熟悉互联⽹主流开发语⾔ \n* 熟悉区块链主流技术原理  \n* 拥有区块链项⽬开发经验 \n* 接触区块链2 年以上 \n # 前端开发 \n \n* 拥有⼤型互联⽹前端项⽬开发经验  \n* 熟悉主流前端框架vue 、react   \n* 熟悉javascript开发 \n* 前端开发3年以上经验 \n # 项⽬运营  \n \n* 熟悉区块链、nft ⽣态  \n* 熟悉创业项⽬运作 负责项⽬推⼴、运营  \n* 负责项⽬需求调研、分析⼯作  \n* 接触区块链2 年以上 \n",
    };
  },
  computed: {
    active() {
      return this.$route.query.active;
    },
  },
};
</script>
