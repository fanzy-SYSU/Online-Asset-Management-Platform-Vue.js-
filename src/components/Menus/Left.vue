<template>
  <el-menu
    :default-active="this.$route.path"
    class="el-menu-demo"
    mode="vertical"
    router
  >
    <!-- 使用v-for的方法 -->
    <!-- <el-menu-item v-for="(item,i) in navList" :key="i" :index="item.name">
        <i class="el-icon-menu"></i>
        {{ item.navItem }}
    </el-menu-item> -->
    <el-menu-item index="/homepage">
        <i class="el-icon-location"></i>
        首页
    </el-menu-item>
    <el-menu-item index="/list">
        <i class="el-icon-notebook-2"></i>
        资产列表
    </el-menu-item>
    <el-menu-item index="/query">
        <i class="el-icon-search"></i>
        资产查询
    </el-menu-item>
    <el-menu-item index="/add">
        <i class="el-icon-plus"></i>
        资产录入
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  data() {
    return {
        navList:[
            {name:'/homepage',navItem:'首页'},
            {name:'/add',navItem:'资产录入'},
            {name:'/list',navItem:'资产列表'},
            {name:'/query',navItem:'资产查询'},
        ]
    };
  },
};
</script>

<style>
.el-menu-item{
    text-align: left;
}
</style>