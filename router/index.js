import Vue from 'vue';
import Router from 'vue-router';

import LoginPage from '../src/components/Login&Register/LoginPage.vue';
import RegisterPage from '../src/components/Login&Register/RegisterPage.vue';
import HomePage from '../src/components/Pages/Home.vue';
import AddDevicePage from '../src/components/Pages/Add.vue';
import QueryDevicePage from '../src/components/Pages/Query.vue';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/login',
            name: '登录',
            component: LoginPage,
            meta: {
                keepAlive: false,
                title: '登录'
            }
        },
        {
            path: '/register',
            name: '注册',
            component: RegisterPage,
            meta: {
                keepAlive: false,
                title: '注册'
            }
        },
        {
            path: '/homepage',
            name: '首页',
            component: HomePage,
            meta: {
                keepAlive: true,
                title: '资产在线管理平台'
            }
        },
        {
            path: '/add',
            name: '资产录入',
            component: AddDevicePage,
            meta: {
                keepAlive: true,
                title: '资产在线管理平台'
            }
        },
        {
            path: '/query',
            name: '资产查询',
            component: QueryDevicePage,
            meta: {
                keepAlive: true,
                title: '资产在线管理平台'
            }
        },
        // 重定向
        {
            path: '*',
            redirect: '/homepage'
        }
    ]
});