/**
 * Created by Captain on 2018/7/10 16:10.
 */
// import echarts from '../../../static/js/echarts.common.min'

import {getFc, fabric} from "../../util/stationUtil";

let option = {
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    name: '时间',
    type: 'category',
    boundaryGap: false,
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
    data: ['北客站', '北苑站', '动物公园站', '行政中心站', '凤城五路站', '市图书馆站', '大明宫西站', '龙首原站', '安远门站', '北大街站', '钟楼站',
           '永宁门站', '南梢门站']
  },
  series: []
};

let map = {
  'bk': '北客站',
  'by': '北苑站',
  'dw': '动物公园站',
  'xz': '行政中心站',
  'fc': '凤城五路站',
  'st': '市图书馆站',
  'dm': '大明宫西站',
  'ls': '龙首原站',
  'ay': '安远门站',
  'bd': '北大街站',
  'zl': '钟楼站',
  'yn': '永宁门站',
  'ns': '南梢门站',
};
let upDirection = ['bk', 'by', 'dw', 'xz', 'fc', 'st', 'dm', 'ls', 'ay', 'bd', 'zl', 'yn', 'ns'];
let downDirection = ['ns', 'yn', 'zl', 'bd', 'ay', 'ls', 'dm', 'st', 'fc', 'xz', 'dw', 'by', 'bk'];

let allLineData = {
  'up-000': {
    bk: {
      arrival: '05:40',
      begin: '05:41'
    },
    by: {
      arrival: '05:45',
      begin: '05:46'
    },
    dw: {
      arrival: '05:50',
      begin: '05:51'
    },
    xz: {
      arrival: '05:55',
      begin: '05:56'
    },
    fc: {
      arrival: '06:00',
      begin: '06:01'
    },
    st: {
      arrival: '06:05',
      begin: '06:06'
    },
    dm: {
      arrival: '06:10',
      begin: '06:11'
    },
    ls: {
      arrival: '06:15',
      begin: '06:16'
    },
    ay: {
      arrival: '06:20',
      begin: '06:21'
    },
    bd: {
      arrival: '06:25',
      begin: '06:26'
    },
    zl: {
      arrival: '06:30',
      begin: '06:31'
    },
    yn: {
      arrival: '06:35',
      begin: '06:36'
    },
    ns: {
      arrival: '06:40',
      begin: '06:41'
    }
  }
};
let upLineData = {
  'up-000': {
    bk: {
      arrival: '05:40',
      begin: '05:41'
    },
    by: {
      arrival: '05:45',
      begin: '05:46'
    },
    dw: {
      arrival: '05:50',
      begin: '05:51'
    },
    xz: {
      arrival: '05:55',
      begin: '05:56'
    },
    fc: {
      arrival: '06:00',
      begin: '06:01'
    },
    st: {
      arrival: '06:05',
      begin: '06:06'
    },
    dm: {
      arrival: '06:10',
      begin: '06:11'
    },
    ls: {
      arrival: '06:15',
      begin: '06:16'
    },
    ay: {
      arrival: '06:20',
      begin: '06:21'
    },
    bd: {
      arrival: '06:25',
      begin: '06:26'
    },
    zl: {
      arrival: '06:30',
      begin: '06:31'
    },
    yn: {
      arrival: '06:35',
      begin: '06:36'
    },
    ns: {
      arrival: '06:40',
      begin: '06:41'
    }
  }
};
let downLineData = {};

let li = function () {
  // TODO
};

/**
 * 初始化运行图x坐标刻度
 */
function runCharXInit() {
  let data = [];
  let hour = 5;
  let fen = 30;
  while (hour <= 23) {
    let hourS = hour < 10 ? '0' + hour : hour + '';
    let fenS = fen < 10 ? '0' + fen : fen + '';
    data.push(hourS + ':' + fenS)
    if (fen !== 55) {
      fen += 5;
    } else {
      hour++;
      fen = 0;
    }
  }
  option['xAxis']['data'] = data;
}

