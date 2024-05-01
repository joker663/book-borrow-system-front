<template>
  <div>
    <div>
    <div style="margin: 15px 130px 0 -140px;" class="home">
      <el-carousel height="400px" :interval="1950">
        <el-carousel-item v-for="item in images" :key="item">
          <img :src="item" alt="" style="width: 615px;height: 322px">
        </el-carousel-item>
      </el-carousel>
    </div>
    <div style="margin: -50px 130px 20px -140px;">
      <div style="display: flex;">
        <h2 style="margin-bottom: 15px;color: #19ad4d;z-index: 1">图书推荐</h2>
          <el-button type="text" class="hover-animate" style="margin: -8px 0 0 430px; z-index: 2"
                     icon="el-icon-refresh" size="medium"
                     @click="randomFiveBooks">换一换</el-button>
      </div>
      <div>
          <el-card :span="6" v-for="item in bookData" :key="item.id"
                   style="margin-bottom: 20px; height: 150px; background-color: beige"
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
      </div>
    </div>
    </div>
    <div style="margin: -1243px 0 10px 500px">
      <el-card style="margin-bottom: 10px; height: 260px; width: 250px; background-color: beige; overflow: hidden;">
        <div style="margin: -12px 0 0 -8px;font-weight: bolder">📢系统公告：</div>
        <div class="scrolling-text" ref="scrollingText" style="margin: 10px -10px 0 0">
          <div v-for="(notice, index) in notices" :key="index" style="color: green">
            {{ notice }}<br/><br/>
          </div>
        </div>
        <div style="margin: 4px -8px 0 0;font-size: 13px;float: right;"
             class="view-all-button"
             @click="viewAll">更多公告 ⋙</div>
      </el-card>
    </div>
      <div style="margin: 20px 0 10px 480px;">
        <el-card style="margin: 10px 0 15px 20px; height: 600px; width: 250px; background-color: beige">
          <h4 style="margin: -10px 0 5px -5px; font-style: italic; color: #19ad4d">🥇🥈🥉 借阅排行：</h4>
          <div>
              <el-card :span="6" v-for="(item,index) in bookRanking" :key="item.bookId" style="margin: 10px -5px 10px -5px; height: 60px">
                <div style="font-size: 13px;color: #3F5EFB; margin: -10px 0 0 -10px;font-style: italic;">NO .{{index + 1}}
                  <span style="margin-left: 30px;color: green">借阅次数：{{item.borrowCount}}</span></div>
                <router-link :to="'/front/bookdetail?id=' + item.bookId" style="text-decoration: none;">
                  <div style="font-size: 12px; margin-top: 10px;font-style: italic;color: green;text-align: center"
                       class="hover-underline">《 {{item.name}} 》</div>
                </router-link>
              </el-card>
          </div>
        </el-card>
      </div>
      <div style="margin: 10px 0 10px 480px;">
        <el-card style="margin: 10px 0 15px 20px; height: 327px; width: 250px; background-color: beige">
          <h4 style="margin: -10px 0 5px -5px; font-style: italic; color: #e55c95">🔴🟢🟡 图书分类：</h4>
          <div style="margin: 0 -12px 0 -12px" class="scroll-content" >
            <el-tag size="medium" style="margin-top: 6px;margin-left: 7px">计算机科学</el-tag>
            <el-tag type="success" size="medium" style="margin-top: 6px;margin-left: 7px">编程语言</el-tag>
            <el-tag type="warning" size="medium" style="margin-top: 6px;margin-left: 7px">离散数学</el-tag>
            <el-tag type="warning" size="medium" style="margin-top: 6px;margin-left: 7px">物理学</el-tag>
            <el-tag type="danger" size="medium" style="margin-top: 6px;margin-left: 7px">生物学</el-tag>
            <el-tag size="medium" style="margin-top: 6px;margin-left: 7px">经济学</el-tag>
            <el-tag type="success" size="medium" style="margin-top: 6px;margin-left: 7px">数据结构</el-tag>
            <el-tag type="info" size="medium" style="margin-top: 6px;margin-left: 7px">算法</el-tag>
            <el-tag type="danger" size="medium" style="margin-top: 6px;margin-left: 7px">Java</el-tag>
            <el-tag type="danger" size="medium" style="margin-top: 6px;margin-left: 7px">Java8</el-tag>
            <el-tag size="medium" style="margin-top: 6px;margin-left: 7px">JavaScript</el-tag>
            <el-tag type="success" size="medium" style="margin-top: 6px;margin-left: 7px">PHP</el-tag>
            <el-tag type="info" size="medium" style="margin-top: 6px;margin-left: 7px">C++</el-tag>
            <el-tag type="warning" size="medium" style="margin-top: 6px;margin-left: 7px">Web</el-tag>
            <el-tag type="danger" size="medium" style="margin-top: 6px;margin-left: 7px">前端</el-tag>
            <el-tag size="medium" style="margin-top: 6px;margin-left: 7px">数据库</el-tag>
            <el-tag type="success" size="medium" style="margin-top: 6px;margin-left: 7px">Java21</el-tag>
            <el-tag type="info" size="medium" style="margin-top: 6px;margin-left: 7px">后端</el-tag>
            <el-tag type="info" size="medium" style="margin-top: 6px;margin-left: 7px">Android</el-tag>
            <el-tag type="warning" size="medium" style="margin-top: 6px;margin-left: 7px">大数据科学</el-tag>
            <el-tag type="danger" size="medium" style="margin-top: 6px;margin-left: 7px">开发工具</el-tag>
            <el-tag type="success" size="medium" style="margin-top: 6px;margin-left: 7px">中间件</el-tag>
            <el-tag type="danger" size="medium" style="margin-top: 6px;margin-left: 7px">应用实战</el-tag>
          </div>
        </el-card>
      </div>
    <div style="width: 890px;height: 150px;margin: 5px 130px 0 -140px;;background-color: rgba(248,248,242,0.98)">
      <div style="height: 7px"></div>
      <div style="margin: 30px 0 0 308px">
        Copyright © 2024 Designed by lizhihao
      </div>
      <div style="margin: 10px 0 0 350px">Blog：<a href="https://www.jokerlzh.com" target="_blank">www.jokerlzh.com</a></div>
    </div>

    <el-dialog :title="title"
               :before-close="handleClose"
               :visible.sync="dialogFormVisible"
               width="55%">
      <div class="block">
        <el-timeline>
          <div v-for="(notice, index) in noticeData" :key="index">
            <el-timeline-item :timestamp="'更新于 '+notice.updateTime" placement="top" type="success">
              <el-card>
                <h4>{{notice.content}}</h4>
                <p style="margin-top: 10px;color: grey;font-size: 14px">李志豪 提交于 {{notice.createTime}}</p>
              </el-card>
            </el-timeline-item>
          </div>
        </el-timeline>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose" type="success">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "FrontHome",
  data() {
    return {
      images: [],
      bookData: [],
      bookRanking: [],
      title: '',
      form: {},
      dialogFormVisible: false,
      notices: [
        '这是第一条系统公告',
        '这是第一条系统公告',
        '这是第一条系统公告',
        '这是第一条系统公告',
        '这是第一条系统公告',
        '这是第三条系统公告',
        '这是第三条系统公告',
        '这是第三条系统公告',
        '这是第三条系统公告',
        '这是第三条系统公告',
        '这是第三条系统公告',
        '这是第三条系统公告',
        '这是第三条系统公告',
        '这是第三条系统公告',
        '这是第三条系统公告',
        '这是第三条系统公告',
        '这是第三条系统公告',
        '这是第三条系统公告',
      ],      // 滚动速度（单位：秒）
      scrollSpeed: 25,
      noticeData:[]
    }
  },
  created() {
    this.bookRecommend()
    this.getCarousel()
  },
  mounted() {
    this.fetchNoticesFromBackend()
    this.startScrolling();
    this.bookRankingData();
  },
  computed: {
  },
  methods: {
    bookRecommend(){
      this.request.get("/book/recommend").then(res => {
        if (res.code === '200'){
          this.bookData = res.data
        }
      })
    },
    randomFiveBooks(){
      this.request.get("/book/change/recommend").then(res => {
        if (res.code === '200'){
          this.bookData = res.data
        }
      })
    },
    bookRankingData(){
      this.request.get("/front/index/borrowranking").then(res => {
        if (res.code === '200'){
          this.bookRanking = res.data
        }
      })
    },
    getCarousel(){
      this.request.get("/front/index/carousel/list").then(res => {
        if (res.code === '200'){
          this.images = res.data
        }
      })
    },
    startScrolling() {
      const scrollingText = this.$refs.scrollingText;
      const textHeight = scrollingText.scrollHeight;
      const containerHeight = scrollingText.clientHeight;

      // 确保有足够的内容滚动
      if (textHeight > containerHeight) {
        this.scrollInterval = setInterval(() => {
          scrollingText.scrollTop += 1;

          // 当滚动到底部时，快速回到顶部
          if (scrollingText.scrollTop >= textHeight - containerHeight) {
            scrollingText.scrollTop = 0;
          }
        }, 1000 / this.scrollSpeed); // 根据scrollSpeed调整滚动速度
      }
    },
    // 预留的后端接口函数（示例）
    fetchNoticesFromBackend() {
      this.request.get("/notice/listAll").then(res => {
        if (res.code === '200'){
          this.noticeData = res.data
          this.notices = res.data.map(item => item.content)
        }
      })
    },
    //查看全部公告
    viewAll(){
      this.title = '系统公告'
      this.dialogFormVisible = true
    },

    // 关闭dialog时的操作
    handleClose () {
      this.dialogFormVisible = false
      this.form = {} // 重置form
    },
  },
  // 生命周期钩子，如果需要在组件销毁时停止滚动，可以在这里添加逻辑
  beforeDestroy() {
    // 清除滚动定时器
    clearInterval(this.scrollInterval);
  }
}
</script>

