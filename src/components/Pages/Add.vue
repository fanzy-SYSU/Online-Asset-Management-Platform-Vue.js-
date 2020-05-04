<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <!-- 另一种风格的资产号获取
    <el-form-item label="资产号：">
      <el-button type="primary" @click="onApply" v-if="visible_apply()">点击获取资产号</el-button>
      <el-input v-model="form.item_id" :disabled="true" v-if="!visible_apply()"></el-input>
    </el-form-item> -->
    <el-form-item label="资产号：">
      <el-input v-model="form.item_id" :disabled="!visible_apply()" v-on:click.native="onApply" placeholder="点击获取资产号"></el-input>
    </el-form-item>
    <el-form-item label="设备类型：">
      <el-select v-model="form.itemType" placeholder="请选择设备类型">
        <el-option label="设备" value="device"></el-option>
        <el-option label="物品" value="item"></el-option>
      </el-select>
    </el-form-item>
    <!-- 使用v-if来实现选项决定下面输入框的显示 -->
    <el-form-item label="设备号：" prop="sn" v-if="visible()">
      <el-input v-model="form.sn"></el-input>
    </el-form-item>
    <el-form-item label="mac地址：" prop="mac" v-if="visible()">
      <el-input v-model="form.mac"></el-input>
    </el-form-item>
    <el-form-item label="使用人：" prop="keeper">
      <el-input v-model="form.keeper"></el-input>
    </el-form-item>
    <el-form-item label="负责人：" prop="supervisor">
      <el-input v-model="form.supervisor"></el-input>
    </el-form-item>
    <el-form-item label="来源：" prop="cfrom">
      <el-input v-model="form.cfrom"></el-input>
    </el-form-item>
    <el-form-item label="资产详细信息：">
      <el-input v-model="form.message" @keyup.enter.native="onSubmit" type="textarea" :rows="3"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import axios from "axios";
