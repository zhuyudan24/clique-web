<template>
  <div class="right-wrap">
    <topNavNew :navpath="navpath"></topNavNew>
    <div class="right-content">
      <div class="right-box">
        <div class="attention-wrap">
          <div class="form-wrap">
            <el-form :model="ruleForm" ref="ruleForm" label-width="120px" class="demo-ruleForm">
              <el-form-item label="策略名称" prop="">
                <el-input v-model="ruleForm.strategyName" class="w-340" @keyup.native="value => toInput(value)"> </el-input>
                <label class="input-label">{{ cateNameLength }}/20</label>
              </el-form-item>
              <template v-for="(item, index) in ruleForm.channelList">
                <!-- 线下渠道 -->
                <template v-if="item.channelType == 3">
                  <el-form-item label="适用线下渠道" prop="" :key="index">
                    <el-switch v-model="item.openStatus" active-text="启用" inactive-text="停用"> </el-switch>
                  </el-form-item>
                  <div class="form-child" v-if="item.openStatus" :key="index">
                    <el-form-item label="消费门店" prop="region">
                      <vue-gic-store-group :scenesVal="scencs" :options="options" :isAdd="isAdd" :uuid.sync="uuid" ref="storeGroup"></vue-gic-store-group>
                    </el-form-item>
                    <el-form-item label="适用商品" prop="name" class="padding-0">
                      <el-select v-model="item.channelRelationProType" placeholder="请选择" @change="changeGood($event)">
                        <el-option v-for="item in applyGoods" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                      </el-select>
                      <!-- 二级 -->
                      <span class="span-txt" ref="treeinput" v-if="item.channelRelationProType == 2" @click="toggle('brand')">已选择 {{ item.strategyGoodsRelationIdArr ? item.strategyGoodsRelationIdArr.length : 0 }} 个品牌 </span>
                      <span class="span-txt" ref="treeinput" v-if="item.channelRelationProType == 3" @click="toggle('brand')">已选择 {{ item.strategyGoodsRelationIdArr ? item.strategyGoodsRelationIdArr.length : 0 }} 个品类 </span>
                      <treeselect v-if="item.channelRelationProType == 2 || item.channelRelationProType == 3" placeholder="" noOptionsText="暂无数据" noResultsText="无数据" :multiple="true" :always-open="goodsOpen" :options="goodsTreeOptions" :value-consists-of="valueConsistsOf" v-model="item.strategyGoodsRelationIdArr" />
                      <el-button v-if="item.channelRelationProType == 4" @click="showGoodsDialog">已选0件商品</el-button>
                    </el-form-item>
                    <el-form-item label="折扣控制" prop="region">
                      <div class="radio-cell">
                        <el-radio v-model="item.integralUseDiscountControl" label="1">所有折扣商品都适用</el-radio>
                      </div>
                      <div class="radio-cell margin-20">
                        <el-radio v-model="item.integralUseDiscountControl" label="2">折扣</el-radio>
                        <el-input-number v-model="item.integralUseDiscountControlLower" :precision="2" :controls="false" :max="10.0" :min="0.01" :step="0.01"></el-input-number>
                        <label>至</label>
                        <el-input-number v-model="item.integralUseDiscountControlUpper" :precision="2" :controls="false" :max="10.0" :min="0.01"></el-input-number>
                        <label>折商品都适用</label>
                        <span style="font-size: 13px;color: #828282;line-height: 1;padding-left: 10px;">注意：折扣范围0.01-10.00，最低折扣不能大于最高折扣</span>
                      </div>
                    </el-form-item>
                  </div>
                </template>

                <template v-if="item.channelType == 1">
                  <!-- 微信商城 -->
                  <el-form-item label="适用微信商城" prop="" :key="index">
                    <el-switch v-model="item.openStatus" active-text="启用" inactive-text="停用"> </el-switch>
                  </el-form-item>
                  <div class="form-child margin-20" v-if="item.openStatus == true" :key="index">
                    <el-form-item label="选择商户">
                      <el-select size="small" v-model="item.enterpriseRelationIdArr" placeholder="请选择" multiple>
                        <el-option v-for="(item, ind) in mechantOption" :key="ind" :label="item.label" :value="item.value"> </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="适用商品" class="padding-0">
                      <el-select v-model="item.channelRelationProType" placeholder="请选择" @change="changeGood($event)">
                        <el-option v-for="item in applyGoods" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                      </el-select>
                      <!-- 二级 -->
                      <span class="span-txt" ref="treeinput" v-if="item.channelRelationProType == 2" @click="toggle('wx')">已选择 {{ item.goodsRelationIdArr ? item.goodsRelationIdArr.length : 0 }} 个品牌 </span>
                      <span class="span-txt" ref="treeinput" v-if="item.channelRelationProType == 3" @click="toggle('wx')">已选择 {{ item.goodsRelationIdArr ? item.goodsRelationIdArr.length : 0 }} 个品类 </span>
                      <treeselect v-if="item.channelRelationProType == 2 || item.channelRelationProType == 3" placeholder="" noOptionsText="暂无数据" noResultsText="无数据" :multiple="true" :always-open="wxOpen" :options="goodsTreeOptions" :value-consists-of="valueConsistsOf" v-model="item.goodsRelationIdArr" @select="selectWx($event, index, item)" />
                      <!--model=item.strategyGoodsRelationIdArr和上一个相同会有问题 -->
                      <el-button v-if="item.channelRelationProType == 4" @click="showGoodsDialog">已选0件商品</el-button>
                    </el-form-item>
                    <el-form-item label="折扣控制" prop="region">
                      <div class="radio-cell">
                        <el-radio v-model="item.integralUseDiscountControl" label="1">所有折扣商品都适用</el-radio>
                      </div>
                      <div class="radio-cell margin-20">
                        <el-radio v-model="item.integralUseDiscountControl" label="2">折扣</el-radio>
                        <el-input-number v-model="item.integralUseDiscountControlLower" :precision="2" :controls="false" :max="10.0" :min="0.01"></el-input-number>
                        <label>至</label>
                        <el-input-number v-model="item.integralUseDiscountControlUpper" :precision="2" :controls="false" :max="10.0" :min="0.01"></el-input-number>
                        <label>折商品都适用</label>
                        <span style="font-size: 13px;color: #828282;line-height: 1;padding-left: 10px;">注意：折扣范围0.01-10.00，最低折扣不能大于最高折扣</span>
                      </div>
                    </el-form-item>
                  </div>
                </template>
                <!-- 微盟渠道-->
                <template v-if="item.channelType == 9">
                  <el-form-item label="微盟渠道" prop="" :key="index">
                    <el-switch v-model="item.openStatus"> </el-switch>
                  </el-form-item>
                  <div class="form-child margin-20" v-if="item.openStatus == true" :key="index">
                    <el-form-item label="选择店铺">
                      <el-select v-model="item.channelRelationStoreType" placeholder="请选择">
                        <el-option v-for="item in wMShopOption" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="微盟商品" class="padding-0">
                      <el-select v-model="item.channelRelationProType" placeholder="请选择">
                        <el-option v-for="item in wMGoodOption" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="折扣控制" prop="region" class="input-margin-b">
                      <div class="radio-cell">
                        <el-radio v-model="item.integralUseDiscountControl" label="1">所有折扣商品都适用</el-radio>
                      </div>
                      <div class="radio-cell margin-20">
                        <el-radio v-model="item.integralUseDiscountControl" label="2">折扣</el-radio>
                        <el-input-number v-model="item.integralUseDiscountControlLower" :precision="2" :controls="false" :max="10.0" :min="0.01"></el-input-number>
                        <label>至</label>
                        <el-input-number v-model="item.integralUseDiscountControlUpper" :precision="2" :controls="false" :max="10.0" :min="0.01"></el-input-number>
                        <label>折商品都适用</label>
                        <span style="font-size: 13px;color: #828282;line-height: 1;padding-left: 10px;">注意：折扣范围0.01-10.00，最低折扣不能大于最高折扣</span>
                      </div>
                    </el-form-item>
                  </div>
                </template>
              </template>

              <el-form-item label="适用对象" prop="" class="margin-20">
                <el-select v-model="ruleForm.useCrowd" placeholder="请选择">
                  <el-option v-for="item in applyObjOption" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="人群定向" v-if="ruleForm.useCrowd == 2" prop="" class="padding-0">
                <el-button style="width: 214px;" @click="showPeople">已设置{{ selectCount }}项筛选</el-button>
              </el-form-item>
              <el-form-item label="获取规则" prop="">
                <div>
                  <el-radio v-model="ruleForm.integralGetStatus" label="1">每消费</el-radio>
                  <el-input-number v-model="ruleForm.integralGet.fee" :precision="1" :controls="false" :max="10000.0" :min="0.1"></el-input-number>
                  <label>元，获取 </label>
                  <!-- <el-input v-model="ruleForm.integralGet.integral" @blur="formatInputNumBlur($event)"></el-input> -->
                  <el-input-number v-model="ruleForm.integralGet.integral" :precision="1" :controls="false" :max="10000.0" :min="0.1"></el-input-number>
                  <label>积分。取整策略为</label>
                  <el-select v-model="ruleForm.integralGetStrategy" placeholder="请选择">
                    <el-option v-for="item in cateOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                  </el-select>
                </div>
                <div>
                  <el-radio v-model="ruleForm.integralGetStatus" label="0" class="margin-20">不获取积分</el-radio>
                </div>
              </el-form-item>
              <el-form-item label="积分冻结期" v-if="ruleForm.integralGetStatus == 1"> <el-input v-model="ruleForm.integralGetFreezeDays" @keyup.native="formatInputNum($event)"></el-input><label>天</label> </el-form-item>
              <el-form-item label="积分有效期" v-if="ruleForm.integralGetStatus == 1"> <el-input v-model="ruleForm.integralGetEffectiveDays" @keyup.native="formatInputNum($event)"></el-input><label>天</label> </el-form-item>
              <el-form-item>
                <el-button :disabled="tpnEditBool" type="primary" @click="submitForm('ruleForm')">保 存</el-button>
                <el-button @click="goBack">返 回</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
    <!-- 添加商品 -->
    <add-goods :goodShow="goodShow" :projectName="repProjectName" @selectGoods="selectGoods"></add-goods>
    <!-- 人群筛选器的弹框 -->
    <el-dialog title="自定义人群" :visible.sync="dialogVisiblePeople" width="980px">
      <div class="select-people">
        <vue-gic-group-people :useId="useId" :hasSearchData="hasSearchData" :sceneValue="sceneValue" ref="peopleFilter" @findFilter="findFilter" @getBackData="getBackData" @editHide="editHide" @editShow="editShow" @hideBtn="hideBtn"></vue-gic-group-people>
        <div v-show="toggleTag" class="people-btn-wrap">
          <el-row>
            <el-button @click="getData" type="primary" size="small">确定</el-button>
            <el-button @click="cancelFilter" size="small">取消</el-button>
          </el-row>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-row>
          <el-button @click="dialogVisiblePeople = false">取 消</el-button>
          <el-button type="primary" @click="getPeopleData">确 定</el-button>
        </el-row>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import topNavNew from 'components/nav/navNew';