function lineInit() {
  // 初始化时刻表
  tableInit();
  // 初始化运行图x坐标刻度
  runCharXInit();

  // -- shown content --
  $('#runChartD').on('shown.bs.modal', function () {
    let myChart = echarts.init(document.getElementById('dialogBody'));
    let series = [];
    Object.keys(upLineData).forEach(function (key) {
      let line = upLineData[key];
      let data = [];
      upDirection.forEach(function (station, index, array) {
        let entity = line[station];
        data.push([entity['arrival'], map[station]]);
        // data.push([entity['begin'], map[station]]);
      });
      series.push({
                    data: data,
                    type: 'line'
                  });
    });
    Object.keys(downLineData).forEach(function (key) {
      let line = downLineData[key];
      let data = [];
      downDirection.forEach(function (station, index, array) {
        let entity = line[station];
        data.push([entity['arrival'], map[station]]);
        // data.push([entity['begin'], map[station]]);
      });
      series.push({
                    data: data,
                    type: 'line'
                  });
    });
    option.series = series;
    myChart.setOption(option);
    console.log(series);
  });

  $('#copyLineD').on('shown.bs.modal', function () {
    $('#lineCopySelect').empty();
    Object.keys(allLineData).forEach(function (key) {
      $('#lineCopySelect').append('<option value=\"' + key + '\">' + key + '</option>');
    })
  });

  // -- click --
  $('#runChart').click(function () {
    $('#runChartD').modal();
  });
  $('#runTable').click(function () {
    $('#runTableD').modal();
  });
  $('#addUpLineBT').click(function () {
    $('#addUpLineD').modal(
        {
          backdrop: 'static',
          keyboard: false
        });
  });
  $('#addDownLineBT').click(function () {
    $('#addDownLineD').modal(
        {
          backdrop: 'static',
          keyboard: false
        });
  });
  $('#copyLineBT').click(function () {
    $('#copyLineD').modal(
        {
          backdrop: 'static',
          keyboard: false
        });
  });

  $('#addUpLineDataBT').click(addUpLineData);
  $('#addDownLineDataBT').click(addDownLineData);
  $('#addCopyLineBT').click(copyLine);
}

/**
 * 复制列车
 */
function copyLine() {
  let name = $('#newLineName').val();
  if (allLineData.hasOwnProperty(name)) {
    alert('警告：' + lineName + '已存在');
    return;
  }
  let key = $('#lineCopySelect').val();
  let interval = parseInt($('#interval').val());
  let data = {};
  let line = allLineData[key];
  upDirection.forEach(function (element, index, array) {
    let entity = line[element];
    data[element] = {
      arrival: getNewTime(entity['arrival'], interval),
      begin: getNewTime(entity['begin'], interval)
    };
  });
  allLineData[name] = data;
  if (upLineData.hasOwnProperty(key)) {
    upLineData[name] = data;
  } else {
    downDirection[name] = data;
  }
  refreshTableData();
  $('#copyLineD').modal('hide');
  console.log('allLine: ', allLineData);
}

/**
 * 获取新的时间
 * @param str 现有时间字符串
 * @param interval 间隔
 */
function getNewTime(str, interval) {
  let hour = parseInt(str.split(':')[0]);
  let fen = parseInt(str.split(':')[1]) + interval;
  hour += parseInt(fen / 60);
  fen %= 60;
  let hourS = hour < 10 ? '0' + hour : hour + '';
  let fenS = fen < 10 ? '0' + fen : fen + '';
  return hourS + ':' + fenS;
}

/**
 * 新增上行列车
 */
function addUpLineData() {
  let lineEntity = {
    bk: {
      arrival: '',
      begin: ''
    },
    by: {
      arrival: '',
      begin: ''
    },
    dw: {
      arrival: '',
      begin: ''
    },
    xz: {
      arrival: '',
      begin: ''
    },
    fc: {
      arrival: '',
      begin: ''
    },
    st: {
      arrival: '',
      begin: ''
    },
    dm: {
      arrival: '',
      begin: ''
    },
    ls: {
      arrival: '',
      begin: ''
    },
    ay: {
      arrival: '',
      begin: ''
    },
    bd: {
      arrival: '',
      begin: ''
    },
    zl: {
      arrival: '',
      begin: ''
    },
    yn: {
      arrival: '',
      begin: ''
    },
    ns: {
      arrival: '',
      begin: ''
    }
  };
  let lineName = $('#addLineNameUp').val();
  if (allLineData.hasOwnProperty(lineName)) {
    alert('警告：' + lineName + '已存在');
    return;
  }
  for (let i in upDirection) {
    let station = upDirection[i];
    lineEntity[station]['arrival'] = document.getElementById(station + 'ArrivalUp').value;
    lineEntity[station]['begin'] = document.getElementById(station + 'BeginUp').value;
  }
  allLineData[lineName] = lineEntity;
  upLineData[lineName] = lineEntity;
  console.log(allLineData);
  alert('添加成功');
  $('#addUpLineD').modal('hide');
  refreshTableData();
}

