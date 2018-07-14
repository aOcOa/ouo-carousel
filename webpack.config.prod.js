const path = require("path");

module.exports = {
  mode: "production",
  entry: path.resolve(__dirname, "src/script.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader" // Adds CSS to the DOM by injecting a <style> tag
          },
          {
            loader: "css-loader" //  interprets @import and url() like import/require() and will resolve them.
          },
          {
            loader: "postcss-loader", // postcss loader so we can use autoprefixer
            options: {
              config: {
                path: path.resolve(__dirname, "./postcss.config.js")
              }
            }
          },
          {
            loader: "sass-loader" // compiles Sass to CSS
          }
        ]
      }
    ]
  }
};
