<template>
  <div>
    <el-button
      class="send-homework"
      @click="addHomework()"
      v-if="type === 'teacher'"
      >发送作业</el-button
    >
    <el-card
      class="box-card"
      v-for="(item,index) in this.homeworkList"
      :key="item.homework_id"
      @click.native="homeworkCardClick(item.homework_id,index)"
    >
      <div class="content">{{ item.content }}</div>
      <div
        class="fileList"
        v-for="(item2, index) in item.filePathes"
        :key="index"
      >
        {{ getNewPath(item2) }}
        <el-button @click.stop="downloadFile(item2)"> 下载 </el-button>
      </div>
      <div class="time">
        <!-- {{ item.create_time }} -->
        截止日期：{{ item.deadline }}
      </div>
      <div @click.stop="">
        <el-popconfirm
          title="确定删除该作业吗？"
          @confirm="deleteHomework(item.homework_id)"
          :key="item.homework_id"
          v-if="type === 'teacher'"
        >
          <!-- @confirm是确认事件 -->
          <el-button slot="reference" type="danger" class="delete-button"
            >删除作业</el-button
          >
        </el-popconfirm>
      </div>
    </el-card>
  </div>
</template>
<script>
import { request } from "../../network/request";
import Qs from 'querystring'
export default {
  inject:['reload'],
  data() {
    return {
      query: {
        id: this.$route.query.id,
        name: this.$route.query.name,
      },
      homeworkList: [], //请求到的作业数组放到里面
      type:""
    };
  },
  methods: {
    getNewPath(str) {
      //传入服务器上那来的string，处理一下取消掉时间头
      let i = str.indexOf("_");
      let newStr = str.slice(i + 1);
      return newStr;
    },
    downloadFile(str) {
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
    deleteHomework(id) {
      var data = {
        id: id+'',
      };
      request({
        method: "post",
        url: "/homework/deletehomework",
        data: Qs.stringify(data),
      }).then((res) => {
        if(res.data.code == 200){
          this.reload();
          this.$message.success('删除成功')
        }
      });
    },
    addHomework(){
      console.log('add homework');
      this.$router.push({
        path: "/submithomework",
        query :{
          id : this.query.id,
          name : this.query.name
        }
      })
    },
    homeworkCardClick(i,index){
      console.log("homeworkCardClick",i);
      //将作业题目存在localstorge中，
      let homeworkInfo = JSON.stringify(this.homeworkList[index])
      window.localStorage.setItem('homeworkInfo',homeworkInfo)
      this.$router.push({
        path:"/homeworkdetail",
        query:{
          id : this.query.id,//课程id
          homeworkid : i //传的作业id
        }
      })
    }
  },
  created() {
    request({
      url: "/homework/gethomework",
      methods: "get",
      params: {
        id: this.query.id,
      },
    }).then((res) => {
      this.homeworkList = res.data.data;
    });
    this.type = window.localStorage.getItem("userType");
    console.log(this.type);
  },
};
</script>
<style scoped>
.send-homework {
  position: fixed;
  right: 30px;
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
  cursor: pointer;
}
.content {
  word-wrap: break-word;
  margin-bottom: 10px;
}
.fileList {
  line-height: 2px;
}
.el-button {
  height: 10px;
  margin-top: 5px;
  line-height: 3px;
}
</style>