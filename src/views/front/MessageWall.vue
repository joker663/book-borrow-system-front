<template>
  <div class="content">
    <j-barrage
        :barrageDate="barrageDate"
        :repetition="repetition"
        :full="full"
        :time="time"
        :showBtn="showBtn"></j-barrage>
  </div>
</template>

<script>
import JBarrage from "@/views/front/component/JBarrage.vue";

export default {
  name: "MessageWall",
  components: {JBarrage},
  data() {
    return {
      /**
       * barrageDate  弹幕列表  Array  弹幕列表
       * text  弹幕内容  String  弹幕内容
       * color  弹幕文字颜色  String  弹幕文字颜色
       * position  弹幕位置  String  弹幕位置，可以为'top','center','bottom','random'
       * full  是否全屏弹幕  Boolean  是否全屏弹幕，默认为true
       * time  弹幕滑过屏幕时间  Number  弹幕滑过屏幕时间，默认为10（单位为秒）
       * repetition  是否重复弹幕  Boolean  是否重复弹幕，即一轮弹幕展示完后会重新循环播放，默认为true
       * startFrom  弹幕出现位置  String  弹幕出现位置，可以为'left'或'right'默认为left
       * showBtn  是否展示弹幕发送框  Boolean  是否展示弹幕发送框，默认为true
       */
      reader: localStorage.getItem("reader") ? JSON.parse(localStorage.getItem("reader")) : {},
      showBtn: true,
      full: true,
      repetition: true,
      time: 16,
      barrageDate: [],
    }
  },
  created() {
  },
  methods: {

  }
}
</script>

<style scoped>


</style>
