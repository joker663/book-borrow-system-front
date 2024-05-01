<template>
  <el-card shadow="never">
    <el-form size="small" label-width="auto">
      <el-row>
        <el-col :span="5">
          <el-form-item label="图片名：">
            <el-input style="width: 90%" placeholder="请输入图片名名" v-model="listParam.imageName" suffix-icon="el-icon-search"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button size="small" @click="resetForm()">重置</el-button>
          <el-button type="primary" size="small" @click="search()" icon="el-icon-search">查询</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="1.5">
          <el-upload
              class="upload-demo"
              :action="'http://' + serverIp +':8080/carousel/add/API_002'"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :headers='headersObj'
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-col>
        <el-col :span="2">
          <el-popconfirm
              title="确定删除吗？"
              @confirm="delBatch"
          >
            <el-button type="danger" size="small" icon="el-icon-delete" slot="reference" class="ml-5">批量删除</el-button>
          </el-popconfirm>
        </el-col>
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
      <el-table-column prop="imageUrl" label="轮播图" align="center" min-width="100px">
        <template slot-scope="scope">
          <img :src="scope.row.imageUrl" min-width="150" height="100"/>
        </template>
      </el-table-column>
      <el-table-column prop="imageUrl" label="路径" align="center" min-width="210px"></el-table-column>
      <el-table-column prop="imageName" label="图片名" align="center" min-width="150px"></el-table-column>
      <el-table-column prop="imageType" label="图片类型" align="center" min-width="70px"></el-table-column>
      <el-table-column prop="state" label="状态" align="center" min-width="70px" fixed="right">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.state"
                     active-color="#13ce66"
                     inactive-color="#ccc"
                     :active-value="1"
                     :inactive-value="0"
                     @change="changeEnable(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="70px" fixed="right">
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
      dialogFormVisible: false,
      tableLoading: false, // 显示加载效果
      formLoading: false,// 表单加载效果
      listParam: {
        imageName: '',
        pageNum: 1,
        pageSize: 5,
        total: 0
      },
      tableData: [],
      multipleSelection: [],
      headersObj: {token: ''},
    }
  },
  created() {
    this.headersObj.token = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).token : ''
  },
  mounted() {
    this.init()
  },
  computed: {
  },
  methods: {
    init() {
      this.request.get("/carousel/list/API_001", {
        params: {
          pageNum: this.listParam.pageNum,
          pageSize: this.listParam.pageSize,
          imageName: this.listParam.imageName,
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
      this.listParam.imageName = ''
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
      this.request.delete("/carousel/delete/API_003/" + id).then(res => {
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
      this.request.post("/carousel/delete/batch/API_004", ids).then(res => {
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
    // 是否启用轮播图
    changeEnable(row) {
      this.request.post("/carousel/state/update", row).then(res => {
        if (res.code === '200') {
          this.$message.success("操作成功")
          this.search()
        }else {
          this.$message.error(res.msg || '操作失败')
        }
      })
    },
    handleAvatarSuccess() {
      this.$message.success("上传成功！")
      this.search()
    }
  }
}

</script>

<style scoped lang="scss">

</style>