/**
 * 新增下行列车
 */
function addDownLineData() {
  let lineEntity = {
    bk: {
      arrival: '',
      begin: ''
    },
    by: {
      arrival: '',
      begin: ''
    },
    dw: {
      arrival: '',
      begin: ''
    },
    xz: {
      arrival: '',
      begin: ''
    },
    fc: {
      arrival: '',
      begin: ''
    },
    st: {
      arrival: '',
      begin: ''
    },
    dm: {
      arrival: '',
      begin: ''
    },
    ls: {
      arrival: '',
      begin: ''
    },
    ay: {
      arrival: '',
      begin: ''
    },
    bd: {
      arrival: '',
      begin: ''
    },
    zl: {
      arrival: '',
      begin: ''
    },
    yn: {
      arrival: '',
      begin: ''
    },
    ns: {
      arrival: '',
      begin: ''
    }
  };
  let lineName = $('#addLineNameDown').val();
  if (allLineData.hasOwnProperty(lineName)) {
    alert('警告：' + lineName + '已存在');
    return;
  }
  for (let i in downDirection) {
    let station = downDirection[i];
    lineEntity[station]['arrival'] = document.getElementById(station + 'ArrivalDown').value;
    lineEntity[station]['begin'] = document.getElementById(station + 'BeginDown').value;
  }
  allLineData[lineName] = lineEntity;
  downLineData[lineName] = lineEntity;
  console.log(allLineData);
  alert('添加成功');
  $('#addDownLineD').modal('hide');
  refreshTableData();
}

// -- table --
let gridOptions = {
  suppressMovableColumns: true,
};

/**
 * 列车时刻表初始化
 */
function tableInit() {
  let columnDefs = [
    {headerName: "列车\\车站", field: "line", pinned: 'left', width: 100},
    {headerName: "北客站", field: "bk", width: 100},
    {headerName: "北苑站", field: "by", width: 100},
    {headerName: "动物公园站", field: "dw", width: 100},
    {headerName: "行政中心站", field: "xz", width: 100},
    {headerName: "凤城五路站", field: "fc", width: 100},
    {headerName: "市图书馆站", field: "st", width: 100},
    {headerName: "大明宫西站", field: "dm", width: 100},
    {headerName: "龙首原站", field: "ls", width: 100},
    {headerName: "安远门站", field: "ay", width: 100},
    {headerName: "北大街站", field: "bd", width: 100},
    {headerName: "钟楼站", field: "zl", width: 100},
    {headerName: "永宁门站", field: "yn", width: 100},
    {headerName: "南梢门站", field: "ns", width: 100}
  ];
  let rowData = [];
  Object.keys(allLineData).forEach(function (key) {
    let line = allLineData[key];
    let tmp = {line: key};
    upDirection.forEach(function (station, index, array) {
      let entity = line[station];
      tmp[station] = entity['arrival'] + '-' + entity['begin'];
    });
    rowData.push(tmp);
  });
  gridOptions['columnDefs'] = columnDefs;
  gridOptions['rowData'] = rowData;
  let eGridDiv = document.querySelector('#runTableDiv');
  new agGrid.Grid(eGridDiv, gridOptions);
  // let allColumnIds = [];
  // gridOptions.columnApi.getAllColumns().forEach(function(column) {
  //   allColumnIds.push(column.colId);
  // });
  // gridOptions.columnApi.autoSizeColumns(allColumnIds);
}

/**
 * 更新列车时刻表
 */
function refreshTableData() {
  gridOptions.api.setRowData([]);

  let rowData = [];
  Object.keys(allLineData).forEach(function (key) {
    let line = allLineData[key];
    let tmp = {line: key};
    upDirection.forEach(function (station, index, array) {
      let entity = line[station];
      tmp[station] = entity['arrival'] + '-' + entity['begin'];
    });
    rowData.push(tmp);
  });
  gridOptions.api.updateRowData({add: rowData});
}

export {lineInit, li};