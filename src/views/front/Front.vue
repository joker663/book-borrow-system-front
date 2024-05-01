<template>
  <div>
    <!-- 头部 -->
    <div style="display: flex; height: 61px; line-height: 60px; border-bottom: 1px solid #94a3e3;
    background-color: rgba(238,238,150,0.98)">
      <div style="width: 300px; display: flex; padding-left: 95px;" @click="toHome">
        <div style="width: 60px">
          <img src="../../assets/frontlogo.png" alt="" style="width: 55px;height: 45px; position: relative;top: 5px">
        </div>
        <div style="flex: 1;font-family: 华文行楷,serif;font-size: 30px">悦荐书屋</div>
      </div>
      <div style="flex: 1;">
        <el-menu :default-active="'1'" class="el-menu-demo" mode="horizontal" router
                 style="background-color: rgba(238,238,150,0.98)">
          <el-menu-item index="/front/home">首页</el-menu-item>
          <el-menu-item index="/front/booksearch">图书检索</el-menu-item>
          <el-menu-item index="/front/myborrow">我的借阅</el-menu-item>
          <el-menu-item index="/front/myfavorited">我的收藏</el-menu-item>
          <el-menu-item index="/front/messagewall">留言反馈</el-menu-item>
          <el-input v-model="keywords" style="margin-left: 157px;width: 210px; border-color: #ec1840"
                    placeholder="请输入书名/ISBN/作者"
                    suffix-icon="el-icon-search" clearable></el-input>
          <el-button type="info" style="margin-left: 10px" icon="el-icon-search" @click="searchBooks">搜索</el-button>
        </el-menu>
      </div>
      <div style="width: 200px;">
        <div v-if="!reader.username" style="text-align: right; padding-right: 30px">
          <el-button @click="$router.push('/front/login')" type="text">登录</el-button>
          <el-button @click="$router.push('/front/register')" type="text">注册</el-button>
        </div>
        <div v-else>
          <el-dropdown style="width: 150px; cursor: pointer; text-align: right">
            <div style="display: inline-block">
              <img :src="reader.avatarUrl" alt=""
                   style="width: 30px; border-radius: 50%; position: relative; top: 10px; right: 5px">
              <span>{{ reader.nickname }}</span><i class="el-icon-arrow-down" style="margin-left: 5px"></i>
            </div>
            <el-dropdown-menu slot="dropdown" style="width: 100px; text-align: center">
              <el-dropdown-item style="font-size: 14px; padding: 5px 0">
                <router-link to="/front/password" style="text-decoration: none;color: black">修改密码</router-link>
              </el-dropdown-item>
              <el-dropdown-item style="font-size: 14px; padding: 5px 0">
                <router-link to="/front/person" style="text-decoration: none; color: black">个人信息</router-link>
              </el-dropdown-item>
              <el-dropdown-item style="font-size: 14px; padding: 5px 0">
                <span style="text-decoration: none" @click="logout">退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div style="width: 615px;margin: 0 auto;">
      <router-view @refreshReader="getReader" />
    </div>
  </div>
</template>

<script>
import router, {resetRouter} from "@/router";

export default {
  name: "Front",
  data() {
    return {
      keywords: '',
      reader: localStorage.getItem("reader") ? JSON.parse(localStorage.getItem("reader")) : {},
    }
  },
  created() {
  },
  methods: {
    logout() {
      // 清空缓存
      localStorage.removeItem("reader")
      router.push("/front/login")
      this.$message.success("退出成功")
      // 重置路由
      resetRouter()
    },
    getReader() {
      let id = localStorage.getItem("reader") ? JSON.parse(localStorage.getItem("reader")).id : ""
      if (id) {
        // 从后台获取Reader数据
        this.request.get("/reader/getById/" + id).then(res => {
          // 重新赋值后台的最新Reader数据
          this.reader = res.data
        })
      }
    },
    searchBooks() {
      // 构造查询字符串
      const queryParams = { q: this.keywords };
      // 使用 Vue Router 导航到 booksearch 页面，并传递查询参数
      this.$router.push({ path: '/front/booksearch', query: queryParams },()=>{}, ()=>{});
      this.keywords = ''
    },
    toHome(){
      router.push("/front/home",()=>{}, ()=>{})
    }
  }
}
</script>

<style>
.item{
  display: inline-block;
  width: 100px;

  text-align: center;
  cursor: pointer

}
.item a {
  color: 	#1E90FF;
}
.item:hover{
  background-color: 	LightPink;
}

</style>
