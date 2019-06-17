<template>
  <div class="form-wrap">
    <!-- :rules="rules" -->
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
      <el-form-item label="开卡方式" prop="cardCreateType">
        <el-radio v-model="ruleForm.cardCreateType" label="0">认证身份后发卡</el-radio>
        <el-radio v-model="ruleForm.cardCreateType" label="1" @change="changeType"><span>关注后自动发卡</span></el-radio>
      </el-form-item>

      <el-form-item label="会员卡号" prop="cardNoStatus" class="margin-20">
        <el-radio v-model="ruleForm.cardNoStatus" label="1" v-if="ruleForm.cardCreateType != 1">手机号作为卡号</el-radio>
        <el-radio v-model="ruleForm.cardNoStatus" label="0">自定义号段</el-radio>
        <el-radio v-model="ruleForm.cardNoStatus" label="2">时间信息+自定义号段</el-radio>
      </el-form-item>
      <el-form-item label="自定义号段设置" prop="cardBegin" v-if="ruleForm.cardNoStatus != 1">
        <label class="start-num">起始号段</label
        ><!-- :disabled="ruleForm.cardBegin==''?false:true" @blur="cardBeginCheck($event)"-->
        <el-input v-model="ruleForm.cardBegin" :disabled="cardBeginFlag" @focus="inputFocus('cardBegin')" @keyup.native="value => cardBeginCheck(value)"></el-input><label class="label-title">注意: 除首位外，其余号段逢4必进，即若号段数值到4，则默认+1进到5</label>
      </el-form-item>

      <el-form-item label=" " prop="prefixKey">
        <el-checkbox v-model="ruleForm.usePrefix">前缀</el-checkbox>
        <el-input v-model="ruleForm.prefixKey" @focus="inputFocus('prefixKey')" @keyup.native="value => toInput(value)"></el-input>
      </el-form-item>
      <el-form-item label=" " v-if="ruleForm.cardNoStatus != 2" prop="suffixKey">
        <el-checkbox v-model="ruleForm.useSuffix">后缀</el-checkbox>
        <el-input v-model="ruleForm.suffixKey" @focus="inputFocus('suffixKey')" @keyup.native="value => toInput(value)"></el-input>
      </el-form-item>

      <el-form-item label="时间格式" v-if="ruleForm.cardNoStatus == 2">
        <el-select v-model="ruleForm.cardNoTimeType" placeholder="请选择">
          <el-option v-for="item in TimeOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="会员卡详情" prop="gradeDescribe" class="margin-20">
        <div class="tinymce-wrap">
          <tinymce-edit ref="tinymceWrap" :bodyHtml="ruleForm.gradeDescribe" :projectName="projectName"></tinymce-edit>
        </div>
        <!-- <div v-html='tinymceHtml'></div> -->
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script type="text/javascript">
import tinymceEdit from 'components/memberShip/tinymce-edit'; // 开卡策略

