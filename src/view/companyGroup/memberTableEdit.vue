<template>
  <div class="inner-cell-contain">
    <!-- v-for="(consumItem,index) in consumeArray" -->
    <div class="member-achieve-tabletitle">
      <label class="tabletitle-l">{{ accumulateConsum.achievementName }}</label>
      <el-switch v-model="accumulateConsum.isOpen" @change="consumItemSwitch($event, accumulateConsum)"></el-switch>
    </div>
    <el-table class="member-cell-table" :data="subAchievementList" style="width: 100%">
      <el-table-column prop="limitNum" label="额度">
        <template slot-scope="scope">
          <!-- <p contenteditable="true" @input="scope.row.limitNum = $event.target.innerText">{{ scope.row.limitNum }}</p> -->

          <span class="span-txt">{{ accumulateConsum.text }}</span>

          <span class="span-num" v-if="!scope.row.editLimitFlag">{{ scope.row.achievementTarget }}</span>
          <el-input size="small" class="w-175" v-if="scope.row.editLimitFlag" v-model="scope.row.targetInput" @keyup.native="$event => limitNumInput($event)" placeholder="请输入" @focus="focusInput(scope.$index, scope.row, subAchievementList, 1)" type="tel" :maxlength="inputLength"></el-input>
          <!-- <span class="span-unit" v-if="(accumulateConsum.type==0||accumulateConsum.type==2)">元</span>
          <span class="span-unit" v-if="accumulateConsum.type==1">个月</span>
          <span class="span-unit" v-if="accumulateConsum.type==3">件</span>
          <span class="span-unit" v-if="(accumulateConsum.type==4||accumulateConsum.type==7||accumulateConsum.type==8||accumulateConsum.type==9||accumulateConsum.type==10)">次</span>
          <span class="span-unit" v-if="accumulateConsum.type==5">积分</span> -->
          <span class="span-unit">{{ accumulateConsum.unit }}</span>
          <i class="el-icon-edit" v-if="!scope.row.editLimitFlag" @click="editLimitNum(scope.$index, scope.row, subAchievementList, 1)"></i>
          <span class="span-oprate-icon" v-if="scope.row.editLimitFlag">
            <i class="el-icon-text el-button--text text-confirm" @click="saveLimitNum(scope.$index, scope.row, subAchievementList, 1)">保存</i>
            <i class="el-icon-text text-cancel" @click="cancelLimitNum(scope.$index, scope.row, subAchievementList, 1)">取消</i>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="rewardNum" label="奖励">
        <template slot-scope="scope">
          <span class="span-txt">奖励</span>
          <span class="span-num" v-if="!scope.row.editRewardFlag">{{ scope.row.rewardValue }}</span>
          <el-input size="small" class="w-175" v-if="scope.row.editRewardFlag" v-model="scope.row.rewardInput" @keyup.native="$event => limitNumInput($event)" @focus="focusInput(scope.$index, scope.row, subAchievementList, 2)" placeholder="请输入" type="tel" :maxlength="inputLength"></el-input>
          <span class="span-unit">积分</span>
          <i class="el-icon-edit" v-if="!scope.row.editRewardFlag" @click="editLimitNum(scope.$index, scope.row, subAchievementList, 2)"></i>
          <span class="span-oprate-icon" v-if="scope.row.editRewardFlag">
            <i class="el-icon-text el-button--text text-confirm" @click="saveLimitNum(scope.$index, scope.row, subAchievementList, 2)">保存</i>
            <i class="el-icon-text text-cancel" @click="cancelLimitNum(scope.$index, scope.row, subAchievementList, 2)">取消</i>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="" label="库存">
        <template slot-scope="scope">
          {{ scope.row.couponStock == 0 ? '--' : '' }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import strLength from '@/common/js/strlen';
import showMsg from '@/common/js/showmsg';
import errMsg from '@/common/js/error';
import { postJson } from '@/api/api';
import { log } from '@/utils/index.js';

export default {
  name: 'memberTableEdit',
  props: ['tableEditData'],
  data() {
    return {
      accumulateConsum: {},
      subAchievementList: [],
      inputLength: 6, // 限制输入数字长度

      // 输入框的
      inputValue: '',

      editObj: {
        index: '',
        row: '',
        obj: '',
        type: ''
      },
      copyOriginObj: JSON.parse(JSON.stringify(this.tableEditData)) // 复制原始数据,每次保存需要重新赋值
    };
  },

  created() {
    // this.selectReplayStyle()
  },

  methods: {
    // switch(通用方法)
    consumItemSwitch(e, obj) {
      let that = this;
      log(e, obj, obj.achievementType);
      // that.accumulateConsum.switchFlag = false
      log(obj, that.accumulateConsum);
      that.tempObj = obj;
      let status = e == true ? 1 : 0;
      that.saveSwitch(obj.achievementSystemId, status);
    },

    // 开关
    saveSwitch(id, status) {
      let that = this;
      let para = {
        achievementSystemId: id,
        openStatus: status
      };
      postJson('/api-member/achievement-open-clique', para)
        .then(res => {
          log(res.data.result);
          let resData = res.data;
          if (resData.errorCode == 0) {
            showMsg.showmsg('设置成功', 'success');
            return;
          }
          that.tempObj.isOpen = false;
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

    // 编辑额度
    editLimitNum(index, row, obj, type) {
      let that = this;
      that.$forceUpdate();
      log(index, row, obj);
      that.editObj.index = index;
      that.editObj.row = row;
      that.editObj.obj = obj;
      // 判断是额度还是奖励
      if (type == 1) {
        row.editLimitFlag = true;
      } else {
        row.editRewardFlag = true;
      }

      log(row.editLimitFlag);

      // 赋值给input
      // that.inputValue = row.achievementTarget
      // that.$set(that.accumulateConsum.subAchievementList[index],'editLimitFlag',true)
    },

    //确定编辑
    saveLimitNum(index, row, obj, updataType) {
      let that = this;
      log(index, row, row.achievementTarget, obj);

      // 判断
      if (updataType == 1 && index == 0 && Number(row.targetInput) >= Number(obj[index + 1].achievementTarget)) {
        that.$message.error({
          duration: 1000,
          message: '每一阶都必须大于上一阶，小于下一阶'
        });
        return;
      }
      if (updataType == 1 && index == obj.length - 1 && Number(row.targetInput) <= Number(obj[index - 1].achievementTarget)) {
        that.$message.error({
          duration: 1000,
          message: '每一阶都必须大于上一阶，小于下一阶'
        });
        return;
      }
      // log(obj[index],obj.length-1,row.targetInput,obj[index-1].achievementTarget)
      if (updataType == 1 && index > 0 && index < obj.length - 1 && Number(row.targetInput) <= Number(obj[index - 1].achievementTarget)) {
        log(index);
        that.$message.error({
          duration: 1000,
          message: '每一阶都必须大于上一阶，小于下一阶'
        });
        return;
      }
      // if (index < obj.length-1) {
      if (updataType == 1 && index > 0 && index < obj.length - 1 && Number(row.targetInput) >= Number(obj[index + 1].achievementTarget)) {
        log(index);
        that.$message.error({
          duration: 1000,
          message: '每一阶都必须大于上一阶，小于下一阶'
        });
        return;
      }
      // }

      // 把输入框中值赋值给当前显示的字段
      row.achievementTarget = row.targetInput;
      row.rewardValue = row.rewardInput;

      let id = row.achievementEnterpriseRankId;
      let type = updataType;
      let target = row.achievementTarget;
      let value = row.rewardValue;
      // 校验非空
      if (type == 1 && String(target).trim() == '') {
        that.$message.error({
          duration: 1000,
          message: '请输入额度'
        });
        return;
      }
      if (type == 2 && String(value).trim() == '') {
        that.$message.error({
          duration: 1000,
          message: '请输入奖励'
        });
        return;
      }

      // 保存数据
      that.saveModify(id, type, target, value);

      // if (that.saveModify(id,type,target,value)) {
      //   return;
      // }
      // that.saveModify(id,type,target,value)
      // 不可编辑
      if (type == 1) {
        row.editLimitFlag = false;
      } else {
        row.editRewardFlag = false;
      }

      // 清空输入数值
      that.inputNum = '';
      // 清空暂存的数据
      that.editObj = {
        index: '',
        row: '',
        obj: '',
        type: ''
      };
    },

    // 取消编辑
    cancelLimitNum(index, row, obj, type) {
      let that = this;
      log(index, row);
      if (type == 1) {
        row.editLimitFlag = false;
        // 取消后直接把原来值赋值给输入框
        row.targetInput = row.achievementTarget;
      } else {
        row.editRewardFlag = false;
        row.rewardInput = row.rewardValue;
      }

      that.inputNum = ''; // 清空输入数值
      // 清空暂存的数据
      that.editObj = {
        index: '',
        row: '',
        obj: '',
        type: ''
      };
    },

    // input focus
    focusInput(index, row, obj, type) {
      let that = this;
      log('input-focus:', index, row, obj, type);
      // 保存当前编辑的的对象
      that.editObj.index = index;
      that.editObj.row = row;
      that.editObj.obj = obj;
      that.editObj.type = type;
    },

    // limitNumInput
    limitNumInput(e) {
      let that = this;
      log(e, that.editObj.obj);
      // 过滤非数字
      that.inputNum = strLength.getCharVal(e.target.value.replace(/[^\d]/g, ''), that.inputLength);

      // 输入后把输入的值赋值给当前对应的的输入框值
      if (that.editObj.type == 1) {
        that.editObj.row.targetInput = that.inputNum;
      } else {
        that.editObj.row.rewardInput = that.inputNum;
      }

      log(that.inputNum);
    },
    //===========================================
    //保存修改积分 额度
    saveModify(id, type, target, value) {
      let that = this;
      let para = {
        achievementEnterpriseRankId: id,
        updateType: type,
        achievementTarget: target || '',
        achievementRewardType: 1,
        rewardValue: value || '',
        rewardName: '积分XX'
      };
      postJson('/api-member/achievement-update-clique', para)
        .then(res => {
          log(res.data);
          let resData = res.data;
          if (resData.errorCode == 0) {
            showMsg.showmsg('设置成功', 'success');
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
    }
  },

  watch: {
    tableEditData(val) {
      let that = this;
      if (!!val && Object.keys(val).length) {
        let obj = val;
        that.accumulateConsum = obj; // 新增watch，监听变更并同步到tableEditData上
        that.subAchievementList = obj.subAchievementList;
      }
    }
  },
  mounted() {
    let that = this;
    let obj = that.tableEditData;
    that.accumulateConsum = obj;
    that.subAchievementList = obj.subAchievementList;
  }
};
</script>
<style lang="less" scoped>
.member-achieve-contain /deep/ {
  .inner-cell-contain {
    background: #fff;
    padding: 24px;
    border: 1px solid #e7e7eb;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;

    & + .inner-cell-contain {
      margin-top: 15px;
    }
    .member-cell-table /deep/ {
      &.el-table::before {
        /*content: none;*/
      }
      .el-table__body {
        width: 90px;
        tr.el-table__row td {
          border: none;
        }
      }
    }
  }

  .member-achieve-tabletitle {
    padding: 10px 0;
    font-size: 14px;
    color: #606266;
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
  }

  .el-icon-text {
    font-style: normal;
    font-size: 14px;
    color: #1890ff;

    &.text-confirm {
      font-weight: 500;
    }
    &.text-cancel {
      font-weight: 500;
    }
  }

  .span-oprate-icon {
    margin-left: 7px;
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
</style>