<style scoped>
.hover-underline {
  text-decoration: none; /* 默认情况下移除下划线 */
  transition: text-decoration 0.3s ease; /* 添加过渡效果，使下划线的出现更平滑 */
}

.hover-underline:hover {
  text-decoration: underline; /* 鼠标悬停时添加下划线 */
  color: #2ac225;
}

.hover-animate {
  transition: all 0.3s ease; /* 添加过渡效果，持续时间为0.3秒 */
}

.hover-animate:hover {
  transform: scale(1.1); /* 鼠标悬停时放大1.1倍 */
  color: green; /* 鼠标悬停时改变文字颜色 */
}

.scrolling-text{
  position: relative;
  height: 195px; /* 稍微小于el-card的高度，留出空间给滚动条 */
  overflow-y: auto;
  -ms-overflow-style: none; /* Internet Explorer and Edge */
  scrollbar-width: none; /* Firefox */
}

.scroll-content {
  max-height: calc(100% - 50px); /* 减去头部的高度，假设头部高度为50px */
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  padding: 5px; /* 添加一些内边距，以便更好地看到滚动条 */
  box-sizing: border-box; /* 防止padding影响实际内容区域的大小 */
}

/* 在CSS中定义样式 */
.view-all-button {
  margin: 5px -8px 0 0;
  font-size: 13px;
  float: right;
  color: green;
  cursor: pointer; /* 显示手型光标表示可点击 */
  transition: color 0.3s ease; /* 添加过渡效果使颜色变化更平滑 */
}

.view-all-button:hover {
  color: #3F5EFB; /* 鼠标悬停时变为红色 */
}

</style>
