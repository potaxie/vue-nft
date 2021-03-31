<template>
  <div class="mobile-container">
    <div class="top">
      <a-image src="/logo.svg" width="200px" :preview="false" />
    </div>
    <h3>暂不支持移动端，请通过PC端访问</h3>
  </div>
</template>
<script>
export default {};
</script>
<style lang="less">
.mobile-container {
  width: 100%;
  min-height: 100%;
  background: #ffffff url(../assets/background.svg) no-repeat 50%;
  background-size: 100%;
  position: relative;
  padding: 150px 0;
  .top {
    line-height: 50px;
    margin-bottom: 20px;
  }
}
</style>
