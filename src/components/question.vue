<template>
  <div>
    <!-- 展示自己的所有问题 和 发送的所有回答 -->
    <div v-if="userType === 'student'">
      <el-button @click="changeActive">{{ btnMessage }}</el-button>
      <div v-if="showQuestion" class="container">
        <span v-if="!hasQuestion">没有发送任何问题哟</span>
        <el-card
          v-for="item in questionList"
          :key="item.question_id"
          @click.native="questionClick(item)"
        >
          <!-- {{ item }} -->
          <div>
            {{ item.question_content }}
          </div>
          <div class="cardInfo" @click.stop="">
            <span class="answerCreateTime">{{
              item.question_create_time
            }}</span>
          </div>
        </el-card>
      </div>
      <div v-if="!showQuestion" class="container">
        <span v-if="!hasAnswer">没有发送任何回答哟</span>
        <el-card
          v-for="item in answerList"
          :key="item.answer_id"
          @click.native="answerClick(item)"
        >
          <!-- {{ item }} -->
          <div>
            {{ item.answer_content }}
          </div>
          <div class="cardInfo" @click.stop="">
            <span class="answerCreateTime">{{ item.answer_create_time }}</span>
          </div>
        </el-card>
      </div>
    </div>
    <!-- 展示教师 -->
    <div v-if="userType === 'teacher'" class="container">
      teacher
      <span v-if="!hasAnswer">没有发送任何回答哟</span>
      <div class="container">
        <el-card
          v-for="item in answerList"
          :key="item.answer_id"
          @click.native="answerClick(item)"
        >
          <div>
            {{ item.answer_content }}
          </div>
          <div class="cardInfo" @click.stop="">
            <span class="answerCreateTime">{{ item.answer_create_time }}</span>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>
<script>
import { request } from "../network/request";
export default {
  data() {
    return {
      userType: "",
      questionList: [],
      hasQuestion: true,
      answerList: [],
      hasAnswer: true,
      showQuestion: true,
    };
  },
  computed: {
    btnMessage() {
      if (this.showQuestion) {
        return "我的回答";
      } else {
        return "我的问题";
      }
    },
  },
  methods: {
    changeActive() {
      this.showQuestion = !this.showQuestion;
    },
    getQuestion() {
      //获取该学生问题
      let stu_id = JSON.parse(localStorage.getItem("userInfo")).id;
      request({
        url: "/question/getquestionbystuid",
        methods: "get",
        params: {
          stu_id: stu_id,
        },
      }).then((res) => {
        if (res.data.code === 200) {
          this.questionList = res.data.data;
          // console.log(this.questionList);
        } else {
          this.hasQuestion = false;
        }
      });
    },
    getAnswer() {
      let user_id = JSON.parse(localStorage.getItem("userInfo")).id;
      request({
        url: "/question/getanswerbyuserid",
        methods: "get",
        params: {
          user_id: user_id,
        },
      }).then((res) => {
        if (res.data.code === 200) {
          this.answerList = res.data.data;
          // console.log(this.answerList);
        } else {
          this.hasAnswer = false;
        }
      });
    },
    questionClick(item) {
      //修改localstorge中question信息
      localStorage.setItem("questionInfo", JSON.stringify(item));
      this.$router.push({
        path: "questiondetail",
        query: {
          id: item.question_scourse,
          qid: item.question_id,
        },
      });
    },
    answerClick(item) {
      this.$router.push({
        path: "questiondetail",
        query: {
          id: item.answer_scourse,
          qid: item.squestion_id,
        },
      });
      console.log(item);
    },
  },
  created() {
    this.userType = localStorage.getItem("userType");
    this.getQuestion();
    this.getAnswer();
  },
};
</script>
<style scoped>
.container {
  margin-top: 10px;
  margin-left: 10px;
}
.el-buttton {
  margin-left: 10px;
}
.el-card {
  width: 70%;
  margin-bottom: 14px;
}
.cardInfo {
  font-size: 15px;
  color: #99a2aa;
  margin-top: 5px;
}
.answerCreateTime {
  display: inline-block;
  box-sizing: content-box;
  margin-right: 20px;
}
.cardAnswerBtn {
  display: inline-block;
  box-sizing: content-box;
  border-radius: 4px;
  cursor: pointer;
  height: 26px;
  width: 34px;
  padding: 0 5px;
}
</style>