<template>
  <div>
    <!-- 1 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 2 卡片视图区域 -->
    <el-card>

    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        //权限列表
        rightsList: []
      }
    },
    created() {
      this.getRightsList()
    },
    methods: {
      //
    }


  }

</script>

<style lang="less" scoped>

</style>
