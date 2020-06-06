<template>
  <div class="login_container">
    <!-- 登录框 -->
    <div class="login_box">
      <!-- 登陆头像 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 登陆表单区域 -->
      <!-- form 表单  el-form >>> el-form-item >>> el-input -->
      <!-- :model="loginForm" 数据绑定 -->
      <!-- :rules="loginFormRules" 表单验证 -->
      <el-form ref="loginFormRef" :rules="loginFormRules" label-width="0px" :model="loginForm" class="login_form">
        <!-- 名称表单item -->
        <!-- prop="username" 表单验证分支 -->
        <el-form-item prop="username">
          <!-- input输入框 -->
          <!-- v-model="loginForm.username"  数据绑定分支 -->
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码表单item -->
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" prefix-icon="iconfont icon-lock"></el-input>
        </el-form-item>
        <!-- 按钮表单item -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'login',
    data() {
      return {
        loginForm: {
          username: 'zs',
          password: '123'
        },
        loginFormRules: {
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
              message: '请输入登录密码',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 6,
              message: '长度在3 到 10 个字符',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {
      //点击按钮重置表单
      resetLoginForm() {
        this.$refs.loginFormRef.resetFields()
      },

      //登录按钮，表单预验证后发送网络请求
      login() {
        this.$refs.loginFormRef.validate(async (valid) => {
          console.log(valid) //表单验证通过则为true 
          if (!valid) return
          const {
            data: res  //从返回值data中解构出res
          } = await this.$http.post('login', this.loginForm)

          if (res.meta.status !== 200) return this.$message.error('fail!')
          this.$message.success('success!')
        })

        //登陆成功后保存和跳转
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      }

      
    }
  }

</script>

<style lang="less" scoped>
  .login_container {
    background-color: #2b4b6b;
    height: 100%;
  }

  //登陆框
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    // 登陆头像
    .avatar_box {
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }

  // form表单
  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }

  // 按钮item
  .btns {
    display: flex;
    justify-content: flex-end;
  }

</style>
