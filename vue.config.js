module.exports =  {

  chainWebpack: config => {
    config.resolve.alias
      .set('@stu', `${config.get('context')}/student_page_src`)
    config.entry('student_page')
            .add('./student_page_src/main.js')
            .end()
    config.module
            .rule('vue')
              .use('iview-loader')
                .loader('iview-loader')
                  .tap(options => {
                    // 修改它的选项...
                    options = {
                      prefix: false
                    }
                    return options
                  })
    config.plugin('html')
            .tap(args => {
              args[0].filename = 'index.html'
              args[0].excludeChunks = ['student_page']
              return args
            })
    config.plugin('copy')
            .tap(args => {
              args[0][0].ignore.push('index_forstu.html')
              return args
            })
    config.plugin('html_stu')
            .use(require('html-webpack-plugin'), [{
              template: `${config.get('context')}/public/index_forstu.html`,
              filename: 'stu.html',
              chunks: ['student_page', 'chunk-vendors']
            }])
  },
  baseUrl: process.env.NODE_ENV === 'production' ? '/qa' : '/',
  devServer: {
    port: 8080,
    disableHostCheck: true
  }
}