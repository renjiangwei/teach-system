<template>
  <div>
    <el-button @click="dialogFormVisible = true">添加学生</el-button>
    <el-dialog title="添加学生" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="学生学号" :label-width="formLabelWidth">
          <el-input
            v-model="form.stu_id"
            autocomplete="off"
            oninput="value=value.replace(/[^\d]/g,'')"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addStudent">确 定</el-button>
      </div>
    </el-dialog>
    <el-table :data="stu_info" style="width: 100%">
      <el-table-column prop="stu_id" label="学号" width="300">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="300"> </el-table-column>
      <el-table-column label="操作">
        <!-- <el-button type="danger">删除</el-button> -->
        <!-- 
          注意这里的用法slot-scope 
          scope.row. 可以单独访问每一行的数据
          下面是将学生id传入deleteStudent方法中
        -->
        <template slot-scope="scope">
          <el-popconfirm
            title="确定删除该学生吗？"
            @confirm="deleteStudent(scope.row.stu_id)"
          >
            <el-button slot="reference" type="danger">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { request } from "../../network/request";
import Qs from "querystring";
export default {
  inject: [ 'reload'],//注意这个的使用方法
  data() {
    return {
      stu_info: [],
      hasStudent: true,
      query: {
        id: this.$route.query.id,
      },
      dialogFormVisible: false, //dialog显示与否
      form: {
        stu_id: "",
      }, //表单填写学生id
      formLabelWidth: "120px",
    };
  },
  methods: {
    getStudentList() {
      request({
        url: "/course/getstudentlist",
        methods: "get",
        params: {
          course_id: this.query.id,
        },
      }).then((res) => {
        if (res.data.code === 200) {
          this.stu_info = res.data.student;
        } else {
          this.hasStudent = false;
        }
      });
    },
    deleteStudent(stu_id) {
      let a = {
        stu_id: stu_id,
        course_id: this.query.id,
      };
      request({
        url: "/course/deletestudent",
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
    addStudent() {
      let a = {
        stu_id: this.form.stu_id,
        course_id: this.query.id,
      };
      if(this.form.stu_id !== ''){
      request({
        url:'/course/addstudent',
        method: 'post',
        data:Qs.stringify(a)
      }).then(res=>{
        if(res.data.code === 200){
          // this.dialogFormVisible = false //发送成功则关闭
          // this.$root.reload();
          this.reload()
          this.$message.success('添加成功')
        }else{
          this.$message.error('学生学号错误，或者已经存在')
        }
      })
      }
    },
  },
  created() {
    //获取该课程的所有学生，存到stu_info里
    this.getStudentList();
  },
};
</script>
<style scoped>
.el-button {
  width: 100px;
  height: 30px;
  line-height: 6px;
}
</style>