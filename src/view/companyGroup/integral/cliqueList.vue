<template>
  <div class="group-wrap">
    <div class="search-wrap clearfix">
      <el-input class="search-input" @keyup.enter.native="searchGroup" placeholder="请输入门店名称/code" prefix-icon="el-icon-search" v-model="searchValue" clearable> </el-input>
      <el-popover class="vertical-baseline" placement="bottom-start" width="214" trigger="click" v-model="popoverShow">
        <el-input @keyup.enter.native="searchAllBelong" placeholder="请输入内容" prefix-icon="el-icon-search" v-model="searchBelongVal"> </el-input>
        <el-checkbox-group v-if="optionsAll.length > 0" class="dm-checkbox-group" v-model="checkedList" @change="searchSelectBelong">
          <label :name="v.value" class="dm-store__type__item" v-for="(v, i) in optionsAll" :key="i">
            <el-checkbox :label="v.integralSettlementGroupId">{{ v.groupName }}</el-checkbox>
          </label>
        </el-checkbox-group>
        <p v-else class="no-search-belong-data">
          暂无数据
        </p>
        <div class="el-input dm-store__reference w240" slot="reference">
          <div class="el-input__inner dm-store__inputtag">
            <el-tag v-for="(v, i) in checkedList" size="small" :key="i" closable @close="delItem(v, i)">{{ filterLabel(v) }}</el-tag>
            <span class="gray-color dm-store__inputtag--tips" v-show="checkedList.length === 0">请选择结算归属</span>
          </div>
          <el-popover placement="top-start" popper-class="select-shop__popper" width="300" trigger="hover">
            <el-tag v-for="(v, i) in checkedList" class="dm-store__total--tag" size="small" :key="i" closable @close="delItem(v, i)">{{ filterLabel(v) }}</el-tag>
            <span slot="reference" class="dm-store__inputtag--total" v-show="checkedList.length">共{{ checkedList.length }}项</span>
          </el-popover>
        </div>
      </el-popover>

      <div class="fr">
        <el-button @click="changeBelong('all')" type="primary">变更结算归属</el-button>
        <el-button @click="releaseStore('all')" type="primary">释放</el-button>
      </div>
    </div>
    <div class="group-list" v-loading="loading">
      <el-table :data="tableData" @selection-change="handleSelectionChange" @sort-change="sortChange" style="width: 100%">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="storeName" label="门店名称">
          <template slot-scope="scope">
            <div class="store-name-wrap">
              <p class="first-item">{{ scope.row.storeName ? scope.row.storeName : '--' }}</p>
              <p class="second-item">code：{{ scope.row.storeCode ? scope.row.storeCode : '--' }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="groupName" label="结算归属" sortable="custom">
          <template slot-scope="scope">
            <div class="store-name-wrap">
              <p class="first-item">{{ scope.row.groupName ? scope.row.groupName : '--' }}</p>
              <p class="second-item">code：{{ scope.row.groupCode ? scope.row.groupCode : '--' }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="storeType" label="门店类型" sortable="custom">
          <template slot-scope="scope">
            <p v-if="scope.row.storeType == 0">自营</p>
            <p v-if="scope.row.storeType == 1">联营</p>
            <p v-if="scope.row.storeType == 2">加盟</p>
            <p v-if="scope.row.storeType == 3">代销</p>
            <p v-if="scope.row.storeType == 4">托管</p>
          </template>
        </el-table-column>
        <el-table-column prop="storeGroupName" label="门店分组"> </el-table-column>
        <el-table-column prop="opr" label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="changeBelong('only', scope.row)" type="text">变更归属</el-button>
            <el-button @click="releaseStore('only', scope.row)" type="text">释放</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination" v-show="totalCount > 0">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[20, 40, 60, 80]" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="totalCount"> </el-pagination>
      </div>
    </div>
    <!-- 选择结算归属 -->
    <el-dialog title="选择结算归属" :visible.sync="dialogVisible" width="330px">
      <div class="belong-wrap">
        <el-input placeholder="请输入门店名称/code" prefix-icon="el-icon-search" v-model="searchBelong" clearable> </el-input>
        <ul>
          <li @click="selectBelong(item, index)" class="clearfix" :class="{ on: curIndex == index }" v-for="(item, index) in options" :key="index">
            <p class="fl ">{{ item.groupName }}</p>
            <p class="fr second-item">code：{{ item.groupCode ? item.groupCode : '--' }}</p>
          </li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureSelectBtn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 释放 -->
    <el-dialog title="释放提示" :visible.sync="dialogVisible2" width="425px">
      <div class="del-wrap">
        <h3>释放后门店归属组为无归属，注意请及时重新分配</h3>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="sureReleaseBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { postRequest } from '@/api/api';
import { log } from '@/utils/index.js';
export default {
  name: 'cliqueList',
  props: {
    enterpriseId: {
      type: String,
      default: ''
    },
    showAgainBool: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      repProjectName: 'gic-clique',
      searchValue: '',
      optionsAll: [],
      optionsAllNew: [],
      options: [],
      groupIds: '',
      storeIds: '',
      storeIdArr: [],
      tableData: [],
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      newGroupId: '',
      dialogVisible: false,
      searchBelong: '',
      dialogVisible2: false,
      curIndex: -1,
      sortColumn: '1',
      sortType: 'asc', // 排序
      loading: false,
      popoverShow: false,
      checkedList: [],
      searchBelongVal: ''
    };
  },
  watch: {
    enterpriseId(val) {
      this.getCliquePage();
      this.getAllBelong();
      this.getManyBelong();
    },
    showAgainBool(val) {
      this.getCliquePage();
      this.getAllBelong();
      this.getManyBelong();
    }
  },
  methods: {
    filterLabel(val) {
      log(val);
      let result = '';
      this.optionsAllNew.map(v => {
        if (val === v.integralSettlementGroupId) {
          result = v.groupName;
        }
      });
      return result;
    },
    searchSelectBelong() {
      this.groupIds = this.checkedList.join(',');
      this.getCliquePage();
    },
    delItem(v, i) {
      this.checkedList.splice(i, 1);
      this.groupIds = this.checkedList.join(',');
      this.getCliquePage();
    },
    // 获取某商户下的列表
    getCliquePage() {
      this.loading = true;
      let para = {
        enterpriseId: this.enterpriseId,
        search: this.searchValue,
        currentPage: this.currentPage,
        groupIds: this.groupIds,
        pageSize: this.pageSize,
        sortColumn: this.sortColumn,
        sortType: this.sortType
      };
      postRequest('/api-admin/clique-page-store-group', para).then(res => {
        let data = res.data;
        this.loading = false;
        if (data.errorCode == 0) {
          this.tableData = data.result.result ? data.result.result : [];
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
    // 搜索
    searchGroup() {
      this.currentPage = 1;
      this.getCliquePage();
    },
    // 查询所有归属  用于选择
    getAllBelong() {
      let para = {
        enterpriseId: this.enterpriseId,
        search: this.searchBelongVal
      };
      postRequest('/api-admin/clique-list-select-group', para).then(res => {
        let data = res.data;
        if (data.errorCode == 0) {
          this.optionsAllNew = data.result ? data.result : [];
          this.optionsAll = data.result ? data.result : [];
        } else {
          this.$message.error(data.message);
        }
      });
    },
    // 变更归属
    getManyBelong() {
      let para = {
        enterpriseId: this.enterpriseId,
        search: this.searchBelongVal
      };
      postRequest('/api-admin/clique-list-group', para).then(res => {
        let data = res.data;
        if (data.errorCode == 0) {
          this.options = data.result ? data.result : [];
        } else {
          this.$message.error(data.message);
        }
      });
    },
    searchAllBelong() {
      let para = {
        enterpriseId: this.enterpriseId,
        search: this.searchBelongVal
      };
      postRequest('/api-admin/clique-list-select-group', para).then(res => {
        let data = res.data;
        if (data.errorCode == 0) {
          this.optionsAll = data.result ? data.result : [];
        } else {
          this.$message.error(data.message);
        }
      });
    },
    // 选中门店
    handleSelectionChange(val) {
      this.storeIdArr = [];
      if (val.length > 0) {
        val.forEach(el => {
          this.storeIdArr.push(el.storeId);
        });
      }
    },
    // 变更归属按钮
    changeBelong(type, row) {
      this.newGroupId = '';
      if (type == 'only') {
        this.dialogVisible = true;
        this.curIndex = null;
        this.storeIds = row.storeId;
      } else if (type == 'all') {
        if (this.storeIdArr.length < 1) {
          this.$message.error('请选择要变更的门店');
        } else {
          this.dialogVisible = true;
          this.storeIds = this.storeIdArr.join(',');
        }
      }
    },
    // 选择变更归属
    selectBelong(item, index) {
      this.curIndex = index;
      this.newGroupId = item.integralSettlementGroupId ? item.integralSettlementGroupId : '';
    },
    // 确定选择归属的确定按钮
    sureSelectBtn() {
      if (this.newGroupId == '') {
        this.$message.error('请选择结算归属');
      } else {
        let para = {
          enterpriseId: this.enterpriseId,
          storeIds: this.storeIds,
          groupId: this.newGroupId
        };
        postRequest('/api-admin/clique-add-group-store', para).then(res => {
          let data = res.data;
          if (data.errorCode == 0) {
            this.dialogVisible = false;
            this.getCliquePage();
            this.$message.success('变更成功');
            this.$emit('resetEnterpriseList', true);
          } else {
            this.$message.error(data.message);
          }
        });
      }
    },
    // 释放
    releaseStore(type, row) {
      if (type == 'only') {
        this.dialogVisible2 = true;
        this.storeIds = row.storeId;
      } else if (type == 'all') {
        if (this.storeIdArr.length < 1) {
          this.$message.error('请选择要释放的门店');
        } else {
          this.dialogVisible2 = true;
          this.storeIds = this.storeIdArr.join(',');
        }
      }
    },
    // 确认释放
    sureReleaseBtn() {
      let para = {
        enterpriseId: this.enterpriseId,
        storeIds: this.storeIds
      };
      postRequest('/api-admin/clique-release-store', para).then(res => {
        let data = res.data;
        if (data.errorCode == 0) {
          this.dialogVisible2 = false;
          this.getCliquePage();
          this.$emit('resetEnterpriseList', true);
          this.$message.success('释放成功');
        } else {
          this.$message.error(data.message);
        }
      });
    },
    // 排序
    sortChange(column, prop, order) {
      let itemProp = column.prop;
      let itemOrder = column.order;
      if (itemProp == 'groupName') {
        this.sortColumn = '1';
        if (itemOrder === 'ascending') {
          // 上升
          this.sortType = 'asc';
        } else if (itemOrder === 'descending') {
          this.sortType = 'desc';
        }
      } else if (itemProp == 'storeType') {
        this.sortColumn = '2';
        if (itemOrder === 'ascending') {
          this.sortType = 'asc';
        } else if (itemOrder === 'descending') {
          this.sortType = 'desc';
        }
      }
      this.getCliquePage();
    }
  }
};
</script>
<style lang="less" scoped>
@import url('./cliqueList.css');
.group-wrap {
  padding: 24px 24px 0;
}
.search-wrap {
  font-size: 0;
  .search-input {
    width: 285px;
    margin-right: 8px;
  }
  .select-input {
    width: 210px;
  }
}
.group-list {
  margin-top: 24px;
}
.pagination {
  text-align: right;
  padding: 30px 0 34px 0;
}
.store-name-wrap p {
  line-height: 14px;
}
.first-item {
  margin-bottom: 7px;
}
.second-item {
  font-size: 14px;
  color: #909399;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.belong-wrap ul {
  margin-top: 10px;
  height: 220px;
  overflow-y: auto;
  li {
    color: #606266;
    line-height: 44px;
    cursor: pointer;
    padding: 0 5px;
    border-bottom: 1px solid rgba(220, 223, 230, 1);
    &.on {
      background: #f5f7fa;
      color: #303133;
    }
    &:hover {
      background: #f5f7fa;
    }
    p.fl {
      max-width: 200px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    p.fr {
      max-width: 130px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
}
.del-wrap {
  font-size: 14px;
  h3 {
    color: #303133;
    line-height: 20px;
    margin-bottom: 12px;
  }
  p {
    color: #f5222d;
    line-height: 20px;
    margin-bottom: 20px;
  }
}
.no-search-belong-data {
  text-align: center;
  color: #909399;
  font-size: 14px;
  line-height: 20px;
  padding-top: 12px;
}
</style>
