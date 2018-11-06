/**
* 该文件写所有缓存信息
*/
import store from './store'

// 用双下滑杠可以防止与外部文件变量重复命名
const SEARCH_KEY = '__SEARCH__'
// 数组最大长度
const SEARCH_KEY_LEN = 15

// 记录最近播放
const PLAY_KEY = '__PLAY__'
const PLAY_KEY_LEN = 200

/**
 * 插入数组
 * 
 * @param {*} arr
 * @param {*} val
 * @param {*} compare
 * @param {*} SEARCH_KEY_LEN
 */
function insertArray(arr, val, compare, MAXLEN) {
  let index = arr.findIndex(compare)
  if (index === 0) return
  if (index > 0) {
    // 在历史记录中找到query，则删除当前query，在数组开头插入新的query
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (MAXLEN && arr.length > MAXLEN) {
    // 数量大于MAXLEN就删除最后一个
    arr.pop(val)
  }
}

/**
 * 删除单个记录
 *
 * @param {*} arr
 * @param {*} val
 * @param {*} compare
 */
function deleteArray(arr, compare) {
  let index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

/**
 * 储存搜索记录
 * @param {*} query
 * @returns
 */
export const saveSearch = (query) => {
  let searchHistory = store.get(SEARCH_KEY, [])
  insertArray(searchHistory, query, (item) => {
    return item === query
  }, SEARCH_KEY_LEN)
  store.set(SEARCH_KEY, searchHistory)
  return searchHistory
}

/**
 * 删除搜索记录
 *
 * @param {*} query
 * @returns
 */
export const deleteSearch = (query) => {
  let searchHistory = store.get(SEARCH_KEY, [])
  deleteArray(searchHistory, (item) => {
    return item === query
  })
  store.set(SEARCH_KEY, searchHistory)
  return searchHistory
}

/**
 * 删除全部搜索记录
 *
 * @param {*} query
 * @returns
 */
export const deleteSearchAll = () => {
  let res = []
  store.set(SEARCH_KEY, res)
  return res
}

/**
 * 储存最近播放
 *
 * @param {*} song
 */
export const savePlay = (song) => {
  let playHistory = store.get(PLAY_KEY, [])
  insertArray(playHistory, song, (item) => {
    return item.id === song.id
  }, PLAY_KEY_LEN)
  store.set(PLAY_KEY, playHistory)
  return playHistory
}
