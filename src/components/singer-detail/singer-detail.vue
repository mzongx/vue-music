<template>
  <transition name="slide">
    <div class="singer-detail">
      singer-detail
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'common/api/singer'
import { ERR_OK } from 'common/api/config'
import { createSong } from 'common/js/song'
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
    ...mapGetters([
      'singer'
    ])
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
          console.log(this.songs)
        }
      })
    },
    _normalizeSong(list) {
      // 格式化歌曲属性，目的是去掉一些不必要的
      let ret = []
      list.forEach(item => {
        let {musicData} = item
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  components: {

  }
}
</script>

<style scoped lang="stylus">
  @import '~common/stylus/variable'
  .singer-detail
    position fixed
    left 0px
    top 0px
    right 0px
    bottom 0px
    z-index 100
    background $color-background
  .slide-enter-active,.slide-leave-active
    transition transform .3s ease
  .slide-enter,.slide-leave-to
    transform translate3d(100%, 0, 0)
</style>
