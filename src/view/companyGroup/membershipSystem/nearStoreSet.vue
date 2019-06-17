<template>
  <div class="right-wrap near-store-contain">
    <topNav :navpath="navpath"></topNav>
    <div class="right-content">
      <div class="right-box">
        <div class="attention-wrap">
          <label class="near-store-tip">单商户小程序中附近门店是否展示集团其他商户门店</label>
          <div class="item-label">
            <span>展示</span>
            <el-switch v-model="nearStoreSwithFlag" @change="nearStoreSwitch"></el-switch>
          </div>
        </div>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>
<script>
import topNav from 'components/nav/nav';
import { postRequest } from '@/api/api';
import { log } from '@/utils/index.js';
export default {
  name: 'nearStoreSet',
  data() {
    return {
      projectName: 'gic-clique', // 当前项目名
      // 头部面包屑导航
      navpath: [
        {
          name: '首页',
          path: '/'
        },
        {
          name: '附近门店',
          path: ''
        }
      ],
      // 附近门店
      nearStoreSwithFlag: true
    };
  },
  created() {
    // this.selectReplayStyle()
  },
  methods: {
    changeRoute(route) {
      log('route-change');
      this.$router.push(route);
    },

    // change 附近门店开启/关闭
    nearStoreSwitch() {
      var that = this;
      log(that.nearStoreSwithFlag);

      that.setNearStore();
    },

    // 设置附近门店开启/关闭
    setNearStore() {
      var that = this;

      var param = {
        requestProject: that.projectName,
        isShowCliqueStore: that.nearStoreSwithFlag == true ? 1 : 0
      };

      postRequest('/api-admin/save-clique-show-store', param)
        .then(res => {
          // log(res,res.data,res.data.errorCode)
          var resData = res.data;
          if (resData.errorCode == 0) {
            that.$message({
              message: '修改附近门店显示配置成功',
              type: 'success'
            });
            return;
          }
          // that.userFormVisible = false;
          that.nearStoreSwithFlag = false;
          that.$message.error({
            duration: 1000,
            message: resData.message
          });
        })
        .catch(function(error) {
          log(error);
          // that.toLogin()
          // that.userFormVisible = false;
          that.nearStoreSwithFlag = false;
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    // 获取附近门店开启值
    getNearStore() {
      var that = this;

      var param = {
        requestProject: that.projectName
      };

      postRequest('/api-admin/clique-show-store', param)
        .then(res => {
          // log(res,res.data,res.data.errorCode)
          var resData = res.data;
          if (resData.errorCode == 0) {
            that.nearStoreSwithFlag = resData.result.isShowCliqueStore == 1 ? true : false;
            return;
          }
          // that.userFormVisible = false;
          that.$message.error({
            duration: 1000,
            message: resData.message
          });
        })
        .catch(function(error) {
          log(error);
          // that.toLogin()
          // that.userFormVisible = false;
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });

      // // 提示信息
      // that.$message.error({
      //   duration: 1000,
      //   message: '获取附近门店开启值'
      // })
    }
  },
  mounted() {
    var that = this;
    that.getNearStore();
  },
  components: {
    topNav
  }
};
</script>
<style lang="less" scoped>
.attention-wrap {
  padding: 24px 33px;
  background: #fff;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  .near-store-tip {
    display: block;
    font-size: 14px;
    margin-bottom: 30px;
  }
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
</style>
