<template>
  <div class="right-wrap">
    <topNav></topNav>
    <div class="right-content">
      <div class="right-box">
        <h3 class="big-title title">归属佣金结算规则</h3>
        <el-form :model="settleRuleDTO" ref="ruleForm" label-width="200px" class="demo-ruleForm">
          <el-form-item label="服务门店归属佣金结算规则">
            <label slot="label"
              >服务门店归属佣金结算规则
              <el-popover placement="top" width="190" trigger="hover" content="消费会员的服务门店的佣金规则配置">
                <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
              </el-popover>
            </label>
            <el-switch v-model="settleRuleDTO.serviceStoreCommissionSettle"></el-switch>
          </el-form-item>
          <div class="form-child" v-if="settleRuleDTO.serviceStoreCommissionSettle">
            <el-form-item label="导购分享约束">
              <label slot="label"
                >导购分享约束
                <el-popover placement="top" width="190" trigger="hover" content="如果开启，当订单的分享者为导购时（通过分享者的手机号和导购手机号做匹配识别），将不执行该项佣金的结算。">
                  <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
                </el-popover>
              </label>
              <el-switch v-model="settleRuleDTO.serviceStoreGuideShareConstraint"></el-switch>
            </el-form-item>
            <el-form-item label="付费会员分销约束">
              <label slot="label"
                >付费会员分销约束
                <el-popover placement="top" width="190" trigger="hover" content="如果开启，下单的付费会员为导购发展的下级时，将不执行该项佣金的结算。">
                  <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
                </el-popover>
              </label>
              <el-switch v-model="settleRuleDTO.serviceStorePayMemberDistributionConstraint"></el-switch>
            </el-form-item>
          </div>
          <el-form-item label="开卡门店归属佣金结算规则" label-width="200px">
            <label slot="label"
              >开卡门店归属佣金结算规则
              <el-popover placement="top" width="190" trigger="hover" content="消费会员的开卡门店的佣金规则配置">
                <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
              </el-popover>
            </label>
            <el-switch v-model="settleRuleDTO.openStoreCommissionSettle"></el-switch>
          </el-form-item>
          <div class="form-child" v-if="settleRuleDTO.openStoreCommissionSettle">
            <el-form-item label="导购分享约束">
              <label slot="label"
                >导购分享约束
                <el-popover placement="top" width="190" trigger="hover" content="如果开启，当订单的分享者为导购时（通过分享者的手机号和导购手机号做匹配识别），将不执行该项佣金的结算。">
                  <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
                </el-popover>
              </label>
              <el-switch v-model="settleRuleDTO.openStoreGuideShareConstraint"></el-switch>
            </el-form-item>
            <el-form-item label="付费会员分销约束">
              <label slot="label"
                >付费会员分销约束
                <el-popover placement="top" width="190" trigger="hover" content="如果开启，下单的付费会员为导购发展的下级时，将不执行该项佣金的结算。">
                  <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
                </el-popover>
              </label>
              <el-switch v-model="settleRuleDTO.openStorePayMemberDistributionConstraint"></el-switch>
            </el-form-item>
            <el-form-item class="check-wrap">
              <el-checkbox v-model="settleRuleDTO.whenNoServiceStore" label="0"
                >仅当会员无服务门店时生效。<el-popover placement="top" width="190" trigger="hover" content="当该订单的消费会员有服务门店时，开卡门店不获得佣金。">
                  <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
                </el-popover>
              </el-checkbox>
              <br />
              <el-checkbox v-model="settleRuleDTO.whenServiceEqualOpenStore" label="1"
                >当开卡门店与服务门店相同时，不生效。<el-popover placement="top" width="190" trigger="hover" content="当开卡门店和服务门店为同一家门店时，开卡门店不获得佣金。">
                  <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
                </el-popover>
              </el-checkbox>
            </el-form-item>
          </div>
          <el-form-item>
            <el-button type="primary" @click="belongRuleSave">保 存</el-button>
          </el-form-item>
        </el-form>
        <h3 class="title">
          商户结算品牌
          <el-popover placement="top" width="190" trigger="hover" content="可配置商户结算品牌，一个商户可以结算多个商品品牌，一个商品品牌只能被一个商户结算">
            <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
          </el-popover>
        </h3>
        <div class="table-wrap">
          <el-table :data="enterpriseBrandList" class="table-no-line-wrap" style="width: 100%" v-loading="loading">
            <el-table-column prop="enterpriseName" label="商户名称" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="settlementBrandName" label="结算品牌" show-overflow-tooltip>
              <template slot-scope="scoped">
                {{ scoped.row.settlementBrandName ? scoped.row.settlementBrandName : '--' }}
              </template>
            </el-table-column>
            <el-table-column prop="opr" label="操作" width="100">
              <template slot-scope="scoped">
                <el-button @click="editEnterpriseBrand(scoped.row)" type="text">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- 编辑商户结算品牌 -->
    <el-dialog title="编辑商户结算品牌" :visible.sync="dialogVisible" width="450px">
      <el-form ref="editForm" :model="editForm" label-width="100px">
        <el-form-item label="商户名称">
          <el-input disabled v-model="editForm.enterpriseName"></el-input>
        </el-form-item>
        <el-form-item label="结算品牌">
          <el-popover class="vertical-baseline" placement="bottom-start" width="284" trigger="click" v-model="popoverShow">
            <el-input @keydown.native.enter="getSettlementList('search')" class="search-brand" placeholder="请输入内容" prefix-icon="el-icon-search" v-model="searchBrand" clearable> </el-input>
            <el-checkbox-group v-if="optionsAll.length > 0" class="dm-checkbox-group" v-model="checkedList" @change="selectBrand">
              <label :name="v.value" class="dm-store__type__item" v-for="(v, i) in optionsAll" :key="i">
                <el-checkbox :label="v.outValueId">{{ v.categoryNames }} - {{ v.valueName }}</el-checkbox>
              </label>
            </el-checkbox-group>
            <p v-else class="no-search-belong-data">
              暂无数据
            </p>
            <div class="el-input dm-store__reference" slot="reference">
              <div class="el-input__inner dm-store__inputtag">
                <el-tag v-for="(v, i) in checkedList" size="small" :key="i" closable @close="delItem(v, i)">{{ filterLabel(v) }}</el-tag>
                <span class="gray-color dm-store__inputtag--tips" v-show="checkedList.length === 0">请选择结算品牌</span>
                <!-- <div v-show="!selectBrandBool" class="el-form-item__error">
                  请选择结算品牌
                </div> -->
              </div>
              <el-popover placement="top-start" popper-class="select-shop__popper" width="300" trigger="hover">
                <el-tag v-for="(v, i) in checkedList" class="dm-store__total--tag" size="small" :key="i" closable @close="delItem(v, i)">{{ filterLabel(v) }}</el-tag>
                <span slot="reference" class="dm-store__inputtag--total" v-show="checkedList.length">共{{ checkedList.length }}项</span>
              </el-popover>
            </div>
          </el-popover>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveBrandData">确 定</el-button>
      </div>
    </el-dialog>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>
