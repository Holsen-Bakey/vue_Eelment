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
      <!-- 警告区域 -->
      <el-alert title="只允许为第三级" type="warning" :closable="false" show-icon>
      </el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader expand-trigger="hover" v-model="selectedCateKeys" :options="cateList" :props="cateProps"
            @change="handleChange">
          </el-cascader>
        </el-col>
      </el-row>
      <!-- tab页标签区 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数的按钮 -->
          <el-button type="primary" size="mini" :disabled='isBtnDisabled' @click="addDialogVisible=true">添加参数
          </el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">

            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="inedx"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>

          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加属性的按钮 -->
          <el-button type="primary" size="mini" :disabled='isBtnDisabled' @click="addDialogVisible=true">添加属性
          </el-button>
          <!-- 动态参数表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">

            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="inedx"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>

          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 3 添加参数的对话框 -->
    <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="50%" @close='addDialogClosed'>
      <!-- <span>这是一段信息</span> -->
      <!-- 添加参数的对话框 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 4 修改参数的对话框 -->
    <el-dialog :title="'修改' + titleText" :visible.sync="editDialogVisible" width="50%" @close='editDialogClosed'>
      <!-- <span>这是一段信息</span> -->
      <!-- 添加参数的对话框 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        //商品列表数据
        cateList: [],
        // 级联选择器的配置对象
        cateProps: {
          value: 'cat_id',
          label: 'cat_name',
          children: 'children',
        },
        //级联选择框双向绑定到的数组
        selectedCateKeys: [],
        //被激活的页签的名称
        activeName: 'many',
        //动态参数的数据
        manyTableData: '',
        //静态属性的数据
        onlyTableData: '',
        //控制添加对话框的显示与隐藏
        addDialogVisible: false,
        //添加表单的验证规则
        addFormRules: {
          attr_name: [{
            required: true,
            message: '请输入参数名称',
            trigger: 'blur'
          }]
        },
        //控制修改对话框的显示与隐藏
        editDialogVisible: false,
        //修改的表单数据对象
        editForm: {},
        //修改表单的验证股则
        editFormRules: {
          attr_name: [{
            required: true,
            message: '请输入参数名称',
            trigger: 'blur'
          }]
        },


      }
    },
    created() {
      this.getCateList()
    },
    methods: {
      //获取所有的商品分类列表
      async getCateList() {
        const {
          data: res
        } = await this.$http.get('categories')
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品分类失败!')
        }

        this.cateList = res.data
        console.log(this.cateList)
      },
      //级联选择框选中项变化会触发这个数组
      handleChange() {
        this.getParamsData()
      },
      //抽离出获取参数列表数据
      async getParamsData() {
        // 证明选中的不是三级分类
        if (this.selectedCateKeys.length !== 3) {
          this.selectedCateKeys = []
          return
        }

        //证明选中的是三级分类
        console.log(this.selectedCateKeys)
        //根据所选分类的Id，和当前所处的面板，获取对应的参数
        const {
          date: res
        } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: {
            sel: this.activeName
          }
        })

        if (res.meta.status !== 200) {
          return this.$message.error('获取参数列表失败！')
        }
        console.log(res.data)
        if (this.activeName === 'many') {
          this.manyTableData = res.data
        } else {
          this.onlyTableData = res.date
        }
      },

      //tab 页签点击的处理函数
      handleClick() {
        console.log(this.activeName)
        this.getParamsData()
      },

      //监听添加对话框的关闭事件,关闭时清空输入框
      addDialogClosed() {
        this.$refs.addFormRef.resetFields()
      },
      //点击确认按钮，添加参数
      addParams() {
        this.$refs.addFormRef.validate(valid => {
          if (!valid) return
          const {
            data: res
          } =
          await this.$http.post(`categories/${this.cateId}/attributes`, {
            attr_name: this.addForm.attr_name,
            attr_ael: this.activeName
          })

          if (res.meta.status !== 201) {
            return this.$message.error('添加参数失败')
          }
          this.$message.success('添加参数成功')
          this.addDialogVisible = false
          this.getParamsData()
        })
      },
      // 点击按钮，展示修改的对话框
      showEditDialog() {

      },
      //重置修改表单
      editDialogClosed() {
        this.$refs.addFormRef.resetFields()
      },
      //
      editParams() {

      }
    },
    computed: {
      //如果按钮需要被禁用，则返回true，否则返回false
      //判断按钮是否被禁用
      isBtnDisabled() {
        if (this.selectedCateKeys.length !== 3) {
          return true
        }
        return false
      },
      // 获取当前选中的三级分类的Id
      cateId() {
        if (this.selectedCateKeys.length === 3) {
          return this.selectedCateKeys[2]
        }
        return null
      },
      // 动态计算dialog标题的文本
      titleText() {
        if (this.activeName === 'many') {
          return '动态参数'
        }
        return '静态属性'
      }
    }


  }

</script>

<style lang="less" scoped>
  .cat_opt {
    margin: 15px 0;
  }

</style>
