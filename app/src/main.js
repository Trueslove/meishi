/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-06 09:33:55
 * @LastEditTime: 2019-08-27 09:31:27
 * @LastEditors: Please set LastEditors
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import Vant from 'vant'
import $ from "jquery"
import 'vant/lib/index.css'
import 'lib-flexible/flexible.js'
import './assets/css/global.less'
import './assets/css/index.css'


import axios from 'axios'
Vue.prototype.$axios = axios
axios.defaults.baseURL = '/'  //关键代码
Vue.config.productionTip = false

import BaiduMap from 'vue-baidu-map'
Vue.use(BaiduMap,{ak:'vibrqwyXz9zj7hkv80GqG2C9T1nO6IqS'})

Vue.prototype.$ = $

Vue.use(router)
Vue.use(Vant)

new Vue({
    render: h => h(App),
    router,
}).$mount('#app')