let All = {};
/**
 * 匹配该文件夹下除了本文件(index.js)即基础配置(_base.js)以外的js文件，使用require
 */
const context = require.context(
  './', true, /(?<!(index|_base))\.js$/
)
/**
 * 由于import仅支持静态导入 与 import()异步导入的文件且字符串不能修改
 * 所以使用webpack特定方法require.context批量获取再整合导出
 */
const filenames = []
context.keys().forEach(filename => {
  // 滤除js文件后缀名
  const key = filename.replace(/\.js$/, '').replace(/^\.\//, '')
  // 将除去后缀的文件名作为键、对应文件的导出功能模块作为值存储到输出变量中
  // 最后通过export该数组变量即可实现文件夹下的文件模块化输出
  All[key] = context(filename).default
  filenames.push(filename) 
  /**
   * 由于export语句只能在最上层环境中使用(不能写在循环语句中),
   * 所以这里无法使用具名导出，需要使用commonjs的exports导出方式
   */
  exports[key] = All[key]
})

export default All