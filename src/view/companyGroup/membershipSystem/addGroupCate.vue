<template>
  <div class="right-wrap">
    <topNav :navpath="navpath"></topNav>
    <div class="right-content" @click="selectGoodsCateHide">
      <div class="right-box">
        <div class="attention-wrap">
          <div class="form-wrap">
            <el-form :rules="rules" :model="ruleForm" ref="ruleForm" label-width="120px" class="demo-ruleForm">
              <el-form-item label="策略名称" prop="strategyName" class="padding-0">
                <el-input v-model="ruleForm.strategyName" class="w-340 padding-0" @keyup.native="value => toInput(value)"> </el-input>
                <label class="input-label">{{ cateNameLength }}/20</label>
              </el-form-item>
              <el-form-item label="适用条件" class="padding-0">
                <div class="title-tip">该设置只对微信商城中的积分抵现起作用。</div>
              </el-form-item>
              <div class="form-child margin-20 ">
                <el-form-item label="选择商户">
                  <el-select v-model="ruleForm.cliqueEnterpriseIds" placeholder="请选择" multiple>
                    <el-option v-for="item in mechantOption" :key="item.enterpriseId" :label="item.brandName" :value="item.enterpriseId"> </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="适用商品" class="padding-0">
                  <div>
                    <el-select class="fl" style="margin-right: 10px;" v-model="ruleForm.strategyRelationType" placeholder="请选择" @change="changeGood($event)">
                      <el-option v-for="item in applyGoods" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
                    <!-- 商品品牌 -->
                    <el-select class="fl" @change="selectGoodsStore" v-if="ruleForm.strategyRelationType == 2" v-model="value5" multiple placeholder="请选择">
                      <el-option v-for="item in goodsTreeOptions" :key="item.brandId" :label="item.brandName" :value="item.brandId"> </el-option>
                    </el-select>
                    <!-- 商品品类 -->
                    <div class="fl goods-cate" v-if="ruleForm.strategyRelationType == 3">
                      <goodsCate ref="selectGoodsCate" :selectCateType="selectCateTypeWx" :selectCateData="selectCateDataWx" @getCateIds="getCateIds"></goodsCate>
                    </div>
                    <el-button style="width:217px" class="fl" v-if="ruleForm.strategyRelationType == 4" @click.stop.prevent="showGoodsDialog('wx')">已选{{ goodsListWx.length }}件商品</el-button>
                  </div>
                </el-form-item>

                <el-form-item label="折扣控制" prop="region">
                  <div class="radio-cell">
                    <el-radio v-model="ruleForm.discountControl" label="1">所有折扣商品都适用</el-radio>
                  </div>
                  <div class="radio-cell margin-20">
                    <el-radio v-model="ruleForm.discountControl" label="2">折扣</el-radio>
                    <el-input-number v-model="ruleForm.discountControlLower" :precision="2" :controls="false" :max="10.0" :min="0.01"></el-input-number>
                    <label>至</label>
                    <el-input-number v-model="ruleForm.discountControlUpper" :precision="2" :controls="false" :max="10.0" :min="0.01"></el-input-number>
                    <label>折商品都适用</label>
                    <span style="font-size: 13px;color: #828282;line-height: 1;padding-left: 10px;">注意：折扣范围0.01-10.00，最低折扣不能大于最高折扣</span>
                  </div>
                </el-form-item>
              </div>
              <el-form-item label="折扣" prop="" class="margin-20">
                <el-input @focus="inputFocus('discountRate')" @change="formatInputChange($event)" v-model="ruleForm.discountRate"></el-input>
                折 <span style="font-size: 13px;color: #828282;line-height: 1;padding-left: 10px;">注意：折扣范围0.01-10.00</span>
              </el-form-item>
              <el-form-item label="计算方式" prop="">
                <el-radio v-model="ruleForm.calculationMethod" label="1">就低原则</el-radio>
                <el-radio v-model="ruleForm.calculationMethod" label="2">折上折</el-radio>
              </el-form-item>
              <el-form-item>
                <el-row>
                  <el-button type="primary" @click.stop.prevent="submitForm('ruleForm')">保 存</el-button>
                  <el-button @click.stop.prevent="goBack">返 回</el-button>
                </el-row>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <!-- <vue-gic-store-linkage></vue-gic-store-linkage> -->
    </div>
    <!-- 添加商品 -->
    <add-goods :goodsListId="goodsListId" :goodsType="goodsType" :goodShow.sync="goodShow" :projectName="repProjectName" @selectGoods="selectGoods"></add-goods>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>
