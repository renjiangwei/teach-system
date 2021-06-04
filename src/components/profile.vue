<template>
  <div>
    <!-- 学生 -->
    <div v-if="this.userType === 'student'">
      <div>
        学号：
        <el-input
          v-model="id"
          :placeholder="this.info.id"
          oninput="value=value.replace(/[^\d]/g,'')"
          disabled
        ></el-input>
      </div>
      <div>
        姓名：
        <el-input
          v-model="name"
          placeholder="姓名"
          maxlength="20"
          show-word-limit
          >{{ this.name }}</el-input
        >
      </div>
      <div>
        性别：
        <el-input v-model="sex" placeholder="性别" disabled></el-input>
      </div>
      <div>
        学院：
        <el-input v-model="dep" placeholder="学院名" disabled></el-input>
      </div>
      <div>
        专业：
        <el-input v-model="mname" placeholder="专业名" disabled></el-input>
      </div>
      <div>
        年龄：
        <el-input
          v-model="age"
          placeholder="年龄"
          oninput="value=value.replace(/[^\d]/g,'')"
          maxlength="2"
          show-word-limit
        ></el-input>
      </div>
      <div>
        班级：
        <el-input
          v-model="classes"
          :placeholder="this.info.class"
          disabled
        ></el-input>
      </div>
      <div>
        电话：
        <el-input
          v-model="phone"
          placeholder="电话"
          oninput="value=value.replace(/[^\d]/g,'')"
          maxlength="11"
          show-word-limit
        ></el-input>
      </div>
      <div>
        邮箱：
        <el-input v-model="email" placeholder="邮箱"> </el-input>
      </div>

      <div>
        <el-button @click="submit()" type="success">提交</el-button>
      </div>
    </div>

    <!-- 教师 -->
    <div v-else>
      <div>
        学号：
        <el-input
          v-model="id"
          :placeholder="this.teainfo.id"
          oninput="value=value.replace(/[^\d]/g,'')"
          disabled
        ></el-input>
      </div>
      <div>
        学院：
        <el-input v-model="dep" placeholder="学院名" disabled></el-input>
      </div>
      <div>
        姓名：
        <el-input
          v-model="name"
          placeholder="姓名"
          maxlength="20"
          show-word-limit
          >{{ this.name }}</el-input
        >
      </div>
      <div>
        性别：
        <el-input v-model="sex" placeholder="性别" disabled></el-input>
      </div>
      <div>
        年龄：
        <el-input
          v-model="age"
          placeholder="年龄"
          oninput="value=value.replace(/[^\d]/g,'')"
          maxlength="2"
          show-word-limit
        ></el-input>
      </div>
      <div>
        电话：
        <el-input
          v-model="phone"
          placeholder="电话"
          oninput="value=value.replace(/[^\d]/g,'')"
          maxlength="11"
          show-word-limit
        ></el-input>
      </div>
      <div>
        邮箱：
        <el-input v-model="email" placeholder="邮箱"> </el-input>
      </div>
      
      
      <div>
        <el-button @click="submit()" type="success">提交</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { request } from "../network/request";
import Qs from "querystring";
export default {
  methods: {
    initInfo() {
      this.id = this.info.id;
      this.name = this.info.name;
      this.age = this.info.age;
      this.classes = this.info.class;
      this.phone = this.info.phone;
      this.email = this.info.email;
      this.sex = this.info.sex;
      this.mname = this.info.mname;
      this.dep = this.info.dep;
    },
    teaInitInfo() {
      this.id = this.teainfo.id;
      this.name = this.teainfo.name;
      this.age = this.teainfo.age;
      this.phone = this.teainfo.phone;
      this.email = this.teainfo.email;
      this.sex = this.teainfo.sex;
      this.dep = this.teainfo.dep;
    },
    submit() {
      let data = {
        id: this.id,
        name: this.name,
        age: this.age,
        phone: this.phone,
        email: this.email,
      };
      if (this.userType === "student") {
        request({
          method: "post",
          url: "user/updatestuinfo",
          data: Qs.stringify(data),
        }).then((res) => {
          if (res.data.code == 200) {
            this.$message.success("修改成功");
            let userInfo = {
              id: this.id,
              name: this.name,
              age: this.age,
              class: this.classes,
              phone: this.phone,
              email: this.email,
              sex: this.sex,
              mname: this.mname,
              dep: this.dep,
            };
            localStorage.setItem("userInfo", JSON.stringify(userInfo));
            location.reload();
          }
        });
      } else {
        request({
          method: "post",
          url: "user/updateteainfo",
          data: Qs.stringify(data),
        }).then((res) => {
          if (res.data.code == 200) {
            this.$message.success("修改成功");
            let userInfo = {
              id: this.id,
              name: this.name,
              age: this.age,
              phone: this.phone,
              email: this.email,
              sex: this.sex,
              dep: this.dep,
            };
            localStorage.setItem("userInfo", JSON.stringify(userInfo));
            location.reload();
          }
        });
      }
    },
  },
  data() {
    return {
      info: {},
      teainfo: {},
      userType: "",
      id: "",
      name: "",
      age: "",
      classes: "",
      phone: "",
      email: "",
      sex: "",
      mname: "",
      dep: "",
    };
  },
  created() {
    this.userType = localStorage.getItem("userType");
    let id = JSON.parse(localStorage.getItem("userInfo")).id;
    if (this.userType == "student") {
      request({
        method: "get",
        url: "/user/stuInfo",
        params: {
          id: id,
        },
      }).then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          this.info = res.data.data;
          this.initInfo();
        }
      });
    } else {
      request({
        method: "get",
        url: "/user/teaInfo",
        params: {
          id: id,
        },
      }).then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          this.teainfo = res.data.data;
          this.teaInitInfo();
        }
      });
    }
  },
};
</script>
<style scoped>
.el-input {
  width: 300px;
}
div {
  margin-bottom: 20px;
}
</style>