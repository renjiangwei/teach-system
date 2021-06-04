<template>
  <el-container class="home-container">
    <el-header>
      <div class="header-left">
        <img src="" />
        <span>教辅系统</span>
      </div>
      <div class="header-right">
        <span>您好{{ name }}!</span>
        <el-button type="info" @click="logout">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
          <el-radio-button :label="false">展开</el-radio-button>
          <el-radio-button :label="true">收起</el-radio-button>
        </el-radio-group> -->
        <div class="toggle-button" @click="toggle">|||</div>
        <el-menu
          :default-active="this.activeIndex"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          :collapse="isCollapse"
          active-text-color=""
          background-color=""
          text-color=""
          :collapse-transition="false"
          
        >
          <!-- 动画关 -->
          <el-menu-item index="/home" @click="course()">
            <i class="el-icon-menu"></i>
            <span slot="title">课程</span>
          </el-menu-item>
          <!-- <el-menu-item index="/homework" @click="homework()">
            <i class="el-icon-menu"></i>
            <span slot="title">作业</span>
          </el-menu-item> -->
          <el-menu-item index="/question" @click="question()">
            <i class="el-icon-document"></i>
            <span slot="title">提问</span>
          </el-menu-item>
          <el-menu-item index="/profile" @click="profile()">
            <i class="el-icon-setting"></i>
            <span slot="title">个人信息</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      isCollapse: false,
      activeIndex:'/home'
    };
  },
  methods: {
    created() {
      console.log("created");
      if (!localStorage.getItem("userInfo")) {
        console.log("localStorge不存在");
      } else {
        let userInfo = JSON.parse(localStorage.getItem("userInfo"));
        this.name = userInfo.name;
      }
      // this.activeIndex = sessionStorage.getItem('activeIndex');
      this.activeIndex = this.$route.path //根据当前路径来设置激活index 动态绑定激活的
    },
    logout() {
      this.$cookies.remove("user");
      this.$cookies.remove("user.sig");
      this.$cookies.remove("userID");
      window.localStorage.removeItem("userInfo");
      window.localStorage.removeItem("userType");
      this.$router.push("/login");
    },
    toggle() {
      this.isCollapse = !this.isCollapse;
    },
    course() {
      this.$router.push("/home");
      // sessionStorage.setItem('activeIndex','/home')
    },
    homework() {
      this.$router.push("/homework");
      // sessionStorage.setItem('activeIndex','/homework')
    },
    question() {
      this.$router.push("/question");
      // sessionStorage.setItem('activeIndex','/question')
    },
    profile() {
      this.$router.push("/profile");
      // sessionStorage.setItem('activeIndex','/profile')
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
  created() {
    this.created();
  },
};
</script>

<style scoped>
.home-container {
  height: 100%;
}
.el-header {
  box-shadow: 0 1px 0 0 #bfbfbf;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1px;
}
.el-header .header-left {
  display: flex;
  font-size: 25px;
}
.el-header .header-right {
  font-size: 20px;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.toggle-button {
  background-color: #ecf5ff;
  font-size: 15px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.el-aside ul{
  border: none;
}
</style>