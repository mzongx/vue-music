import * as types from './mutation-types'
/*
*actions不是直接操作state，
*而是操作mutations
*/
// 这里是对于mutations的封装
export const selectSong = ({
  commit,
  state
}, {
  list,
  index
}) => {
  commit(types.SET_PLAYING, true)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAY_LIST, list)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_SEQUANCE_LIST, list)
}
