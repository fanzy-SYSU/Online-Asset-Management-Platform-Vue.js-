<template>
    <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="设备类型：">
            <el-select v-model="form.itemType" placeholder="请选择设备类型">
                <el-option label="设备" value="device"></el-option>
                <el-option label="物品" value="item"></el-option>
            </el-select>
        </el-form-item>
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
        <el-form-item label="资产详细信息">
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
            form: {
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
        onSubmit() {
            console.log("Submit!")
            console.log(this.form)
            if (this.form.itemType == '' || this.form.keeper == '' || this.form.supervisor == '' || this.form.cfrom == '' || this.form.message == '') {
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
                        // 'Authorization': `Bearer ${self.$cookie.get('TOKEN')}`
                    }
                })
                    .then(data => {
                        if (data.data.result) {
                            self.$notify({
                                title: '成功',
                                message: '录入成功！',
                                type: 'success'
                            })
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