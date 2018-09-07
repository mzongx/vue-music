// 所有同步更改state状态的函数都放在mutations
import * as types from './mutation-types'
const mutations = {
  [types.SET_SINGER](state, singer) {
    // 设置歌手信息
    state.singer = singer
  },
  [types.SET_PLAYING](state, flag) {
    // 设置播放状态
    state.playing = flag
  },
  [types.SET_FULL_SCREEN](state, flag) {
    state.fullScreen = flag
  },
  [types.SET_PLAY_LIST](state, list) {
    state.playList = list
  },
  [types.SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index
  },
  [types.SET_MODE](state, mode) {
    state.mode = mode
  },
  [types.SET_SEQUANCE_LIST](state, list) {
    state.sequanceList = list
  }
}
export default mutations
