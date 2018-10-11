<template>
  <transition name="slide">
    <MusicList
    :title="title"
    :bgImage="bgImage"
    :songs="songList" />
  </transition>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import MusicList from '@/components/music-list/music-list'
import { getDiscInfo } from '@/common/api/recommend'
import { ERR_OK } from '@/common/api/config'
import { createSong } from '@/common/js/song'
export default {
  data() {
    return {
      songList: []
    }
  },
  computed: {
    ...mapGetters([
      'disc'
    ]),
    title() {
      return this.disc.dissname
    },
    bgImage() {
      return this.disc.imgurl
    }
  },
  created() {
    this._getDiscInfo()
  },
  methods: {
    _getDiscInfo() {
      if (!this.disc.dissid) {
        this.$router.push('/recommend')
      }
      getDiscInfo(this.disc.dissid).then((res) => {
        if (res.code === ERR_OK) {
          this.songList = this._normalizeSongs(res.cdlist[0].songlist)
        }
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach(item => {
        if (item.songid && item.albumid) {
          ret.push(createSong(item))
        }
      })
      return ret
    }
  },
  components: {
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
