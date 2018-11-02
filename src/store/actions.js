import * as types from './mutation-types'
import { shuffle } from '@/common/js/util'
import { playMode } from '@/common/js/config'
import { 
  saveSearch,
  deleteSearch,
  deleteSearchAll
} from '@/common/js/cache'
/*
 *actions不是直接操作state，
 *而是操作mutations
 *说白了就是对mutations的封装
 */

/*
 *返回index
 */
function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

/*
 *选择列表音乐播放
 */
export const selectSong = ({commit, state}, {list, index}) => {
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
export const randomSong = ({commit}, {list}) => {
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_SEQUANCE_LIST, list)
  let _list = shuffle(list)
  commit(types.SET_PLAY_LIST, _list)
  commit(types.SET_MODE, playMode.random)
  commit(types.SET_CURRENT_INDEX, 0)
}

/*
 * 搜索页插入音乐
 */
export const insertSong = ({commit, state}, {song}) => {
  let playList = state.playList.slice()
  let sequanceList = state.sequanceList.slice()
  let currentIndex = state.currentIndex
  // 查找playList是否已存在添加的歌曲，若存在，就上去列表中的歌曲再push新歌曲
  let playListIndex = findIndex(playList, song)
  // 记录当前播放的歌曲
  let currentSong = playList[currentIndex]
  currentIndex++
  playList.splice(currentIndex, 0, song)

  if (playListIndex > -1) {
    // playListIndex > -1表示列表中已存在歌曲
    if (playListIndex < currentIndex) {
      // [1,2,3,4],如果当前播放的是3,插入的歌曲是2，变成[1,2,3,2,4]
      playList.splice(playListIndex, 1)
      // splice后，currentIndex要-1
      currentIndex--
    } else {
      // [1,2,3,4,5],如果当前播放的是3,插入的歌曲是5，变成[1,2,3,5,4]
      playList.splice(playListIndex, 1)
    }
  }
  // 垃圾代码写法
  // if (playListIndex > -1) {
  //   // 歌曲已存在列表当中
  //   if (playListIndex < currentIndex) {
  //     playList.splice(playListIndex, 1)
  //     playList.splice(currentIndex, 0, song)
  //   } else {
  //     playList.splice(playListIndex, 1)
  //     currentIndex++
  //     playList.splice(currentIndex, 0, song)
  //   }
  // } else {
  //   currentIndex++
  //   playList.splice(currentIndex, 0, song)
  // }

  // sequanceList列表存在歌曲的index
  let sequanceListIndex = findIndex(sequanceList, song)
  // 当前播放歌曲的index，这里之所以跟playList的currentindex不同，是因为playList有3中播放模式
  let currentsIndex = findIndex(sequanceList, currentSong) + 1
  sequanceList.splice(currentsIndex, 0, song)
  if (sequanceListIndex > -1) {
    if (sequanceListIndex < currentsIndex) {
      sequanceList.splice(sequanceListIndex, 1)
      currentsIndex--
    } else {
      sequanceList.splice(sequanceListIndex, 1)
    }
  }
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_PLAY_LIST, playList)
  commit(types.SET_SEQUANCE_LIST, sequanceList)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULL_SCREEN, true)
}

/**
 * setSearchHistory
 * 设置搜索历史
 * @param {*} { commit }
 * @param {*} { list }
 */
export const setSearchHistory = ({commit}, {query}) => {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

/**
 * 删除单个记录
 *
 * @param {*} {commit}
 * @param {*} query
 */
export const deleteSearchOne = ({commit}, query) => {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const clearSearchAll = ({commit}) => {
  commit(types.SET_SEARCH_HISTORY, deleteSearchAll())
}

/**
 * 删除单个playList中的song
 *
 * @param {*} { commit, state }
 * @param {*} { song }
 */
export const deletePlayListOne = ({ commit, state }, song) => {
  let playList = state.playList.slice()
  let sequanceList = state.sequanceList.slice()
  let currentIndex = state.currentIndex

  let pindex = findIndex(playList, song)
  let sindex = findIndex(sequanceList, song)

  playList.splice(pindex, 1)
  sequanceList.splice(sindex, 1)
  
  if (currentIndex > pindex || currentIndex === playList.length) {
    currentIndex--
  }
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_PLAY_LIST, playList)
  commit(types.SET_SEQUANCE_LIST, sequanceList)

  let playListIndex = playList.length > 0
  commit(types.SET_PLAYING_STATE, playListIndex)
  // if (!playList.length) {
  // } else {
  //   commit(types.SET_PLAYING_STATE, true)
  // }
}
