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
        <el-input v-model="formData.title" placeholder="作业内容"></el-input>
      </el-form-item>
      <div class="block">
        <el-date-picker
          v-model="deadline"
          type="datetime"
          placeholder="选择截止日期"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
        >
        </el-date-picker>
      </div>
      <el-upload
        class="upload-demo"
        ref="upload"
        action="upload"
        :http-request="handleUploadFile"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="fileList"
        :auto-upload="false"
        :on-change="fileChange"
      >
        <el-button slot="trigger" size="small" type="primary"
          >选取文件</el-button
        >
        <el-button
          style="margin-left: 10px"
          size="small"
          type="success"
          @click="submitForm"
          >上传到服务器</el-button
        >
        <div slot="tip" class="el-upload__tip">tip</div>
      </el-upload>
    </el-form>
  </div>
</template>
<script>
import { request } from "../../network/request";
import moment from "moment";
export default {
  data() {
    return {
      formData: {
        title: "",
      },
      deadline: "",
      query: {
        id: this.$route.query.id,
        name: this.$route.query.name,
      },
      rules: {
        title: [{ required: true, message: "请输入作业内容", trigger: "blur" }],
      },
      fileList: [],
      files: {},
    };
  },
  methods: {
    handleRemove(file, fileList) {
      //注意移除选好的文件后，应该同时更新data里的两个数据，否则列表没有及时更新
      console.log(file, fileList);
      this.fileList = fileList; //把表单的fileList存到data里
      this.files["files"] = fileList; //存到files对象的files键值对里
    },
    handlePreview(file) {
      console.log(file);
    },
    fileChange(file, fileList) {
      console.log(file, fileList);
      console.log("--");
      this.fileList = fileList; //把表单的fileList存到data里
      this.files["files"] = fileList; //存到files对象的files键值对里
    },
    handleUploadFile() {
      var formData = new FormData();
      // console.log(this.files.files[0].raw);
      let i = 0;
      while (this.files.files[i]) {
        formData.append("files", this.files.files[i].raw);
        i++;
      }
      var date = moment().format("yyyy-MM-DD HH:mm:ss"); //moment库生成msql的datetime类型数据
      var teacherid = JSON.parse(localStorage.getItem("userInfo")).id;
      formData.append("courseid", this.query.id);
      formData.append("content", this.formData.title);
      formData.append("createtime", date);
      formData.append("deadline", this.deadline);
      formData.append("teacherid", teacherid);
      request({
        method: "post",
        url: "/homework/uploadhomework",
        data: formData,
        Headers: {
          "Content-Type": "application/json;charset=utf8",
          //添加上这个 ，否则node接收的文件参数编码有问题
        },
      }).then((res) => {
        if (res.data.code == 200) {
          this.$router.push({
            path: "/coursehomework",
            query: {
              id: this.query.id,
              name: this.query.name,
            },
          });
          this.$message.success("作业创建成功");
        }
      });
    },
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid && this.deadline) {
          //表单有数据并且填写了deadline时，通过检测
          if (!this.fileList.length) {
            console.log("没有文件时执行的代码");
            //没有文件时post请求，
            var formData = new FormData();
            var date = moment().format("yyyy-M-DD HH:mm:ss");
            var teacherid = JSON.parse(localStorage.getItem("userInfo")).id;
            formData.append("courseid", this.query.id);
            formData.append("content", this.formData.title);
            formData.append("createtime", date);
            formData.append("deadline", this.deadline);
            formData.append("teacherid", teacherid);
            request({
              url: "/homework/uploadhomework",
              method: "post",
              data: formData,
            }).then((res) => {
              if (res.data.code == 200) {
                this.$router.push({
                  path: "/coursehomework",
                  query: {
                    id: this.query.id,
                    name: this.query.name,
                  },
                });
                this.$message.success("作业创建成功");
              }
            });
            //不执行下面的submit方法了，如果有文件，则执行下面的代码，避免两次post
            return;
          }
          this.$refs.upload.submit();
        } else {
          this.$message.error("请填作业内容或作业截止日期");
          return false;
        }
      });
    },
  },

  created() {},
};
</script>
<style scoped>
</style>