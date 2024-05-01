<template>
  <el-card shadow="never">
    <el-form size="small" label-width="auto">
      <el-row>
        <el-col :span="5">
          <el-form-item>
            <el-input style="width: 90%" placeholder="请输入关键字" v-model="listParam.keywords" suffix-icon="el-icon-search"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button size="small" @click="resetForm()">重置</el-button>
          <el-button type="primary" size="small" @click="search()" icon="el-icon-search">查询</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-button type="success" size="small" @click="add" plain><i class="el-icon-circle-plus-outline"></i> &nbsp;新增</el-button>
        <el-popconfirm
            title="确定删除吗？"
            @confirm="delBatch"
        >
          <el-button type="danger" size="small" icon="el-icon-delete" slot="reference" class="ml-5" plain>批量删除</el-button>
        </el-popconfirm>
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
      <el-table-column prop="content" label="公告内容" align="center" min-width="550px"></el-table-column>
      <el-table-column prop="createTime" label="发布时间" align="center" min-width="180px"></el-table-column>
      <el-table-column prop="state" label="状态" align="center" min-width="100px" fixed="right">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.state"
                     active-color="#13ce66"
                     inactive-color="#ccc"
                     :active-value="1"
                     :inactive-value="0"
                     @change="changeEnable(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="200px" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)" icon="el-icon-edit" plain>编辑</el-button>
          <el-popconfirm
              title="确定删除吗？"
              @confirm="handleDelete(scope.row.id)"
          >
            <el-button type="danger" size="mini" icon="el-icon-delete" slot="reference" class="ml-5" plain>删除</el-button>
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
      <el-form label-width="95px" size="small" ref="formRef" :model="form" :rules="rules">
        <el-form-item label="公告内容" prop="content">
          <el-input v-model="form.content" type="textarea" autocomplete="off" rows="8"
                    style="width: 90%;" placeholder="请输入公告内容"></el-input>
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
        keywords: '',
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      multipleSelection: [],
      rules: {
        content: [
          {
            required: true,
            trigger: 'blur', // 触发器：失去焦点
            message: '请输入公告内容'
          }
        ]
      },
    }
  },
  mounted() {
    this.init()
  },
  computed: {
  },
  methods: {
    // 初始化表格信息
    init() {
      this.request.get("/notice/list/API_001", {
        params: {
          pageNum: this.listParam.pageNum,
          pageSize: this.listParam.pageSize,
          keywords: this.listParam.keywords,
        }
      }).then(res => {
        if (res.code === '200'){
          this.tableData = res.data.list
          this.listParam.total = res.data.total
        }
      })
    },
    // 搜索
    search() {
      this.listParam.pageNum = 1
      this.listParam.pageSize = 10
      this.init()
    },
    // 重置按钮
    resetForm() {
      // 清空表单内容
      this.listParam.keywords = ''
      // 重置后重新加载数据
      this.init()
    },
    // 新增
    add() {
      this.title = '新增公告'
      this.dialogFormVisible = true
    },
    // 新增或修改
    submitForm () {
      this.$refs.formRef.validate((valid) => {
        if (valid) { // 如果验证通过的话
          this.formLoading = true// 表单加载效果
          this.request.post('/notice/addOrUpdate/API_002', this.form).then(res => {
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
      this.title = '编辑公告'
      this.form = JSON.parse(JSON.stringify(row))
      this.dialogFormVisible = true
    },
    // 删除
    handleDelete(id) {
      this.request.delete("/notice/delete/API_003/" + id).then(res => {
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
      this.request.post("/notice/delete/batch/API_004", ids).then(res => {
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
    // 修改公告状态
    changeEnable(row) {
      this.request.post("/notice/state/update", row).then(res => {
        if (res.code === '200') {
          this.$message.success("操作成功")
          this.search()
        }else {
          this.$message.error(res.msg || '操作失败')
        }
      })
    },
  }
}

</script>

<style scoped lang="scss">

</style>
