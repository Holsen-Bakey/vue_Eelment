<template>
  <div class="login_container">
   <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
      
      }
    },
    methods: {
      //退出按钮
      logout(){
        window.sessionStorage.clear();
        this.$router.push("/login")
      }
    }
  }
</script>

<style lang="less" scoped>
  
</style>
