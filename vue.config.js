// vue.config.js
const UnoCSS = require("@unocss/webpack-plugin");
const { presetIcons } = require("@unocss/preset-icons");

module.exports = {
  configureWebpack: {
    plugins: [
      UnoCSS({
        presets: [
          presetIcons({
            provider: "iconify",
            extraProperties: {
              display: "inline-block",
              "vertical-align": "middle",
            },
          }),
        ],
      }),
    ],
  },
};
