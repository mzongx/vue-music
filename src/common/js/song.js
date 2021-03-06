import { getLyric } from '@/common/api/song'
import { ERR_OK } from '@/common/api/config'
import { Base64 } from 'js-base64'
// 封装一个Song类，这样多个页面都可以抽取这样的结构
export default class Song {
  constructor ({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }

  getLyric() {
    // 因为每次创建歌曲都要去请求一次，为了避免这种情况，这里加一个判断，有歌词就返回歌词
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    // 没有歌词就去请求
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.retcode === ERR_OK) {
          resolve(Base64.decode(res.lyric))
        } else {
          reject(new Error('error'))
        }
      })
    })
  }
}

// 封装new省去每一次调用都要new一次
export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=0&guid=0`
  })
}

function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach(item => {
    ret.push(item.name)
  })
  return ret.join('/')
}
