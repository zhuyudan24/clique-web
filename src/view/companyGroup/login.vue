<template>
  <div class="right-wrap"></div>
</template>

<script>
import { getRequest } from '@/api/api';
import { log } from '@/utils/index.js';

export default {
  name: 'public_num_attention',
  data() {
    return {
      baseUrl: '', // 域名
      enterpriseId: '',
      backgroundMode: '' // 是否是中台模式  1是 0否
    };
  },
  beforeMount() {
    let that = this;
    let host = window.location.origin;
    log('当前host:', host);
    if (host.indexOf('localhost') != '-1') {
      that.baseUrl = 'http://gicdev.demogic.com';
    } else {
      that.baseUrl = host;
    }
  },
  methods: {
    // 跳转商户
    redirect(enterpriseId) {
      let that = this;
      let para = {
        eid: enterpriseId
      };
      getRequest('/api-auth/do-login-for-clique', para)
        .then(res => {
          // log(res,res.data,res.data.errorCode)
          let resData = res.data;
          if (resData.errorCode == 0) {
            let href = that.baseUrl + '';
            if (that.backgroundMode == 1) {
              // 中台
              window.location.href = href + '/middle-ground/#/index';
              return;
            } else {
              window.location.href = href + '/report/#/memberSummary';
              return;
            }
          }
          that.$message.error({
            duration: 1000,
            message: resData.message
          });
        })
        .catch(function(error) {
          log(error);
        });
    }
  },
  mounted() {
    let that = this;
    // let href = that.baseUrl + ''
    // window.location.href= href + "/gic-web/#/login"
    log('mounted', that.$route.query.gradeId);
    that.enterpriseId = that.$route.query.enterpriseId;
    that.backgroundMode = that.$route.query.backgroundMode;
    that.redirect(that.enterpriseId);
  }
};
</script>
