<template>
  <el-card style="width: 500px;  margin: 10px">
    <el-form label-width="120px" size="small" :model="form" :rules="rules" ref="pass">
      <el-form-item label="原密码" prop="password">
        <el-input v-model="form.password" autocomplete="off" show-password></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="form.newPassword" autocomplete="off" show-password></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="confirmPassword">
        <el-input v-model="form.confirmPassword" autocomplete="off" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <div style="float: right">
          <el-button autocomplete="off" @click="$router.push('/front/home')">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import router, {resetRouter} from "@/router";
import {Base64} from "js-base64";

export default {
  name: "Password",
  data() {
    return {
      form: {},
      reader: localStorage.getItem("reader") ? JSON.parse(localStorage.getItem("reader")) : {},
      rules: {
        password: [
          { required: true, message: '请输入原密码', trigger: 'blur' },
          { min: 3, message: '长度不少于3位', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 3, message: '长度不少于3位', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, message: '长度不少于3位', trigger: 'blur' }
        ],
      }
    }
  },
  created() {
    this.form.username = this.reader.username
  },
  methods: {
    save() {
      this.$refs.pass.validate((valid) => {
        if (valid) {
          if (this.form.newPassword !== this.form.confirmPassword) {
            this.$message.error("两次输入的新密码不相同")
            return false
          }

          // 对密码进行 Base64 编码
          const encodedPassword = Base64.encode(this.form.password);
          const encodedNewPassword = Base64.encode(this.form.newPassword);
          const encodedConfirmPassword = Base64.encode(this.form.confirmPassword);
          // 反转密码
          const reversedPassword = encodedPassword.split('').reverse().join('');
          const reversedNewPassword = encodedNewPassword.split('').reverse().join('');
          const reversedConfirmPassword = encodedConfirmPassword.split('').reverse().join('');
          // 将编码后的密码设置回 user 对象
          this.form.password = reversedPassword;
          this.form.newPassword = reversedNewPassword;
          this.form.confirmPassword = reversedConfirmPassword;

          this.request.post("/reader/update/password", this.form).then(res => {
            if (res.code === '200') {
              this.$message.success("修改成功")
              // 清空缓存
              localStorage.removeItem("reader")
              router.push("/front/login")
              // 重置路由
              resetRouter()
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
  }
}
</script>

<style>
.avatar-uploader {
  text-align: center;
  padding-bottom: 10px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 138px;
  height: 138px;
  line-height: 138px;
  text-align: center;
}
.avatar {
  width: 138px;
  height: 138px;
  display: block;
}
</style>
