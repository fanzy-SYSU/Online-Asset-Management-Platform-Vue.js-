<template>
  <el-menu
    :default-active="this.$route.path"
    class="el-menu-demo"
    mode="vertical"
    @select="handleSelect"
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
    <el-menu-item index="/add">
        <i class="el-icon-plus"></i>
        资产录入
    </el-menu-item>
    <el-menu-item index="/query">
        <i class="el-icon-search"></i>
        资产查询
    </el-menu-item>
    <!-- <el-menu-item index="/modify">
        <i class="el-icon-edit"></i>
        资产信息修改
    </el-menu-item>
    <el-menu-item index="/scrap">
        <i class="el-icon-delete"></i>
        资产废弃
    </el-menu-item> -->
  </el-menu>
</template>

<script>
export default {
  data() {
    return {
        navList:[
            {name:'/homepage',navItem:'首页'},
            {name:'/add',navItem:'资产录入'},
            {name:'/query',navItem:'资产查询'},
            // {name:'/modify',navItem:'资产信息修改'},
            // {name:'/scrap',navItem:'资产废弃'},
        ]
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(`key=${key}, keyPath=${keyPath}`);
    //   this.$router.push({path: key}).catch(err => {err});
    //   console.log("goto newpages")
    }
  }
};
</script>

<style>
.el-menu-item{
    text-align: left;
}
</style>