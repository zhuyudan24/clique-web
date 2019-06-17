<template>
  <div class="integral-all-wrap">
    <div class="search-wrap clearfix">
      <el-select @change="getSelectMonth" v-model="dateValue" placeholder="请选择月份">
        <el-option v-for="(item, index) in dateArr" :key="index" :label="item" :value="item"> </el-option>
      </el-select>
      <el-select @change="selectEnterprise" class="select-m-both" v-model="enterpriseId" placeholder="请选择">
        <el-option v-for="item in enterpriseList" :key="item.enterpriseId" :label="item.enterpriseName" :value="item.enterpriseId"> </el-option>
      </el-select>
      <el-button v-if="downloadExcelDtlBool" @click="downloadExcelDtl" type="primary" class="fr">导出明细数据</el-button>
      <el-button v-else disabled type="primary" class="fr">{{ downloadExcelDtlMsg }}</el-button>
      <el-button v-if="downloadExcelAllBool" @click="downloadExcelAll" type="primary" class="fr" style="margin-right:8px;">导出汇总数据</el-button>
      <el-button v-else disabled type="primary" class="fr" style="margin-right:8px;">{{ downloadExcelAllMsg }}</el-button>
    </div>
    <el-table :data="tableData" v-loading="loading" @sort-change="sortChange" ref="myTable" class="table-no-line-wrap" style="width: 100%">
      <el-table-column prop="storeName" label="成本主体">
        <template slot-scope="scope">
          <p class="table-first-item">{{ scope.row.endStoreName }}</p>
          <p class="table-second-item">code：{{ scope.row.endStoreCode }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="endStoreTypeExcel" label="成本主体类型" sortable="custom"> </el-table-column>
      <el-table-column prop="brandName" label="成本主体所属商户" sortable="custom"> </el-table-column>
      <el-table-column prop="settlementGroupName" label="结算归属" sortable="custom" :render-header="renderHeader"> </el-table-column>
      <el-table-column prop="integralSettlementValue" label="结算总积分" sortable="custom"> </el-table-column>
      <el-table-column prop="integralCostValue" label="结算总成本金额" sortable="custom" width="150"> </el-table-column>
    </el-table>
    <div class="pagination" v-show="totalCount > 0">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 40, 60, 80]" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="totalCount"> </el-pagination>
    </div>
  </div>
</template>

