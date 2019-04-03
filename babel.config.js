module.exports = {
  presets: [
    '@vue/app',
  ],
  plugins: [
    // 允许使用行内import 返回一个Promise
    "@babel/plugin-transform-modules-commonjs",
    // 允许正确分块按需加载
    "@babel/plugin-syntax-dynamic-import"
  ]
  // plugins: [
  //   "@babel/plugin-transform-modules-commonjs",
  //   [
  //     "import",
  //     {
  //       "libraryName": "iview",
  //       "libraryDirectory": "src/components"
  //     }
  //   ]
  // ]
}
