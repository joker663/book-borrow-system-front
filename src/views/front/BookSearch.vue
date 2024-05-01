<template>
  <div>
    <div style="display: flex; align-items: center;margin: 25px -120px 10px -120px;">
      <el-input placeholder="请输入书名/ISBN/作者"
                v-model="queryParam" suffix-icon="el-icon-search" style="border: green solid 1px" clearable></el-input>
          <el-button size="small" type="info" @click="resetForm()" style="margin-left: 10px;" plain>重置</el-button>
          <el-button type="success" size="small" @click="search()" icon="el-icon-search">查询</el-button>
    </div>
  <el-tabs v-model="activeName" @tab-click="handleClick" style="margin: 25px -170px 0 -170px">
    <el-tab-pane>
      <span slot="label" style=";font-size: 16px"><i class="el-icon-date"></i> 全部</span>
      <div v-if="listParam.keywords!=='' && bookData.length > 0" style="font-size: 20px;margin: 0 0 10px 0">为您查询到如下图书：</div>
      <div v-if="bookData.length === 0">
        <el-empty description="暂未查询到图书，换个关键词试试呢！"></el-empty>
      </div>
      <div v-if="bookData.length > 0">
        <el-card :span="6" v-for="item in bookData" :key="item.id"
                 style="margin: 0 150px 10px 150px; height: 150px;width: 650px; background-color: beige"
                 shadow="hover">
          <router-link :to="'/front/bookdetail?id=' + item.id" style="text-decoration: none;">
            <div style="padding-bottom: 15px; ">
              <img :src="item.cover" alt="" style="width: 125px;height: 125px; border: 2px solid #FFF;margin: -8px 0 0 -8px">
              <h4 style="color: #000; margin-left: 135px;margin-top: -125px">
                <div style="display: flex; align-items: center;">
                  <span style="color: #000;margin-right: 10px;background-color: #67C23A;font-size: 16px">👍必读</span>
                  <span class="hover-underline">{{item.name}}</span>
                  <span style="color: #9897a2;margin-left: 10px">推荐指数：</span>
                  <span>
                      <el-rate
                          v-model="item.recommendScore"
                          disabled
                          text-color="#ff9900"
                          show-score
                          disabled-void-color="#C6CEDEFF">
                      </el-rate>
                    </span>
                </div>
              </h4>
              <div style="color: #9897a2; margin-left: 135px;margin-top: 10px">
                <span>简介：</span>
                {{ (item && item.description) ? (item.description.length > 150 ? item.description.substring(0,100) + '……' : item.description) : ''}}
              </div>
            </div>
          </router-link>
        </el-card>
        <el-pagination
            style="margin: 10px 200px 70px 40px;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="listParam.pageNum"
            :page-sizes="[5, 10, 20, 50]"
            :page-size="listParam.pageSize"
            layout="->,total, sizes, prev, pager, next, jumper"
            :total="listParam.total">
        </el-pagination>
      </div>
    </el-tab-pane>
    <el-tab-pane v-for="(item, index) in bookCategory" :key="index" :name="item.id.toString()"  >
      <span slot="label" style=";font-size: 16px"><i class="el-icon-collection-tag"></i> {{ item.name }}</span>
      <div v-if="bookData.length > 0">
        <el-card :span="6" v-for="item in bookData" :key="item.id"
                 style="margin: 0 150px 10px 150px; height: 150px;width: 650px; background-color: beige"
                 shadow="hover">
          <router-link :to="'/front/bookdetail?id=' + item.id" style="text-decoration: none;">
            <div style="padding-bottom: 15px; ">
              <img :src="item.cover" alt="" style="width: 125px;height: 125px; border: 2px solid #FFF;margin: -8px 0 0 -8px">
              <h4 style="color: #000; margin-left: 135px;margin-top: -125px">
                <div style="display: flex; align-items: center;">
                  <span style="color: #000;margin-right: 10px;background-color: #67C23A;font-size: 16px">👍必读</span>
                  <span class="hover-underline">{{item.name}}</span>
                  <span style="color: #9897a2;margin-left: 10px">推荐指数：</span>
                  <span>
                      <el-rate
                          v-model="item.recommendScore"
                          disabled
                          text-color="#ff9900"
                          show-score
                          disabled-void-color="#C6CEDEFF">
                      </el-rate>
                    </span>
                </div>
              </h4>
              <div style="color: #9897a2; margin-left: 135px;margin-top: 10px">
                <span>简介：</span>
                {{ (item && item.description) ? (item.description.length > 150 ? item.description.substring(0,100) + '……' : item.description) : ''}}
              </div>
            </div>
          </router-link>
        </el-card>
        <el-pagination
            style="margin: 10px 200px 70px 40px;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="listParam.pageNum"
            :page-sizes="[5, 10, 20, 50]"
            :page-size="listParam.pageSize"
            layout="->,total, sizes, prev, pager, next, jumper"
            :total="listParam.total">
        </el-pagination>
      </div>
      <div v-else>
        <el-empty description="暂无图书，尽请期待！"></el-empty>
      </div>
    </el-tab-pane>
  </el-tabs>
  </div>
</template>
<script>

export default {
  data() {
    return {
      bookCategory: [],
      bookData: [],
      activeName: "0",
      queryParam: '',
      listParam: {
        keywords: '',
        pageNum: 1,
        pageSize: 5,
        total: 0,
        type: 0
      },
    };
  },
  mounted() {
    this.bookCategoryData()
    this.init()
  },
  created() {
    this.listParam.keywords = this.$route.query.q || '';
  },
  methods: {
    bookCategoryData(){
      this.request.get("/front/index/bookcategory").then(res => {
        if (res.code === '200'){
          this.bookCategory = res.data
        }
      })
    },
    // 初始化表格信息
    init() {
      this.tableLoading = true
      this.request.get("/front/index/bookdata", {
        params:{
          pageNum: this.listParam.pageNum,
          pageSize: this.listParam.pageSize,
          keywords: this.listParam.keywords,
          type: this.listParam.type
        }
      }).then(res => {
        if (res.code === '200'){
          this.tableLoading = false
          this.bookData = res.data.list
          this.listParam.total = res.data.total

          this.listParam.keywords = ''
          this.queryParam = ''
        }
      })
    },
    handleClick() {
      this.listParam.type = this.activeName
      this.search()
    },
    // 搜索
    search() {
      this.listParam.pageNum = 1
      this.listParam.pageSize = 5
      this.listParam.keywords = this.queryParam
      this.init()
    },
    // 重置按钮
    resetForm() {
      // 清空表单内容
      this.listParam.keywords = ''
      this.queryParam = ''
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
};
</script>

<style scoped>

</style>
