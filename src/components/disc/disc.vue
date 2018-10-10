<template>
  <transition name="slide">
    <MusicList
    :title="title"
    :bgImage="bgImage" />
  </transition>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import MusicList from '@/components/music-list/music-list'
export default {
  data() {
    return {
      
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
