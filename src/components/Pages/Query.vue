<template>
  <div>
    <el-checkbox-group v-model="checkList">
      <el-checkbox label="设备号" @change="change_sn">
        设备号
        <el-input
          v-model="search_sn"
          placeholder="请输入设备号"
          style="width:200px"
          v-if="search_sn_checked"
          @keyup.enter.native="onQuery(1)"
        ></el-input>
      </el-checkbox>
      <el-checkbox label="mac地址" @change="change_mac">
        mac地址
        <el-input
          v-model="search_mac"
          placeholder="请输入mac地址"
          style="width:200px"
          v-if="search_mac_checked"
          @keyup.enter.native="onQuery(1)"
        ></el-input>
      </el-checkbox>
      <el-checkbox label="使用人" @change="change_keeper">
        使用人
        <el-input
          v-model="search_keeper"
          placeholder="请输入使用人"
          style="width:150px"
          v-if="search_keeper_checked"
          @keyup.enter.native="onQuery(1)"
        ></el-input>
      </el-checkbox>
      <el-checkbox label="负责人" @change="change_supervisor">
        负责人
        <el-input
          v-model="search_supervisor"
          placeholder="请输入负责人"
          style="width:150px"
          v-if="search_supervisor_checked"
          @keyup.enter.native="onQuery(1)"
        ></el-input>
      </el-checkbox>
      <el-checkbox label="录入日期" @change="change_record_time">
        录入日期
        <el-date-picker
          v-model="search_record_time"
          type="date"
          placeholder="选择日期"
          v-if="search_record_time_checked"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-checkbox>
      <el-checkbox label="资产号" @change="change_item_id">
        资产号
        <el-input
          v-model="search_item_id_left"
          placeholder="请输入资产号"
          style="width:200px"
          v-if="search_item_id_checked"
          @keyup.enter.native="onQuery(1)"
        ></el-input>
      </el-checkbox>
      <el-checkbox label="资产号起止" @change="change_item_id_2">
        资产号起止
        <el-input
          v-model="search_item_id_left"
          placeholder="请输入资产号起始"
          style="width:200px"
          v-if="search_item_id_2_checked"
        ></el-input>&nbsp;&nbsp;
        <el-input
          v-model="search_item_id_right"
          placeholder="请输入资产号终止"
          style="width:200px"
          v-if="search_item_id_2_checked"
          @keyup.enter.native="onQuery(1)"
        ></el-input>
      </el-checkbox>
    </el-checkbox-group>
    <el-divider></el-divider>
    <el-button @click="clear">清空</el-button>
    <el-button type="primary" @click="onQuery(1)">查找</el-button>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="item_id" label="资产号" width="120"></el-table-column>
      <el-table-column prop="item_type" label="类型" width="70"></el-table-column>
      <el-table-column prop="message" label="资产信息" width="120"></el-table-column>
      <el-table-column prop="sn" label="设备号" width="130"></el-table-column>
      <el-table-column prop="mac" label="mac地址" width="160"></el-table-column>
      <el-table-column prop="status" label="状态" width="70"></el-table-column>
      <el-table-column prop="keeper" label="使用人" width="100"></el-table-column>
      <el-table-column prop="supervisor" label="负责人" width="100"></el-table-column>
      <el-table-column prop="cfrom" label="来源" width="90"></el-table-column>
      <el-table-column prop="record_time" label="录入日期" width="160"></el-table-column>
      <el-table-column prop="modify_time" label="修改日期" width="160"></el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            @click="handleModify(scope.row)"
            type="primary"
            size="small"
            icon="el-icon-edit"
            v-if="modifyRender(scope.row)"
          ></el-button>
          <el-dialog title="资产信息修改" :visible.sync="dialogFormVisible" :append-to-body="true">
            <el-form :model="editDialogData">
              <el-form-item label="资产号" label-width="120px">
                <el-input v-model="editDialogData.item_id" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="使用人" label-width="120px">
                <el-input v-model="editDialogData.keeper"></el-input>
              </el-form-item>
              <el-form-item label="负责人" label-width="120px">
                <el-input v-model="editDialogData.supervisor"></el-input>
              </el-form-item>
              <el-form-item label="状态" label-width="120px">
                <el-select v-model="editDialogData.status" placeholder="请选择状态">
                  <el-option label="库存" value="库存"></el-option>
                  <el-option label="借出" value="借出"></el-option>
                  <el-option label="转移" value="转移"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="handleModifyConfirm">确 定</el-button>
              <el-button @click="dialogFormVisible = false">取 消</el-button>
            </div>
          </el-dialog>

          <el-button
            @click="handleDelete(scope.row)"
            type="danger"
            size="small"
            icon="el-icon-delete"
            v-if="deleteRender(scope.row)"
          ></el-button>

          <el-button
            @click="handleHistoryOpen(scope.row.item_id)"
            type="info"
            size="small"
            icon="el-icon-document"
          ></el-button>
          <el-dialog title="资产历史信息" :visible.sync="historyDialogVisible" :append-to-body="true">
            <el-table :data="editHistory" stripe style="width: 100%">
              <el-table-column prop="modify_history" label="历史修改信息"></el-table-column>
            </el-table>

            <div class="block">
              <el-pagination
                layout="prev, pager, next"
                :total="history_totalRow"
                :current-page="history_page"
                @current-change="handleHistoryPageChange"
              ></el-pagination>
            </div>

            <span slot="footer" class="dialog-footer">
              <el-button @click="historyDialogVisible = false">确认</el-button>
            </span>
          </el-dialog>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        layout="prev, pager, next"
        :total="totalRow"
        :current-page="page"
        @current-change="handlePageChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      checkList: [],
      search_sn: "",
      search_mac: "",
      search_keeper: "",
      search_supervisor: "",
      search_record_time: "",
      search_item_id: "",
      search_item_id_left: "",
      search_item_id_right: "",
      search_sn_checked: false,
      search_mac_checked: false,
      search_keeper_checked: false,
      search_supervisor_checked: false,
      search_record_time_checked: false,
      search_item_id_checked: false,
      search_item_id_2_checked: false,
      page: 1,
      totalRow: 0,
      rowsPerPage: 10,
      dialogFormVisible: false,
      deleteDialogVisible: false,
      historyDialogVisible: false,
      editDialogData: [],
      deleteDialogData: [],
      deleteReason: {
        data: ""
      },
      editHistory: [],
      history_page: 1,
      history_totalRow: 0,
      history_id: "",
      tableData: [],
      afterDelete: false
    };
  },
  methods: {
    change_sn(e) {
      this.search_sn_checked = e ? true : false;
      if (!e) this.search_sn = "";
    },
    change_mac(e) {
      this.search_mac_checked = e ? true : false;
      if (!e) this.search_mac = "";
    },
    change_keeper(e) {
      this.search_keeper_checked = e ? true : false;
      if (!e) this.search_keeper = "";
    },
    change_supervisor(e) {
      this.search_supervisor_checked = e ? true : false;
      if (!e) this.search_supervisor = "";
    },
    change_record_time(e) {
      this.search_record_time_checked = e ? true : false;
      if (!e) this.search_record_time = "";
    },
    change_item_id(e) {
      this.search_item_id_checked = e ? true : false;
      if (e) {
        if (this.checkList.includes("资产号起止")) {
          this.checkList.splice(this.checkList.length - 1, 1);
          this.$notify({
            title: "警告",
            message: "禁止同时选取“资产号”和“资产号起止”",
            type: "error"
          });
          this.search_item_id_checked = false;
        }
      }
      if (!e) this.search_item_id_left = "";
    },
    change_item_id_2(e) {
      this.search_item_id_2_checked = e ? true : false;
      if (e) {
        if (this.checkList.includes("资产号")) {
          this.checkList.splice(this.checkList.length - 1, 1);
          this.$notify({
            title: "警告",
            message: "禁止同时选取“资产号”和“资产号起止”",
            type: "warning"
          });
          this.search_item_id_2_checked = false;
        }
      }
      if (!e) {
        this.search_item_id_left = "";
        this.search_item_id_right = "";
      }
    },
    clear() {
      this.search_sn = "";
      this.search_sn_checked = false;
      this.search_mac = "";
      this.search_mac_checked = false;
      this.search_keeper = "";
      this.search_keeper_checked = false;
      this.search_supervisor = "";
      this.search_supervisor_checked = false;
      this.search_record_time = "";
      this.search_record_time_checked = false;
      this.search_item_id_checked = false;
      this.search_item_id_left = "";
      this.search_item_id_right = "";
      this.search_item_id_2_checked = false;
      this.checkList = [];
    },
    modifyRender(data) {
      if (data.status == "废弃") {
        return false;
      } else {
        return true;
      }
    },
    deleteRender(data) {
      if (data.status == "废弃") {
        return false;
      } else {
        return true;
      }
    },
    onQuery(current) {
      let self = this;
      self.page = current;
      var url = `http://47.96.132.244:8087/admin/searchByCase`;
      axios
        .post(
          url,
          {
            rowsPerPage: 10,
            page: self.page,
            itemIdOne: self.search_item_id_left,
            itemIdTwo: self.search_item_id_right,
            keeper: self.search_keeper,
            supervisor: self.search_supervisor,
            mac: self.search_mac,
            sn: self.search_sn,
            recordTime: self.search_record_time
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
              title: "查询失败",
              message: "当前登录已过期，请重新登录！",
              type: "error"
            });
            this.$cookie.delete("TOKEN");
            this.$cookie.delete("AUTHORITY");
            this.$cookie.delete("USERNAME");
            this.$router.replace({ path: "/login" });
            return;
          }
          if (data.data.total == 0 && !self.afterDelete) {
            self.$notify({
              title: "警告",
              message: "无满足条件的查询结果！",
              type: "warning"
            });
          }
          self.totalRow = data.data.total;
          self.tableData = data.data.list;
          self.afterDelete = false;
        })
        .catch(err => {
          self.$notify({
            title: "错误",
            message: "网络连接错误",
            type: "error"
          });
          console.log(err);
        });
    },
    handleModify(data) {
      this.dialogFormVisible = true;
      this.editDialogData = data;
    },
    handleModifyConfirm() {
      this.dialogFormVisible = false;
      let self = this;
      axios
        .post(
          "http://47.96.132.244:8087/admin/editItem",
          {
            itemId: self.editDialogData.item_id,
            keeper: self.editDialogData.keeper,
            supervisor: self.editDialogData.supervisor,
            status: self.editDialogData.status,
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
              title: "修改失败",
              message: "当前登录已过期，请重新登录！",
              type: "error"
            });
            this.$cookie.delete("TOKEN");
            this.$cookie.delete("AUTHORITY");
            this.$cookie.delete("USERNAME");
            this.$router.replace({ path: "/login" });
            return;
          }
          if (data.data.result) {
            self.$notify({
              title: "成功",
              message: "修改成功！",
              type: "success"
            });
            self.onQuery(1);
          } else {
            self.$notify({
              title: "失败",
              message: "修改失败！",
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
    },
    change() {
      this.$forceUpdate();
    },
    handleDelete(data) {
      let self = this;
      this.$prompt("请输入报废理由", "确认报废", {
        confirmButtonText: "确认报废",
        cancelButtonText: "取消",
        inputPlaceholder: "请输入报废理由",
        inputErrorMessage: "输入不能为空",
        inputValidator: value => {
          // 验证内容不能为空
          if (!value) {
            return "输入不能为空";
          }
        }
      })
        .then(({ value }) => {
          axios
            .post(
              "http://47.96.132.244:8087/admin/retire",
              {
                itemId: data.item_id,
                recorder: self.$cookie.get("USERNAME"),
                detail: value
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
                  title: "报废失败",
                  message: "当前登录已过期，请重新登录！",
                  type: "error"
                });
                this.$cookie.delete("TOKEN");
                this.$cookie.delete("AUTHORITY");
                this.$cookie.delete("USERNAME");
                this.$router.replace({ path: "/login" });
                return;
              }
              if (data.data.result) {
                self.$notify({
                  title: "成功",
                  message: "报废成功！",
                  type: "success"
                });
                self.afterDelete = true;
                self.onQuery(1);
              } else {
                self.$notify({
                  title: "失败",
                  message: "报废失败！",
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
        })
        .catch(() => {
          self.$notify({
            title: "取消",
            message: "取消报废",
            type: "warning"
          });
        });
    },
    handleHistoryOpen(data) {
      this.history_page = 1;
      this.handleHistory(data);
    },
    handleHistory(data) {
      let self = this;
      self.history_id = data;
      axios
        .post(
          "http://47.96.132.244:8087/admin/history",
          {
            rowsPerPage: self.rowsPerPage,
            page: self.history_page,
            itemId: data
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
              title: "获取失败",
              message: "当前登录已过期，请重新登录！",
              type: "error"
            });
            this.$cookie.delete("TOKEN");
            this.$cookie.delete("AUTHORITY");
            this.$cookie.delete("USERNAME");
            this.$router.replace({ path: "/login" });
            return;
          }
          self.editHistory = data.data.list;
          self.history_totalRow = data.data.total;
        })
        .catch(err => {
          self.$notify({
            title: "错误",
            message: "网络连接错误",
            type: "error"
          });
          console.log(err);
        });
      this.historyDialogVisible = true;
    },
    handleHistoryPageChange(c) {
      this.history_page = c;
      this.handleHistory(this.history_id);
    },
    handlePageChange(e) {
      this.onQuery(e);
    }
  }
};
</script>

<style>
</style>
