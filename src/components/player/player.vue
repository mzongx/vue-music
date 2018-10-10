<template>
  <div class="player" v-show="playList.length > 0">
    <transition name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image" />
        </div>
        <div class="top">
          <div class="back" @click="back"><i class="icon-back"></i></div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div
          class="middle"
          @touchstart.prevent="onTouchStart"
          @touchmove.prevent="onTouchMove"
          @touchend="onTouchEnd">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" ref="cd" :class="cdCls">
                <img class="image" :src="currentSong.image" />
              </div>
            </div>
            <div v-if="currentlyric" class="playing-lyric-wrapper">
              <div class="playing-lyric">{{ playingLyric }}</div>
            </div>
          </div>
          <scrollView
            class="middle-r"
            :data="currentlyric.lines"
            v-if="currentlyric"
            ref="lyricScroll">
            <div class="lyric-wrapper">
              <div v-if="currentlyric">
                <p class="text"
                  :class="{'current': currentlyricIndex === index}"
                  v-for="(lyric, index) in currentlyric.lines" :key="index"
                  ref="lyricLine">
                  {{ lyric.txt }}
                </p>
              </div>
            </div>
          </scrollView>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <div class="dot" :class="{'active' : currentShow === 1}"></div>
            <div class="dot" :class="{'active' : currentShow === 2}"></div>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar 
                :precent="precent"
                @precent="listenPrecent">
              </progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode"><i :class="playModeIcon"></i></div>
            <div class="icon i-left" :class="disableCls"><i class="icon-prev" @click="prev"></i></div>
            <div class="icon i-center" :class="disableCls"><i :class="playIcon" @click="togglePlaying"></i></div>
            <div class="icon i-right" :class="disableCls"><i class="icon-next" @click="next"></i></div>
            <div class="icon i-right"><i class="icon-not-favorite"></i></div>
          </div>
        </div>
      </div>
    </transition>
    <transition class="mini">
      <div class="mini-player" @click="showPlayer" v-show="!fullScreen">
        <div class="icon">
          <div class="imgWrapper">
            <img :class="cdCls" height="40" width="40" :src="currentSong.image" />
          </div>
        </div>
        <div class="text">
          <p class="name" v-html="currentSong.name"></p>
          <p class="decs" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <ProgressCircle 
            :radius="32"
            :percent="precent">
            <i class="icon-mini"
              :class="miniIcon" 
              @click.stop="togglePlaying">
            </i>
          </ProgressCircle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio 
      :src="currentSong.url" 
      ref="audio" 
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="ended">
    </audio>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapMutations } from 'vuex'
