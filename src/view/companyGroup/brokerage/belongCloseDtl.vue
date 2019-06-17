<template>
  <div class="right-wrap">
    <topNav></topNav>
    <div class="right-content">
      <div class="right-box">
        <div class="search-wrap clearfix">
          <el-date-picker style="width:260px" @change="selectDate" :picker-options="pickerOptions" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="dateValue" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          <el-popover class="item" placement="top" width="200" trigger="hover" title="" content="根据结算时间进行筛选">
            <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
          </el-popover>
          <el-select @change="selectEnterprise" class="select-input" v-model="enterpriseId" placeholder="请选择">
            <el-option v-for="item in enterpriseList" :key="item.enterpriseId" :label="item.enterpriseName" :value="item.enterpriseId"> </el-option>
          </el-select>
          <el-select @change="selectType" class="select-input" v-model="channelType">
            <el-option v-for="item in channelOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
          <el-select @change="selectType" class="select-input" v-model="belongType">
            <el-option v-for="item in belongOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
          <el-input @keyup.native.enter="selectType" class="search-input" placeholder="请输入内容" prefix-icon="el-icon-search" v-model="searchInput">
            <el-select @change="selectType" slot="prepend" class="search-select" v-model="searchType" placeholder="请选择">
              <el-option v-for="item in searchOptions" :key="item.type" :label="item.name" :value="item.type"> </el-option>
            </el-select>
          </el-input>
          <el-button @click="downloadExcel" type="primary" class="fr">导出数据</el-button>
        </div>
        <el-table :data="tableData" v-loading="loading" :span-method="objectSpanMethod" ref="myTable" class="table-no-line-wrap" :cell-class-name="tableRowClassName" @cell-mouse-leave="cellMouseLeave" @cell-mouse-enter="cellMouseEnter" style="width: 100%">
          <el-table-column prop="documentCreateTime" label="单据创建时间" width="120">
            <template slot-scope="scope">
              <p>{{ scope.row.documentCreateTime | dateFormatNew('YYYY-MM-DD') }}</p>
              <p class="table-second-item">{{ scope.row.documentCreateTime | dateFormatNew('hh:mm:ss') }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="channelType" label="渠道" width="100">
            <template slot-scope="scope">
              {{ scope.row.channelType == 0 ? 'GIC微商城' : '微盟微商城' }}
            </template>
          </el-table-column>
          <el-table-column prop="orderNumber" label="订单编号"> </el-table-column>
          <el-table-column prop="belongType" label="归属类型" width="100" :render-header="renderHeader">
            <template slot-scope="scope">
              {{ scope.row.belongType == 0 ? '服务门店' : '开卡门店' }}
            </template>
          </el-table-column>
          <el-table-column prop="enterpriseName" label="商户名称"> </el-table-column>
          <el-table-column prop="storeName" label="归属门店" :render-header="renderHeader">
            <template slot-scope="scope">
              <p :title="scope.row.storeName" class="table-first-item">{{ scope.row.storeName }}</p>
              <p :title="scope.row.storeCode" class="table-second-item">{{ scope.row.storeCode }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="clerkName" label="归属导购" :render-header="renderHeader">
            <template slot-scope="scope">
              <p :title="scope.row.clerkName" class="table-first-item">{{ scope.row.clerkName }}</p>
              <p :title="scope.row.clerkCode" class="table-second-item">{{ scope.row.clerkCode }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="brandName" label="商品品牌"> </el-table-column>
          <el-table-column prop="goodsCode" label="商品货号"> </el-table-column>
          <el-table-column prop="goodsPayAmount" label="商品成交额" width="100"> </el-table-column>
        </el-table>
        <div class="pagination" v-show="totalCount > 0">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 40, 60, 80]" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="totalCount"> </el-pagination>
        </div>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>

<script>
import topNav from 'components/nav/nav';
import { dateFormat } from '@/common/js/filter';
import { postRequest } from '@/api/api';
import excelConfig from '@/common/js/excel_config.js';
export default {
  name: 'belongCloseDtl',
  data() {
    return {
      projectName: 'gic-clique',
      pickerMinDate: '',
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.pickerMinDate = minDate.getTime();
          if (maxDate) {
            this.pickerMinDate = '';
          }
        },
        disabledDate: time => {
          if (this.pickerMinDate !== '') {
            const day90 = (90 - 1) * 24 * 3600 * 1000;
            let maxTime = this.pickerMinDate + day90;
            let minTime = this.pickerMinDate - day90;
            return time.getTime() > maxTime || time.getTime() < minTime;
          }
        }
      },
      dateValue: [],
      startTime: '',
      endTime: '',
      channelOptions: [
        {
          value: '',
          label: '所有渠道'
        },
        {
          value: '0',
          label: 'GIC微商城'
        },
        {
          value: '1',
          label: '微盟微商城'
        }
      ],
      channelType: '',
      belongOptions: [
        {
          value: '',
          label: '所有归属类型'
        },
        {
          value: '0',
          label: '服务门店'
        },
        {
          value: '1',
          label: '开卡门店'
        }
      ],
      belongType: '',
      searchOptions: [
        {
          type: '1',
          name: '订单编号'
        },
        {
          type: '2',
          name: '门店名称'
        },
        {
          type: '3',
          name: '门店code'
        },
        {
          type: '4',
          name: '导购姓名'
        },
        {
          type: '5',
          name: '导购code'
        },
        {
          type: '6',
          name: '商品品牌'
        },
        {
          type: '7',
          name: '商品货号'
        }
      ],
      searchType: '1',
      searchInput: '',
      tableData: [],
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      loading: false,
      // 商户列表
      enterpriseList: [],
      enterpriseId: '',
      // 导出数据
      dialogVisible: false,
      excelUrl: '/api-admin/report-commission-settle-detail',
      params: {},

      rowIndex: '-1', // 合并行
      OrderIndexArr: [],
      hoverOrderArr: []
    };
  },
  filters: {
    dateFormatNew(timeSpan, format) {
      return dateFormat(timeSpan, format);
    }
  },
  mounted() {
    this.getNowDate();
    this.getEnterpriseList();
  },
  methods: {
    // 获取默认时间
    getNowDate() {
      this.loading = true;
      postRequest('/api-admin/get-default-date', {}).then(res => {
        let data = res.data;
        if (data.errorCode == 0) {
          if (this.dateValue.length < 1) {
            this.startTime = data.result.startTime;
            this.endTime = data.result.endTime;
            this.dateValue.push(this.startTime, this.endTime);
          }
          this.getList();
        } else {
          this.$message.error(data.message);
        }
      });
    },
    getList() {
      let para = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        orderStartTime: this.startTime,
        orderEndTime: this.endTime,
        enterpriseId: this.enterpriseId,
        channelType: this.channelType,
        belongType: this.belongType,
        orderQueryType: this.searchType,
        orderQueryValue: this.searchInput,
        orderStatus: 1
      };
      postRequest('/api-report/list-clique-commission-order-detail', para).then(res => {
        let data = res.data;
        this.loading = false;
        if (data.errorCode == 0) {
          this.tableData = [];
          this.totalCount = data.result.totalCount;
          let arr = data.result.result ? data.result.result : [];
          if (arr.length > 0) {
            arr.forEach((item, index) => {
              item.id = index;
              item.cliqueCommissionSettleDetailList = item.cliqueCommissionSettleDetailList.map(el => ({
                ...el,
                id: item.id,
                documentCreateTime: item.documentCreateTime,
                channelType: item.channelType,
                orderNumber: item.orderNumber,
                belongType: item.belongType
              }));
              item.cliqueCommissionSettleDetailList.forEach(el => {
                this.tableData.push(el);
              });
            });
            // 需要合并的项
            let OrderObj = {};
            this.tableData.forEach((element, index) => {
              element.rowIndex = index;
              if (OrderObj[element.id]) {
                OrderObj[element.id].push(index);
              } else {
                OrderObj[element.id] = [];
                OrderObj[element.id].push(index);
              }
            });
            // 将数组长度大于1的值 存储到this.OrderIndexArr（也就是需要合并的项）
            this.OrderIndexArr = [];
            for (let k in OrderObj) {
              if (OrderObj[k].length > 1) {
                this.OrderIndexArr.push(OrderObj[k]);
              }
            }
          }
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
    // 合并行
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 3) {
        for (let i = 0; i < this.OrderIndexArr.length; i++) {
          let element = this.OrderIndexArr[i];
          for (let j = 0; j < element.length; j++) {
            let item = element[j];
            if (rowIndex == item) {
              if (j == 0) {
                return {
                  rowspan: element.length,
                  colspan: 1
                };
              } else if (j != 0) {
                return {
                  rowspan: 0,
                  colspan: 0
                };
              }
            }
          }
        }
      }
    },
    // 解决鼠标滑入滑出样式不好看的问题
    tableRowClassName({ row, rowIndex }) {
      let arr = this.hoverOrderArr;
      for (let i = 0; i < arr.length; i++) {
        if (rowIndex == arr[i]) {
          return 'hovered-row';
        }
      }
    },
    cellMouseEnter(row, column, cell, event) {
      this.rowIndex = row.rowIndex;
      this.hoverOrderArr = [];
      this.OrderIndexArr.forEach(element => {
        if (element.indexOf(this.rowIndex) >= 0) {
          this.hoverOrderArr = element;
        }
      });
    },
    cellMouseLeave(row, column, cell, event) {
      this.rowIndex = '-1';
      this.hoverOrderArr = [];
    },
    // end
    // 选择日期
    selectDate(val) {
      if (val) {
        this.startTime = val[0];
        this.endTime = val[1];
        this.getList();
      }
    },
    handleSizeChange(val) {
      // 选择分页符
      this.currentPage = 1;
      this.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
    // 选择类型
    selectType(val) {
      this.currentPage = 1;
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
      let arr = [];
      if (label == '归属类型') {
        arr = [h('span', {}, [<span slot="content">该订单与该门店产生佣金归属的类型</span>])];
      } else if (label == '归属门店') {
        arr = [h('span', {}, [<span slot="content">该订单所归属的门店信息</span>])];
      } else if (label == '归属导购') {
        arr = [h('span', {}, [<span slot="content">该订单所归属的导购信息</span>])];
      }
      return arr;
    },
    // end
    downloadExcel() {
      let that = this;
      let para = {
        requestProject: that.projectName,
        orderStartTime: that.startTime,
        orderEndTime: that.endTime,
        enterpriseId: that.enterpriseId,
        channelType: that.channelType,
        belongType: that.belongType,
        orderQueryType: that.searchType,
        orderQueryValue: that.searchInput,
        orderStatus: 1
      };
      postRequest('/api-report/report-clique-commission-order-detail', para).then(res => {
        var data = res.data;
        if (data.errorCode) {
          // 如果报错，会有返回信息，如果成功，直接下载文件，没有返回信息
          that.$message.error(data.message);
        } else {
          window.location.href = excelConfig.config + '/api-report/report-clique-commission-order-detail?requestProject=' + that.projectName + '&orderStartTime=' + that.startTime + '&orderEndTime=' + that.endTime + '&enterpriseId=' + that.enterpriseId + '&channelType=' + that.channelType + '&belongType=' + that.belongType + '&orderQueryType=' + that.searchType + '&orderQueryValue=' + that.searchInput + '&orderStatus=1';
        }
      });
    }
  },
  components: {
    topNav
  }
};
</script>

<style lang="less" scoped>
.right-box {
  padding: 24px 24px 0;
}
.search-wrap {
  margin-bottom: 22px;
  .select-input {
    width: 130px;
    margin-left: 5px;
  }
  .search-select {
    width: 130px;
  }
  .search-input {
    width: 280px;
    margin-left: 5px;
  }
}
.table-wrap {
  padding: 0 32px 24px;
}
.table-no-line-wrap /deep/ td:nth-last-child(7) {
  border-right: 1px solid #e4e7ed;
}
.search-select /deep/ .el-input__inner {
  background-color: #f1f3f7;
  border-right: 0;
  padding-left: 12px;
}
.table-second-item {
  color: #909399;
}
.table-first-item,
.table-second-item {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.pagination {
  padding: 30px 0 34px;
  text-align: right;
}
</style>