import addGoods from 'components/memberShip/add-goods';
import Treeselect from '@riophae/vue-treeselect';
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css';

import showMsg from '@/common/js/showmsg';
import errMsg from '@/common/js/error';
import { postRequest, postJson } from '@/api/api';
import strLength from '@/common/js/strlen';
import { log } from '@/utils/index.js';

export default {
  name: 'addPointSytem',
  data() {
    return {
      repProjectName: 'gic-clique',
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
          path: '/pointSystem'
        },
        {
          name: '添加积分获取策略',
          path: ''
        }
      ],
      // 添加商品弹窗
      goodShow: false,
      // 输入字限制
      inputFlagNum: 20,

      // 门店
      StoreOptions: [
        {
          label: '所有门店',
          value: '1'
        },
        {
          label: '门店分组',
          value: '2'
        },
        {
          label: '部分门店',
          value: '3'
        }
      ],
      StoreTypeOptions: [
        {
          label: '所有门店',
          value: '-1'
        },
        {
          label: '自营',
          value: '0'
        },
        {
          label: '联营',
          value: '1'
        },
        {
          label: '加盟',
          value: '2'
        },
        {
          label: '代销',
          value: '3'
        },
        {
          label: '托管',
          value: '4'
        }
      ],
      applyGoods: [
        {
          label: '所有商品',
          value: '1'
        }
        // {
        //   label: '按商品品牌',
        //   value: '2',
        // },
        // {
        //   label: '按商品品类',
        //   value: '3',
        // },
        // {
        //   label: '按单件商品',
        //   value: '4',
        // },
      ],
      // tree
      openOnFocus: true,
      alwaysOpen: false,
      goodsOpen: false,
      wxOpen: false,
      valueConsistsOf: 'ALL',
      treeOptions: [],
      storeNormalizer(node) {
        return {
          id: node.storeGroupId,
          label: node.storeGroupName,
          children: node.children
        };
      },

      // 门店列表
      storeListOptions: [],
      // 适用商品
      goodsTreeOptions: [],

      // wxTreeOptions
      wxTreeOptions: [],
      // 第三方下拉
      allShopOption: [
        {
          label: '所有店铺', // 就是所有门店
          value: '1'
        }
      ],
      allGoodOption: [
        {
          label: '所有商品',
          value: '1'
        }
      ],
      // 微盟渠道
      wMShopOption: [
        {
          label: '所有店铺', // 就是所有门店
          value: '1'
        }
      ],
      wMGoodOption: [
        {
          label: '所有商品',
          value: '1'
        }
      ],
      // 商户
      mechantOption: [],
      // 适用对象
      applyObjOption: [
        {
          label: '所有会员',
          value: '1'
        },
        {
          label: '自定义人群',
          value: '2'
        }
      ],
      // 长度
      cateNameLength: 0,

      ruleForm: {
        // 积分获取规则
        integralStrategyId: '', //策略id
        enterpriseId: '',
        strategyName: '', //策略名称
        strategyType: 1, // 策略类型 1消费积分 2积分抵现
        useCrowd: '1', // 策略类型 1所有 2人群筛选
        crowdJson: '', //人群筛选器内容
        integralGetStatus: '1', // 积分获取开启 1是0否
        integralGet: { fee: 1, integral: 1 },
        integralGetStrategy: '1', // 取整策略 1四舍五入 2抹零 3向上取整
        integralGetFreezeDays: 1, // 获取积分冻结天数
        integralGetEffectiveDays: 1, // 获取积分有效天
        integralUseStatus: '0', // 积分抵现开启 1是0否
        integralUse: null, // 积分抵现 {fee:5,integral:5}
        channelList: [
          {
            integralStrategyChannelId: '', //id
            enterpriseId: '',
            integralStrategyId: '', //策略id
            channelType: '3', //渠道类型 1微信 3:线下 5淘宝 6京东 7唯品会 8天猫
            openStatus: true, //渠道配置是否启用 1启用 0停用
            channelRelationEnterpriseType: '1', // 策略关联企业 1所有企业 2部分企业
            channelRelationStoreType: '1', //策略关联门店类型 1所有门店 2门店分组 3部分门店
            channelStoreType: '-1', // 策略选择门店类型 （-1:所有 0:自营 1:联营 2:加盟,3代销4托管）
            channelRelationProType: '1', // 策略关联商品类型 1所有商品 2商品品牌 3商品类目 4部分商品
            integralUseDiscountControl: '1', // 折扣控制 1所有折扣商品适用 2折扣范围
            integralUseDiscountControlUpper: '0.0',
            integralUseDiscountControlLower: '0.0',
            useProportionalRestriction: '0.0', // 抵现比例限制
            strategyGoodsRelationIdArr: [], // 商品
            storeRelationIdArr: [], //门店
            enterpriseRelationIdArr: [] //商户
          },
          {
            integralStrategyChannelId: '', //id
            enterpriseId: '',
            integralStrategyId: '', //策略id
            channelType: '1', //渠道类型 1微信 3:线下 5淘宝 6京东 7唯品会 8天猫
            openStatus: true, //渠道配置是否启用 1启用 0停用
            channelRelationEnterpriseType: '1', // 策略关联企业 1所有企业 2部分企业
            channelRelationStoreType: '1', //策略关联门店类型 1所有门店 2门店分组 3部分门店
            channelStoreType: '-1', // 策略选择门店类型 （-1:所有 0:自营 1:联营 2:加盟,3代销4托管）
            channelRelationProType: '1', // 策略关联商品类型 1所有商品 2商品品牌 3商品类目 4部分商品
            integralUseDiscountControl: '1', // 折扣控制 1所有折扣商品适用 2折扣范围
            integralUseDiscountControlUpper: '0.0',
            integralUseDiscountControlLower: '0.0',
            useProportionalRestriction: '0.0', // 抵现比例限制
            goodsRelationIdArr: [], // 复制的商品
            strategyGoodsRelationIdArr: [], // 商品
            storeRelationIdArr: [], //门店
            enterpriseRelationIdArr: [] //商户
          },
          {
            integralStrategyChannelId: '', //id
            enterpriseId: '',
            integralStrategyId: '', //策略id
            channelType: '8', //渠道类型 1微信 3:线下 5淘宝 6京东 7唯品会 8天猫
            openStatus: true, //渠道配置是否启用 1启用 0停用
            channelRelationEnterpriseType: '1', // 策略关联企业 1所有企业 2部分企业
            channelRelationStoreType: '1', //策略关联门店类型 1所有门店 2门店分组 3部分门店
            channelStoreType: '-1', // 策略选择门店类型 （-1:所有 0:自营 1:联营 2:加盟,3代销4托管）
            channelRelationProType: '1', // 策略关联商品类型 1所有商品 2商品品牌 3商品类目 4部分商品
            integralUseDiscountControl: '1', // 折扣控制 1所有折扣商品适用 2折扣范围
            integralUseDiscountControlUpper: '0.0',
            integralUseDiscountControlLower: '0.0',
            useProportionalRestriction: '0.0', // 抵现比例限制
            strategyGoodsRelationIdArr: [], // 商品
            storeRelationIdArr: [], //门店
            enterpriseRelationIdArr: [] //商户
          },
          {
            integralStrategyChannelId: '', //id
            enterpriseId: '',
            integralStrategyId: '', //策略id
            channelType: '9', //渠道类型 1微信 3:线下 5淘宝 6京东 7唯品会 8天猫
            openStatus: true, //渠道配置是否启用 1启用 0停用
            channelRelationEnterpriseType: '1', // 策略关联企业 1所有企业 2部分企业
            channelRelationStoreType: '1', //策略关联门店类型 1所有门店 2门店分组 3部分门店
            channelStoreType: '-1', // 策略选择门店类型 （-1:所有 0:自营 1:联营 2:加盟,3代销4托管）
            channelRelationProType: '1', // 策略关联商品类型 1所有商品 2商品品牌 3商品类目 4部分商品
            integralUseDiscountControl: '1', // 折扣控制 1所有折扣商品适用 2折扣范围
            integralUseDiscountControlUpper: '0.0',
            integralUseDiscountControlLower: '0.0',
            useProportionalRestriction: '0.0', // 抵现比例限制
            strategyGoodsRelationIdArr: [], // 商品
            storeRelationIdArr: [], //门店
            enterpriseRelationIdArr: [] //商户
          }
        ]
      },
      cateOptions: [
        {
          value: '1',
          label: '四舍五入'
        },
        {
          value: '2',
          label: '抹零'
        },
        {
          value: '3',
          label: '进位制'
        }
      ],
      // 门店  新
      uuid: '', // 新增传空，编辑必传,
      options: [0, 1, 2, 3, 4, 5], // 0 全部 1 门店类型 2门店标签 3 门店区域 4 门店分组 5 部分门店
      isAdd: true,
      scencs: 'integral',

      /* 人群筛选器 */
      dialogVisiblePeople: false,
      sceneValue: 'member', // 场景值
      useId: '',
      searchParams: '',
      hasSearchData: '', // 当前页回显的数据(接口返回)
      toggleTag: false,
      selectCount: 0,
      // 太平鸟标识
      tpnEditBool: false,
      tpnEnterpriseId: 'ff808081671d3ceb01672adebf4e6149'
    };
  },

  methods: {
    // 返回
    goBack() {
      this.$router.go(-1);
    },

    // 路由跳转
    changeRoute(route) {
      this.$router.push(route);
    },

    // input focus
    inputFocus(obj) {
      let that = this;
      that.tempData = obj;
    },
    formatInputNum(e) {
      let that = this;
      that.ruleForm.integralGetEffectiveDays = strLength.getCharVal(String(that.ruleForm.integralGetEffectiveDays).replace(/[^\d]/g, ''), 4);
      that.ruleForm.integralGetFreezeDays = strLength.getCharVal(String(that.ruleForm.integralGetFreezeDays).replace(/[^\d]/g, ''), 4);

      // that.ruleForm.integralGet.fee = strLength.getCharVal(String(that.ruleForm.integralGet.fee).replace(/[^\.\d]/g,''),6)
      that.ruleForm.integralGet.integral = strLength.getCharVal(String(that.ruleForm.integralGet.integral).replace(/[^\d]/g, ''), 8);
    },

    async checkListValue(data) {
      let obj = {
        flag: true,
        text: ''
      };
      if (!!data.channelList.length) {
        for (let i = 0; i < data.channelList.length; i++) {
          if (!!data.channelList[i].openStatus) {
            if (!!data.channelList[i].openStatus && data.channelList[i].integralUseDiscountControl == 2) {
              if (!data.channelList[i].integralUseDiscountControlUpper || !data.channelList[i].integralUseDiscountControlLower) {
                obj.flag = false;
                obj.text = '请填写折扣';
              }
              if (parseInt(data.channelList[i].integralUseDiscountControlUpper) > 10 || parseInt(data.channelList[i].integralUseDiscountControlLower) > 10 || Number(data.channelList[i].integralUseDiscountControlUpper) <= Number(data.channelList[i].integralUseDiscountControlLower)) {
                obj.flag = false;
                obj.text = '折扣格式有误';
              }
            }
            if (data.channelList[i].channelType == 1 && !data.channelList[i].enterpriseRelationIdArr.length) {
              obj.flag = false;
              obj.text = '请选择商户';
            }
            if (data.channelList[i].channelType == 3) {
              const storeGroupDom = this.$refs.storeGroup;
              let flag = null;
              if (storeGroupDom instanceof Array) {
                flag = await this.$refs.storeGroup[0].isStoreSave();
              } else {
                flag = await this.$refs.storeGroup.isStoreSave();
              }
              if (!flag) {
                obj.flag = false;
                obj.text = '请选择门店';
              }
            }
          }
        }
      }
      return obj;
    },

    // 保存
    submitForm(formName) {
      let that = this;
      if (!that.tpnEditBool) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            // 处理数据
            let data = JSON.parse(JSON.stringify(that.ruleForm));
            if (!data.strategyName) {
              showMsg.showmsg('请填写策略名称', 'error');
              return;
            }
            let flag = !data.integralGet.fee || String(data.integralGet.integral) == '';
            if (data.integralGetStatus == 1 && flag) {
              showMsg.showmsg('请填写获取规则', 'error');
              return;
            }
            if (data.integralGetStatus == 1) {
              if (!Number(data.integralGet.fee)) {
                showMsg.showmsg('获取规则中的消费金额不能为0', 'error');
                return;
              }
              if (!Number(data.integralGet.integral)) {
                showMsg.showmsg('获取规则中的获取积分不能为0', 'error');
                return;
              }
            }
            if (data.integralGetStatus == 1 && !Number(data.integralGetFreezeDays) && data.integralGetFreezeDays != '0') {
              showMsg.showmsg('请填写积分冻结期', 'error');
              return;
            }
            if (data.integralGetStatus == 1 && !Number(data.integralGetEffectiveDays)) {
              showMsg.showmsg('请填写积分有效期', 'error');
              return;
            }
            that.checkListValue(data).then(res => {
              if (!res.flag) {
                showMsg.showmsg(res.text, 'error');
                return;
              } else {
                // 自定义人群
                if (data.useCrowd == 2 && this.selectCount < 1) {
                  showMsg.showmsg('请选择人群定向', 'error');
                  return;
                }
                // 设置开启状态 1-->true
                data.channelList.forEach(function(ele, index) {
                  ele.openStatus = ele.openStatus == true ? 1 : 0;
                  if (ele.channelType == 1) {
                    ele.strategyGoodsRelationIdArr = ele.goodsRelationIdArr;
                    delete ele.goodsRelationIdArr;
                  }
                  if (!ele.enterpriseRelationIdArr || !ele.enterpriseRelationIdArr.length) {
                    ele.enterpriseRelationIdArr = [];
                  }
                  if (!ele.storeRelationIdArr || !ele.storeRelationIdArr.length) {
                    ele.storeRelationIdArr = [];
                  }
                  if (!ele.strategyGoodsRelationIdArr || !ele.strategyGoodsRelationIdArr.length) {
                    ele.strategyGoodsRelationIdArr = [];
                  }
                  if (ele.channelType == '3') {
                    ele.channelRelationStoreType = '1';
                    ele.channelStoreType = '-1';
                    ele.storeControlId = that.uuid;
                  }
                });
                data.integralGet.fee = parseInt(data.integralGet.fee * 10);
                data.integralGet.integral = parseInt(data.integralGet.integral * 10);
                data.integralGet = JSON.stringify(data.integralGet);
                that.saveForm(data);
              }
            });
          } else {
            log('error submit!!');
            return false;
          }
        });
      }
    },

    // 保存数据
    saveForm(data) {
      let that = this;
      let para = data;
      postJson('/api-admin/save-member-integral-strategy', para)
        .then(res => {
          log(res.data.result);
          let resData = res.data;
          if (resData.errorCode == 0) {
            that.$message({
              message: '保存成功',
              type: 'success'
            });
            that.changeRoute('/pointSystem');
            return;
          }
          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          log(error);
        });
    },

    // 更新数据
    updateData() {
      let that = this;
      // that.ruleForm.integralGet = JSON.parse(that.ruleForm.integralGet)
      that.ruleForm.integralGet.fee = parseInt(that.ruleForm.integralGet.fee / 10);
      that.ruleForm.integralGet.integral = parseInt(that.ruleForm.integralGet.integral / 10);
    },

    // 树形结构
    toggle(flag) {
      let that = this;
      that.treeFlag = flag;
      if (flag == 'store') {
        that.alwaysOpen = true;
        log(that.alwaysOpen);
      }
      if (flag == 'brand') {
        that.goodsOpen = true;
      }
      if (flag == 'wx') {
        that.wxOpen = true;
      }
      document.addEventListener('click', that.hidePanel, false);
    },

    hidePanel(e) {
      let that = this;
      log(that.$refs.treeinput, e.target.className);
      if (typeof e.target.className == 'object') {
        return;
      }
      let tag =
        e.target.className != 'span-txt' &&
        e.target.className != 'vue-treeselect__list' &&
        e.target.className != 'vue-treeselect__label' &&
        !e.target.className.includes('vue-treeselect__list-item vue-treeselect__indent-level') &&
        e.target.className != 'vue-treeselect__minus-mark' &&
        e.target.className != 'vue-treeselect__option' &&
        e.target.className != 'vue-treeselect__option vue-treeselect__option--highlight' &&
        !e.target.className.includes('vue-treeselect__checkbox vue-treeselect__checkbox--') &&
        e.target.className != 'vue-treeselect__option-arrow-placeholder' &&
        e.target.className != 'el-form demo-ruleForm' &&
        e.target.className != 'vue-treeselect__option vue-treeselect__option--selected vue-treeselect__option--highlight' &&
        e.target.className != 'vue-treeselect__list-item vue-treeselect__indent-level-1' &&
        e.target.className != 'vue-treeselect__list-item vue-treeselect__indent-level-0' &&
        e.target.className != 'vue-treeselect__checkbox-container' &&
        e.target.className != 'vue-treeselect__option-arrow-container' &&
        e.target.className != 'vue-treeselect__option-arrow vue-treeselect__option-arrow--rotated';
      log(tag);
      if (tag) {
        if (that.treeFlag == 'store') {
          that.alwaysOpen = false;
        }
        if (that.treeFlag == 'brand') {
          that.goodsOpen = false;
        }
        if (that.treeFlag == 'wx') {
          that.wxOpen = false;
        }
      }
    },

    // 搜索后出现下拉列表
    // 点击
    searchFocus(index, item) {
      log(index, item);
    },
    // 搜索
    remoteMethod(query) {
      let that = this;
      log('query:', query);

      if (query !== '') {
        // 获取搜索列表数据
        that.getStoreList(query);
      } else {
        that.storeListOptions = [];
      }
    },

    // 选择节点的方法
    selectStore(e, item) {
      log(e);
    },

    // 获取门店列表
    getStoreList(query) {
      let that = this;
      log(query);
      let para = {
        searchParam: query,
        flag: null,
        requestProject: that.repProjectName
      };

      postRequest('/api-plug/query-store-by-code-name', para)
        .then(res => {
          log(res, res.data, res.data.errorCode);
          let resData = res.data;
          if (resData.errorCode == 0) {
            resData.result.forEach(function(ele, index) {
              ele.id = ele.storeId;
              ele.value = ele.storeName;
              ele.key = ele.storeId;
            });
            that.storeListOptions = resData.result;
            return;
          }

          that.$message.error({
            duration: 1000,
            message: resData.message
          });
        })
        .catch(function(error) {
          log(error);
          // that.toLogin()
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    // 获取门店分组
    getStoreGroup() {
      let that = this;
      let para = {};

      postRequest('/api-admin/get-clique-storegroup', para)
        .then(res => {
          log(res.data.result);
          let resData = res.data;
          if (resData.errorCode == 0) {
            that.treeOptions = resData.result;
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

    // 输入
    toInput: function(value) {
      let that = this;
      let temp = strLength.getByteVal(value.target.value, that.inputFlagNum);
      that.ruleForm.strategyName = temp.trim();
      that.cateNameLength = strLength.getZhLen(that.ruleForm.strategyName);
    },
    selStore(e, index, item) {
      item.storeRelationIdArr = [];
    },

    // 微信
    selectWx(e, index, item) {
      let that = this;
      item.strategyGoodsRelationIds = item.goodsRelationIds;
      let data = that.ruleForm.channelList[index];
      data.strategyGoodsRelationIds = [];
      data.goodsRelationIds.forEach(function(ele, index) {
        data.strategyGoodsRelationIds.push(ele);
      });
    },
    // 线下渠道选择商品类别
    changeGood(e) {
      let that = this;
      log('线下渠道选择商品类别:', e);
      if (e == 2) {
        that.getGoodsBrand();
      }
      if (e == 3) {
        that.getGoodsCategory();
      }
    },

    // 获取商品品牌
    getGoodsBrand() {
      let that = this;
      let para = {};
      postRequest('/api-admin/', para)
        .then(res => {
          log(res.data.result);
          let resData = res.data;
          if (resData.errorCode == 0) {
            let data = resData.result;
            that.goodsTreeOptions = data;
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

    // 获取商品分类
    getGoodsCategory() {
      let that = this;
      let para = {};
      postRequest('/api-admin/', para)
        .then(res => {
          log(res.data.result);
          let resData = res.data;
          if (resData.errorCode == 0) {
            let data = resData.result;
            that.goodsTreeOptions = data;
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

    // 子组件显示方法
    showGoodsDialog() {
      let that = this;
      log('show');
      that.goodShow = true;
    },

    // 子组件触发方法
    selectGoods(val) {
      let that = this;
      log(val);
      that.goodShow = false;
    },

    // 获取商户列表
    getCliqueInfo() {
      let that = this;
      let para = {};
      postRequest('/api-admin/list-enterprise', para)
        .then(res => {
          log(res.data);
          let resData = res.data;
          if (resData.errorCode == 0) {
            let data = resData.result.listEnterprise;
            data.forEach(function(ele, index) {
              ele.label = ele.brandName;
              ele.value = ele.enterpriseId;
            });
            that.mechantOption = data;
            log('商户列表:', that.mechantOption);
            // showMsg.showmsg('设置成功','success')

            that.ruleForm.channelList[0].enterpriseRelationIdArr = [data[0].enterpriseId];
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
    // 选择人群筛选器
    showPeople() {
      this.dialogVisiblePeople = true;
    },
    /* 人群筛选器 start */
    getData() {
      // 父组件调用子组件方法,触发父组件事件
      this.$refs.peopleFilter.confirmSet();
    },
    findFilter(value) {
      // 子组件触发父组件事件,返回过滤条件数据
      log(value);
      this.ruleForm.crowdJson = value;
      this.searchParams = value;
      if (this.ruleForm.crowdJson) {
        let arr = JSON.parse(this.ruleForm.crowdJson);
        this.selectCount = 0;
        if (arr.list) {
          arr.list.forEach(item => {
            this.selectCount += item.list.length;
          });
        }
      }
    },
    cancelFilter() {
      this.$refs.peopleFilter.cancelSet();
    },
    getBackData(val) {
      // log(val);
      this.ruleForm.selectorParams = val;
    },
    // 隐藏保存按钮和确认按钮  (子组件会调用)
    hideBtn() {
      let that = this;
      that.toggleTag = false;
    },
    // 显示编辑,保存按钮隐藏,确认按钮显示 (子组件会调用)
    editShow() {
      this.toggleTag = true;
    },
    editHide() {
      this.toggleTag = false;
    },
    getPeopleData() {
      // 筛选器 弹框的确认按钮
      let that = this;
      that.$refs.peopleFilter.confirmSet();
      setTimeout(_ => {
        if (that.searchParams) {
          that.lsSaveBtn(that.searchParams);
        }
      }, 500);
    },
    // 人群筛选器弹框的确定按钮  临时保存
    lsSaveBtn(searchParams) {
      postRequest('/api-admin/get-screen-detail-param', {
        requestProject: this.repProjectName,
        tempBusinessId: this.tempBusinessId ? this.tempBusinessId : '',
        detailParams: searchParams
      })
        .then(res => {
          if (res.data.errorCode == 0) {
            this.tempBusinessId = res.data.result;
            this.useId = res.data.result;
            this.dialogVisiblePeople = false;
            this.searchParams = '';
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          log(err);
        });
    },
    /* end */
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
    Treeselect,
    addGoods
  },
  created() {
    // this.selectReplayStyle()
    log('create');
  },
  beforeMount() {
    log('beforeMount');
  },
  mounted() {
    let that = this;
    // 获取商户列表
    that.getCliqueInfo();

    // 获取门店分组
    that.getStoreGroup();
    that.getLoginInfo();
  }
};
</script>
<style lang="scss" scoped>
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

  .vue-treeselect {
    display: inline-block;
    vertical-align: top;
    width: 300px;
  }
  .attention-content-wrap {
  }
}

.form-wrap {
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
    color: #ccc;
    font-size: 12px;
  }

  .el-select {
    vertical-align: top;
  }

  .span-txt {
    position: absolute;
    z-index: 2;
    width: 300px;
    text-align: center;
  }

  .padding-0 {
    padding: 0;
  }

  .form-child {
    padding: 15px 20px 10px 0px;
    background: #f5f6f9;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .margin-20 {
    margin-top: 20px;
  }

  .tinymce-wrap {
    width: 780px;
  }
}

/*树形*/
.vue-treeselect /deep/ {
  /deep/ .vue-treeselect__control {
    height: 30px;
    /*line-height: 36px;*/
    cursor: pointer;
  }

  .vue-treeselect__placeholder {
    line-height: 30px;
    font-size: 12px;
  }

  .vue-treeselect__multi-value-item-container,
  .vue-treeselect__multi-value {
    line-height: 1;
    height: 0;
    opacity: 0;
  }

  span.vue-treeselect__multi-value-label {
    line-height: 1;
  }

  .vue-treeselect__multi-value-item {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    background-color: #f0f2f5;
    color: #909399;
  }

  .vue-treeselect__value-remove {
    color: #909399;
  }

  &:not(.vue-treeselect--disabled) .vue-treeselect__multi-value-item:not(.vue-treeselect__multi-value-item-disabled):hover {
    background-color: #f0f2f5;
    color: #909399;
  }

  .vue-treeselect--searchable:not(.vue-treeselect--disabled) .vue-treeselect__value-container {
    cursor: pointer;
  }

  .vue-treeselect__x-container {
    display: none;
  }

  .vue-treeselect__control-arrow {
    display: none;
  }

  .vue-treeselect__control-arrow-container {
    position: relative;
  }
  /deep/ .vue-treeselect__value-container {
    line-height: 30px;
  }

  /deep/.vue-treeselect__control-arrow-container:after,
  .vue-treeselect__control-arrow-container:before {
    border: 6px solid transparent;
    border-left: 6px solid #fff;
    width: 0;
    height: 0;
    position: absolute;
    top: 49%;
    left: 50%;
    margin-left: -6px;
    content: ' ';
    margin-top: -3px;
    -webkit-transform: rotate(90deg);
    -moz-transform: rotate(90deg);
    -o-transform: rotate(90deg);
    transform: rotate(90deg);
    -webkit-transition: -webkit-transform 0.3s;
    transition: -webkit-transform 0.3s;
    transition: transform 0.3s;
    transition: transform 0.3s, -webkit-transform 0.3s;
    transition: transform 0.3s, -webkit-transform 0.3s;
  }

  /deep/ .vue-treeselect__control-arrow-container:before {
    border-left-color: #c0c4cc;
    top: 52%;
  }

  &.vue-treeselect--focused .vue-treeselect__control-arrow-container:after,
  &.vue-treeselect--focused .vue-treeselect__control-arrow-container:before {
    margin-top: -6px;
    -webkit-transform: rotateZ(-90deg);
    -moz-transform: rotateZ(-90deg);
    -o-transform: rotateZ(-90deg);
    transform: rotateZ(-90deg);
    -webkit-transition: -webkit-transform 0.3s;
    transition: -webkit-transform 0.3s;
    transition: transform 0.3s;
    transition: transform 0.3s, -webkit-transform 0.3s;
    transition: transform 0.3s, -webkit-transform 0.3s;
  }

  &.vue-treeselect--focused .vue-treeselect__control-arrow-container:before {
    border-left-color: #c0c4cc;
    top: 47%;
  }

  .vue-treeselect--has-value .vue-treeselect__multi-value {
    margin-bottom: 0;
  }
}
/*人群筛选器*/
.select-people {
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
}
.select-people /deep/ .marginLeft134 {
  margin-left: 80px;
}
.select-people /deep/ .filter-content .member-templates-condition-title {
  text-align: left;
  font-size: 14px;
  line-height: 24px;
}
.select-people /deep/ .filter-content {
  margin-top: 0;
}
.people-btn-wrap {
  width: 100%;
  background: #f2f3f4;
  box-sizing: border-box;
  padding: 0 0 24px 100px;
}
.select-people /deep/ .detail {
  margin-top: 0;
}
</style>
