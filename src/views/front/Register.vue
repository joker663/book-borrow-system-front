<template>
  <div class="wrapper">
    <h1 style="color: white; margin: 15px 0 0 20px;font-style: italic">图书借阅系统</h1>
    <h2 style="color: white; margin: 10px 0 0 20px; font-style: italic">BOOK LENDING SYSTEM</h2>
    <div
        style="margin: 90px 120px auto; background-color: #fff; width: 350px; height: 330px; padding: 20px; border-radius: 10px;float: right">
      <div style="margin: 15px 0; text-align: center; font-size: 24px"><b>注 册</b></div>
      <el-form :model="reader" :rules="rules" ref="readerForm">
        <el-form-item prop="username">
          <el-input placeholder="请输入账号" size="medium" style="margin: 5px 0" prefix-icon="el-icon-user" v-model="reader.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input placeholder="请输入密码" size="medium" style="margin: 5px 0" prefix-icon="el-icon-lock" show-password v-model="reader.password"></el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input placeholder="请确认密码" size="medium" style="margin: 5px 0" prefix-icon="el-icon-lock" show-password v-model="reader.confirmPassword"></el-input>
        </el-form-item>
        <el-form-item style="margin: 5px 0; text-align: right">
          <el-button type="" size="small"  autocomplete="off" @click="$router.push('/front/login')">返回登录</el-button>
          <el-button type="primary" size="small"  autocomplete="off" @click="register">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {Base64} from "js-base64";

export default {
  name: "Login",
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
        confirmPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    register() {
      this.$refs.readerForm.validate((valid) => {
        if (valid) {  // 表单校验合法
          if (this.reader.password !== this.reader.confirmPassword) {
            this.$message.error('两次输入的密码不一致')
            return false
          }

          // 对密码进行 Base64 编码
          const encodedPassword = Base64.encode(this.reader.password);
          const encodedConfirmPassword = Base64.encode(this.reader.confirmPassword);
          // 反转密码
          const reversedPassword = encodedPassword.split('').reverse().join('');
          const reversedConfirmPassword = encodedConfirmPassword.split('').reverse().join('');
          // 将编码后的密码设置回 user 对象
          this.reader.password = reversedPassword;
          this.reader.confirmPassword = reversedConfirmPassword;

          this.request.post("/front/auth/register", this.reader).then(res => {
            if(res.code === '200') {
              this.$router.push("/front/login")
              this.$message.success('注册成功')
            } else {
              this.$message.error(res.msg || '注册失败')
            }
          })
        }
      });
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