<script>
import topNav from 'components/nav/navNew';
import addGoods from 'components/memberShip/add-goods';
import goodsCate from 'components/memberShip/goodsCate';
import strLength from '@/common/js/strlen';
import showMsg from '@/common/js/showmsg';
import errMsg from '@/common/js/error';
import { getRequest, postRequest } from '@/api/api';
import { log } from '@/utils/index.js';

export default {
  name: 'addGroupCate',
  data() {
    return {
      repProjectName: 'gic-web',
      navpath: [
        {
          name: '会员管理',
          path: ''
        },
        {
          name: '会员体系',
          path: ''
        },
        {
          name: '会员卡设置',
          path: '/memberCardSet'
        },
        {
          name: '添加会员等级',
          path: '/addGroupGrade'
        },
        {
          name: '添加折扣策略',
          path: ''
        }
      ],
      rules: {
        strategyName: [{ required: true, message: '请填写策略名称', trigger: 'blur' }]
      },
      // 添加商品弹窗
      goodShow: false,

      // 长度
      cateNameLength: 0,
      // 输入字限制
      inputFlagNum: 20,

      // 商户
      mechantOption: [],

      applyGoods: [
        {
          label: '所有商品',
          value: '1'
        },
        {
          label: '按商品品牌',
          value: '2'
        },
        {
          label: '按商品品类',
          value: '3'
        },
        {
          label: '按单件商品',
          value: '4'
        }
      ],
      ruleForm: {
        // 积分获取规则
        gradeStrategyId: '', //策略id
        gradeId: '-1', //等级id
        strategyName: '', //策略名称
        strategyRelationType: '1', // /** 策略关联类型 1所有商品 2商品品牌 3商品类目 4部分商品 */
        discountRate: '0.01', // 折扣率
        calculationMethod: '1', // 计算方式 1就低原则 2折上折
        discountControl: '1', // 折扣控制 1所有折扣商品适用 2折扣范围
        discountControlUpper: '0', // 折扣控制 折扣范围 下限
        discountControlLower: '0', //折扣控制 折扣范围 上限
        gradeStrategyGoodsRelationIds: [], // 策略关联商品信息id
        cliqueEnterpriseIds: [], // 策略关联商户信息
        relationCount: '0',
        enterpriseMS: null
      },

      // 商品品类
      selectCateDataWx: [], // 用于回显
      selectCateDataLine: [],
      selectCateTypeWx: 'wx',
      selectCateTypeLine: 'line',
      cateDataWx: [],
      cateDataLine: [],

      // 单个商品类型
      goodsType: 'wx', // 单个商品类型  wx：微信商城，line：线下渠道
      goodsListId: [],
      goodsListWx: [],
      goodsListLine: [],

      // 商品品牌
      goodsTreeOptions: [],
      value5: [],

      changeGoodData: ''
    };
  },
  created() {
    // this.selectReplayStyle()
  },
  mounted() {
    let that = this;
    if (that.$route.query.gradeId) {
      that.ruleForm.gradeId = that.$route.query.gradeId;
      that.navpath[3].path = '/editGroupGrade?gradeId=' + that.ruleForm.gradeId;
      that.navpath[3].name = '编辑会员等级';
    }
    that.getGoodsBrand(); // 商品品牌
    // 获取商户
    that.getCliqueInfo();
  },
  methods: {
    // 返回
    goBack() {
      let that = this;
      if (that.$route.query.gradeId) {
        this.$router.push({
          path: '/editGroupGrade',
          query: {
            gradeId: that.$route.query.gradeId
          }
        });
      } else {
        this.$router.push('/addGroupGrade');
      }
    },
    // 获取商户列表
    getCliqueInfo() {
      let that = this;
      let para = {};
      postRequest('/api-admin/list-enterprise', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 0) {
            let data = resData.result.listEnterprise;
            data.forEach(function(ele, index) {
              ele.label = ele.brandName;
              ele.value = ele.enterpriseId;
            });
            that.mechantOption = data;
            // 默认选择商户
            that.ruleForm.channelList[0].enterpriseRelationIdArr = [data[0].enterpriseId];
            return;
          }
          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          // log(error);
        });
    },
    // 保存
    submitForm(formName) {
      let that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = JSON.parse(JSON.stringify(that.ruleForm));
          if (!data.strategyName) {
            showMsg.showmsg('请填写策略名称', 'error');
            return;
          }
          if (data.strategyRelationType == 2 && that.value5.length < 1) {
            showMsg.showmsg('请选择商品品牌', 'error');
            return;
          }
          if (data.strategyRelationType == 3 && that.cateDataWx.length < 1) {
            showMsg.showmsg('请选择商品品类', 'error');
            return;
          }
          if (data.strategyRelationType == 4 && that.goodsListWx.length < 1) {
            showMsg.showmsg('请选择单件商品', 'error');
            return;
          }
          if (!data.cliqueEnterpriseIds.length) {
            showMsg.showmsg('请选择商户', 'error');
            return;
          }
          // 扣控制中的折扣率判断
          if (data.discountControl == 2) {
            let flagA = Number(data.discountControlUpper) <= Number(data.discountControlLower);
            if (!data.discountControlUpper || !data.discountControlLower) {
              that.$message.error('折扣控制中的折扣不能为空');
              return;
            }
            if (flagA) {
              that.$message.error('折扣控制中的折扣格式有误');
              return;
            }
          }
          if (data.discountRate == '') {
            showMsg.showmsg('请填写折扣', 'error');
            return;
          } else if (data.discountRate < 0.01) {
            showMsg.showmsg('折扣不能为0哦', 'error');
            return;
          }
          data.discountControlUpper = data.discountControlUpper || '0';
          data.discountControlLower = data.discountControlLower || '0';
          data.cliqueEnterpriseIds = data.cliqueEnterpriseIds.join(',');
          data.gradeStrategyGoodsRelationIds = data.gradeStrategyGoodsRelationIds.join(',');
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
      postRequest('/api-admin/save-member-grade-strategy', para)
        .then(res => {
          // log(res.data.result)
          let resData = res.data;
          if (resData.errorCode == 0) {
            // 向本地暂存添加一条
            let data = [];
            let strategyOld = sessionStorage.getItem('strategy');
            if (!!strategyOld && strategyOld != 'undefined' && strategyOld != '') {
              let strategy = JSON.parse(sessionStorage.getItem('strategy'));
              data = strategy;
            }
            data.push(resData.result);
            sessionStorage.setItem('strategy', JSON.stringify(data));
            showMsg.showmsg('保存成功', 'success');
            that.goBack();
            return;
          }
          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          log(error);
        });
    },

    // 输入
    toInput: function(value) {
      let that = this;
      let temp = strLength.getByteVal(value.target.value, that.inputFlagNum);
      that.ruleForm.strategyName = temp.trim();
      that.cateNameLength = strLength.getZhLen(that.ruleForm.strategyName);
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
    // 折扣重新写的判断
    formatInputChange(e) {
      let that = this;
      that.ruleForm.discountControlLower = Number(String(that.ruleForm.discountControlLower).replace(/[^\.\d]/g, '')).toFixed(2) == 'NaN' ? '0.00' : Number(String(that.ruleForm.discountControlLower).replace(/[^\.\d]/g, '')).toFixed(2);
      that.ruleForm.discountControlUpper = Number(String(that.ruleForm.discountControlUpper).replace(/[^\.\d]/g, '')).toFixed(2) == 'NaN' ? '0.00' : Number(String(that.ruleForm.discountControlUpper).replace(/[^\.\d]/g, '')).toFixed(2);
      // 比较大小
      if (Number(that.ruleForm.discountControlLower) > 10) {
        that.ruleForm.discountControlLower = Number(10).toFixed(2);
      }
      if (Number(that.ruleForm.discountControlUpper) > 10) {
        that.ruleForm.discountControlUpper = Number(10).toFixed(2);
      }
      if (that.tempTag == 'discountRate') {
        that.ruleForm[that.tempTag] = Number(String(e).replace(/[^\.\d]/g, '')).toFixed(2);
        if (Number(that.ruleForm[that.tempTag]) > 10) {
          that.ruleForm[that.tempTag] = Number(10).toFixed(2);
        }
        return;
      }
      that.$forceUpdate();
    },
    changeRoute(route) {
      this.$router.push(route);
    },
    // 获取商品品牌  1
    getGoodsBrand() {
      let that = this;
      let para = {};
      getRequest('/api-mall/list-enterprise-brand', para)
        .then(res => {
          // log(res.data.result)
          let resData = res.data;
          if (resData.errorCode == 0) {
            let data = resData.result;
            that.goodsTreeOptions = data;
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
    // 选择商品品牌
    selectGoodsStore(val) {
      this.value5 = val;
      this.ruleForm.gradeStrategyGoodsRelationIds = this.value5;
    },
    // 单件商品 的 子组件显示方法   3
    showGoodsDialog(type) {
      let that = this;
      that.goodsType = type;
      that.goodShow = true;
      that.goodsListId = [];
      if (type == 'wx') {
        // that.goodsListId = ['1']
        that.goodsListId = that.goodsListWx;
      } else if (type == 'line') {
        // that.goodsListId = ['12121']
        that.goodsListId = that.goodsListLine;
      }
    },
    // 单件商品 的 子组件触发方法
    selectGoods(val) {
      let that = this;
      log(val);
      that.goodShow = false;
      that.goodsListId = [];
      if (val) {
        if (val.goodsType == 'wx') {
          that.ruleForm.gradeStrategyGoodsRelationIds = val.strategyGoodsRelationIds;
          that.goodsListWx = val.strategyGoodsRelationIds;
        }
      }
    },

    // 商品品类
    getCateIds(val) {
      if (val.selectCateType == 'wx') {
        this.ruleForm.gradeStrategyGoodsRelationIds = [];
        this.cateDataWx = [];
        val.cateIdsList.forEach(ele => {
          this.ruleForm.gradeStrategyGoodsRelationIds.push(ele);
          this.cateDataWx.push(ele);
        });
      }
    },
    selectGoodsCateHide() {
      // 调用子组件 商品品类组件的函数
      if (this.ruleForm.strategyRelationType == 3) {
        this.$refs.selectGoodsCate.hideDragClick();
      }
    }
  },

  components: {
    topNav,
    addGoods,
    goodsCate
  }
};
</script>
<style lang="less" scoped>
.right-box {
  padding: 24px;
}
.attention-wrap {
  .item-label {
    font-size: 14px;
    color: #606266;
    margin-bottom: 30px;
    span {
      display: inline-block;
      width: 80px;
    }
  }
  .title-tip {
    font-size: 12px;
    color: #888;
  }
}
.form-wrap {
  /deep/ .el-radio {
    margin-right: 0;
  }
  .el-input {
    width: 178px;
    padding: 0 10px;
    &.w-300 {
      width: 300px;
    }
    &.w-340 {
      width: 340px;
    }
  }
  /deep/ .input-label {
    position: absolute;
    left: 303px;
    color: #c0c4cc;
    font-size: 12px;
  }
  .span-txt {
    position: absolute;
    left: 222px;
    z-index: 2;
    width: 300px;
    text-align: center;
  }
  .padding-0 {
    padding: 0;
  }
  .form-child {
    width: 100%;
    padding: 15px 20px 10px 0px;
    background: #f5f6f9;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .margin-l-120 {
    margin-left: 120px;
  }
  .margin-20 {
    margin-top: 20px;
  }
  .tinymce-wrap {
    width: 780px;
  }
}
/* 商品品类 */
.goods-cate {
  display: inline-block;
}
.goods-cate .goods-cate-content {
  width: 217px;
}
/*折扣率*/
.form-wrap /deep/ .el-input-number .el-input {
  padding: 0 10px;
  box-sizing: border-box;
  .el-input__inner {
    text-align: left;
  }
}
</style>
