<template>
  <div id="index">
    <vue-gic-header :projectName="projectName" :collapseFlag="collapseFlag" @collapseTag="collapseTag" @toRouterView="toRouterView"></vue-gic-header>
    <div id="content" class="content">
      <div class="content-body">
        <!-- :style="{height: contentHeight}" -->
        <div class="left-menu" :style="{ minHeight: bodyHeight - 66 + 'px' }" :class="{ 'small-left': collapseFlag }">
          <vue-gic-aside-menu :projectName="projectName" :leftModulesName="leftModulesName" :collapseFlag="collapseFlag"></vue-gic-aside-menu>
        </div>
        <div class="right-right" :class="{ margin64: collapseFlag }">
          <router-view></router-view>
        </div>
        <!-- <transition name="fade" mode="out-in">
            <router-view></router-view>
          </transition> -->
      </div>
    </div>
  </div>
</template>
<script>
import * as types from '../../store/types';
import { log } from '@/utils/index.js';
export default {
  name: 'App',
  data() {
    return {
      projectName: 'gic-clique',
      contentHeight: '0px', //页面内容高度
      collapseFlag: false, // 折叠参数
      // 模块名
      leftModulesName: '会员设置',
      bodyHeight: document.body.clientHeight || document.documentElement.clientHeight
    };
  },
  methods: {
    // 处理路由跳转
    toRouterView(val) {
      var that = this;
      // 模拟检查数据
      // //有两个参数
      //{
      //  name:,
      //  path:
      //}
      log(val);
      that.$router.push({
        path: val.path
      });
    },
    // 折叠事件
    collapseTag(val) {
      var that = this;
      log(val);
      that.collapseFlag = val;
    }
  },
  mounted() {
    var that = this;
    that.$store.commit(types.TITLE, '达摩GIC');
    document.title = this.$store.state.title;
    //获取项目名 pathname (路由的hash)
    that.pathName = window.location.hash.split('/')[1];
    log('pathname:', that.pathName, this.$route.path);

    that.contentHeight = (document.documentElement.clientHeight || document.body.clientHeight) - 64 + 'px';
  },
  components: {}
};
</script>
<style lang="less">
#index {
  .content {
    padding-top: 64px;
    box-sizing: border-box;
    min-width: 1400px;
    .content-body {
      display: flex;
      height: 100%;
      .left-menu {
        flex: 0 0 200px;
        width: 200px;
        height: 100%;
        background: #020b21;
        transition: all 0.2s ease;
        position: fixed;
        z-index: 5;
      }
      .small-left {
        transition: all 0.3s ease;
        flex: 0 0 64px;
        width: 64px;
      }
      .right-right {
        flex: 1;
        overflow: auto;
        width: 100%;
        margin-left: 200px;
        &.margin64 {
          margin-left: 64px;
        }
      }
      /deep/ .el-tabs__nav {
        z-index: 1;
      }
    }
  }
}
.right-wrap {
  height: 100%;
  .right-content {
    padding: 24px;
    min-height: calc(100% - 250px);
    .right-box {
      background: #fff;
    }
  }
  /deep/ .el-submenu__title {
    height: 40px;
    line-height: 40px;
  }

  /* 表格为空 */
  /deep/ .el-table__empty-block {
    height: 256px;
  }
}

/* 隐藏 头部 */
.navheader {
  div.itemlink-gic.bottom {
    display: none;
  }
  a.itemlink.bottom {
    display: none;
  }
}

.el-table__empty-block {
  height: 256px;
}

.el-table__empty-text {
  width: auto;
  &::before {
    content: ' ';
    display: block;
    width: 60px;
    height: 60px;
    background: url(../../assets/no-data_icon.png) no-repeat center;
    margin: 0px auto 0 auto;
  }
}

.el-submenu__title {
  height: 40px;
  line-height: 40px;
}

.user-header-pop {
  min-width: 95px;
}
.el-popover.user-header-pop {
  min-width: 95px;
}

.left-aside-contain {
  /deep/ .el-submenu__title:hover {
    background-color: #020b21;
  }
}

.el-menu.el-menu--popup {
  background: #020b21;
  border-radius: 4px;
}

/* 输入框 focus*/
.el-form-item.is-success .el-input__inner,
.el-form-item.is-success .el-input__inner:focus,
.el-form-item.is-success .el-textarea__inner,
.el-form-item.is-success .el-textarea__inner:focus {
  border-color: #dcdfe6;
}

/* 箭头*/
.icon-to-pre {
  cursor: pointer;
  font-size: 18px;
  -webkit-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  -o-transform: rotate(90deg);
  transform: rotate(90deg);
}

.icon-to-next {
  cursor: pointer;
  font-size: 18px;
  -webkit-transform: rotate(-90deg);
  -ms-transform: rotate(-90deg);
  -o-transform: rotate(-90deg);
  transform: rotate(-90deg);
}

/*树形*/
.vue-treeselect /deep/ {
  /deep/ .vue-treeselect__control {
    height: 36px;
    /*line-height: 36px;*/
    cursor: pointer;
  }

  .vue-treeselect__placeholder {
    line-height: 36px;
    font-size: 12px;
  }

  .vue-treeselect__multi-value-item-container,
  .vue-treeselect__multi-value {
    line-height: 1;
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

  .vue-treeselect__control-arrow {
    display: none;
  }

  .vue-treeselect__control-arrow-container {
    position: relative;
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

/* 富文本编辑器 */
.mce-tinymce {
  -webkit-box-shadow: none;
  box-shadow: none;
}
</style>
