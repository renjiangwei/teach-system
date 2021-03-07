<template>
  <div>
    <!-- <div class="class-name">{{this.$route.params.id}}</div> -->
    <div class="class-name">
      {{ this.courseinfo.cname + "（" + this.courseinfo.num + "班）" }}
    </div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
    >
      <el-menu-item
        v-for="(item, index) in this.navbarList"
        :index="item.path"
        :key="item.id"
        @click="navbarClick(index)"
        >{{ item.name }}</el-menu-item
      >
    </el-menu>
    <div class="line"></div>
    <router-view></router-view>
    <!-- 这里是子模板 -->
  </div>
</template>
<script>
import { request } from "../network/request";
export default {
  data() {
    return {
      activeIndex: "/courseinfo",
      navbarList: [
        {
          id: "1",
          name: "课件",
          path: "/courseinfo",
        },
        {
          id: "2",
          name: "作业",
          path: "/coursehomework",
        },
        {
          id: "3",
          name: "公告",
          path: "/notice",
        },
        {
          id: "4",
          name: "问答",
          path: "/questioninfo",
        },
        {
          id: "5",
          name: "成绩",
          path: "/grade",
        },
      ],
      courseinfo: {},
      sc: [],
      tc:[],
      query: {
        id: this.$route.query.id,
        name: this.$route.query.name,
      },
      auth: false, //权限默认为假，判断query中课程id为该人选课时，改为真
    };
  },
  methods: {
    navbarClick(index) {
      // console.log(this.navbarList[index].name);
      this.$router.push({
        path: this.navbarList[index].path, //对应列表中的path属性，现在是写死的，可以从后端请求
        query: {
          id: this.$route.query.id,
          name: this.$route.query.name, //附带query传递参数
        },
      });
    },
  },
  created() {
    //创建完成时候根据当前路径名称，设置activeIndex，从而保证刷新界面，对应导航栏处于active状态
    //依据 element中:default-active="activeIndex"设置当前active页面
    //所以每一项的index属性设置成对应的path
    //如果要从服务器端返回navbar数据的话，带上path，设置为每一项的index值
    this.activeIndex = this.$route.path;
    //查询学生id对应的课程里是否有 $route.query.id 这个id值，
    //如果没有，警告没有权限（防止手动修改url里query的id）
    //如果有，则查询课程信息，用于此模板展示
    let id = JSON.parse(localStorage.getItem("userInfo")).id;
    let type = localStorage.getItem("userType");

    if (type === "student") {
      request({
        url: "/course/sc",
        methods: "get",
        params: {
          id: id,
        },
      })
        .then((res) => {
          if (res.data.code === 200) {
            this.sc = res.data.lesson; //将学生选课信息存起来，
            return request({
              url: "/course/courseinfobyid",
              methods: "get",
              params: {
                id: this.query.id,
              },
            });
          } else {
            return;
          }
        })
        .then((res) => {
          //res第二个请求的结果，也就是该课程的具体信息，通过赋值给this.courseinfo用于vue展示具体信息
          this.courseinfo = res.data.lesson;
          if (res.data.code === 200) {
            let i = 0;
            while (this.sc[i]) {
              if (this.sc[i].course_info_id == this.query.id) {
                this.auth = true;
              }
              i++;
            }
          }
          if (!this.auth) {
            // history.back();
            this.$router.go(-1);
            window.onload = ()=>{
              this.$message.error("没有该课程权限");
            }
          }
        });
    } else if (type === "teacher") {
      //教师的情况
      request({
        url: "/course/tc",
        methods: "get",
        params: {
          id: id,
        },
      })
        .then((res) => {
          if (res.data.code === 200) {
            this.tc = res.data.lesson; //将教师选课信息存起来，
            return request({
              url: "/course/courseinfobyid",
              methods: "get",
              params: {
                id: this.query.id,
              },
            });
          } else {
            return;
          }
        })
        .then((res) => {
          //res第二个请求的结果，也就是该课程的具体信息，通过赋值给this.courseinfo用于vue展示具体信息
          this.courseinfo = res.data.lesson;
          if (res.data.code === 200) {
            let i = 0;
            while (this.tc[i]) {
              if (this.tc[i].course_info_id == this.query.id) {
                this.auth = true;
              }
              i++;
            }
          }
          if (!this.auth) {
            this.$message.error("没有该课程权限");
            this.$router.go(-1)
          }
        });
    }
  },
};
</script>
<style scoped>
.class-name {
  font-size: 20px;
}
.el-menu {
  margin-top: 15px;
  margin-left: 20px;
}
</style>