import showMsg from '@/common/js/showmsg';
import errMsg from '@/common/js/error';
import strLength from '@/common/js/strlen';
import { log } from '@/utils/index.js';
import { postRequest, postForm } from '@/api/api';
export default {
  name: 'pointSystem',
  props: {
    cardCateInfo: Object,
    projectName: String
  },
  data() {
    let prefixKeyValid = (rule, value, callback) => {
      if (!!this.ruleForm.usePrefix && value === '') {
        callback(new Error('请输入前缀'));
        log(value);
      } else {
        callback();
      }
    };
    let suffixKeyValid = (rule, value, callback) => {
      if (!!this.ruleForm.useSuffix && value === '') {
        callback(new Error('请输入后缀'));
        log(value);
      } else {
        callback();
      }
    };
    let cardBeginValid = (rule, value, callback) => {
      if (this.ruleForm.cardNoStatus != 1) {
        if (value === '') {
          callback(new Error('请输入起始号段'));
        } else {
          //统计字符串中特定字符包含的个数
          let thisCount = 0;
          let strSource = String(value);
          strSource.replace(/4/g, function(m, i) {
            //m为找到的元素、i为索引
            thisCount++;
          });
          if (thisCount > 1 || (String(value).indexOf('4') != '-1' && String(value).indexOf('4') != 0)) {
            callback(new Error('起始号段格式不正确'));
          }
        }
        callback();
      } else {
        callback();
      }
    };
    return {
      repProjectName: 'gic-clique',
      navpath: [
        {
          name: '首页',
          path: ''
        },
        {
          name: '积分制度',
          path: ''
        }
      ],
      TimeOptions: [
        {
          value: '0',
          label: '如20170712'
        },
        {
          value: '1',
          label: '如170712'
        },
        {
          value: '2',
          label: '如201707121212'
        },
        {
          value: '3',
          label: '如1707121212'
        }
      ],

      beginLength: 11, // 起始号段 长度
      cardBeginFlag: false, //是否禁用起始号段
      keyLenth: 5, // 前缀长度
      ruleForm: {
        cardCreateType: '',
        cardNoStatus: '',
        cardBegin: '',
        usePrefix: true,
        prefixKey: '',
        useSuffix: true,
        suffixKey: '',
        cardNoTimeType: '',
        gradeDescribe: ''
      },
      rules: {
        prefixKey: [{ validator: prefixKeyValid, trigger: 'blur' }],
        suffixKey: [{ validator: suffixKeyValid, trigger: 'blur' }],
        cardBegin: [{ validator: cardBeginValid, trigger: 'change' }]
      },

      // tinymce
      tinymceHtml: '请输入内容',
      init: {
        language_url: 'static/tinymce/zh_CN.js',
        language: 'zh_CN',
        skin_url: 'static/tinymce/skins/lightgray',
        height: 300,
        // 图片上传
        // without images_upload_url set, Upload tab won't show up
        // images_upload_url: '',
        // images_upload_base_path: '/some/basepath',
        images_upload_credentials: true, //是否应传递cookie等跨域的凭据
        // images_upload_handler提供三个参数：blobInfo, success, failure
        images_upload_handler: (blobInfo, success, failure) => {
          log(blobInfo);
          this.handleImgUpload(blobInfo, success, failure);
        },
        // 添加插件
        plugins: 'link lists image code table colorpicker textcolor wordcount contextmenu',
        toolbar: 'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat',
        branding: false,
        setup: function(editor) {
          // 点击编辑框回调
          editor.on('click', function(e) {
            log('Editor was clicked');
          });
        }
      }
    };
  },
  created() {
    // this.selectReplayStyle()
  },
  methods: {
    cardBeginCheck(e) {
      let that = this;
      log(e, e.target.value);
      that.cardBeginFlag = false;
      that.ruleForm[that.tempTag] = strLength.getCharVal(e.target.value.replace(/[^\0-9]/g, ''), that.beginLength);
    },

    inputFocus(tag) {
      let that = this;
      log(tag);
      that.tempTag = tag;
    },
    // 输入
    toInput: function(e) {
      let that = this;
      log(e);
      that.ruleForm[that.tempTag] = strLength.getCharVal(e.target.value.replace(/[^\a-zA-Z0-9]/g, ''), that.keyLenth);
    },

    // 点击自动发卡
    changeType() {
      let that = this;
      that.ruleForm.cardNoStatus = '0';
    },
    // 保存
    submitForm(formName) {
      let that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          log(that.$refs.tinymceWrap.tinymceHtml);
          that.ruleForm.gradeDescribe = that.$refs.tinymceWrap.tinymceHtml;
          let data = JSON.parse(JSON.stringify(that.ruleForm));

          // 非空验证
          if (data.usePrefix && !data.prefixKey) {
            showMsg.showmsg('请填写前缀', 'error');
            return;
          }

          if (data.useSuffix && !data.suffixKey) {
            showMsg.showmsg('请填写后缀', 'error');
            return;
          }

          if (!data.gradeDescribe) {
            showMsg.showmsg('请填写会员卡详情', 'error');
            return;
          }

          data.usePrefix = data.usePrefix == true ? 1 : 0;
          data.useSuffix = data.useSuffix == true ? 1 : 0;
          log(data);

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

      postRequest('/api-admin/save-enter-member-system', para)
        .then(res => {
          log(res.data.result);
          let resData = res.data;
          if (resData.errorCode == 0) {
            that.cardBeginFlag = !!form.cardBegin ? true : false;
            showMsg.showmsg('保存成功', 'success');
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

    // 上传图片
    handleImgUpload(blobInfo, success, failure) {
      let that = this;
      let formdata = new FormData();
      formdata.set('upload_file', blobInfo.blob());
      formdata.set('requestProject', that.repProjectName);
      log(formdata);
      postForm('/api-plug/upload-img', formdata)
        .then(res => {
          success(res.data.result[0].qcloudImageUrl);
        })
        .catch(res => {
          log(res);
          failure('error');
        });
    },

    changeRoute(route) {
      this.$router.push(route);
    }
  },
  watch: {
    projectName: function(newData, oldData) {
      let that = this;
      that.repProjectName = newData || 'gic-clique';
    },
    cardCateInfo: {
      handler(newData) {
        let that = this;
        that.ruleForm = JSON.parse(JSON.stringify(newData));
        that.cardBeginFlag = !!that.ruleForm.cardBegin ? true : false;
      },
      deep: true
    }
  },
  components: {
    tinymceEdit
  },
  mounted() {
    let that = this;
    if (Object.keys(that.cardCateInfo).length) {
      that.ruleForm = JSON.parse(JSON.stringify(that.cardCateInfo));
      that.cardBeginFlag = !!that.ruleForm.cardBegin ? true : false;
    }
  }
};
</script>
<style lang="less" scoped>
.form-wrap {
  .el-input {
    width: 178px;
    padding: 0 10px;
  }

  .padding-0 {
    padding: 0;
  }

  /deep/ .el-form-item__label {
    padding: 0 12px 0 0;
  }

  .form-child {
    width: 900px;
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
    position: relative;
  }

  .label-title {
    font-size: 13px;
    color: #828282;
  }

  .start-num {
    color: #828282;
  }
}
</style>
