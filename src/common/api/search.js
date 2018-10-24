import jsonp from '@/common/js/jsonp'
import { commonParams, options } from './config'
import axios from 'axios'

/**
 * 获取热门搜索
 *
 * @export getHotkey
 * @returns jsonp
 */
export function getHotkey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
  const data = Object.assign({}, commonParams, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1
  })

  return jsonp(url, data, options)
}

/**
 *
 *
 * @export
 * @param {查询的关键词} query
 * @param {是否开启歌手} catZhida
 * @param {页数} page
 * @param {条数} perpage
 * @returns
 */
export function search(query, zhida, page, perpage) {
  const url = '/api/getSearch'
  const data = Object.assign({}, commonParams, {
    uin: 0,
    format: 'json',
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'h5',
    needNewCode: 1,
    w: query,
    zhidaqu: 1,
    catZhida: zhida ? 1 : 0,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage,
    n: perpage,
    p: page,
    remoteplace: 'txt.mqq.all'
  })

  return axios.get(url, {
    params: data
  }).then((responed) => {
    return Promise.resolve(responed.data)
  })
}
