module.exports = {
  lintOnSave: "warning",
  devServer: {
    port: 8200,
    disableHostCheck: true,
    proxy: {
      "/app": {
        target: "http://127.0.0.1:50009",
      },
    },
  },
};
