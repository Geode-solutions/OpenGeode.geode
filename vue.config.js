module.exports = {
  configureWebpack: (config) => {
    config.output.libraryExport = "default";
  },
  chainWebpack: (config) => {
    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule.delete('type');
    svgRule.delete('generator');
    svgRule.use("vue-svg-loader").loader("vue-svg-loader");
  },
};
