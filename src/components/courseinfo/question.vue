<template>
  <div>
    <el-button type="info" @click="submitQuestion"> 发送提问 </el-button>
    <div v-if="hasQuestion">
      <el-card
        v-for="item in questionList"
        :key="item.question_id"
        @click.native="cardClick(item)"
      >
        <!-- {{ item }} -->
        <div>{{ item.stu_name }}同学提问：</div>
        <div>
          {{ item.question_content }}
        </div>
        <div class="cardInfo" @click.stop="">
          <span class="answerCreateTime">{{ item.question_create_time }}</span>
          <el-popconfirm
            title="确定删除该回复吗？"
            @confirm="deleteQuestion(item.question_id)"
            v-if="item.ismine"
            :key="item.question_id"
          >
            <el-button slot="reference" class="cardAnswerBtn">删除</el-button>
          </el-popconfirm>
        </div>
      </el-card>
    </div>
    <div v-else>没有问题哦</div>
  </div>
</template>
<script>
import { request } from "../../network/request";
import Qs from "querystring";
export default {
  data() {
    return {
      questionList: [],
      query: {
        id: this.$route.query.id,
      },
      hasQuestion: true,
    };
  },
  methods: {
    getQuestion() {
      console.log("getQuestion");
      request({
        url: "/question/getquestionbycourseid",
        methods: "get",
        params: {
          course_info_id: this.query.id,
        },
      }).then((res) => {
        if (res.data.code === 200) {
          let i = 0;
          let stu_id = JSON.parse(localStorage.getItem("userInfo")).id;
          this.questionList = res.data.data;
          while (this.questionList[i]) {
            if (stu_id == this.questionList[i].stu_id) {
              //如果该问题是我的问题，在对象中设置属性ismine为true
              this.$set(this.questionList[i], "ismine", true);
            } else {
              this.$set(this.questionList[i], "ismine", false);
            }
            i++;
          }
        } else {
          this.hasQuestion = false;
          console.log("没有问题哦");
        }
      });
    },
    submitQuestion() {
      this.$router.push({
        path: "submitquestion",
        query: {
          id: this.query.id,
        },
      });
    },
    deleteQuestion(id) {
      let a = {
        question_id: id,
      };
      request({
        url: "/question/deletequestion",
        method: "post",
        data: Qs.stringify(a),
      }).then((res) => {
        console.log(res);
        if (res.data.code === 200) {
          this.$message.success("删除成功");
          window.location.reload();
        } else {
          this.$message.error("删除失败");
        }
      });
    },
    cardClick(item) {
      let a = JSON.stringify(item);
      window.localStorage.setItem("questionInfo", a);
      this.$router.push({
        path: "questiondetail",
        query: {
          id: this.query.id,
          qid: item.question_id,
        },
      });
    },
  },
  created() {
    this.getQuestion();
  },
};
</script>
<style scoped>
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