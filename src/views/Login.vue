<template>
  <div class="wrapper">
    <div style="margin: 180px auto; background-color: #d3deec; width: 350px; height: 300px; padding: 20px; border-radius: 10px">
      <div style="margin: 20px 0; text-align: center; font-size: 24px;"><b>图书借阅后台管理系统</b></div>
      <el-form :model="user" :rules="rules" ref="userForm">
        <el-form-item prop="username">
          <el-input size="medium" style="margin: 10px 0" prefix-icon="el-icon-user" v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input size="medium" style="margin: 10px 0" prefix-icon="el-icon-lock" show-password v-model="user.password"></el-input>
        </el-form-item>
        <el-form-item style="margin: 10px 0; text-align: center">
          <el-button type="primary" size="medium"  autocomplete="off" @click="login" style="width: 308px">登 录</el-button>
<!--          <el-button type="warning" size="small"  autocomplete="off" @click="$router.push('/register')">注册</el-button>-->
        </el-form-item>
        <Vcode :show="isShow"
               :imgs="[image2]"
               @success="handleSliderPass" @close="handleSliderFail" />
      </el-form>
    </div>
  </div>
</template>

<script>
import {setRoutes} from "@/router";
import { Base64 } from 'js-base64';
import Vcode from "vue-puzzle-vcode";
import image2 from "@/assets/captcha.png";

export default {
  name: "Login",
  components: {Vcode},
  data() {
    return {
      user: {},
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
      },
      isShow: false, // 验证码模态框是否出现
      image2,
    }
  },
  methods: {
    login() {
      this.$refs.userForm.validate((valid) => {
        if (valid) {  // 表单校验合法
          // 对密码进行 Base64 编码
          const encodedPassword = Base64.encode(this.user.password);
          // 反转密码
          const reversedPassword = encodedPassword.split('').reverse().join('');
          // 将编码后的密码设置回 user 对象
          this.user.password = reversedPassword;

          // 用户名密码校验通过后，显示滑块验证码
          this.isShow = true;
        } else {
          return false;
        }
      });
    },
    // 滑块验证码验证通过回调
    handleSliderPass() {
      // 向后端发送登录请求
      this.request.post("/auth/login", this.user).then(res => {
        if(res.code === '200') {
          this.isShow = false; // 通过验证后，需要手动隐藏模态框

          localStorage.setItem("user", JSON.stringify(res.data))  // 存储用户信息到浏览器
          localStorage.setItem("menus", JSON.stringify(res.data.menus))  // 存储用户信息到浏览器
          // 动态设置当前用户的路由
          setRoutes()
          this.$message.success("登录成功")
          if (res.data.role === 'ROLE_STUDENT') {
            this.$router.push("/front/home")
          } else {
            this.$router.push("/")
          }
          // 检查即将导航到的路由和当前路由是否不同
          // const currentPath = this.$router.currentRoute.path;
          // let targetPath;
          // if (res.data.role === 'ROLE_STUDENT') {
          //   targetPath = "/front/home";
          // } else {
          //   targetPath = "/";
          // }
          //
          // // 如果目标路径不是当前路径，才进行导航
          // if (currentPath !== targetPath) {
          //   this.$router.push(targetPath);
          // }
        } else {
          this.isShow = false;
        }
      })
    },
    // 滑块验证码验证失败回调
    handleSliderFail() {
      this.isShow = false;
      this.$message.warning("请按住滑块，拖动到最右边");
    }
  }
}
</script>

<style>
.wrapper {
  height: 100vh;
  background-color: #304156;
  overflow: hidden;
}
</style>
