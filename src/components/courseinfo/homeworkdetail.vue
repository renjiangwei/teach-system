<template>
  <div>
    <div v-if="submitted && type === 'student'">
      <!-- div显示已经提交内容 -->
      已经提交作业了哦
      <el-card>
        {{ this.homework.content }}
      </el-card>
      <el-card>
        <div>
          {{ this.homeworkDetail.homework_content }}
        </div>
        <div
          class="fileList"
          v-for="(item, index) in homeworkDetail.homework_file_path"
          :key="index"
        >
          {{ getNewPath(item) }}
          <el-button @click.stop="downloadFile(item)"> 下载 </el-button>
        </div>
        <div>提交时间：{{ this.homeworkDetail.homework_create_time }}</div>
        <div>
          得分：{{ this.homeworkDetail.homework_grade }} 评论：{{
            this.homeworkDetail.homework_comment
          }}
        </div>
      </el-card>
    </div>
    <div v-else-if="!submitted && type === 'student'">
      <!-- div显示提交作业内容 -->
      <el-form
        :model="formData"
        :rules="rules"
        ref="ruleForm"
        label-width="0px"
        class="demo-ruleForm"
      >
        <el-card>
          <div>
            {{ this.homework.content }}
          </div>
          <div>
            起始时间：{{ this.homework.create_time }} 截止时间：{{
              this.homework.deadline
            }}
          </div>
        </el-card>
        <el-form-item label="" prop="content">
          <el-input
            v-model="formData.content"
            placeholder="作业内容"
            type="textarea"
            :rows="2"
          ></el-input>
        </el-form-item>
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
            :disabled="disabled"
            >上传到服务器</el-button
          >
          <div slot="tip" class="el-upload__tip">注意只能提交一次哦</div>
        </el-upload>
      </el-form>
    </div>
    <div v-if="type === 'teacher' && noGradeHomeworkList.length">
      <!-- <div v-for="(item,index) in noGradeHomeworkList" :key="index">
        {{item}}
      </div> -->
      剩余{{ noGradeHomeworkList.length }}人没打分
      <el-card>
        {{ homework.content }}
        <br />
        <div v-for="(item, index) in homework.filePathes" :key="index">
          {{ getNewPath(item) }}
        </div>
      </el-card>

      <el-card>
        <div>作业内容：{{ noGradeHomeworkList[0].homework_content }}</div>
        <div
          v-for="(item, index) in noGradeHomeworkList[0].homework_file_path"
          :key="index"
        >
          {{ getNewPath(item) }}
          <el-button @click.stop="downloadFile(item)">下载</el-button>
        </div>
        <div>学生：{{ noGradeHomeworkList[0].stu_name }}</div>
        <div class="block">
          <span class="demonstration">打分（满分10分）</span>
          <el-rate v-model="grade" :colors="colors" :max=10 :allow-half="true"> </el-rate>
        </div>
        <div>
          <el-input v-model="comment" type="textarea">
          </el-input>
          <el-button @click="submmitGrade">提交</el-button>
        </div>
      </el-card>
    </div>
    <div v-else-if="type === 'teacher' && !noGradeHomeworkList.length">没有作业可以评哦</div>
  </div>
