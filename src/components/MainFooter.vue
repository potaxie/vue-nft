<template>
  <a-layout-footer>
    <a-row style="text-align: center">
      <a-col :span="2"
        ><a href="/#/about-us?active=about">{{ $t("about-us") }}</a></a-col
      >
      <a-col :span="2"
        ><a href="/#/about-us?active=link">{{ $t("link-us") }}</a></a-col
      >
      <a-col :span="2"
        ><a href="/#/about-us?active=join">{{ $t("join-us") }}</a></a-col
      >
      <a-col :span="12">Ginkgo Nft ©2020 Created by ginkgo </a-col>
    </a-row>
  </a-layout-footer>
</template>
<script>
export default {};
</script>
