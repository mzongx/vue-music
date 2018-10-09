import { commonParams } from './config'
import axios from 'axios'

export function getLyric(mid) {
  // 请求本地服务器，绕过qq音乐验证
  const url = '/api/lyric'
  const data = Object.assign({}, commonParams, {
    songmid: mid,
    pcachetime: +new Date(),
    hostUin: 0,
    format: 'json',
    platform: 'yqq',
    needNewCode: 0
  })

  return axios.get(url, {
    params: data
  }).then((responed) => {
    return Promise.resolve(responed.data)
  })
}
