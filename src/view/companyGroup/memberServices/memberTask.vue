<template>
  <div class="right-wrap">
    <topNav :navpath="navpath"></topNav>
    <el-tabs v-model="memberTab" @tab-click="handleTabClick">
      <el-tab-pane label="集团任务" name="first">
        <div class="right-content">
          <div class="right-box">
            <div class="attention-wrap member-task-contain">
              <!-- tab panel -->
              <div class="outer-contain">
                <template v-for="(taskrow, index) in companyGroupTask">
                  <template v-if="taskrow.item.length">
                    <el-row class="row-task-cell" v-for="(taskchild, ind) in taskrow.item" :key="ind">
                      <el-col :span="8">
                        {{ taskchild.missionItemName }}
                      </el-col>
                      <el-col :span="8">
                        <span class="span-txt">奖励</span>
                        <span class="span-num" v-if="!taskrow.editFlag">{{ taskchild.rewardValue }}</span>
                        <el-input size="small" class="w-175" v-if="taskrow.editFlag" v-model="taskchild.rewardInput" @keyup.native="($event, value) => pointNumInput($event, value)" @focus="focusInput(index, ind, taskchild, taskrow)" placeholder="请输入" type="tel" :maxlength="inputLength"></el-input>
                        <span class="span-unit">积分</span>
                        <i class="el-icon-edit" v-if="!taskrow.editFlag" @click="editTaskNum(index, ind, taskchild, taskrow)"></i>
                        <span class="span-oprate-icon" v-if="taskrow.editFlag">
                          <i class="el-icon-text el-button--text text-confirm" @click="saveTaskNum(index, ind, taskchild, taskrow)">保存</i>
                          <i class="el-icon-text text-cancel" @click="cancelTaskNum(index, ind, taskchild, taskrow)">取消</i>
                        </span>
                      </el-col>
                      <el-col :span="8">
                        <el-switch v-model="taskchild.status" @change="taskItemSwitch($event, index, ind, taskchild)"></el-switch>
                      </el-col>
                    </el-row>
                  </template>
                </template>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="商户任务" name="second">
        <div class="right-content">
          <div class="right-box">
            <div class="attention-wrap member-task-contain">
              <!-- tab panel -->
              <div class="outer-contain">
                <div class="merchant-contain">
                  <div class="merchant-select">
                    <el-select v-model="merchantSel" placeholder="请选择" @change="changeMerchant($event)">
                      <el-option v-for="item in merchantLists" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
                  </div>
                  <!-- table -->
                  <el-table class="member-cell-table" :data="merchantTableData" style="width: 100%">
                    <el-table-column prop="missionItemName" label="信息字段"> </el-table-column>
                    <el-table-column prop="num" label="奖励积分额">
                      <template slot-scope="scope">
                        <span class="span-txt">奖励</span>
                        <span class="span-num" v-if="!scope.row.editTaskFlag">{{ scope.row.rewardValue }}</span>
                        <el-input size="small" class="w-175" v-if="scope.row.editTaskFlag" v-model="scope.row.rewardInput" @keyup.native="($event, value) => merchantNumInput($event, value)" @focus="focusTask(scope.$index, scope.row)" placeholder="请输入" type="tel" :maxlength="inputLength"></el-input>
                        <span class="span-unit">积分</span>
                        <i class="el-icon-edit" v-if="!scope.row.editTaskFlag" @click="editMerchantNum(scope.$index, scope.row)"></i>
                        <span class="span-oprate-icon" v-if="scope.row.editTaskFlag">
                          <i class="el-icon-text el-button--text text-confirm" @click="saveMerchantNum(scope.$index, scope.row)">保存</i>
                          <i class="el-icon-text text-cancel" @click="cancelMerchantNum(scope.$index, scope.row)">取消</i></span
                        >
                      </template>
                    </el-table-column>
                    <el-table-column prop="switchFlag" label="开关">
                      <template slot-scope="scope">
                        <el-switch v-model="scope.row.status" @change="merchantSwitch($event, scope.$index, scope.row)"></el-switch>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>

                <div class="merchant-contain padding-0" v-for="(evaItem, index) in evaluateData" :key="index">
                  <!-- 订单 -->
                  <div>
                    <el-row class="order-evaluate-row row-thead">
                      <el-col :span="8"
                        ><div class="">{{ evaItem.missionItemName }}</div></el-col
                      >
                      <el-col :span="8"
                        ><div class=""><label v-if="evaItem.usedRule == 1">每笔</label>奖励 {{ evaItem.usedRule == 0 ? evaItem.rewardValue : evaItem.moneyPoint }} 积分 <i class="el-icon-edit" @click="editOrderNum(index, evaItem)"></i></div
                      ></el-col>
                      <el-col :span="8"
                        ><div class=""><el-switch v-model="evaItem.status" @change="merchantOrderSwitch($event, index, evaItem, 'all')"></el-switch></div
                      ></el-col>
                    </el-row>
                    <el-row class="order-evaluate-row" v-for="(bodyItem, ind) in evaItem.enterpriseMissonList" :key="ind">
                      <el-col :span="8"
                        ><div class="">{{ bodyItem.brandName }}</div></el-col
                      >
                      <el-col :span="8">
                        <div class="">
                          <label v-if="bodyItem.usedRule == 1">每笔</label>奖励 {{ bodyItem.usedRule == 0 ? bodyItem.rewardValue : bodyItem.moneyPoint }} 积分
                          <i class="el-icon-edit" @click="editOrderChildNum(index, ind, bodyItem)"></i>
                        </div>
                      </el-col>
                      <el-col :span="8"
                        ><div class=""><el-switch v-model="bodyItem.status" @change="merchantOrderSwitch($event, ind, bodyItem, 'child')"></el-switch></div
                      ></el-col>
                    </el-row>
                  </div>
                </div>
                <!-- 额外十字评语 -->
                <div class="merchant-contain padding-0" v-for="(evaItem, index) in evaluateTextData" :key="index">
                  <div>
                    <el-row class="order-evaluate-row row-thead">
                      <el-col :span="8"
                        ><div class="">{{ evaItem.missionItemName }}</div></el-col
                      >
                      <el-col :span="8">
                        <div class="">
                          <span class="span-txt">奖励</span>
                          <span class="span-num" v-if="!evaItem.editTaskFlag">{{ evaItem.rewardValue }}</span>
                          <el-input size="small" class="w-175" v-if="evaItem.editTaskFlag" v-model="evaItem.rewardInput" @focus="focusTask(index, evaItem)" @keyup.native="$event => extNumInput($event)" placeholder="请输入" type="tel" :maxlength="inputLength"></el-input>
                          <span class="span-unit">积分</span>
                          <i class="el-icon-edit" v-if="!evaItem.editTaskFlag" @click="editExtTaskNum(index, evaItem)"></i>
                          <span class="span-oprate-icon" v-if="evaItem.editTaskFlag">
                            <i class="el-icon-text el-button--text text-confirm" @click="saveExtTaskNum(index, evaItem, 'all')">保存</i>
                            <i class="el-icon-text text-cancel" @click="cancelExtTaskNum(index, evaItem)">取消</i>
                          </span>
                        </div>
                      </el-col>
                      <el-col :span="8"
                        ><div class=""><el-switch v-model="evaItem.status" @change="merchantOrderSwitch($event, index, evaItem, 'all')"></el-switch></div
                      ></el-col>
                    </el-row>
                    <el-row class="order-evaluate-row" v-for="(bodyItem, ind) in evaItem.enterpriseMissonList" :key="ind">
                      <el-col :span="8"
                        ><div class="">{{ bodyItem.brandName }}</div></el-col
                      >
                      <el-col :span="8">
                        <div class="">
                          <span class="span-txt">奖励</span>
                          <span class="span-num" v-if="!bodyItem.editTaskFlag">{{ bodyItem.rewardValue }}</span>
                          <el-input size="small" class="w-175" v-if="bodyItem.editTaskFlag" v-model="bodyItem.rewardInput" @focus="focusTask(index, bodyItem)" @keyup.native="$event => extNumInput($event)" placeholder="请输入" type="tel" :maxlength="inputLength"></el-input>
                          <span class="span-unit">积分</span>
                          <i class="el-icon-edit" v-if="!bodyItem.editTaskFlag" @click="editExtTaskNum(ind, bodyItem)"></i>
                          <span class="span-oprate-icon" v-if="bodyItem.editTaskFlag">
                            <i class="el-icon-text el-button--text text-confirm" @click="saveExtTaskNum(ind, bodyItem, 'child')">保存</i>
                            <i class="el-icon-text text-cancel" @click="cancelExtTaskNum(ind, bodyItem)">取消</i>
                          </span>
                        </div>
                      </el-col>
                      <el-col :span="8"
                        ><div class=""><el-switch v-model="bodyItem.status" @change="merchantOrderSwitch($event, ind, bodyItem, 'child')"></el-switch></div
                      ></el-col>
                    </el-row>
                  </div>
                </div>

                <edit-dialog :showEditDialog="showEditDialog" :transData="transData" @setEdit="setEdit"></edit-dialog>
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
import editDialog from 'components/memberTask/edit-dialog';
import { postRequest, postJson } from '@/api/api';
import showMsg from '@/common/js/showmsg';
import errMsg from '@/common/js/error';
import strLength from '@/common/js/strlen';
import { log } from '@/utils/index.js';

