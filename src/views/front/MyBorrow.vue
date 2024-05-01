<template>
  <div>
    <el-tabs :tab-position="tabPosition"
             type="border-card"
             style="height: 620px;width: 1250px;margin: 15px 0 0 -320px"
             @tab-click="handleClick"
             v-model="activeName" >
<!--      借阅中-->
      <el-tab-pane>
        <el-form>
          <el-row>
            <el-col :span="4">
              <el-form-item>
                <el-input placeholder="请输入图书名" v-model="listParam.bookName" suffix-icon="el-icon-search"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-button size="small" @click="resetForm()" style="margin-left: 10px">重置</el-button>
              <el-button type="info" size="small" @click="search()" icon="el-icon-search">查询</el-button>
            </el-col>
          </el-row>
        </el-form>
        <span slot="label" style="color: green;font-size: 16px"><i class="el-icon-date"></i> 借阅中</span>
        <el-table :data="tableData"
                  v-loading="tableLoading"
                  style="margin-top: 5px"
                  :border="true"
                  highlight-current-row
                  :header-cell-style="{background:'#F5F7FA',color:'#606266'}">
          <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
          <el-table-column prop="bookName" label="图书名称" align="center" min-width="190px"></el-table-column>
          <el-table-column prop="isbn" label="ISBN" align="center" min-width="160px"></el-table-column>
          <el-table-column prop="beginTime" label="借书日期" align="center" min-width="120px"></el-table-column>
          <el-table-column prop="endTime" label="到期日期" align="center" min-width="120px"></el-table-column>
          <el-table-column prop="leaveDays" label="剩余天数" align="center" min-width="80px"></el-table-column>
          <el-table-column label="借阅状态" align="center" min-width="90px">
            <template slot-scope="scope">
                <el-tag type="success" style="font-size: 13px">{{getState(scope.row.state)}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="165px" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="success" @click="renewBook(scope.row.id)" icon="el-icon-plus" plain>续借</el-button>
              <el-popconfirm
                  title="确定归还吗？"
                  @confirm="backBook(scope.row.id)"
              >
                <el-button type="warning" size="mini" icon="el-icon-s-promotion" slot="reference" class="ml-5" plain>归还</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
            style="margin-top: 15px;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="listParam.pageNum"
            :page-sizes="[5, 10, 20, 50]"
            :page-size="listParam.pageSize"
            layout="-> ,total, sizes, prev, pager, next, jumper"
            :total="listParam.total">
        </el-pagination>
      </el-tab-pane>

<!--      已归还-->
      <el-tab-pane>
        <el-form>
          <el-row>
            <el-col :span="4">
              <el-form-item>
                <el-input placeholder="请输入图书名" v-model="listParam.bookName" suffix-icon="el-icon-search"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-button size="small" @click="resetForm()" style="margin-left: 10px">重置</el-button>
              <el-button type="info" size="small" @click="search()" icon="el-icon-search">查询</el-button>
            </el-col>
          </el-row>
        </el-form>
        <span slot="label" style="color: black;font-size: 16px"><i class="el-icon-date"></i> 已归还</span>
        <el-table :data="tableData"
                  v-loading="tableLoading"
                  style="margin-top: 5px"
                  :border="true"
                  highlight-current-row
                  :header-cell-style="{background:'#F5F7FA',color:'#606266'}">
          <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
          <el-table-column prop="bookName" label="图书名称" align="center" min-width="190px"></el-table-column>
          <el-table-column prop="isbn" label="ISBN" align="center" min-width="160px"></el-table-column>
          <el-table-column prop="beginTime" label="借书日期" align="center" min-width="120px"></el-table-column>
          <el-table-column prop="endTime" label="到期日期" align="center" min-width="120px"></el-table-column>
          <el-table-column prop="backTime" label="归还日期" align="center" min-width="100px"></el-table-column>
          <el-table-column label="借阅状态" align="center" min-width="85px">
            <template slot-scope="scope">
                <el-tag type="info" style="font-size: 13px">{{getState(scope.row.state)}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="score" label="评分" align="center" min-width="165px" fixed="right">
            <template slot-scope="scope">
              <div v-if="scope.row.score === 0">
                <el-button type="text" size="small" @click="makeValuate(scope.row.id)" icon="el-icon-chat-line-square">立即评分</el-button>
              </div>
              <div v-if="scope.row.score > 0">
                <el-rate
                    v-model="scope.row.score"
                    disabled
                    allow-half
                    show-score
                    disabled-void-color="#C6CEDEFF">
                </el-rate>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
            style="margin-top: 17px;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="listParam.pageNum"
            :page-sizes="[5, 10, 20, 50]"
            :page-size="listParam.pageSize"
            layout="-> ,total, sizes, prev, pager, next, jumper"
            :total="listParam.total">
        </el-pagination>
      </el-tab-pane>

<!--      已逾期-->
      <el-tab-pane>
        <el-form>
          <el-row>
            <el-col :span="4">
              <el-form-item>
                <el-input placeholder="请输入图书名" v-model="listParam.bookName" suffix-icon="el-icon-search"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-button size="small" @click="resetForm()" style="margin-left: 10px">重置</el-button>
              <el-button type="info" size="small" @click="search()" icon="el-icon-search">查询</el-button>
            </el-col>
          </el-row>
        </el-form>
        <span slot="label" style="color: red;font-size: 16px"><i class="el-icon-date"></i> 已逾期</span>
        <el-table :data="tableData"
                  v-loading="tableLoading"
                  style="margin-top: 5px"
                  :border="true"
                  highlight-current-row
                  :header-cell-style="{background:'#F5F7FA',color:'#606266'}">
          <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
          <el-table-column prop="bookName" label="图书名称" align="center" min-width="190px"></el-table-column>
          <el-table-column prop="isbn" label="ISBN" align="center" min-width="160px"></el-table-column>
          <el-table-column prop="beginTime" label="借书日期" align="center" min-width="120px"></el-table-column>
          <el-table-column prop="endTime" label="到期日期" align="center" min-width="120px"></el-table-column>
          <el-table-column prop="leaveDays" label="剩余天数" align="center" min-width="80px"></el-table-column>
          <el-table-column label="借阅状态" align="center" min-width="90px">
            <template slot-scope="scope">
              <el-tag type="danger" style="font-size: 13px">{{getState(scope.row.state)}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="评分" align="center" min-width="125px" fixed="right">
            <template slot-scope="scope">
              <el-popconfirm
                  title="确定立即归还吗？逾期图书将会减少一次您的借阅次数"
                  @confirm="backBookNow(scope.row.id)"
              >
                <el-button type="warning" size="mini" icon="el-icon-s-promotion" slot="reference" class="ml-5" plain>立即归还</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
            style="margin-top: 17px;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="listParam.pageNum"
            :page-sizes="[5, 10, 20, 50]"
            :page-size="listParam.pageSize"
            layout="-> ,total, sizes, prev, pager, next, jumper"
            :total="listParam.total">
        </el-pagination>
      </el-tab-pane>
    </el-tabs>

    <el-dialog :close-on-click-modal="false"
               :title="title"
               :before-close="handleClose"
               :visible.sync="dialogFormVisible"
               width="45%">
      <el-form label-width="80px" size="small" ref="formRef" :model="form" :rules="rules">
        <el-form-item label="续借天数" prop="renewDays">
          <el-input-number v-model="form.renewDays" controls-position="right" @change="handleTotalCountChange" :min="1" :max="30"></el-input-number>
          <el-tooltip content="每本书最多续借30天"
                      placement="bottom-start" style="margin-left: 10px;">
            <i class="el-icon-question"/>
          </el-tooltip>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :close-on-click-modal="false"
               :title="title"
               :before-close="handleCloseScore"
               :visible.sync="dialogVisibleScore"
               width="45%">
      <div style="text-align: center;font-size: 30px;">
        <el-rate
            v-model="score"
            allow-half
            show-score
            @change="markScore()">
        </el-rate>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCloseScore">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      dialogFormVisible: false,
      dialogVisibleScore: false,
      tableLoading: false, // 显示加载效果
      formLoading: false,// 表单加载效果
      form: {
        renewDays: 1
      },
      scoreForm: {},
      listParam: {
        bookName: '',
        pageNum: 1,
        pageSize: 10,
        total: 0,
        type: 0
      },
      tableData: [],
      tabPosition: 'left',
      score: 0,
      id: 0,
      activeName: 0,
      rules: {
        renewDays: [
          {
            required: true,
            trigger: 'blur', // 触发器：失去焦点
            message: '请输入借阅天数'
          }
        ]
      },
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
      this.tableLoading = true
      this.request.get("/front/myborrow/ing/borrow", {
        params:{
          pageNum: this.listParam.pageNum,
          pageSize: this.listParam.pageSize,
          bookName: this.listParam.bookName,
          type: this.listParam.type
        }
      }).then(res => {
        if (res.code === '200'){
          this.tableLoading = false
          this.tableData = res.data.list
          this.listParam.total = res.data.total
        }
      })
    },
    handleClick(){
      this.listParam.type = this.activeName
      this.search()
    },
    // 搜索
    search() {
      this.listParam.pageNum = 1
      this.listParam.pageSize = 10
      this.init()
    },
    // 续借
    submitForm () {
      this.$refs.formRef.validate((valid) => {
        if (valid) { // 如果验证通过的话
          this.formLoading = true// 表单加载效果
          this.request.post('/front/myborrow/renewBook', this.form).then(res => {
            this.formLoading = false// 请求到数据之后，关闭表单加载效果
            if (res.code === '200') {
              this.$notify({
                title: '续借成功！',
                type: 'success',
                duration: 2000
              });
              this.handleClose()
              this.search()
            } else {
              this.$notify({
                title: res.msg || '服务器内部异常',
                type: 'error'
              });
            }
          })
        }
      })
    },
    renewBook(id){
      this.title = '续借图书'
      this.form.id = id
      this.form.renewDays = 1
      this.dialogFormVisible = true
    },
    // 获取排序字段的值
    handleTotalCountChange(val){
      this.form.renewDays = val
    },
    backBook(id){
      this.request.post("/front/myborrow/backBook/" + id).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '归还成功！',
            type: 'success',
            duration: 2000
          });
          this.search()
        } else {
          this.$message.error(res.msg || '服务器内部异常')
        }
      })
    },
    backBookNow(id){
      this.request.post("/front/myborrow/forceback/" + id).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '归还逾期图书成功！',
            type: 'success',
            duration: 2000
          });
          this.search()
        } else {
          this.$message.error(res.msg || '服务器内部异常')
        }
      })
    },
    makeValuate(id){
      this.title = '请留下您的宝贵评价！'
      this.id = id
      this.dialogVisibleScore = true
    },
    markScore(){
      this.request.post("/front/myborrow/markScore",{
        id: this.id,
        score: this.score
      }).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '感谢您的评价！',
            type: 'success',
            duration: 2000
          });
          // 把分数查出来,做回显
          this.score =  res.data.score
        } else {
          this.$message.error(res.msg || '服务器内部异常')
        }
      })
    },
    // 关闭dialog时的操作
    handleClose () {
      this.dialogFormVisible = false
      this.form = {} // 重置form
      this.$refs.formRef.resetFields()// 在关闭的时候，清除所有的字段和校验信息
    },
    // 关闭dialog时的操作
    handleCloseScore () {
      this.dialogVisibleScore = false
      this.search()
    },
    // 重置按钮
    resetForm() {
      // 清空表单内容
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
  }
}

</script>

<style scoped>

</style>
