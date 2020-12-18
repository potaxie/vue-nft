module.exports = {
  lintOnSave: "warning",
  devServer: {
    port: 8200,
    disableHostCheck: true,
    proxy: {
      "/app": {
        target: "http://localhost:50009",
      },
    },
  },
};
