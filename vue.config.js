module.exports = {
  lintOnSave: "warning",

  devServer: {
    port: 8200,
    disableHostCheck: true,
    proxy: {
      "/app": {
        // target: "http://172.20.10.4:50009",
        // target: "http://127.0.0.1:50009",
        // target: "https://www.ginkgonft.com",
        target: "http://192.168.31.100:50009",
        // target: "http://192.168.0.103:50009",
      },
    },
  },

  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      runtimeOnly: false,
      compositionOnly: true,
      fullInstall: true,
    },
  },
};