export default {
  name: 'memberTask',
  data() {
    return {
      projectName: 'gic-clique', // 当前项目名
      memberTab: 'first',
      navpath: [
        {
          name: '会员任务',
          path: ''
        }
      ],

      inputLength: 6, // 限制输入数字长度,

      // 集团任务数据
      companyGroupTask: [
        // {
        //   id: 1,
        //   missionName: '阅读了解积分的玩法',
        //   rewardValue: 4,
        //   taskSwitch: true,
        //   editFlag: false,
        //   item:[
        //     {
        //       missionItemName: '名称',
        //       rewardValue: '0',
        //       rewardInput: '0',
        //       status: true
        //     }
        //   ]
        // },
        // {
        //   id: 2,
        //   missionName: '查看会员的专项特权',
        //   rewardValue: 4,
        //   taskSwitch: true,
        //   editFlag: false,
        //   item:[
        //     {
        //       missionItemName: '名称',
        //       rewardValue: '0',
        //       rewardInput: '0',
        //       status: true
        //     }
        //   ]
        // },
        // {
        //   id: 3,
        //   missionName: '完善您的收货地址',
        //   rewardValue: 4,
        //   taskSwitch: true,
        //   editFlag: false,
        //   item:[
        //     {
        //       missionItemName: '名称',
        //       rewardValue: '0',
        //       rewardInput: '0',
        //       status: true
        //     }
        //   ]
        // },
        // {
        //   id: 4,
        //   missionName: '体验智能身型测试',
        //   rewardValue: 4,
        //   taskSwitch: true,
        //   editFlag: false,
        //   item:[
        //     {
        //       missionItemName: '名称',
        //       rewardValue: '0',
        //       rewardInput: '0',
        //       status: true
        //     }
        //   ]
        // },
        // {
        //   id: 5,
        //   missionName: '体验一次会员签到',
        //   rewardValue: 4,
        //   taskSwitch: true,
        //   editFlag: false,
        //   item:[
        //     {
        //       missionItemName: '名称',
        //       rewardValue: '0',
        //       rewardInput: '0',
        //       status: true
        //     }
        //   ]
        // },
        // {
        //   id: 6,
        //   missionName: '体验一次卡券兑换',
        //   rewardValue: 4,
        //   taskSwitch: true,
        //   editFlag: false,
        //   item:[
        //     {
        //       missionItemName: '名称',
        //       rewardValue: '0',
        //       rewardInput: '0',
        //       status: true
        //     }
        //   ]
        // },
      ],
      companyGroupTaskCopy: [], // 集团任务数据 copy
      editObj: {
        index: '',
        ind: '',
        row: '',
        obj: ''
      },

      // 商户列表
      merchantSel: '',
      merchantLists: [],
      merchantTableData: [
        // {
        //   missionItemName: '6',
        //   rewardValue: '',
        //   rewardInput: '',
        //   editTaskFlag: false,
        //   status: false
        // }
      ],
      merchantTaskCopy: [], // 商户任务数据 copy,避免多个编辑丢失

      // 评价
      showEditDialog: false, // 显示编辑弹框
      transData: {
        radio: '1',
        point: 12,
        money: '',
        moneyPoint: ''
      },

      evaluateData: [
        // {
        //   missionItemName: '完成订单评价',
        //   rewardValue: 2,
        //   usedRule: 1,// 是否使用规则 1使用 0不使用
        //   title: 0, // 0: 头部, 1: body内
        //   switchFlag: true,
        //   money: '',
        //   moneyPoint: '',
        //   orderEvaluate:[
        //     {
        //       missionItemName: '完成订单评价',
        //       "brandName": "江南布衣信息中心jnby",
        //       rewardValue: 2,
        //       usedRule: 0,// 是否使用规则 1使用 0不使用
        //       title: 1, // 0: 头部, 1: body内
        //       switchFlag: true,
        //       money: '',
        //       moneyPoint: '2',
        //     },
        //     {
        //       missionItemName: '完成订单评价',
        //       "brandName": "江南布衣信息中心jnby",
        //       rewardValue: 2,
        //       usedRule: 0,// 是否使用规则 1使用 0不使用
        //       title: 1, // 0: 头部, 1: body内
        //       switchFlag: true,
        //       money: '',
        //       moneyPoint: '',
        //     }
        //   ]
        // },
        // {
        //   missionItemName: '10字以上评语额外奖励',
        //   rewardValue: 2,
        //   evaluateType: 2, // 2:额外奖励
        //   title: 0, // 0: 头部, 1: body内
        //   switchFlag: true,
        //   editTaskFlag: false,
        //   orderEvaluate:[
        //     {
        //       missionItemName: '江南布衣',
        //       rewardValue: 2,
        //       title: 1, // 0: 头部, 1: body内
        //       switchFlag: true,
        //       editTaskFlag: false
        //     }
        //   ]
        // }
      ],
      // 十字评语
      evaluateTextData: [],

      orderIndex: '', // 记录order 弹窗的index
      orderInd: '', // 记录order 弹窗的ind
      orderTitle: '', // 记录order 弹窗的 title
      evaluateDataCopy: [] //复制的值,避免多个编辑丢失
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

    // 集团任务 switch ===================================>
    // switch
    taskItemSwitch(e, index, ind, obj) {
      let that = this;
      log(e, index, obj);
      if (!parseInt(obj.rewardValue) && e) {
        obj.status = false;
        showMsg.showmsg('请完善后开启', 'warning');
        return;
      }
      let status = e == true ? 1 : 0;
      // 请求修改
      that.changeSwitch(obj.missionItemEnterpriseId, status);
    },

    // 点击编辑任务积分
    editTaskNum(index, ind, row, obj) {
      let that = this;
      // that.$forceUpdate();
      log(index, ind, row);
      obj.editFlag = true;

      // 暂存当前的对象
      that.editObj.index = index;
      that.editObj.row = row;
    },

    // 保存
    saveTaskNum(index, ind, row, obj) {
      let that = this;
      log(index, ind, row);
      // 把输入框中值赋值给当前显示的字段
      row.rewardValue = row.rewardInput;

      let id = row.missionItemEnterpriseId;
      let usedRule = '' || 0; //是否使用 奖励规则 ，1 是，0 否
      let rewardRule = '' || '0:0'; //奖励规则 XX:XX兑换比例 当usedRule为1时，采用此字段规则
      let value = row.rewardValue;

      that.saveValue(id, usedRule, rewardRule, value);
      // 隐藏编辑
      obj.editFlag = false;
      // 清空输入数值
      that.inputNum = '';
      that.editObj = {
        index: '',
        ind: '',
        row: '',
        obj: ''
      };
    },

    cancelTaskNum(index, ind, row, obj) {
      let that = this;
      log(index, ind, row);
      row.rewardInput = row.rewardValue;
      obj.editFlag = false;
      that.inputNum = ''; // 清空输入数值
      that.editObj = {
        index: '',
        ind: '',
        row: '',
        obj: ''
      };
    },

    // input focus
    focusInput(index, ind, row, obj) {
      let that = this;
      log('input-focus:', index, ind, obj, row);
      that.editObj.index = index;
      that.editObj.ind = ind;
      that.editObj.row = row;
    },

    // 输入框输入
    pointNumInput(e, r) {
      let that = this;
      log(e, r);
      // 过滤非数字
      that.inputNum = strLength.getCharVal(e.target.value.replace(/[^\d]/g, ''), that.inputLength);

      // 输入后把输入的值赋值给当前对应的的输入框值
      that.editObj.row.rewardInput = that.inputNum;
      log(that.editObj.row);
    },

    // 保存编辑数据
    saveValue(id, usedRule, rewardRule, value) {
      let that = this;
      let para = {
        missionItemEnterpriseId: id,
        usedRule: usedRule,
        rewardRule: rewardRule,
        rewardValue: value
      };
      postJson('/api-member/member-mission-update-clique', para)
        .then(res => {
          let resData = res.data;
          log(resData);
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
    },

    // 会员集团任务开启关闭
    changeSwitch(id, status, code) {
      let that = this;
      let para = {
        missionItemEnterpriseId: id,
        status: status,
        missionCode: code || ''
      };
      postJson('/api-member/member-mission-open-clique', para)
        .then(res => {
          let resData = res.data;
          log(resData);
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
    },

    // ===========================================================>
    // 商户任务部分
    // switch
    merchantSwitch(e, index, obj) {
      let that = this;
      log(e, index, obj);
      if (!obj.rewardValue && e) {
        obj.status = false;
        showMsg.showmsg('请完善后开启', 'warning');
        return;
      }

      let id = obj.missionItemEnterpriseId;
      let status = e == true ? 1 : 0;
      that.saveMerchantSwitch(id, status);
      log(obj);
    },

    saveMerchantSwitch(id, status) {
      let that = this;

      let para = {
        missionItemEnterpriseId: id,
        status: status
      };
      postJson('/api-member/member-mission-open', para)
        .then(res => {
          log(res.data.result);
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
    },

    // 点击编辑任务积分
    editMerchantNum(index, row) {
      let that = this;
      log(index, row);
      row.editTaskFlag = true;

      that.editObj.index = index;
      that.editObj.row = row;
    },

    saveMerchantNum(index, row) {
      let that = this;
      log(index, row);
      row.rewardValue = row.rewardInput;

      let id = row.missionItemEnterpriseId;
      let usedRule = '' || 0; //是否使用 奖励规则 ，1 是，0 否
      let rewardRule = '' || '0:0'; //奖励规则 XX:XX兑换比例 当usedRule为1时，采用此字段规则
      let value = row.rewardValue;
      that.saveMemberValue(id, usedRule, rewardRule, value, row);
    },
    // 清空已经暂存的值
    clearSaveInfo() {
      let that = this;
      // 请求设置编辑的值
      that.inputNum = ''; // 清空输入数值

      that.editObj = {
        index: '',
        row: ''
      };
    },

    // 保存编辑数据
    saveMemberValue(id, usedRule, rewardRule, value, row) {
      let that = this;
      let para = {
        missionItemEnterpriseId: id,
        usedRule: usedRule,
        rewardRule: rewardRule,
        rewardValue: value
      };
      postJson('/api-member/member-mission-update', para)
        .then(res => {
          let resData = res.data;
          log(resData);
          if (resData.errorCode == 0) {
            // 隐藏编辑
            row.editTaskFlag = false;
            // 清空暂存的值
            that.clearSaveInfo();
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
    },
    cancelMerchantNum(index, row) {
      let that = this;
      log(index, row);
      row.rewardInput = row.rewardValue;
      row.editTaskFlag = false;
      // 清空暂存的值
      that.clearSaveInfo();
    },

    // input focus
    focusTask(index, row) {
      let that = this;
      log('input-focus:', index, row);
      that.editObj.index = index;
      that.editObj.row = row;
    },
    // 输入框输入
    merchantNumInput(e, r) {
      let that = this;
      log(e, r);
      // 过滤非数字
      that.inputNum = strLength.getCharVal(e.target.value.replace(/[^\d]/g, ''), that.inputLength) || 0;
      that.editObj.row.rewardInput = parseInt(that.inputNum);
    },

    // ======================================================================

    // 编辑 order
    editOrderNum(index, row) {
      let that = this;
      that.showEditDialog = true;
      log(index, row);
      that.orderIndex = index;
      that.orderTitle = row.title;

      that.transData.flag = 'all'; // 头部全部设置标志
      that.transData.radio = String(row.usedRule);
      that.transData.point = row.rewardValue;
      that.transData.money = row.moneyNum;
      that.transData.moneyPoint = row.moneyPoint;
      that.transData.missionItemEnterpriseId = row.missionItemEnterpriseId;
      that.transData.code = row.missionCode; // 新增字段
    },
    // 编辑 order child
    editOrderChildNum(index, ind, row) {
      let that = this;
      log('order child:', index, ind, row);
      that.orderIndex = index;
      that.orderInd = ind;
      that.orderTitle = row.title;

      that.showEditDialog = true;
      that.transData.flag = 'child'; // 头部全部设置标志
      that.transData.radio = String(row.usedRule);
      that.transData.point = row.rewardValue;
      that.transData.money = row.moneyNum;
      that.transData.moneyPoint = row.moneyPoint;
      that.transData.missionItemEnterpriseId = row.missionItemEnterpriseId;

      that.transData.code = '';
    },

    // 完成评价 头部switch
    merchantOrderSwitch(e, index, row, tag) {
      let that = this;
      log(e, index, row, tag, row.moneyPoint);
      if ((parseInt(row.usedRule) === 0 && !parseInt(row.rewardValue) && e) || (parseInt(row.usedRule) === 1 && !parseInt(row.moneyPoint) && e)) {
        row.status = false;
        showMsg.showmsg('请完善后开启', 'warning');
        return;
      }
      let id = row.missionItemEnterpriseId;
      let status = e == true ? 1 : 0;
      let code = '';
      if (tag == 'all') {
        code = row.missionCode;
      }
      // that.saveMerchantSwitch(id,status)
      that.changeSwitch(id, status, code); //改用集团开关接口
      row.status = e;
      if (tag == 'all') {
        row.enterpriseMissonList.forEach(function(ele, index) {
          ele.status = e;
        });
      }

      log(row);
    },

    // =======================================================
    //编辑额外奖励-----------------------------------
    // 点击编辑任务积分
    editExtTaskNum(index, row) {
      let that = this;
      that.$forceUpdate();
      log('编辑任务积分:', index, row);
      row.editTaskFlag = true;
      row.rewardInput = row.rewardValue;

      that.editObj.index = index;
      that.editObj.row = row;
    },
    saveExtTaskNum(index, row, tag) {
      let that = this;
      that.$forceUpdate();
      log(index, row, tag);
      row.rewardValue = row.rewardInput;

      let id = row.missionItemEnterpriseId;
      let usedRule = '' || 0; //是否使用 奖励规则 ，1 是，0 否
      let rewardRule = '' || '0:0'; //奖励规则 XX:XX兑换比例 当usedRule为1时，采用此字段规则
      let value = row.rewardValue;
      let code = '';
      if (tag == 'all') {
        code = row.missionCode;
      }

      that.saveExtTaskValue(id, usedRule, rewardRule, value, row, code);

      row.editTaskFlag = false;
      if (tag == 'all') {
        row.enterpriseMissonList.forEach(function(ele, index) {
          ele.rewardValue = row.rewardValue;
        });
      }

      // 请求设置编辑的值
      that.inputNum = ''; // 清空输入数值

      that.editObj = {
        index: '',
        row: '',
        obj: ''
      };
    },

    // 保存
    // 保存编辑数据
    saveExtTaskValue(id, usedRule, rewardRule, value, row, code) {
      let that = this;
      let para = {
        missionItemEnterpriseId: id,
        usedRule: usedRule,
        rewardRule: rewardRule,
        rewardValue: value,
        missionCode: code
      };
      postJson('/api-member/member-mission-update-clique', para)
        .then(res => {
          let resData = res.data;
          log(resData);
          if (resData.errorCode == 0) {
            // 隐藏编辑
            row.editTaskFlag = false;
            // 清空暂存的值
            that.clearSaveInfo();
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
    },

    cancelExtTaskNum(index, row) {
      let that = this;
      that.$forceUpdate();
      log(index, row, that.evaluateDataCopy);
      row.rewardInput = row.rewardValue;
      row.editTaskFlag = false;
      that.inputNum = ''; // 清空输入数值
    },

    // 输入框输入
    extNumInput(e, r) {
      let that = this;
      log(e, r);
      // 过滤非数字
      that.inputNum = strLength.getCharVal(e.target.value.replace(/[^\d]/g, ''), that.inputLength);
      that.editObj.row.rewardInput = that.inputNum;
    },

    //子组件触发的方法
    setEdit(val) {
      let that = this;
      // 隐藏编辑
      that.showEditDialog = false;
      log('子组件返回:', val);
      if (!!val) {
        let id = val.missionItemEnterpriseId;
        let usedRule = val.radio || 0; //是否使用 奖励规则 ，1 是，0 否
        let rewardRule = (val.money || 0) + ':' + (val.moneyPoint || 0) || '0:0'; //奖励规则 XX:XX兑换比例 当usedRule为1时，采用此字段规则
        let value = val.point;
        if (usedRule == 1) {
          value = val.moneyPoint;
        }
        let code = '';
        if (val.code) {
          code = val.code;
        }

        log('子组件返回:', id, usedRule, rewardRule, value, val, code);

        that.saveEvaValue(id, usedRule, rewardRule, value, val, code);
      }
    },

    // 请求数据之后处理
    handleDataClear(val) {
      let that = this;
      // 如果设置的 头部.全部设置相同
      if (val.flag == 'all') {
        log('积分', that.evaluateData);
        that.evaluateData[that.orderIndex].usedRule = val.radio;

        if (val.radio == 0) {
          // 如果是积分
          that.evaluateData[that.orderIndex].rewardValue = val.point;
          that.evaluateData[that.orderIndex].enterpriseMissonList.forEach(function(ele, index) {
            ele.rewardValue = val.point;
            ele.usedRule = val.radio;
          });
        } else {
          // 如果是金额奖励
          that.evaluateData[that.orderIndex].moneyPoint = val.moneyPoint;
          that.evaluateData[that.orderIndex].moneyNum = val.money;
          that.evaluateData[that.orderIndex].enterpriseMissonList.forEach(function(ele, index) {
            ele.usedRule = val.radio;
            ele.moneyNum = val.money;
            ele.moneyPoint = val.moneyPoint;
          });
        }
      } else {
        that.evaluateData[that.orderIndex].enterpriseMissonList[that.orderInd].usedRule = val.radio;
        if (val.radio == 0) {
          // 如果是积分
          that.evaluateData[that.orderIndex].enterpriseMissonList[that.orderInd].rewardValue = val.point;
        } else {
          that.evaluateData[that.orderIndex].enterpriseMissonList[that.orderInd].moneyNum = val.money;
          that.evaluateData[that.orderIndex].enterpriseMissonList[that.orderInd].moneyPoint = val.moneyPoint;
        }
      }

      // 清空存的 index,ind值
      that.orderIndex = '';
      that.orderInd = '';
      that.orderTitle = '';
    },
    // 设置完成评价积分
    saveEvaValue(id, usedRule, rewardRule, value, val, code) {
      let that = this;

      let para = {
        missionItemEnterpriseId: id,
        usedRule: usedRule,
        rewardRule: rewardRule,
        rewardValue: value,
        missionCode: code || ''
      };
      postJson('/api-member/member-mission-update-clique', para)
        .then(res => {
          let resData = res.data;
          log(resData);
          if (resData.errorCode == 0) {
            // 隐藏编辑
            that.showEditDialog = false;
            // 清空暂存的值
            that.handleDataClear(val);
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
    },

    // 选择商户changeMerchant
    changeMerchant(e) {
      let that = this;
      log(that.merchantSel);
      that.getEnterpriseMemberList();
    },

    // 获取集团下商户的任务列表
    getEnterpriseMemberList() {
      let that = this;
      let para = {
        enterpriseId: that.merchantSel,
        missionCode: 'perfectInformation'
      };
      postJson('/api-member/clique-enterprise-mission-set', para)
        .then(res => {
          let resData = res.data;
          log(resData);
          if (resData.errorCode == 0) {
            let data = resData.result.missionItemList;
            data.forEach(function(ele, index) {
              ele.status = ele.status == 1 ? true : false;
              ele.rewardInput = ele.rewardValue;
              ele.editTaskFlag = false;
            });
            that.merchantTableData = data;
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

    // 获取集团下各个商户列表
    getEnterpriseList() {
      let that = this;
      let para = {};
      postRequest('/api-member/clique-enterprise-list', para)
        .then(res => {
          let resData = res.data;
          log(resData);
          if (resData.errorCode == 0) {
            let data = resData.result.enterpriseList;
            if (!!data.length) {
              that.merchantSel = data[0].enterpriseId;

              data.forEach(function(ele, index) {
                ele.label = ele.brandName;
                ele.value = ele.enterpriseId;
              });
            }

            that.merchantLists = data;
            if (!!that.merchantSel) {
              that.getEnterpriseMemberList();
            }
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

    // 获取会员任务列表
    getInfo() {
      let that = this;
      let para = {};
      postRequest('/api-member/member-clique-mission-list', para)
        .then(res => {
          let resData = res.data;
          log(resData);
          if (resData.errorCode == 0) {
            let data = resData.result.missionList;
            data.forEach(function(ele, index) {
              ele.editFlag = false;
              if (!!ele.item.length) {
                ele.item.forEach(function(el, i) {
                  el.rewardInput = el.rewardValue;
                  el.status = el.status == 1 ? true : false;
                });
              }
            });

            that.companyGroupTask = data;
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

    // 获取商户中完成评价任务
    getEvaluate() {
      let that = this;
      that.getEvaluateInfo('evaluationComment');
    },
    // 获取商户中十字评语任务
    getTextEvaluate() {
      let that = this;
      that.getEvaluateInfo('orderEvaluation');
    },

    // 获取评价任务方法
    getEvaluateInfo(code) {
      let that = this;
      let para = {
        missionCode: code
      };
      postJson('/api-member/clique-enterprise-mission-code', para)
        .then(res => {
          let resData = res.data;
          log(resData);
          if (resData.errorCode == 0) {
            let data = [];
            data.push(resData.result.missionItem);
            log(data);
            data.forEach(function(ele, index) {
              ele.editTaskFlag = false;
              ele.rewardInput = ele.rewardValue;
              if (ele.usedRule == 1) {
                ele.moneyPoint = ele.rewardRule.split(':')[1]; // 增加字段兑换的积分
                ele.moneyNum = ele.rewardRule.split(':')[0]; // 增加字段 兑换的钱
              } else {
                ele.moneyPoint = '';
                ele.moneyNum = '';
              }
              ele.status = ele.status == 1 ? true : false;
              if (ele.enterpriseMissonList.length) {
                ele.enterpriseMissonList.forEach(function(el, ind) {
                  el.status = el.status == 1 ? true : false;
                  el.editTaskFlag = false;
                  el.rewardInput = el.rewardValue;
                  if (el.usedRule == 1) {
                    el.moneyPoint = el.rewardRule.split(':')[1]; // 增加字段兑换的积分
                    el.moneyNum = el.rewardRule.split(':')[0]; // 增加字段 兑换的钱
                  } else {
                    el.moneyPoint = '';
                    el.moneyNum = '';
                  }
                });
              }
            });
            /*data = [
            {
              "missionItemEnterpriseId": "402881e962e6570a0162f07da7f70051",
              "missionEnterpriseId": "402881e962e6570a0162f07da7cd0050",
              "missionItemName": "完成订单评价",
              "missionCode": "orderEvaluation",
              "missionReferId": "-1",
              "rewardValue": 3,
              "status": 0,
              "usedRule": 0,
              "rewardRule": "1:1",
              moneyPoint: '1',
              moneyNum: '1',
              editTaskFlag:false,
              rewardInput:'',
              "cliqueId": "ff80808162ddfe1a0162e0ebd39c0000",
              "enterpriseMissonList": [
                {
                  "missionItemEnterpriseId": "ff80808162d132b40162d146862c0046",
                  "missionEnterpriseId": "ff80808162d132b40162d14686290045",
                  "brandName": "江南布衣信息中心jnby",
                  "missionItemName": "完成订单评价",
                  "missionCode": "orderEvaluation",
                  "missionReferId": "-1",
                  "rewardValue": 3,
                  "status": 0,
                  "usedRule": 0,
                  "rewardRule": "1:1",
                  moneyPoint: '1',
                  moneyNum: '1',
                  editTaskFlag: false,
                  rewardInput: '',
                  "cliqueId": "ff80808162ddfe1a0162e0ebd39c0000"
                },
                {
                  "missionItemEnterpriseId": "ff8080815aa6afac015aa7895b0f0010",
                  "missionEnterpriseId": "ff80808162b425c60162b7967a50003a",
                  "brandName": "达摩测试",
                  "missionItemName": "完成订单评价",
                  "missionCode": "orderEvaluation",
                  "missionReferId": "-1",
                  "rewardValue": 3,
                  "status": 0,
                  "usedRule": 0,
                  "rewardRule": "1:1",
                  moneyPoint: '1',
                  moneyNum: '1',
                  editTaskFlag: false,
                  rewardInput: '',
                  "cliqueId": "ff80808162ddfe1a0162e0ebd39c0000"
                }
              ]
            }
          ]*/
            if (code == 'orderEvaluation') {
              that.evaluateTextData = data;
            } else {
              that.evaluateData = data;
            }

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
  mounted() {
    let that = this;
    // 复制列表数据,多个编辑时候用
    that.getInfo();
    that.getEnterpriseList();

    // 获取评价
    that.getEvaluate();
    that.getTextEvaluate();
  },
  update() {
    log('up');
  },
  components: {
    topNav,
    editDialog
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

  .right-content {
    padding: 24px;

    .outer-contain {
      position: relative;
    }

    .right-box {
      padding: 24px;
      background: #fff;

      .merchant-select {
        margin-bottom: 10px;
      }
    }
    .merchant-contain {
      padding: 10px;
      border: 1px solid #e7e7eb;
      & + .merchant-contain {
        margin-top: 15px;
      }
      &.padding-0 {
        padding: 0;
        .el-row {
          padding: 13px;
          &.row-thead {
            border-bottom: 1px solid #e7e7eb;
          }
          .el-col-8 {
            padding-left: 10px;
            line-height: 20px;
          }
        }
      }
    }
  }
}

.el-tabs__nav {
  z-index: 1;
}

.member-task-contain /deep/ {
  font-size: 14px;

  .row-task-cell {
    display: flex;
    align-items: center;
    border: 1px solid #e7e7eb;
    padding: 12px 20px;
    margin-bottom: 15px;
    &.row-task-cell:last-child {
      margin-bottom: 0;
    }
  }
  .el-icon-edit {
    cursor: pointer;
    color: #909399;
    font-size: 14px;
    &:hover {
      color: #1890ff;
    }
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
