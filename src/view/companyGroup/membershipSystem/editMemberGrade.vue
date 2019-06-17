<template>
  <div class="right-wrap">
    <topNavNew :navpath="navpath"></topNavNew>
    <div class="right-content">
      <div class="right-box">
        <div class="attention-wrap">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
            <el-form-item label="等级名称" prop="gradeName" class="limit-el-item">
              <el-input v-model="ruleForm.gradeName" class="w-340" @focus="focus('gradeName', 12)" @keyup.native="value => toInput(value)">
                <!-- <template slot="append"><label class="input-label">{{inputNumObj.gradeName}}/12</label></template> -->
              </el-input>
              <label class="input-label">{{ inputNumObj.gradeName }}/12</label>
            </el-form-item>
            <el-form-item label="等级编码" prop="gradeCode" class="limit-el-item">
              <el-input v-model="ruleForm.gradeCode" class="w-340" @focus="focus('gradeCode', 6)" @keyup.native="value => toInput(value)" :disabled="ruleForm.gradeCode == '' ? false : true">
                <!-- <template slot="append"><label class="input-label">{{inputNumObj.gradeCode}}/6</label></template> -->
              </el-input>
              <label class="input-label">{{ inputNumObj.gradeCode }}/6</label>
            </el-form-item>
            <el-form-item label="等级类型" prop="gradeType">
              <el-radio v-model="ruleForm.gradeType" label="1">常规卡</el-radio>
              <el-radio v-model="ruleForm.gradeType" label="2">特殊卡</el-radio>
            </el-form-item>
            <!-- 自动升级 -->
            <!-- 自动升级 -->
            <el-form-item label="自动升级" prop="">
              <el-switch v-model="ruleForm.autoUpgrade"> </el-switch>
            </el-form-item>
            <el-form-item label="升级条件" prop="" v-if="ruleForm.autoUpgrade">
              <div class="check-cell">
                <el-checkbox v-model="ruleForm.upLevelHighcostSelect">当天消费满</el-checkbox>
                <el-input v-model="ruleForm.upLevelHighcost" @focus="inputFocus('upLevelHighcost', 'money')" @keyup.native="formatInput($event)"></el-input>
                <label> 元 </label>
              </div>
              <div class="check-cell">
                <el-checkbox v-model="ruleForm.upLevelDaystoredSelect">当天储值满</el-checkbox>
                <el-input v-model="ruleForm.upLevelDaystored" @focus="inputFocus('upLevelDaystored', 'money')" @keyup.native="formatInput($event)"></el-input>
                <label> 元 </label>
              </div>
              <div class="check-cell">
                <el-checkbox v-model="ruleForm.upLevelSumcostSelect"></el-checkbox>
                <el-input v-model="ruleForm.upLevelSumcostDays" @focus="inputFocus('upLevelSumcostDays', 'day')" @keyup.native="formatInput($event)"></el-input>
                <label>天内消费满</label>
                <el-input v-model="ruleForm.upLevelSumcost" @focus="inputFocus('upLevelSumcost', 'money')" @keyup.native="formatInput($event)"></el-input>
                <label> 元 </label>
              </div>
              <div class="check-cell">
                <el-checkbox v-model="ruleForm.upLevelCostimesSelect"></el-checkbox>
                <el-input v-model="ruleForm.upLevelCosttimesDays" @focus="inputFocus('upLevelCosttimesDays', 'day')" @keyup.native="formatInput($event)"></el-input>
                <label>天内消费满</label>
                <el-input v-model="ruleForm.upLevelCosttimes" @focus="inputFocus('upLevelCosttimes', 'day')" @keyup.native="formatInput($event)"></el-input>
                <label> 次 </label>
              </div>
              <div class="check-cell">
                <el-checkbox v-model="ruleForm.upLevelSumstoredSelect"></el-checkbox>
                <el-input v-model="ruleForm.upLevelSumstoredDays" @focus="inputFocus('upLevelSumstoredDays', 'day')" @keyup.native="formatInput($event)"></el-input>
                <label>天内储值满</label>
                <el-input v-model="ruleForm.upLevelSumstored" @focus="inputFocus('upLevelSumstored', 'money')" @keyup.native="formatInput($event)"></el-input>
                <label> 元 </label>
              </div>
              <div class="check-cell">
                <el-checkbox v-model="ruleForm.upLevelSumintegralSelect"></el-checkbox>
                <el-input v-model="ruleForm.upLevelSumintegralDays" @focus="inputFocus('upLevelSumintegralDays', 'day')" @keyup.native="formatInput($event)"></el-input>
                <label>天内获得 </label>
                <el-input v-model="ruleForm.upLevelSumintegral" @focus="inputFocus('upLevelSumintegral', 'point')" @keyup.native="formatInput($event)"></el-input>
                <label> 积分 </label>
              </div>
            </el-form-item>
            <!-- 自动降级 -->
            <el-form-item label="自动降级" prop="">
              <el-switch v-model="ruleForm.autoDowngrade"> </el-switch>
            </el-form-item>
            <div v-if="ruleForm.autoDowngrade">
              <el-form-item label="会员等级有效期" prop="">
                <label> 自升级之日起算 </label>
                <el-input v-model="ruleForm.gradeEffectDay" @focus="inputFocus('gradeEffectDay', 'day')" @keyup.native="formatInput($event)"></el-input>
                <label> 天 </label>
              </el-form-item>
              <el-form-item label="保级条件" prop="">
                <div class="check-cell">
                  <el-checkbox v-model="ruleForm.lowLevelHighcostSelect"></el-checkbox>
                  <el-input v-model="ruleForm.lowLevelHighcostDays" @focus="inputFocus('lowLevelHighcostDays', 'day')" @keyup.native="formatInput($event)"></el-input>
                  <label>天内单天消费满</label>
                  <el-input v-model="ruleForm.lowLevelHighcost" @focus="inputFocus('lowLevelHighcost', 'money')" @keyup.native="formatInput($event)"></el-input>
                  <label> 元 </label>
                </div>
                <div class="check-cell">
                  <el-checkbox v-model="ruleForm.lowLevelDaystoredSelect"></el-checkbox>
                  <el-input v-model="ruleForm.lowLevelDaystoredDays" @focus="inputFocus('lowLevelDaystoredDays', 'day')" @keyup.native="formatInput($event)"></el-input>
                  <label>天内单天储值满</label>
                  <el-input v-model="ruleForm.lowLevelDaystored" @focus="inputFocus('lowLevelDaystored', 'money')" @keyup.native="formatInput($event)"></el-input>
                  <label> 元 </label>
                </div>
                <div class="check-cell">
                  <el-checkbox v-model="ruleForm.lowLevelSumcostSelect"></el-checkbox>
                  <el-input v-model="ruleForm.lowLevelSumcostDays" @focus="inputFocus('lowLevelSumcostDays', 'day')" @keyup.native="formatInput($event)"></el-input>
                  <label>天内消费满</label>
                  <el-input v-model="ruleForm.lowLevelSumcost" @focus="inputFocus('lowLevelSumcost', 'money')" @keyup.native="formatInput($event)"></el-input>
                  <label> 元 </label>
                </div>
                <div class="check-cell">
                  <el-checkbox v-model="ruleForm.lowLevelCosttimesSelect"></el-checkbox>
                  <el-input v-model="ruleForm.lowLevelCosttimesDays" @focus="inputFocus('lowLevelCosttimesDays', 'day')" @keyup.native="formatInput($event)"></el-input>
                  <label>天内消费满</label>
                  <el-input v-model="ruleForm.lowLevelCosttimes" @focus="inputFocus('lowLevelCosttimes', 'day')" @keyup.native="formatInput($event)"></el-input>
                  <label> 次 </label>
                </div>
                <div class="check-cell">
                  <el-checkbox v-model="ruleForm.lowLevelSumstoredSelect"></el-checkbox>
                  <el-input v-model="ruleForm.lowLevelSumstoredDays" @focus="inputFocus('lowLevelSumstoredDays', 'day')" @keyup.native="formatInput($event)"></el-input>
                  <label>天内储值满</label>
                  <el-input v-model="ruleForm.lowLevelSumstored" @focus="inputFocus('lowLevelSumstored', 'money')" @keyup.native="formatInput($event)"></el-input>
                  <label> 元 </label>
                </div>
                <div class="check-cell">
                  <el-checkbox v-model="ruleForm.lowLevelSumintegralSelect"></el-checkbox>
                  <el-input v-model="ruleForm.lowLevelSumintegralDays" @focus="inputFocus('lowLevelSumintegralDays', 'day')" @keyup.native="formatInput($event)"></el-input>
                  <label>天内获得</label>
                  <el-input v-model="ruleForm.lowLevelSumintegral" @focus="inputFocus('lowLevelSumintegral', 'point')" @keyup.native="formatInput($event)"></el-input>
                  <label> 积分 </label>
                </div>
              </el-form-item>
            </div>
            <el-form-item class="font-0">
              <el-button type="primary" @click="submitForm('ruleForm')">保 存</el-button>
              <el-button @click="goBack">返 回</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>
