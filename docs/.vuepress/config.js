const conf = process.env.NODE_ENV === 'development' ? require('./dev.themeConfig.js') : require('./prod.themeConfig')
// console.log(conf)
module.exports = {
  base: '/',
  title: 'im.liuk | carry your world',
  head: [
    ['link', {name: 'applicable-device', content: 'pc,mobile'}],
    ['meta', {name: 'google', content: 'notranslate'}],
    ['meta', {name: 'description', content: '刘凯的个人站点'}],
    ['meta', {name: 'viewport', content: 'initial-scale=1.0,width=device-width,user-scalable=no,viewport-fit=cover'}],
    ['meta', {'http-equiv': 'Content-Type', content: 'text/html; charset=utf-8'}]
  ],
  port: 4000,
  dest: '.vuepress/dist',
  extraWatchFiles: [],
  markdown: {
    lineNumbers: true
  },
  plugins: [],
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8089'
      }
    }
  },
  themeConfig: {
    type: 'blog',
    mode: 'light',
    author: 'liukai',
    startYear: '2018',
    sidebar: 'auto',
    bgImg: 'https://s1.ax1x.com/2020/07/05/USrh1P.jpg',
    logo: '/favicon.ico',
    email: 'im.liukai2333@gmail.com',
    nav: [
      {text: 'Home', link: '/', icon: 'icon-home_n'},
      {text: 'Category', link: '/category/', icon: 'icon-icon-goodscategory'},
      {text: 'Tags', link: '/tag/', icon: 'icon-tag'},
      // {text: 'Resume', link: '/resume/', icon: ''},
      // {text: 'Timeline', link: '/timeline/', icon: 'icon-shijian'},
      {text: 'Contact', icon: 'icon-contact', items: [{
        text: 'github',
        link: 'https://github.com/imLiukai',
        icon: 'icon-git'
      }, {
        text: 'telegram',
        link: 'https://t.me/im_liukai',
        icon: 'icon-telegram'
      }, {
        text: 'fe learn',
        link: 'https://imliuk.com/study.html'
        // icon: 'icon-book'
      }]}
    ]
  }
}