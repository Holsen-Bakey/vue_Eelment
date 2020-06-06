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
      <!-- 安装依赖运行 tree-grid 且在main.js中引用-->
      <!-- 表格 -->
      <tree-table :data='catelist' :columns="columns" :selection-type="false" :expand-type="false" show-index border>
        <!-- 作用于插槽渲染图标，现在columns中开启 -->
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false"></i>
          <i class="el-icon-warning" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" v-else-if="scope.row.cat_level === 1" type="danger">二级</el-tag>
          <el-tag v-else size="mini" type="wraning">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="primary" icon="el-icon-search" size="mini">删除</el-button>
        </template>
      </tree-table>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addCateDialogClosed">
      <!-- 分类名称 -->
      <!-- <span>123</span> -->
      <el-form ref="addFormRef" :model="addCateForm" :rules="addCateFormRules" label-width="70px">
        <!-- 父级分类： -->
        <el-form-item label="用户名" prop="username">
          <!-- 级联选择器 -->
          <!-- props 用来指定配置对象 -->
          <el-cascader expand-trigger="hover" :options="parentCateList" :props="cascaderProps" v-model="selectedKeys"
            @change="parentCateChange" clearable change-on-selected>

          </el-cascader>
        </el-form-item>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCateForm">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        //查询得到的数据
        queryInfo: {
          type: 3,
          pagenum: 1,
          pagesize: 5
        },
        //商品分类的数据列表
        catelist: [],
        catelistT: [{
          "cat_id": 1,
          "cat_name": "大家电",
          "cat_pid": 0,
          "cat_level": 0,
          "cat_deleted": false,
          "children": [{
            "cat_id": 3,
            "cat_name": "电视",
            "cat_pid": 1,
            "cat_level": 1,
            "cat_deleted": false,
            "children": [{
              "cat_id": 6,
              "cat_name": "曲面电视",
              "cat_pid": 3,
              "cat_level": 2,
              "cat_deleted": false,
            }, {
              "cat_id": 7,
              "cat_name": "海信",
              "cat_pid": 3,
              "cat_level": 2,
              "cat_deleted": false,
            }]
          }]
        }],
        //为table指定列的定义
        columns: [{
          label: '分类名称',
          prop: 'cat_name',
          minWidth: '400px'
        }, {
          label: '是否有效',
          minWidth: '400px',
          type: 'template',
          template: 'isok'
        }, {
          label: '排序',
          minWidth: '400px',
          type: 'template',
          template: 'order'
        }, {
          label: '操作',
          minWidth: '400px',
          type: 'template',
          template: 'opt'
        }],
        //父级分类列表集合
        parentCateList: [],
        //指定级联选择器的配置对象
        cascaderProps: {
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
        },
        //选中父级分类的Id数组
        selectedKeys: [],
        //添加表单分类的数据对象
        addCateForm: {
          //将要添加的分类的名称
          cat_name: '',
          // 父级分类的Id
          cat_pid: 0,
          //分类的等级，默认添加的是1级分类
          cat_level: 0
        }

      }
    },
    created() {
      this.getRightsList()
    },
    methods: {
      //级联选择器选择项发生变化
      parentCateChange() {
        console.log(this.selectedKeys)
        //如果 selectedKey 数组中的 length 大于0，证明选中了父级分类
        // 反之，说明没有选中任何父级分类
        // 判断用户点击确认按钮时是否选中了有效的选中信息
        if (this.selectedKeys.length > 0) {
          //父级分类的Id
          this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
          //为当前的分类等级赋值
          this.addCateForm.cat_level = this.selectedKeys.length
          return
        } else {
          //父级分类的Id
          this.addCateForm.cat_pid = 0
          //为当前的分类等级赋值
          this.addCateForm.cat_level = 0
        }
      },

      //点击按钮，添加新的分类
      addCateForm() {
        // console.log(this.addCateForm)
        this.$refs.addCateFormRef.validate(valid => {
          if (!valid) return
          const {
            data: res
          } = await this.$http.post('categories', this.addCateForm)

          if (res.meta.status !== 201) {
            return this.$message.error('添加分类失败')
          }
          this.$message.success('添加分类成功！')
          this.getCateList()
          this.addCateDialogVisible = false
        })
      },

      //监听对话框的关闭事件，重置表单数据
      addCateDialogClosed() {
        this.$refs.addCateFormRef.resetFields()
        this.selectedKeys = []
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      },



    }


  }

</script>

<style lang="less" scoped>
  .el-cascader {
    width: 100%
  }

</style>
