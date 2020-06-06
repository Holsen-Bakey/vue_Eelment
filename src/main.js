import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css' //导入全局样式表
// import './assets/fonts/iconfont.css' //导入字体图标

import TreeTable from 'vue-table-with-tree-grid'  //引入tree-grid插件
Vue.component('TreeTable', TreeTable)   //全局引用

import axios from 'axios'
// axios.defaults.baseURL = 'http://www.baidu.com'  //配置请求的根路径
Vue.prototype.$http = axios;


//axios 请求拦截,预处理请求，请求拦截器添加 token
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')