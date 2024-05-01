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
          <el-form-item label="图书名：">
            <el-input style="width: 90%" placeholder="请输入图书名" v-model="listParam.bookName" suffix-icon="el-icon-search"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-button size="small" @click="resetForm()">重置</el-button>
          <el-button type="primary" size="small" @click="search()" icon="el-icon-search">查询</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          <el-popconfirm
              title="确定批量强制归还吗？"
              @confirm="batchForceBack"
          >
            <el-button type="warning" size="small" icon="el-icon-delete" slot="reference" class="ml-5">批量处理</el-button>
          </el-popconfirm>
        </el-col>
      </el-row>
      <el-row>
        <div>
          <el-card style="background-color: rgba(238,238,182,0.98); height: 125px;margin: 15px">
            <p style="margin: -7px;color: red">❗ ❗ ❗ 说明：</p>
            <p style="margin: 15px auto">1、对于逾期未归还的，管理员可以手动强制归还，同时减少用户的一次借阅次数；</p>
            <p style="margin: 13px auto">2、如果读者同时有三本图书未归还，将封禁读者账号，并强制归还所有已逾期图书。</p>
          </el-card>
        </div>
      </el-row>
    </el-form>

    <el-table :data="tableData"
              v-loading="tableLoading"
              style="margin-top: 8px"
              :border="true"
              highlight-current-row
              :header-cell-style="{background:'#F5F7FA',color:'#606266'}"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
      <el-table-column prop="bookName" label="图书名称" align="center" min-width="190px"></el-table-column>
      <el-table-column prop="isbn" label="ISBN" align="center" min-width="160px"></el-table-column>
      <el-table-column prop="username" label="用户名" align="center" min-width="130px"></el-table-column>
      <el-table-column prop="endTime" label="到期日期" align="center" min-width="150px"></el-table-column>
      <el-table-column label="借阅状态" align="center" min-width="110px" fixed="right">
        <template slot-scope="scope">
            <el-tag type="danger" style="font-size: 13px">{{getState(scope.row.state)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="100px" fixed="right">
        <template slot-scope="scope">
          <el-popconfirm
              title="确定强制归还吗？"
              @confirm="forceBack(scope.row.id)"
          >
            <el-button type="warning" size="mini" icon="el-icon-brush" slot="reference" class="ml-5">强制归还</el-button>
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
      title: '',
      dialogFormVisible: false,
      tableLoading: false, // 显示加载效果
      formLoading: false,// 表单加载效果
      listParam: {
        username: '',
        bookName: '',
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      tableData: [],
      multipleSelection: [],
    }
  },
  mounted() {
    this.init()
  },
  computed: {
    getState () { // 计算属性
      return (state) => {
        if (state === 2) {
          return '已逾期'
        }else {
          return '-'
        }
      }
    }
  },
  methods: {
    // 初始化表格信息
    init() {
      this.request.post("/borrow/overdue", {
        pageNum: this.listParam.pageNum,
        pageSize: this.listParam.pageSize,
        username: this.listParam.username,
        bookName: this.listParam.bookName,
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
      this.listParam.username = ''
      this.listParam.bookName = ''
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
    // 强制归还
    forceBack(id) {
      this.request.post("/borrow/forceback/" + id).then(res => {
        if (res.code === '200') {
          this.$message.success("强制归还成功！")
          this.search()
        } else {
          this.$message.error(res.msg || '服务器内部异常')
        }
      })
    },
    // 多选时获取ids
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 批量强制归还
    batchForceBack() {
      let ids = this.multipleSelection.map(v => v.id)  // [{}, {}, {}] => [1,2,3]
      if (ids.length < 1){
        this.$message.warning("请至少选择一个！")
        return
      }
      this.request.post("/borrow/batch/forceback", ids).then(res => {
        if (res.code === '200') {
          this.$message.success("批量强制归还成功！")
          this.search()
        } else {
          this.$message.error(res.msg || '服务器内部异常')
        }
      })
    },
  }
}

</script>

<style scoped>

</style>
