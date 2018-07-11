/**
 * Created by Captain on 2018/7/10 16:17.
 */
import * as line from './line'
import * as error from './error'

let dynamic = function () {
  // line操作初始化
  line.lineInit();
  // 故障信息初始化
  error.errorInit();
};

export default dynamic;


