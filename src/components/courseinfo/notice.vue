<template>
  <div>
    <el-button
      class="send-notice"
      @click="addNotice()"
      v-if="this.type === 'teacher'"
      >发送公告</el-button
    >
    <el-card class="box-card" v-for="item in this.notice" :key="item.notice_id">
      <div slot="header" class="clearfix">
        <span>{{ item.notice_title }}</span>
        <span class="tname">发送人：{{ item.notice_teacher_name }}</span>
      </div>
      <div class="text item content">{{ item.notice_content }}</div>
      <div>
        {{ item.notice_time }}
      </div>
      <div>
        <el-popconfirm
          title="确定删除该公告吗？"
          @confirm="deleteNotice(item.notice_id)"
          :key="item.notice_id"
          v-if="type === 'teacher'"
        >
          <!-- @confirm是确认事件 -->
          <el-button slot="reference" type="danger" class="delete-button" 
            >删除</el-button
          >
        </el-popconfirm>
      </div>
    </el-card>
  </div>
</template>
<script>
import { request } from "../../network/request";
import moment from "moment";
import axios from "axios";
import Qs from "querystring";
export default {
  inject:['reload'],
  data() {
    return {
      query: {
        id: this.$route.query.id, //存了一下query
        name: this.$route.query.name,
      },
      notice: [],
      type: "",
    };
  },
  methods: {
    getNotice() {
      // console.log(this.type);
      // console.log("NOTICE CREATED");
      request({
        url: "/notice/noticeinfo",
        methods: "get",
        params: {
          id: this.query.id,
        },
      }).then((res) => {
        this.notice = res.data.data;
        console.log(res.data.data);
      });
    },
    deleteNotice(i) {
      var data = {
        id: i + "",
      };
      axios.defaults.withCredentials = true; //请求携带cookie
      request({
        method: "post",
        url: "/notice/deletenotice",
        data: Qs.stringify(data),
      }).then((res) => {
        console.log(res.data);
        if (res.data.code == 200) {
          this.reload();
          this.$message.success("删除成功")
        }
      });
    },

    addNotice() {
      this.$router.push({
        path: "/submitnotice",
        query: {
          id: this.query.id,
          name: this.query.name, //附带query传递参数
        },
      });
    },
  },
  created() {
    this.type = window.localStorage.getItem("userType");
    console.log(this.type);
    this.getNotice();
  },
};
</script>
<style scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 700px;
  margin: 30px 0px 30px 30px;
}
.tname {
  float: right;
}
.send-notice {
  position: fixed;
  right: 30px;
}
.delete-button {
  float: right;
  height: 14px;
  margin-bottom: 4px;
  line-height: 2px;
}
.content{
   word-wrap:break-word;
}
</style>