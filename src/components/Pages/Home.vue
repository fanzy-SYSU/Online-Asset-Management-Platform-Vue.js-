<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="item_id" label="资产号" width="180"></el-table-column>
        <!-- <el-table-column prop="time" label="变更时间" width="200"></el-table-column> -->
        <el-table-column prop="modify_history" label="变更情况"></el-table-column>
    </el-table>

    <div class="append">
        最多展示最近10条变更记录
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      tableData: []
    };
  },
  beforeMount() {
    let self = this;
    axios
        .get('http://127.0.0.1:8087/admin/lately', {
            headers: {
                "token": this.$cookie.get('TOKEN')
                // 'Authorization': `Bearer ${self.$cookie.get('TOKEN')}`
            }
        })
        .then(data => {
            self.tableData = data.data.list;
        })
        .catch(err => {
            self.$notify({
                title: '初始化失败',
                message: '网络连接错误',
                type: 'error'
            })
            console.log(err);
        })
    }
};
</script>

<style>
.append {
    font-weight: 400;
    color: rgb(124, 118, 118);
    font-size: 15px;
    margin-top: 15px;
}
</style>