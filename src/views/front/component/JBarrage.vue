<template>
  <div id="j-barrage-content"
      :style="{ '--width': width }"
      @click="showToolsBox = false">
    <div id="full-barrage-content" :style="{ '--width': width}"></div>
    <div style="width: 1200px;height: 630px;margin: 2px 600px 20px -265px;" class="wrapper"></div>
    <div style="margin: -570px 0 0 60px;font-style: italic;color: green;font-weight: bolder;font-size: 45px">
      留言墙</div>
     <div class="j-barrage-tools-box" @click.stop="() => {}" v-if="showToolsBox" style="margin: 270px 0px 20px 0px;">
       <div style="background-color: #FFCA0A;width: 340px">
          <div class="j-barrage-send-box-item">
              <span style="margin-left: 10px">颜色：</span><input v-model="sendObj.color" type="color" />
          </div>
          <div class="j-barrage-send-box-item">
              <span style="margin-left: 10px">位置：</span>
              <template v-for="(pos, index) in position">
                  <span :key="'pos-span-' + index">{{ pos }}</span>
                  <input style="margin-right: 5px"
                      :key="'pos-input-' + index"
                      name="position"
                      type="radio"
                      :value="pos"
                      v-model="sendObj.position"/>
              </template>
          </div>
       </div>
      </div>
     <div v-if="!showToolsBox" style="margin: 340px -500px 0 0;">
        <span v-if="showBtn" class="j-barrage-send-box-item input-box">
          <span style="margin: 100px 10px 0 5px;font-size: 23px;cursor: pointer;color: green"
                @click.stop="showToolsBox = !showToolsBox" class="j-barrage-send-box-item-tools"> A </span>
          <el-input v-model="sendObj.text" @focus="showToolsBox = false" placeholder="请留下你宝贵的意见"
                    maxlength="50" show-word-limit style="width: 500px;border: 1px solid green">
          </el-input>
          <el-button style="margin-left: 5px;background-color: #15a815;color: white" size="medium"
                     @click="sendBarrage">留言</el-button>
        </span>
    </div>
     <div v-else style="margin: 0px -100px 10px -20px;">
          <span v-if="showBtn" class="j-barrage-send-box-item input-box">
            <span style="margin: 100px 10px 0 5px;font-size: 23px;cursor: pointer;color: green"
                  @click.stop="showToolsBox = !showToolsBox"
                  class="j-barrage-send-box-item-tools"> A </span>
            <el-input v-model="sendObj.text" @focus="showToolsBox = false" placeholder="请留下你宝贵的意见"
                      maxlength="50" show-word-limit style="width: 500px;border: 1px solid green">
            </el-input>
            <el-button style="margin-left: 5px;background-color: #15a815;color: white" size="medium"
                       @click="sendBarrage">留言</el-button>
          </span>
      </div>
  </div>
</template>

