<template>
  <div>
    <el-row :gutter="10" style="margin-top: 5px;">
      <el-col :span="6">
        <el-card style="background-color: #409EFF;color: #FFFFFF">
          <div><i class="el-icon-user-solid"></i> 读者总数</div>
          <div style="padding: 10px 0;text-align: center;font-weight: bold">{{totalData.readerCount}}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="background-color: #E6A23C;color: #FFFFFF">
          <div><i class="el-icon-document"></i> 图书总数</div>
          <div style="padding: 10px 0;text-align: center;font-weight: bold">{{ totalData.totalTotalCount }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="background-color: #F56C6C;color: #FFFFFF">
          <div><i class="el-icon-sold-out"></i> 已借出</div>
          <div style="padding: 10px 0;text-align: center;font-weight: bold">{{ totalData.totalLendCount }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="background-color: #67C23A;color: #FFFFFF">
          <div><i class="el-icon-sell"></i> 可借阅</div>
          <div style="padding: 10px 0;text-align: center;font-weight: bold">{{ totalData.totalLeaveCount }}</div>
        </el-card>
      </el-col>
      <el-row>
        <el-col :span="12">
          <div id="main" style="width: 520px; height: 400px; margin-top: 40px"></div>
        </el-col>
        <el-col :span="12">
          <div id="pie" style="width: 600px; height: 400px; margin-top: 40px"></div>
        </el-col>
      </el-row>
      <el-row>
          <div id="line" style="height: 400px; margin-top: 5px"></div>
      </el-row>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  data() {
    return {
      totalData:{},
    }
  },
  mounted() {
    this.init()
    // 柱状图
    var option = {
      title: {
        text: '各季度借阅数量统计',
        left: 'center'
      },
      xAxis: {
        type: 'category',
        data: ["第一季度", "第二季度", "第三季度", "第四季度"]
      },
      yAxis: {
        type: 'value'
      },
      tooltip: {
        trigger: 'item'
      },
      toolbox: {
        feature: {
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      series: [
        {
          name: '借阅数量',
          data: [],
          type: 'bar'
        }
      ]
    };
    var chartDom = document.getElementById('main');
    var myChart = echarts.init(chartDom);
    this.request.get("/home/quarter").then(res => {
      if (res.code === '200'){
        option.series[0].data = res.data
        myChart.setOption(option);
      }
    })

    // 饼图
    var pieOption = {
      title: {
        text: '各分类图书借阅占比',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          type: 'pie',
          radius: '60%',
          label:{            //饼图图形上的文本标签
            normal:{
              show:true,
              position:'inner', //标签的位置
              textStyle : {
                fontWeight : 300 ,
                fontSize : 15,    //文字的字体大小
                color: "#fff"
              },
              formatter:'{d}%'
            }
          },
          data: [],  // 填空
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    var pieDom = document.getElementById('pie');
    var pieChart = echarts.init(pieDom);
    this.request.get("/home/type").then(res => {
      if (res.code === '200'){
        pieOption.series[0].data = res.data
        pieChart.setOption(pieOption);
      }
    })

    //折线图
    var lineOption = {
      title: {
        text: '近7天图书借还趋势'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['借出', '归还', '逾期']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: []
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '借出',
          type: 'line',
          data: []
        },
        {
          name: '归还',
          type: 'line',
          data: []
        },
        {
          name: '逾期',
          type: 'line',
          data: []
        }
      ]
    };
    var lineDom = document.getElementById('line');
    var lineChart = echarts.init(lineDom);
    this.request.get("/home/trend").then(res => {
      if (res.code === '200'){
        lineOption.xAxis.data = res.data.xAxis
        // lineOption.series[0].data = res.data.lendingList
        // lineOption.series[1].data = res.data.backList
        // lineOption.series[2].data = res.data.overdueList
        lineOption.series[0].data = [3,4,5,3,2,5,6]
        lineOption.series[1].data = [2,6,4,5,6,5,4]
        lineOption.series[2].data = [5,4,3,5,3,1,3]
        lineChart.setOption(lineOption);
      }
    })

  },
  methods: {
    // 初始化表格信息
    init() {
      this.request.get("/home/statistics").then(res => {
        if (res.code === '200'){
          this.totalData = res.data
        }
      })
    },
  }
}

</script>
