// 所有同步更改state状态的函数都放在mutations
import * as types from './mutation-types'
const mutations = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  }
}
export default mutations
