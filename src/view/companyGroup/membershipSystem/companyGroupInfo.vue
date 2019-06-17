<template>
  <div class="right-wrap">
    <topNav :navpath="navpath"></topNav>
    <div class="right-content">
      <div class="right-box">
        <div class="attention-wrap">
          <div class="group-contain">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
              <el-form-item label="集团名称" prop="cliqueName">
                <el-input v-model="ruleForm.cliqueName" @focus="focus('cliqueName', 10)" @keyup.native="value => toInput(value)"> </el-input>
                <label class="input-label">{{ inputNumObj.cliqueName }}/10</label>
              </el-form-item>
              <el-form-item label="公司名称" prop="enterpriseName">
                <el-input v-model="ruleForm.enterpriseName" @focus="focus('enterpriseName', 20)" @keyup.native="value => toInput(value)"> </el-input>
                <label class="input-label">{{ inputNumObj.enterpriseName }}/20</label>
              </el-form-item>
              <el-form-item label="所在地区" prop="region" class="city-area">
                <vue-area-ab :projectName="projectName" :areaOptions="areaOptions" @selected="selected"></vue-area-ab>
              </el-form-item>
              <el-form-item label="详细地址" prop="addressDetail">
                <el-input v-model="ruleForm.addressDetail" @focus="focus('addressDetail', 50)" @keyup.native="value => toInput(value)"> </el-input>
                <label class="input-label">{{ inputNumObj.addressDetail }}/50</label>
              </el-form-item>
              <el-form-item label="集团logo" prop="qcloudImageUrl">
                <div>
                  <el-upload class="avatar-uploader" :action="uploadUrl()" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                    <div class="avatar-uploader-wrap" v-loading="uploadLoading">
                      <img v-if="ruleForm.qcloudImageUrl" :src="ruleForm.qcloudImageUrl" class="avatar" @mouseover="showImage(ruleForm.qcloudImageUrl)" @click="hideImage" />
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </div>
                  </el-upload>
                  <p class="upload-tip">只能上传规格为1:1的 jpg/jpeg 图片，且不超过1Mb</p>
                </div>
              </el-form-item>
              <el-form-item label="关联商户">
                <div class="link-shop">
                  <template v-for="(item, index) in ruleForm.enterpriseList">
                    <router-link tag="a" target="_blank" :to="{ path: '/login', query: { enterpriseId: item.enterpriseId, backgroundMode: item.backgroundMode } }" :key="index">
                      <img :src="item.qcloudImageUrl" alt="" />
                      <span>{{ item.brandName }}</span>
                    </router-link>
                  </template>
                </div>
              </el-form-item>
              <el-form-item label="营业时间模板" prop="storeBusinessTime">
                <el-time-picker is-range v-model="ruleForm.storeBusinessTime" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" format="HH:mm"> </el-time-picker>
              </el-form-item>
              <el-form-item label="客服热线" prop="customerPhone">
                <el-input v-model="ruleForm.customerPhone" @focus="focus('customerPhone', 30)" @keyup.native="value => toInput(value)"> </el-input>
                <label class="input-label">{{ inputNumObj.customerPhone }}/30</label>
              </el-form-item>
              <el-form-item label="集团简介" prop="enterpriseDescription">
                <el-input type="textarea" v-model="ruleForm.enterpriseDescription" style="height: 96px;" @focus="focus('enterpriseDescription', 200)" @keyup.native="value => toInput(value)"> </el-input>
                <template>
                  <label class="input-label textarea-label">{{ inputNumObj.enterpriseDescription }}/200</label>
                </template>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">保 存</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <vue-gic-img-preview :imgUrl="imgUrl" :imgShowFlag="imgShowFlag" @hideImage="hideImage"></vue-gic-img-preview>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>
<script>
import showMsg from '@/common/js/showmsg';
import errMsg from '@/common/js/error';
import strLength from '@/common/js/strlen';
import newTime from '@/common/js/timeFormat';
import topNav from 'components/nav/nav';
import { getRequest } from '@/api/api';
// eslint-disable-next-line
import qs from 'qs';
import { log } from '@/utils/index.js';

