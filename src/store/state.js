// 初始化state,默认所有的state都要在这里初始化
// 用一个对象就包含了全部的应用层级状态，所有应用的状态都在这里定义
import { playMode } from '../common/js/config'
const state = {
  singer: {},
  playing: false, // 是否在播放
  fullScreen: false, // 是否全屏
  playList: [], // 播放列表
  currentIndex: -1,
  mode: playMode.sequance, // 播放模式
  sequanceList: [], // 序列列表
  disc: {}, // 歌单详情
  topList: []// 榜单歌曲列表
}
export default state
