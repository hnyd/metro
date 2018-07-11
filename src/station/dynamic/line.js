/**
 * Created by Captain on 2018/7/10 16:10.
 */
// import echarts from '../../../static/js/echarts.common.min'

let option = {
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    name: '时间',
    type: 'category',
    boundaryGap: false,
    data: ['00:00', '01:15', '02:30', '03:45', '05:00', '06:15', '07:30', '08:45', '10:00',
           '11:15', '12:30', '13:45', '15:00', '16:15', '17:30', '18:45', '20:00', '21:15',
           '22:30', '23:45'],
    splitLine: {
      show: true
    }
  },
  yAxis: {
    name: '车站',
    axisTick: {
      alignWithLabel: true
    },
    boundaryGap: false,
    splitLine: {
      show: true
    },
    data: ['北客站', '北苑站', '动物公园站', '行政中心站', '凤城五路站', '市图书馆站', '大明宫西站', '龙首原站', '安远门站', '北大街站']
  },
  series: [{
    data: [['00:00', '北客站'], ['02:30', '行政中心站'], ['05:00', '大明宫西站'], ['07:30', '北大街站'],
      ['10:00', '北大街站'], ['12:30', '大明宫西站'], ['15:00', '行政中心站'], ['17:30', '北客站']],
    type: 'line'
  },
    {
      data: [['01:15', '北客站'], ['03:45', '行政中心站'], ['06:15', '大明宫西站'], ['08:45', '北大街站'],
        ['11:15', '北大街站'], ['13:45', '大明宫西站'], ['16:15', '行政中心站'], ['18:45', '北客站']],
      type: 'line'
    }]
};

let li = function () {
  // TODO
};

function lineInit() {
  // -- shown content --
  $('#runChartD').on('shown.bs.modal', function () {
    let myChart = echarts.init(document.getElementById('dialogBody'));
    myChart.setOption(option);
  });

  // -- click --
  $('#runChart').click(function () {
    $('#runChartD').modal();
  });

  $('#runTable').click(function () {
    $('#runTableD').modal();
  });
}

export {lineInit, li};