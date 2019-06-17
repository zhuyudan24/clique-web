<template>
  <div class="right-wrap">
    <topNavNew :navpath="navpath"></topNavNew>
    <div class="right-content">
      <div class="right-box">
        <div class="attention-wrap">
          <div class="title">
            <div>会员等级根据从低到高的顺序，自上而下进行排序</div>
            <div class="add-btn"><el-button type="primary" @click="addGrade">新增等级</el-button></div>
          </div>
          <div class="table-wrap">
            <el-table :data="memberTableData" style="width: 100%">
              <el-table-column prop="gradeName" label="会员等级名称"> </el-table-column>
              <el-table-column prop="gradeCode" label="等级编码"> </el-table-column>
              <el-table-column prop="" label="等级类型">
                <template slot-scope="scope">
                  {{ scope.row.gradeType == 1 ? '常规卡' : '特殊卡' }}
                </template>
              </el-table-column>
              <el-table-column prop="" label="移动">
                <template slot-scope="scope">
                  <i :class="['icon-color', 'el-icon-upload2', scope.$index == 0 ? 'disable' : '']" @click="toUp(scope.$index, scope.row, memberTableData)"></i>
                  <i :class="['icon-color', 'el-icon-back', 'icon-to-pre', scope.$index == 0 ? 'disable' : '']" @click="toPre(scope.$index, scope.row, memberTableData)"></i>
                  <i :class="['icon-color', 'el-icon-back', 'icon-to-next', scope.$index == memberTableData.length - 1 ? 'disable' : '']" @click="toNext(scope.$index, scope.row, memberTableData)"></i>
                  <i :class="['icon-color', 'el-icon-download', scope.$index == memberTableData.length - 1 ? 'disable' : '']" @click="toBottom(scope.$index, scope.row, memberTableData)"></i>
                </template>
              </el-table-column>
              <el-table-column prop="" label="操作">
                <template slot-scope="scope">
                  <el-button @click="editGrade(scope.$index, scope.row, memberTableData)" type="text" size="small">
                    编辑
                  </el-button>
                  <el-popover placement="top" width="160" v-model="scope.row.popVisible">
                    <p style="line-height: 1.5; padding: 10px 10px 20px;">确认删除吗？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button size="mini" type="text" @click="cancelPop(scope.$index, scope.row, memberTableData)">取消</el-button>
                      <el-button type="primary" size="mini" @click="delGrade(scope.$index, scope.row, memberTableData)">确定</el-button>
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
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>
<script>
import topNavNew from 'components/nav/navNew';

import showMsg from '@/common/js/showmsg';
import errMsg from '@/common/js/error';
import { getRequest, postRequest } from '@/api/api';
import { log } from '@/utils/index.js';

