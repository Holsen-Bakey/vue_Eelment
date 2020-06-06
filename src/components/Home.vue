<!-- menu容器 -->
<template>
  <el-container class="home-container">
    <!-- 头部布局 -->
    <!-- el-header >>> el-container >>> el-aside >>> el-main -->
    <el-header>
      <!-- header顶部内容 -->
      <div>
        <img src="../assets/logo.png" alt />
        <span>The First blood</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏  -->
      <!-- 绑定样式 动态判断宽度支持侧边栏展开与折叠 -->
      <el-aside :width="isCollapse? '64px': '200px'">
        <!-- 顶部伸缩按钮 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏容器  -->
      <!-- el-menu >>> el-submenu/template >>> el-menu-item/template -->
        <!-- 点击时只打开一个  unique-opened && index唯一-->
        <!-- collapse 动态折叠 -->
        <!-- :router="true" index指定为路由模式 -->
        <el-menu background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" unique-opened
          :collapse="isCollapse" :collapse-transition="false" :router="true" :default-active="activePath">
          <!-- 一级菜单 -->
          <!-- 根据后台传过来的数据进行遍历，建立目录列表 -->
          <el-submenu :index="item.id + ''" v-for="item in menuist" :key="item.id">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 循环遍历添加不同的图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <!-- 开启router模式，以 index 作为 path 进行路由跳转 -->
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id"
              @click="saveNavState('/' + subItem.path)">
              <!-- 二级菜单模板区域 -->
              <template slot="title">
                <i :class="iconsObj[item.id]"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- Home的子路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    //页面创建时获取menu列表
    created() {
      this.getMenuList()
      this.activePath = window.sessionStorage.getItem('activePath')
    },
    data() {
      return {
        menulist: [], //菜单列表
        iconsObj: {
          '125': 'iconfont icon-user', //选项的id对icon名字
          '103': 'iconfont icon-user',
          '101': 'iconfont icon-user',
          '102': 'iconfont icon-user',
          '145': 'iconfont icon-user'
        }, //循环添加字体图标
        isCollapse: false,   //是否支持折叠
        activePath: ''  //动态高亮，激活的链接地址
      }
    },
    methods: {
      logout() {
        window.sessionStorage.clear()
        this.$router.push('/login')
      },
      //获取menu菜单
      async getMenuList() {
        const {
          data: res
        } = await this.$http.get('menus')
        if (res.mata.status !== 200) return this.$message.error(res.meta.msg)
        this.menulist = res.data
      },
      //点击按钮切换菜单折叠和展开
      toggleCollapse() {
        this.isCollapse = !this.isCollapse
      },
      //动态高亮，二级选项点击时保存到Storage，页面创建时取出
      saveNavState(activePath) {
        window.sessionStorage.setItem('activePath', activePath)
        this.activePath = activePath     //点击时重新赋值
      }
    }
  }

</script>

<style lang="less" scoped>
  .home-container {
    height: 100%; //最外层布局el-container，撑开主体
  }

  // 头部header
  .el-header {
    display: flex;
    justify-content: space-between;
    background-color: #373d41;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;

    div {
      display: flex;
      align-items: center;

      span {
        margin-left: 15px;
      }
    }

    img {
      width: 40px;
      height: 40px;
    }

    span {
      margin-left: 15px;
    }
  }

  //侧边栏布局
  .el-aside {
    background-color: #373744;

    .el-menu {
      border-right: none; //消除右侧边框线
    }
  }

  //主体布局
  .el-main {
    background-color: #eaedf1;
  }

  .iconfont {
    margin-right: 10px;
  }

  .toggle-button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em; //字间距
    cursor: pointer; //鼠标样式
  }

  // <el-menu>
  //   <!-- 一级菜单 -->
  //   <el-submenu index="1">
  //     <!-- 一级菜单模板区域 -->
  //     <template slot="title">
  //       <!-- 图标 -->
  //       <i class="el-iocn-location"></i>
  //       <!-- 文本 -->
  //       <span>导航一</span>
  //     </template>
  //     <!-- 二级菜单 -->
  //     <!-- 以 index 作为 path 进行路由跳转 -->
  //     <el-menu-item index='1-1'>
  //       <!-- 二级菜单模板区域 -->
  //       <template slot="title">
  //         <!-- 图标 -->
  //         <i class="el-iocn-location"></i>
  //         <!-- 文本 -->
  //         <span>导航一</span>
  //       </template>
  //     </el-menu-item>
  //   </el-submenu>
  // </el-menu>

  // menu data
  //   {
  //   "id":101,
  //   "authName":"商品管理",
  //   "path":null,
  //   "children":[ {
  //               "id": 104,
  //               "authName":"商品列表",
  //               "path":null,
  //               "children":[],
  //     }
  //   ]
  // }

</style>
