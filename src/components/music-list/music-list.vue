<template>
  <div class="music-list">
    <a class="back" href="javascript:;" @click="back">
      <i class="icon-back"></i>
    </a>
    <div class="title">{{ title }}</div>
    <div class="bg-image" 
      :style="bgStyle"
      ref="bgImage"
    >
      <div class="play-wrapper" ref="playWrapper" v-show="songs.length">
        <div class="play" @click="randomPlay">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="bgLayer"></div>
    <scrollView 
      :data="songs"
      :listenScroll="listenScroll"
      @scroll="scroll"
      :probeType="probeType"
      class="list"
      ref="List"
    >
      <div class="songs-list-wrapper">
        <loading v-if="!songs.length" />
        <SongList :rank="rank" @select="selectItem" :songs="songs" />
      </div>
    </scrollView>
  </div>
</template>

<script type="text/ecmascript-6">
import SongList from '@/base/song-list/song-list'
import scrollView from '@/base/scrollView/scrollView'
import loading from '@/base/loading/loading'
import { prefixStyle } from '@/common/js/dom'
import { mapActions } from 'vuex'
import { playListMixin } from '@/common/js/mixins'
const RESERVED_HEIGHT = 40 // 标题的高度，顶部滑动到达此高度就停止
var transform = prefixStyle('transform')
var backdrop = prefixStyle('backdrop-filter')
export default {
  mixins: [playListMixin],
  props: {
    title: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: function() {
        return []
      }
    },
    bgImage: {
      type: String,
      default: ''
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scrollY: -1
    }
  },
  created() {
    this.listenScroll = true
    this.probeType = 3
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.$refs.List.$el.style.top = `${this.imageHeight}px`
    // 最大滑动距离顶端高度
    this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT
  },
  computed: {
    bgStyle() {
      return `background-image: url(${this.bgImage})`
    }
  },
  methods: {
    handlePlayList(playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.List.$el.style.bottom = bottom
      this.$refs.List.refresh()
    },
    scroll(pos) {
      this.scrollY = Math.floor(pos.y)
    },
    back() {
      this.$router.back()
    },
    selectItem(item, index) {
      // 选择播放
      this.selectSong({
        list: this.songs, 
        index
      })
    },
    randomPlay() {
      // 随机播放
      this.randomSong({
        list: this.songs
      })
    },
    ...mapActions([
      'selectSong',
      'randomSong'
    ])
  },
  watch: {
    'scrollY' (newVal) {
      // 当newVal的值超过最大滑动距离的时候，就取minTranslateY  负值
      let translateY = Math.max(this.minTranslateY, newVal)
      let zIndex = 0
      let scale = 1
      let blur = 0
      this.$refs.bgLayer.style[transform] = `translate3d(0, ${translateY}px, 0)`

      // 图片放大的百分比
      const percent = Math.abs(newVal / this.imageHeight)
      // newVal > 0 代表下拉
      if (newVal > 0) {
        scale = 1 + percent
        zIndex = 10
      } else {
        // 在ios下设置高斯模糊
        blur = Math.min(20 * percent, 20)
      }
      this.$refs.filter.style[backdrop] = `blur(${blur}px)`

      if (newVal < this.minTranslateY) {
        zIndex = 10
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.playWrapper.style.display = 'none'
      } else {
        this.$refs.bgImage.style.height = 0
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.playWrapper.style.display = 'block'
      }
      this.$refs.bgImage.style.zIndex = zIndex
      this.$refs.bgImage.style[transform] = `scale(${scale})`
    }
  },
  components: {
    loading,
    SongList,
    scrollView
  }
}
</script>

<style scoped lang="stylus">
  @import '~common/stylus/variable.styl'
  @import '~common/stylus/mixin.styl'
  .music-list
    position fixed
    left 0px
    top 0px
    right 0px
    bottom 0px
    z-index 100
    background $color-background
    .back
      position absolute
      top 0
      left 6px
      z-index 50
      display block
      .icon-back
        font-size 22px
        display block
        padding 10px
        color $color-theme
    .title
      position absolute
      top 0
      left 10%
      z-index 40
      width 80%
      no-wrap()
      text-align center
      line-height 40px
      font-size 18px
      color #fff
    .bg-image
      position relative
      padding-top 70%
      height 0
      background-size cover
      transform-origin top
      .filter
        position absolute
        left 0
        right 0
        top 0
        bottom 0
        background rgba(7,17,27,.4)
      .play-wrapper
        position absolute
        bottom 20px
        z-index 50
        width 100%
        .play
          box-sizing border-box
          width 135px
          padding 7px 0
          margin 0 auto
          text-align center
          border 1px solid #ffcd32
          color #ffcd32
          border-radius 100px
          font-size 0
        .icon-play
          display inline-block
          vertical-align middle
          margin-right 6px
          font-size 16px
        .text
          display inline-block
          vertical-align middle
          font-size 12px
    .list
      position fixed
      left 0px
      top 0px
      bottom 0px
      right 0px
      background $color-background
      .songs-list-wrapper
        padding 20px 30px
    .bg-layer
      position relative
      height 100%
      background-color $color-background
</style>
