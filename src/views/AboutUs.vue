<template>
  <a-layout class="layout admin-layout">
    <main-header />
    <a-layout-content style="text-align: left; padding: 1% 3%">
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
      <v-md-editor v-else v-model="joinUs" mode="preview"></v-md-editor>
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
        "# NFT 是什么\n\n* Non-Fungible Token 非同质化代币，不可分割、不可替代。\n* 主流公链都可以产生 NFT（如 BTC、ETH、EOS)。\n* 以太坊通过 ERC-721、ERC1155 等特殊的代币标准协议来发布非同质化 token。\n\nn* NFT 是价值的载体，它无法篡改，它具有唯一的稀缺性。\n\n# NFT 主流应用领域\n\n### Art 艺术品\nMakersPlace\n\n是一个为艺术家和创作者提供全方位服务的平台，用于铸造代表其作品的 NFT。借助区块链技术，收藏者通过 MakersPlace 获得的每个由区块链技术支持的艺术创作者和收藏者的社交网络平台，由数字艺术品收藏家 John Crain 于 2018 年创立。创作者可以在该平台创建数字作品，并在以太坊区块链上对其进行标记。收藏家可以在该平台购买和交易艺术品，其版税可归还给创作者。\nAsyncAr，可以对其拥有者的操作做出反馈，甚至可以从外界获取数据，那将会是一种全新的独特体验。\nGame 游戏\nDecentraland\n\n是基于以太坊的去中心化 VR 平台。在 Decentraland 平台中，用户用户能够完全控制自己创建的内容环境和应用，其范围可以从任并可以使用 MANA（Decentraland 上的加密货币）购买。此外，LAND 还可以进一步组织形成主题社区，社区是一个具有共同兴趣和用途的共享空间。\nSorare\n\n",
      linkUs: "联系我们",
      joinUs: "加入我们",
    };
  },
  computed: {
    active() {
      return this.$route.query.active;
    },
  },
};
</script>
