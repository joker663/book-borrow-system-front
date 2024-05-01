<template>
  <el-card shadow="never">
    <el-form size="small" label-width="auto">
      <el-row>
        <el-col :span="5">
          <el-form-item label="用户名：">
            <el-input style="width: 90%" placeholder="请输入用户名" v-model="listParam.username" suffix-icon="el-icon-search"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="手机号码：">
            <el-input style="width: 90%" placeholder="请输入手机号码" v-model="listParam.phone" suffix-icon="el-icon-search"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="昵称：">
            <el-input style="width: 90%" placeholder="请输入昵称" v-model="listParam.nickname" suffix-icon="el-icon-search"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-button size="small" @click="resetForm()">重置</el-button>
          <el-button type="primary" size="small" @click="search()" icon="el-icon-search">查询</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-button type="success" size="small" @click="add"><i class="el-icon-circle-plus-outline"></i> &nbsp;新增</el-button>
        <el-popconfirm
            title="确定删除吗？"
            @confirm="delBatch"
        >
          <el-button type="danger" size="small" icon="el-icon-delete" slot="reference" class="ml-5">批量删除</el-button>
        </el-popconfirm>
        <el-button type="primary" @click="exp" class="ml-5" style="margin-left: 7px">导出 <i class="el-icon-top"></i></el-button>
        <el-upload :action="`http://${serverIp}:8080/user/sysUser/import/API_006`"
                   :show-file-list="false"
                   accept="xlsx"
                   :on-success="handleExcelImportSuccess"
                   style="display: inline-block;">
          <el-button type="primary" class="ml-5" style="margin-right: 7px">导入 <i class="el-icon-bottom"></i></el-button>
        </el-upload>
        <el-button
            class="filter-item"
            size="small"
            type="text"
            icon="el-icon-download"
            @click="downloadExcelTemplate"
        >下载导入模板</el-button>
      </el-row>
    </el-form>

    <el-table :data="tableData"
              v-loading="tableLoading"
              style="margin-top: 12px"
              :border="true"
              highlight-current-row
              :header-cell-style="{background:'#F5F7FA',color:'#606266'}"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
      <el-table-column prop="username" label="用户名" align="center" min-width="110px"></el-table-column>
      <el-table-column prop="role" label="角色" align="center" min-width="90px">
        <template slot-scope="scope">
          <el-tag type="primary" v-if="scope.row.role === 'ROLE_ADMIN'">管理员</el-tag>
          <el-tag type="warning" v-if="scope.row.role === 'ROLE_TEACHER'">老师</el-tag>
          <el-tag type="success" v-if="scope.row.role === 'ROLE_STUDENT'">学生</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="昵称" align="center" min-width="120px"></el-table-column>
      <el-table-column prop="gender" label="性别" align="center" min-width="70px">
        <template slot-scope="scope">
          {{getGender(scope.row.gender)}}
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="电话" align="center" min-width="170px">
        <template slot-scope="scope">
          {{scope.row.phone || '-'}}
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱" align="center" min-width="180px">
        <template slot-scope="scope">
          {{scope.row.email || '-'}}
        </template>
      </el-table-column>
      <el-table-column prop="address" label="地址" align="center" min-width="180px">
        <template slot-scope="scope">
          {{scope.row.address || '-'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="190px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)" icon="el-icon-edit">编辑</el-button>
          <el-popconfirm
              title="确定删除吗？"
              @confirm="handleDelete(scope.row.id)"
          >
            <el-button type="danger" size="mini" icon="el-icon-delete" slot="reference" class="ml-5">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
        style="margin-top: 20px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listParam.pageNum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="listParam.pageSize"
        layout="-> ,total, sizes, prev, pager, next, jumper"
        :total="listParam.total">
    </el-pagination>

    <el-dialog :close-on-click-modal="false"
        :title="title"
         :before-close="handleClose"
        :visible.sync="dialogFormVisible"
         width="45%">
      <el-form label-width="80px" size="small" ref="formRef" :model="form" :rules="rules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" autocomplete="off" style="width: 90%;" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select clearable v-model="form.role" placeholder="请选择角色" style="width: 90%">
            <el-option v-for="item in roles" :key="item.name" :label="item.name" :value="item.flag"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" autocomplete="off" style="width: 90%;" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" autocomplete="off" style="width: 90%;" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.phone" autocomplete="off" style="width: 90%;" placeholder="请输入电话"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.address" autocomplete="off" style="width: 90%;" placeholder="请输入地址"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <template>
            <el-radio-group v-model="form.gender">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="0">女</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
        <el-form-item label="Tips">
          <el-tooltip content="默认初始密码：123"
                      placement="bottom-start" style="margin-left: 5px;margin-right: 10px">
            <i class="el-icon-question"/>
          </el-tooltip>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import {serverIp} from "../../public/config";

export default {
  data() {
    return {
      serverIp: serverIp,
      title: '',
      form: {
        gender: 1
      },
      dialogFormVisible: false,
      tableLoading: false, // 显示加载效果
      formLoading: false,// 表单加载效果
      listParam: {
        username: '',
        nickname: '',
        phone: '',
        pageNum: 1,
        pageSize: 5,
        total: 0
      },
      tableData: [],
      roles: [],
      multipleSelection: [],
      rules: {
        username: [
          {
            required: true,
            trigger: 'blur', // 触发器：失去焦点
            message: '请输入用户名'
          }
        ],
        nickname: [
          {
            required: true,
            trigger: 'blur', // 触发器：失去焦点
            message: '请输入昵称'
          }
        ],
        role: [
          {
            required: true,
            trigger: 'blur', // 触发器：失去焦点
            message: '请选择角色'
          }
        ]
      },
    }
  },
  mounted() {
    this.init()
  },
  computed: {
    getGender () { // 计算属性
      return (gender) => {
        if (gender === 1) {
          return '男'
        } else if (gender === 0) {
          return '女'
        } else {
          return '-'
        }
      }
    }
  },
  methods: {
    // 初始化表格信息
    init() {
      this.request.get("/user/sysUser/list/API_001", {
        params: {
          pageNum: this.listParam.pageNum,
          pageSize: this.listParam.pageSize,
          username: this.listParam.username,
          phone: this.listParam.phone,
          nickname: this.listParam.nickname,
        }
      }).then(res => {
        if (res.code === '200'){
          this.tableData = res.data.list
          this.listParam.total = res.data.total
        }
      })

      // 查询角色列表
      this.request.get("/role/sysRole/getAll").then(res => {
        if (res.code === '200'){
          this.roles = res.data
        }
      })
    },
    // 搜索
    search() {
      this.listParam.pageNum = 1
      this.listParam.pageSize = 5
      this.init()
    },
    // 重置按钮
    resetForm() {
      // 清空表单内容
      this.listParam.username = ''
      this.listParam.nickname = ''
      this.listParam.phone = ''
      // 重置后重新加载数据
      this.init()
    },
    // 新增
    add() {
      this.title = '新增用户'
      this.dialogFormVisible = true
    },
    // 新增或修改
    submitForm () {
      this.$refs.formRef.validate((valid) => {
        if (valid) { // 如果验证通过的话
          this.formLoading = true// 表单加载效果
          this.request.post('/user/sysUser/addOrUpdate/API_002', this.form).then(res => {
            this.formLoading = false// 请求到数据之后，关闭表单加载效果
            if (res.code === '200') {
              this.$message.success("保存成功")
              this.handleClose()
              this.search()
            } else {
              this.$message.error(res.msg || '服务器内部异常')
            }
          })
        }
      })
    },
    // 改变当前页的大小
    handleSizeChange(pageSize) {
      this.listParam.pageSize = pageSize
      this.init()
    },
    // 页的改变
    handleCurrentChange(pageNum) {
      this.listParam.pageNum = pageNum
      this.init()
    },
    // 点击编辑时回显数据
    handleEdit(row) {
      this.title = '编辑用户'
      this.form = JSON.parse(JSON.stringify(row))
      this.dialogFormVisible = true
    },
    // 删除
    handleDelete(id) {
      this.request.delete("/user/sysUser/delete/API_003/" + id).then(res => {
        if (res.code === '200') {
          this.$message.success("删除成功")
          this.search()
        } else {
          this.$message.error(res.msg || '服务器内部异常')
        }
      })
    },
    // 批量删除
    delBatch() {
      let ids = this.multipleSelection.map(v => v.id)  // [{}, {}, {}] => [1,2,3]
      if (ids.length < 1){
        this.$message.warning("请至少选择一个！")
        return
      }
      this.request.post("/user/sysUser/delete/batch/API_004", ids).then(res => {
        if (res.code === '200') {
          this.$message.success("批量删除成功")
          this.search()
        } else {
          this.$message.error("批量删除失败")
        }
      })
    },
    // 关闭dialog时的操作
    handleClose () {
      this.dialogFormVisible = false
      this.form = {} // 重置form
      this.$refs.formRef.resetFields()// 在关闭的时候，清除所有的字段和校验信息
    },
    // 多选时获取ids
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 导出
    exp() {
      let idsArr = this.multipleSelection.map(v => v.id)  // [{}, {}, {}] => [1,2,3]
      let param = '?ids='
      if (idsArr.length > 0){
        let ids = ''
        for (let i = 0; i < idsArr.length; i++) {
          ids += idsArr[i] + ','
        }
        if (ids.substring(0,ids.length-1).length > 0){
          param += ids.substring(0,ids.length-1)
        }
      }
      window.open(`http://${serverIp}:8080/user/sysUser/export/API_005` + param)
    },
    // 导入
    async handleExcelImportSuccess(res) {
      if (res.code !== '200'){
        return
      }
      if (res.data.successCount > 0){
        await this.$message.success(res.data.msgSuccess || '导入成功')
      }
      if (res.data.failedCount > 0){
        await this.$message.error(res.data.msgError || '导入失败')
      }
      this.search()
    },
    // 下载导入模板
    downloadExcelTemplate() {
      window.open(`http://${serverIp}:8080/user/sysUser/export/template/API_007`)
    }
  }
}

</script>

<style scoped lang="scss">

</style>
