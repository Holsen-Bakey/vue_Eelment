<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
        <!-- 登录表单区域-->
        <el-form label-width="0px" class="login_form" :model="loginForm" :rules="loginFormRules">
          <el-form-item prop="name">
            <el-input v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="loginForm.password" type='password'></el-input>
          </el-form-item>
          <!-- 按钮区域 -->
          <el-row class="btns">
            <el-button type="primary" @click="login">登陆</el-button>
            <el-button type="info">重置</el-button>
          </el-row>
        </el-form>
        <!-- 登录表单区域 end-->


      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        //登陆表单的数据对象
        loginForm: {
          username: "",
          password: ""
        },
        //表单的验证规则对象
        loginFormRules: {
          name: [{
              required: true,
              message: '请输入活动名称',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 10,
              message: '长度在 3 到10 个字符',
              trigger: 'blur'
            }
          ]
        }

      }
    },
    methods: {
      //点击按钮重置登陆表单
      resetLoginForm() {
        this.$refs.loginFormRef.resetFields();
      },
      login() {
        this.$refs.loginFormRef.validate(async valid => {
          if (!valid) return;
          const {
            data: res
          } = await this.$http.post('login', this.loginForm);
          if (res.meta.status !== 200)
            return this.$message.error('登陆失败!')
          this.$message.error('登陆成功!')
          window.sessionStorage.setItem("token", res.data.token);
          this.$router.push('/home')

        })

        //test
        // const result = this.$http.get('/user/userinfo').then((res) => {
        //   console.log(res)
        // });

        //test2
        // async login
        // const res = await this.$http.get('/user/userinfo')
        // console.log(res)

      }
    }
  }

</script>

<style lang="less" scoped>
  .login_container {
    height: 100%;
    background-color: green;
  }

  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

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
        background-color: rosybrown;
      }
    }

    .btns {
      display: flex;
      justify-content: flex-end;
    }

    .login_form {
      width: 100%;
      height: 200px;
      padding: 0 10px;
      box-sizing: border-box;
      background-color: rosybrown;
    }
  }

</style>