export default {
  data() {
    var mac_check = (rule, value, callback) => {
      let reg = /((([a-f0-9]{2}:){5})|(([a-f0-9]{2}-){5}))[a-f0-9]{2}/gi;
      if (!value) {
        return callback(new Error('必填'))
      }
      setTimeout(() => {
        if (reg.test(value)) {
          callback();
        }
        else {
          callback(new Error('请输入正确的mac格式！'));
        }
      }, 10)
    };
    var sn_check = (rule, value, callback) => {
      let reg = /^\d{12}$/;
      if (!value) {
        return callback(new Error('必填'))
      }
      setTimeout(() => {
        if (reg.test(value)) {
          callback();
        } 
        else {
          callback(new Error('请输入正确的sn格式！'));
        }
      })
    }
    return {
      done: false,
      form: {
        item_id: "",
        itemType: "",
        sn: "",
        mac: "",
        keeper: "",
        supervisor: "",
        cfrom: "",
        message: ""
      },
      rules: {
        sn: [
          { required: true, validator: sn_check, trigger: 'blur' }
        ],
        mac: [
          { required: true, validator: mac_check, trigger: 'blur' }
        ],
        keeper: [
          { required: true, message: '必填' }
        ],
        supervisor: [
          { required: true, message: '必填' }
        ],
        cfrom: [
          { required: true, message: '必填' }
        ],
      }
    };
  },
  methods: {
    visible() {
      if (this.form.itemType == "device") {
        return true;
      } else {
        return false;
      }
    },
    visible_apply() {
      if (!this.done) {
        return true;
      }
      else {
        return false; 
      }
    },
    onApply() {
      if (this.done) {
        this.$notify({
          title: "警告",
          message: `请勿重复获取资产号`,
          type: "warning"
        });
        return;
      }
      let self = this;
      axios
        .get("http://47.96.132.244:8087/admin/apply", {
          headers: {
            token: this.$cookie.get("TOKEN")
          }
        })
        .then(data => {
          if (data.data.msg == "授权已过期") {
            self.$notify({
              title: '资产号获取失败',
              message: '当前登录已过期，请重新登录！',
              type: 'error'
            })
            this.$cookie.delete("TOKEN");
            this.$cookie.delete("AUTHORITY");
            this.$cookie.delete("USERNAME");
            this.$router.replace({ path: "/login" });
            return;
          }
          self.form.item_id = data.data.itemId;
          self.$notify({
            title: "资产号获取成功",
            message: `已获取资产号[${data.data.itemId}]`,
            type: "success"
          });
          // 做标记
          self.done = true;
          self.$cookie.set("ADDING", "ongoing");
        })
        .catch(err => {
          self.$notify({
            title: "资产号获取失败",
            message: "网络连接错误",
            type: "error"
          });
          console.log(err);
        });
    },
    onSubmit() {
      // 防止未填写表单内容
      let mac_reg = /((([a-f0-9]{2}:){5})|(([a-f0-9]{2}-){5}))[a-f0-9]{2}/gi;
      if (this.form.item_id == "") {
        this.$notify({
          title: "警告",
          message: "请先获取资产号",
          type: "warning"
        });
      } else if (
        this.form.itemType == "" ||
        this.form.keeper == "" ||
        this.form.supervisor == "" ||
        this.form.cfrom == ""
      ) {
        this.$notify({
          title: "警告",
          message: "输入内容不能为空",
          type: "warning"
        });
      } else if (
        this.form.itemType == "device" &&
        (this.form.sn == "" || this.form.mac == "")
      ) {
        this.$notify({
          title: "警告",
          message: "输入内容不能为空",
          type: "warning"
        });
      } else if (
        !mac_reg.test(this.form.mac) && this.form.itemType == 'device'
      ) {
        this.$notify({
          title: "警告",
          message: "请输入合法的mac地址",
          type: "warning"
        });
      } else {
        let self = this;
        axios
          .post(
            "http://47.96.132.244:8087/admin/addDevice",
            {
              itemId: self.form.item_id,
              itemType: self.form.itemType,
              sn: self.form.sn, // DEVICE ONLY
              mac: self.form.mac, // DEVICE ONLY
              keeper: self.form.keeper,
              supervisor: self.form.supervisor,
              status: '库存',
              cfrom: self.form.cfrom,
              message: self.form.message,
              operator: self.$cookie.get("USERNAME")
            },
            {
              headers: {
                token: this.$cookie.get("TOKEN")
              }
            }
          )
          .then(data => {
            if (data.data.msg == "授权已过期") {
              self.$notify({
                title: '录入失败',
                message: '当前登录已过期，请重新登录！',
                type: 'error'
              })
              this.$cookie.delete("TOKEN");
              this.$cookie.delete("AUTHORITY");
              this.$cookie.delete("USERNAME");
              this.$router.replace({ path: "/login" });
              return;
            }
            if (data.data.result) {
              self.$cookie.delete("ADDING");
              self.$notify({
                title: "成功",
                message: `录入成功！资产号为${data.data.itemId}`,
                type: "success"
              });
              setTimeout(() => {
                self.$router.go(0); // 录入完自动刷新页面
              }, 3000)
            } else {
              self.$notify({
                title: "警告",
                message: "录入失败！",
                type: "warning"
              });
            }
          })
          .catch(err => {
            self.$notify({
              title: "错误",
              message: "网络连接错误",
              type: "error"
            });
            console.log(err);
          });
      }
    }
  },
  destroyed: function() {
    if (this.$cookie.get("ADDING") == "ongoing") {
      let self = this;
      // 模拟打印失败
      axios
        .get("http://47.96.132.244:8087/admin/printerError", {
          headers: {
            token: this.$cookie.get("TOKEN")
          }
        })
        .then(() => {
          self.$notify({
            title: "警告",
            message: `录入中断！`,
            type: "warning"
          });
        })
        .catch(err => {
          self.$notify({
            title: "页面跳转错误",
            message: "网络连接错误",
            type: "error"
          });
          console.log(err);
        });
    }
  }
};
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