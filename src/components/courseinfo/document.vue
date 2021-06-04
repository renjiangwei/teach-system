<template>
  <div>
    <el-button
      class="send-homework"
      @click="addDocument()"
      v-if="type === 'teacher'"
      >发送课件</el-button
    >
    <el-card
      class="box-card"
      v-for="item in this.document"
      :key="item.document_id"
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
        发送日期：{{ item.create_time }}
      </div>
      <div @click.stop="">
        <el-popconfirm
          title="确定删除该作业吗？"
          @confirm="deleteDocument(item.document_id)"
          :key="item.document_id"
          v-if="type === 'teacher'"
        >
          <!-- @confirm是确认事件 -->
          <el-button slot="reference" type="danger" class="delete-button"
            >删除课件</el-button
          >
        </el-popconfirm>
      </div>
    </el-card>
  </div>
</template>
<script>
import { request } from "../../network/request";
import Qs from "querystring";
export default {
  inject:['reload'],
  data() {
    return {
      document,
      query: {
        id: this.$route.query.id, //存了一下query
        name: this.$route.query.name,
      },
      type: "",
    };
  },
  methods: {
    getNewPath(str) {
      //传入服务器上那来的string，处理一下取消掉时间头
      let i = str.indexOf("_");
      let newStr = str.slice(i + 1);
      return newStr;
    },
    getDocument() {
      request({
        url: "/document/getdocument",
        methods: "get",
        params: {
          id: this.query.id,
        },
      })
        .then((res) => {
          console.log(res.data);
          this.document = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    downloadFile(str) {
      var i = str.indexOf("_");
      var newStr = str.slice(i + 1);
      console.log("下载该文件" + str);
      request({
        url: "/document/downloaddocument",
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

    deleteDocument(id) {
      var data = {
        id: id + "",
      };
      request({
        method: "post",
        url: "/document/deletedocument",
        data: Qs.stringify(data),
      }).then((res) => {
        if (res.data.code == 200) {
          this.reload();
          this.$message.success("删除成功");
        }
      });
    },
    addDocument() {
      console.log("add document");
      this.$router.push({
        path: "/submitdocument",
        query: {
          id: this.query.id,
          name: this.query.name,
        },
      });
    },
  },
  created() {
    this.getDocument();
    this.type = window.localStorage.getItem("userType");
  },
};
</script>
<style scoped>
.box-card {
  width: 700px;
  margin: 30px 0px 30px 30px;
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
.send-homework {
  position: fixed;
  right: 30px;
}
</style>