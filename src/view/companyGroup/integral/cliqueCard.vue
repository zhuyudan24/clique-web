<template>
  <div class="group-wrap">
    <div class="search-wrap clearfix">
      <div class="search-input fl">
        <el-input @keyup.enter.native="searchGroup" placeholder="请输入结算归属名称/code" prefix-icon="el-icon-search" v-model="searchValue" clearable> </el-input>
      </div>
      <div class="two-btn-wrap fr">
        <div class="el-button" plain>
          <span @click="dialogExportVisible = true">导入结算归属及门店</span
          ><el-popover class="item" placement="bottom" trigger="hover">
            <div class="popover-content-wrap">
              <p v-show="importTime">上次导入时间<br />{{ importTime }}</p>
              <el-button @click="downloadTpl" type="text" :class="{ fr: importTime != '' }">下载模板</el-button>
            </div>
            <i slot="reference" class="icon-more el-icon-more btn-icon-more"></i
          ></el-popover>
        </div>
        <el-button type="primary" @click="editCliqueGroup('add')" style="margin-left:8px;">创建结算归属</el-button>
        <el-tooltip class="item" effect="dark" content="按拼音首字母排序" placement="top-start">
          <i @click="sortLetter" class="iconfont icon-paixu1 my-icon-paixu" :class="{ on: sortType == 1 }"></i>
        </el-tooltip>
      </div>
    </div>
    <div class="group-list" v-loading="loading">
      <div v-if="totalCount > 0">
        <ul class="clearfix">
          <li v-for="(card, index) in cardList" :key="index">
            <div class="title clearfix">
              <h3 class="fl">{{ card.groupName }}</h3>
              <p class="fr">
                <el-popover class="item" placement="bottom" trigger="hover">
                  <div class="popover-group-content">
                    <p class="edit-btn"><el-button @click="editCliqueGroup('edit', card)" type="text">编辑</el-button></p>
                    <p class="del-btn"><el-button @click="delCliqueGroup(card, index)" type="text">删除</el-button></p>
                  </div>
                  <i slot="reference" class="icon-more el-icon-more"></i>
                </el-popover>
              </p>
            </div>
            <div class="group-info">
              <p class="group-code">code: {{ card.groupCode ? card.groupCode : '--' }}</p>
              <p>门店：{{ card.storeCount }}家</p>
            </div>
          </li>
        </ul>
        <div class="pagination" v-show="totalCount > 0">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[20, 40, 60, 80]" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="totalCount"> </el-pagination>
        </div>
      </div>
      <div v-else class="no-data-wrap">
        <span class="el-table__empty-text">暂无数据</span>
      </div>
    </div>
    <!-- 删除结算归属 -->
    <el-dialog title="删除提示" :visible.sync="dialogVisible" width="500px">
      <div class="del-wrap">
        <h3>确认将结算归属【{{ cliqueGroupName }}（{{ cliqueGroupCode }}）】删除？</h3>
        <p v-show="cliqueGroupNum > 0">删除后该结算归属下的门店（{{ cliqueGroupNum }}家）将变为无归属，请及时重新分配</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureDelBtn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑结算归属 -->
    <el-dialog :title="editTitle" :visible.sync="dialogEditVisible" :before-close="cancelEditBtn" width="500px">
      <div class="edit-wrap">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <el-form-item label="结算归属名称" prop="cliqueGroupName">
            <dm-input :byteType="1" type="text" v-model="ruleForm.cliqueGroupName" :maxlength="8"></dm-input>
          </el-form-item>
          <el-form-item label="结算归属code" prop="cliqueGroupCode">
            <dm-input :byteType="1" type="text" v-model="ruleForm.cliqueGroupCode" :maxlength="16"></dm-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEditBtn">取 消</el-button>
        <el-button type="primary" @click="sureEditBtn('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 导入提示 -->
    <el-dialog title="导入提示" :visible.sync="dialogExportVisible" width="510px">
      <div class="export-wrap">
        <div class="export-text">请选择导入方式</div>
        <div class="export-style">
          <div class="export-style-item">
            <el-radio v-model="exportStyle" label="1">追加</el-radio>
            <p>追加的门店名称及code不得与现有数据重复，请知悉</p>
          </div>
          <div class="export-style-item">
            <el-radio v-model="exportStyle" label="2">覆盖</el-radio>
            <p>覆盖原有数据</p>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogExportVisible = false">取 消</el-button>
        <el-upload action="/api-admin/clique-import-settlement" name="uploadFile" :show-file-list="false" :before-upload="beforeTextUpload" style="display:inline-block;margin-left:8px;">
          <el-button type="primary">确 定</el-button>
        </el-upload>
      </span>
    </el-dialog>
    <!-- 导入错误提示 -->
    <el-dialog title="导入错误提示" :visible.sync="dialogErrVisible" width="420px">
      <div class="del-wrap">
        <p>
          <span v-for="(item, index) in importErrList" :key="index">【{{ item.storeName }}（{{ item.storeCode }}）】</span>已存在/不存在，请核实后重新导入。
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogErrVisible = false" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { postRequest } from '@/api/api';
import { isCommonCodeLine, isNumCodeLine } from '../../../common/js/validate';
import { log } from '@/utils/index.js';
let commonCodeLine = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入结算归属名称'));
  } else if (!isCommonCodeLine(value)) {
    callback(new Error('结算归属名称只支持汉字、字母、数字和下划线（除首位外）'));
  } else {
    callback();
  }
};
let numCodeLine = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入结算归属code'));
  } else if (!isNumCodeLine(value)) {
    callback(new Error('结算归属code只支持字母、数字和下划线（除首位外）'));
  } else {
    callback();
  }
};
export default {
  name: 'cliqueCard',
  props: {
    enterpriseId: {
      type: String,
      default: ''
    },
    showAgainBool: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      repProjectName: 'gic-clique',
      searchValue: '',
      cardList: [],
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      dialogVisible: false,
      cliqueGroupName: '',
      cliqueGroupCode: '',
      cliqueGroupNum: null,
      integralSettlementGroupId: '',
      cliqueGroupIndex: 0,
      // 编辑
      dialogEditVisible: false,
      ruleForm: {
        cliqueGroupName: '',
        cliqueGroupCode: ''
      },
      editTitle: '新增结算归属',
      rules: {
        cliqueGroupName: [{ required: true, trigger: 'blur', validator: commonCodeLine }],
        cliqueGroupCode: [{ required: true, trigger: 'blur', validator: numCodeLine }]
      },
      loading: false,
      importTime: '',
      dialogExportVisible: false,
      exportStyle: '1',
      sortType: 1, // 排序
      dialogErrVisible: false, // 导入错误提示
      importErrList: []
    };
  },
  watch: {
    enterpriseId(val) {
      this.getCliquePage();
      this.getImportTime(); // 获取导入时间
    },
    showAgainBool(val) {
      this.getCliquePage();
      this.getImportTime(); // 获取导入时间
    }
  },
  methods: {
    // 搜索
    searchGroup() {
      this.currentPage = 1;
      this.getCliquePage();
    },
    // 获取某商户下的卡片列表
    getCliquePage() {
      this.loading = true;
      let para = {
        enterpriseId: this.enterpriseId,
        search: this.searchValue,
        sort: this.sortType,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      };
      postRequest('/api-admin/clique-page-group', para).then(res => {
        let data = res.data;
        this.loading = false;
        if (data.errorCode == 0) {
          this.cardList = data.result.result ? data.result.result : [];
          this.totalCount = data.result.totalCount;
        } else {
          this.$message.error(data.message);
        }
      });
    },
    // 选择分页符
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getCliquePage();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getCliquePage();
    },
    // 删除结算归属
    delCliqueGroup(item, index) {
      this.dialogVisible = true;
      this.integralSettlementGroupId = item.integralSettlementGroupId;
      this.cliqueGroupIndex = index;
      this.cliqueGroupName = item.groupName;
      this.cliqueGroupCode = item.groupCode ? item.groupCode : '--';
      this.cliqueGroupNum = item.storeCount;
    },
    sureDelBtn() {
      let para = {
        integralSettlementGroupId: this.integralSettlementGroupId
      };
      postRequest('/api-admin/clique-del-group', para).then(res => {
        let data = res.data;
        if (data.errorCode == 0) {
          this.dialogVisible = false;
          this.totalCount--;
          this.cardList.splice(this.cliqueGroupIndex, 1);
          if (this.cardList.length == 0) {
            if (this.currentPage > 1) {
              this.currentPage--;
              this.getCliquePage();
            }
          }
          this.$message.success('删除成功');
        } else {
          this.$message.error(data.message);
        }
      });
    },
    // 新增、编辑结算归属
    editCliqueGroup(type, item) {
      this.dialogEditVisible = true;
      if (type == 'add') {
        this.editTitle = '新增结算归属';
        this.integralSettlementGroupId = '';
        this.ruleForm.cliqueGroupName = '';
        this.ruleForm.cliqueGroupCode = '';
      } else if (type == 'edit') {
        this.editTitle = '编辑结算归属';
        this.integralSettlementGroupId = item.integralSettlementGroupId;
        this.ruleForm.cliqueGroupName = item.groupName;
        this.ruleForm.cliqueGroupCode = item.groupCode ? item.groupCode : '';
      }
    },
    // 新增结算归属取消按钮
    cancelEditBtn() {
      this.dialogEditVisible = false;
      this.$refs.ruleForm.clearValidate();
    },
    // 新增结算归属确认按钮
    sureEditBtn(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let para = {
            enterpriseId: this.enterpriseId,
            integralSettlementGroupId: this.integralSettlementGroupId,
            groupCode: this.ruleForm.cliqueGroupCode,
            groupName: this.ruleForm.cliqueGroupName
          };
          postRequest('/api-admin/clique-save-group', para).then(res => {
            let data = res.data;
            if (data.errorCode == 0) {
              this.dialogEditVisible = false;
              this.getCliquePage();
              this.$message.success('保存成功');
            } else {
              this.$message.error(data.message);
            }
          });
        } else {
          log('error');
          return false;
        }
      });
    },
    // 获取导入时间
    getImportTime() {
      let para = {
        enterpriseId: this.enterpriseId
      };
      postRequest('/api-admin/clique-last-import-time', para).then(res => {
        let data = res.data;
        if (data.errorCode == 0) {
          this.importTime = data.result.lastImportDate ? data.result.lastImportDate : '';
        } else {
          this.$message.error(data.message);
        }
      });
    },
    // 导入
    beforeTextUpload(uploadFile) {
      const isXls = uploadFile.name.substr(uploadFile.name.length - 3) === 'xls';
      if (!isXls) {
        this.$message.error('只能上传xls格式!');
        return;
      }
      let fd = new FormData();
      fd.append('file', uploadFile);
      fd.append('enterpriseId', this.enterpriseId);
      fd.append('type', this.exportStyle);
      fd.append('requestProject', 'gic-clique');
      this.axios.post('/api-admin/clique-import-settlement', fd).then(res => {
        let data = res.data;
        if (data.errorCode == 0) {
          this.dialogExportVisible = false;
          this.$message.success('导入成功');
          this.currentPage = 1;
          this.getCliquePage();
          this.getImportTime();
        } else if (data.errorCode == 1) {
          this.dialogErrVisible = true;
          this.importErrList = data.result ? data.result : [];
        } else {
          this.$message.error(data.message);
        }
      });
      return isXls || true;
    },
    //  下载模板
    downloadTpl() {
      let para = {};
      postRequest('/api-admin/download-clique-settlement', para).then(res => {
        let config = window.location.origin; // 获取域名和协议
        if (config.indexOf('localhost') > -1) {
          config = 'http://gicdev.demogic.com';
        }
        window.location.href = config + '/api-admin/download-clique-settlement?requestProject=' + this.repProjectName;
      });
    },
    // 字母排序
    sortLetter() {
      this.sortType = this.sortType == 1 ? 2 : 1;
      this.getCliquePage();
    }
  }
};
</script>
<style lang="less" scoped>
.group-wrap {
  padding: 24px;
  .search-input {
    width: 285px;
  }
  .group-list {
    margin-top: 24px;
    li {
      float: left;
      cursor: pointer;
      width: 258px;
      box-sizing: border-box;
      margin-right: 10px;
      margin-bottom: 10px;
      padding: 18px 20px 15px;
      border: 1px solid rgba(235, 238, 245, 1);
      box-shadow: 0px 1px 3px 0px rgba(220, 223, 230, 0.5);
      h3 {
        color: #303133;
        width: 180px;
        font-size: 16px;
        line-height: 22px;
        margin-bottom: 10px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      &:hover {
        margin-top: -5px;
        margin-bottom: 15px;
        box-shadow: 0px 1px 5px 0px rgba(220, 223, 230, 0.5);
      }
      .group-info {
        .group-code {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        p {
          color: #909399;
          font-size: 14px;
          line-height: 20px;
        }
      }
    }
  }
}
.icon-more {
  transform: rotate(90deg);
  color: #ccc;
  cursor: pointer;
}
.two-btn-wrap {
  font-size: 0;
}
.btn-icon-more {
  margin-left: 5px;
}
.popover-content-wrap p {
  font-size: 14px;
  color: #909399;
  line-height: 18px;
  margin-bottom: 15px;
  width: 150px;
}
.popover-group-content {
  font-size: 14px;
  .del-btn {
    padding-top: 20px;
  }
}
.popover-group-content /deep/ .el-button--text {
  color: #606266;
}
.popover-group-content .edit-btn /deep/ .el-button--text:hover {
  color: #1890ff;
}
.popover-group-content .del-btn /deep/ .el-button--text {
  color: #f5222d;
}
.popover-group-content .del-btn /deep/ .el-button--text:hover {
  color: #ff454f;
}
.my-icon-paixu {
  font-size: 16px;
  padding: 8px;
  margin-left: 8px;
  border-radius: 4px;
  color: #303133;
  cursor: pointer;
  &.on {
    background: #ebeef5;
  }
}
// 暂无数据
.no-data-wrap {
  height: 256px;
  text-align: center;
  font-size: 14px;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-pack: center;
  justify-content: center;
  -ms-flex-align: center;
  align-items: center;
}
.pagination {
  text-align: right;
  margin: 20px 0 10px 0;
}
.del-wrap {
  font-size: 14px;
  max-height: 300px;
  overflow: auto;
  h3 {
    color: #303133;
    line-height: 20px;
    margin-bottom: 12px;
  }
  p {
    color: #f5222d;
    line-height: 20px;
  }
}
// 导入
.export-wrap {
  display: flex;
  .export-text {
    flex: 0 0 100px;
    width: 100px;
  }
  .export-style {
    margin-left: 20px;
    flex: 1;
    .export-style-item {
      margin-bottom: 25px;
      p {
        color: #909399;
        margin-top: 5px;
        padding-left: 22px;
      }
    }
  }
}
</style>
