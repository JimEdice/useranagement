import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

Vue.prototype.$http = axios
// 修改内部的$http为axios   $http.get(url)
Vue.use(ElementUI)
Vue.config.productionTip = false

//在main.js里面定义了就不用在组件里面再次定义
axios.defaults.timeout=3000;  //超时时间
axios.defaults.baseURL='http://localhost:8081/';

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
