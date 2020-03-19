<template>
  <body id="poster">
    <el-form class="login-container" label-position="left" label-width="0px">
      <div class="login_title">资产在线管理平台</div>
      <el-form-item>
        <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="请输入账号" clearable></el-input>
      </el-form-item>
 
      <el-form-item>
        <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="请输入密码" maxlength="16" clearable @keyup.enter.native="login"></el-input>
      </el-form-item>
 
      <el-form-item style="width: 100%">
        <el-button type="primary" style="width: 100%;background: #505458;border: none" v-on:click="login">登录</el-button>
      </el-form-item>

      <el-form-item style="width: 100%">
        <el-button type="primary" style="width: 100%;background: #505458;border: none" v-on:click="register">注册</el-button>
      </el-form-item>
    </el-form>
  </body>
</template>
 
 
<script>
import axios from 'axios';
export default {
    name: "Login",
    data() {
        return {
            loginForm: {
                username: '',
                password: ''
            },
            responseResult: []
        }
    },
    methods: {
        login() {
          if(this.loginForm.username == '') {
            this.$notify({
              title: '警告',
              message: '请输入账号',
              type: 'warning'
            });
            return;
          }
          else if(this.loginForm.password == '') {
            this.$notify({
              title: '警告',
              message: '请输入密码',
              type: 'warning'
            });
            return;
          }
          else {
            let self = this;
            axios
              .post('http://127.0.0.1:8087/user/login', {
                "username": this.loginForm.username,
                "password": this.loginForm.password
              })
              .then(function (data) {
                if(data.data.currentAuthority == "Password error") {
                  self.$notify({
                    title: '错误',
                    message: '账号或密码错误',
                    type: 'error'
                  })
                }
                else {
                  if (data.data.currentAuthority == "SUPER_ADMIN") {
                    self.$notify({
                      title: '登录成功',
                      message: '欢迎回来，超级管理员！',
                      type: 'success'
                    })
                    self.$cookie.set('TOKEN', data.data.accessToken);
                    self.$cookie.set('AUTHORITY', data.data.currentAuthority);
                    self.$cookie.set('USERNAME', self.loginForm.username);
                    self.$router.replace({path: '/homepage'});
                  }
                  else {
                    self.$notify({
                      title: '登录成功',
                      message: '欢迎回来，管理员！',
                      type: 'success'
                    })
                    self.$cookie.set('TOKEN', data.data.accessToken);
                    self.$cookie.set('AUTHORITY', data.data.currentAuthority);
                    self.$cookie.set('USERNAME', self.loginForm.username);
                    self.$router.replace({path: '/homepage'});
                  }
                }
              })
              .catch(err => {
                self.$notify({
                  title: '错误',
                  message: '网络连接错误',
                  type: 'error'
                })
                console.log(err);
              })
          }
        },
        register() {
          this.$router.push({path: '/register'});
        }
    }
}
</script>
 
<style>
  #poster {
    background: url("./background.jpg") no-repeat;
    background-position: center;
    height: 100%;
    width: 100%;
    background-size: cover;
    position: fixed;
  }
  body{
    margin: 0px;
    padding: 0;
  }

  .login-container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 90px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: rgba(255,255,255,0.5);
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    text-align: center;
  }
 
  .login_title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
    font-size: 35px;
    font-weight: 200;
  }
 
 
</style>