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
      <!--  2.1 栅格布局管理 行 -->
      <el-row :gutter="20">
        <!-- 栅格第一列 -->
        <el-col :span="7">
          <!-- 搜索框 -->
          <!-- 双向绑定 queryInfo.query 实现搜索 清空时重新查询全部-->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <!-- 栅格第二列 -->
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 2.2 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <!-- 使用作用域插槽 插入switch开关 -->
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged()"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="170px">
          <template slot-scope="scope">
            {{scope.row}}
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)">
            </el-button>
            <!-- 分配按钮 文字提示 -->
            <el-tooltip effect="dark" content="分配角色 " placement="top" :enterable="false" @click="setRole(scope.row)">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 2.3 底部分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[100, 200, 300, 400]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 3 dialog弹出框，添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主题区域 -->
      <!-- <span>123</span> -->
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="70px">
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="eamil">
          <el-input v-model="addForm.eamil"></el-input>
        </el-form-item>
        <!-- 手机 -->
        <el-form-item label="用户名" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 4 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close='editDialogClosed'>
      <!-- <span>这是一段信息</span> -->
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="70px">
        <!-- 用户名 禁用-->
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password"></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="eamil">
          <el-input v-model="editForm.eamil"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 5 分配角色的对话框 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" @close='setRoleDialogClosed'>
      <!-- <span>这是一段信息</span> -->
      <div>
        <p>当前的用户：{{userinfo.username}}</p>
        <p>当前的角色：{{userinfo.role_name}}</p>
        <!-- 角色下拉列表 -->
        <el-select v-model='selectedRoleId' placeholder="请选择">
          <el-option v-for="item in rolesList" :key=item.id :label="item.roleName" :value="item.id"></el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      //自定义校验规则 
      var checkEmail = (rule, value, cb) => { //验证邮箱的规则
        //验证邮箱的正则表达式
        const regEmail = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/
        if (regEmail.test(value)) {
          return cb() //合法的邮箱
        }
        cb(new Error('请输入合法的邮箱')) //非法邮箱
      }

      var checkMobile = () => { //验证手机号
        const regMobile = /0?(13|14|15|18|17)[0-9]{9}/
        if (regMobile.test(value)) {
          return cb() //合法的邮箱
        }
        cb(new Error('请输入合法手机号')) //非法邮箱
      }
      // 数据区域 start
      return {
        userlist: [], //用户列表数据对象集合
        queryInfo: {
          query: '',
          pagenum: 1, //当前的页码
          pagesize: 2 //当前每页显示多少条数据  
        },
        total: 0, //返回数据的总数
        addDialogVisible: false, //控制添加dialog显示与隐藏
        //添加用户的表单数据
        addForm: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        editForm: {}, //查询到的用户对话框的数据对象
        editDialogVisible: false, //控制修改dialog显示与隐藏
        setRoleDialogVisible: false, //控制角色分配dialog显示与隐藏
        userInfor: {}, //需要被分配权限的用户信息
        rolesList: [], //角色列表
        selectedRoleId: '', //已选中的角色Id值
        // userlistTrue: [{
        // "id": 25,
        // "username": "tom",
        // "mobile": "111111111",
        // "type": 1,
        // "email": "tom@126.com",
        // "create_time": "2019-11-09T20:36:26",
        // "mg_state": true,
        // "role_name": "admin",
        // }, {
        // "id": 25,
        // "username": "tom",
        // "mobile": "111111111",
        // "type": 1,
        // "email": "tom@126.com",
        // "create_time": "2019-11-09T20:36:26",
        // "mg_state": true,
        // "role_name": "admin",
        // }],
        addFormRules: {
          username: [{
              required: true,
              message: '请输入登录名称',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 10,
              message: '长度在3 到 10 个字符',
              trigger: 'blur'
            }
          ],
          password: [{
              required: true,
              message: '请输入登录名称',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 10,
              message: '长度在3 到 10 个字符',
              trigger: 'blur'
            }
          ],
          email: [{
              required: true,
              message: '请输入邮箱',
              trigger: 'blur'
            }, {
              validator: checkEmail,
              trigger: 'blur'
            }

          ],
          mobile: [{
              required: true,
              message: '请输入登录名称',
              trigger: 'blur'
            },
            {
              validator: checkMobile,
              trigger: 'blur'
            }
          ],
        },
        editFormRules: {
          // 同 addFormRules
        }
      }
    },
    created() {
      this.getUserList()
    },
    methods: {
      //获取用户列表数据
      async getUserList() {
        const {
          data: res
        } = await this.$http.get('users', {
          params: this.queryInfo
        })
        if (res.meta.status != 200) {
          return this.$message.error('获取用户列表失败！')
        }
        this.userlist = res.data.user
        this.total = res.data.total
      },

      //监听pageSize变化
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getUserList()
      },

      //监听页码值改变的事件
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getUserList()
      },

      //监听表格中switch开关的切换
      async userStateChanged(useroinfo) {
        const {
          data: res
        } = await this.$http.put(
          `users/${userinfo.id}/state/${userinfo.mg_state}`
        )
        if (res.meta.status !== 200) {
          userinfo.mg_state = !userinfo.mg_state //失败后状态取反返回
          return this.$message.error('更新状态失败！')
        }
        this.$message.success('更新用户状态成功！')
      },
      //监听添加对话框关闭清空表格内容
      addDialogClosed() {
        this.$refs.addFormRef.resetFields()
      },

      //点击删除按钮
      async removeUserById(id) {
        //弹框询问
        const confirmResult = await this.$confirm('此操作将永久删除数据，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除')
        }
        //如果用户确认删除，则返回值为字符串 confirm 
        //取消删除则返回 cancel
        consoel.log(confirmResult)
        //没有取消则发送网络请求
        const {
          data: res
        } = await this.$http.delete('users/' + id)
        if (res.meta.status !== 200) {
          return this.$message.error('删除数据失败')
        }
        this.$message.success('删除用户成功')
      },
      //点击dialog确定按钮添加用户
      addUser() {
        //首先进行表单内容的预校验
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) return
          //valid为true，校验通过，可以发起网络请求
          const {
            data: res
          } = await this.$http.post('user', this.addForm)
          if (res.meta.status !== 201) {
            this.$message.error('添加用户失败！')
          }
          this.$message.success('添加用户成功！')
          //隐藏添加用户的对话框
          this.addDialogvisible = false
          //添加后重新获取用户列表
          This.getUserList()
        })
      },
      //点击修改用户对话框
      showEditDialog(id) {
        console.log(id)
        const {
          data: res
        } = await this.$http.get('users/' + id)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败！')
        }
        this.$message.success('添加用户成功！')
        this.editForm = res.data
        this.addDialogvisible = true
      },
      //对话框取消时，清空输入框内容
      editDialogClosed() {
        this.$refs.editFormRef.resetFields()
      },
      //修改用户信息并提交
      editUserInfo() {
        // editDialogVisible = false
        this.$refs.editFormRef.validate(valid => {
          if (!valid) return
          //发起请求修改信息
          const {
            data: res
          } = await this.$http.put('users/' + this.editForm.id, {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          })
          if (res.meta.status !== 201) {
            this.$message.error('更新用户失败！')
          }
          this.$message.success('更新用户成功！')
          //隐藏更新用户的对话框
          this.addDialogvisible = false
          //更新后重新获取用户列表
          This.getUserList()
        })
      },
      //展示分配角色的对话框
      setRole(userinfor) {
        this.userInfor = userinfo

        //在展示对话框之前获取所有的角色列表
        const {
          data: res
        } = await this.$http.get('roles')
        if (res.meta.status !== 201) {
          this.$message.error('获取角色列表失败！')
        }

        this.rolesList = res.data
        this.setRoleDialogVisible = true
      },
      // 点击确定按钮，分配角色
      saveRoleInfo() {
        if (!this.selectedRoleId) {
          return this.$message.error('请选择要分配的角色！')
        }
        //否则则发送网络请求
        const {
          data: res
        } = await this.$http.put(`users/$[this.userInfo.id]/role]`, {
          rid: this.selectedRoleId
        })
        if (res.meta.status !== 201) {
          this.$message.error('获取角色列表失败！')
        }
        this.$message.success('获取角色列表success！')
        this.getUserList()
        this.setRoleDialogVisible = false
      },
      // 监听分配角色对话框的关闭事件
      setRoleDialogClosed() {
        this.selectedRoleId = ''
        this.userInfo = {}
      }
    }
  }

</script>

<style lang="less" scoped>
</style>
