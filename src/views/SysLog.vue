<template>
  <el-card shadow="never">
    <el-form size="small" label-width="auto">
      <el-row>
        <el-col :span="9">
          <el-form-item label="操作时间：">
            <el-date-picker
                v-model="listParam.dateList"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="用户名：">
            <el-input style="width: 90%" placeholder="请输入用户名" v-model="listParam.username" suffix-icon="el-icon-search"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
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
      <el-table-column prop="name" label="操作事件" align="center" min-width="120px"></el-table-column>
      <el-table-column prop="time" label="操作时间" align="center" min-width="120px"></el-table-column>
      <el-table-column prop="username" label="操作人" align="center" min-width="120px"></el-table-column>
      <el-table-column prop="role" label="角色" align="center" min-width="120px"></el-table-column>
      <el-table-column prop="ip" label="IP" align="center" min-width="120px"></el-table-column>
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
      tableLoading: false, // 显示加载效果
      listParam: {
        username: '',
        dateList: [],
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
  methods: {
    // 初始化表格信息
    init() {
      this.request.post("/log/sysLog/list", {
          pageNum: this.listParam.pageNum,
          pageSize: this.listParam.pageSize,
          username: this.listParam.username,
          dateList: this.listParam.dateList,
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
      this.listParam.dateList = []
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
