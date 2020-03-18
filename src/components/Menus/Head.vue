<template>
  <el-page-header title="退出登录" @back="logOut" content="资产在线管理平台"></el-page-header>
</template>

<script>
export default {
  methods: {
    logOut() {
      this.$message({
        message: "已登出~",
        type: "success"
      });
      this.$cookie.delete("TOKEN");
      this.$cookie.delete("AUTHORITY");
      this.$cookie.delete("USERNAME");
      this.$router.replace({ path: "/login" });
    }
  }
};
</script>

<style>
@import url("//unpkg.com/element-ui@2.13.0/lib/theme-chalk/index.css");
/* .el-page-header {
    display: grid!important;
} */
.el-page-header__content {
  font-size: 30px !important;
  font-weight: 200 !important;
}
</style>
