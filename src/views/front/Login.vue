<template>
  <div class="wrapper">
    <h1 style="color: white; margin: 15px 0 0 20px;font-style: italic">图书借阅系统</h1>
    <h2 style="color: white; margin: 10px 0 0 20px; font-style: italic">BOOK LENDING SYSTEM</h2>
    <div style="margin: 100px 120px auto;
    background-color: #ffffff; width: 350px; height: 290px; padding: 20px; border-radius: 10px;float: right">
      <div style="margin: 15px 0; text-align: center; font-size: 24px"><b>登 录</b></div>
      <el-form :model="reader" :rules="rules" ref="readerForm">
        <el-form-item prop="username">
          <el-input size="medium" style="margin: 10px 0" prefix-icon="el-icon-user" v-model="reader.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input size="medium" style="margin: 10px 0" prefix-icon="el-icon-lock" show-password v-model="reader.password"></el-input>
        </el-form-item>
        <el-form-item style="margin: 10px 0; text-align: right">
          <el-button type="primary" size="small"  autocomplete="off" @click="login">登录</el-button>
          <el-button type="primary" size="small"  autocomplete="off" @click="$router.push('/front/register')">注册</el-button>
        </el-form-item>
        <Vcode :show="isShow"
               :imgs="[image1,image2]"
               @success="handleSliderPass" @close="handleSliderFail" />
      </el-form>
    </div>
  </div>
</template>

<script>
import {setRoutes} from "@/router";
import {Base64} from "js-base64";
import Vcode from "vue-puzzle-vcode";
import image1 from "../../assets/bg.jpg";
import image2 from "../../assets/captcha.png";

export default {
  name: "Login",
  components: {
    Vcode
  },
  data() {
    return {
      reader: {},
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
      image1,image2,
    }
  },
  methods: {
    login() {
      this.$refs.readerForm.validate((valid) => {
        if (valid) {  // 表单校验合法
          // 对密码进行 Base64 编码
          const encodedPassword = Base64.encode(this.reader.password);
          // 反转密码
          const reversedPassword = encodedPassword.split('').reverse().join('');
          // 将编码后的密码设置回 user 对象
          this.reader.password = reversedPassword;

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
      this.request.post("/front/auth/login", this.reader).then(res => {
        if (res.code === '200') {
          this.isShow = false; // 通过验证后，需要手动隐藏模态框

          localStorage.setItem("reader", JSON.stringify(res.data));
          // 动态设置当前用户的路由
          setRoutes();
          this.$message.success("登录成功");
          this.$router.push("/front/home");
        } else {
          this.isShow = false;
          this.$message.error(res.msg || "用户名或密码错误");
        }
      });
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
  overflow: hidden;
  background-image: url("../../assets/bg.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
</style>
