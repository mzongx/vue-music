/*
* 洗牌打乱数组
* 原理就是遍历数组把i与随机idx值替换
*/
export function shuffle(arr) {
  // 复制一下原数组
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = ~~(Math.random() * (i + 1)) // ~~相当于Math.floor
    if (i !== j) {
      [_arr[i], _arr[j]] = [_arr[j], _arr[i]]
    }
  }
  return _arr
}

/**
 * 去除前后空格
 *
 * @export
 * @param {*} text
 */
export function trim(text) {
  let reg = /^(\s)+|(\s)+$/g
  let ret = text.replace(reg, '')
  return ret
}
