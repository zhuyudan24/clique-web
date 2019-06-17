<template>
  <div class="right-wrap">
    <topNav></topNav>
    <div class="right-content">
      <div class="right-box">
        <el-tabs v-model="memberTab" @tab-click="handleTabClick">
          <el-tab-pane label="结算汇总表" name="first">
            <div class="my-tab-content">
              <closeAllExcel></closeAllExcel>
            </div>
          </el-tab-pane>
          <el-tab-pane label="结算补贴 - 卡券兑换" name="second">
            <div class="my-tab-content">
              <cardExcel></cardExcel>
            </div>
          </el-tab-pane>
          <el-tab-pane label="结算补贴 - 积分抵现" name="third">
            <div class="my-tab-content">
              <integralExcel></integralExcel>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>
<script>
import topNav from 'components/nav/nav';
import { postRequest } from '@/api/api';
import closeAllExcel from './closeAllExcel';
import cardExcel from './cardExcel';
import integralExcel from './integralExcel';
export default {
  name: 'integralReport',
  data() {
    return {
      repProjectName: 'gic-clique',
      memberTab: 'first',
      loading: false
    };
  },
  mounted() {
    // this.getEnterpriseList();
  },
  methods: {
    // 获取商户列表
    getEnterpriseList() {
      let para = {};
      postRequest('/api-admin/clique-integral-enterprise', para).then(res => {
        let data = res.data;
        if (data.errorCode == 0) {
          this.applyList = data.result ? data.result : [];
          this.enterpriseId = this.applyList[0].enterpriseId;
          this.enterpriseNum = 0;
          this.applyList.forEach(el => {
            if (!el.isEdit) {
              this.enterpriseNum++;
            }
          });
        } else {
          this.$message.error(data.message);
        }
      });
    }
  },
  components: {
    topNav,
    closeAllExcel,
    cardExcel,
    integralExcel
  }
};
</script>
<style lang="less" scoped>
.right-wrap .right-content {
  min-height: calc(100% - 200px);
  padding: 0;
  .right-box {
    background: none;
  }
}
.right-wrap /deep/ {
  .navwrap.boxbttom {
    border: none;
  }
}
.right-box /deep/ .el-tabs__header {
  margin: 0;
  padding-left: 24px;
  border-bottom: 1px solid #e4e7ed;
  background: #fff;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
.right-box /deep/ .el-tabs__nav-wrap::after {
  content: none;
}
.my-tab-content {
  padding: 24px;
}
</style>
