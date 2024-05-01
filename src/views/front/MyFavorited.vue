<template>
  <div>
    <div style="margin: 20px -90px 0 -130px;">
      <div style="display: flex;">
        <h2 style="margin-bottom: 15px;margin-left: -25px;color: #19ad4d;">收藏列表</h2>
        <div style="margin: 1px 0 0 445px; z-index: 2">
          <el-form>
            <el-row >
              <el-col :span="17">
                <el-form-item>
                  <el-input placeholder="请输入关键字" v-model="listParam.bookName" suffix-icon="el-icon-search" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5" style="margin-left: 10px">
                <el-button style="background-color: #19ad4d;color: white" size="small" @click="search" icon="el-icon-search">查询</el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
        <div v-if="bookData.length > 0">
          <el-card :span="6" v-for="item in bookData" :key="item.id"
                   style="margin-bottom: 10px; height: 43px; background-color: beige"
                   shadow="hover">
              <div style="margin: -9px">
                <el-tag type="success" Plain style="font-size: 15px;border: 1px solid green;">{{'已收藏'}}</el-tag>
                <router-link :to="'/front/bookdetail?id=' + item.id" style="text-decoration: none;">
                  <span style="color: #000; margin-left: 5px;margin-top: -15px">
                      <span class="hover-underline">{{'《 '+item.name + " 》"}}</span>
                  </span>
                </router-link>
                <span class="hover-underline" style="color: #9897a2; margin-left: 10px;margin-top: -15px">
                  <span>简介:
                    {{ (item && item.description) ? (item.description.length > 150 ? item.description.substring(0,31) + '……' : item.description) : ''}}
                  </span>
                </span>
              </div>
              <div style="margin: -31px -40px 0 770px">
                <el-tooltip effect="dark" content="取消收藏" placement="right-start">
                  <span class="el-icon-star-on" style="font-size: 31px;color: #ff9900;" @click="cancelBook(item.id)"></span>
                </el-tooltip>
              </div>
          </el-card>
        </div>
      <div v-else>
        <el-button type="text" icon="el-icon-refresh-left" style="margin-left: 700px" size="medium" @click="refresh">刷新</el-button>
        <el-empty description="暂未查询到数据，换个关键词试试呢" style="color: black;height: 500px"></el-empty>
      </div>
      <div v-if="bookData.length > 0" style="margin: 20px">
        <el-pagination
            style="margin-top: 5px;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="listParam.pageNum"
            :page-sizes="[5, 10, 20, 50]"
            :page-size="listParam.pageSize"
            layout="-> ,total, sizes, prev, pager, next, jumper"
            :total="listParam.total">
        </el-pagination>
      </div>
      </div>
  </div>
</template>

<script>
export default {
  name: "FrontHome",
  data() {
    return {
      listParam: {
        bookName: '',
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      reader: localStorage.getItem("reader") ? JSON.parse(localStorage.getItem("reader")) : {},
      bookData: [],
    }
  },
  mounted() {
    this.init()
  },
  computed: {
  },
  methods: {
    init(){
      this.request.get("/front/collect/list", {
        params:{
          pageNum: this.listParam.pageNum,
          pageSize: this.listParam.pageSize,
          bookName: this.listParam.bookName,
          readerId: this.reader.id
        }
      }).then(res => {
        if (res.code === '200'){
          this.bookData = res.data.list
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
    refresh() {
      this.listParam.pageNum = 1
      this.listParam.pageSize = 10
      this.listParam.bookName = ''
      this.init()
    },
    cancelBook(id){
      this.request.post("/front/collect/cancelcollect",{
        readerId: this.reader.id,
        bookId: id,
      }).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '取消收藏成功！',
            type: 'success',
            duration: 2000
          });
          this.search()
        } else {
          this.$message.error(res.msg || '服务器内部异常')
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
  }
}
</script>

<style scoped>
.hover-underline {
  text-decoration: none; /* 默认情况下移除下划线 */
  transition: text-decoration 0.3s ease; /* 添加过渡效果，使下划线的出现更平滑 */
}

.hover-underline:hover {
  //text-decoration: underline; /* 鼠标悬停时添加下划线 */
  color: #2ac225;
}

.hover-animate:hover {
  transform: scale(1.1); /* 鼠标悬停时放大1.1倍 */
  color: green; /* 鼠标悬停时改变文字颜色 */
}
</style>
