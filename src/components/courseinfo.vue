<template>
  <div>
    <!-- <div class="class-name">{{this.$route.params.id}}</div> -->
    <div class="class-name">{{this.$route.query.name}}</div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
    >
      <el-menu-item
        v-for="(item,index) in this.navbarList"
        :index="item.id"
        :key="item.id"
        @click="navbarClick(index)"
        >{{ item.name }}</el-menu-item
      >
    </el-menu>
    <div class="line"></div>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeIndex: "1",
      navbarList: [
        {
          id: "1",
          name: "课件",
          path: "/courseinfo"
        },
        {
          id: "2",
          name: "作业",
          path: "/homeworkdetail"
        },
        {
          id: "3",
          name: "公告",
        },
        {
          id: "4",
          name: "问答",
        },
        {
          id: "5",
          name: "成绩",
        },
      ],
    };
  },
  methods: {
    navbarClick(index) {
      console.log(this.navbarList[index].name);
      this.$router.push({
        path:this.navbarList[index].path,
        query:{
          id :this.$route.query.id,
          name:this.$route.query.name,
        }
      }); 
    },
  },
  created() {
    
  },
};
</script>
<style scoped>
.class-name{
  font-size: 20px;
}
.el-menu {
  margin-top: 15px;
  margin-left: 20px;
}
</style>