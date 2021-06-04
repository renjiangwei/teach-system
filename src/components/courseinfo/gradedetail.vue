<template>
  <div>
   
    <el-table :data="homeworkList" style="width: 100%">
      <el-table-column prop="stu_homework_stu_id" label="学生id" width="200">
      </el-table-column>
      <el-table-column prop="stu_name" label="学生姓名" width="200">
      </el-table-column>
      <el-table-column prop="homework_content" label="学生作业内容" width="200">
      </el-table-column>
      <el-table-column prop="homework_create_time" label="作业提交时间" width="200">
      </el-table-column>
      <el-table-column prop="homework_grade" label="成绩" width="200">
      </el-table-column>
      <el-table-column prop="homework_comment" label="教师评语" width="200">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { request } from "../../network/request";
export default {
  data() {
    return {
      query: {
        id: this.$route.query.id,
        homeworkid: this.$route.query.homeworkid,
      },
      homeworkList: [],
    };
  },
  methods: {
    getHomework() {
      request({
        url: "/homework/gethomeworkdetailbyid",
        methods: "get",
        params: {
          homework_id: this.query.homeworkid,
        },
      }).then((res) => {
        if (res.data.code === 200) {
          this.homeworkList = res.data.data;
        }
      });
    },
  },
  created() {
    this.getHomework();
  },
};
</script>

<style>
</style>