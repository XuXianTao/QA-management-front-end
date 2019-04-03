let All = {};
/**
 * 匹配该文件夹下除了本文件(index.js)以外的js文件，使用require
 */
const context = require.context(
  './', true, /(?<!(index))\.js$/
)
/**
 * 由于import仅支持静态导入 与 import()异步导入的文件且字符串不能修改
 * 所以使用webpack特定方法require.context批量获取再整合导出
 */
const filenames = []
context.keys().forEach(filename => {
  const key = filename.replace(/\.js$/, '').replace(/^\.\//, '')
  All[key] = context(filename).default
  filenames.push(filename) 
  /**
   * 由于export语句只能在最上层环境中使用(不能写在循环语句中),所以这里无法使用具名导出，需要使用commonjs的exports导出方式
   */
  exports[key] = All[key]
})

export default All