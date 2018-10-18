<template>
  <transition name="slide">
    <MusicList
      :title="title"
      :bgImage="bgImage"
      :songs="musicList"
      :rank="rank" />
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from '@/components/music-list/music-list'
import { mapGetters } from 'vuex'
import { getMusicList } from '@/common/api/rank'
import { ERR_OK } from '@/common/api/config'
import { createSong } from '@/common/js/song'
export default {
  data() {
    return {
      musicList: [],
      rank: true
    }
  },
  created() {
    this._getMusicList()
  },
  methods: {
    _getMusicList() {
      if (!this.topList.id) {
        this.$router.push({
          path: '/rank'
        })
      }
      getMusicList(this.topList.id).then((res) => {
        if (res.code === ERR_OK) {
          this.musicList = this._normalizeSongs(res.songlist)
        }
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach((item) => {
        let songList = item.data
        if (songList.songid && songList.albumid) {
          ret.push(createSong(songList))
        }
      })
      return ret
    }
  },
  computed: {
    ...mapGetters([
      'topList'
    ]),
    title() {
      return this.topList.topTitle
    },
    bgImage() {
      if (this.musicList.length) {
        return this.musicList[0].image
      }
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
