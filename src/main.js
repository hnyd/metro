/**
 * 核心控制
 * Created by Captain on 2018/5/17 8:58.
 */
import * as graphContext from 'stationUtil'
import {axios} from 'sysUtil'
import initStation from 'initStation'
import {userInit} from "./user/user";

// 站场初始化
initStation(graphContext);
// 用户模块初始化
userInit();
