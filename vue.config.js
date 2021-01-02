module.exports = {
  lintOnSave: "warning",
  devServer: {
    port: 8200,
    disableHostCheck: true,
    proxy: {
      "/app": {
        target: "http://192.168.31.100:50009",
      },
    },
  },
};
