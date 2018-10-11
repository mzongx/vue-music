<template>
  <transition name="slide">
    <MusicList
      :title="title"
      :bg-image="bgImage"
      :songs="songs" />
  </transition>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'common/api/singer'
import { ERR_OK } from 'common/api/config'
import { createSong } from 'common/js/song'
import MusicList from '@/components/music-list/music-list'
export default {
  data() {
    return {
      songs: []
    }
  },
  created() {
    this._getSingerDetail(this.singer.id)
  },
  computed: {
    // mapGetters是vuex提供的一个获取state的语法糖
    ...mapGetters([
      'singer'
    ]),
    title() {
      return this.singer.name
    },
    bgImage() {
      return this.singer.avatar
    }
  },
  methods: {
    _getSingerDetail(id) {
      // 这里对刷新进行处理，刷新后vuex是获取不到id的数据的，所以做边界判断
      if (!id) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(id).then((res) => {
        if (ERR_OK === res.code) {
          this.songs = this._normalizeSong(res.data.list)
        }
      })
    },
    _normalizeSong(list) {
      // 格式化歌曲属性，目的是去掉一些不必要的
      let ret = []
      list.forEach(item => {
        console.log(item)
        let {musicData} = item
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  components: {
    // 因为歌曲列表页好几个页面都用到，所以抽出来共享
    MusicList
  }
}
</script>

<style scoped lang="stylus">
  .slide-enter-active,.slide-leave-active
    transition transform .3s ease
  .slide-enter,.slide-leave-to
    transform translate3d(100%, 0, 0)
</style>
