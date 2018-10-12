import jsonp from '@/common/js/jsonp'
import { commonParams, options } from './config'
/**
 * 获取排行榜
 * return jsonp
 * @export
 */
export function getTopList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
  const data = Object.assign({}, commonParams, {
    g_tk: 1928093487,
    platform: 'h5',
    needNewCode: 1,
    uin: 0
  })

  return jsonp(url, data, options)
}
