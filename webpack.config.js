const path = require("path");
const glob = require("glob");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const generateHtmlPlugins = () => glob.sync('./src/**/index.html').map(
  (item) => {
    console.log(`./${item.replace('/src', '').replace('./', '')}`, `.${item.replace('/src', '').replace('.html', '.js')}`)
    return new HtmlWebpackPlugin({
      template: item,
      filename: `./${item.replace('/src', '').replace('./', '')}`,
      inject: true,
    })
  }
)

module.exports = {
  devtool: "source-map",
  mode: 'development',
  entry: glob.sync('./src/**/index.js').reduce((acc, filePath) => {
    const entry = filePath.replace('/index.js', '').replace('/src', '')
    acc[entry] = filePath
    return acc
  }, {}),
  output: {
    filename: './[name]/index.js',
    path: path.resolve(__dirname, 'demo'),
    assetModuleFilename: 'images/[hash][ext][query]',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-typescript"],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
        ],
      },
      {
        test: /\.(png|jpg)$/,
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx", "mjs"],
  },
  plugins: [
    ...generateHtmlPlugins(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "src/assets/**/*",
          to({ absoluteFilename }) {
            const pathAndName = absoluteFilename.split("src/")[1];
            console.log(pathAndName)
            return pathAndName;
          },
        },
      ],
    }),
  ],
  devServer: {
    open: true,
    hot: true,
  },
};
