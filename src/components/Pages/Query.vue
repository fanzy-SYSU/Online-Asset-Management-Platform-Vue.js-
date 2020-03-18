<template>
  <el-tabs type="border-card" @tab-click="onQuery(1)" v-model="tabKey">
    <el-tab-pane>
      <span slot="label">
        <i class="el-icon-folder-opened"></i> 全部资产
      </span>

      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="item_id" label="资产号" width="120"></el-table-column>
        <el-table-column prop="item_type" label="类型" width="70"></el-table-column>
        <el-table-column prop="message" label="资产信息" width="120"></el-table-column>
        <el-table-column prop="sn" label="设备号" width="100"></el-table-column>
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
            ></el-button>
            <el-dialog title="确认报废" :visible.sync="deleteDialogVisible" :append-to-body="true">
              <el-form :model="deleteReason">
                <el-form-item label="报废理由" label-width="120px">
                  <el-input type="textarea" :rows="3" v-modle="deleteReason.data" placeholder="请输入报废理由" clearable></el-input>
                </el-form-item>
              </el-form>
              <!-- <span>确认报废{{ distinguish() }} [{{ deleteDialogData.item_id }}]{{ deviceDetails() }} 吗？</span> -->
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleDeleteConfirm">确 定</el-button>
                <el-button @click="deleteDialogVisible = false">取 消</el-button>
              </div>
            </el-dialog>

            <el-button
              @click="handleHistoryOpen(scope.row.item_id)"
              type="info"
              size="small"
              icon="el-icon-search"
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
    </el-tab-pane>
    <el-tab-pane>
      <span slot="label">
        <i class="el-icon-monitor"></i> 设备
      </span>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="item_id" label="资产号" width="120"></el-table-column>
        <el-table-column prop="message" label="设备信息" width="120"></el-table-column>
        <el-table-column prop="sn" label="设备号" width="100"></el-table-column>
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
            ></el-button>
            <el-dialog title="设备信息修改" :visible.sync="dialogFormVisible" :append-to-body="true">
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
            ></el-button>
            <el-dialog title="确认报废" :visible.sync="deleteDialogVisible" :append-to-body="true">
              <el-form :model="deleteReason">
                <el-form-item label="报废理由" label-width="120px">
                  <el-input type="textarea" :rows="3" v-modle="deleteReason.data" placeholder="请输入报废理由" clearable></el-input>
                </el-form-item>
              </el-form>
              <!-- <span>确认报废{{ distinguish() }} [{{ deleteDialogData.item_id }}]{{ deviceDetails() }} 吗？</span> -->
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleDeleteConfirm">确 定</el-button>
                <el-button @click="deleteDialogVisible = false">取 消</el-button>
              </div>
            </el-dialog>

            <el-button
              @click="handleHistoryOpen(scope.row.item_id)"
              type="info"
              size="small"
              icon="el-icon-search"
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
    </el-tab-pane>
    <el-tab-pane>
      <span slot="label">
        <i class="el-icon-suitcase"></i> 物品
      </span>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="item_id" label="资产号" width="120"></el-table-column>
        <el-table-column prop="message" label="物品信息" width="120"></el-table-column>
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
            ></el-button>
            <el-dialog title="物品信息修改" :visible.sync="dialogFormVisible" :append-to-body="true">
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
            ></el-button>
            <el-dialog title="确认报废" :visible.sync="deleteDialogVisible" :append-to-body="true">
              <el-form :model="deleteReason">
                <el-form-item label="报废理由" label-width="120px">
                  <el-input type="textarea" :rows="3" v-modle="deleteReason.data" placeholder="请输入报废理由" clearable></el-input>
                </el-form-item>
              </el-form>
              <!-- <span>确认报废{{ distinguish() }} [{{ deleteDialogData.item_id }}]{{ deviceDetails() }} 吗？</span> -->
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleDeleteConfirm">确 定</el-button>
                <el-button @click="deleteDialogVisible = false">取 消</el-button>
              </div>
            </el-dialog>

            <el-button
              @click="handleHistoryOpen(scope.row.item_id)"
              type="info"
              size="small"
              icon="el-icon-search"
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
    </el-tab-pane>
    <el-tab-pane>
      <span slot="label">
        <i class="el-icon-delete"></i> 废弃资产
      </span>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="item_id" label="资产号" width="120"></el-table-column>
        <el-table-column prop="item_type" label="类型" width="70"></el-table-column>
        <el-table-column prop="message" label="资产信息" width="120"></el-table-column>
        <el-table-column prop="detail" label="报废理由" width="130"></el-table-column>
        <el-table-column prop="keeper" label="使用人" width="100"></el-table-column>
        <el-table-column prop="supervisor" label="负责人" width="100"></el-table-column>
        <el-table-column prop="record_time" label="录入日期" width="160"></el-table-column>
        <el-table-column prop="retire_time" label="报废日期" width="160"></el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              @click="handleHistoryOpen(scope.row.item_id)"
              type="info"
              size="small"
              icon="el-icon-search"
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
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      page: 1,
      totalRow: 0,
      rowsPerPage: 10,
      tabKey: "0", // 0, 1, 2, 3
      dialogFormVisible: false,
      deleteDialogVisible: false,
      historyDialogVisible: false,
      editDialogData: [],
      deleteDialogData: [],
      deleteReason: {
        data: ''
      },
      editHistory: [],
      history_page: 1,
      history_totalRow: 0,
      history_id: "",
      tableData: [
        // {
        //     "item_id": "201911250003",
        //     "itemType": "device",
        //     "sn": "10000001",
        //     "mac": "00-01-6C-06-A1-23",
        //     "keeper": "Tom",
        //     "supervisor": "Tom",
        //     "status": "using",
        //     "cfrom": "shcool",
        //     "recordTime": "2019-11-25 15:53:17",
        //     "modifyTime": "2019-11-25 15:53:17"
        // },
        // {
        //     "item_id": "201911250004",
        //     "itemType": "device",
        //     "sn": "10000002",
        //     "mac": "00-01-6C-06-A1-24",
        //     "keeper": "Tom",
        //     "supervisor": "Tom",
        //     "status": "using",
        //     "cfrom": "shcool",
        //     "recordTime": "2019-11-25 15:54:17",
        //     "modifyTime": "2019-11-25 15:54:17"
        // },
        // {
        //     "item_id": "201911260001",
        //     "itemType": "device",
        //     "sn": "10000004",
        //     "mac": "00-01-6C-06-A1-31",
        //     "keeper": "Nico",
        //     "supervisor": "Simon",
        //     "status": "using",
        //     "cfrom": "libary",
        //     "recordTime": "2019-11-26 20:05:23",
        //     "modifyTime": "2019-11-28 00:53:24"
        // },
        // {
        //     "item_id": "201911260002",
        //     "itemType": "device",
        //     "sn": "10000005",
        //     "mac": "00-01-6C-06-A1-11",
        //     "keeper": "Simon",
        //     "supervisor": "Simon",
        //     "status": "using",
        //     "cfrom": "libary",
        //     "recordTime": "2019-11-26 20:05:41",
        //     "modifyTime": "2019-11-26 20:05:41"
        // },
        // {
        //     "item_id": "201911260003",
        //     "itemType": "device",
        //     "sn": "10000006",
        //     "mac": "00-01-6C-06-A1-11",
        //     "keeper": "Simon",
        //     "supervisor": "Simon",
        //     "status": "using",
        //     "cfrom": "libary",
        //     "recordTime": "2019-11-26 20:05:46",
        //     "modifyTime": "2019-11-26 20:05:46"
        // },
        // {
        //     "item_id": "201911260004",
        //     "itemType": "device",
        //     "sn": "10000007",
        //     "mac": "00-01-6C-06-A1-11",
        //     "keeper": "Simon",
        //     "supervisor": "Simon",
        //     "status": "using",
        //     "cfrom": "libary",
        //     "recordTime": "2019-11-26 20:05:51",
        //     "modifyTime": "2019-11-26 20:05:51"
        // },
        // {
        //     "item_id": "201911260013",
        //     "itemType": "item",
        //     "sn": null,
        //     "mac": null,
        //     "keeper": "Simon",
        //     "supervisor": "Simon",
        //     "status": "using",
        //     "cfrom": "school",
        //     "recordTime": "2019-11-26 20:19:56",
        //     "modifyTime": "2019-11-26 20:19:56"
        // },
        // {
        //     "item_id": "201911260014",
        //     "itemType": "item",
        //     "sn": null,
        //     "mac": null,
        //     "keeper": "Simon",
        //     "supervisor": "Simon",
        //     "status": "using",
        //     "cfrom": "school",
        //     "recordTime": "2019-11-26 20:19:57",
        //     "modifyTime": "2019-11-26 20:19:57"
        // },
        // {
        //     "item_id": "201911260015",
        //     "itemType": "item",
        //     "sn": null,
        //     "mac": null,
        //     "keeper": "Simon",
        //     "supervisor": "Simon",
        //     "status": "using",
        //     "cfrom": "school",
        //     "recordTime": "2019-11-26 20:19:57",
        //     "modifyTime": "2019-11-26 20:19:57"
        // },
        // {
        //     "item_id": "201911260016",
        //     "itemType": "item",
        //     "sn": null,
        //     "mac": null,
        //     "keeper": "Nico",
        //     "supervisor": "Jack",
        //     "status": "using",
        //     "cfrom": "libary",
        //     "recordTime": "2019-11-26 20:20:09",
        //     "modifyTime": "2019-11-28 20:45:38"
        // }
    ]
    };
  },
  beforeMount() {
    let self = this;
    axios
      .get(
        `http://127.0.0.1:8087/admin/serviceItem?rowsPerPage=${self.rowsPerPage}&page=${self.page}`,
        {
          headers: {
            token: this.$cookie.get("TOKEN")
            // 'Authorization': `Bearer ${self.$cookie.get('TOKEN')}`
          }
        }
      )
      .then(data => {
        self.totalRow = data.data.total;
        self.tableData = data.data.list;
      })
      .catch(err => {
        self.$notify({
          title: "初始化失败",
          message: "网络连接错误",
          type: "error"
        });
        console.log(err);
      });
  },
  methods: {
    onQuery(current) {
      let self = this;
      self.page = current;
      var url = "";
      if (self.tabKey == "0")
        url = `http://127.0.0.1:8087/admin/serviceItem?rowsPerPage=${self.rowsPerPage}&page=${self.page}`;
      else if (self.tabKey == "1")
        url = `http://127.0.0.1:8087/admin/device?rowsPerPage=${self.rowsPerPage}&page=${self.page}`;
      else if (self.tabKey == "2")
        url = `http://127.0.0.1:8087/admin/item?rowsPerPage=${self.rowsPerPage}&page=${self.page}`;
      else
        url = `http://127.0.0.1:8087/admin/retireItem?rowsPerPage=${self.rowsPerPage}&page=${self.page}`;
      console.log(self.tabKey);
      console.log(url);
      axios
        .get(url, {
          headers: {
            token: this.$cookie.get("TOKEN")
            // 'Authorization': `Bearer ${self.$cookie.get('TOKEN')}`
          }
        })
        .then(data => {
          self.totalRow = data.data.total;
          self.tableData = data.data.list;
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
          "http://127.0.0.1:8087/admin/editItem",
          {
            itemId: self.editDialogData.item_id,
            keeper: self.editDialogData.keeper,
            supervisor: self.editDialogData.supervisor,
            status: self.editDialogData.status
          },
          {
            headers: {
              token: this.$cookie.get("TOKEN")
              // 'Authorization': `Bearer ${self.$cookie.get('TOKEN')}`
            }
          }
        )
        .then(data => {
          if (data.data.result) {
            self.$notify({
              title: "成功",
              message: "修改成功！",
              type: "success"
            });
            self.$router.go(0);
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
      this.$forceUpdate()
    },
    handleDelete(data) {
      this.deleteDialogVisible = true;
      this.deleteDialogData = data;
    },
    handleDeleteConfirm() {
      this.deleteDialogVisible = false;
      let self = this;
      axios
        .post(
          "http://127.0.0.1:8087/admin/retire",
          {
            itemId: self.deleteDialogData.item_id,
            recorder: self.$cookie.get("USERNAME"),
            detail: self.deleteReason.data,
            // detail: "查询列表报废"
          },
          {
            headers: {
              token: this.$cookie.get("TOKEN")
              // 'Authorization': `Bearer ${self.$cookie.get('TOKEN')}`
            }
          }
        )
        .then(data => {
          if (data.data.result) {
            self.$notify({
              title: "成功",
              message: "报废成功！",
              type: "success"
            });
            self.$router.go(0);
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
          "http://127.0.0.1:8087/admin/history",
          {
            rowsPerPage: self.rowsPerPage,
            page: self.history_page,
            itemId: data
          },
          {
            headers: {
              token: this.$cookie.get("TOKEN")
              // 'Authorization': `Bearer ${self.$cookie.get('TOKEN')}`
            }
          }
        )
        .then(data => {
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
    // distinguish() {
    //   if (this.deleteDialogData.itemType == "device") {
    //     return "设备";
    //   } else {
    //     return "物品";
    //   }
    // },
    // deviceDetails() {
    //   if (this.deleteDialogData.itemType == "device") {
    //     return `（设备号：${this.deleteDialogData.sn}，mac地址：${this.deleteDialogData.mac}）`;
    //   } else {
    //     return "";
    //   }
    // },
  }
};
</script>

<style>
</style>
