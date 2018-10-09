import * as types from './mutation-types'
import { shuffle } from '@/common/js/util'
import { playMode } from '@/common/js/config'
/*
 *actions不是直接操作state，
 *而是操作mutations
 */

// 这里是对于mutations的封装
/*
 *选择列表音乐播放
 */
function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export const selectSong = ({
  commit,
  state
}, {
  list,
  index
}) => {
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_SEQUANCE_LIST, list)
  commit(types.SET_FULL_SCREEN, true)
  // 这里是当点击随机播放的时候，再返回列表点击音乐播放。做判断
  if (state.mode === playMode.random) {
    let _list = shuffle(list)
    commit(types.SET_PLAY_LIST, _list)
    index = findIndex(_list, list[index])
  } else {
    commit(types.SET_PLAY_LIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
}

/*
* 随机播放按钮
*/
export const randomSong = ({
  commit
}, {
  list
}) => {
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_SEQUANCE_LIST, list)
  let _list = shuffle(list)
  commit(types.SET_PLAY_LIST, _list)
  commit(types.SET_MODE, playMode.random)
  commit(types.SET_CURRENT_INDEX, 0)
}
