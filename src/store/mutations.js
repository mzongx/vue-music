// 所有同步更改state状态的函数都放在mutations
import * as types from './mutation-types'
const mutations = {
  [types.SET_SINGER](state, singer) {
    // 设置歌手信息
    state.singer = singer
  },
  [types.SET_PLAYING_STATE](state, flag) {
    // 设置播放状态
    state.playing = flag
  },
  [types.SET_FULL_SCREEN](state, flag) {
    // 是否全屏播放器
    state.fullScreen = flag
  },
  [types.SET_PLAY_LIST](state, list) {
    // 播放列表
    state.playList = list
  },
  [types.SET_CURRENT_INDEX](state, index) {
    // 当前索引
    state.currentIndex = index
  },
  [types.SET_MODE](state, mode) {
    // 播放模式
    state.mode = mode
  },
  [types.SET_SEQUANCE_LIST](state, list) {
    // 原始列表
    state.sequanceList = list
  },
  [types.SET_DISC](state, disc) {
    // 设置歌单详情
    state.disc = disc
  },
  [types.SET_TOP_LIST](state, list) {
    // 设置排行榜列表
    state.topList = list
  },
  [types.SET_SEARCH_HISTORY](state, list) {
    state.searchHistory = list
  }
}
export default mutations
