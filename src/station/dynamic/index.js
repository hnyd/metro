/**
 * Created by Captain on 2018/7/10 16:17.
 */
import * as line from './line'
import * as error from './error'
import * as animate from './animate'

let dynamic = function () {
  // line操作初始化
  line.lineInit();
  // 故障信息初始化
  error.errorInit();
  // 动画初始化
  animate.animateInit();
};

export default dynamic;


