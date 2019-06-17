<template>
  <div class="right-wrap task-public">
    <topNav></topNav>
    <el-tabs v-model="memberTab" @tab-click="handleTabClick">
      <el-tab-pane label="消费类" name="first">
        <div class="right-content">
          <div class="right-box">
            <div class="attention-wrap member-achieve-contain">
              <!-- 消费类 -->
              <div class="outer-contain">
                <!-- 消费累计 -->
                <template v-for="(item, index) in consumeArray">
                  <memberTableEdit :tableEditData="item" :key="index" />
                </template>
                <!-- 连续每月消费行为 -->
                <!-- <memberTableEdit :tableEditData="continuousConsum"/> -->
                <!-- 最高单天消费 -->
                <!-- <memberTableEdit :tableEditData="maxSingleConsum"/> -->
                <!-- 最高单天购买件数 -->
                <!-- <memberTableEdit :tableEditData="maxSinglePerNum"/> -->
                <!-- 累计评价次数 -->
                <!-- <memberTableEdit :tableEditData="totalEvaluate"/> -->
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="互动类" name="second">
        <div class="right-content">
          <div class="right-box">
            <div class="attention-wrap member-achieve-contain">
              <!-- 互动类 -->
              <div class="outer-contain">
                <template v-for="(item, index) in interactionArray">
                  <memberTableEdit :tableEditData="item" :key="index" />
                </template>
                <!-- 累计获取积分 -->
                <!-- <memberTableEdit :tableEditData="accumulatePoint"/> -->
                <!-- 累计关注时长 -->
                <!-- <memberTableEdit :tableEditData="accumulateFollow"/> -->
                <!-- 累计签到次数 -->
                <!-- <memberTableEdit :tableEditData="accumulateSign"/> -->
                <!-- 最高连续签到天数 -->
                <!-- <memberTableEdit :tableEditData="maxSignNum"/> -->
                <!-- 使用优惠券数量 -->
                <!-- <memberTableEdit :tableEditData="useCouponNum"/> -->
                <!-- 积分兑换次数 -->
                <!-- <memberTableEdit :tableEditData="pointExchange"/> -->
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>
<script>
import topNav from 'components/nav/nav';
import memberTableEdit from '../memberTableEdit';
import errMsg from '@/common/js/error';
import { postRequest, postJsonRequest } from '@/api/api';
import { log } from '@/utils/index.js';

export default {
  name: 'memberAchievement',
  data() {
    return {
      projectName: 'gic-clique', // 当前项目名
      memberTab: 'first',
      // 消费
      consumeArray: [],
      accumulateConsum: {},
      // 连续每月有消费行为
      continuousConsum: {},
      //  最高单天消费
      maxSingleConsum: {},
      // 最高单天购买件数
      maxSinglePerNum: {},
      // 累计评价次数
      totalEvaluate: {},
      // 互动类
      interactionArray: [],
      accumulatePoint: {},
      // 累计关注时长
      accumulateFollow: {},
      //  累计签到次数
      accumulateSign: {},
      // 最高连续签到天数
      maxSignNum: {},

      // 使用优惠券数量
      useCouponNum: {},

      // 积分兑换次数
      pointExchange: {},
      inputLength: 10, // 限制输入数字长度

      editObj: {
        index: '',
        row: ''
      }
    };
  },
  created() {
    // this.selectReplayStyle()
  },
  methods: {
    changeRoute(route) {
      this.$router.push(route);
    },

    // tab click
    handleTabClick(tab, event) {
      log(tab, event);
    },

    // 获取成就信息
    getInfo() {
      let that = this;
      let para = {};
      postJsonRequest('/api-member/achievement-list-clique', para)
        .then(res => {
          log(res.data);
          let resData = res.data;
          if (resData.errorCode == 0) {
            let data = resData.result.achievememntList;
            data.forEach(function(ele, index) {
              // 处理显示 XX, 在组件中处理会无法渲染到页面
              let obj = ele;
              let arr = obj.achievementDoc.split('XX');
              obj.text = arr[0];
              obj.unit = arr[1];
              obj.isOpen = obj.isOpen == 1 ? true : false;
              obj.subAchievementList.forEach(function(el, i) {
                // obj.achievementDoc = obj.achievementDoc.replace(/XX/g, ele.)
                // 添加编辑 flag
                el.editLimitFlag = false;
                el.targetInput = el.achievementTarget;
                el.editRewardFlag = false;
                el.rewardInput = el.rewardValue;
              });
              if (ele.achievementType == 1) {
                // 消费类
                that.consumeArray.push(ele);
              } else {
                // 互动类
                that.interactionArray.push(ele);
              }
            });

            log(that.consumeArray, that.interactionArray);

            // showMsg.showmsg('设置成功','success')
            return;
          }
          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          log(error);

          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    // get nav path
    getNavPath() {
      let that = this;
      let para = {
        project: that.projectName,
        path: 'memberAchievement' //that.$route.path
      };

      postRequest('/api-auth/get-current-memu-data', para)
        .then(res => {
          // log(res,res.data,res.data.errorCode)
          let resData = res.data;
          if (resData.errorCode == 0) {
            if (!resData.result) {
              log('resData.result: ', resData.result);
              return;
            }
            that.navpath[1].name = resData.result.level2.menuName;
            that.navpath[1].path = '';

            that.navpath[2].name = resData.result.level3.menuName;
            that.navpath[2].path = '';
            that.navpath[3].name = resData.result.level4.menuName;
            that.navpath[3].path = '';

            return;
          }
          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          log(error);
          // that.toLogin()
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    }
  },
  components: {
    topNav,
    memberTableEdit
  },

  mounted() {
    let that = this;
    that.getInfo();
    // that.getNavPath()
  }
};
</script>
<style lang="scss" scoped>
.right-wrap /deep/ {
  .navwrap.boxbttom {
    border: none;
  }
  .el-tabs /deep/ {
    .el-tabs__header {
      margin: 0;
      padding-left: 24px;
      border-bottom: 1px solid #e4e7ed;
      background: #fff;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
    }

    .el-tabs__nav-wrap::after {
      content: none;
    }
  }
}

.el-tabs__nav {
  z-index: 1;
}

.attention-wrap {
  /*background: #fff;*/
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
  &.member-achieve-contain /deep/ {
    .inner-cell-contain {
      /*padding: 5px 15px 40px 15px;*/
      border: 0px solid #e7e7eb;
      border-radius: 2px;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      & + .inner-cell-contain {
        margin-top: 15px;
      }
      el-table::before {
        content: none;
      }

      .member-cell-table /deep/ {
        .el-table__body {
          width: 90px;
          tr.el-table__row:last-child td {
            border: none;
          }
        }
      }
    }

    .member-achieve-tabletitle {
      padding: 0 0 10px 0;
      font-size: 16px;
      color: #303133;
      font-weight: 700;
      margin-bottom: 10px;
      overflow: hidden;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;

      .el-switch {
        float: right;
      }
    }

    .el-icon-edit {
      cursor: pointer;
      color: #909399;
      font-size: 14px;
      &:hover {
        color: #409eff;
      }
    }

    .span-oprate-icon i {
      cursor: pointer;
      /*font-size: 20px;*/
      display: inline-block;
      vertical-align: middle;
    }

    .w-175 {
      width: 175px;
    }
  }
}
</style>
