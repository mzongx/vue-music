<template>
  <div class="progress-circle">
    <svg :width="radius" :height="radius" version="1.1" viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg">
      <circle class="progress-background" cx="50" cy="50" r="50" fill="transparent"/>
      <circle class="progress-bar" cx="50" cy="50" r="50" fill="transparent" :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset"></circle>
      <!-- stroke-dasharray 为边框虚线，stroke-dashoffset 为偏移量，当两者相等值为圆周长的时候就是反向重合 -->
    </svg>
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    radius: {
      type: Number,
      default: 100
    },
    percent: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      dashArray: Math.PI * 2 * 50
    }
  },
  computed: {
    dashOffset() {
      return this.dashArray * (1 - this.percent)
    }
  },
  components: {

  }
}
</script>

<style scoped lang="stylus">
  @import '~common/stylus/variable'
  .progress-circle
    position relative
    circle
      stroke-width 8px
      transform-origin center
      &.progress-background
        stroke $color-theme-d
        transform scale(.9)
      &.progress-bar
        stroke $color-theme
        transform scale(.9) rotate(-90deg)
</style>
