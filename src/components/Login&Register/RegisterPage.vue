<template>
  <body id="poster">
    <el-form class="login-container" label-position="left" label-width="0px">
      <div class="login_title">资产在线管理平台</div>
      <el-form-item>
        <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="请输入用户名" clearable></el-input>
      </el-form-item>
 
      <el-form-item>
        <el-input type="text" v-model="loginForm.invitationCode" auto-complete="off" placeholder="请输入邀请码" clearable></el-input>
      </el-form-item>

      <el-form-item>
        <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="请输入密码" maxlength="16" show-word-limit clearable></el-input>
      </el-form-item>

      <el-form-item>
        <el-input type="password" v-model="loginForm.password2" auto-complete="off" placeholder="请再次输入密码" maxlength="16" show-word-limit clearable @keyup.enter.native="register"></el-input>
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
                invitationCode: '',
                password: '',
                password2: ''
            },
            responseResult: []
        }
    },
    methods: {  
        register() {
            if(this.loginForm.username == '') {
                this.$notify({
                    title: '警告',
                    message: '请输入用户名',
                    type: 'warning'
                });
                return;
            }
            else if(this.loginForm.invitationCode == '') {
                this.$notify({
                    title: '警告',
                    message: '请输入邀请码',
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
            else if(this.loginForm.password2 == '') {
                this.$notify({
                    title: '警告',
                    message: '请再次输入密码',
                    type: 'warning'
                });
                return;
            }
            else if(this.loginForm.password != this.loginForm.password2) {
                this.$notify({
                    title: '警告',
                    message: '两次输入的密码不一致',
                    type: 'warning'
                });
                return;
            }
            else {
                let self = this;
                axios
                    .post('http://47.96.132.244:8087/user/register', {
                        "sign": this.loginForm.invitationCode,
                        "username": this.loginForm.username,
                        "password": this.loginForm.password,
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(data => {
                        if(data.data.result) {
                            self.$notify({
                                title: '成功',
                                message: '注册成功',
                                type: 'success'
                            });
                            self.$router.replace({path: '/login'});
                        }
                        else {
                            self.$notify({
                                title: '失败',
                                message: '注册失败',
                                type: 'error'
                            });
                        }
                    })
                    .catch(err => {
                        self.$notify({
                            title: '错误',
                            message: '网络连接错误',
                            type: 'error'
                        });
                        console.log(err)
                    })
            }
        },
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
  }
 
  .login_title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
    font-size: 35px;
    font-weight: 200;
  }
 
 
</style>