export default {
  name: 'memberGrade',
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
          path: ''
        }
      ],
      // 商户id
      cliqueId: '',
      cliqueName: '', //商户 name
      memberTableData: []
    };
  },
  mounted() {
    let that = this;
    that.cliqueId = that.$route.query.enterpriseId;
    that.cliqueName = that.$route.query.name;
    that.navpath[3].name = '编辑【' + that.cliqueName + '】会员等级';
    that.getList();
    sessionStorage.removeItem('enterpriseId');
  },
  methods: {
    //获取列表
    getList() {
      let that = this;
      let para = {
        enterpriseId: that.cliqueId
      };
      postRequest('/api-admin/get-enterprise-member-grade-list', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 0) {
            if (!!resData.result.List && !!resData.result.List.length) {
              resData.result.List.forEach(function(ele, index) {
                ele.popVisible = false;
              });
              that.memberTableData = resData.result.List;
            }

            return;
          }
          errMsg.errorMsg(resData);
        })
        .catch(function(error) {});
    },
    // 置顶 先删除后追加首部
    toUp(index, row, obj) {
      let that = this;
      if (index == 0) {
        return;
      }
      log(index, row, obj);
      let newTable = JSON.parse(JSON.stringify(that.memberTableData));

      newTable.splice(index, 1);
      newTable.unshift(row);
      log(newTable);

      // 保存设置
      that.setSort(row.gradeId, 10, that.cliqueId);
      that.memberTableData = newTable;
    },
    // 向上
    toPre(index, row, obj) {
      let that = this;
      if (index == 0) {
        return;
      }
      log(index, row, obj);
      let newTable = JSON.parse(JSON.stringify(that.memberTableData));
      let temp = {};
      temp = newTable[index - 1];
      newTable[index - 1] = row;
      newTable[index] = temp;
      // 保存设置
      that.setSort(row.gradeId, 20, that.cliqueId);
      that.memberTableData = newTable;
    },
    // 向下
    toNext(index, row, obj) {
      let that = this;
      if (index == obj.length - 1) {
        return;
      }
      log(index, row, obj);
      let newTable = JSON.parse(JSON.stringify(that.memberTableData));
      let temp = {};
      temp = newTable[index + 1];
      newTable[index + 1] = row;
      newTable[index] = temp;
      // 保存设置
      that.setSort(row.gradeId, 30, that.cliqueId);
      that.memberTableData = newTable;
    },
    //置底 先删除后追加尾部
    toBottom(index, row, obj) {
      let that = this;
      if (index == obj.length - 1) {
        return;
      }
      log(index, row, obj);

      let newTable = JSON.parse(JSON.stringify(that.memberTableData));

      newTable.splice(index, 1);
      newTable.push(row);
      // 保存设置
      that.setSort(row.gradeId, 40, that.cliqueId);
      that.memberTableData = newTable;
    },

    // 等级排序
    setSort(gradeId, type, enterpriseId) {
      let that = this;
      let para = {
        gradeId: gradeId,
        sortType: type,
        enterpriseId: enterpriseId
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

          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    // 编辑
    editGrade(index, row, obj) {
      this.$router.push({
        path: '/editMemberGrade',
        query: {
          gradeId: row.gradeId,
          enterpriseId: this.cliqueId,
          name: this.cliqueName
        }
      });
    },

    // 新增等级
    addGrade() {
      this.$router.push({
        path: '/addMemberGrade',
        query: {
          enterpriseId: this.cliqueId,
          name: this.cliqueName
        }
      });
    },

    // 取消删除
    cancelPop(index, row, obj) {
      row.popVisible = false;
    },

    // 删除
    delGrade(index, row, obj) {
      let para = {
        gradeId: row.gradeId,
        enterpriseId: ''
      };
      getRequest('/api-admin/delete-member-grade', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 0) {
            showMsg.showmsg('删除成功', 'success');
            obj.splice(index, 1);
            return;
          }
          errMsg.errorMsg(resData);
        })
        .catch(function(error) {});
    },

    // 路由跳转
    changeRoute(route) {
      this.$router.push(route);
    }
  },
  components: {
    topNavNew
  },
  beforeRouteLeave(to, from, next) {
    let that = this;
    let d = to;
    if (d.path == '/editMemberGrade' || d.path == '/addMemberGrade') {
      sessionStorage.setItem('enterpriseId', that.cliqueId);
    }
    next();
  }
};
</script>
<style lang="less" scoped>
.attention-wrap {
  padding: 24px;
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

  .title {
    padding: 0 0 22px 0;
    display: -webkit-flex;
    display: flex;
    align-items: center;
    color: #828282;
    .add-btn {
      text-align: right;
    }
    div {
      -webkit-flex: 1;
      -moz-flex: 1;
      -ms-flex: 1;
      -o-flex: 1;
      flex: 1;
      font-size: 13px;
    }
  }

  .el-icon-upload2 {
    font-size: 22px;
    cursor: pointer;
  }

  .el-icon-download {
    font-size: 22px;
    cursor: pointer;
  }

  i.icon-color {
    color: #606266;
  }
  i.disable {
    color: #e6e6e6;
    cursor: not-allowed;
  }
}
</style>
