const path = require("path")
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin
const FaviconsWebpackPlugin = require("favicons-webpack-plugin")

module.exports = {
  mode: "production",
  entry: {
    hotReload: "react-hot-loader/patch",
    app: "./src/index.js",
    tests: "./src/test.js",
    "editor.worker": 'monaco-editor/esm/vs/editor/editor.worker.js',
    "json.worker": 'monaco-editor/esm/vs/language/json/json.worker',
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    globalObject: "this"
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader?limit=100000"
      },
      {
        test: /\.(mon|ohm)$/,
        loader: "raw-loader"
      },
      {
        test: /\.(bin)$/,
        loader: "buffer-loader"
      },
      {
        test: /\.worker\.js$/,
        loader: "worker-loader"
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      }
    ]
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"]
  },
  plugins: [
    new HtmlWebpackPlugin({
      chunks: ["app"],
      hash: true,
      template: "./src/index.html",
      filename: "index.html"
    }),
    new webpack.IgnorePlugin(/^((fs)|(path)|(os)|(crypto)|(source-map-support))$/, /vs\/language\/typescript\/lib/),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new FaviconsWebpackPlugin({
      logo: "./src/favicon.svg",
      prefix: "icons-[hash]/",
      inject: true,
      background: "#fff",
      title: "L1"
    }),
    //new BundleAnalyzerPlugin()
  ],
  devtool: "eval-source-map",
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    hot: true,
    port: 8080,
    stats: "errors-only",
    logLevel: "info",
    clientLogLevel: "warning",
    overlay: true
  }
}