<script>
import { postRequest, getRequest } from '@/api/api';
import excelConfig from '@/common/js/excel_config.js';
// import { log } from '@/utils/index.js';
export default {
  name: 'integralCloseAll',
  data() {
    return {
      projectName: 'gic-clique',
      dateArr: [],
      dateArrNum: [],
      dateValue: '',
      month: '',
      enterpriseList: [],
      enterpriseId: '',
      tableData: [],
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      loading: false,
      // 排序
      curSortType: '',
      downloadExcelDtlMsg: '',
      downloadExcelDtlBool: true,
      downloadExcelAllMsg: '',
      downloadExcelAllBool: true
    };
  },
  mounted() {
    this.getMonthData();
    this.getEnterpriseList();
  },
  methods: {
    // 获得月份
    getMonthData() {
      getRequest('/api-report/month-list', {}).then(res => {
        var data = res.data;
        this.loading = false;
        if (data.errorCode == 0) {
          this.dateArr = data.result;
          this.dateValue = this.dateArr[0];
          data.result.forEach(item => {
            var arr = item.match(/\d+/g);
            var date = arr[0] + '-' + arr[1];
            this.dateArrNum.push(date);
          });
          this.month = this.dateArrNum[0];
          this.getList();
        } else {
          this.$message.error(data.message);
        }
      });
    },
    getList() {
      this.loading = true;
      let para = {
        paramTime: this.month,
        enterpriseId: this.enterpriseId,
        orderBy: this.curSortType,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      };
      postRequest('/api-report/list-clique-integral-report', para).then(res => {
        var data = res.data;
        this.loading = false;
        if (data.errorCode == 0) {
          this.tableData = data.result.result ? data.result.result : [];
          this.totalCount = data.result.totalCount;
        } else {
          this.$message.error(data.message);
        }
      });
    },
    // 获得商户列表
    getEnterpriseList() {
      let para = {};
      postRequest('/api-admin/get-clique-list', para).then(res => {
        let data = res.data;
        if (data.errorCode == 0) {
          this.enterpriseList = data.result ? data.result : [];
          let obj = {
            enterpriseId: '',
            enterpriseName: '所有商户'
          };
          this.enterpriseList.unshift(obj);
        } else {
          this.$message.error(data.message);
        }
      });
    },
    selectEnterprise() {
      this.currentPage = 1;
      this.getList();
    },
    // 排序
    sortChange(column, prop, order) {
      let itemProp = column.prop;
      let itemOrder = column.order;
      if (itemProp == 'endStoreTypeExcel') {
        if (itemOrder === 'ascending') {
          this.curSortType = '1';
        } else if (itemOrder === 'descending') {
          this.curSortType = '2';
        }
      } else if (itemProp == 'brandName') {
        if (itemOrder === 'ascending') {
          this.curSortType = '3';
        } else if (itemOrder === 'descending') {
          this.curSortType = '4';
        }
      } else if (itemProp == 'settlementGroupName') {
        if (itemOrder === 'ascending') {
          this.curSortType = '5';
        } else if (itemOrder === 'descending') {
          this.curSortType = '6';
        }
      } else if (itemProp == 'integralSettlementValue') {
        if (itemOrder === 'ascending') {
          this.curSortType = '7';
        } else if (itemOrder === 'descending') {
          this.curSortType = '8';
        }
      } else if (itemProp == 'integralCostValue') {
        if (itemOrder === 'ascending') {
          this.curSortType = '9';
        } else if (itemOrder === 'descending') {
          this.curSortType = '10';
        }
      }
      this.getList();
    },
    // 选择日期
    getSelectMonth(val) {
      let selectDate = val.match(/\d+/g);
      this.month = selectDate[0] + '-' + selectDate[1];
      this.currentPage = 1;
      this.getList();
    },
    // 选择分页符
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
    // 自定义表头
    renderHeader(h, obj) {
      let r = h('span', [obj.column.label], {
        attrs: {
          style: 'text-align:left'
        }
      });
      r = h('span', [
        obj.column.label,
        h(
          'el-popover',
          {
            attrs: {
              trigger: 'hover',
              width: '190',
              placement: 'top'
            }
          },
          [
            this.operation(h, obj.column.label), // 组件  或者 多处用
            h('i', {
              slot: 'reference',
              attrs: {
                class: 'iconfont tooltip-icon icon-xinxixianshi',
                style: 'padding-left:4px;cursor:pointer'
              }
            })
          ]
        )
      ]);
      return r;
    },
    operation(h, label) {
      var arr = [];
      if (label == '结算归属') {
        arr = [h('span', {}, [<span slot="content">结算归属为空值的主要原因：1、该成本主体未分配归属；2、该成本主体门店状态非上线状态，无法进行分配归属</span>])];
      }
      return arr;
    },
    // 导出明细数据
    downloadExcelDtl() {
      let that = this;
      let timeOrDialogBool = this.tableData.length > 0 ? true : false;
      if (!timeOrDialogBool) {
        that.$message.error('没有可导出的数据');
        return;
      }
      if (that.downloadExcelDtlBool && timeOrDialogBool) {
        let para = {
          requestProject: that.projectName,
          paramTime: that.month,
          enterpriseId: that.enterpriseId,
          currentPage: that.currentPage,
          pageSize: that.pageSize
        };
        postRequest('/api-report/report-clique-integral-detail', para).then(res => {
          var data = res.data;
          if (data.errorCode) {
            // 如果报错，会有返回信息，如果成功，直接下载文件，没有返回信息
            that.$message.error(data.message);
          } else {
            window.location.href = excelConfig.config + '/api-report/report-clique-integral-detail?requestProject=' + that.projectName + '&paramTime=' + that.month + '&enterpriseId=' + that.enterpriseId + '&currentPage=' + that.currentPage + '&pageSize=' + that.pageSize;
          }
        });
      }
      if (timeOrDialogBool) {
        that
          .$confirm('正在为您导出数据，60S内不能重复点击导出按钮，若数据量过大，可能需要几分钟时间，请耐心等待', '提示', {
            confirmButtonText: '知道了',
            cancelButtonText: '取消',
            showCancelButton: false,
            type: 'warning'
          })
          .then(() => {})
          .catch(() => {});
        let count = 60;
        window.myTimer = setInterval(function() {
          that.downloadExcelDtlBool = false;
          count--;
          count = count < 10 ? '0' + count : count;
          if (count < 1) {
            clearInterval(window.myTimer);
            that.downloadExcelDtlBool = true;
          } else {
            that.downloadExcelDtlMsg = '倒计时' + count + '秒';
          }
        }, 1000);
      }
    },
    // 导出汇总数据
    downloadExcelAll() {
      let that = this;
      let timeOrDialogBool = this.tableData.length > 0 ? true : false;
      if (!timeOrDialogBool) {
        that.$message.error('没有可导出的数据');
        return;
      }
      if (that.downloadExcelAllBool && timeOrDialogBool) {
        let para = {
          requestProject: that.projectName,
          paramTime: that.month,
          enterpriseId: that.enterpriseId,
          currentPage: that.currentPage,
          pageSize: that.pageSize
        };
        postRequest('/api-report/report-clique-integral-report', para).then(res => {
          var data = res.data;
          if (data.errorCode) {
            // 如果报错，会有返回信息，如果成功，直接下载文件，没有返回信息
            that.$message.error(data.message);
          } else {
            window.location.href = excelConfig.config + '/api-report/report-clique-integral-report?requestProject=' + that.projectName + '&paramTime=' + that.month + '&enterpriseId=' + that.enterpriseId + '&currentPage=' + that.currentPage + '&pageSize=' + that.pageSize;
          }
        });
      }
      if (timeOrDialogBool) {
        that
          .$confirm('正在为您导出数据，60S内不能重复点击导出按钮，若数据量过大，可能需要几分钟时间，请耐心等待', '提示', {
            confirmButtonText: '知道了',
            cancelButtonText: '取消',
            showCancelButton: false,
            type: 'warning'
          })
          .then(() => {})
          .catch(() => {});
        let count = 60;
        window.myTimer2 = setInterval(function() {
          that.downloadExcelAllBool = false;
          count--;
          count = count < 10 ? '0' + count : count;
          if (count < 1) {
            clearInterval(window.myTimer2);
            that.downloadExcelAllBool = true;
          } else {
            that.downloadExcelAllMsg = '倒计时' + count + '秒';
          }
        }, 1000);
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    if (window.myTimer) {
      clearInterval(window.myTimer);
    }
    if (window.myTimer2) {
      clearInterval(window.myTimer2);
    }
    next();
  }
};
</script>

<style lang="less" scoped>
.integral-all-wrap {
  background-color: #fff;
  padding: 24px 24px 0;
}
.search-wrap {
  margin-bottom: 22px;
  font-size: 0;
  .select-input {
    width: 150px;
  }
}
.select-m-both {
  margin: 0 8px;
}
.table-wrap {
  padding: 0 32px 24px;
}
.table-second-item {
  color: #909399;
}
.pagination {
  text-align: right;
  padding: 30px 0 34px 0;
}
</style>
