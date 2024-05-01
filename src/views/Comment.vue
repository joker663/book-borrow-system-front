<template>
  <el-card shadow="never">
    <el-form size="small" label-width="auto">
      <el-row>
        <el-col :span="5">
          <el-form-item>
            <el-input style="width: 90%" placeholder="请输入关键字"
                      v-model="listParam.keywords" suffix-icon="el-icon-search" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button size="small" @click="resetForm()">重置</el-button>
          <el-button type="primary" size="small" @click="search()" icon="el-icon-search">查询</el-button>
        </el-col>
      </el-row>
      <el-row>
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
      <el-table-column prop="time" label="评论时间" align="center" min-width="140px"></el-table-column>
      <el-table-column prop="content" label="评论内容" align="center" min-width="280px"></el-table-column>
      <el-table-column prop="username" label="用户名" align="center" min-width="100px"></el-table-column>
      <el-table-column prop="nickname" label="昵称" align="center" min-width="100px"></el-table-column>
      <el-table-column prop="bookName" label="图书名称" align="center" min-width="160px"></el-table-column>
      <el-table-column prop="isbn" label="ISBN" align="center" min-width="130px"></el-table-column>
      <el-table-column label="操作" align="center" min-width="100px" fixed="right">
        <template slot-scope="scope">
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
  </el-card>
</template>

<script>

export default {
  data() {
    return {
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
      this.request.get("/comment/admin/list", {
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
    // 删除
    handleDelete(id) {
      this.request.delete("/comment/admin/delete/" + id).then(res => {
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
      this.request.post("/comment/admin/delete/batch", ids).then(res => {
        if (res.code === '200') {
          this.$message.success("批量删除成功")
          this.search()
        } else {
          this.$message.error("批量删除失败")
        }
      })
    },
    // 多选时获取ids
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
  }
}

</script>

<style scoped>

</style>
