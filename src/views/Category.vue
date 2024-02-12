<template>
  <el-card shadow="never">
    <el-form size="small" label-width="auto">
      <el-row>
        <el-col :span="5">
          <el-form-item label="分类名称：">
            <el-input style="width: 90%" placeholder="请输入分类名称" v-model="listParam.name" suffix-icon="el-icon-search"></el-input>
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
      </el-row>
    </el-form>

    <el-table :data="tableData"
              v-loading="tableLoading"
              style="margin-top: 12px; width: 100%;"
              :border="true"
              highlight-current-row
              :header-cell-style="{background:'#F5F7FA',color:'#606266'}"
              row-key="id"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column prop="name" label="分类名称" header-align="center" min-width="180px"></el-table-column>
      <el-table-column prop="parentName" label="上级分类" align="center" min-width="180px"></el-table-column>
      <el-table-column prop="remark" label="描述" align="center" min-width="180px"></el-table-column>
      <el-table-column label="操作" align="center" min-width="300px">
        <template slot-scope="scope">
<!--          <div style="display: flex; justify-content: flex-end;">-->
            <!--          新增子菜单按钮显示的条件是：该菜单的pid为null，并且没有路径-->
            <el-button type="text" size="small" @click="handleAdd(scope.row.id)">
              <i class="el-icon-circle-plus-outline"></i> &nbsp;新增下级分类</el-button>
            <el-button size="mini" type="text" @click="handleEdit(scope.row)" icon="el-icon-edit">编辑</el-button>
            <el-popconfirm
                title="确定删除吗？"
                @confirm="handleDelete(scope.row.id)"
            >
              <el-button type="text" size="mini" icon="el-icon-delete" slot="reference" class="ml-5">删除</el-button>
            </el-popconfirm>
<!--          </div>-->
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :close-on-click-modal="false"
               :title="title"
               :before-close="handleClose"
               :visible.sync="dialogFormVisible"
               width="45%">
      <el-form label-width="80px" size="small" ref="formRef" :model="form" :rules="rules">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" autocomplete="off" style="width: 90%;" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input v-model="form.remark" autocomplete="off" style="width: 90%;" placeholder="请输入描述"></el-input>
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

export default {
  data() {
    return {
      title: '',
      form: {},
      dialogFormVisible: false,
      tableLoading: false, // 显示加载效果
      formLoading: false,// 表单加载效果
      listParam: {
        name: '',
      },
      tableData: [],
      roles: [],
      multipleSelection: [],
      options: [],
      rules: {
        name: [
          {
            required: true,
            trigger: 'blur', // 触发器：失去焦点
            message: '请输入分类名称'
          }
        ]
      },
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 初始化表格信息
    init() {
      this.request.get("/category/list/API_001", {
        params: {
          name: this.listParam.name
        }
      }).then(res => {
        if (res.code === '200'){
          this.tableData = res.data
        }
      })
    },
    // 搜索
    search() {
      this.init()
    },
    // 重置按钮
    resetForm() {
      // 清空表单内容
      this.listParam.name = ''
      // 重置后重新加载数据
      this.init()
    },
    // 新增
    add() {
      this.title = '新增分类'
      this.dialogFormVisible = true
    },
    // 新增或修改
    submitForm () {
      this.$refs.formRef.validate((valid) => {
        if (valid) { // 如果验证通过的话
          this.formLoading = true// 表单加载效果
          this.request.post('/category/addOrUpdate/API_002', this.form).then(res => {
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
    // 点击编辑时回显数据
    handleEdit(row) {
      this.title = '编辑分类'
      this.form = JSON.parse(JSON.stringify(row))
      this.dialogFormVisible = true
    },
    // 新增下级分类
    handleAdd(pid) {
      this.title = '新增下级分类'
      this.dialogFormVisible = true
      this.form = {}
      if (pid) {
        this.form.pid = pid
      }
    },
    // 删除
    handleDelete(id) {
      this.request.delete("/category/delete/API_003/" + id).then(res => {
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
      this.request.post("/category/delete/batch/API_004", ids).then(res => {
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
  }
}

</script>

<style>

</style>