<script>
import topNavNew from 'components/nav/navNew';
import strLength from '@/common/js/strlen';
import showMsg from '@/common/js/showmsg';
import errMsg from '@/common/js/error';
import { postRequest } from '@/api/api';
import { log } from '@/utils/index.js';

export default {
  name: 'editMemberGrade',
  data() {
    return {
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
          name: '会员卡设置',
          path: '/memberCardSet'
        },
        {
          name: '编辑商户会员等级',
          path: '/memberGrade'
        },
        {
          name: '编辑商户会员等级',
          path: ''
        }
      ],

      enterpId: '',

      // 输入控制
      inputNumObj: {
        gradeName: 0,
        gradeCode: 0
      },
      // 记录输入的
      inputFlag: '',
      inputFlagNum: '',

      // form
      ruleForm: {},
      rules: {
        gradeName: [{ required: true, message: '请输入等级名称', trigger: 'blur' }],
        gradeCode: [{ required: true, message: '请输入等级编码', trigger: 'blur' }],
        gradeType: [{ required: true, message: '请输入等级类型', trigger: 'blur' }]
      },
      cliqueId: '',
      cliqueName: ''
    };
  },
  created() {
    // this.selectReplayStyle()
  },

  methods: {
    changeRoute(route) {
      this.$router.push(route);
    },

    // 返回
    goBack() {
      this.$router.go(-1);
    },

    inputFocus(tag, flag) {
      let that = this;
      log(tag);
      that.tempTag = tag;
      if (!!flag) {
        that.tempFlag = flag;
      } else {
        that.tempFlag = '';
      }
    },

    // 输入框输入校验数字
    formatInput(e) {
      let that = this;
      log(e, e.target.value);
      that.ruleForm[that.tempTag] = String(e.target.value).replace(/[^\.\d]/g, '');
      // if (that.tempTag == 'discountControlLower' || that.tempTag =='discountControlUpper') {
      //   that.ruleForm[that.tempTag] = parseInt(String(e.target.value).replace(/[^\.\d]/g,'')).toFixed(2) == 'NaN'? '0.00': parseInt(String(e.target.value).replace(/[^\.\d]/g,'')).toFixed(2);
      //   return;
      // }

      if (!!that.tempFlag && that.tempFlag == 'day') {
        that.ruleForm[that.tempTag] = strLength.getCharVal(String(e.target.value).replace(/[^\.\d]/g, ''), 4);
      }
      if (!!that.tempFlag && that.tempFlag == 'money') {
        that.ruleForm[that.tempTag] = strLength.getCharVal(String(e.target.value).replace(/[^\.\d]/g, ''), 6);
      }
      if (!!that.tempFlag && that.tempFlag == 'point') {
        that.ruleForm[that.tempTag] = strLength.getCharVal(String(e.target.value).replace(/[^\.\d]/g, ''), 8);
      }
    },

    // 检查条件
    checkUp(data) {
      let flag = true;
      if (!!data.autoUpgrade) {
        if (!!data.upLevelHighcostSelect && !data.upLevelHighcost) {
          flag = false;
        }

        if (!!data.upLevelDaystoredSelect && !data.upLevelDaystored) {
          flag = false;
        }

        if (!!data.upLevelSumcostSelect && (!data.upLevelSumcostDays || !data.upLevelSumcost)) {
          flag = false;
        }

        if (!!data.upLevelCostimesSelect && (!data.upLevelCosttimesDays || !data.upLevelCosttimes)) {
          flag = false;
        }

        if (!!data.upLevelSumstoredSelect && (!data.upLevelSumstoredDays || !data.upLevelSumstored)) {
          flag = false;
        }

        if (!!data.upLevelSumintegralSelect && (!data.upLevelSumintegralDays || !data.upLevelSumintegral)) {
          flag = false;
        }
      }
      return flag;
    },
    checkDown(data) {
      let flag = true;
      if (!!data.autoDowngrade) {
        if (!data.gradeEffectDay) {
          flag = false;
        }
        if (!!data.lowLevelHighcostSelect && (!data.lowLevelHighcostDays || !data.lowLevelHighcost)) {
          flag = false;
        }

        if (!!data.lowLevelDaystoredSelect && (!data.lowLevelDaystoredDays || !data.lowLevelDaystored)) {
          flag = false;
        }

        if (!!data.lowLevelSumcostSelect && (!data.lowLevelSumcostDays || !data.lowLevelSumcost)) {
          flag = false;
        }

        if (!!data.lowLevelCosttimesSelect && (!data.lowLevelCosttimesDays || !data.lowLevelCosttimes)) {
          flag = false;
        }

        if (!!data.lowLevelSumstoredSelect && (!data.lowLevelSumstoredDays || !data.lowLevelSumstored)) {
          flag = false;
        }

        if (!!data.lowLevelSumintegralSelect && (!data.lowLevelSumintegralDays || !data.lowLevelSumintegral)) {
          flag = false;
        }
      }
      return flag;
    },

    // 保存
    submitForm(formName) {
      let that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          // alert('submit!');
          if (!that.ruleForm.gradeName) {
            showMsg.showmsg('请填写等级名称', 'error');
            return;
          }
          if (!that.ruleForm.gradeCode) {
            showMsg.showmsg('请填写等级编码', 'error');
            return;
          }

          if (!that.checkUp(that.ruleForm)) {
            showMsg.showmsg('请填写升级条件', 'error');
            return;
          }
          if (!that.checkDown(that.ruleForm)) {
            showMsg.showmsg('请填写降级条件', 'error');
            return;
          }

          let data = JSON.parse(JSON.stringify(that.ruleForm));

          data.enterpriseId = that.enterpId;

          // 非空验证
          //
          data.discountControlUpper = data.discountControlUpper || '0';
          data.discountControlLower = data.discountControlLower || '0';

          data.autoDowngrade = data.autoDowngrade == true ? 1 : 2;
          data.autoUpgrade = data.autoUpgrade == true ? 1 : 2;
          data.gradeType = String(data.gradeType);

          data.upLevelHighcostSelect = data.upLevelHighcostSelect == true ? 1 : 0;
          data.upLevelDaystoredSelect = data.upLevelDaystoredSelect == true ? 1 : 0;
          data.upLevelSumcostSelect = data.upLevelSumcostSelect == true ? 1 : 0;
          data.upLevelCostimesSelect = data.upLevelCostimesSelect == true ? 1 : 0;
          data.upLevelSumstoredSelect = data.upLevelSumstoredSelect == true ? 1 : 0;
          data.upLevelSumintegralSelect = data.upLevelSumintegralSelect == true ? 1 : 0;
          log(data.lowLevelHighcostSelect, data.lowLevelDaystoredSelect, data.lowLevelSumcostSelect, data.lowLevelCosttimesSelect, data.lowLevelSumstoredSelect, data.lowLevelSumintegralSelect);
          data.lowLevelHighcostSelect = data.lowLevelHighcostSelect == true ? 1 : 0;
          data.lowLevelDaystoredSelect = data.lowLevelDaystoredSelect == true ? 1 : 0;
          data.lowLevelSumcostSelect = data.lowLevelSumcostSelect == true ? 1 : 0;
          data.lowLevelCosttimesSelect = data.lowLevelCosttimesSelect == true ? 1 : 0;
          data.lowLevelSumstoredSelect = data.lowLevelSumstoredSelect == true ? 1 : 0;
          data.lowLevelSumintegralSelect = data.lowLevelSumintegralSelect == true ? 1 : 0;

          // 值增加默认 0
          data.upLevelHighcost = data.upLevelHighcost || 0;
          data.upLevelDaystored = data.upLevelDaystored || 0;
          data.upLevelSumcostDays = data.upLevelSumcostDays || 0;
          data.upLevelSumcost = data.upLevelSumcost || 0;
          data.upLevelCosttimesDays = data.upLevelCosttimesDays || 0;
          data.upLevelCosttimes = data.upLevelCosttimes || 0;
          data.upLevelSumstoredDays = data.upLevelSumstoredDays || 0;
          data.upLevelSumstored = data.upLevelSumstored || 0;
          data.upLevelSumintegralDays = data.upLevelSumintegralDays || 0;
          data.upLevelSumintegral = data.upLevelSumintegral || 0;

          data.gradeEffectDay = data.gradeEffectDay || 0;
          data.lowLevelHighcostDays = data.lowLevelHighcostDays || 0;
          data.lowLevelHighcost = data.lowLevelHighcost || 0;
          data.lowLevelDaystoredDays = data.lowLevelDaystoredDays || 0;
          data.lowLevelDaystored = data.lowLevelDaystored || 0;
          data.lowLevelSumcostDays = data.lowLevelSumcostDays || 0;
          data.lowLevelSumcost = data.lowLevelSumcost || 0;
          data.lowLevelCosttimesDays = data.lowLevelCosttimesDays || 0;
          data.lowLevelCosttimes = data.lowLevelCosttimes || 0;
          data.lowLevelSumstoredDays = data.lowLevelSumstoredDays || 0;
          data.lowLevelSumstored = data.lowLevelSumstored || 0;
          data.lowLevelSumintegralDays = data.lowLevelSumintegralDays || 0;
          data.lowLevelSumintegral = data.lowLevelSumintegral || 0;

          that.saveInfo(data);
        } else {
          log('error submit!!');
          return false;
        }
      });
    },

    // 保存
    saveInfo(form) {
      let that = this;
      let para = form;

      postRequest('/api-admin/do-save-member-grade', para)
        .then(res => {
          log(res.data.result);
          let resData = res.data;
          if (resData.errorCode == 0) {
            showMsg.showmsg('保存成功', 'success');
            that.goBack();
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

    focus(name, num) {
      let that = this;
      log(name, num);
      that.inputFlag = name;
      that.inputFlagNum = num;
    },

    // 输入
    toInput: function(value) {
      let that = this;
      let temp = strLength.getByteVal(value.target.value, that.inputFlagNum);
      that.ruleForm[that.inputFlag] = temp.trim();
      that.inputNumObj[that.inputFlag] = strLength.getZhLen(that.ruleForm[that.inputFlag]);
    },

    // 获取等级信息
    getMemberGradeInfo() {
      let that = this;
      let para = {
        gradeId: that.ruleForm.gradeId
      };
      postRequest('/api-admin/get-member-grade-info', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 0) {
            let data = resData.result.dto;
            data.autoDowngrade = data.autoDowngrade == 1 ? true : false;
            data.autoUpgrade = data.autoUpgrade == 1 ? true : false;
            data.gradeType = String(data.gradeType);

            data.upLevelHighcostSelect = data.upLevelHighcostSelect == 1 ? true : false;
            data.upLevelDaystoredSelect = data.upLevelDaystoredSelect == 1 ? true : false;
            data.upLevelSumcostSelect = data.upLevelSumcostSelect == 1 ? true : false;
            data.upLevelCostimesSelect = data.upLevelCostimesSelect == 1 ? true : false;
            data.upLevelSumstoredSelect = data.upLevelSumstoredSelect == 1 ? true : false;
            data.upLevelSumintegralSelect = data.upLevelSumintegralSelect == 1 ? true : false;
            log(data.lowLevelHighcostSelect, data.lowLevelDaystoredSelect, data.lowLevelSumcostSelect, data.lowLevelCosttimesSelect, data.lowLevelSumstoredSelect, data.lowLevelSumintegralSelect);
            data.lowLevelHighcostSelect = data.lowLevelHighcostSelect == 1 ? true : false;
            data.lowLevelDaystoredSelect = data.lowLevelDaystoredSelect == 1 ? true : false;
            data.lowLevelSumcostSelect = data.lowLevelSumcostSelect == 1 ? true : false;
            data.lowLevelCosttimesSelect = data.lowLevelCosttimesSelect == 1 ? true : false;
            data.lowLevelSumstoredSelect = data.lowLevelSumstoredSelect == 1 ? true : false;
            data.lowLevelSumintegralSelect = data.lowLevelSumintegralSelect == 1 ? true : false;

            that.ruleForm = data;

            that.inputNumObj.gradeName = strLength.getZhLen(that.ruleForm.gradeName);
            that.inputNumObj.gradeCode = strLength.getZhLen(that.ruleForm.gradeCode);
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
    }
  },
  components: {
    topNavNew
  },
  mounted() {
    let that = this;
    log('mounted', that.$route.query.gradeId);
    that.ruleForm.gradeId = that.$route.query.gradeId;
    that.getMemberGradeInfo();
    that.cliqueId = that.$route.query.enterpriseId;
    that.cliqueName = that.$route.query.name;
    that.navpath[3].name = '编辑【' + that.cliqueName + '】会员等级';
    that.navpath[3].path = '/memberGrade?enterpriseId=' + that.cliqueId + '&name=' + that.cliqueName;
    that.navpath[4].name = '编辑【' + that.cliqueName + '】等级';
    that.enterpId = sessionStorage.getItem('enterpriseId');
  }
};
</script>
<style lang="less" scoped>
.attention-wrap {
  padding: 24px 32px;
  background: #fff;
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
  .el-input {
    width: 180px;
    &.w-300 {
      width: 300px;
    }
    &.w-340 {
      width: 340px;
    }
  }

  /deep/ .el-form-item__label {
    padding: 0 12px 0 0;
  }

  /deep/ .el-form {
    .el-form-item:last-child {
      /*margin-bottom: 0;*/

      .el-button {
        margin-top: 25px;
      }
    }
  }

  .limit-el-item {
    /deep/ .el-form-item__content {
      width: 340px;
    }
  }

  /deep/ .input-label {
    position: absolute;
    right: 10px;
    top: 2px;
    color: #909399;
    font-size: 13px;
  }

  .check-cell {
    .el-input {
      margin: 0 10px;
    }
    & + .check-cell {
      margin-top: 15px;
    }
  }
}
</style>
