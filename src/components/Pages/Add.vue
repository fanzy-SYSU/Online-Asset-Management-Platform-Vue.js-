<template>
    <el-form ref="form" :model="form" label-width="120px">
        <el-form-item>
            <el-button type="primary" @click="onApply">点击获取资产号</el-button>
        </el-form-item>
        <el-form-item label="资产号：">
            <el-input v-model="form.item_id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="设备类型：">
            <el-select v-model="form.itemType" placeholder="请选择设备类型">
                <el-option label="设备" value="device"></el-option>
                <el-option label="物品" value="item"></el-option>
            </el-select>
        </el-form-item>
        <!-- 使用v-if来实现选项决定下面输入框的显示 -->
        <el-form-item label="设备号：" v-if="visible()">
            <el-input v-model="form.sn"></el-input>
        </el-form-item>
        <el-form-item label="mac地址：" v-if="visible()">
            <el-input v-model="form.mac"></el-input>
        </el-form-item>
        <el-form-item label="使用人：">
            <el-input v-model="form.keeper"></el-input>
        </el-form-item>
        <el-form-item label="负责人：">
            <el-input v-model="form.supervisor"></el-input>
        </el-form-item>
        <el-form-item label="来源：">
            <el-input v-model="form.cfrom"></el-input>
        </el-form-item>
        <el-form-item label="资产详细信息：">
            <el-input v-model="form.message" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">提交</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            done: false,
            form: {
                item_id: '',
                itemType: '',
                sn: '',
                mac: '',
                keeper: '',
                supervisor: '',
                state: 'using',
                cfrom: '',
                message: ''
            }
        }
    },
    methods: {
        visible() {
            if (this.form.itemType == 'device') {
                return true;
            }
            else {
                return false;
            }
        },
        onApply() {
            if (this.done) {
                this.$notify({
                        title: '警告',
                        message: `请勿重复获取资产号`,
                        type: 'warning'
                    })
                return;
            }
            let self = this;
            axios
                .get('http://127.0.0.1:8087/admin/apply', {
                    headers: {
                        "token": this.$cookie.get('TOKEN')
                    }
                })
                .then(data => {
                    self.form.item_id = data.data.itemId;
                    self.$notify({
                        title: '资产号获取成功',
                        message: `已获取资产号[${data.data.itemId}]`,
                        type: 'success'
                    })
                    // 做标记
                    self.done = true;
                    self.$cookie.set("ADDING", "ongoing");
                })
                .catch(err => {
                    self.$notify({
                        title: '资产号获取失败',
                        message: '网络连接错误',
                        type: 'error'
                    })
                    console.log(err);
                })
        },
        onSubmit() {
            // 防止未填写表单内容
            if (this.form.item_id == '') {
                this.$notify({
                    title: '警告',
                    message: '请先获取资产号',
                    type: 'warning'
                })
            }
            else if (this.form.itemType == '' || this.form.keeper == '' || this.form.supervisor == '' || this.form.cfrom == '' || this.form.message == '') {
                this.$notify({
                    title: '警告',
                    message: '输入内容不能为空',
                    type: 'warning'
                })
            }
            else if (this.form.itemType == 'device' && (this.form.sn == '' || this.form.mac == '')) {
                this.$notify({
                    title: '警告',
                    message: '输入内容不能为空',
                    type: 'warning'
                })
            }
            else {
                let self = this;
                axios.post('http://127.0.0.1:8087/admin/addDevice', {
                    itemId: self.form.item_id,
                    itemType: self.form.itemType,
                    sn: self.form.sn, // DEVICE ONLY
                    mac: self.form.mac, // DEVICE ONLY
                    keeper: self.form.keeper,
                    supervisor: self.form.supervisor,
                    status: self.form.status,
                    cfrom: self.form.cfrom,
                    message: self.form.message,
                }, {
                    headers: {
                        "token": this.$cookie.get('TOKEN')
                    }
                })
                    .then(data => {
                        if (data.data.result) {
                            self.$notify({
                                title: '成功',
                                message: `录入成功！资产号为${data.data.itemId}`,
                                type: 'success'
                            })
                            self.$cookie.delete('ADDING');
                            self.$router.go(0); // 录入完自动刷新页面
                        }
                        else {
                            self.$notify({
                                title: '警告',
                                message: '录入失败！',
                                type: 'warning'
                            })
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
        }
    },
    destroyed: function () {
        if (this.$cookie.get("ADDING") == "ongoing") {
            let self = this;
            // 模拟打印失败
            axios
                .get('http://127.0.0.1:8087/admin/printerError', {
                    headers: {
                        "token": this.$cookie.get('TOKEN')
                    }
                })
                .then(() => {
                    self.$notify({
                        title: '警告',
                        message: `录入中断！`,
                        type: 'warning'
                    })
                })
                .catch(err => {
                    self.$notify({
                        title: '页面跳转错误',
                        message: '网络连接错误',
                        type: 'error'
                    })
                    console.log(err);
                })
        }
    }
}
</script>

<style>
.el-form {
    width: 400px;
    margin-left: 70px;
}
.el-select {
    width: 280px;
}
</style>