<script>
export default {
  name: "JBarrage",
  props: {
    barrageDate: {
      type: Array,
      default: () => {
        return [];
      },
    },
    full: {
      type: Boolean,
      default: true,
    },
    time: {
      type: Number,
      default: 25,
    },
    mask: {
      type: Boolean,
      default: false,
    },
    repetition: {
      type: Boolean,
      default: true,
    },
    startFrom: {
      type: String,
      default: "left",
    },
    showBtn: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      position: ["top", "center", "bottom", "random"],
      showBarrageDate: [],
      liuyanData: [],
      content: null,
      width: "1000px",
      a: "blue",
      sendObj: {
        text: "",
        color: "#008000FF",
        position: "random",
      },
      showToolsBox: false,
      barrageNums: 0,
      clearBarrageTime: null,
      reader: localStorage.getItem("reader") ? JSON.parse(localStorage.getItem("reader")) : {},
    };
  },
  created() {
  },
  // watch: {
  //     barrageNums(newVal) {
  //         if (newVal == 0 && this.repetition) {
  //             this.generateBarrage();
  //         }
  //     }
  // },
  mounted() {
      this.request.get("/feedback/list").then(res => {
        if (res.code === '200') {
          this.liuyanData = res.data
          this.formatDataList();
          this.generateBarrage();
          this.clearBarrage();
        }
      })
  },
  beforeDestroy() {
    clearTimeout(this.clearBarrageTime);
  },
  methods: {
    clearBarrage() {
      let content = this.content;
      let barrageList = document.getElementsByClassName("j-barrage-span");
      barrageList = Array.from(barrageList);
      barrageList.map((item) => {
        if (item.offsetLeft == 0) content.removeChild(item);
      });
      this.clearBarrageTime = setTimeout(() => {
        this.clearBarrage();
      }, this.time * 1000);
    },
    sendBarrage() {
      const obj = this.formatData({ ...this.sendObj });
      this.showBarrageDate.push(obj);
      this.createBarrage(obj);
      if (!this.sendObj.text){
        this.$notify({
          title: '留言内容不能为空！',
          type: 'warning',
          duration: 3500
        });
        return;
      }
      // 获取表单中的值，然后存在数据库中，清空表单，发送成功提示，三秒之内不能再点
      this.request.post("/feedback/save" , {
        readerId: this.reader.id,
        text: this.sendObj.text,
        color: this.sendObj.color,
        position: this.sendObj.position,
      }).then(res => {
        if (res.code === '200'){
          this.$notify({
            title: '感谢留言，您的意见我们都会采纳的哦！🌹🌹🌹',
            type: 'success',
            duration: 4500
          });
          this.sendObj.text = ''
        }
      })
    },
    getRandom(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    },
    getColors() {
      const arr = "0123456789abcdef";
      let color = "#";
      let n = 6;
      while (n--) color += arr[this.getRandom(0, 15)];
      return color;
    },
    getPosition(position = "") {
      let content = this.content;
      let height = content.offsetHeight * 0.9;
      this.width =
          content.offsetWidth +
          (5 * content.offsetWidth) / this.time +
          "px";
      switch (position) {
        case "top":
          return this.getRandom(0, height / 3);
        case "center":
          return this.getRandom(height / 3, (2 * height) / 3);
        case "bottom":
          return this.getRandom((2 * height) / 3, height);
        default:
          return this.getRandom(0, height);
      }
    },
    formatData(item = {}) {
      item.position = this.getPosition(item.position);
      if (!item.color) item.color = this.getColors();
      return item;
    },
    formatDataList() {
      if (this.full)
        this.content = document.getElementById("full-barrage-content");
      else this.content = document.getElementById("j-barrage-content");

      // 请求数据库中的数据
      let showBarrageDate = [...this.liuyanData];
      showBarrageDate.map((item) => {
        item = this.formatData(item);
      });
      this.showBarrageDate = showBarrageDate;
    },
    destroyBarrage(dom = null) {
      if (!dom) return;
      let content = this.content;
      if (content.offsetLeft + content.offsetWidth < dom.offsetLeft) {
        content.removeChild(dom);
        this.barrageNums--;
      } else {
        setTimeout(() => {
          this.destroyBarrage(dom);
        }, 1000);
      }
    },
    createBarrage(item) {
      const content = this.content;
      const span = document.createElement("span");
      span.style.color = item.color;
      span.innerHTML = item.text;
      if (this.full) span.style.position = "fixed";
      span.style.top = item.position + "px";
      if (this.startFrom == "left") {
        span.style.left = "0px";
        span.style.animation = `moveLeft ${this.time}s linear`;
      } else {
        span.style.right = "0px";
        span.style.animation = `moveRight ${this.time}s linear`;
      }
      if (this.mask) {
        span.style.padding = "0.2em 0.5em";
        span.style.backgroundColor = "#bbb2b2";
      }
      span.classList.add("j-barrage-span", "text");
      // span.onmouseover = () => {
      //     console.log("onmouseover");
      //     span.style.fontSize = "larger";
      //     span.style.animationPlayState = "paused";
      // };
      // span.onmouseout = () => {
      //     console.log("onmouseout");
      //     span.style.fontSize = "unset";
      //     span.style.animationPlayState = "running";
      // };
      content.appendChild(span);
      this.barrageNums++;
      this.destroyBarrage(span);
    },
    generateBarrage() {
      let timeFlag = 0;
      this.showBarrageDate.map((item, index) => {
        timeFlag += this.getRandom(0, 2);
        setTimeout(() => {
          this.createBarrage(item);
        }, timeFlag * 1000);
        if (
            index == this.showBarrageDate.length - 1 &&
            this.repetition
        ) {
          setTimeout(() => {
            this.generateBarrage();
          }, timeFlag * 1000 + this.time / 3);
        }
      });
    },
  },
};
</script>
<style vars="{ width }" lang="less">
@keyframes moveLeft {
  from {
    left: 0px;
  }
  to {
    left: var(--width);
  }
}
@keyframes moveRight {
  from {
    right: 0px;
  }
  to {
    right: var(--width);
  }
}
</style>
<style lang="less" scoped>
#full-barrage-content {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 1000;
  pointer-events: none;
}
#j-barrage-content {
  width: 500px;
  height: 100px;
  // position: absolute;
  // overflow: hidden;
  .j-barrage-send-box {
    .j-barrage-tools-box {
      display: inline-block;
      background-color: green;
      color: #fff;
    }
    .j-barrage-send-box-item {
      padding: 0.5rem 0;
    }
    .input-box {
      background-color: #f1f2f3;
      height: 2rem;
      padding: 0;
      border-radius: 8%;
      display: inline-block;
      .j-barrage-send-box-item-tools {
        text-decoration: underline;
        padding: 0 0.5rem;
        cursor: pointer;
      }
      .j-barrage-send-box-item-input {
        height: 1.5rem;
        line-height: 1.5rem;
        outline: none;
        border: none;
        background-color: transparent;
      }
      .j-barrage-send-box-item-btn {
        border-top-right-radius: 15%;
        border-bottom-right-radius: 15%;
        padding: 0.1rem;
        cursor: pointer;
        display: inline-block;
        height: 2rem;
        line-height: 2rem;
        padding: 0 0.8rem;
        background-color: #00aeec;
      }
    }
  }
}

.wrapper {
  height: 100vh;
  overflow: hidden;
  background-image: url("../../../assets/liuyan.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
</style>
