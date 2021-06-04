<template>
  <div id="course-container">
    <div class="main-header">
      <!-- 头部 标题 和 生成课程表 -->
      <span>我的课程</span>
      <el-button @click="getCourseTable">生成课程表</el-button>
      <el-dialog
        title="课程表"
        :visible.sync="dialogVisible"
        width="80%"
        :before-close="handleClose"
      >
        <div>
          
          <table border="1">
            <th v-for="item in week" :key="item.id">{{item.data}}</th>
            <tr v-for="(item, index) in courseTable" :key="index">
              <td class="left">第{{index+1}}节</td>
              <td v-for="(item2, index2) in item" :key="index2">
                <div v-for="(item3, index3) in item2" :key="index3">
                  <!-- {{ item3 }} -->
                  {{ item3.name }}
                  {{ item3.time }}
                  {{ item3.credit }}
                  {{ item3.tname }}
                  {{ item3.course_address }}
                </div>
                <!-- {{ item2 }} -->
              </td>
            </tr>
          </table>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
    <!-- 展示课程 -->
    <el-card
      class="box-card"
      v-for="(item, index) in this.course"
      :key="item.id"
      @click.native="cardClick(index)"
    >
      <div slot="header" class="clearfix">
        <!-- {{ item }} -->
        <span>{{ item.name }}</span>
        <!-- <el-button style="float: right; padding: 3px 0" type="text"
          >操作按钮</el-button
        > -->
      </div>
      <!-- <div v-for="o in 4" :key="o" class="text item">
        {{ "列表内容 " + o }}
      </div> -->
      <div>教师：{{ item.tname }}</div>
      <div>时间：{{ getLessionTime(item) }}</div>
      <div>地点：{{ item.course_address }}</div>
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
      dialogVisible: false,
      courseTable: [], //课程表展示信息的数据
      week:[{
        id:'124',
        data:''
      },{
        id:'123',
        data:'星期一'
      },{
        id:'98',
        data:'星期二'
      },{
        id:'96',
        data:'星期三'
      },{
        id:'95',
        data:'星期四'
      },{
        id:'94',
        data:'星期五'
      },{
        id:'93',
        data:'星期六'
      },{
        id:'90',
        data:'星期日'
      },
      ],
      lessonTime:['第一节','第二节','第三节','第四节','第五节']
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
            // console.log(res.data);
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
      // console.log(this.course[i]);
      // this.$router.push({ path: `/courseinfo/${this.course[i].id}` })
      // this.$router.push({ path: '/homework', query: { plan: 'private' }});
      this.$router.push({
        path: "/courseinfo",
        query: { id: this.course[i].id, name: this.course[i].name },
      });
      //push传入id和name，
      // this.$router.push({ name: 'courseinfo', params: { id: this.course[i].id}});
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    getCourseTable() {
      //生成课程表 3维数组，7代表星期，5代表每天的5节课，第三项数组存课程信息，
      //因为存在一个时间点有两节课，所以用数组存课程对象
      this.dialogVisible = !this.dialogVisible;
      let a = new Array();
      for (let i = 0; i < 5; i++) {
        a[i] = new Array();
        for (let j = 0; j < 7; j++) {
          a[i][j] = new Array();
          // a[i][j][0] = {};
        }
      }
      // let b = {
      //   name: "aaa",
      //   age: 24,
      // };
      // a[0][0].push(b)
      // console.log(a);
      // console.log(a[0][0][0]);

      let i = 0;
      while (this.course[i]) {
        //遍历课程
        let courseDetail = {
          name: this.course[i].name,
          time: this.getLessionTime(this.course[i]),
          credit: this.course[i].credit,
          tname: this.course[i].tname,
          course_address: this.course[i].course_address
        };
        let x = this.course[i].fday;
        let y = this.course[i].ftime;
        let x2 = this.course[i].sday;
        let y2 = this.course[i].stime;
        let x3 = this.course[i].thday;
        let y3 = this.course[i].thtime;
        // console.log(x, y, x2, y2, x3, y3);
        if (x) a[y - 1][x - 1].push(courseDetail);
        if (x2) a[y2 - 1][x2 - 1].push(courseDetail);
        if (x3) a[y3 - 1][x3 - 1].push(courseDetail);
        i++;
      }
      this.courseTable = a;
      console.log(a);
      // console.log(this.courseTable );
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

table {
  border-collapse: collapse;
  width: 90%;
  height: auto;
  margin: auto;
}

table,
th,
td {
  border: 1px solid #000;
}
th{
  height: 20px;
  font-size: 18px;
}

td{
  /* width: 10%; */
  min-width: 18px;
  max-width: 30px;
  height: 120px;
  padding: 10px;
  font-size: 18px;
}
.left{
  background-color: #ccc;
  width: 10px;
}

</style>