<template>
  <div class="slide-wrapper" ref="slideWrapper">
    <div class="slide-list" ref="slideList">
      <slot></slot>
    </div>
    <div class="slide-dot" v-if="showDot">
      <span class="dot" :class="{'active': currentPageIndex === index}" v-for="(dot, index) in dots" :key="index"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Bscorll from 'better-scroll'
import { addClass } from '@/common/js/dom'
export default {
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    showDot: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },
  data() {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  mounted() {
    setTimeout(() => {
      // 浏览器的刷新机制一般是17ms
      this.init()
    }, 20)
    window.addEventListener('resize', () => {
      if (this.slideScorll) {
        this._initWidth(true)
        this.slideScorll.refresh()
      }
    })
  },
  methods: {
    init() {
      this._initWidth()
      if (this.showDot) {
        this._initDot()
      }
      this._initScorll()
      if (this.autoPlay) {
        this._play()
      }
    },
    _initWidth(isResize) {
      let slideWrapper = this.$refs.slideWrapper
      let clientWidth = slideWrapper.clientWidth
      let slideItem = this.$refs.slideList.children
      let slideWidth = 0
      for (let i = 0; i < slideItem.length; i++) {
        addClass(slideItem[i], 'slide-item')
        slideItem[i].style.width = clientWidth + 'px'
        slideWidth += slideItem[i].clientWidth
      }
      if (this.loop && !isResize) {
        // isResize防止窗口resize时再*2
        slideWidth += 2 * clientWidth
      }
      this.$refs.slideList.style.width = slideWidth + 'px'
    },
    _initScorll() {
      this.slideScorll = new Bscorll(this.$refs.slideWrapper, {
        click: true,
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop
        }
      })
      this.slideScorll.on('scrollEnd', this._onScrollEnd)
      this.slideScorll.on('beforeScrollStart', this._clearPlay)
    },
    _onScrollEnd() {
      let pageIndex = this.slideScorll.getCurrentPage().pageX
      this.currentPageIndex = pageIndex
      // 每次滑动结束就执行autoPlay
      if (this.autoPlay) {
        this._play()
      }
    },
    _initDot() {
      this.dots = new Array(this.$refs.slideList.children.length)
    },
    _play() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.slideScorll.next()
      }, this.interval)
    },
    _clearPlay() {
      clearTimeout(this.timer)
    }
  },
  components: {

  }
}
</script>

<style scoped lang="stylus">
  .slide-wrapper
    .slide-list
      overflow hidden
      position relative
      .slide-item
        float left
        box-sizing border-box
        overflow hidden
        text-align center
        a
          display block
          img
            width 100%
            display block
    .slide-dot
      position absolute
      left 0px
      right 0px
      bottom 10px
      text-align center
      font-size 0
      .dot
        display inline-block
        margin 0 4px
        width 8px
        height 8px
        border-radius: 50%
        background #ccc
        &.active
          width 20px
          border-radius 5px
          background #fff
</style>
