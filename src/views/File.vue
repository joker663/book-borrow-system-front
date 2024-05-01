<template>
  <el-card shadow="never">
    <el-form size="small" label-width="auto">
      <el-row>
        <el-col :span="5">
          <el-form-item label="文件名：">
            <el-input style="width: 90%" placeholder="请输入文件名" v-model="listParam.name" suffix-icon="el-icon-search"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-button size="small" @click="resetForm()">重置</el-button>
          <el-button type="primary" size="small" @click="search()" icon="el-icon-search">查询</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-upload :action="'http://' + serverIp + ':8080/file/upload'" :show-file-list="false"
                   :on-success="handleFileUploadSuccess" style="display: inline-block">
          <el-button type="primary" class="ml-5">上传文件 <i class="el-icon-top"></i></el-button>
        </el-upload>
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
              style="margin-top: 12px"
              :border="true"
              highlight-current-row
              :header-cell-style="{background:'#F5F7FA',color:'#606266'}"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
<!--      <el-table-column prop="username" label="用户名" align="center" min-width="100px"></el-table-column>-->
      <el-table-column prop="name" label="文件名称" align="center" min-width="210px"></el-table-column>
      <el-table-column prop="type" label="文件类型" align="center" min-width="90px"></el-table-column>
      <el-table-column prop="size" label="文件大小(kb)" align="center" min-width="90px"></el-table-column>
      <el-table-column label="预览" align="center" min-width="90px">
        <template slot-scope="scope">
          <el-button type="primary" @click="preview(scope.row.url)">预览</el-button>
        </template>
      </el-table-column>
      <el-table-column label="下载" align="center" min-width="90px">
        <template slot-scope="scope">
          <el-button type="primary" @click="download(scope.row.url)">下载</el-button>
        </template>
      </el-table-column>
      <el-table-column label="启用" align="center" min-width="90px">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.enable"
                     active-color="#13ce66"
                     inactive-color="#ccc"
                     :active-value="1"
                     :inactive-value="0"
                     @change="changeEnable(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="110" align="center">
        <template slot-scope="scope">
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
  </el-card>
</template>

<script>
import {serverIp} from "../../public/config";

export default {
  data() {
    return {
      serverIp: serverIp,
      form: {},
      tableLoading: false, // 显示加载效果
      formLoading: false,// 表单加载效果
      listParam: {
        name: '',
        pageNum: 1,
        pageSize: 5,
        total: 0
      },
      tableData: [],
      multipleSelection: [],
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 初始化表格信息
    init() {
      this.request.get("/file/list", {
        params: {
          pageNum: this.listParam.pageNum,
          pageSize: this.listParam.pageSize,
          name: this.listParam.name,
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
      this.listParam.pageSize = 5
      this.init()
    },
    // 重置按钮
    resetForm() {
      // 清空表单内容
      this.listParam.name = ''
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
      this.request.delete("/file/delete/" + id).then(res => {
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
      this.request.post("/file/delete/batch", ids).then(res => {
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
    // 上传文件
    handleFileUploadSuccess(res) {
      this.$message.success("上传成功")
      this.search()
    },
    changeEnable(row) {
      console.log(row)
      this.request.post("/file/enable/update", row).then(res => {
        if (res.code === '200') {
          this.$message.success("操作成功")
        }
      })
    },
    download(url) {
      window.open(url)
    },
    preview(url) {
      window.open('https://file.keking.cn/onlinePreview?url=' + encodeURIComponent(window.btoa((url))))
    }
  }
}

</script>

<style scoped lang="scss">

</style>
