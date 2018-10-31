/**
* 该文件写所有缓存信息
*/
import store from './store'

// 用双下滑杠可以防止与外部文件变量重复命名
const SEARCH_KEY = '__SEARCH__'
// 数组最大长度
const SEARCH_KEY_LEN = 15

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
    arr.pop(val)
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

export const deleteSearch = (query) => {
  
}
