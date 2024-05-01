<template>
  <div>
    <div>
      <h3 style="margin: 30px 0 0 -150px;">{{bookInfo.name}}</h3>
      <div style="margin: 20px 130px 0 -140px;">
        <img :src="bookInfo.cover"
             alt=""
             style="width: 260px; height: 260px">
      </div>

      <div style="margin: -260px -140px 0 150px;">
        <div>——📕📗📘图书信息——————————————————————</div>
        <el-row style="margin-top: 15px">
          <el-col :span="11">
            <span>图书名称：{{bookInfo.name}}</span>
          </el-col>
          <el-col :span="11">
            <span>图书分类：{{bookInfo.category}}</span>
          </el-col>
        </el-row>
        <el-row style="margin-top: 15px">
          <el-col :span="11">
            <span>ISBN：{{bookInfo.isbn}}</span>
          </el-col>
          <el-col :span="11">
            <span>作者：{{bookInfo.author}}</span>
          </el-col>
        </el-row>
        <el-row style="margin-top: 15px">
          <el-col :span="11">
            <span>出版社：{{bookInfo.publisher}}</span>
          </el-col>
          <el-col :span="11">
            <span>出版日期：{{bookInfo.publishDate}}</span>
          </el-col>
        </el-row>
        <el-row style="margin-top: 15px">
          <el-col :span="11">
            <span>已借阅：{{bookInfo.lendCount}} 本</span>
          </el-col>
          <el-col :span="11">
            <span>可借阅：{{bookInfo.leaveCount}} 本</span>
          </el-col>
        </el-row>
        <el-row style="margin-top: 30px">
          <el-button type="success" @click="bookLend" :disabled="isBookLendButtonDisabled">立即借阅 </el-button>
          <el-tooltip content="借阅规则：同一本书只能借阅一次，单次借阅时长默认为30天；每人最多借阅10本书；"
                      placement="bottom-start" style="margin-left: 5px;margin-right: 10px">
            <i class="el-icon-question"/>
          </el-tooltip>
          <span v-if="isCollected">
            <el-button type="warning" icon="el-icon-star-on" size="small" @click="cancelBook"
                       style="color: black;font-size: 12px;background-color: rgba(243,243,10,0.98)">已收藏</el-button>
          </span>
          <span v-else>
            <el-button type="warning" icon="el-icon-star-off" size="small" style="color: white;font-size: 12px" @click="collectBook">收藏</el-button>
          </span>
        </el-row>
      </div>
      <div style="margin: -280px -120px 0 700px;">
        <el-button type="text" style="font-size: 15px" @click="$router.go(-1)">◀ 返回</el-button>
      </div>
    </div>

    <div style="margin: 310px -130px 0 -137px;">
      <div>———🧾图书简介————————————————————————————————————————</div>
      <div style="margin: 10px 30px 0 0;line-height: 1.8;">简 介：{{bookInfo.description}}</div>
    </div>

    <div style="margin: 20px 0 0 -140px;">
      <div style="margin: 30px 0">
        <div style="margin: 10px 0">
          <div style="border-bottom: 2px solid #c9c988;width: 830px; padding: 10px 0; font-size: 20px">评论</div>
          <div style="margin: 10px -80px 0 0">
            <el-input size="small" type="textarea" v-model="commentForm.content"
                      placeholder="在这里输入你的评论吧！"
                      maxlength="200"
                      show-word-limit></el-input>
          </div>
          <div class="pd-10" style="margin: 4px -75px 0 0;text-align: right">
            <el-button type="success" size="small" @click="save">评论</el-button>
          </div>
        </div>

        <!--      评论列表-->
        <div v-if="comments.length > 0">
          <div v-for="item in comments" :key="item.id" style="border-bottom: 1px solid #ccc;width: 830px; padding: 2px 0; ">
            <div style="display: flex; margin: 10px -140px 0 0">
              <div style="width: 100px; text-align: center">
                <el-image :src="item.avatarUrl" style="width: 50px; height: 50px; border-radius: 50%"></el-image>
              </div> <!--  头像-->
              <div style="flex: 1; font-size: 14px; padding: 5px 0; line-height: 25px;color: black">
                <b style="font-size: 16px;">{{ item.nickname }}</b>
                <p style="margin: 5px 0 0 0">{{ item.content }}</p>

                <div style="display: flex; line-height: 20px;margin: 5px 150px 0 0">
                  <div style="width: 200px;margin: 5px 0 0 0">
                    <i class="el-icon-time" style="color: grey"></i><span style="margin: 10px 0 0 0;color: grey">{{ item.time }}</span>
                  </div>
                  <div style="text-align: right; flex: 1">
                    <el-button style="margin-left: 5px" type="text" @click="handleReply(item.id)">回复</el-button>
                    <el-popconfirm
                        title="确定删除吗？"
                        @confirm="del(item.id)"
                    >
                      <el-button v-if="item.readerId === reader.id" type="text" style="color: red" slot="reference" class="ml-5">删除</el-button>
                    </el-popconfirm>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="item.children.length"  style="padding-left: 120px;">
              <div v-for="subItem in item.children" :key="subItem.id" style="border-bottom: 1px solid #d7c7c7;background-color: #f0f0f0; padding: 5px 20px">
                <!--          回复列表-->
                <div style="font-size: 14px; padding: 5px 0; line-height: 25px">
                  <div style="padding-left: 5px">
                    <b style="margin-left: -8px">
                        <el-image :src="subItem.avatarUrl" style="width: 20px; height: 20px; border-radius: 50%"></el-image>
                       {{ subItem.nickname }}
                        <span style="color: grey"> 回复 </span>
                        <el-image :src="item.avatarUrl" style="width: 20px; height: 20px; border-radius: 50%"></el-image>
                        {{ subItem.parentNickname }}
                    </b>
                    <p style="margin: 4px 0 0 5px">{{ subItem.content }}</p>
                  </div>

                  <div style="display: flex; line-height: 20px; margin-top: 5px; padding-left: 5px">
                    <div style="width: 200px;">
                      <i class="el-icon-time" style="color: grey"></i><span style="margin: 10px 0 0 0;color: grey">{{ subItem.time }}</span>
                    </div>
                    <div style="text-align: right; flex: 1">
                      <el-button style="margin-left: 5px" type="text" @click="handleReply(subItem.id)">回复</el-button>
                      <el-popconfirm
                          title="确定删除吗？"
                          @confirm="del(subItem.id)"
                      >
                        <el-button v-if="subItem.readerId === reader.id" type="text" style="color: red" slot="reference" class="ml-5">删除</el-button>
                      </el-popconfirm>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <el-empty description="暂无评论" style="color: black;height: 200px"></el-empty>
        </div>
      </div>

      <el-dialog title="回复"
                 :close-on-click-modal="false"
                 :before-close="handleClose"
                 :visible.sync="dialogFormVisible"
                 width="45%" >
        <el-form label-width="90px" size="small">
          <el-form-item label="回复内容：">
            <el-input type="textarea" v-model="commentForm.contentReply"
                      autocomplete="off"
                      placeholder="在这里输入你的评论吧！"
                      maxlength="200"
                      show-word-limit></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="save" size="small">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "BookDetail",
  data() {
    return {
      bookInfo:[],
      bookId: this.$route.query.id,
      reader: localStorage.getItem("reader") ? JSON.parse(localStorage.getItem("reader")) : {},
      isBookLendButtonDisabled: false, // 初始化为 false，表示按钮可用
      // 是否已经收藏
      isCollected: false,

      comments: [],
      commentForm: {
        content: '',
        contentReply: ''
      },
      id: '',
      dialogFormVisible: false,
    }
  },
  mounted() {
    this.getBookInfo()
    this.isCollect()
    this.loadComment()
  },
  computed: {

  },
  methods: {
    getBookInfo(){
      this.request.get("/front/bookdetail/getById/" + this.bookId).then(res => {
        if (res.code === '200'){
          this.bookInfo = res.data
        }
      })

      this.request.post("/front/bookdetail/judge/lend" , {
        readerId: this.reader.id,
        bookId: this.bookId,
      }).then(res => {
        if (res.code === '200'){
          if (res.data > 0){
            this.isBookLendButtonDisabled = true;
          }
        }
      })
    },
    bookLend(){
      this.request.post("/front/bookdetail/lend", {
          readerId: this.reader.id,
          bookId: this.bookId,
      }).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '借阅成功',
            type: 'success',
            duration: 2000
          });
          // 让按钮变灰，只能借阅一次
          this.isBookLendButtonDisabled = true;
          this.getBookInfo()
        } else {
          this.$message.error(res.msg || '服务器内部异常')
        }
      })
    },
    isCollect(){
      this.request.post("/front/collect/iscollect",{
        readerId: this.reader.id,
        bookId: this.bookId,
      }).then(res => {
        if (res.code === '200') {
          this.isCollected = res.data.state
        } else {
          this.$message.error(res.msg || '服务器内部异常')
        }
      })
    },
    collectBook(){
      this.request.post("/front/collect/addcollect",{
        readerId: this.reader.id,
        bookId: this.bookId,
      }).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '收藏成功！',
            type: 'success',
            duration: 2000
          });
          this.isCollected = res.data.state
        } else {
          this.$message.error(res.msg || '服务器内部异常')
        }
      })
    },
    cancelBook(){
      this.request.post("/front/collect/cancelcollect",{
        readerId: this.reader.id,
        bookId: this.bookId,
      }).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '取消收藏成功！',
            type: 'success',
            duration: 2000
          });
          this.isCollected = res.data.state
        } else {
          this.$message.error(res.msg || '服务器内部异常')
        }
      })
    },
    loadComment() {
      this.request.get("/comment/treeList/" + this.bookId).then(res => {
        if (res.code === '200'){
          this.comments = res.data
        } else {
          this.$message.error(res.msg || '服务器内部异常')
        }
      })
    },
    save() {
      if (!this.reader.id) {
        this.$message.warning("请登录后操作")
        return
      }
      this.commentForm.bookId = this.bookId
      if (this.commentForm.contentReply) {
        this.commentForm.content = this.commentForm.contentReply
      }
      // 如果输入框为空，则不执行保存操作
      if (!this.commentForm.content.trim()) {
        this.$notify({
          title: '内容不能为空！',
          type: 'warning',
          duration: 2000
        });
        return;
      }
      this.request.post("/comment/add", this.commentForm).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '评论成功！',
            type: 'success',
            duration: 2000
          });
          this.commentForm = {}  // 清空评论表单
          this.loadComment()
          this.dialogFormVisible = false
        } else {
          this.$message.error(res.msg || '服务器内部异常')
        }
      })
    },
    del(id) {
      this.request.delete("/comment/delete/" + id).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '删除成功！',
            type: 'success',
            duration: 2000
          });
          this.loadComment()
        } else {
          this.$message.error("删除失败")
        }
      })
    },
    handleReply(pid) {
      this.commentForm = {pid: pid,content: '',contentReply: ''}
      this.dialogFormVisible = true
    },
    // 关闭dialog时的操作
    handleClose () {
      this.dialogFormVisible = false
      this.loadComment()
    },
  }
}
</script>

<style scoped>


</style>
