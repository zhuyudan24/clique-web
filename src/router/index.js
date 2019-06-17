import Vue from 'vue';
import Router from 'vue-router';
import _import from './_import.js';
Vue.use(Router);

// eslint-disable-next-line
const error403 = r => {
  import('view/errorPage/403.vue').then(module => {
    r(module);
  });
};
// eslint-disable-next-line
const error404 = r => {
  import('view/errorPage/404.vue').then(module => {
    r(module);
  });
};
// eslint-disable-next-line
const error500 = r => {
  import('view/errorPage/500.vue').then(module => {
    r(module);
  });
};
// eslint-disable-next-line
const errorPage = r => {
  import('view/errorPage/index.vue').then(module => {
    r(module);
  });
};
// 页面刷新时，重新赋值token
if (window.sessionStorage.getItem('token')) {
  // eslint-disable-next-line
  store.commit(types.LOGIN, window.sessionStorage.getItem('token'));
}
export const constantRouterMap = [
  {
    path: '/',
    name: 'index',
    component: _import('index', 'index'),
    children: [
      // 集团后台
      // 配置中心
      {
        path: '/companyGroup',
        name: '集团信息',
        component: _import('companyGroup/membershipSystem', 'companyGroupInfo')
      },
      {
        path: '/memberCardSet',
        name: '会员卡设置',
        component: _import('companyGroup/membershipSystem', 'memberCardSet')
      },
      {
        path: '/memberGrade',
        name: '会员等级列表',
        component: _import('companyGroup/membershipSystem', 'memberGrade')
      },
      {
        path: '/addMemberGrade',
        name: '添加等级列表',
        component: _import('companyGroup/membershipSystem', 'addMemberGrade')
      },
      {
        path: '/editMemberGrade',
        name: '编辑等级列表',
        component: _import('companyGroup/membershipSystem', 'editMemberGrade')
      },
      {
        path: '/addGroupGrade',
        name: '添加集团会员等级',
        component: _import('companyGroup/membershipSystem', 'addGroupGrade')
      },
      {
        path: '/editGroupGrade',
        name: '编辑集团会员等级',
        component: _import('companyGroup/membershipSystem', 'editGroupGrade')
      },
      {
        path: '/addGroupCate',
        name: '添加集团折扣策略',
        component: _import('companyGroup/membershipSystem', 'addGroupCate')
      },
      {
        path: '/editGroupCate',
        name: '编辑集团折扣策略',
        component: _import('companyGroup/membershipSystem', 'editGroupCate')
      },
      {
        path: '/pointSystem',
        name: '积分制度',
        component: _import('companyGroup/membershipSystem', 'pointSystem')
      },
      {
        path: '/addPointSystem',
        name: '新增积分获取策略',
        component: _import('companyGroup/membershipSystem', 'addPointSystem')
      },
      {
        path: '/editPointSystem',
        name: '编辑积分获取策略',
        component: _import('companyGroup/membershipSystem', 'editPointSystem')
      },
      {
        path: '/addIntegralSytem',
        name: '新增积分抵现策略',
        component: _import('companyGroup/membershipSystem', 'addIntegralSytem')
      },
      {
        path: '/editIntegralSytem',
        name: '编辑积分抵现策略',
        component: _import('companyGroup/membershipSystem', 'editIntegralSytem')
      },
      {
        path: '/nearStoreSet',
        name: '附近门店',
        component: _import('companyGroup/membershipSystem', 'nearStoreSet')
      },
      {
        path: '/memberAchievement',
        name: '会员成就',
        component: _import('companyGroup/memberServices', 'memberAchievement')
      },
      {
        path: '/memberTask',
        name: '会员任务',
        component: _import('companyGroup/memberServices', 'memberTask')
      },
      {
        path: '/originalCostSet',
        name: '原始成本主体配置',
        component: _import('companyGroup/integral', 'originalCostSet')
      },
      {
        path: '/settlementConfig',
        name: '结算归属配置',
        component: _import('companyGroup/integral', 'settlementConfig')
      },
      {
        path: '/integralReport',
        name: '积分结算报表',
        component: _import('companyGroup/integral', 'integralReport')
      },
      {
        path: '/brokerageRule',
        name: '佣金结算规则',
        component: _import('companyGroup/brokerage', 'brokerageRule')
      },
      {
        path: '/belongCloseDtl',
        name: '归属成交明细',
        component: _import('companyGroup/brokerage', 'belongCloseDtl')
      },
      {
        path: '/belongRefundDtl',
        name: '归属退款明细',
        component: _import('companyGroup/brokerage', 'belongRefundDtl')
      }
    ]
  },
  {
    path: '/memberInfoTemplate',
    name: '开卡字段配置模板',
    component: _import('companyGroup/membershipSystem', 'memberInfoTemplate')
  },
  {
    path: '/login',
    name: '集团商户登录',
    component: _import('companyGroup', 'login')
  },
  {
    path: '/403',
    name: '无权访问',
    component: errorPage
  },
  {
    path: '/404',
    name: 'error404',
    component: errorPage
  },
  {
    path: '/500',
    name: 'error500',
    component: errorPage
  },
  { path: '*', redirect: '/404', hidden: true }
];
export default new Router({
  // mode:'history',
  routes: constantRouterMap,
  scrollBehavior: () => ({ y: 0 })
});
