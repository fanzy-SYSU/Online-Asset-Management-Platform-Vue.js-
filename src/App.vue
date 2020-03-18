<template>
  <div id="app">
    <el-container v-if="$route.meta.keepAlive">
      <el-header height="50px">
        <keep-alive>
          <!-- 导航栏 -->
          <PageHeader></PageHeader>
        </keep-alive>
      </el-header>

      <el-container>
        <el-aside width="180px">
          <!-- 侧边栏 -->
          <keep-alive>
            <NavMenuLeft></NavMenuLeft>
          </keep-alive>
        </el-aside>
        
        <el-main>
          <!-- Body -->
          <div class="menu_title">
            | {{ $route.name }}
          </div>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
    <!-- 登录/注册页 -->
    <router-view class="loginpage" v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
import header from './components/Menus/Head.vue'
import left from './components/Menus/Left.vue'
export default {
  name: 'App',
  components: {
    PageHeader: header,
    NavMenuLeft: left,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* background: url('./components/Login&Register/background2.jpg') no-repeat; */
  background-color: rgba(255,255,255,0.7);
  background-position: center;
  height: 100%;
  width: 100%;
  background-size: cover;
  position: fixed;
  /* background-image: url('./components/Login&Register/background2.jpg')!important;
  background-color: rgba(255,255,255,70%)!important;
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-size: cover; */
}
.el-header {
  margin-top: 40px;
  /* background: rgba(255,255,255,0.5); */
}
.menu_title {
  text-align: left;
  font-size: 25px;
  font-weight: 100;
  /* transform: scale(1.18,1); */
  margin-top: -20px;
  margin-bottom: 15px;
}
/* .loginpage {
  text-align: center;
} */
</style>
