<template>
  <router-view />
</template>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.ant-modal-body {
  max-height: calc(90vh);
  overflow: auto;
}
.ant-card {
  margin-bottom: 10px !important;
}

.admin-layout {
  min-height: 100%;
  .ant-layout-header {
    border-bottom: 1px solid #f0f0f0;
    background: #f5f5f5;
  }
  .ant-layout-content {
    background: rgb(255, 255, 255);
    padding: 24px;
    min-height: 280px;
  }
  .ant-layout-footer {
    text-align: center;
  }
  .hearder-text {
    color: rgba(0, 0, 0, 0.85);
    font-weight: bold;
  }
  .hover-img img {
    cursor: pointer;
  }
  .hover-img img:hover {
    border: 2px solid #17a2b8;
  }
}
</style>
