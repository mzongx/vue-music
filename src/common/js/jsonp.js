import originJsonp from 'jsonp'
export default function jsonp (url, data, option) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  return new Promise((resolve, reject) => {
    originJsonp(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}
// https://y.qq.com/download/download.js?jsonpCallback=MusicJsonCallback&loginUin=1052036428
/*
* https://y.qq.com/download/download.js
* jsonpCallback = Music
* {
    jsonpCallback: Music,
    kkk: '',
    loginUin: 1052036428
  }
*/
function param(data) {
  let url = ''
  for (let k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += `&${k} = ${value}`
  }
  return url ? url.substring(1) : ''
}
