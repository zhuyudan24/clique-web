<template>
  <div class="edit-dialog-wrap">
    <el-dialog title="完成订单评价" :visible.sync="dialogEdit" width="600px" :before-close="handleEditClose">
      <div class="edit-dialog-body" style="padding: 0px 20px;">
        <div class="edit-row">
          <el-radio v-model="acceptData.radio" label="0">固定奖励</el-radio>
          <span class="pad-l-10">获得</span><el-input v-model="acceptData.point" placeholder="" @keyup.native="($event, value) => numInput($event, value)" type="tel" :maxlength="inputLength"></el-input><span class="pad-l-10">积分/笔</span>
        </div>
        <div class="edit-row">
          <el-radio v-model="acceptData.radio" label="1">按金额设置</el-radio>
          <span class="pad-l-10">订单实付金额每满 </span>
          <el-input v-model="acceptData.money" placeholder="" @keyup.native="($event, value) => moneyInput($event, value)" type="tel" :maxlength="inputLength"></el-input>
          <span>元,得</span>
          <el-input v-model="acceptData.moneyPoint" placeholder="" @keyup.native="($event, value) => moneyPointInput($event, value)" type="tel" :maxlength="inputLength"></el-input>
          <span class="pad-l-10">积分</span>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditcancel">取 消</el-button>
        <el-button type="primary" @click="dialogEditConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { getRequest } from './api';
import strLength from './../../common/js/strlen';
import { log } from '@/utils/index.js';
export default {
  name: 'edit-dialog',
  props: ['showEditDialog', 'projectName', 'transData'],
  data() {
    return {
      repProjectName: 'gic-web', // 项目名
      acceptData: {
        radio: '1',
        point: '',
        money: 10,
        moneyPoint: 10
      }, //接收的数据

      dialogEdit: false,
      inputLength: 6
    };
  },
  methods: {
    // 输入框输入
    numInput(e, r) {
      let that = this;
      log(e, r);
      // 过滤非数字
      that.inputNum = strLength.getCharVal(e.target.value.replace(/[^\d]/g, ''), that.inputLength);

      that.acceptData.point = that.inputNum;
    },
    // 输入框输入
    moneyInput(e, r) {
      let that = this;
      log(e, r);
      // 过滤非数字
      that.moneyInputNum = strLength.getCharVal(e.target.value.replace(/[^\d]/g, ''), that.inputLength);
      that.acceptData.money = that.moneyInputNum;
    },
    // 输入框输入
    moneyPointInput(e, r) {
      let that = this;
      log(e, r);
      // 过滤非数字
      that.moneyNum = strLength.getCharVal(e.target.value.replace(/[^\d]/g, ''), that.inputLength);
      that.acceptData.moneyPoint = that.moneyNum;
    },
    // 设置接收参数
    setNewData(flag) {
      let that = this;
      that.dialogEdit = flag;
      log('弹框是否显示: ', flag);
    },

    // 检查编辑弹窗
    checkEditPoint() {
      let that = this;
      if (!that.acceptData.point) {
        that.$message.error({
          duration: 1000,
          message: '请输入积分,且不能小于等于0'
        });
        return false;
      } else {
        return true;
      }
    },

    checkEditMoney() {
      let that = this;
      if (!that.acceptData.money || !that.acceptData.moneyPoint) {
        that.$message.error({
          duration: 1000,
          message: '请输入金额和积分,且不能小于等于0'
        });
        return false;
      } else {
        return true;
      }
    },

    // 确认
    dialogEditConfirm() {
      let that = this;
      log('确认', that.acceptData.radio);
      if (that.acceptData.radio == 0) {
        log(0);
        if (!that.checkEditPoint()) {
          return;
        } else {
          log(1, that.acceptData);
          that.$emit('setEdit', that.acceptData);
        }
      } else {
        log(1);
        if (!that.checkEditMoney()) {
          return;
        } else {
          log(2);
          that.$emit('setEdit', that.acceptData);
        }
      }
    },

    handleEditClose() {
      let that = this;
      that.dialogEditcancel();
    },

    //  取消
    dialogEditcancel() {
      let that = this;
      that
        .$confirm('确认关闭?', '', {
          confirmButtonText: '确 定',
          cancelButtonText: '取 消',
          type: ''
        })
        .then(() => {
          log('点击确认');
          that.radio = null;
          that.dialogEdit = false;
          that.$emit('setEdit');
        })
        .catch(() => {
          log('取消 取消关闭');
        });
    },

    // 获取卡券列表
    getCardList() {
      let that = this;
      // let para = {
      //   currentPage: that.cardCurrentPage,
      //   pageSize: that.cardPageSize,
      //   searchParam: that.searchText,
      //   requestProject: that.repProjectName,
      //   cardLimitType: '',
      //   cardTypes: ''
      // };
      that.axios
        .post('/api-plug/get-coupon-list', {})
        .then(res => {
          log(res, res.data, res.data.errorCode);
          let resData = res.data;
          if (resData.errorCode == 0) {
            return;
          }
          that.$message.error({
            duration: 1000,
            message: resData.message
          });
        })
        .catch(function(error) {
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    }
  },
  watch: {
    showEditDialog: function(newData, oldData) {
      let that = this;
      that.setNewData(newData);
    },
    projectName: function(newData, oldData) {
      let that = this;
      that.repProjectName = newData || 'gic-web';
    },
    transData: function(newData, oldData) {
      let that = this;
      newData.radio = String(newData.radio);
      that.acceptData = newData;
    }
  },

  /* 接收数据 */
  mounted() {
    let that = this;
    // 项目名
    that.repProjectName = that.projectName || 'gic-web';
    that.transData.radio = String(that.transData.radio);
    that.acceptData = that.transData;
    that.setNewData(that.showEditDialog);
  }
};
</script>

<style lang="scss" scoped>
.edit-dialog-wrap {
  .pad-l-10 {
    padding-left: 10px;
  }
  .pad-r-10 {
    padding-right: 10px;
  }
  .el-input {
    width: 60px;
    padding: 0 10px;
  }

  .edit-row {
    line-height: 32px;

    span {
      display: inline-block;
      vertical-align: middle;
    }
    & + .edit-row {
      margin-top: 10px;
    }
  }
}
</style>
