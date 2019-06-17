<template>
  <div class="right-wrap">
    <topNavNew :navpath="navpath"></topNavNew>
    <div class="right-content">
      <div class="right-box">
        <div class="attention-wrap">
          <!-- 开卡策略 -->
          <div class="member-cell">
            <div class="title-group">
              <h3 class="open-card-title">开卡策略</h3>
              <p class="open-card-descript">设置办理电子会员卡的基本规则</p>
            </div>
            <div class="cell-body">
              <card-cate :cardCateInfo="cardCateInfo" :projectName="projectName"></card-cate>
            </div>
          </div>
          <!-- 开卡基本信息配置 -->
          <div class="member-cell">
            <div class="title-group">
              <h3 class="open-card-title">开卡基本信息配置</h3>
              <p class="open-card-descript">设置办理电子会员卡的基本信息字段</p>
            </div>
            <div class="cell-body">
              <el-form>
                <el-form-item label="微信会员" prop="">
                  <el-button type="primary" @click="changeRoute('/memberInfoTemplate')">编辑模板</el-button>
                </el-form-item>
              </el-form>
              <div class="phone-container">
                <div class="phone-view">
                  <div class="phone-show-content">
                    <ul class="phone-list-bottom" id="showPhoneView">
                      <template v-for="(item, index) in memberTemp">
                        <li class="phone-list-item" v-show="item.systemFieldId == 'k103' && item.fieldContent.birthType" :key="index">
                          <div class="opend-card-item sex" style="height:71px">
                            <div class="item-title" style="line-height:70px">{{ item.fieldName }}</div>
                            <div style="float:left;">
                              <el-radio-group v-model="item.radio">
                                <el-radio :label="0">农历</el-radio>
                                <el-radio :label="1">阳历</el-radio>
                              </el-radio-group>
                              <p style="line-height: 30px;margin-top: -5px;">{{ item.fieldDescription }}</p>
                            </div>
                          </div>
                        </li>
                        <li class="phone-list-item" v-if="!(item.systemFieldId == -1 && item.fieldType == 5) && !(item.systemFieldId == 'k103' && item.fieldContent.birthType)" :key="index">
                          <template v-if="item.fieldType != 2">
                            <div class="opend-card-item" v-if="!(item.systemFieldId == -1 && item.fieldType == 5)">
                              <div :class="['item-title', item.fieldName.length > 6 ? 'item-title-prewrap' : '']">{{ item.fieldName }}</div>
                              <span>{{ item.fieldDescription }}</span>
                            </div>
                          </template>
                          <template v-if="item.fieldType == 2">
                            <div class="opend-card-item sex">
                              <div class="item-title">{{ item.fieldName }}</div>
                              <template v-for="(child, ind) in item.fieldContent">
                                <el-radio v-model="firstRadio" :label="ind" :key="ind">{{ child.name }}</el-radio>
                              </template>
                            </div>
                          </template>
                        </li>
                        <li v-if="item.systemFieldId == -1 && item.fieldType == 5" class="block" :key="index">
                          <template>
                            <div class="block-head">
                              <div class="opencard-item-title">{{ item.fieldName }}</div>
                            </div>
                            <div class="opend-card-item" v-for="(child, idx) in item.sonList" :key="idx">
                              <div :class="['item-title', child.fieldName.length > 6 ? 'item-title-prewrap' : '']">{{ child.fieldName }}</div>
                              <span>{{ child.fieldDescription }}</span>
                            </div>
                          </template>
                        </li>
                      </template>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 开卡门店配置 -->
          <div class="member-cell">
            <div class="title-group">
              <h3 class="open-card-title">开卡门店配置</h3>
              <p class="open-card-descript">设置会员的开卡门店规则</p>
            </div>
            <div class="cell-body">
              <el-form :model="openCardForm" ref="openCardForm" label-width="130px" class="demo-ruleForm">
                <el-form-item label="微信会员" prop="">
                  <el-radio v-model="openCardForm.wxOpenCardStoreSet" label="0" @change="changeRadio($event, 6)">首次关注门店</el-radio>
                  <el-radio v-model="openCardForm.wxOpenCardStoreSet" label="1" @change="changeRadio($event, 6)">开卡前最后关联门店</el-radio>
                </el-form-item>
                <el-form-item label="POS转微信会员" prop="">
                  <el-radio v-model="openCardForm.posOpenCardStoreSet" label="0" @change="changeRadio($event, 7)">ERP中的开卡门店</el-radio>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <!-- 第三方电商账号选择开关 -->
          <!-- <div class="member-cell">
            <div class="title-group">
              <h3 class="open-card-title">第三方电商账号选择开关</h3>
              <p class="open-card-descript">设置会员开卡流程中选择第三方平台账号</p>
            </div>
            <div class="cell-body">
              <el-form :model="thirdForm" ref="thirdForm" label-width="130px" class="demo-ruleForm">
                <el-form-item label="开卡选择第三方电商账号" prop="">
                  <el-switch v-model="thirdForm.switch" @change="changeSwitch($event, 1)"> </el-switch>
                </el-form-item>
              </el-form>
            </div>
          </div> -->
          <!-- 主门店配置 -->
          <div class="member-cell">
            <div class="title-group">
              <h3 class="open-card-title">服务门店配置</h3>
              <p class="open-card-descript">设置会员的服务门店规则</p>
            </div>
            <div class="cell-body">
              <el-form :model="mainStoreForm" ref="mainStoreForm" label-width="130px" class="demo-ruleForm">
                <el-form-item label="微信会员" prop="">
                  <el-radio v-model="mainStoreForm.wxMainStoreSet" label="0" @change="changeRadio($event, 8)">首次关注门店</el-radio>
                  <el-radio v-model="mainStoreForm.wxMainStoreSet" label="1" @change="changeRadio($event, 8)">开卡前最后关联门店</el-radio>
                </el-form-item>
                <el-form-item label="POS转微信会员" prop="">
                  <el-radio v-model="mainStoreForm.posMainStoreSet" label="0" @change="changeRadio($event, 9)">ERP中的开卡门店</el-radio>
                </el-form-item>
                <el-form-item label="开卡选择服务门店" prop="">
                  <el-switch v-model="mainStoreForm.openCardStoreEdit" @change="changeSwitch($event, 2)"> </el-switch>
                </el-form-item>
                <el-form-item label="开卡选择专属导购" prop="">
                  <el-switch v-model="mainStoreForm.openCardClerkEdit" @change="changeSwitch($event, 3)"> </el-switch>
                </el-form-item>
                <el-form-item label="服务门店变更逻辑" prop="">
                  <el-table :data="tableData" style="width: 100%">
                    <el-table-column prop="name" label="对象" width="150"> </el-table-column>
                    <el-table-column prop="rules" label="变更服务门店规则"> </el-table-column>
                    <el-table-column prop="address" label="优先级" width="150">
                      <template>
                        <i class="el-icon-back" style="transform:rotate(-90deg)"></i>
                      </template>
                    </el-table-column>
                    <el-table-column prop="typeValue" label="是否开启" width="150">
                      <template slot-scope="scope">
                        <el-switch v-model="scope.row.typeValue" @change="changeServiceSwitch(scope.row.typeValue)"></el-switch>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <!-- 归属修改权限 -->
          <div class="member-cell">
            <div class="title-group">
              <h3 class="open-card-title">归属修改权限</h3>
              <p class="open-card-descript">设置会员是否有权限对服务门店和专属导购进行修改</p>
            </div>
            <div class="cell-body">
              <el-form :model="belongAuthForm" ref="belongAuthForm" label-width="130px" class="demo-ruleForm">
                <el-form-item label="修改服务门店" prop="">
                  <el-switch v-model="belongAuthForm.storeEdit" @change="changeSwitch($event, 4)"> </el-switch>
                </el-form-item>
                <el-form-item label="修改次数限制" prop="" v-if="belongAuthForm.storeEdit == true">
                  <el-radio v-model="belongAuthForm.storeEditTimesType" label="1" @change="changeRadio($event, 11, 'store')">最多修改</el-radio>
                  <el-input v-model="belongAuthForm.storeEditTimes" @change="changeInput($event, 13, 'storeEditTimes')"></el-input><label>次</label>
                  <el-radio class="m-l-16" v-model="belongAuthForm.storeEditTimesType" label="2" @change="changeRadio($event, 11, 'store')">每月最多修改1次</el-radio>
                  <el-radio v-model="belongAuthForm.storeEditTimesType" label="3" @change="changeRadio($event, 11, 'store')">每年最多修改1次</el-radio>
                </el-form-item>

                <el-form-item label="修改专属导购" prop="">
                  <el-switch v-model="belongAuthForm.clerkEdit" @change="changeSwitch($event, 5)"><!-- active-text="启用" inactive-text="停用" --> </el-switch>
                </el-form-item>

                <el-form-item label="修改次数限制" prop="" v-if="belongAuthForm.clerkEdit == true">
                  <el-radio v-model="belongAuthForm.clerkEditTimesType" :disabled="belongAuthForm.storeEditTimesType == 2 || belongAuthForm.storeEditTimesType == 3 ? true : false" label="1" @change="changeRadio($event, 12)">最多修改</el-radio>
                  <el-input v-model="belongAuthForm.clerkEditTimes" @change="changeInput($event, 14, 'clerkEditTimes')"></el-input><label>次</label>
                  <el-radio class="m-l-16" v-model="belongAuthForm.clerkEditTimesType" label="2" @change="changeRadio($event, 12)">每月最多修改1次 </el-radio>
                  <el-radio v-model="belongAuthForm.clerkEditTimesType" :disabled="belongAuthForm.storeEditTimesType == 2 ? true : false" label="3" @change="changeRadio($event, 12)">每年最多修改1次</el-radio>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <!-- 商户会员等级 -->
          <div class="member-cell">
            <div class="title-group">
              <h3 class="open-card-title">商户会员等级</h3>
              <p class="open-card-descript">商户具体会员等级，请点击对应商户行的编辑按钮查看</p>
            </div>
            <div class="cell-body">
              <el-table :data="merchantTableData" style="width: 100%">
                <el-table-column prop="enterpriseName" label="商户名称"> </el-table-column>
                <el-table-column prop="gradeCount" label="等级数量"> </el-table-column>
                <el-table-column prop="" label="操作">
                  <template slot-scope="scope">
                    <!-- <el-button
                      @click="editMerchant(scope.$index,scope.row,merchantTableData)"
                      type="text"
                      size="small">
                      编辑
                    </el-button> -->
                    <router-link :to="{ path: '/memberGrade', query: { enterpriseId: scope.row.enterpriseId, name: scope.row.enterpriseName } }" class="edit-btn el-button--text">编辑</router-link>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <!-- 集团会员等级设置 -->
          <div class="member-cell">
            <div class="title-group">
              <h3 class="open-card-title">集团会员等级设置</h3>
              <p class="open-card-descript">设置集团卡会员等级制度</p>
            </div>
            <div class="cell-body">
              <el-form :model="cliqueForm" ref="cliqueForm" label-width="130px" class="demo-ruleForm">
                <el-form-item label="升级模式" prop="">
                  <el-radio disabled v-model="cliqueForm.gradeUpModel" label="0" @change="changeCliqueUp($event)">单商户独立计算</el-radio>
                  <el-radio disabled v-model="cliqueForm.gradeUpModel" label="1" @change="changeCliqueUp($event)">跨商户联合计算</el-radio>
                </el-form-item>
                <el-form-item label="关联升级" prop="" v-if="cliqueForm.gradeUpModel == 0">
                  <el-switch disabled v-model="cliqueForm.gradeUpModelSyncchange" @change="changeSwitch($event, 10)"> </el-switch>
                </el-form-item>
              </el-form>
              <div class="add-level"><el-button type="primary" @click="changeRoute('/addGroupGrade')">新增等级</el-button></div>
              <el-table :data="cliqueTableData" style="width: 100%">
                <el-table-column prop="" label="卡面预览" width="260">
                  <template slot-scope="scope">
                    <div class="card-cell" :style="{ background: scope.row.cardColor }">
                      <img :src="logoImg" />
                      <span :style="{ color: scope.row.cardFontColor }">{{ scope.row.gradeName }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="gradeCode" label="等级编码"> </el-table-column>
                <el-table-column prop="" label="等级类型">
                  <template slot-scope="scope">
                    {{ scope.row.gradeType == 1 ? '常规卡' : '特殊卡' }}
                  </template>
                </el-table-column>
                <el-table-column prop="" label="移动">
                  <template slot-scope="scope">
                    <!-- <div class="move-icon">
                      <i :class="['iconfont','sort-icon-all', 'icon-yd-icon-upload2', scope.$index==0? 'disable': '']" @click="toPre(scope.$index,scope.row,cliqueTableData)"></i>
                      <i :class="['sort-icon-all', 'sort-icon-down','iconfont','icon-yd-icon-upload2', scope.$index == cliqueTableData.length-1?'disable':'']" class="icon-font-down" @click="toNext(scope.$index,scope.row,cliqueTableData)"></i>
                      <i :class="['sort-icon-all', 'el-icon-upload2', 'sort-icon', scope.$index==0? 'disable':'']" @click="toUp(scope.$index,scope.row,cliqueTableData)"></i>
                      <i :class="['sort-icon-all', 'el-icon-download','sort-icon', scope.$index == cliqueTableData.length-1?'disable':'']" @click="toBottom(scope.$index,scope.row,cliqueTableData)"></i>
                    </div> -->
                    <i :class="['icon-color', 'el-icon-upload2', scope.$index == 0 ? 'disable' : '']" @click="toUp(scope.$index, scope.row, cliqueTableData)"></i>
                    <i :class="['icon-color', 'el-icon-back', 'icon-to-pre', scope.$index == 0 ? 'disable' : '']" @click="toPre(scope.$index, scope.row, cliqueTableData)"></i>
                    <i :class="['icon-color', 'el-icon-back', 'icon-to-next', scope.$index == cliqueTableData.length - 1 ? 'disable' : '']" @click="toNext(scope.$index, scope.row, cliqueTableData)"></i>
                    <i :class="['icon-color', 'el-icon-download', scope.$index == cliqueTableData.length - 1 ? 'disable' : '']" @click="toBottom(scope.$index, scope.row, cliqueTableData)"></i>
                  </template>
                </el-table-column>
                <el-table-column prop="" label="操作">
                  <template slot-scope="scope">
                    <!--  <el-button
                      @click="editCliqueLevel(scope.$index,scope.row,cliqueTableData)"
                      type="text"
                      size="small">
                      编辑
                    </el-button> -->
                    <router-link :to="{ path: '/editGroupGrade', query: { gradeId: scope.row.gradeId } }" class="edit-btn el-button--text">编辑</router-link>
                    <!-- <el-button class="m-l-10"
                      @click="delCliqueLevel(scope.$index,scope.row,cliqueTableData)"
                      type="text">
                      删除
                    </el-button> -->
                    <el-popover placement="top" width="160" v-model="scope.row.popVisible">
                      <p style="line-height: 1.5; padding: 10px 10px 20px;">确认删除吗？</p>
                      <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="cancelPop(scope.$index, scope.row, cliqueTableData)">取消</el-button>
                        <el-button type="primary" size="mini" @click="delCliqueLevel(scope.$index, scope.row, cliqueTableData)">确定</el-button>
                      </div>
                      <el-button slot="reference" class="m-l-10" type="text">
                        删除
                      </el-button>
                    </el-popover>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <!-- end -->
        </div>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>
<script>
import showMsg from '@/common/js/showmsg';
import errMsg from '@/common/js/error';
import topNavNew from 'components/nav/navNew';
import cardCate from 'components/memberShip/card-cate'; // 开卡策略
import { getRequest, postRequest } from '@/api/api';
import { log } from '@/utils/index.js';
export default {
  name: 'memberCardSet',
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
          path: ''
        }
      ],
      projectName: 'gic-clique', //当前项目名

      firstRadio: 0,

      // 信息对象
      cardCateInfo: {},

      // 会员模板
      memberTemp: [],

      // 开卡门店配置
      openCardForm: {
        wxOpenCardStoreSet: '0',
        posOpenCardStoreSet: '0'
      },
      // 第三方
      thirdForm: {
        switch: true
      },
      // 主门店
      mainStoreForm: {
        wxMainStoreSet: '0',
        posMainStoreSet: '0',
        openCardStoreEdit: true,
        openCardClerkEdit: true
      },

      // 归属修改权限
      belongAuthForm: {
        storeEdit: true,
        storeEditTimesType: '1',
        storeEditTimes: '',
        clerkEdit: true,
        clerkEditTimesType: '1',
        clerkEditTimes: ''
      },

      // 商户会员等级
      merchantTableData: [],

      // 集团会员等级
      cliqueForm: {
        gradeUpModelSyncchange: false, // 单商户独立计算下是否关联升级 1是 0否 (集团)
        gradeUpModel: '0' // 等级升级模式 0单商户独立计算 1跨商户联合计算 (集团参数)
      },
      cliqueTableData: [],
      logoImg: '', //企业logo

      popVisible: false, //表格中删除
      // 服务门店变更
      tableData: [
        {
          name: '所有认证会员',
          rules: '会员历史消费次数为0时，取在GIC系统上线后的首次消费门店为服务门店',
          typeValue: false
        }
      ]
    };
  },
  created() {
    // this.selectReplayStyle()
  },
  methods: {
    // 服务门店变更逻辑
    changeServiceSwitch(val) {
      let typeValue = val ? 1 : 0;
      let para = {
        type: 16,
        typeValue: typeValue
      };
      postRequest('/api-admin/modify-member-card-setting-flag', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 0) {
            showMsg.showmsg('设置成功', 'success');
            return;
          }
          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          log(error);
        });
    },
    // 路由跳转
    changeRoute(route) {
      this.$router.push(route);
    },

    // 开卡门店配置 等 radio change
    changeRadio(e, tag, flag) {
      let that = this;
      that.saveSet(tag, e);
      // 判断归属门店修改次数
      if (!!flag && flag == 'store') {
        if (e == 2) {
          that.belongAuthForm.clerkEditTimesType = '2';
          that.saveSet('12', 2);
        }
        if (e == 3) {
          that.belongAuthForm.clerkEditTimesType = '3';
          that.saveSet('12', 3);
        }
      }
    },

    saveSet(type, value) {
      let that = this;
      let para = {
        type: type,
        typeValue: value
      };
      postRequest('/api-admin/modify-member-card-setting-flag', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 0) {
            showMsg.showmsg('设置成功', 'success');
            if (type == 2 && value == '0') {
              that.mainStoreForm.openCardClerkEdit = false;
            }
            return;
          }

          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          log(error);
        });
    },

    // 第三方等 switch change
    changeSwitch(e, num) {
      let that = this;

      // 开卡
      if (num == 2 && !e) {
        that.saveSet(2, 0);
        that.saveSet(3, 0);
        return;
      }
      if (num == 3 && e && !that.mainStoreForm.openCardStoreEdit) {
        showMsg.showmsg('开卡选择服务门店停用时不允许修改', 'warning');
        that.mainStoreForm.openCardClerkEdit = false;
        return;
      }

      // 修改服务门店
      if (num == 4 && e && !that.belongAuthForm.clerkEdit) {
        showMsg.showmsg('修改专属导购停用时不允许修改', 'warning');
        that.belongAuthForm.storeEdit = false;
        return;
      }
      if (num == 4 && !e) {
        that.belongAuthForm.storeEditTimesType = '1';
        that.changeRadio(1, 11);
      }

      // 修改专属导购
      if (num == 5 && !e) {
        that.saveSet(num, 0);
        that.belongAuthForm.storeEdit = false;
        that.saveSet(4, 0);
        return;
      }
      let v = e == true ? 1 : 0;
      that.saveSet(num, v);
    },

    // input
    changeInput(e, num, tag) {
      let that = this;
      e = !!parseInt(String(e).replace(/[^\d]/g, '')) ? parseInt(String(e).replace(/[^\d]/g, '')) : '0';
      that.belongAuthForm.storeEditTimes = !!parseInt(String(that.belongAuthForm.storeEditTimes).replace(/[^\d]/g, '')) ? parseInt(String(that.belongAuthForm.storeEditTimes).replace(/[^\d]/g, '')) : 0;
      that.belongAuthForm.clerkEditTimes = !!parseInt(String(that.belongAuthForm.clerkEditTimes).replace(/[^\d]/g, '')) ? parseInt(String(that.belongAuthForm.clerkEditTimes).replace(/[^\d]/g, '')) : 0;
      if (that.belongAuthForm.storeEditTimes > that.belongAuthForm.clerkEditTimes) {
        that.$message.error({
          duration: 1000,
          message: '修改服务门店次数必须小于修改专属导购次数'
        });
        return;
      }
      that.saveSet(num, e);
    },

    // 商户会员等级列表编辑
    editMerchant(index, row, obj) {
      let that = this;
      that.changeRoute('/memberGrade');
    },

    // 编辑集团
    editCliqueLevel(index, row, obj) {
      let that = this;
      that.changeRoute('/editGroupGrade');
    },

    // 取消删除
    cancelPop(index, row, obj) {
      row.popVisible = false;
    },

    // 删除
    delCliqueLevel(index, row, obj) {
      let para = {
        gradeId: row.gradeId,
        enterpriseId: ''
      };
      postRequest('/api-admin/delete-member-grade', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 0) {
            showMsg.showmsg('删除成功', 'success');
            obj.splice(index, 1);
            return;
          }
          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          log(error);
        });
    },

    // 修改集团升级模式
    changeCliqueUp(e) {
      let para = {
        gradeUpModel: e
      };
      postRequest('/api-admin/modify-clique-grade-up-model', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 0) {
            showMsg.showmsg('设置成功', 'success');
            return;
          }
          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          log(error);
        });
    },

    // 置顶 先删除后追加首部
    toUp(index, row, obj) {
      let that = this;
      if (index == 0) {
        return;
      }
      let newTable = JSON.parse(JSON.stringify(that.cliqueTableData));
      newTable.splice(index, 1);
      newTable.unshift(row);
      // 保存设置
      that.setSort(row.gradeId, 10);
      that.cliqueTableData = newTable;
    },
    // 向上
    toPre(index, row, obj) {
      let that = this;
      if (index == 0) {
        return;
      }
      let newTable = JSON.parse(JSON.stringify(that.cliqueTableData));
      let temp = {};
      temp = newTable[index - 1];
      newTable[index - 1] = row;
      newTable[index] = temp;
      // 保存设置
      that.setSort(row.gradeId, 20);
      that.cliqueTableData = newTable;
    },
    // 向下
    toNext(index, row, obj) {
      let that = this;
      if (index == obj.length - 1) {
        return;
      }
      let newTable = JSON.parse(JSON.stringify(that.cliqueTableData));
      let temp = {};
      temp = newTable[index + 1];
      newTable[index + 1] = row;
      newTable[index] = temp;
      // 保存设置
      that.setSort(row.gradeId, 30);
      that.cliqueTableData = newTable;
    },
    //置底 先删除后追加尾部
    toBottom(index, row, obj) {
      let that = this;
      if (index == obj.length - 1) {
        return;
      }
      let newTable = JSON.parse(JSON.stringify(that.cliqueTableData));
      newTable.splice(index, 1);
      newTable.push(row);
      // 保存设置
      that.setSort(row.gradeId, 40);
      that.cliqueTableData = newTable;
    },

    // 等级排序
    setSort(gradeId, type, enterpriseId) {
      let para = {
        gradeId: gradeId,
        sortType: type
        // enterpriseId: enterpriseId
      };

      postRequest('/api-admin/sort-member-grade', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 0) {
            showMsg.showmsg('设置成功', 'success');
            return;
          }
          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          log(error);
        });
    },

    // 获取会员卡设置信息
    getMemberSetInfo() {
      let that = this;
      getRequest('/api-admin/get-enterprise-grade-info', {})
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 0) {
            // 设置开卡策略信息
            let member = resData.result.memberSystem;
            if (!!member && !!Object.keys(member).length) {
              that.setCateInfo(member);
              that.cardCateInfo = that.setCateInfo(member);
              // 开卡门店配置
              that.openCardForm.wxOpenCardStoreSet = String(member.wxOpenCardStoreSet);
              that.openCardForm.posOpenCardStoreSet = String(member.posOpenCardStoreSet);
              // 第三方
              that.thirdForm.switch = member.ecommerceRelationFlag == 1 ? true : false;
              // 主门店
              that.mainStoreForm.wxMainStoreSet = String(member.wxMainStoreSet);
              that.mainStoreForm.posMainStoreSet = String(member.posMainStoreSet);
              that.mainStoreForm.openCardStoreEdit = member.openCardStoreEdit == 1 ? true : false;
              that.mainStoreForm.openCardClerkEdit = member.openCardClerkEdit == 1 ? true : false;
              // 服务门店变更逻辑
              that.tableData[0].typeValue = member.storeChangeLogic == 1 ? true : false;
              //归属修改权限
              that.belongAuthForm.storeEdit = member.storeEdit == 1 ? true : false;
              that.belongAuthForm.clerkEdit = member.clerkEdit == 1 ? true : false;
              that.belongAuthForm.storeEditTimesType = String(member.storeEditTimesType); //1自定义次数 2 每月修改1次 3每年修改1次
              that.belongAuthForm.storeEditTimes = member.storeEditTimes; //自定义次数
              that.belongAuthForm.clerkEditTimesType = String(member.clerkEditTimesType); //1自定义次数 2 每月修改1次 3每年修改1次
              that.belongAuthForm.clerkEditTimes = member.clerkEditTimes; //自定义次数

              // 集团会员卡设置
              that.cliqueForm.gradeUpModel = String(member.gradeUpModel);
              that.cliqueForm.gradeUpModelSyncchange = member.gradeUpModelSyncchange == 1 ? true : false;
            }

            // 商户会员等级
            if (!!resData.result.CountList && !!resData.result.CountList.length) {
              that.merchantTableData = resData.result.CountList;
            }

            // 卡面
            that.logoImg = resData.result.logoImg;
            if (!!resData.result.List && !!resData.result.List.length) {
              resData.result.List.forEach(function(ele, index) {
                ele.popVisible = false;
              });
              that.cliqueTableData = resData.result.List;
            }

            return;
          }
          that.$message.error({
            duration: 1000,
            message: resData.message
          });
        })
        .catch(function(error) {
          log(error);
        });
    },

    // 设置开卡策略
    setCateInfo(item) {
      item.cardCreateType = String(item.cardCreateType);
      item.cardNoStatus = String(item.cardNoStatus);
      item.cardNoTimeType = !!item.cardNoTimeType ? String(item.cardNoTimeType) : '0';
      item.cardBegin = !!item.cardBegin && item.cardBegin != 'null' ? String(item.cardBegin) : '';
      item.prefixKey = String(item.prefixKey);
      item.suffixKey = String(item.suffixKey);
      item.sex = !!item.sex ? item.sex : 0;
      item.usePrefix = item.usePrefix == 1 ? true : false;
      item.useSuffix = item.useSuffix == 1 ? true : false;
      // item.gradeDescribe = item.gradeDescribe;
      // item.memberSystemId = item.memberSystemId;
      return item;
    },

    // // 获取模板信息
    getTempInfo() {
      let that = this;
      let para = {};
      postRequest('/api-admin/get-card-field-template-detail', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 0) {
            let data = resData.result;
            data.forEach(function(ele, index) {
              if (ele.fieldType == 2) {
                ele.fieldContent = JSON.parse(ele.fieldContent.replace(/'/g, '"'));
              }
              // 生日 农历
              if (ele.systemFieldId == 'k103') {
                ele.radio = '';
                ele.fieldContent = JSON.parse(ele.fieldContent);
                ele.fieldContent.birthType = ele.fieldContent.birthType == 0 ? true : false;
              }
            });
            that.memberTemp = data;
            return;
          }
          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          log(error);
        });
    }
  },
  components: {
    topNavNew,
    cardCate
  },
  mounted() {
    let that = this;
    that.getMemberSetInfo();
    that.getTempInfo();
  }
};
</script>
<style lang="less" scoped>
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

  /* 模板 */
  .phone-container {
    margin-top: 40px;
  }
  .phone-view {
    background: url(../../../assets/iphone.png) no-repeat;
    background-size: 100%;
    width: 410px;
    height: 740px;
    margin: 0 20px;
    position: relative;
  }

  .phone-show-content {
    width: 330px;
    height: 537px;
    position: absolute;
    left: 41px;
    top: 83px;
    overflow-y: auto;
  }

  .block {
    margin-bottom: 2px;
  }

  .block-head {
    width: 100%;
    background: #f5f5f8;
    padding: 0;
    height: 46px;

    .opencard-item-title {
      line-height: 46px;
      padding-left: 10px;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
    }
  }

  .opend-card-item {
    height: 46px;
    line-height: 46px;
    background: #fff;
    border-bottom: 1px solid #e7e7eb;
    font-size: 14px;
    position: relative;

    &.sex::after {
      content: '';
      width: 100%;
      height: 100%;
      z-index: 2;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
  }

  .opend-card-group-title {
    height: 40px;
    line-height: 40px;
    padding-left: 10px;
  }

  .opend-card-item {
    height: 46px;
    line-height: 46px;
    background: #fff;
    border-bottom: 1px solid #e7e7eb;
  }

  .phone-list-item {
    // height: 44px;
    // line-height: 44px;
    background: #fff;
    margin-bottom: 5px;
    overflow: hidden;
  }

  .item-title {
    width: 100px;
    float: left;
    padding-left: 10px;
    overflow: hidden;
    white-space: nowrap;
    &.item-title-prewrap {
      line-height: 15px;
      word-break: break-all;
      white-space: pre-wrap;
      padding-top: 9px;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
    }
  }
  .move-icon i {
    cursor: pointer;
  }
  .el-icon-upload2 {
    font-size: 22px;
    cursor: pointer;
  }

  .el-icon-download {
    font-size: 22px;
    cursor: pointer;
  }
  .icon-font-down {
    display: inline-block;
    transform: rotateX(180deg);
  }
  i.icon-color {
    color: #606266;
  }
  i.disable {
    color: #e6e6e6;
    cursor: not-allowed;
  }

  .cell-body {
    padding: 24px 32px;
    margin-bottom: 18px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;

    /deep/ .el-form {
      .el-form-item:nth-child(1) {
        /*margin-top: 30px;*/
      }

      .el-form-item:last-child {
        /*margin-bottom: 0;*/
      }
    }
  }

  .add-level {
    width: 100%;
    margin: 15px 0 22px 0;
    text-align: right;
  }

  .card-cell {
    display: flex;
    width: 250px;
    padding: 10px;
    border-radius: 2px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: inline-block;
      vertical-align: middle;
    }
    span {
      display: inline-block;
      vertical-align: middle;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      margin-left: 5px;
    }
  }

  .el-input {
    width: 60px;
    margin: 0 10px;
  }

  .el-form-item {
    /deep/.el-form-item__label {
      line-height: 1;
      padding-top: 9px;
    }
  }

  .member-cell {
    background: #fff;
    padding: 0;
  }

  .title-group {
    position: relative;
    border-bottom: 1px solid #e7e7eb;
    padding: 20px 0 15px 32px;
  }
  .open-card-title {
    font-size: 16px;
    font-weight: 500;
    /*padding:5px 0;*/
  }
  .open-card-descript {
    font-size: 13px;
    color: #828282;
    padding: 5px 0;
  }
}
</style>
