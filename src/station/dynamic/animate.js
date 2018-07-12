/**
 * Created by Captain on 2018/7/12 15:08.
 */
import {getFc, fabric} from "../../util/stationUtil";
import context from '../../model/context';
import link from '../../model/link';

let lineIds = [5, 6, 7, 8, 10, 11, 13, 14, 15, 16, 19, 20, 22, 23, 235, 24, 25, 54, 55];
let aniInterval;
let fc;
let lineTest;
let trainEntity;
let linkMap;
let fcLineMap;

let trainIndex = 0;

let animateInit = function () {
  $('#startRun').click(startRunTest);
  $('#stopRun').click(stopRunTest);
};

function startRunTest() {
  if (context.getRunning()) {
    return;
  }
  if (!linkMap) {
    linkMap = link.getLinkMapData();
  }
  if (!fcLineMap) {
    fcLineMap = link.getFcLineMap();
  }
  if (!fc) {
    fc = getFc();
  }
  if (!lineTest) {
    lineTest = new fabric.Line([200, 200, 201, 200], {
      stroke: '#000000'
    });
    fc.add(lineTest);
  }
  if (!trainEntity) {
    console.log('--> fcLineMap[lineIds[0]]:', fcLineMap[lineIds[0]]);
    trainEntity = new fabric.Rect(
        {
          left: fcLineMap[lineIds[0]].left - 40,
          top: fcLineMap[lineIds[0]].top - 22,
          fill: '#cc9900',
          width: 40,
          height: 20
        }
    );
    fc.add(trainEntity);
  }

  aniInterval = window.setInterval(animation, 1000);
  context.setRunning(true);
}

function stopRunTest() {
  if (context.getRunning()) {
    window.clearInterval(aniInterval);
    context.setRunning(false);
  }
}

function animation() {
  if (trainIndex >= lineIds.length) {
    stopRunTest();
    return;
  }
  fcLineMap[lineIds[trainIndex]].set(
      {
        stroke: '#FF1B09'
      }
  );
  if (trainEntity.left + 40 > fcLineMap[lineIds[trainIndex + 1]].left) {
    trainIndex++;
    if (trainIndex > 0) {
      fcLineMap[lineIds[trainIndex - 1]].set(
          {
            stroke: '#0827ed'
          }
      )
    }
    fcLineMap[lineIds[trainIndex]].set(
        {
          stroke: '#FF1B09'
        }
    );
  }
  // lineTest.set(
  //     {
  //       x1: lineTest.x1 + 50,
  //       x2: lineTest.x2 + 20
  //     });
  trainEntity.set(
      {
        left: trainEntity.left + 20,
        top: fcLineMap[lineIds[0]].top - 22,
      }
  );
  fc.renderAll();
  console.log('--> move')
}

export {animateInit};