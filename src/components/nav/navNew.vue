<template>
  <div class="navwrap boxbttom">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item class="no-link" :class="{ 'link-active': item.path != '' && index != navpath.length - 1 }" v-for="(item, index) in navpath" :key="index" :to="{ path: item.path }">{{ item.name }}</el-breadcrumb-item>
    </el-breadcrumb>
    <h1 class="navtitle" v-if="navpath.length > 0">{{ navpath[navpath.length - 1].name }}</h1>
  </div>
</template>

<script>
export default {
  name: 'navpath',
  props: {
    navpath: {
      type: Array,
      default() {
        return [];
      }
    },
    navtip: {
      type: Boolean,
      default: false
    }
  },
  methods: {}
};
</script>

<style scoped>
.navwrap {
  padding: 20px 25px;
  background-color: #fff;
  border-radius: 2px;
  box-sizing: border-box;
}
.boxbttom {
  border-bottom: 1px solid #e4e7ed;
}
.boxshow {
  border-bottom: 1px solid #e4e7ed;
}
.navtitle {
  margin: 24px 0 0 0;
  font-size: 20px;
  color: #303133;
  font-weight: 500;
}
.navtip {
  width: 100%;
  height: 38px;
  line-height: 38px;
  font-size: 13px;
  border-radius: 2px;
  color: #606266;
  background-color: #f4f4f5;
}
.navmTop {
  margin-top: 25px;
}
.navtipcolor {
  margin: 0 12px;
  color: #1890ff;
}
.link-active /deep/ .el-breadcrumb__inner {
  font-weight: 700 !important;
  cursor: pointer !important;
  color: #303133 !important;
}
.link-active /deep/ .el-breadcrumb__inner:hover {
  color: #1890ff !important;
}
.no-link /deep/ .el-breadcrumb__inner,
.no-link /deep/ .el-breadcrumb__inner:hover {
  font-weight: normal;
  cursor: text;
  color: #606266;
}
</style>
