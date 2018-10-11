import jsonp from '@/common/js/jsonp'
import { commonParams, options } from './config'
import axios from 'axios'

/**
 *
 * 获取轮播
 * @export
 * @returns { jsonp }
 */
export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const data = Object.assign({}, commonParams, {
    uid: 0,
    platform: 'h5',
    needNewCode: 1
  })
  return jsonp(url, data, options)
}

// export function getDescList() {
//   const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
//   const data = Object.assign({}, commonParam, {
//     rnd: Math.random(),
//     hostUin: 0,
//     platform: 'yqq',
//     needNewCode: 0,
//     sin: 0,
//     ein: 29
//   })
//   return jsonp(url, data, options)
// }

/**
 *
 * 获取推荐歌单列表
 * @export
 * @returns { Promise }
 */
export function getDescList() {
  const url = '/api/getDescList'
  const data = Object.assign({}, commonParams, {
    rnd: Math.random(),
    hostUin: 0,
    format: 'json',
    categoryId: 10000000,
    sortId: 5,
    platform: 'yqq',
    needNewCode: 0,
    sin: 0,
    ein: 29
  })
  // 因為QQ音樂做了验证，所以通过axios可以绕过验证
  return axios.get(url, {
    params: data
  }).then((responed) => {
    return Promise.resolve(responed.data)
  })
}

/**
 *
 * 获取推荐歌单歌曲列表
 * params {*} disstid
 * @export
 * @returns { Promise }
 */
export function getDiscInfo(disstid) {
  const url = '/api/getDiscInfo'
  const data = Object.assign({}, commonParams, {
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    disstid,
    g_tk: 2090557760,
    hostUin: 0,
    format: 'json',
    notice: 0,
    needNewCode: 0,
    platform: 'yqq'
  })
  // 因為QQ音樂做了验证，所以通过axios可以绕过验证
  return axios.get(url, {
    params: data
  }).then((responed) => {
    return Promise.resolve(responed.data)
  })
}
