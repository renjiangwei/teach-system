<template>
  <div>
    <el-input
      placeholder="请输入问题"
      v-model="questionValue"
      type="textarea"
      :rows="3"
      ref="input"
    ></el-input>
    <el-button type="success" @click="submmit">提交</el-button>
    <el-button type="info" @click="reset">重置</el-button>
  </div>
</template>
<script>
import { request } from '../../network/request';
import Qs from 'querystring'
import moment from 'moment'
export default {
  data() {
    return {
      query: {
        id: this.$route.query.id,
      },
      questionValue: "",
    };
  },
  methods: {
    reset() {
      this.questionValue =''
    },
    submmit() {
      let a = /^\s*$/;
      if (a.test(this.questionValue)) {
        //为空或者仅有多个空格
        this.$message.error("请输入内容");
      } else {
        //stu_id question_content question_create_time question_scourse
        let date = moment().format('yyyy-MM-DD HH:mm:ss')
        let a = {
          stu_id:JSON.parse(localStorage.getItem('userInfo')).id,
          question_content :this.questionValue,
          question_create_time : date,
          question_scourse : this.query.id
        }
        // console.log(a);
        request({
          url:'/question/uploadquestion',
          method: 'post',
          data: Qs.stringify(a)
        }).then(res=>{
          // console.log(res);
          if(res.data.code===200){
            this.$router.push({
              path:'questioninfo',
              query:{
                id :this.query.id
              }
            })
            this.$message.success('发送成功')
          }else{
            this.$message.error('发送失败')
          }
        })
      }
    },
  },
  created() {},
};
</script>
<style scoped>
</style>