import animations from 'create-keyframe-animation'
import { prefixStyle } from '@/common/js/dom'
import ProgressBar from '@/base/progress-bar/progress-bar'
import ProgressCircle from '@/base/progress-circle/progress-circle'
import { playMode } from '@/common/js/config'
import { shuffle } from '@/common/js/util'
import Lyric from 'lyric-parser'
import scrollView from '@/base/scrollView/scrollView'
const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')
export default {
  data() {
    return {
      songReady: false,
      currentTime: 0,
      currentlyricIndex: 0,
      currentlyric: null,
      playingLyric: '',
      currentShow: 1
    }
  },
  components: {
    ProgressBar,
    ProgressCircle,
    scrollView
  },
  created() {
    this.touches = {}
  },
  mounted() {
    
  },
  computed: {
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniIcon() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    playModeIcon() {
      return this.mode === playMode.sequance ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    cdCls() {
      return this.playing ? 'play' : 'play pause'
    },
    disableCls() {
      return this.songReady ? '' : 'disable'
    },
    precent() {
      return this.currentTime / this.currentSong.duration
    },
    ...mapGetters([
      'playList',
      'fullScreen',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequanceList'
    ])
  },
  watch: {
    currentSong(newVal, oldVal) {
      // 如果当前歌曲id相同，则不去执行播放，防止暂停的时候切换mode执行播放
      if (newVal.id === oldVal.id) {
        return
      }
      
      // 解决切换歌词抖动
      if (this.currentlyric) {
        this.currentlyric.stop()
      }

      this.$nextTick(() => {
        this.$refs.audio.play()
        this.getLyric()
      })
      // 解决微信退出后台播放
      // 因为微信退出后台js是不执行的，但是audio还在播放，结束出发end的时候js执行不了
      // setTimeout(() => {
      //   this.$refs.audio.play()
      //   this.getLyric()
      // }, 1000);
    },
    playing(newPlaying) {
      const audio = this.$refs.audio
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause()
      })
    }
  },
  methods: {
    onTouchStart(e) {
      this.touches.initable = true
      const touch = e.touches[0]
      this.touches.startX = touch.pageX
      this.touches.startY = touch.pageY
    },
    onTouchMove(e) {
      if (!this.touches.initable) return
      const touch = e.touches[0]
      this.touches.deltaX = touch.pageX - this.touches.startX
      this.touches.deltaY = touch.pageY - this.touches.startY

      // 歌词滚动页面如果竖直滚动大于横向，则代表是在滚动歌词，不去换屏
      if (Math.abs(this.touches.deltaY) > Math.abs(this.touches.deltaX)) {
        return
      }
      // 滑屏滚动的起始left
      let left = this.currentShow === 1 ? 0 : -window.innerWidth
      // 滑屏滚动的距离,边界判断
      let offsetWidth = Math.min(0, Math.max(-window.innerWidth, this.touches.deltaX + left))
      this.touches.precent = Math.abs(offsetWidth / window.innerWidth)
      this.$refs.middleL.style.opacity = 1 - this.touches.precent
      this.$refs.lyricScroll.$el.style[transitionDuration] = '0'
      this.$refs.middleL.style[transitionDuration] = '0'
      this.$refs.lyricScroll.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
    },
    onTouchEnd() {
      let offsetWidth
      let opacity
      if (this.currentShow === 1) {
        // 第一屏
        // 边界判断，如果小于10%就不滑动，超过才滑屏
        if (this.touches.precent > 0.1) {
          offsetWidth = -window.innerWidth
          opacity = 0
          this.currentShow = 2
        } else {
          offsetWidth = 0
          opacity = 1
          this.currentShow = 1
        }
      } else if (this.currentShow === 2) {
        // 第二屏歌词
        if (this.touches.precent < 0.9) {
          offsetWidth = 0
          opacity = 1
          this.currentShow = 1
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
          this.currentShow = 2
        }
      }
      this.$refs.lyricScroll.$el.style[transitionDuration] = '300ms'
      this.$refs.middleL.style[transitionDuration] = '300ms'
      this.$refs.lyricScroll.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.middleL.style.opacity = opacity
    },
    back() {
      this.setFullScreen(false)
    },
    showPlayer() {
      this.setFullScreen(true)
    },
    enter(el, done) {
      const {x, y, scale} = this._getPosAndScale()
      const animation = {
        '0%': {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        '60%': {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        '100%': {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      }
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })

      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter() {
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = `all .4s`
      const {x, y, scale} = this._getPosAndScale()
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave() {
      this.$refs.cdWrapper.style[transform] = ''
      this.$refs.cdWrapper.style.transition = ''
    },
    _getPosAndScale() {
      // 此动画目的就是把大封面提前移到小封面的位置，enter后通过css3动画变化到原位置
      // 获取两个中心点位置和缩放
      // target为小播放器的中心点
      const targetLeft = 40
      const targetBottom = 30
      const targetWidth = 40

      // 大封面
      const paddingTop = 80
      const width = window.innerWidth * 0.8
      const scale = targetWidth / width
      // 运动距离x
      const x = -window.innerWidth / 2 + targetLeft
      // 运动距离Y
      const y = window.innerHeight - targetBottom - paddingTop - (width / 2)

      // 目的是要从小封面向大封面运动的距离
      return {
        x,
        y,
        scale
      }
    },
    getLyric() {
      this.currentSong.getLyric().then((res) => {
        this.currentlyric = new Lyric(res, this.handleLyric)
        if (this.playing) {
          this.currentlyric.play()
        }
      }).catch(() => {
        // 获取不到歌曲的时候，做清理操作
        this.currentlyric = null
        this.playingLyric = ''
        this.currentlyricIndex = 0
      })
    },
    handleLyric({lineNum, txt}) {
      this.currentlyricIndex = lineNum
      if (lineNum > 5) {
        // 歌词滚动大于5行的时候保持滚动条在中间不动
        let ele = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricScroll.scrollToElement(ele, 1000)
      } else {
        this.$refs.lyricScroll.scrollTo(0, 0, 1000)
      }
      this.playingLyric = txt
    },
    changeMode() {
      let mode = (this.mode + 1) % 3
      this.setMode(mode)
      let list = null
      if (this.mode === playMode.random) {
        list = shuffle(this.sequanceList)
      } else {
        list = this.sequanceList
      }
      // 如果直接更改playList的话，那currentSongIndex也会改，就切歌了，解决办法就是保持打乱的index==当前的currentIndex
      this._resetCurrentIndex(list)
      this.setPlayList(list)
    },
    _resetCurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    togglePlaying() {
      if (!this.songReady) {
        return
      }
      this.setPlayingState(!this.playing)

      if (this.currentlyric) {
        this.currentlyric.togglePlay()
      }
    },
    ended() {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    loop() {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      if (this.currentlyric) {
        this.currentlyric.seek(0)
      }
    },
    next() {
      if (!this.songReady) {
        return
      }
      // 如果歌曲列表只有一条的时候，就单曲循环播放
      if (this.playList.length === 1) {
        this.loop()
      } else {
        let index = this.currentIndex + 1
        if (index === this.playList.length) index = 0
        this.setCurrentIndex(index)
      }
      this.songReady = false
    },
    prev() {
      if (!this.songReady) {
        return
      }
      // 如果歌曲列表只有一条的时候，就单曲循环播放
      if (this.playList.length === 1) {
        this.loop()
      } else {
        let index = this.currentIndex - 1
        if (index === -1) index = this.playList.length - 1
        this.setCurrentIndex(index)
      }
      this.songReady = false
    },
    ready() {
      // 歌曲已准备好播放
      this.songReady = true
    },
    error() {
      // 当歌曲加载失败的时候也置为true，保证正常使用
      this.songReady = true
    },
    updateTime(e) {
      // audio实时更新的监听时间
      this.currentTime = e.target.currentTime
    },
    format(interval) {
      interval = interval | 0 // 相当于Math.floor(interval),按位或，0 | 1 = 1  1 | 1 = 1
      const minutes = interval / 60 | 0
      const seconds = interval % 60
      return `${minutes}:${this._pad(seconds)}`
    },
    _pad(time, n = 2) {
      // 补0
      let len = time.toString().length
      while (len < n) {
        time = '0' + time
        len++
      }
      return time
    },
    listenPrecent(precent) {
      // 监听进度条拖动或点击的百分比,重置currentTime
      this.currentTime = this.currentSong.duration * precent
      this.$refs.audio.currentTime = this.currentTime
      if (!this.playing) {
        this.togglePlaying()
      }
      if (this.currentlyric) {
        this.currentlyric.seek(this.currentTime * 1000)
      }
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setMode: 'SET_MODE',
      setPlayList: 'SET_PLAY_LIST'
    })
  }
}
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%
                box-sizing: border-box
                border: 10px solid rgba(255, 255, 255, 0.1)

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
