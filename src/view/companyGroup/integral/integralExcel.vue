<template>
  <div class="integral-all-wrap">
    <div class="search-wrap clearfix">
      <el-select @change="getSelectMonth" v-model="dateValue" placeholder="请选择月份">
        <el-option v-for="(item, index) in dateArr" :key="index" :label="item" :value="item"> </el-option>
      </el-select>
      <el-select @change="selectEnterprise" class="select-m-both" v-model="enterpriseId" placeholder="请选择">
        <el-option v-for="item in enterpriseList" :key="item.enterpriseId" :label="item.enterpriseName" :value="item.enterpriseId"> </el-option>
      </el-select>
      <el-button v-if="downloadExcelBool" @click="downloadExcel" type="primary" class="fr">导出数据</el-button>
      <el-button v-else disabled type="primary" class="fr">{{ downloadExcelMsg }}</el-button>
    </div>
    <el-table :data="tableData" v-loading="loading" @sort-change="sortChange" ref="myTable" class="table-no-line-wrap" style="width: 100%">
      <el-table-column prop="orderTime" label="订单完成时间" sortable="custom">
        <template slot-scope="scope">
          <p class="table-first-item">{{ scope.row.orderTime | dateFormat('YYYY-MM-DD') }}</p>
          <p class="table-second-item">{{ scope.row.orderTime | dateFormat('hh:mm:ss') }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="channelType" label="来源渠道"> </el-table-column>
      <el-table-column prop="integralCost" label="抵现金额"> </el-table-column>
      <el-table-column prop="brandName" label="所属商户"> </el-table-column>
      <el-table-column prop="clerkTotalCommission" label="会员信息">
        <template slot-scope="scope">
          <div class="member-info clearfix">
            <img class="img fl" :src="scope.row.thirdImgUrl ? scope.row.thirdImgUrl : defaultImg" width="40px" height="40px" />
            <p class="info fl">{{ scope.row.memberName }}</p>
          </div>
        </template>
        <template> </template>
      </el-table-column>
      <el-table-column prop="mainStoreName" label="服务门店信息" sortable="custom">
        <template slot-scope="scope">
          <p class="table-first-item">{{ scope.row.mainStoreName ? scope.row.mainStoreName : '--' }}</p>
          <p class="table-second-item">code：{{ scope.row.mainStoreCode ? scope.row.mainStoreCode : '--' }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="openStoreName" label="开卡门店信息" sortable="custom">
        <template slot-scope="scope">
          <p class="table-first-item">{{ scope.row.openStoreName ? scope.row.openStoreName : '--' }}</p>
          <p class="table-second-item">code：{{ scope.row.openStoreCode ? scope.row.openStoreCode : '--' }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="deliverStoreName" label="发货门店信息">
        <template slot-scope="scope">
          <p class="table-first-item">{{ scope.row.deliverStoreName ? scope.row.deliverStoreName : '--' }}</p>
          <p class="table-second-item">code：{{ scope.row.deliverStoreCode ? scope.row.deliverStoreCode : '--' }}</p>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination" v-show="totalCount > 0">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 40, 60, 80]" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="totalCount"> </el-pagination>
    </div>
  </div>
</template>

<script>
import { postRequest, getRequest } from '@/api/api';
// import { log } from '@/utils/index.js';
import defaultImg from '../../../../static/img/head_default.jpg';
import excelConfig from '@/common/js/excel_config.js';
export default {
  name: 'integralExcel',
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
      defaultImg: defaultImg,
      loading: false,
      // 排序
      curSortType: '',
      // 导出
      downloadExcelMsg: '',
      downloadExcelBool: true
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
      postRequest('/api-report/list-clique-integral-order', para).then(res => {
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
      if (itemProp == 'orderTime') {
        if (itemOrder === 'ascending') {
          this.curSortType = '1';
        } else if (itemOrder === 'descending') {
          this.curSortType = '2';
        }
      } else if (itemProp == 'mainStoreName') {
        if (itemOrder === 'ascending') {
          this.curSortType = '3';
        } else if (itemOrder === 'descending') {
          this.curSortType = '4';
        }
      } else if (itemProp == 'openStoreName') {
        if (itemOrder === 'ascending') {
          this.curSortType = '5';
        } else if (itemOrder === 'descending') {
          this.curSortType = '6';
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
    // 导出数据
    downloadExcel() {
      let that = this;
      let timeOrDialogBool = this.tableData.length > 0 ? true : false;
      if (!timeOrDialogBool) {
        that.$message.error('没有可导出的数据');
        return;
      }
      if (that.downloadExcelBool && timeOrDialogBool) {
        let para = {
          requestProject: that.projectName,
          paramTime: that.month,
          enterpriseId: that.enterpriseId,
          currentPage: that.currentPage,
          pageSize: that.pageSize
        };
        postRequest('/api-report/report-clique-integral-order', para).then(res => {
          var data = res.data;
          if (data.errorCode) {
            // 如果报错，会有返回信息，如果成功，直接下载文件，没有返回信息
            that.$message.error(data.message);
          } else {
            window.location.href = excelConfig.config + '/api-report/report-clique-integral-order?requestProject=' + that.projectName + '&paramTime=' + that.month + '&enterpriseId=' + that.enterpriseId + '&currentPage=' + that.currentPage + '&pageSize=' + that.pageSize;
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
        window.myTimer3 = setInterval(function() {
          that.downloadExcelBool = false;
          count--;
          count = count < 10 ? '0' + count : count;
          if (count < 1) {
            clearInterval(window.myTimer3);
            that.downloadExcelBool = true;
          } else {
            that.downloadExcelMsg = '倒计时' + count + '秒';
          }
        }, 1000);
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    if (window.myTimer3) {
      clearInterval(window.myTimer3);
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
.member-info {
  display: flex;
  align-items: center;
  .img {
    flex: 0 0 40px;
    width: 40px;
    border: 1px solid rgba(235, 238, 245, 1);
    border-radius: 4px;
    margin-right: 10px;
  }
  .info {
    flex: 1;
    line-height: 20px;
    display: -webkit-box !important;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
}
.table-second-item {
  color: #909399;
}
.pagination {
  text-align: right;
  padding: 30px 0 34px 0;
}
</style>
