import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from '../router/index.js';
import VueCookie from 'vue-cookie';
import { Notification } from 'element-ui';

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(VueCookie);

// 使用Vue全局前置守卫进行权限管理
router.beforeEach((to, from, next) => {
  if (to.path != '/login' && to.path != '/register') {
    if (Vue.cookie.get("AUTHORITY") == null) {
      // 未登录
      next('/login')
      Notification.warning('当前未登录！');
      document.title = '登录';
    }
    else if (to.path != '/homepage' && to.path != '/add' && to.path != '/query'){
      // 登录了但是访问了非法页面
      next('/homepage')
      Notification.warning('不存在该页面，自动返回首页！');
      document.title = '资产在线管理平台';
    }
    else {
      next();
      document.title = to.meta.title;
    }
  }
  else {
    if (Vue.cookie.get("AUTHORITY") != null) {
      // 未登录
      next('/homepage')
      Notification.warning('已为登录状态，自动返回首页！');
      document.title = '资产在线管理平台';
    }
    else {
      next();
      document.title = to.meta.title;
    }
  }
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
