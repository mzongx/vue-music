/**
* 本地存储实现, 封装localStorage和sessionStorage
* store只能存字符串
*/
let store = {
  version: '__VERSION__',
  storage: window.localStorage,
  session: {
    storage: window.sessionStorage
  }
}

let api = {
  set(key, val) {
    if (val === undefined) {
      // set没有值的话，就删除掉该key
      return this.remove(key)
    }
    this.storage.setItem(key, JSON.stringify(val))
    return val
  },
  get(key, def) {
    let val = deserialize(this.storage.getItem(key))
    return (val === undefined) ? def : val
  },
  remove(key) {
    this.storage.removeItem(key)
  }
}

function deserialize(val) {
  if (typeof val !== 'string') {
    return undefined
  }
  try {
    return JSON.parse(val)
  } catch (e) {
    return val || undefined
  }
}

// Object.assign会改变目标对象，api会覆盖目标对象
Object.assign(store, api)
Object.assign(store.session, api)

export default store
