module.exports = {
  lintOnSave: "warning",
  devServer: {
    port: 8200,
    disableHostCheck: true,
    proxy: {
      "/app": {
        // target: "http://172.20.10.4:50009",
        // target: "http://127.0.0.1:50009",
        // target: "http://139.196.39.186",
        target: "http://192.168.31.100:50009",
      },
    },
  },
};
