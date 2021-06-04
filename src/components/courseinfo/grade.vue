<template>
  <div>
    <div v-if="type == 'student'">
      <el-table :data="homeworkList" style="width: 100%">
        <el-table-column prop="homework_content" label="作业内容" width="200">
        </el-table-column>
        <el-table-column prop="create_time" label="作业发布时间" width="200">
        </el-table-column>
        <el-table-column
          prop="stu_homework_content"
          label="提交内容"
          width="200"
        >
        </el-table-column>
        <el-table-column
          prop="stu_homework_create_time"
          label="作业提交时间"
          width="200"
        >
        </el-table-column>
        <el-table-column prop="stu_homework_grade" label="成绩" width="200">
        </el-table-column>
        <el-table-column
          prop="stu_homework_comment"
          label="教师评语"
          width="200"
        >
        </el-table-column>
      </el-table>
    </div>
    <div v-else>
      选择一项作业查看成绩
      <el-card
        class="box-card"
        v-for="(item, index) in this.homeworkList"
        :key="item.homework_id"
        @click.native="homeworkCardClick(item.homework_id, index)"
      >
        <div class="content">{{ item.content }}</div>
        <div
          class="fileList"
          v-for="(item2, index) in item.filePathes"
          :key="index"
        >
          {{ getNewPath(item2) }}
        </div>
        <div class="time">截止日期：{{ item.deadline }}</div>
      </el-card>
    </div>
  </div>
</template>
<script>
import { request } from "../../network/request";
export default {
  data() {
    return {
      query: {
        id: this.$route.query.id, //存了一下query
        name: this.$route.query.name,
      },
      homeworkList: [],
      type: "",
    };
  },
  methods: {
    stuGetHomeworkList() {
      var { id } = JSON.parse(localStorage.getItem("userInfo"));
      console.log(id);
      request({
        url: "/homework/getcoursestuallhomework",
        methods: "get",
        params: {
          stu_id: id,
          scourse: this.query.id,
        },
      }).then((res) => {
        if (res.data.code === 200) {
          this.homeworkList = res.data.data;
        }
      });
    },
    getHomework() {
      request({
        url: "/homework/gethomework",
        methods: "get",
        params: {
          id: this.query.id,
        },
      }).then((res) => {
        if (res.data.code === 200) {
          this.homeworkList = res.data.data;
        }
      });
    },
    getNewPath(str) {
      //传入服务器上那来的string，处理一下取消掉时间头
      let i = str.indexOf("_");
      let newStr = str.slice(i + 1);
      return newStr;
    },
    homeworkCardClick(i, index) {
      console.log("homeworkCardClick", i);
      //将作业题目存在localstorge中，
      // let homeworkInfo = JSON.stringify(this.homeworkList[index]);
      // window.localStorage.setItem("homeworkInfo", homeworkInfo);
      this.$router.push({
        path: "/gradedetail",
        query: {
          id: this.query.id, //课程id
          homeworkid: i, //传的作业id
        },
      });
    },
  },
  created() {
    this.type = window.localStorage.getItem("userType");
    if (this.type === "student") {
      this.stuGetHomeworkList();
    } else {
      this.getHomework();
    }
  },
};
</script>
<style scoped>
</style>