</template>
<script>
import moment from "moment";
import { request } from "../../network/request";
import Qs from "querystring"
export default {
  data() {
    return {
      formData: {
        content: "",
      },
      rules: {
        content: [
          { required: true, message: "请输入作业内容", trigger: "blur" },
        ],
      },
      query: {
        id: this.$route.query.id,
        homeworkid: this.$route.query.homeworkid,
      },
      fileList: [],
      files: {},
      submitted: "false", //该学生该课程是否提交了作业。默认没有提交，created函数检测是否提交
      homeworkDetail: {}, //若提交了，将作业信息存进来用于展示
      homework: {}, //将localstorge中的homeworkInfo拿到这里面用于展示
      disabled: false, //存上传按钮的可激活状态
      type: "",
      homeworkList: [], //存教师查询该作业所有人提交的作业
      noGradeHomeworkList: [], //没有成绩的作业的列表
      grade: null,
      comment:'',
      colors: ["#99A9BF", "#F7BA2A", "#FF9900"],
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
    getNewPath(str) {
      //传入服务器上那来的string，处理一下取消掉时间头
      let i = str.indexOf("_");
      let newStr = str.slice(i + 1);
      return newStr;
    },
    handleUploadFile() {
      //自定义提交事件,带文件的
      console.log("handleUploadFile");
      var formData = new FormData();
      // console.log(this.files.files[0].raw);
      let i = 0;
      while (this.files.files[i]) {
        formData.append("files", this.files.files[i].raw);
        i++;
      }
      /*
      stu_id,createtime,homework_content,homework_id
       */
      var date = moment().format("yyyy-MM-DD HH:mm:ss"); //moment库生成msql的datetime类型数据
      var stu_id = JSON.parse(localStorage.getItem("userInfo")).id;
      formData.append("homework_id", this.query.homeworkid);
      formData.append("homework_content", this.formData.content);
      console.log(this.formData.content);
      formData.append("createtime", date);
      formData.append("stu_id", stu_id);
      request({
        method: "post",
        url: "/homework/stuuploadhomework",
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
            },
          });
          this.$message.success("作业创建成功");
        }
      });
    },
    stuHomeworkCheck() {
      let id = JSON.parse(window.localStorage.getItem("userInfo")).id;
      this.homework = JSON.parse(window.localStorage.getItem("homeworkInfo"));
      var date = moment().format("yyyy-MM-DD HH:mm:ss");
      //比较现在时间和作业deadline，如果超过了，将上传按钮设置为disabled
      if (this.homework.deadline > date) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
      //请求是否提交了作业，是则存起来，不是则重置submmitted状态
      request({
        url: "/homework/gethomeworkdetail",
        methods: "get",
        params: {
          homework_id: this.query.homeworkid,
          stu_id: id,
        },
      }).then((res) => {
        if (res.data.code === 200) {
          //如果查到该作业修改状态以及存作业信息
          this.submitted = true;
          this.homeworkDetail = res.data.data;
        } else {
          this.submitted = false; //注意 需要重置为false
        }
      });
    },
    teacherHomeworkCheck() {
      this.homework = JSON.parse(window.localStorage.getItem("homeworkInfo"));
      request({
        url: "/homework/gethomeworkdetailbyid",
        methods: "get",
        params: {
          homework_id: this.query.homeworkid,
        },
      }).then((res) => {
        if (res.data.code == 200) {
          this.homeworkList = res.data.data;
          this.getNoGradeHomework();
        } else if (res.data.code == 404) {
          console.log("还有没有人提交作业");
        }
      });
    },
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (!this.fileList.length) {
            console.log("没有文件时执行的代码");
            //没有文件时post请求，
            //stu_id,createtime,homework_content,homework_id
            var formData = new FormData();
            var createtime = moment().format("yyyy-M-DD HH:mm:ss");
            var stu_id = JSON.parse(window.localStorage.getItem("userInfo")).id;
            var homework_content = this.formData.content;
            var homework_id = this.query.homeworkid;
            formData.append("createtime", createtime);
            formData.append("stu_id", stu_id);
            formData.append("homework_content", homework_content);
            formData.append("homework_id", homework_id);
            request({
              url: "/homework/stuuploadhomework",
              method: "post",
              data: formData,
            }).then((res) => {
              if (res.data.code === 200) {
                this.$router.push({
                  path: "/coursehomework",
                  query: {
                    id: this.query.id,
                  },
                });
                this.$message.success("提交成功");
              }
            });
            return; //不执行下面的
          }
          this.$refs.upload.submit();
        } else {
          this.$message.error("请填写内容");
          return false;
        }
      });
    },
    submmitGrade(){
      console.log("教师提交作业");
      //作业id，学生id，分，评价，
      let homework_id = this.noGradeHomeworkList[0].homework_id
      let stu_homework_stu_id = this.noGradeHomeworkList[0].stu_homework_stu_id
      let grade  = this.grade
      let comment = this.comment
      let data = {
        homework_id:homework_id,
        stu_homework_stu_id:stu_homework_stu_id,
        grade:grade,
        comment :comment,
      }
      request({
        url:'/homework/uploadgrade',
        method:'post',
        data:Qs.stringify(data)
      }).then(res=>{
        location.reload();
        this.$message.success("评分成功")
      })
    },
    //获取当前作业列表中，没有打分的作业的index
    getNoGradeHomework() {
      console.log(this.homeworkList.length);
      if (this.homeworkList.length) {
        //有人上交作业的时候
        let i = 0;
        while (this.homeworkList[i]) {
          if (!this.homeworkList[i].homework_grade) {
            this.noGradeHomeworkList.push(this.homeworkList[i]);
          }
          i++;
        }
      }
    },
    downloadFile(str) {
      console.log(str);
      var i = str.indexOf("_");
      var newStr = str.slice(i + 1);
      console.log("下载该文件" + str);
      request({
        url: "/homework/downloadhomework",
        methods: "get",
        params: {
          url: str,
        },
        responseType: "arraybuffer", //设置返回类型
        // responseType: "blob"
      }).then((res) => {
        let fileData = res.data;
        let url = window.URL.createObjectURL(
          //window.URL.createObjectURL使用方法
          new Blob([fileData], {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          })
        );
        let link = document.createElement("a"); // 例用a标签的download属性实现下载
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", newStr);
        document.body.appendChild(link); // 在页面中动态添加一个a标签
        link.click();
        document.body.removeChild(link); // 点击之后删除该dom节点
        this.$message.info("正在下载");
      });
    },
  },
  created() {
    this.type = window.localStorage.getItem("userType");
    if (this.type === "student") {
      this.stuHomeworkCheck(); //调用学生作业内容展示
    } else if (this.type === "teacher") {
      console.log("teacher");
      this.teacherHomeworkCheck();
    }
  },
};
</script>
<style scoped>
</style>