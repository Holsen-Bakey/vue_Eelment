<template>
  <div>
    <!-- 权限给角色，给用户分配角色 -->
    <!-- 1 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 2 卡片视图区域 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table>
        <el-table-column :data="roleList" border stripe>
          <!-- 展开列 -->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-row :class="['bdbottom', i1 === 0?'bdtop':'','vcenter']" v-for="(item1,i1) in scope.row.children"
                :key="item1.id">
                <!-- 渲染一级权限 -->
                <el-col :span="5">
                  <el-tag closable @close='removeRightById(scope.row,item1.id)'>{{item1.authName}}</el-tag>
                  <i class="el-icon-edit"></i>
                </el-col>
                <!-- 渲染二级权限 -->
                <el-col :span="19">
                  <!-- 通过for循环嵌套渲染二级权限 -->
                  <!-- 再分为二级权限和三级权限 -->
                  <el-row :class="[i2 === 0?'':'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key='item2.is'>
                    <el-col :span="6">
                      <el-tag type="success" closable @close='removeRightById(scope.row,item2.id)'>{{item2.authName}}
                      </el-tag>
                      <i class="el-icon-edit"></i>
                    </el-col>
                    <!-- 三级权限区域 -->
                    <el-col :span="18">
                      <el-tag type="warning" v-for="(item3) in item2.children" :key='item3.id' closable
                        @close='removeRightById(scope.row,item3.id)'>{{item3.authName}}
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <pre>
                {{scope.row}}
              </pre>
            </template>
          </el-table-column>
          <!-- 索引列 -->
          <el-table-column type=" index">
          </el-table-column>
          <el-table-column label="角色名称" prop="roleName"></el-table-column>
          <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
          <el-table-column label="操作" width="300px">
            <!-- 添加按钮组件 -->
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-search" size='mini'>编辑</el-button>
              <el-button type="danger" icon="el-icon-search" size='mini'>删除</el-button>
              <el-button type="warning" icon="el-icon-search" size='mini' @click="showSetRightDialog(scope.row)">分配权限
              </el-button>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 3 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
      <!-- 内容主题区域 -->
      <!-- <span>123</span> -->
      <!-- 树形控件 -->
      <el-tree ref="treeRef" :data="rightslist" :props="treeProps" @node-click="handleNodeClick" show-checkbox
        node-key='id' default-expand-all :default-checked-keys="defKeys"></el-tree>

      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        roleList: [],
        roleListT: [{
          "id": 30,
          "roleName": "主管",
          "roleDesc": "技术负责人",
          "children": [{
            "id": 101,
            "authName": "商品管理",
            "path": null,
            "children": [{

            }]

          }]
        }],
        setRightDialogVisible: false, //控制分配权限对话框的显示与隐藏
        rightslist: [], //所有权限的数据
        rightslistT: [{
          "authName": "商品管理",
          "id": 100,
          "path": null,
          chlidren: [{
            "authName": "二级商品管理",
            "id": 110,
            "path": null,
            childern: [{
              "authName": "三级商品管理",
              "id": 111,
              "path": null,
            }]
          }]
        }],
        //树形控件的属性绑定对象
        treeProps: {
          label: 'authName',
          children: 'children'
        },
        //默认选中的节点Id值数组,node-key='id' 以id为节点key
        defKeys: [],
        roleId: '', // 当前即将分配权限的角色Id 
      }
    },
    created() {
      this.getRoleList()
    },
    methods: {
      //获取所有角色列表
      getRoleList() {
        const {
          data: res
        } = await this.$http.get('roles')
        if (res.meta.status != 200) {
          return this.$message.error('获取权限列表失败！')
        }
        this.roleList = res.data
        console.log(this.roleList)
      },
      //tag绑定的删除点击,传入角色ID和三级权限ID
      async removeRightById(role, rightId) {
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
        } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除数据失败')
        }
        // this.getRoleList() 直接调用刷新数据会关闭展开列
        //只更新权限数据即可
        role.children = res.data
      },
      //展示分配权限对话框,使用权限树
      showSetRightDialog(role) {
        this.roleId = role.id
        //获取所有权限数据
        const {
          data: res
        } = await this.$http.get('rights/tree')
        if (res.meta.status !== 200) {
          return this.$message.error('删除数据失败')
        };
        this.rightslist = res.data
        console.log(rightslist)
        //递归获取三级节点的Id
        this.getLeafKeys(role, this.defKeys)
        //显示对话框
        this.setRightDialogVisibl = true
      },
      //通过递归的形式，获取角色权限下所有的三级权限的id，并保存到 defkeys
      // 数组中，在点击分配权限按钮时将已有权限进行树渲染勾选
      getLeafKeys(node, arr) {
        //判断为三级节点 
        if (!node.children) {
          return arr.push(node.id)
        }

        node.children.forEach(item => {
          this.getLeafKeys(item, arr)
        })

      }
    },
    //监听权限分配对话框dialog关闭
    setRightDialogClosed() {
      this.defKeys = [] //清空defKey的数据
    },
    //点击权限分配确定按钮
    allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      console.log(keys) //[105,116,117,150,151,101,104]
      const idStr = keys.join(',') //改为以逗号拼接的字符串
      //发送网络请求
      const {
        data: res
      } = await this.$http.post(`roles/${this.roleId}/rights`, {
        rids: idStr
      })
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      };
      this.$message.success('分配权限成功')
      this.getRoleList()
      //隐藏对话框
      this.setRightDialogVisibl = false
    }


  }

</script>

<style lang="less" scoped>
  .el-tag {
    margin-top: 7px;
  }

  .bdtop {
    border-top: 1px solid #eee;
  }

  .bdtottom {
    border-top: 1px solid #eee;
  }

  //让tag居中对齐
  .vcenter {
    display: flex;
    align-items: center;
  }

</style>
