<template>
  <div class="right-wrap">
    <topNavNew :navpath="navpath"></topNavNew>
    <div class="right-content">
      <div class="right-box">
        <div class="attention-wrap">
          <!-- 积分制度 -->
          <div class="point-cell point-form">
            <div class="point-cell-wrap">
              <point-form :pointInfo="pointInfo" :projectName="projectName"></point-form>
            </div>
          </div>
          <div class="height-24"></div>
          <!-- 特殊积分获取策略 -->
          <div class="point-cell point-table">
            <div class="flex table-top title-wrap">
              <div class="flex-1 flex-l">
                <p class="flex-title">特殊积分获取策略</p>
                <div class="flex-lable">设置除通用积分获取规则以外的特殊策略</div>
              </div>
            </div>
            <div class="fr btn-r-wrap"><el-button :disabled="tpnEditBool" type="primary" @click="handleAdd('point')">新增策略</el-button></div>
            <!-- table  border-->
            <div class="table-contain">
              <el-table class="table-no-line-wrap" :data="achieveTableData" style="width: 100%">
                <el-table-column prop="strategyName" label="策略名称"> </el-table-column>
                <el-table-column prop="" label="线下渠道">
                  <template slot-scope="scope">
                    <span v-for="(item, index) in scope.row.channelList" v-show="item.channelType == 3" :key="index">
                      <span v-if="item.openStatus == 0">关闭</span>
                      <span v-else>
                        <span v-if="item.channelRelationProType == 1 && item.channelRelationStoreType == 1">通用</span>
                        <span v-if="item.channelRelationProType != 1 || item.channelRelationStoreType != 1">自定义配置</span>
                      </span>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="" label="微信商城">
                  <template slot-scope="scope">
                    <span v-for="(item, index) in scope.row.channelList" v-show="item.channelType == 1" :key="index">
                      <span v-if="item.openStatus == 0">关闭</span>
                      <span v-else>
                        <span v-if="item.channelRelationProType == 1">通用</span>
                        <span v-if="item.channelRelationProType != 1">自定义配置</span>
                      </span>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="" label="微盟">
                  <template slot-scope="scope">
                    <span v-for="(item, index) in scope.row.channelList" v-show="item.channelType == 8" :key="index">
                      <span v-if="item.openStatus == 0">关闭</span>
                      <span v-else>
                        <span v-if="item.channelRelationProType == 1">通用</span>
                        <span v-if="item.channelRelationProType != 1">自定义配置</span>
                      </span>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="" label="适用对象">
                  <template slot-scope="scope">
                    {{ scope.row.useCrowd == 1 ? '所有会员' : '自定义人群' }}
                  </template>
                </el-table-column>
                <el-table-column prop="getRule" label="获取规则">
                  <template slot-scope="scope">
                    <span v-if="scope.row.integralGetStatus == 0">无积分</span>
                    <span v-if="scope.row.integralGetStatus != 0"> {{ scope.row.integralGet.fee / 10 }} : {{ scope.row.integralGet.integral / 10 }} </span>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button @click="handleEditClick(scope.row, 'edit')" type="text">编辑</el-button>
                    <delete-tip @confirm="handleDelClick(scope.$index, scope.row, achieveTableData)" tips="确认删除吗?">
                      <el-button type="text">删除</el-button>
                    </delete-tip>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="height-24"></div>
          <!-- 特殊积分抵现策略 -->
          <div class="point-cell point-table">
            <div class="flex table-top title-wrap">
              <div class="flex-1 flex-l">
                <p class="flex-title">特殊积分抵现策略</p>
                <div class="flex-lable">设置消费时使用积分抵现的规则（仅用于微信商城结算）</div>
              </div>
            </div>
            <div class="fr btn-r-wrap"><el-button :disabled="tpnEditBool" type="primary" @click="handleAdd('integ')">新增策略</el-button></div>
            <!-- table -->
            <div class="table-contain">
              <el-table :data="exchangeTableData" style="width: 100%">
                <el-table-column prop="strategyName" label="策略名称"> </el-table-column>
                <el-table-column prop="useCrowd" label="适用对象">
                  <template slot-scope="scope">
                    {{ scope.row.useCrowd == 1 ? '所有会员' : '自定义人群' }}
                  </template>
                </el-table-column>
                <el-table-column prop="" label="适用商品">
                  <template slot-scope="scope">
                    <span v-for="(item, index) in scope.row.channelList" :key="index">
                      {{ item.channelRelationProType == 1 && item.integralUseDiscountControl == 1 ? '所有商品' : '自定义配置' }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="" label="折扣控制">
                  <template slot-scope="scope">
                    <span v-for="(item, index) in scope.row.channelList" :key="index">
                      {{ item.integralUseDiscountControl == 1 ? '不限制' : item.integralUseDiscountControlLower + ':' + item.integralUseDiscountControlUpper }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="getRule" label="抵现规则">
                  <template slot-scope="scope">
                    <span>
                      {{ scope.row.integralUseStatus == 0 ? '无积分' : scope.row.integralUse.integral + ':' + scope.row.integralUse.fee }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="" label="比例限制">
                  <template slot-scope="scope">
                    <span v-for="(item, index) in scope.row.channelList" :key="index"> {{ item.useProportionalRestriction }}% </span>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button @click="handleEditClick2(scope.row)" type="text">编辑</el-button>
                    <delete-tip @confirm="handleDelClick(scope.$index, scope.row, exchangeTableData)" tips="确认删除吗?">
                      <el-button type="text">删除</el-button>
                    </delete-tip>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>
<script>
import topNavNew from 'components/nav/navNew';
import pointForm from 'components/memberShip/point-form';
import errMsg from '@/common/js/error';
import { postRequest } from '@/api/api';
import { log } from '@/utils/index.js';

export default {
  name: 'pointSystem',
  data() {
    return {
      projectName: 'gic-clique', // 当前项目名
      navpath: [
        {
          name: '集团管理',
          path: ''
        },
        {
          name: '会员制度',
          path: ''
        },
        {
          name: '积分制度',
          path: ''
        }
      ],
      // form
      pointInfo: {},
      bodyHtml: '', //富文本 tinymce 值
      // table 获取
      achieveTableData: [],
      // table 抵现
      exchangeTableData: [],
      // 太平鸟标识
      tpnEditBool: false,
      tpnEnterpriseId: 'ff808081671d3ceb01672adebf4e6149'
    };
  },
  created() {
    // this.selectReplayStyle()
  },
  methods: {
    // 新增
    handleAdd(flag) {
      if (!this.tpnEditBool) {
        if (flag == 'point') {
          this.$router.push('/addPointSystem');
        } else {
          this.$router.push('/addIntegralSytem');
        }
      }
    },
    // 删除
    handleDelClick(index, row, ArrData) {
      let that = this;
      let para = {
        strategyId: row.integralStrategyId,
        requestProject: that.projectName
      };
      postRequest('/api-admin/delete-member-integral-strategy', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 0) {
            that.$message({
              message: '删除成功',
              type: 'success'
            });
            ArrData.splice(index, 1);
            return;
          }
          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },
    // 获取积分制度
    getPointInfo() {
      let that = this;
      let param = {
        requestProject: that.projectName
      };
      postRequest('/api-admin/get-member-integral-setting', param)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 0) {
            if (!!resData.result.strategyList && !!resData.result.strategyList.length) {
              let arr = resData.result.strategyList;
              // 积分策略
              arr.forEach(function(ele, index) {
                ele.integralGet = JSON.parse(ele.integralGet);
                ele.integralUse = JSON.parse(ele.integralUse);
                if (ele.strategyType == 1) {
                  that.achieveTableData.push(ele);
                } else {
                  that.exchangeTableData.push(ele);
                }
              });
            }
            // form
            if (!!resData.result.memberIntegral) {
              that.pointInfo = that.handleData(resData.result.memberIntegral);
            }
            return;
          }
          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          log(error);
        });
    },
    // 处理表单中数据
    handleData(item) {
      item.integralGetStatus = String(item.integralGetStatus);
      item.integralUseStatus = String(item.integralUseStatus);
      item.integralGetStrategy = String(item.integralGetStrategy);
      item.integralGetDiscountControl = String(item.integralGetDiscountControl);
      item.integralUseDiscountControl = String(item.integralUseDiscountControl);
      item.integralGetDiscountControlUpper = String(item.integralGetDiscountControlUpper);
      item.integralGetDiscountControlLower = String(item.integralGetDiscountControlLower);
      item.integralUseDiscountControlUpper = String(item.integralUseDiscountControlUpper);
      item.integralUseDiscountControlLower = String(item.integralUseDiscountControlLower);

      item.integralGet = JSON.parse(item.integralGet);
      item.integralUse = JSON.parse(item.integralUse);
      item.integralCost = JSON.parse(item.integralCost);
      item.integralGet.fee = Number(item.integralGet.fee / 10).toFixed(1);
      item.integralGet.integral = Number(item.integralGet.integral / 10);
      return item;
    },

    changeRoute(route) {
      this.$router.push(route);
    },
    // 编辑积分获取策略
    handleEditClick(row) {
      this.$router.push({
        path: '/editPointSystem',
        query: {
          integralStrategyId: row.integralStrategyId
        }
      });
    },
    // 编辑积分抵现策略
    handleEditClick2(row) {
      this.$router.push({
        path: '/editIntegralSytem',
        query: {
          integralStrategyId: row.integralStrategyId
        }
      });
    },
    // 判断是否是太平鸟
    getLoginInfo() {
      let that = this;
      let param = {};
      postRequest('/api-auth/get-login-user-info', param)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 0) {
            if (resData.result.enterpriseId == that.tpnEnterpriseId) {
              that.tpnEditBool = true;
            }
          } else {
            errMsg.errorMsg(resData);
          }
        })
        .catch(function(error) {
          log(error);
        });
    }
  },
  components: {
    topNavNew,
    pointForm
  },
  mounted() {
    let that = this;
    that.getPointInfo();
    that.getLoginInfo();
  }
};
</script>
<style lang="less" scoped>
.right-box {
  padding: 0;
}
.attention-wrap {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  .item-label {
    font-size: 14px;
    color: #606266;
    margin-bottom: 30px;
    span {
      display: inline-block;
      width: 80px;
    }
  }
  .attention-content-wrap {
  }
}

.attention-wrap {
  .point-cell {
    & + .point-cell {
      margin-top: 60px;
    }
  }
  .flex {
    display: -webkit-flex;
    display: flex;

    &.table-top {
      border-bottom: 1px solid #e7e7eb;
      padding-bottom: 22px;
      position: relative;
    }

    .flex-1 {
      -webkit-flex: 1;
      -moz-flex: 1;
      -ms-flex: 1;
      -o-flex: 1;
      flex: 1;
    }

    .flex-title {
      font-size: 15px;
      font-weight: 500;
      padding: 5px 0;
    }

    .flex-lable {
      font-size: 13px;
      color: #828282;
    }

    .flex-l {
      text-align: left;
    }

    .flex-r {
      text-align: right;
    }
  }
}
.right-box /deep/ .el-form-item .el-input__inner {
  padding-right: 15px;
}
.point-cell-wrap {
  padding: 24px 32px 0;
}
.title-wrap {
  border-bottom: 1px solid #e7e7eb;
  padding: 20px 32px 15px;
}
.btn-r-wrap {
  padding: 24px 24px 22px 0;
}
.table-contain {
  padding: 0 24px 24px;
}
/* 去掉表格的最后一条线 */
.table-no-line-wrap::before {
  height: 0;
}
</style>
