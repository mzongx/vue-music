<template>
  <div class="progress-bar" 
    ref="progressBar"
    @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper"
        ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend="progressTouchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { prefixStyle } from '@/common/js/dom'
const transform = prefixStyle('transform')
const progressBtnWidth = 16
export default {
  props: {
    precent: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {

    }
  },
  created() {
    // 保存各类touchs
    this.touchs = {}
  },
  mounted() {
    // console.log(this.precent)
  },
  computed: {
  },
  methods: {
    progressTouchStart(e) {
      this.touchs.x1 = e.touches[0].pageX
      this.touchs.left = this.$refs.progress.clientWidth
      this.touchs.isDraping = true // 用于拖动的时候，不去watch：precent
    },
    progressTouchMove(e) {
      if (!this.touchs.isDraping) return
      const width = this.$refs.progressBar.clientWidth - progressBtnWidth // 进度条宽度
      this.touchs.x2 = e.touches[0].pageX
      const detailX = this.touchs.x2 - this.touchs.x1 // 拖动距离
      this.touchs.betweenWidth = Math.min(Math.max(detailX + this.touchs.left, 0), width) // 判断左右区间值
      this._offset(this.touchs.betweenWidth)
    },
    progressTouchEnd() {
      this.touchs.isDraping = false
      // 通过进度条百分比算出当前播放时间，emit给player组件
      this._triggerPrecent()
    },
    progressClick(e) {
      // e.offsetX 不准确
      const rect = this.$refs.progressBar.getBoundingClientRect()
      const detailX = e.pageX - rect.left
      this._offset(detailX)
      this._triggerPrecent()
    },
    _offset(width) {
      // progress的按钮和进度
      this.$refs.progress.style.width = `${width}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${width}px,0,0)`
    },
    _triggerPrecent() {
      // 计算进度条百分比，emit给play组件
      const progressBarWidth = this.$refs.progressBar.clientWidth - progressBtnWidth // 进度条宽度
      const precentWidth = this.$refs.progress.clientWidth // 当前进度宽度
      const precentValue = precentWidth / progressBarWidth // 进度百分比
      this.$emit('precent', precentValue)
    }
  },
  watch: {
    precent(newPrecent) {
      // 不在拖动并且在播放的时候
      if (newPrecent >= 0 && !this.touchs.isDraping) {
        const width = this.$refs.progressBar.clientWidth - progressBtnWidth
        const progressWidth = width * this.precent
        this._offset(progressWidth)
      }
    }
  },
  components: {

  }
}
</script>

<style scoped lang="stylus">
  @import '~common/stylus/variable.styl'
  .progress-bar
    height 30px
    .bar-inner
      position relative
      height 4px
      background $color-background-d
      top 13px
      .progress
        position absolute
        height 100%
        background: $color-theme
      .progress-btn-wrapper
        position absolute
        left -8px
        top -13px
        width 30px
        height 30px
        .progress-btn
          position relative
          top 7px
          left 7px
          box-sizing border-box
          width 16px
          height 16px
          border 3px solid $color-text
          border-radius 50%
          background $color-theme
</style>
