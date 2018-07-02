import jsonp from '@/common/js/jsonp'
import { commonParam, options } from './config'
import axios from 'axios'
export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const data = Object.assign({}, commonParam, {
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

export function getDescList() {
  const url = '/api/getDescList'
  const data = Object.assign({}, commonParam, {
    rnd: Math.random(),
    hostUin: 0,
    categoryId: 10000000,
    sortId: 5,
    platform: 'yqq',
    needNewCode: 0,
    sin: 0,
    ein: 29
  })
  return axios.get(url, {
    params: data
  }).then((responed) => {
    return Promise.resolve(responed.data)
  })
}
