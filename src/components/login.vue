<template>
  <div class="login_container">
    <div class="login_box">
      <el-form
        label-width="0px"
        class="login_form"
        :model="user"
        :rules="rules"
        ref="loginFormRef"
      >
        <el-form-item prop="name">
          <el-input
            placeholder="请输入账号"
            prefix-icon="iconfont icon-people"
            v-model="user.name"
            oninput="value=value.replace(/[^\d]/g,'')"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码"
            v-model="user.password"
            show-password
            prefix-icon="iconfont icon-lock"
          ></el-input>
        </el-form-item>
        <el-form-item prop="accountType">
          <el-select v-model="value">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { request } from "../network/request.js"; //request是封装的axios
import axios from "axios";
import Qs from "qs";

export default {
  methods: {
    login() {
      //validate()表单预验证，ref
      this.$refs.loginFormRef.validate((valid) => {
        if (!valid) return;
        var data = {
          id: this.user.name,
          password: this.user.password,
        };
        var a = JSON.stringify(data);
        // console.log('JSON:'+a);
        axios.defaults.withCredentials = true; //请求携带cookie
        let b = new URLSearchParams();

        // console.log('Qs:'+Qs.stringify(data));
        b.append("id", this.user.name);
        b.append("password", this.user.password);
        // console.log('urlserchparams:');
        // console.log(b);

        request({
          method: "post",
          url: "/user/login",
          data: Qs.stringify(data),
          // headers:{'Content-Type':'application/x-www-form-urlencoded'}
        }).then((res) => {
          console.log(res);
          if (res.data.code == 200) {
            this.$message.success('登陆成功');
            this.$router.push('/home');//跳转至/home
            console.log(this.$cookies.get('user'));
          }
          else {
            this.$message.error('登录失败')
          }
        }).catch(err=>{
          console.log(err);
          
        });

        // axios({
        //   url:'http://localhost:3000/user/login',
        //   method:'post',
        //   //写到data里一直出错
        //   //ok 01 qs
        //   data : Qs.stringify(data),
        //   headers:{'Content-Type':'application/x-www-form-urlencoded'}

        //   // ok 02 URLSearchParams
        //   // data:b
        // }).then(res=>{
        //   console.log(res);
        // })
        // axios({
        //   url:'http://localhost:3000/user/stuInfo',
        //   method:'get',
        //   params:{
        //     id : this.user.name
        //   }
        // }).then(res=>{
        //   console.log(res);
        // })
      });
    },
    //resetFields()表单重置
    resetForm() {
      // console.log(this);
      this.$refs.loginFormRef.resetFields();
    },
  },
  data() {
    return {
      //下拉框的数据
      options: [
        {
          value: "student",
          label: "学生",
        },
        {
          value: "teacher",
          label: "教师",
        },
      ],
      value: "student",
      //用户数据
      user: {
        name: "1151250215",
        password: "250215",
      },
      //表单验证规则
      rules: {
        name: [
          { required: true, message: "请输入学号", trigger: "blur" },
          {
            min: 8,
            max: 15,
            message: "长度在 8 到 15 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
};
</script>
<style scoped>
.login_container {
  width: 100%;
  height: 100%;
  background-color: #2b4b6b;
}
.login_box {
  width: 450px;
  height: 300px;
  border-radius: 6px;
  background-color: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(0, -50%);
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>