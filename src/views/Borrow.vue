<template>
  <el-card shadow="never">
    <el-form size="small" label-width="auto">
      <el-row>
        <el-col :span="10">
          <el-form-item label="借书日期：">
            <el-date-picker
                v-model="listParam.borrowDateList"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="到期日期：">
            <el-date-picker
                v-model="listParam.backDateList"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="用户名：">
            <el-input style="width: 90%" placeholder="请输入用户名" v-model="listParam.username" suffix-icon="el-icon-search"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="图书名：">
            <el-input style="width: 90%" placeholder="请输入图书名" v-model="listParam.bookName" suffix-icon="el-icon-search"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-button size="small" @click="resetForm()">重置</el-button>
          <el-button type="primary" size="small" @click="search()" icon="el-icon-search">查询</el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-table :data="tableData"
              v-loading="tableLoading"
              style="margin-top: 12px"
              :border="true"
              highlight-current-row
              :header-cell-style="{background:'#F5F7FA',color:'#606266'}">
      <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
      <el-table-column prop="bookName" label="图书名称" align="center" min-width="190px"></el-table-column>
      <el-table-column prop="isbn" label="ISBN" align="center" min-width="160px"></el-table-column>
      <el-table-column prop="beginTime" label="借书日期" align="center" min-width="120px"></el-table-column>
      <el-table-column prop="endTime" label="到期日期" align="center" min-width="120px"></el-table-column>
      <el-table-column prop="leaveDays" label="剩余天数" align="center" min-width="80px"></el-table-column>
      <el-table-column prop="backTime" label="归还日期" align="center" min-width="120px">
        <template slot-scope="scope">
          {{scope.row.backTime || '-'}}
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名" align="center" min-width="110px"></el-table-column>
      <el-table-column prop="readerNumber" label="读者编号" align="center" min-width="180px"></el-table-column>
      <el-table-column label="借阅状态" align="center" min-width="110px" fixed="right">
        <template slot-scope="scope">
          <div v-if="scope.row.state === 0">
            <el-tag type="success" style="font-size: 13px">{{getState(scope.row.state)}}</el-tag>
          </div>
          <div v-else-if="scope.row.state === 1">
            <el-tag type="info" style="font-size: 13px">{{getState(scope.row.state)}}</el-tag>
          </div>
          <div v-if="scope.row.state === 2">
            <el-tag type="danger" style="font-size: 13px">{{getState(scope.row.state)}}</el-tag>
          </div>
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
        borrowDateList: [],
        backDateList: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      tableData: [],
    }
  },
  mounted() {
    this.init()
  },
  computed: {
    getState () { // 计算属性
      return (state) => {
        if (state === 0) {
          return '借阅中'
        } else if (state === 1) {
          return '已归还'
        } else if (state === 2) {
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
      this.request.post("/borrow/list", {
          pageNum: this.listParam.pageNum,
          pageSize: this.listParam.pageSize,
          username: this.listParam.username,
          bookName: this.listParam.bookName,
          borrowDateList: this.listParam.borrowDateList,
          backDateList: this.listParam.backDateList,
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
      this.listParam.borrowDateList = []
      this.listParam.backDateList = []
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
  }
}

</script>

<style scoped lang="scss">

</style>
