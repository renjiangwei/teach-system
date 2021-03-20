<template>
  <div>
    <el-form
      :model="formData"
      :rules="rules"
      ref="ruleForm"
      label-width="0px"
      class="demo-ruleForm"
    >
      <el-form-item label="" prop="title">
        <el-input v-model="formData.title" placeholder="公告标题"></el-input>
      </el-form-item>
      <el-form-item label="" prop="content">
        <el-input
          type="textarea"
          v-model="formData.content"
          placeholder="公告内容"
          :rows="6"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >立即创建</el-button
        >
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
//     INSERT INTO notice (course_info_id,notice_title,notice_content,notice_time ,teacher_id)
//      VALUES
//      (1,'title','contents','2021-03-02 08:12:51','11223344')

//      var date = moment().format("yyyy-M-DD HH:mm:ss")//moment库生成msql的datetime类型数据
//       console.log(date);
// var data = {
//         course_info_id : this.query.id,
//         notice_title :"qwe",//表单数据
//         notice_content :"asd" ,//表单数据
//         notice_time : moment().format("yyyy-M-DD HH:mm:ss"),
//         teacher_id :JSON.parse(window.localStorage.getItem("userInfo")).id //再测试
//       }
import moment from "moment";
import { request } from "../../network/request";
import Qs from "querystring";
export default {
  data() {
    return {
      formData: {
        title: "",
        content: "",
      },
      query: {
        id: this.$route.query.id,
        name: this.$route.query.name,
      },
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        content: [{ required: true, message: "请输入内容", trigger: "blur" }],
      },
    };
  },
  methods: {
    submitNotice() {
      var date = moment().format("yyyy-M-DD HH:mm:ss"); //moment库生成msql的datetime类型数据
      var userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
      //先不做本地的userInfo是否存在的检测
      var data = {
        course_info_id: this.query.id,
        notice_title: this.formData.title, //表单数据
        notice_content: this.formData.content, //表单数据
        notice_time: date,
        teacher_id: userInfo.id, //再测试
      };
      console.log(data);
      request({
        url: "/notice/addnotice",
        method: "post",
        data: Qs.stringify(data),
      }).then((res) => {
        if (res.data.code == 200) {
          this.$message.success("提交成功");
          this.$router.push({
            path: "/notice",
            query: {
              id: this.query.id,
              name: this.query.name,
            },
          });
        } else {
          this.$message.error("提交失败");
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert("submit!");
          this.submitNotice();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
  created() {},
};
</script>
<style scoped>
</style>