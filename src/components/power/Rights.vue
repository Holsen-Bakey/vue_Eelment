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
      <el-table>
        <el-table-column :data="rightsList" border stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="权限名称" prop="authName"></el-table-column>
          <el-table-column label="路径" prop="path"></el-table-column>
          <el-table-column label="权限等级" prop="level">
            <!-- 按等级渲染不同样式的tag -->
            <template slot-scope="scope">
              <el-tag v-if="scope.row.level === '0'" type='success'>一级</el-tag>
              <el-tag v-else-if="scope.row.level === '1'" type="warning">二级</el-tag>
              <el-tag v-else>三级</el-tag>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        //权限列表
        rightsList: [],
        rightsListTrue: [{
          "id": 101,
          "authName": "商品管理",
          "level": "0",
          "pid": 0,
          "path": null,
        }]
      }
    },
    created() {
      this.getRightsList()
    },
    methods: {
      //获取权限列表
      getRightsList() {
        const {
          data: res
        } = await this.$http.get('rights/list')
        if (res.meta.status != 200) {
          return this.$message.error('获取权限列表失败！')
        }
        this.rightsList = res.data
        console.log(this.rightsList)
      }
    }


  }

</script>

<style lang="less" scoped>

</style>