<script>
import topNav from 'components/nav/nav';
import { postRequest } from '@/api/api';
export default {
  name: 'brokerageRule',
  data() {
    return {
      settleRuleDTO: {
        //归属佣金结算规则
        commissionSettleId: '', // 主键id
        openSms: false, // 短信提醒
        serviceStoreCommissionSettle: false, //服务门店佣金结算规则1:开启 0：关闭
        serviceStoreGuideShareConstraint: false, //服务门店导购分享约束1：约束 0：不约束
        serviceStoreCommissionAmount: 0, //单品佣金额度，单位是%，数值不超过100
        serviceStoreCommissionCap: 0, //单品佣金封顶，单位是元
        openStoreCommissionSettle: false, //开卡门店佣金结算规则1:开启 0：关闭
        openStoreGuideShareConstraint: false, //开卡门店导购分享约束1：约束 0：不约束
        openStoreCommissionAmount: 0, //开卡单品佣金额度，单位是%，数值不超过100
        whenNoServiceStore: [], //仅当会员无服务门店时生效 1：启动 0：不启动
        whenServiceEqualOpenStore: [], //当开卡门店与服务门店相同时，不生效 1：启动 0：不启动
        openStoreCommissionCap: 0, //单品佣金封顶，单位是元
        // 商户结算品牌
        enterpriseBrandList: []
      },
      // 编辑弹框
      dialogVisible: false,
      editForm: {
        enterpriseName: '',
        settlementBrandName: ''
      },
      enterpriseId: '',
      selectBrandBool: true,
      popoverShow: false,
      optionsAll: [],
      optionsAllNew: [],
      checkedList: [],
      searchBrand: '',
      loading: false
    };
  },
  mounted() {
    this.getData();
    this.getEnterpriseList();
  },
  methods: {
    // 获取数据
    getData() {
      let para = {};
      postRequest('/api-admin/get-clique-commission-settle-rule', para)
        .then(res => {
          let data = res.data;
          if (data.errorCode == 0) {
            if (data.result) {
              let settleRuleDTO = data.result;
              settleRuleDTO.serviceStoreCommissionSettle = settleRuleDTO.serviceStoreCommissionSettle == 1 ? true : false;
              settleRuleDTO.serviceStoreGuideShareConstraint = settleRuleDTO.serviceStoreGuideShareConstraint == 1 ? true : false;
              settleRuleDTO.serviceStorePayMemberDistributionConstraint = settleRuleDTO.serviceStorePayMemberDistributionConstraint == 1 ? true : false;
              settleRuleDTO.openStoreCommissionSettle = settleRuleDTO.openStoreCommissionSettle == 1 ? true : false;
              settleRuleDTO.openStoreGuideShareConstraint = settleRuleDTO.openStoreGuideShareConstraint == 1 ? true : false;
              settleRuleDTO.openStorePayMemberDistributionConstraint = settleRuleDTO.openStorePayMemberDistributionConstraint == 1 ? true : false;
              settleRuleDTO.whenNoServiceStore = settleRuleDTO.whenNoServiceStore == 1 ? ['0'] : [];
              settleRuleDTO.whenServiceEqualOpenStore = settleRuleDTO.whenServiceEqualOpenStore == 1 ? ['1'] : [];
              this.settleRuleDTO = settleRuleDTO; // 归属佣金结算规则
            }
          } else {
            this.$message.error(data.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 归属佣金结算规则保存
    belongRuleSave() {
      let para = {
        commissionSettleId: this.settleRuleDTO.commissionSettleId,
        serviceStoreCommissionSettle: this.settleRuleDTO.serviceStoreCommissionSettle ? 1 : 0,
        serviceStoreGuideShareConstraint: this.settleRuleDTO.serviceStoreGuideShareConstraint ? 1 : 0,
        serviceStorePayMemberDistributionConstraint: this.settleRuleDTO.serviceStorePayMemberDistributionConstraint ? 1 : 0,
        openStoreCommissionSettle: this.settleRuleDTO.openStoreCommissionSettle ? 1 : 0,
        openStoreGuideShareConstraint: this.settleRuleDTO.openStoreGuideShareConstraint ? 1 : 0,
        openStorePayMemberDistributionConstraint: this.settleRuleDTO.openStorePayMemberDistributionConstraint ? 1 : 0,
        whenNoServiceStore: this.settleRuleDTO.whenNoServiceStore.length > 0 ? 1 : 0,
        whenServiceEqualOpenStore: this.settleRuleDTO.whenServiceEqualOpenStore.length > 0 ? 1 : 0
      };
      postRequest('/api-admin/save-clique-commission-rule', para)
        .then(res => {
          var data = res.data;
          if (data.errorCode == 0) {
            this.$message.success('保存成功');
          } else {
            this.$message.error(data.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 商户结算品牌列表
    getEnterpriseList() {
      let para = {};
      this.loading = true;
      postRequest('/api-admin/list-clique-enterprise-brand-settle-rule', para)
        .then(res => {
          let data = res.data;
          this.loading = false;
          if (data.errorCode == 0) {
            this.enterpriseBrandList = data.result ? data.result : [];
          } else {
            this.$message.error(data.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 编辑 商户结算品牌
    editEnterpriseBrand(row) {
      this.dialogVisible = true;
      this.enterpriseId = row.enterpriseId;
      this.editForm.enterpriseName = row.enterpriseName;
      this.editForm.settlementBrandName = row.settlementBrandName;
      this.checkedList = row.brandId ? row.brandId.split(',') : [];
      this.getSettlementList();
    },
    // 结算品牌
    getSettlementList(type) {
      let para = {
        enterpriseId: this.enterpriseId,
        brandName: this.searchBrand
      };
      postRequest('/api-admin/list-settlement-brand', para)
        .then(res => {
          let data = res.data;
          if (data.errorCode == 0) {
            this.optionsAll = data.result ? data.result : [];
            if (type != 'search') {
              this.optionsAllNew = data.result ? data.result : [];
            }
          } else {
            this.$message.error(data.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 选中品牌
    selectBrand() {
      this.selectBrandBool = this.checkedList.length > 0 ? true : false;
    },
    filterLabel(val) {
      let result = '';
      this.optionsAllNew.map(v => {
        if (val === v.outValueId) {
          result = v.categoryNames + ' - ' + v.valueName;
        }
      });
      return result;
    },
    // 删除选中的品牌
    delItem(v, i) {
      this.checkedList.splice(i, 1);
      this.selectBrandBool = this.checkedList.length > 0 ? true : false;
    },
    // 编辑 保存
    saveBrandData() {
      // this.selectBrandBool = this.checkedList.length > 0 ? true : false;
      this.selectBrandBool = true; // 新:不必填
      if (this.selectBrandBool) {
        let para = {
          brandId: this.checkedList.join(','),
          enterpriseId: this.enterpriseId
        };
        postRequest('/api-admin/save-clique-enterprise-brand-settle-rule', para)
          .then(res => {
            let data = res.data;
            if (data.errorCode == 0) {
              this.$message.success('保存成功');
              this.dialogVisible = false;
              this.getEnterpriseList();
            } else {
              this.$message.error(data.message);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  },
  components: {
    topNav
  }
};
</script>
<style lang="less" scoped>
.right-box {
  background: #fff;
}
.demo-ruleForm {
  padding: 0 32px;
  .form-child {
    width: 100%;
    padding: 22px 20px 1px 0;
    margin: 22px 0;
    background: #f5f6f9;
    box-sizing: border-box;
  }
}
.title {
  font-size: 16px;
  font-weight: 500;
  padding: 24px 32px;
}
.table-wrap {
  padding: 0 32px 24px;
}
.check-wrap /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #606266;
}
/* 选择结算品牌 */
.dm-store__reference {
  position: relative;
}
.dm-store__inputtag {
  white-space: nowrap;
  overflow: hidden;
  padding: 0 6px;
  line-height: 28px;
  vertical-align: middle;
  .el-tag {
    margin-right: 4px;
  }
}
.dm-store__inputtag--tips {
  padding: 6px;
  font-size: 14px;
}
.gray-color {
  color: #909399;
}
.search-brand {
  margin-bottom: 10px;
}
.dm-checkbox-group {
  max-height: 210px;
  overflow: auto;
}
.dm-store__type__item {
  display: block;
  height: 30px;
  line-height: 30px;
  &:hover {
    background: #f5f7fa;
  }
}
.dm-store__inputtag--total {
  position: absolute;
  top: 2px;
  right: 1px;
  background: #fff;
  border-radius: 4px;
  height: 30px;
  line-height: 30px;
  font-size: 12px;
  padding: 0 6px;
}
.dm-store__total--tag {
  margin: 2px;
}
.no-search-belong-data {
  text-align: center;
  color: #909399;
  font-size: 14px;
  line-height: 20px;
  padding-top: 12px;
}
</style>
