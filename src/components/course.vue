<template>
  <div id="course-container">
    <div class="main-header">
      <span>我的课程</span>
      <el-button>生成课程表</el-button>
    </div>
    <el-card
      class="box-card"
      v-for="(item, index) in this.course"
      :key="item.id"
      @click.native="cardClick(index)"
    >
      <div slot="header" class="clearfix">
        <span>{{ item.name }}</span>
        <el-button style="float: right; padding: 3px 0" type="text"
          >操作按钮</el-button
        >
      </div>
      <!-- <div v-for="o in 4" :key="o" class="text item">
        {{ "列表内容 " + o }}
      </div> -->
      <div>教师：{{ item.tname }}</div>
      <div>时间：{{ getLessionTime(item) }}</div>
    </el-card>
  </div>
</template>
<script>
import { request } from "../network/request";
export default {
  data() {
    return {
      course: [], //数组存放课程信息
      // type:'',
      // tnameshow: true// 是否显示课程的教师名，如果是教师端看的话，就不必显示教师名了
    };
  },
  computed: {
    lessonCount() {
      return this.lesson.length;
    },
  },

  methods: {
    getCourse() {
      // let id = this.$store.state.userID//从vuex中获取用户id，不行，vuex刷新就没了
      // this.type = window.localStorage.getItem("userType");
      // if(this.type=='teacher'){//修改tnameshow
      //   this.tnameshow = false
      // }
      if (window.localStorage.getItem("userType") == "teacher") {
        //获取用户类型type
        console.log("获取教师课程安排");
        let { id } = JSON.parse(localStorage.getItem("userInfo")); //转成对象，解构id
        request({
          url: "/course/teachercoursebyid",
          methods: "get",
          params: {
            id: id,
          },
        })
          .then((res) => {
            console.log(res.data);
            this.course = res.data.lesson;
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        console.log("获取学生课程安排");
        let { id } = JSON.parse(localStorage.getItem("userInfo")); //转成对象，解构id
        request({
          url: "/course/coursebyid",
          methods: "get",
          params: {
            id: id,
          },
        })
          .then((res) => {
            this.course = res.data.lesson;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    getLessionTime(lessonObj) {
      var msg = "";
      switch (lessonObj["fday"]) {
        case 1:
          msg += "星期一 ";
          break;
        case 2:
          msg += "星期二 ";
          break;
        case 3:
          msg += "星期三 ";
          break;
        case 4:
          msg += "星期四 ";
          break;
        case 5:
          msg += "星期五 ";
          break;
        case 6:
          msg += "星期六 ";
          break;
        case 7:
          msg += "星期日 ";
          break;
      }
      switch (lessonObj["ftime"]) {
        case 1:
          msg += "8:00-9:50 ";
          break;
        case 2:
          msg += "10:10-12:00 ";
          break;
        case 3:
          msg += "14:00-13:50 ";
          break;
        case 4:
          msg += "16:10-18:00 ";
          break;
        case 5:
          msg += "19:00-20:50 ";
          break;
      }
      switch (lessonObj["sday"]) {
        case 1:
          msg += "星期一 ";
          break;
        case 2:
          msg += "星期二 ";
          break;
        case 3:
          msg += "星期三 ";
          break;
        case 4:
          msg += "星期四 ";
          break;
        case 5:
          msg += "星期五 ";
          break;
        case 6:
          msg += "星期六 ";
          break;
        case 7:
          msg += "星期日 ";
          break;
      }
      switch (lessonObj["stime"]) {
        case 1:
          msg += "8:00-9:50 ";
          break;
        case 2:
          msg += "10:10-12:00 ";
          break;
        case 3:
          msg += "14:00-13:50 ";
          break;
        case 4:
          msg += "16:10-18:00 ";
          break;
        case 5:
          msg += "19:00-20:50 ";
          break;
      }
      switch (lessonObj["thday"]) {
        case 1:
          msg += "星期一 ";
          break;
        case 2:
          msg += "星期二 ";
          break;
        case 3:
          msg += "星期三 ";
          break;
        case 4:
          msg += "星期四 ";
          break;
        case 5:
          msg += "星期五 ";
          break;
        case 6:
          msg += "星期六 ";
          break;
        case 7:
          msg += "星期日 ";
          break;
      }
      switch (lessonObj["thtime"]) {
        case 1:
          msg += "8:00-9:50 ";
          break;
        case 2:
          msg += "10:10-12:00 ";
          break;
        case 3:
          msg += "14:00-13:50 ";
          break;
        case 4:
          msg += "16:10-18:00 ";
          break;
        case 5:
          msg += "19:00-20:50 ";
          break;
      }
      msg += "第" + lessonObj["start"] + "周-" + "第" + lessonObj["end"] + "周";
      return msg;
    },
    cardClick(i) {
      console.log("cardClick");
      console.log(this.course[i]);
      // this.$router.push({ path: `/courseinfo/${this.course[i].id}` })
      // this.$router.push({ path: '/homework', query: { plan: 'private' }});
      this.$router.push({
        path: "/courseinfo",
        query: { id: this.course[i].id, name: this.course[i].name },
      });
      //push传入id和name，
      // this.$router.push({ name: 'courseinfo', params: { id: this.course[i].id}});
    },
  },
  created() {
    this.getCourse();
  },
};
</script>
<style scoped>
#course-container {
  width: 80%;
  height: 100%;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.main-header {
  width: 100%;
  height: 30px;
  font-size: 20px;
  display: flex;
  justify-content: space-between;
}
.main-header .el-button {
  line-height: 0px;
}
.box-card {
  width: 300px;
  height: 200px;
  float: left;
  margin-left: 30px;
  margin-bottom: 20px;
  margin-top: 20px;
  cursor: pointer;
}
.box-card span {
  font-size: 24px;
}
</style>