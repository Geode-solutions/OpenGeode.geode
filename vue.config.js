const webpack = require("webpack");

module.exports = {
  configureWebpack: config => {
    config.output.libraryExport = "default";
    config.module.rules.push({
      test: /\.node$/,
      use: "node-loader"
    });
    config.plugins.push(
      new webpack.DefinePlugin({
        GEODE: JSON.stringify(require("./package.json").geode)
      })
    );
  },
  chainWebpack: config => {
    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule.use("vue-svg-loader").loader("vue-svg-loader");
  }
};