export default {
  name: 'public_num_attention',
  data() {
    return {
      projectName: 'gic-clique', // 当前项目名
      areaOptions: {
        provinceName: '',
        provinceId: '',
        cityName: '',
        cityId: '',
        countryName: '',
        countyId: ''
      },
      navpath: [
        {
          name: '首页',
          path: '/'
        },
        {
          name: '集团信息',
          path: ''
        }
      ],

      upUrl: '', // 上传地址
      uploadLoading: false,
      // 预览上传图片
      imgShowFlag: false, // 是否弹框显示图片,true: 显示；false: 不显示
      imgUrl: '',

      ruleForm: {
        cliqueName: '',
        enterpriseName: '',
        region: '',
        addressDetail: '',
        qcloudImageUrl: '',
        enterpriseList: [
          {
            enterpriseId: '',
            enterpriseName: '达摩',
            qcloudImageUrl: '/'
          }
        ],
        storeBusinessTime: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
        date1: '',
        date2: '',
        customerPhone: '',
        enterpriseDescription: ''
      },
      rules: {
        cliqueName: [{ required: true, message: '请输入集团名称', trigger: 'blur' }],
        enterpriseName: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
        region: [{ required: true, message: '请选择所在地区', trigger: 'blur' }],
        addressDetail: [{ required: true, message: '请输入详细地址', trigger: 'change' }],
        storeBusinessTime: [{ required: true, message: '请选择营业时间', trigger: 'change' }],
        date1: [{ type: 'date', required: true, message: '请选择日期', trigger: 'change' }],
        date2: [{ type: 'date', required: true, message: '请选择时间', trigger: 'change' }],

        customerPhone: [{ required: true, message: '请输入客服热线', trigger: 'change' }],
        enterpriseDescription: [{ required: true, message: '请输入集团简介', trigger: 'blur' }]
      },

      inputNumObj: {
        //输入字数
        cliqueName: 0,
        enterpriseName: 0,
        addressDetail: 0,
        customerPhone: 0,
        enterpriseDescription: 0
      },
      // 记录输入的
      inputFlag: '',
      inputFlagNum: '',

      baseUrl: '' // 域名
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

    that.upUrl = that.baseUrl + '/api-plug/upload-img?wxFlag=1';
  },
  created() {
    // this.selectReplayStyle()
    log('created');
  },
  mounted() {
    let that = this;
    log('mounted');
    that.getGroupInfo();
  },

  methods: {
    // 预览图片方法
    showImage(src) {
      let that = this;
      log(src);
      that.imgShowFlag = true;
      that.imgUrl = src;
    },
    hideImage(val) {
      let that = this;
      log(val);
      that.imgShowFlag = false;
    },

    uploadUrl() {
      let that = this;
      let host = window.location.origin;
      let baseUrl;
      log('当前host:', host);
      if (host.indexOf('localhost') != '-1') {
        baseUrl = 'http://gicdev.demogic.com';
      } else {
        baseUrl = host;
      }

      that.upUrl = baseUrl + '/api-plug/upload-img?wxFlag=1&requestProject=gic-clique';
      log(that.upUrl);
      return that.upUrl;
    },

    changeRoute(route) {
      let that = this;
      that.$router.push(route);
    },

    // 保存
    submitForm(formName) {
      let that = this;
      that.$refs[formName].validate(valid => {
        if (valid) {
          let newFormData = JSON.parse(JSON.stringify(that.ruleForm));
          log(newFormData);
          newFormData.storeBusinessTime = newTime.dateToTime(newFormData.storeBusinessTime);
          // 发送的数据
          log(newFormData.storeBusinessTime);
          // 保存方法
          that.saveGroupInfo(newFormData);
        } else {
          log('error submit!!');
          that.$message.error({
            duration: 1000,
            message: '请填写完信息'
          });
          return false;
        }
      });
    },

    // 上传
    handleAvatarSuccess(res, file) {
      let that = this;
      that.uploadLoading = false;
      that.imgShowFlag = false;
      log('上传成功回调:', res);
      if (res.errorCode == 0) {
        that.ruleForm.qcloudImageUrl = res.result[0].qcloudImageUrl; //URL.createObjectURL(file.raw);
        that.ruleForm.imageFiledCode = res.result[0].imageFiledCode;
        that.ruleForm.imageUrl = res.result[0].wxImg;
      } else {
        errMsg.errorMsg(res);
      }
    },
    beforeAvatarUpload(file) {
      let that = this;
      that.imgShowFlag = false;
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg';
      const isLt2M = file.size / 1024 / 1024 <= 1;

      if (!isJPG) {
        that.$message.error('您只能上传 JPG/JPEG 图片!');
      }
      if (!isLt2M) {
        that.$message.error('您只能上传小于 1Mb 的图片!');
      }
      return (
        isJPG &&
        isLt2M &&
        new Promise(function(resolve, reject) {
          let reader = new FileReader();
          reader.onload = function(event) {
            let image = new Image();
            image.onload = function() {
              let width = this.width;
              let height = this.height;
              log(width, height);

              if (width !== height) {
                that.uploadLoading = false;
                that.$message.error('您只能上传规格为 1:1 的图片!');
                reject();
              }

              resolve();
            };
            that.uploadLoading = true;
            image.src = event.target.result;
            log('上传成功:', event.target.result);
          };
          reader.readAsDataURL(file);
        })
      );
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
      log(value);
      let temp = strLength.getByteVal(value.target.value, that.inputFlagNum);
      log(temp);
      that.ruleForm[that.inputFlag] = temp.trim();

      that.inputNumObj[that.inputFlag] = strLength.getZhLen(that.ruleForm[that.inputFlag]);

      log(that.ruleForm[that.inputFlag]);
    },

    // 省市县选择
    selected(val) {
      log(val);
      let that = this;
      if (!!val.country) {
        that.ruleForm.region = val;
        log(val.areaId);
        that.ruleForm.areaId = val.areaId;
      } else {
        that.ruleForm.region = '';
      }
    },
    // 保存集团信息
    saveGroupInfo(form) {
      let that = this;
      let para = {
        requestProject: that.projectName,
        cliqueName: form.cliqueName,
        enterpriseName: form.enterpriseName,
        brandName: form.brandName,
        addressDetail: form.addressDetail,
        imageUrl: form.imageUrl,
        imageFieldCode: form.imageFieldCode,
        qcloudImageUrl: form.qcloudImageUrl,
        storeBusinessTime: form.storeBusinessTime,
        customerPhone: form.customerPhone,
        enterpriseDescription: form.enterpriseDescription,
        areaId: form.areaId
      };

      getRequest('/api-admin/save-enterprise-info', para)
        .then(res => {
          // log(res,res.data,res.data.errorCode)
          let resData = res.data;
          if (resData.errorCode == 0) {
            showMsg.showmsg('保存成功', 'success');
            return;
          }
          // that.userFormVisible = false;
          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          log(error);
          // that.toLogin()
          // that.userFormVisible = false;
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    // 跳转商户
    redirect(e, enterpriseId) {
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
            window.open(href, '_blank', 'toolbar=yes, width=1300, height=900');
            return;
          }
          // that.userFormVisible = false;
          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          log(error);
          // that.toLogin()
          // that.userFormVisible = false;
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    // 获取集团信息
    getGroupInfo() {
      let that = this;
      let para = {
        requestProject: that.projectName
      };

      getRequest('/api-admin/enterprise-info', para)
        .then(res => {
          // log(res,res.data,res.data.errorCode)
          let resData = res.data;
          if (resData.errorCode == 0) {
            // 设置省市县
            let newEnterprise = resData.result.enterprise;
            // that.setArea(JSON.parse(JSON.stringify(newEnterprise)));
            //
            log(resData.result.enterprise);
            newEnterprise.region = {};
            newEnterprise.region.areaId = newEnterprise.areaId;
            newEnterprise.region.provinceId = newEnterprise.province;
            newEnterprise.region.provinceName = newEnterprise.provinceName;
            newEnterprise.region.cityId = newEnterprise.city;
            newEnterprise.region.cityName = newEnterprise.cityName;
            newEnterprise.region.countyId = newEnterprise.country;
            newEnterprise.region.countryName = newEnterprise.countryName;

            that.areaOptionsNew = {};
            that.areaOptionsNew.provinceName = newEnterprise.provinceName; // 默认的省市区传值
            that.areaOptionsNew.provinceId = newEnterprise.province;
            that.areaOptionsNew.cityName = newEnterprise.cityName;
            that.areaOptionsNew.cityId = newEnterprise.city;
            that.areaOptionsNew.countryName = newEnterprise.countryName;
            that.areaOptionsNew.countyId = newEnterprise.country;
            let obj = JSON.stringify(that.areaOptionsNew); // 深拷贝
            that.areaOptions = JSON.parse(obj);
            // that.areaOptions = JSON.parse(JSON.stringify(newEnterprise.region))
            // 时间
            if (!!newEnterprise.storeBusinessTime) {
              newEnterprise.storeBusinessTime = newTime.timeToDate(newEnterprise.storeBusinessTime);
            }

            // 长度
            if (!!newEnterprise.cliqueName) {
              that.inputNumObj.cliqueName = strLength.getZhLen(newEnterprise.cliqueName);
            }
            if (!!newEnterprise.enterpriseName) {
              that.inputNumObj.enterpriseName = strLength.getZhLen(newEnterprise.enterpriseName);
            }

            if (!!newEnterprise.addressDetail) {
              that.inputNumObj.addressDetail = strLength.getZhLen(newEnterprise.addressDetail);
            }

            if (!!newEnterprise.customerPhone) {
              that.inputNumObj.customerPhone = strLength.getZhLen(newEnterprise.customerPhone);
            }

            if (!!newEnterprise.enterpriseDescription) {
              that.inputNumObj.enterpriseDescription = strLength.getZhLen(newEnterprise.enterpriseDescription);
            }

            that.ruleForm = newEnterprise;

            that.ruleForm.enterpriseList = resData.result.enterpriseList;

            log(that.ruleForm);
            return;
          }
          // that.userFormVisible = false;
          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          log(error);
          // that.toLogin()
          // that.userFormVisible = false;
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    setArea(obj) {
      let that = this;
      that.areaOptions.areaId = obj.areaId;
      that.areaOptions.provinceId = obj.province;
      that.areaOptions.provinceName = obj.provinceName;
      that.areaOptions.cityId = obj.city;
      that.areaOptions.cityName = obj.cityName;
      that.areaOptions.countyId = obj.country;
      that.areaOptions.countryName = obj.countryName;
    }
  },
  components: {
    topNav
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
  .attention-content-wrap {
  }
  /deep/ .el-form-item__label {
    padding: 0 12px 0 0;
  }

  /deep/ .el-form {
    .el-form-item:last-child {
      /*margin-bottom: 0;*/
    }

    .el-form-item__content {
      width: 700px;
    }

    .city-area {
      /deep/ .w-160 {
        width: 228px;
        & + .w-160 {
          /*margin-left: 6px;*/
        }
      }
    }
  }
}

.group-contain {
  .el-input {
    width: 700px;
    &.el-date-editor {
      width: 300px;
    }
  }

  .el-textarea {
    width: 700px;
    /*height: 300px;*/

    /deep/ .el-textarea__inner {
      resize: none;
      height: 96px;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
    }
  }

  /deep/ .input-label {
    position: absolute;
    right: 10px;
    top: 2px;
    color: #909399;
    font-size: 12px;
  }

  .textarea-label {
    position: absolute;
    right: 10px;
    top: 90px;
    color: #909399;
  }

  .upload-tip {
    color: #909399;
    font-size: 12px;
    line-height: 12px;
  }

  .avatar-uploader {
    /deep/ .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      overflow: hidden;
      &:hover {
        border-color: #1890ff;
      }
    }
  }
  .avatar-uploader .el-upload:hover {
    border-color: #1890ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }

  .avatar-uploader-wrap {
    width: 128px;
    height: 128px;
    padding: 8px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .avatar {
    width: 100%;
    // height: 120px;
    display: block;
  }

  .el-icon-loading {
  }

  .link-shop {
    width: 800px;
    font-size: 0;
    a {
      display: inline-block;
      width: 250px;
      border: 1px solid #e3e5e9;
      border-radius: 2px;
      padding: 10px 15px;
      margin-right: 16px;
      margin-bottom: 10px;
      color: #333;
      font-size: 14px;
      cursor: pointer;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      & + a {
        /*margin-left: 10px;*/
      }
    }
    img {
      display: inline-block;
      vertical-align: middle;
      width: 60px;
      height: 60px;
    }
    span {
      display: inline-block;
      vertical-align: middle;
    }
  }

  .el-form-item.is-success /deep/ .el-input__inner,
  .el-form-item.is-success /deep/ .el-input__inner:focus,
  .el-form-item.is-success /deep/ .el-textarea__inner,
  .el-form-item.is-success /deep/ .el-textarea__inner:focus {
    border-color: #dcdfe6;
  }
}
</style>
