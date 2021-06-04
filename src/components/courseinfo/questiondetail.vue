<template>
  <div>
    <div>
      <!-- 显示问题 -->
      <el-card>
        <!-- {{questionInfo}} -->
        {{ questionInfo.stu_name }} 同学：{{ questionInfo.question_content }}
        {{ questionInfo.question_create_time }}
      </el-card>
    </div>

    <div>
      <!-- 显示回复问题的输入框及提交按钮 -->
      <el-input
        type="textarea"
        placeholder="请输入回复内容"
        v-model="firstAnswer"
      ></el-input>
      <el-button type="success" @click="firstAnswerCommit">发送</el-button>
    </div>
    <div>
      <!-- 显示所有子回复 -->
      <el-card v-for="(item, index) in answerFirstChildren" :key="index">
        <div>
          <!-- {{ item }} -->
          <!-- {{ index + 1 }}
          <br> -->
          <span>{{ item.answer_user_name }}</span>
          <span v-if="item.answer_user_type == 'student'">同学 </span>
          <span v-if="item.answer_user_type == 'teacher'">老师 </span>
          <span>：{{ item.answer_content }}</span>
          <div class="cardInfo">
            <span class="answerCreateTime">{{ item.answer_create_time }}</span>
            <el-button @click="toggleInput(item, index)" class="cardAnswerBtn"
              >回复</el-button
            >
            <el-popconfirm
              title="确定删除该回复吗？"
              @confirm="deleteAnswer(item.answer_id)"
              v-if="item.ismine"
            >
              <el-button slot="reference" class="cardAnswerBtn">删除</el-button>
            </el-popconfirm>
          </div>
        </div>
        <!-- 获取该回复的所有1级回复 body-->
        <div class="answer">
          <div v-if="item.isopeninput">
            <div
              v-for="(item2, index2) in getAllChildrenByAnswerId(item)"
              :key="index2"
            >
              <!-- {{item2}} -->
              <span>{{ item2.answer_user_name }}</span>
              <span v-if="item2.answer_user_type == 'student'">同学 </span>
              <span v-if="item2.answer_user_type == 'teacher'">老师 </span>
              <span v-if="item2.sanswer_id !== item.answer_id">
                回复 {{ getNameById(item2.sanswer_id) }}
              </span>

              ：{{ item2.answer_content }}
              <el-button
                @click="
                  changePlaceholder(item.answer_id, item2.answer_id, item2)
                "
                class="cardAnswerBtn"
                >回复</el-button
              >
              <el-popconfirm
                title="确定删除该回复吗？"
                @confirm="deleteAnswer(item2.answer_id)"
                v-if="item2.ismine"
              >
                <el-button slot="reference" class="cardAnswerBtn"
                  >删除</el-button
                >
              </el-popconfirm>
            </div>
            <div>
              <el-input
                v-model="cardBottomAnswer"
                :placeholder="placeholderdata"
                ref="input"
              ></el-input>
              <el-button @click="cardAnswerCommit()" type="success"
                >发送</el-button
              >
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import { request } from "../../network/request";
import Qs from "querystring";
export default {
  inject:['reload'],
  data() {
    return {
      query: {
        id: this.$route.query.id,
        qid: this.$route.query.qid,
      },
      questionInfo: {}, //问题详情
      allAnswer: [], //所有回复，服务器请求来的所有数据
      hasAnswer: true,
      answerFirstChildren: [],
      firstAnswer: "", //最下面的回复框数据，
      cardBottomAnswer: "", //每个卡片的回复内容
      placeholderdata: "", // input
      ancestor_id: null, //回复的祖先id
      father_id: null, //回复的父亲id
    };
  },
  methods: {
    getAllAnswer() {
      request({
        url: "/question/getanswerbyquestionid",
        methods: "get",
        params: {
          question_id: this.query.qid, //传入qid查询该问题的所有回答
        },
      }).then((res) => {
        if (res.data.code === 200) {
          this.allAnswer = res.data.data;
          let name = JSON.parse(localStorage.getItem('userInfo')).name
          let i = 0
          while(this.allAnswer[i]){
            if(name == this.allAnswer[i].answer_user_name){
              this.$set(this.allAnswer[i],"ismine",true)
            }else{
              this.$set(this.allAnswer[i],"ismine",false)
            }
            i++
          }
          this.getAnswerFirstChildren(); //获取1级回复
        } else {
          this.hasAnswer = false;
        }
      });
    },
    getAnswerFirstChildren() {
      //获取问题的1级回复
      let i = 0;
      let firstChild = [];
      while (this.allAnswer[i]) {
        if (!this.allAnswer[i].sanswer_id) {
          //没有祖先回复则是firstchild
          //给一级回复添加一条属性控制是否打开了回复input
          //注意JS语法修改对象属性不是响应式的，要用vue.set this.$set
          this.$set(this.allAnswer[i], "isopeninput", false);
          firstChild.push(this.allAnswer[i]);
        }
        i++;
      }
      // console.log(firstChild);
      this.answerFirstChildren = firstChild;
    },
    getAllChildrenByAnswerId(item) {
      //获取一个回复的所有孩子回复
      let id = item.answer_id;
      let children = [];
      let i = 0;
      while (this.allAnswer[i]) {
        if (this.allAnswer[i].answer_ancestor_id == id) {
          //祖先是这个id时
          children.push(this.allAnswer[i]); //存到children中
        }
        i++;
      }
      return children;
    },
    getNameById(id) {
      let i = 0;
      while (this.allAnswer[i]) {
        if (this.allAnswer[i].answer_id == id) {
          if (this.allAnswer[i].answer_user_type == "student") {
            return this.allAnswer[i].answer_user_name + "同学";
          } else {
            return this.allAnswer[i].answer_user_name + "老师";
          }
        }
        i++;
      }
    },
    firstAnswerCommit() {
      let a = /^\s*$/; //正则规则，匹配 空 或者是只有一堆空格
      if (a.test(this.firstAnswer)) {
        this.$message.error("请输入内容");
        return;
      }
      let userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
      let userType = window.localStorage.getItem("userType");
      let answer_create_time = moment().format("yyyy-MM-DD HH:mm:ss"); //当前时间
      let data = {
        squestion_id: this.query.qid,
        // answer_ancestor_id: this.ancestor_id,
        // sanswer: this.father_id,
        answer_content: this.firstAnswer,
        answer_create_time: answer_create_time,
        answer_user_name: userInfo.name,
        answer_user_id: userInfo.id,
        answer_user_type: userType,
        answer_scourse: this.query.id
      };
      request({
        url: "/question/uploadanswer",
        method: "post",
        data: Qs.stringify(data),
      }).then((res) => {
        if (res.data.code == 200) {
          this.reload();
          this.$message.success("发送成功");
        } else {
          this.$message.error("发送失败");
        }
      });
      console.log("firstAnswerCommit");
    },
    cardAnswerCommit() {
      // console.log(this.ancestor_id,this.father_id);
      let a = /^\s*$/; //正则规则，匹配 空 或者是只有一堆空格
      if (a.test(this.cardBottomAnswer)) {
        this.$message.error("请输入内容");
        return;
      }
      let userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
      let userType = window.localStorage.getItem("userType");
      let answer_create_time = moment().format("yyyy-MM-DD HH:mm:ss"); //当前时间
      let data = {
        squestion_id: this.query.qid,
        answer_ancestor_id: this.ancestor_id,
        sanswer_id: this.father_id,
        answer_content: this.cardBottomAnswer,
        answer_create_time: answer_create_time,
        answer_user_name: userInfo.name,
        answer_user_id: userInfo.id,
        answer_user_type: userType,
        answer_scourse: this.query.id
      };
      request({
        url: "/question/uploadanswer",
        method: "post",
        data: Qs.stringify(data),
      }).then((res) => {
        if (res.data.code == 200) {
          this.reload();
          this.$message.success("发送成功");
        } else {
          this.$message.error("发送失败");
        }
      });
    },
    changePlaceholder(ancestor_id, father_id, item2) {
      //需要传入祖先id，父亲id
      //设置data里的属性，然后发送按钮 发送数据
      this.ancestor_id = ancestor_id;
      this.father_id = father_id;
      //这里改变input的placeholder就行了
      this.placeholderdata = "回复" + item2.answer_user_name + "：";
      console.log(this.ancestor_id, this.father_id, this.cardBottomAnswer);
    },
    handleChange(val) {
      // console.log(val);
    },
    toggleInput(item, i) {
      //该回复的祖先id和父亲id都是这个id，
      //将这个item以外的isopeninput设置为false，用于关闭其他打开的input，保证同时只有一个input打开
      for (let a = 0; a < this.answerFirstChildren.length; a++) {
        if (a == i) {
          continue;
        }
        this.$set(this.answerFirstChildren[a], "isopeninput", false);
      }
      //1、开始时 data中的祖先id和父亲id是空、显示为false 此时点击需要切换显示，并修改data数据
      //2、当data中id和此数据相同时 且显示为true时候 点击切换为false，相反一样
      //3、当点击其他按钮改变data时，data与此数据不同，只修改data中id和placeholder
      //3、注意两条数据其中一条不满足就不满足，用||
      if (
        this.ancestor_id == null &&
        this.father_id == null &&
        item.isopeninput == false
      ) {
        console.log(1);
        this.ancestor_id = item.answer_id;
        this.father_id = item.answer_id;
        this.placeholderdata = "回复" + item.answer_user_name + "：";
        this.$set(item, "isopeninput", !item.isopeninput);
      } else if (
        this.ancestor_id == item.answer_id &&
        this.father_id == item.answer_id
      ) {
        console.log(2);
        this.placeholderdata = "回复" + item.answer_user_name + "：";
        this.$set(item, "isopeninput", !item.isopeninput);
      } else if (
        this.ancestor_id !== item.answer_id ||
        this.father_id !== item.answer_id
      ) {
        console.log(3);
        this.ancestor_id = item.answer_id;
        this.father_id = item.answer_id;
        this.placeholderdata = "回复" + item.answer_user_name + "：";
        if (item.isopeninput == false) {
          this.$set(item, "isopeninput", !item.isopeninput);
        }
      }
      console.log(this.ancestor_id, this.father_id);
      // this.ancestor_id = item.answer_id;
      // this.father_id = item.answer_id;
      // this.placeholderdata = "回复" + item.answer_user_name + "：";
      // this.$set(item, "isopeninput", !item.isopeninput);

      // console.log(item.isopeninput);
    },
    deleteAnswer(id) {
      console.log("commit");
      let a = {
        answer_id: id,
      };
      request({
        url: "/question/deleteanswer",
        method: "post",
        data: Qs.stringify(a),
      }).then((res) => {
        if (res.data.code === 200) {
          this.reload();
          this.$message.success("删除成功");
        } else {
          this.$message.error("删除失败");
        }
      });
    },
  },
  created() {
    this.questionInfo = JSON.parse(window.localStorage.getItem("questionInfo"));
    this.getAllAnswer();
  },
};
</script>
<style scoped>
.answer {
  margin-top: 10px;
  margin-bottom: 10px;
  /* background-color: darkgray; */
}
.el-card {
  margin-bottom: 10px;
}
.cardAnswer {
  display: none;
}
.transition-box {
  margin-bottom: 10px;
  width: 200px;
  height: 100px;
  border-radius: 4px;
  background-color: #409eff;
  text-align: center;
  color: #fff;
  padding: 40px 20px;
  box-sizing: border-box;
  margin-right: 20px;
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