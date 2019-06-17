<template>
  <div class="right-wrap">
    <topNav></topNav>
    <div class="right-content">
      <div class="right-box">
        <div class="nav-list-wrap clearfix">
          <div class="nav-list-content">
            <el-tooltip effect="dark" content="结算归属概览" placement="bottom">
              <i @click="changeStyle('card')" class="iconfont icon-caidan my-icon " :class="{ on: showStyle == 'card' }"></i>
            </el-tooltip>
            <el-tooltip effect="dark" content="结算归属列表" placement="bottom">
              <i @click="changeStyle('list')" class="iconfont icon-xiangqing my-icon" :class="{ on: showStyle == 'list' }"></i>
            </el-tooltip>
            <el-select v-model="enterpriseId" placeholder="请选择商户" style="margin-left:5px;">
              <el-option v-for="item in applyList" :key="item.enterpriseId" :label="item.enterpriseName" :value="item.enterpriseId">
                <div class="fl enterprise-name" :title="item.enterpriseName">{{ item.enterpriseName }}</div>
                <div class="fr">
                  <el-popover placement="top" width="160" trigger="hover" content="此商户下有未归属的门店"> <i v-show="!item.isEdit" slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i> </el-popover>
                </div>
              </el-option>
            </el-select>
            <span v-show="enterpriseNum > 0" class="enterprise-tip">有{{ enterpriseNum }}个商户未配置（点击左侧下拉列表选择未配置完成的商户，切换至列表样式筛选无归属门店即可定位）</span>
          </div>
        </div>
        <cliqueCard v-show="showStyle == 'card'" :showAgainBool="showAgainBool" :enterpriseId="enterpriseId"></cliqueCard>
        <cliqueList v-show="showStyle == 'list'" :showAgainBool="!showAgainBool" :enterpriseId="enterpriseId" @resetEnterpriseList="resetEnterpriseList"></cliqueList>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>
<script>
import topNav from 'components/nav/nav';
import { postRequest } from '@/api/api';
import cliqueCard from './cliqueCard';
import cliqueList from './cliqueList';
export default {
  name: 'settlementConfig',
  data() {
    return {
      repProjectName: 'gic-clique',
      showStyle: 'card',
      applyList: [],
      enterpriseId: '',
      enterpriseNum: 0,
      loading: false,
      showAgainBool: true
    };
  },
  mounted() {
    this.getEnterpriseList();
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
    },
    // 选择展现方式
    changeStyle(type) {
      this.showStyle = type;
      this.showAgainBool = !this.showAgainBool;
    },
    // 重新获取商户的状态
    resetEnterpriseList(val) {
      let para = {};
      postRequest('/api-admin/clique-integral-enterprise', para).then(res => {
        let data = res.data;
        if (data.errorCode == 0) {
          this.applyList = data.result ? data.result : [];
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
    cliqueCard,
    cliqueList
  }
};
</script>
<style lang="less" scoped>
.right-box {
  background: #fff;
}
.nav-list-wrap {
  padding: 14px 24px;
  border-bottom: 1px solid rgba(235, 238, 245, 1);
}
.enterprise-name {
  display: inline-block;
  max-width: 150px;
  height: 60px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  padding-right: 10px;
}
.my-icon {
  font-size: 16px;
  padding: 8px;
  border-radius: 4px;
  color: #303133;
  cursor: pointer;
  &.on {
    background: #ebeef5;
  }
}
.enterprise-tip {
  font-size: 13px;
  color: #909399;
  padding-left: 10px;
}
.el-carousel__arrow-left {
  left: 0px;
}
.el-carousel__arrow-right {
  right: 0px;
}
</style>
