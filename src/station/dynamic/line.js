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
    data: ['北客站', '北苑站', '动物公园站', '行政中心站', '凤城五路站', '市图书馆站', '大明宫西站', '龙首原站', '安远门站', '北大街站', '钟楼站',
           '永宁门站', '南梢门站']
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
  tableInit();

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

  $('#addLineBT').click(function () {
    $('#addLineD').modal(
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
}

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
  let rowData = [
    {
      line: "201-03",
      bk: "06:00",
      by: "06:00",
      dw: "06:00",
      xz: "06:00",
      fc: "06:00",
      st: "06:00",
      dm: "06:00",
      ls: "06:00",
      ay: "06:00",
      bd: "06:00",
      zl: "06:00",
      yn: "06:00",
      ns: "06:00"
    },
    {
      line: "201-03",
      bk: "06:00",
      by: "06:00",
      dw: "06:00",
      xz: "06:00",
      fc: "06:00",
      st: "06:00",
      dm: "06:00",
      ls: "06:00",
      ay: "06:00",
      bd: "06:00",
      zl: "06:00",
      yn: "06:00",
      ns: "06:00"
    },
    {
      line: "201-03",
      bk: "06:00",
      by: "06:00",
      dw: "06:00",
      xz: "06:00",
      fc: "06:00",
      st: "06:00",
      dm: "06:00",
      ls: "06:00",
      ay: "06:00",
      bd: "06:00",
      zl: "06:00",
      yn: "06:00",
      ns: "06:00"
    },
    {
      line: "201-03",
      bk: "06:00",
      by: "06:00",
      dw: "06:00",
      xz: "06:00",
      fc: "06:00",
      st: "06:00",
      dm: "06:00",
      ls: "06:00",
      ay: "06:00",
      bd: "06:00",
      zl: "06:00",
      yn: "06:00",
      ns: "06:00"
    },
    {
      line: "201-03",
      bk: "06:00",
      by: "06:00",
      dw: "06:00",
      xz: "06:00",
      fc: "06:00",
      st: "06:00",
      dm: "06:00",
      ls: "06:00",
      ay: "06:00",
      bd: "06:00",
      zl: "06:00",
      yn: "06:00",
      ns: "06:00"
    },
    {
      line: "201-03",
      bk: "06:00",
      by: "06:00",
      dw: "06:00",
      xz: "06:00",
      fc: "06:00",
      st: "06:00",
      dm: "06:00",
      ls: "06:00",
      ay: "06:00",
      bd: "06:00",
      zl: "06:00",
      yn: "06:00",
      ns: "06:00"
    },
    {
      line: "201-03",
      bk: "06:00",
      by: "06:00",
      dw: "06:00",
      xz: "06:00",
      fc: "06:00",
      st: "06:00",
      dm: "06:00",
      ls: "06:00",
      ay: "06:00",
      bd: "06:00",
      zl: "06:00",
      yn: "06:00",
      ns: "06:00"
    },
    {
      line: "201-03",
      bk: "06:00",
      by: "06:00",
      dw: "06:00",
      xz: "06:00",
      fc: "06:00",
      st: "06:00",
      dm: "06:00",
      ls: "06:00",
      ay: "06:00",
      bd: "06:00",
      zl: "06:00",
      yn: "06:00",
      ns: "06:00"
    },
    {
      line: "201-03",
      bk: "06:00",
      by: "06:00",
      dw: "06:00",
      xz: "06:00",
      fc: "06:00",
      st: "06:00",
      dm: "06:00",
      ls: "06:00",
      ay: "06:00",
      bd: "06:00",
      zl: "06:00",
      yn: "06:00",
      ns: "06:00"
    },
    {
      line: "201-03",
      bk: "06:00",
      by: "06:00",
      dw: "06:00",
      xz: "06:00",
      fc: "06:00",
      st: "06:00",
      dm: "06:00",
      ls: "06:00",
      ay: "06:00",
      bd: "06:00",
      zl: "06:00",
      yn: "06:00",
      ns: "06:00"
    },
    {
      line: "201-03",
      bk: "06:00",
      by: "06:00",
      dw: "06:00",
      xz: "06:00",
      fc: "06:00",
      st: "06:00",
      dm: "06:00",
      ls: "06:00",
      ay: "06:00",
      bd: "06:00",
      zl: "06:00",
      yn: "06:00",
      ns: "06:00"
    },
    {
      line: "201-03",
      bk: "06:00",
      by: "06:00",
      dw: "06:00",
      xz: "06:00",
      fc: "06:00",
      st: "06:00",
      dm: "06:00",
      ls: "06:00",
      ay: "06:00",
      bd: "06:00",
      zl: "06:00",
      yn: "06:00",
      ns: "06:00"
    },
    {
      line: "201-03",
      bk: "06:00",
      by: "06:00",
      dw: "06:00",
      xz: "06:00",
      fc: "06:00",
      st: "06:00",
      dm: "06:00",
      ls: "06:00",
      ay: "06:00",
      bd: "06:00",
      zl: "06:00",
      yn: "06:00",
      ns: "06:00"
    },
    {
      line: "201-03",
      bk: "06:00",
      by: "06:00",
      dw: "06:00",
      xz: "06:00",
      fc: "06:00",
      st: "06:00",
      dm: "06:00",
      ls: "06:00",
      ay: "06:00",
      bd: "06:00",
      zl: "06:00",
      yn: "06:00",
      ns: "06:00"
    },
    {
      line: "201-03",
      bk: "06:00",
      by: "06:00",
      dw: "06:00",
      xz: "06:00",
      fc: "06:00",
      st: "06:00",
      dm: "06:00",
      ls: "06:00",
      ay: "06:00",
      bd: "06:00",
      zl: "06:00",
      yn: "06:00",
      ns: "06:00"
    },
    {
      line: "201-03",
      bk: "06:00",
      by: "06:00",
      dw: "06:00",
      xz: "06:00",
      fc: "06:00",
      st: "06:00",
      dm: "06:00",
      ls: "06:00",
      ay: "06:00",
      bd: "06:00",
      zl: "06:00",
      yn: "06:00",
      ns: "06:00"
    },
    {
      line: "201-03",
      bk: "06:00",
      by: "06:00",
      dw: "06:00",
      xz: "06:00",
      fc: "06:00",
      st: "06:00",
      dm: "06:00",
      ls: "06:00",
      ay: "06:00",
      bd: "06:00",
      zl: "06:00",
      yn: "06:00",
      ns: "06:00"
    },
    {
      line: "201-03",
      bk: "06:00",
      by: "06:00",
      dw: "06:00",
      xz: "06:00",
      fc: "06:00",
      st: "06:00",
      dm: "06:00",
      ls: "06:00",
      ay: "06:00",
      bd: "06:00",
      zl: "06:00",
      yn: "06:00",
      ns: "06:00"
    },
    {
      line: "201-03",
      bk: "06:00",
      by: "06:00",
      dw: "06:00",
      xz: "06:00",
      fc: "06:00",
      st: "06:00",
      dm: "06:00",
      ls: "06:00",
      ay: "06:00",
      bd: "06:00",
      zl: "06:00",
      yn: "06:00",
      ns: "06:00"
    },
    {
      line: "201-03",
      bk: "06:00",
      by: "06:00",
      dw: "06:00",
      xz: "06:00",
      fc: "06:00",
      st: "06:00",
      dm: "06:00",
      ls: "06:00",
      ay: "06:00",
      bd: "06:00",
      zl: "06:00",
      yn: "06:00",
      ns: "06:00"
    },
    {
      line: "201-03",
      bk: "06:00",
      by: "06:00",
      dw: "06:00",
      xz: "06:00",
      fc: "06:00",
      st: "06:00",
      dm: "06:00",
      ls: "06:00",
      ay: "06:00",
      bd: "06:00",
      zl: "06:00",
      yn: "06:00",
      ns: "06:00"
    },
    {
      line: "201-03",
      bk: "06:00",
      by: "06:00",
      dw: "06:00",
      xz: "06:00",
      fc: "06:00",
      st: "06:00",
      dm: "06:00",
      ls: "06:00",
      ay: "06:00",
      bd: "06:00",
      zl: "06:00",
      yn: "06:00",
      ns: "06:00"
    },
    {
      line: "201-03",
      bk: "06:00",
      by: "06:00",
      dw: "06:00",
      xz: "06:00",
      fc: "06:00",
      st: "06:00",
      dm: "06:00",
      ls: "06:00",
      ay: "06:00",
      bd: "06:00",
      zl: "06:00",
      yn: "06:00",
      ns: "06:00"
    },
    {
      line: "201-03",
      bk: "06:00",
      by: "06:00",
      dw: "06:00",
      xz: "06:00",
      fc: "06:00",
      st: "06:00",
      dm: "06:00",
      ls: "06:00",
      ay: "06:00",
      bd: "06:00",
      zl: "06:00",
      yn: "06:00",
      ns: "06:00"
    },
    {
      line: "201-03",
      bk: "06:00",
      by: "06:00",
      dw: "06:00",
      xz: "06:00",
      fc: "06:00",
      st: "06:00",
      dm: "06:00",
      ls: "06:00",
      ay: "06:00",
      bd: "06:00",
      zl: "06:00",
      yn: "06:00",
      ns: "06:00"
    },
    {
      line: "201-03",
      bk: "06:00",
      by: "06:00",
      dw: "06:00",
      xz: "06:00",
      fc: "06:00",
      st: "06:00",
      dm: "06:00",
      ls: "06:00",
      ay: "06:00",
      bd: "06:00",
      zl: "06:00",
      yn: "06:00",
      ns: "06:00"
    },
    {
      line: "201-03",
      bk: "06:00",
      by: "06:00",
      dw: "06:00",
      xz: "06:00",
      fc: "06:00",
      st: "06:00",
      dm: "06:00",
      ls: "06:00",
      ay: "06:00",
      bd: "06:00",
      zl: "06:00",
      yn: "06:00",
      ns: "06:00"
    },
    {
      line: "201-03",
      bk: "06:00",
      by: "06:00",
      dw: "06:00",
      xz: "06:00",
      fc: "06:00",
      st: "06:00",
      dm: "06:00",
      ls: "06:00",
      ay: "06:00",
      bd: "06:00",
      zl: "06:00",
      yn: "06:00",
      ns: "06:00"
    },
    {
      line: "201-03",
      bk: "06:00",
      by: "06:00",
      dw: "06:00",
      xz: "06:00",
      fc: "06:00",
      st: "06:00",
      dm: "06:00",
      ls: "06:00",
      ay: "06:00",
      bd: "06:00",
      zl: "06:00",
      yn: "06:00",
      ns: "06:00"
    },
    {
      line: "201-03",
      bk: "06:00",
      by: "06:00",
      dw: "06:00",
      xz: "06:00",
      fc: "06:00",
      st: "06:00",
      dm: "06:00",
      ls: "06:00",
      ay: "06:00",
      bd: "06:00",
      zl: "06:00",
      yn: "06:00",
      ns: "06:00"
    },
    {
      line: "201-03",
      bk: "06:00",
      by: "06:00",
      dw: "06:00",
      xz: "06:00",
      fc: "06:00",
      st: "06:00",
      dm: "06:00",
      ls: "06:00",
      ay: "06:00",
      bd: "06:00",
      zl: "06:00",
      yn: "06:00",
      ns: "06:00"
    }
  ];
  let gridOptions = {
    suppressMovableColumns: true,
    columnDefs: columnDefs,
    rowData: rowData
  };
  let eGridDiv = document.querySelector('#runTableDiv');
  new agGrid.Grid(eGridDiv, gridOptions);
  // let allColumnIds = [];
  // gridOptions.columnApi.getAllColumns().forEach(function(column) {
  //   allColumnIds.push(column.colId);
  // });
  // gridOptions.columnApi.autoSizeColumns(allColumnIds);
}

export {lineInit, li};